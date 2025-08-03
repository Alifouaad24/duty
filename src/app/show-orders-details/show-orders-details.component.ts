import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { InfiniteScrollDirective, InfiniteScrollModule  } from 'ngx-infinite-scroll'; 
import { CommonModule } from '@angular/common';
import { ApiService } from '../Services/api.service';
import JsBarcode from 'jsbarcode';
import { HttpClient } from '@angular/common/http';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;
declare var $: any
@Component({
  selector: 'app-show-orders-details',
  standalone: true,
  templateUrl: './show-orders-details.component.html',
  styleUrls: ['./show-orders-details.component.scss'],
  imports: [InfiniteScrollModule  , RouterLink, RouterOutlet, CommonModule, FormsModule],
})
export class ShowOrdersDetailsComponent implements OnInit {

  constructor(private http: ApiService, private router: Router, private http1: HttpClient,
     private route: ActivatedRoute, private toastr: ToastrService,
     private httpClient: HttpClient) {}


 Items: any = []
  isLoading: boolean = false
  isFaild: boolean = false
  selectedProduct: any = null;
  PriceForSelling: number = 0
  ItemDescription: string = " "
  publishId: number = 0
  SellingPrice: number = 0
  canPublish: boolean = false
ngOnInit(): void {
  this.GetItems();
  this.GetAllPublishPlaces();

  const accessToken = localStorage.getItem('ebay_token')
  if (accessToken) {
    this.canPublish = true
  }
}


  GetAllPublishPlaces(){
    this.http.getData('api/PublishPlace').subscribe((res: any) => {
      console.log(res);
      const found = res.find((el: any) => el.description.includes("Ebay"));
      this.publishId = found ? found.publishPlaceId : 0;
      console.log("publishId: " + this.publishId)
    }, (error) => {
      console.error(error);
    });
  }

changePhoto(item: any, direction: number) {
  const images = item.item.itemImages;
  item.currentImageIndex = (item.currentImageIndex + direction + images.length) % images.length;
}

selectedProduct1: any;

onImageClick(product: any) {
  this.selectedProduct1 = product;
  ($('#downloadModal') as any).modal('show');
}

async downloadAll(): Promise<void> {
  if (!this.selectedProduct1 || !this.selectedProduct1.item) return;

  const images = this.selectedProduct1.item.itemImages || [];
  const upc = this.selectedProduct1.item.upc;
  const zip = new JSZip();
  const folder = zip.folder(upc);

  const seenSizes = new Set<number>();

  const downloadPromises = images.map(async (img: any, index: number) => {
    const proxiedUrl = `${this.http.baseUrl}api/Inventory/DownloadImage?url=${encodeURIComponent(img.imageLink)}`;

    try {
      const blob = await this.httpClient.get(proxiedUrl, { responseType: 'blob' }).toPromise();
      if (seenSizes.has(blob!.size)) return;
      seenSizes.add(blob!.size);
      const fileName = `${upc}_${index + 1}.jpg`;
      folder?.file(fileName, blob!);
    } catch (error) {
      console.warn(`فشل تحميل الصورة: ${img.imageLink}`, error);
    }
  });

  await Promise.all(downloadPromises);

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `Product_${upc}_Images.zip`);

  ($('#downloadModal') as any).modal('hide');
}





downloadSingle() {
  const imageUrl = this.selectedProduct1.item.itemImages[this.currentImageIndex]?.imageLink;
  const upc = this.selectedProduct1.item.upc;
  this.downloadImageViaServer(imageUrl, upc);
  ($('#downloadModal') as any).modal('hide');
}


GetItems() {
  this.isLoading = true;
  this.isFaild = false;
  this.http.getData('api/Inventory').subscribe(res => {
    console.log(res)
    this.Items = res.map((item: any) => ({
      ...item,
      currentImageIndex: 0
    }));

    this.isLoading = false;
  }, (error) => {
    this.isFaild = true;
    this.isLoading = false;
  });
}


 currentImageIndex: number = 0;
 showDetailsPubob: boolean = false

openPopup(product: any) {
  this.showDetailsPubob = true
  this.selectedProduct = product;
  this.currentImageIndex = 0; // Reset to first image when popup opens
  setTimeout(() => {
    this.generateBarcode(product!.item.upc)
  }, 400)
}

prevImage() {
  if (this.currentImageIndex > 0) {
    this.currentImageIndex--;
  }
}

nextImage() {
  if (this.selectedProduct && this.currentImageIndex < this.selectedProduct.item.itemImages.length - 1) {
    this.currentImageIndex++;
  }
}

closePopup() {
  this.showDetailsPubob = false
  this.selectedProduct = null;
}

generateBarcode(barcodeValue: string) {
    JsBarcode('#barcode', barcodeValue, {
      format: 'CODE128',
      lineColor: '#000',
      width: 2,
      height: 60,
      displayValue: true
    });
  }

downloadImageViaServer(imageUrl: string, upc: string) {
  const encodedUrl = encodeURIComponent(imageUrl);
  const apiUrl = `${this.http.baseUrl}api/Inventory/DownloadImage?url=${encodedUrl}`;

  this.httpClient.get(apiUrl, { responseType: 'blob' }).subscribe(blob => {
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${upc}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  });
}

facturyImg: string = '';
showModal: boolean = false;
loading: boolean = false;

GetFacturyPhoto(upc: string) {
  this.loading = true;
  this.showModal = true;

  this.http.getData(`api/HomeDepot/GetPhotoFromEbay/${upc}`).subscribe({
    next: (response: any) => {
      this.facturyImg = response.image;
      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
    }
  });
}

closeModal() {
  this.showModal = false;
  this.facturyImg = '';
}

DeleteItem(id: number){
Swal.fire({
  title: 'حذف',
  text: 'هل أنت متأكد من حذف المنتج؟',
  icon: 'error',
  showCancelButton: true,
  confirmButtonText: 'نعم',
  cancelButtonText: 'إلغاء'
}).then((result) => {
  if (result.isConfirmed) {
    this.http.deleteData(`api/Inventory/${id}`).subscribe(() => {
      Swal.fire('تم الحذف!', 'تم حذف المنتج بنجاح', 'success');
      this.GetItems(); 
    },(err) => {
      Swal.fire('خطأ', 'حدث خطأ أثناء حذف المنتج يرجى المحاولة مجددا', 'error');
    });
  }
});

}

copyToClipboard() {
  const model = this.selectedProduct.item.model || '';
  const engName = this.selectedProduct.item.engName || '';
  const makeDesc = this.selectedProduct.item.make?.makeDescription || '';

  const fullText = `${makeDesc} ${engName} ${model}`;

  navigator.clipboard.writeText(fullText).then(() => {
    this.toastr.success('تم النسخ إلى الحافظة!')
  }).catch(err => {
    console.error('فشل النسخ:', err);
  });
}

copyToClipboard2() {
  const model = this.selectedEbayProduct.item.model || '';
  const engName = this.selectedEbayProduct.item.engName || '';
  const makeDesc = this.selectedEbayProduct.item.make?.makeDescription || '';

  const fullText = `${makeDesc} ${engName} ${model}`;

  navigator.clipboard.writeText(fullText).then(() => {
    this.toastr.success('تم النسخ إلى الحافظة!')
  }).catch(err => {
    console.error('فشل النسخ:', err);
  });
}

  ShowEbayPopup: boolean = false;
  selectedEbayProduct: any = null;

  ShowEbayInfo(product: any) {
    this.selectedEbayProduct = product;
    this.ShowEbayPopup = true;
  }

  CloseEbayPopup() {
    this.ShowEbayPopup = false;
  }

   currentImageIndex1: number = 0;

prevImage1() {
  if (this.currentImageIndex1 > 0) {
    this.currentImageIndex1--;
  }
}

nextImage1() {
  if (this.selectedEbayProduct && this.currentImageIndex1 < this.selectedEbayProduct.item.itemImages.length - 1) {
    this.currentImageIndex1++;
  }
}


LogInToEbay() {
  const loginUrl = `${this.http.baseUrl}api/ebay/login`;
  window.location.href = loginUrl;
}

PublishByEbay(product: any) {
  const token = localStorage.getItem('ebay_token');
  if (!token) {
    this.toastr.error("يجب تسجيل الدخول إلى eBay أولاً");
    return;
  }

  const imageUrls: string[] = product.item.itemImages
    .filter((img: any) => img.imageLink && img.imageLink.trim() !== '')
    .map((img: any) => img.imageLink);

  const payload = {
    id: product.inventory_id,
    sku: product.item.sku,
    title: product.item.make?.makeDescription + ' ' + product.item.engName + ' ' + product.item.model,
    description: this.ItemDescription,
    brand: product.item.make?.makeDescription,
    quantity: product.qty,
    condition: product.itemCondetion.description,
    imageUrls: imageUrls,
    price: this.PriceForSelling,
    currency: "USD",
    itemId: product.item.id,
    platformId: product.item.platformId,
    publishPlaceId: this.publishId,
  };

  this.http.postData('api/Ebay/publish-full-product', payload).subscribe({
    next: () => {
      this.toastr.success('تم نشر المنتج بنجاح');
    },
    error: (err) => {
      this.toastr.error('حدث خطأ أثناء نشر المنتج الرجاء المحاولة مجددًا');
      console.error(err);
    }
  });
}


AddSellingPriceForItem(id: number, sellInput: HTMLInputElement, product: any) {
  const value = sellInput.value;
  this.http.putData(`api/Inventory/UpdatePrice/${id}`, {'sellingprice': value}).subscribe(res => {
    this.toastr.success('تم تحديث السعر بنجاح')
    sellInput.value = ""
    product.sellingprice = value

  },(error) => {
    this.toastr.error('حدث خطأ يرجى المحاولة مجددا')

  })
}

printData(product: any) {
  const content = `
    <html dir="rtl">
      <head>
        <title>طباعة</title>
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 10px;
            font-size: 16px;
            width: 58mm; /* الطابعة 2.4 إنش = 58 ملم */
          }
          h1, p {
            margin: 8px 0;
          }
          svg {
            margin-top: 10px;
            width: 100%;
          }
        </style>
      </head>
      <body>
        <h1>${product?.merchant?.merchantCode ?? ''}</h1>
        <svg id="barcode"></svg>
        <p>${product.item?.description ?? ''}</p>
        <p>${product.item?.model ?? ''}</p>
        <p>${product.item?.make?.makeDescription ?? ''}</p>
        <p>${product.item?.upc ?? ''}</p>


        <script>
          window.onload = function () {
            JsBarcode("#barcode", "${product.inventory_id}", {
              format: "CODE128",
              displayValue: true,
              fontSize: 16,
              height: 40
            });
            window.print();
          }
        <\/script>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank', 'width=600,height=800');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();
  } else {
    alert("يرجى السماح بالنوافذ المنبثقة");
  }
}


previewUrls: string[] = [];

onFileSelected(event: any, id: number): void {
  const files: FileList = event.target.files;
  this.previewUrls = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const formData = new FormData();
    formData.append('image', file);

    this.http1.post('http://saifsfo-002-site28.rtempurl.com/api/UploadImages', formData).subscribe({
      next: (res: any) => {
        const fileName = res.fileName;
        this.toastr.success('تم رفع الصورة بنجاح');

        const fullImageUrl = `http://saifsfo-002-site28.rtempurl.com/images/${fileName}`;

        this.previewUrls.push(fullImageUrl);

        this.selectedEbayProduct.item.itemImages.push({
          imageLink: fullImageUrl
        });

        this.http.postData('api/Inventory/AddImageForItem', {
           'imgUrl': fullImageUrl,
           'itemId': id,
          
          })
          .subscribe({
            next: () => {
              this.toastr.success('تم ربط الصورة بالمنتج بنجاح');

            },
            error: (err) => {
              this.toastr.error('فشل ربط الصورة بالمنتج');

            }
          });
      },
      error: (err) => {
        this.toastr.error('فشل رفع الصورة:');
      }
    });
  }
}

EditInventoryStatus(status: string, id: number) {
  let apiUrl = '';
  let toastMessage = '';
  let newStatus = '';

  switch (status) {
    case 'sold':
      apiUrl = `api/Inventory/SetInventorySold/${id}`;
      toastMessage = 'تم تعديل الحالة الى تم البيع بنجاح';
      newStatus = 'Sold';
      break;

    case 'auto':
      apiUrl = `api/Inventory/SetInventoryAutoPublished/${id}`;
      toastMessage = 'تم تعديل الحالة الى تم النشر بنجاح';
      newStatus = 'Auto Published';
      break;

    case 'handle':
      apiUrl = `api/Inventory/SetInventoryManualPublished/${id}`;
      toastMessage = 'تم تعديل الحالة الى تم النشر يدويا بنجاح';
      newStatus = 'Manual Published';
      break;

    default:
      return;
  }

  this.http.putData(apiUrl, {}).subscribe({
    next: () => {
      this.toastr.success(toastMessage);

      if (this.selectedEbayProduct?.item?.id === id) {
        this.selectedEbayProduct.status = newStatus;
      }
    },
    error: () => {
      this.toastr.error('فشل في تعديل الحالة');
    }
  });
}



}


