import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { InfiniteScrollDirective, InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonModule, formatDate } from '@angular/common';
import { ApiService } from '../Services/api.service';
import JsBarcode from 'jsbarcode';
import { HttpClient } from '@angular/common/http';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../Services/storage.service';

declare var bootstrap: any;
declare var $: any
@Component({
  selector: 'app-show-orders-details',
  standalone: true,
  templateUrl: './show-orders-details.component.html',
  styleUrls: ['./show-orders-details.component.scss'],
  imports: [InfiniteScrollModule, RouterLink, RouterOutlet, CommonModule, FormsModule],
})
export class ShowOrdersDetailsComponent implements OnInit {

  constructor(private http: ApiService, private router: Router, private http1: HttpClient, private storage: StorageService,
    private route: ActivatedRoute, private toastr: ToastrService,
    private httpClient: HttpClient) { }


  Items: any = []
  isLoading: boolean = false
  isFaild: boolean = false
  selectedProduct: any = null;
  PriceForSelling: number = 0
  ItemDescription: string = " "
  publishId: number = 0
  SellingPrice: number = 0
  canPublish: boolean = false
  tokenId?: string
  PriceForSellingInFacebook: number = 0
  selectedFaceBookProduct: any
  ShowFaceBookPopup: boolean = false
  OriginalItems: any[] = [];
  CountOfItem?: number
  Categories: any = []
  isLoading1: boolean = false;

  ngOnInit(): void {
    this.GetItems();
    this.GetAllPublishPlaces();
    this.GetCategories()

    const accessToken = localStorage.getItem('tokenId');
    if (accessToken != null) {
      this.tokenId = accessToken;
      this.canPublish = true;
    }
  }

  showEditPopup = false;
  selectedProductForEdit: any = null;

  editData = {
    sku: '',
    upc: '',
    brand: '',
    quantity: 0,
    price: 0,
    listingId: '',
    inventory_id: 0
  };

  openEditPopup(product: any) {
    this.selectedProductForEdit = product;
    this.editData = {
      sku: product.item.sku,
      upc: product.item.upc,
      brand: product.item.make.makeDescription,
      quantity: product.qty,
      price: product.sellingprice,
      listingId: product.ebayListingId,
      inventory_id: product.inventory_id
    };
    this.showEditPopup = true;
  }

  closeEditPopup() {
    this.showEditPopup = false;
    this.selectedProductForEdit = null;
  }

  saveEdit() {
    if (!this.selectedProductForEdit || !this.selectedProductForEdit.inventory_id) {
      this.toastr.error('لا يوجد منتج محدد للتعديل');
      return;
    }

    this.isLoading1 = true;


    this.http.putData(
      `api/Inventory/EditSKUUPCBRANDInv/${this.selectedProductForEdit.inventory_id}`,
      this.editData
    ).subscribe({
      next: (response: any) => {
        this.selectedProductForEdit.item.sku = this.editData.sku;
        this.selectedProductForEdit.item.upc = this.editData.upc;
        this.selectedProductForEdit.item.make.makeDescription = this.editData.brand;
        this.selectedProductForEdit.qty = this.editData.quantity;
        this.selectedProductForEdit.sellingprice = this.editData.price
        this.selectedProductForEdit.ebayListingId = this.editData.listingId
        this.isLoading1 = false;

        this.toastr.success('تم التعديل بنجاح');
        this.closeEditPopup();
      },
      error: (err) => {
        this.isLoading1 = false;
        console.error('❌ خطأ أثناء التعديل:', err);
        this.toastr.error('حدث خطأ أثناء التعديل');
      }
    });
  }

  selectedCategoryId?: number;

  onCategoryChange(event: any, pro: any) {
    this.selectedCategoryId = event.target.value;
    pro.item.categoryId = event.target.value;
    this.isLoading1 = true;

    this.http.putData(`api/Inventory/editInventoryCategory/${pro.inventory_id}/${this.selectedCategoryId}`, {}).subscribe(() => {
      this.isLoading1 = false;

      Swal.fire('تم التعديل!', 'تم تعديل الفئة بنجاح', 'success');
      this.GetItems();
    }, (err) => {
      this.isLoading1 = false;
      this.selectedCategoryId = undefined
      Swal.fire('خطأ', 'حدث خطأ أثناء التعديل يرجى المحاولة مجددا', 'error');
    });

  }
  GetCategories(): void {
    this.http.getData("api/CategoriesAPI").subscribe((result) => {
      this.Categories = result;
      console.log(this.Categories)
      this.Categories = this.Categories.filter((category: any) => category.platform_id === null);
    });
  }

  FilterTable(event: any) {
    const val = event.target.value;

    switch (val) {
      case '1': {
        this.Items = [...this.OriginalItems];
        this.CountOfItem = this.Items.length
        break;
      }

      case '2': {
        this.Items = this.OriginalItems.filter((el: any) => el.status == null);
        this.CountOfItem = this.Items.length

        break;
      }

      case '3': {
        this.Items = this.OriginalItems.filter((el: any) => el.marketPlacestatus == null);
        this.CountOfItem = this.Items.length

        break;
      }
    }
  }



  GetAllPublishPlaces() {
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
      const proxiedUrl = `${this.http.baseUrl}api/Inventory/DownloadImage?url=${encodeURIComponent(img.imageSourceLink)}`;

      try {
        const blob = await this.httpClient.get(proxiedUrl, { responseType: 'blob' }).toPromise();
        if (seenSizes.has(blob!.size)) return;
        seenSizes.add(blob!.size);
        const fileName = `${upc}_${index + 1}.jpg`;
        folder?.file(fileName, blob!);
      } catch (error) {
        console.warn(`فشل تحميل الصورة: ${img.imageSourceLink}`, error);
      }
    });

    await Promise.all(downloadPromises);

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `Product_${upc}_Images.zip`);

    ($('#downloadModal') as any).modal('hide');
  }





  downloadSingle() {
    const imageUrl = this.selectedProduct1.item.itemImages[this.currentImageIndex]?.imageSourceLink;
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
      this.OriginalItems = res.map((item: any) => ({
        ...item,
        currentImageIndex: 0
      }));
      this.CountOfItem = this.Items.length
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

  GetEbayOffer(ebayListing: string | undefined) {
    if (ebayListing) {
      window.open(`https://www.ebay.com/itm/${ebayListing}`, '_blank');
    }
    else {
      window.alert("لم يتم نشر المنتج بعد ")
    }
  }

  closeModal() {
    this.showModal = false;
    this.facturyImg = '';
  }

  DeleteItem(id: number) {
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
        }, (err) => {
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
    this.selectedCategoryId = product.item.categoryId
    this.ShowEbayPopup = true;
  }

  ShowFaceBookInfo(product: any) {
    this.selectedFaceBookProduct = product;
    this.ShowFaceBookPopup = true;
  }

  CloseFaceBookPopup() {
    this.ShowFaceBookPopup = false;
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

  AddSellingPriceForItem(id: number, sellInput: HTMLInputElement, product: any) {
    const value = sellInput.value;
    this.isLoading1 = true;

    this.http.putData(`api/Inventory/UpdatePrice/${id}`, { 'sellingprice': value }).subscribe(res => {
      this.toastr.success('تم تحديث السعر بنجاح')
      sellInput.value = ""
      product.sellingprice = value
      this.isLoading1 = false;

    }, (error) => {
      this.isLoading1 = false;
      this.toastr.error('حدث خطأ يرجى المحاولة مجددا')

    })
  }

  AddSellingPriceForItemEbay(id: number, sellInput: HTMLInputElement, product: any) {
    const value = sellInput.value;
    this.isLoading1 = true;

    this.http.putData(`api/Inventory/UpdatePrice/${id}`, { 'sellingprice': value }).subscribe(res => {
      this.toastr.success('تم تحديث السعر بنجاح')
      sellInput.value = ""
      product.sellingprice = value
      this.isLoading1 = false;

    }, (error) => {
      this.isLoading1 = false;
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
    this.isLoading1 = true;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('image', file);

      this.http1.post('https://www.apxcloud.somee.com/api/UploadImages', formData).subscribe({
        next: (res: any) => {
          const fileName = res.fileName;
          this.toastr.success('تم رفع الصورة بنجاح');

          const fullImageUrl = `https://www.apxcloud.somee.com/images/${fileName}`;

          this.previewUrls.push(fullImageUrl);

          this.selectedEbayProduct.item.itemImages.push({
            imageSourceLink: fullImageUrl
          });

          this.http.postData('api/Inventory/AddImageForItem', {
            'imgUrl': fullImageUrl,
            'itemId': id,

          })
            .subscribe({
              next: () => {
                this.isLoading1 = false;
                this.toastr.success('تم ربط الصورة بالمنتج بنجاح');

              },
              error: (err) => {
                this.isLoading1 = false;
                this.toastr.error('فشل ربط الصورة بالمنتج');

              }
            });
        },
        error: (err) => {
          this.isLoading1 = false;
          this.toastr.error('فشل رفع الصورة:');
        }
      });
    }
  }

  EditInventoryStatus(status: string, id: number) {
    let apiUrl = '';
    let toastMessage = '';
    let newStatus = '';
    this.isLoading1 = true;

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
          this.isLoading1 = false;

        }
      },
      error: () => {
        this.isLoading1 = false;
        this.toastr.error('فشل في تعديل الحالة');
      }
    });
  }


  EditInventoryMarketStatus(status: string, id: number) {
    let apiUrl = '';
    let toastMessage = '';
    let newStatus = '';
    this.isLoading1 = true;

    switch (status) {
      case 'sold':
        apiUrl = `api/Inventory/SetInventorySoldForMarket/${id}`;
        toastMessage = 'تم تعديل الحالة الى تم البيع بنجاح';
        newStatus = 'Sold';
        break;

      case 'auto':
        apiUrl = `api/Inventory/SetInventoryAutoPublishedForMarket/${id}`;
        toastMessage = 'تم تعديل الحالة الى تم النشر بنجاح';
        newStatus = 'Auto Published';
        break;

      case 'handle':
        apiUrl = `api/Inventory/SetInventoryManualPublishedForMarket/${id}`;
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
          this.isLoading1 = false;

        }
      },
      error: () => {
        this.isLoading1 = false;

        this.toastr.error('فشل في تعديل الحالة');
      }
    });
  }

  ShowEbayItems() {
    if (this.tokenId != null) {
      this.http1.get(`https://dutyapi.somee.com/api/Ebay/my-account-info/${this.tokenId}`)
        .subscribe({
          next: (res) => {
            console.log(res);
          },
          error: (error) => {
            console.error('Error fetching eBay items:', error);
          }
        });
    } else {
      console.warn('No tokenId found');
    }
  }


  ShowEbayCategories() {

    if (this.tokenId != null) {
      this.http1.get(`https://dutyapi.somee.com/api/Ebay/categories/${this.tokenId}/${0}`).subscribe(res => {
        console.log(res)
      }, (error) => {
        console.log(error)
      })
    }

  }
  generateRemainNum(num: number): number {
    const remain = 12 - num;
    const min = Math.pow(10, remain - 1);
    const max = Math.pow(10, remain) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  generateUniqueSku(): string {
    return 'SKU-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  rePublishByEbay(product: any) {
    const token = this.storage.getWithExpiry('ebayToken') //localStorage.getItem('tokenId');
    if (!token) {
      this.toastr.error("يجب تسجيل الدخول إلى eBay أولاً");
      return;
    }
    this.isLoading1 = true;

    const imageUrls: string[] = product.item.itemImages
      .filter((img: any) => img.imageSourceLink && img.imageSourceLink.trim() !== '').slice(0, 7)
      .map((img: any) => img.imageSourceLink);

    const skuValue = product.item.sku && product.item.sku.trim() !== ''
      ? product.item.sku
      : this.generateUniqueSku();

    const titleValue = product.item.engName
      ? product.item.engName.substring(0, 80)
      : 'Untitled Item';

    const payload = {
      'sku': skuValue,
      'title': titleValue,
      'description': product.item?.arDesc ?? product.item.engName,
      'brand': product.item.make.makeDescription,
      'quantity': Number(product.qty),
      'condition': product.itemCondetion?.description ?? 'NEW',
      'imageUrls': imageUrls,
      'price': Number(product.sellingprice ?? product.item.sitePrice),
      'currency': "USD",
      'fulfillmentPolicyId': '373826822023',
      'paymentPolicyId': '373648989023',
      'returnPolicyId': '373648988023',
      'categoryId': (product.item?.category?.ebayCategoryId).toString(),
      'upc': product.item.upc,
      'ebayOfferID': product.ebayInvID

    };

    console.log(payload)

    this.http.postData(`api/Ebay/publish-product/${token}`, payload).subscribe({
      next: () => {
        this.toastr.success('تم نشر المنتج بنجاح');
        product.status = "Auto Published"
        this.isLoading1 = false;

      },
      error: (err) => {
        this.isLoading1 = false;

        this.toastr.error('حدث خطأ أثناء نشر المنتج الرجاء المحاولة مجددًا');
        console.error(err);
      }
    });

  }


  PublishByEbay(product: any) {
    if (product.ebayInvID == null || product.ebayInvID == '') {
      const token = this.storage.getWithExpiry('ebayToken') //localStorage.getItem('tokenId');
      if (!token) {
        this.toastr.error("يجب تسجيل الدخول إلى eBay أولاً");
        return;
      }
      this.isLoading1 = true;

      const imageUrls: string[] = product.item.itemImages
        .filter((img: any) => img.imageSourceLink && img.imageSourceLink.trim() !== '').slice(0, 7)
        .map((img: any) => img.imageSourceLink);

      const skuValue = product.item.sku && product.item.sku.trim() !== ''
        ? product.item.sku
        : this.generateUniqueSku();

      const titleValue = product.item.engName
        ? product.item.engName.substring(0, 80)
        : 'Untitled Item';

      const payload = {
        'sku': skuValue,
        'title': titleValue,
        'description': product.item?.arDesc ?? product.item.engName,
        'brand': product.item.make.makeDescription,
        'quantity': Number(product.qty),
        'condition': product.itemCondetion?.description ?? 'NEW',
        'imageUrls': imageUrls,
        'price': Number(product.sellingprice ?? product.item.sitePrice),
        'currency': "USD",
        'fulfillmentPolicyId': '373826822023',
        'paymentPolicyId': '373648989023',
        'returnPolicyId': '373648988023',
        'categoryId': (product.item?.category?.ebayCategoryId).toString(),
        'upc': product.item.upc,
        'ebayOfferID': product.ebayInvID

      };

      console.log(payload)

      this.http.postData(`api/Ebay/publish-product/${token}`, payload).subscribe({
        next: () => {
          this.toastr.success('تم نشر المنتج بنجاح');
          product.status = "Auto Published"
          this.isLoading1 = false;

        },
        error: (err) => {
          this.isLoading1 = false;

          this.toastr.error('حدث خطأ أثناء نشر المنتج الرجاء المحاولة مجددًا');
          console.error(err);
        }
      });
    } else {
      this.updateProductOnEbay(product)
    }

  }

  updateProductOnEbay(product: any) {
    const token = this.storage.getWithExpiry('ebayToken') //localStorage.getItem('tokenId');
    if (!token) {
      this.toastr.error("يجب تسجيل الدخول إلى eBay أولاً");
      return;
    }
    this.isLoading1 = true;

    const imageUrls: string[] = product.item.itemImages
      .filter((img: any) => img.imageSourceLink && img.imageSourceLink.trim() !== '').slice(0, 7)
      .map((img: any) => img.imageSourceLink);

    const skuValue = product.item.sku && product.item.sku.trim() !== ''
      ? product.item.sku
      : this.generateUniqueSku();

    const titleValue = product.item.engName
      ? product.item.engName.substring(0, 80)
      : 'Untitled Item';

    const payload = {
      'sku': skuValue,
      'title': titleValue,
      'description': product.item?.arDesc ?? product.item.engName,
      'brand': product.item.make.makeDescription,
      'quantity': Number(product.qty),
      'condition': product.itemCondetion?.description ?? 'NEW',
      'imageUrls': imageUrls,
      'price': Number(product.sellingprice ?? product.item.sitePrice),
      'currency': "USD",
      'fulfillmentPolicyId': '373826822023',
      'paymentPolicyId': '373648989023',
      'returnPolicyId': '373648988023',
      'categoryId': (product.item?.category?.ebayCategoryId).toString(),
      'upc': product.item.upc,
      'ebayOfferID': product.ebayOfferID
    };

    console.log(payload)

    this.http.putData(`api/Ebay/update-product/${token}`, payload).subscribe({
      next: () => {
        this.isLoading1 = false;

        this.toastr.info('تم تعديل المنتج بنجاح');
      },
      error: (err) => {
        this.isLoading1 = false;

        this.toastr.error('حدث خطأ أثناء تعديل المنتج الرجاء المحاولة مجددًا');
        console.error(err);
      }
    });
  }

  FilterItems(skuValue: string) {
    const term = skuValue.trim().toLowerCase();

    if (!term) {
      this.Items = this.OriginalItems;
      return;
    }

    this.Items = this.Items.filter((p: any) =>
      p.item.sku?.toLowerCase().includes(term)
    );
  }

  LogInToEbayDiredty(token: string) {
    this.http.postData('api/Ebay/save-token', {
      'accessToken': token
    }).subscribe(res => {
      this.storage.setItem('ebayToken', res.tokenId, 2 * 60 * 60 * 1000) // localStorage.setItem('tokenId', res.tokenId);
      this.toastr.success('تم تخزين المعرف بنجاح')
    }, (err) => {
      this.toastr.error('فشل تخزين المعرف حاول مجددا')
    })
  }

  AddNewImagesForItem(event: any, invId: number) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('imgs', files[i]);
    }

    this.isLoading1 = true;

    this.http.putData(`api/Inventory/AddMorePhotosForExistItem/${invId}`, formData)
      .subscribe({
        next: (res: any) => {

          let newUrls: string[] = [];

          if (Array.isArray(res)) newUrls = res;
          else if (Array.isArray(res.images)) newUrls = res.images;
          else if (Array.isArray(res.data)) newUrls = res.data;
          else {
            const possible = Object.values(res).find(v => Array.isArray(v));
            if (Array.isArray(possible)) newUrls = possible as string[];
          }

          newUrls = newUrls.filter(u => typeof u === 'string' && u.trim() !== '');

          const productIndex = this.Items.findIndex((p: any) => p.inventory_id === invId);
          if (productIndex === -1) {
            this.toastr.success("تم رفع الصور.");
            this.isLoading1 = false;
            return;
          }

          const product = this.Items[productIndex];

          const oldUrls: string[] =
            (product.item?.itemImages || [])
              .map((img: any) => img.imageSourceLink)
              .filter((u: any) => typeof u === 'string' && u.trim() !== '');

          const finalList: string[] = [
            ...newUrls,
            ...oldUrls
          ];

          const mapped = finalList.map(url => ({ imageSourceLink: url }));

          product.item.itemImages = mapped;

          if (this.selectedProduct && this.selectedProduct.inventory_id === invId) {
            this.selectedProduct.item.itemImages = mapped;
          }

          if (this.selectedEbayProduct && this.selectedEbayProduct.inventory_id === invId) {
            this.selectedEbayProduct.item.itemImages = mapped;
          }

          this.toastr.success(`تمت إضافة${newUrls.length} صورة `);
          this.Items[productIndex] = { ...product };

          this.isLoading1 = false;
        },

        error: (err) => {
          console.error(err);
          this.toastr.error("فشل رفع الصور");
          this.isLoading1 = false;
        }
      });
  }







}


