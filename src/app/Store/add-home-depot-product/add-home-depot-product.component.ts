import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../Models/Product';
import { Offer } from '../../Models/Offer';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-home-depot-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-home-depot-product.component.html',
  styleUrl: './add-home-depot-product.component.scss'
})
export class AddHomeDepotProductComponent implements OnInit {
  @ViewChild('upcInput') upcInput!: ElementRef;

  ngAfterViewInit() {
    setTimeout(() => {
      this.upcInput.nativeElement.focus();
    }, 0);
  }
  upc?: string
  imgUrl: string[] = []
  price?: number
  isLoading: boolean = false
  model?: string
  Brand?: string
  storeSku?: string
  internet?: string
  Notes?: string
  CondId?: number
  platformId?: number
  SysyemId?: number
  CategoryId?: number
  allCondetions: any = []
  Categories: any = []
  Systems: any = []
  Platforms: any = []
  CondetionId?: number
  showPublic: boolean = false
  showHome: boolean = false
  showError: boolean = false
  showNoImages: boolean = false
  Qty: number = 1
  ///////////////////////////////////////
  UPCPublic: string = ''
  title?: string
  description?: string
  description2?: string
  brand?: string
  image: string = ""
  modelPublic?: string
  color?: string
  category?: string
  lowest_recorded_price?: number
  highest_recorded_price?: number
  images?: []
  source?: string
  quntiuty?: number
  isLoadingPublic: boolean = false
  showErrorForMe: boolean = false
  products: Product[] = []
  Images: string[] = []
  Offers: Offer[] = []
  index: number = 0
  MerchantId?: number
  Merchants?: any
  length?: String
  height?: String
  width?: String
  lowesOrHomeDepotFile?: File
  myEbayToken?: string
  /////////////////////////////////////////
  constructor(private http: ApiService, private http1: HttpClient, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.showHome = false
    this.myEbayToken = localStorage.getItem('tokenId') ?? '';

    this.GetAllConditions()
    this.GetCategories()
    this.GetAllSystems()
    this.GetAllPlatforms()
    this.GetAllMerchants()
  }

  GetAllMerchants() {
    this.http.getData("api/MerchantAPI").subscribe((result) => {
      this.Merchants = result;
      let merchant = localStorage.getItem('merchant')
      if (merchant && parseInt(merchant) > 0) {
        this.MerchantId = parseInt(merchant)
      }
    });
  }

  GetAllSystems() {
    this.http.getData("api/System").subscribe((result) => {
      this.Systems = result;
    });
  }

  GetAllPlatforms() {
    this.http.getData("api/Platforms").subscribe((result) => {
      this.Platforms = result;
    });
  }

  GetPriceAndPhoto(upc: string | undefined): void {
    console.log(upc);
    this.showErrorForMe = false;

    if (!upc || upc.trim() === "") {
      this.showHome = true;
      this.showError = false;
      this.image = "";
      this.imgUrl = [];
      return;
    }


    this.showError = false;
    this.isLoading = true;
    this.showNoImages = false

    if (this.selectedSource === 'milwaki') {
      this.http.postData(`api/HomeDepot/Bymilwaukeetool/${upc}`, null).subscribe(
        (response: any) => {
          this.isLoading = false;
          console.log(response)

          if (response != null) {
            this.imgUrl = response.images || [];
            this.image = this.imgUrl.length > 0 ? this.imgUrl[0] : "";
            this.price = response.price;
            this.Brand = response.brand;
            this.model = response.model;
            this.storeSku = response.sku;
            this.internet = response.internet;
            this.source = response.source;
            this.quntiuty = response.qty;
            this.title = response.title;
            this.description2 = response.desc;
            this.height = response.height
            this.width = response.wedth
            this.length = response.length
            if (response.upc && response.upc.includes("Does not Apply") && upc.length === 12 && /^\d+$/.test(upc)) {
              this.upc = upc
            } else {
              this.upc = response.upc
            }


            if (this.imgUrl.length == 0) {
              this.showNoImages = true
            }

            const matchedPlatform = this.Platforms.find((el: any) => el.desciption?.includes(this.source));
            if (matchedPlatform) {
              this.platformId = matchedPlatform.platform_id;
            }

            this.showHome = true;
            this.showError = false;
          } else {
            this.showErrorForMe = true;
          }
        },
        (error) => {
          this.isLoading = false;
          this.showError = true;
          this.showHome = false;
        }
      );

    } else if (this.selectedSource === 'build') {
      this.http.postData(`api/HomeDepot/${upc}`, null).subscribe(
        (response: any) => {
          this.isLoading = false;

          if (response != null) {
            this.imgUrl = response.images || [];
            this.image = this.imgUrl.length > 0 ? this.imgUrl[0] : "";
            this.price = response.price;
            this.Brand = response.brand;
            this.model = response.model;
            this.storeSku = response.sku;
            this.quntiuty = response.qty;
            this.internet = response.internet;
            this.source = response.source;
            this.title = response.title;
            this.description2 = response.desc;
            if (response.upc.includes("Does not Apply") && upc.length === 12 && /^\d+$/.test(upc)) {
              this.upc = upc
            } else {
              this.upc = response.upc
            }
            if (this.imgUrl.length == 0) {
              this.showNoImages = true
            }

            const matchedPlatform = this.Platforms.find((el: any) => el.desciption?.includes(this.source));
            if (matchedPlatform) {
              this.platformId = matchedPlatform.platform_id;
            }

            this.showHome = true;
            this.showError = false;
          } else {
            this.showErrorForMe = true;
          }
        },
        (error) => {
          this.isLoading = false;
          this.showError = true;
          this.showHome = false;
        }
      );
    } else if (this.selectedSource === 'Ryobi') {
      this.http.postData(`api/HomeDepot/ByRyobiTools/${upc}`, null).subscribe(
        (response: any) => {
          this.isLoading = false;
          console.log(response)
          if (response != null) {
            this.imgUrl = response.images || [];
            this.image = this.imgUrl.length > 0 ? this.imgUrl[0] : "";
            this.price = response.price;
            this.Brand = response.brand;
            this.model = response.model;
            this.storeSku = response.sku;
            this.quntiuty = response.qty;
            this.internet = response.internet;
            this.source = response.source;
            this.title = response.title;
            this.description2 = response.desc;
            if (response.upc.includes("Does not Apply") && upc.length === 12 && /^\d+$/.test(upc)) {
              this.upc = upc
            } else {
              this.upc = response.upc
            }
            if (this.imgUrl.length == 0) {
              this.showNoImages = true
            }

            const matchedPlatform = this.Platforms.find((el: any) => el.desciption?.includes(this.source));
            if (matchedPlatform) {
              this.platformId = matchedPlatform.platform_id;
            }

            this.showHome = true;
            this.showError = false;
          } else {
            this.showErrorForMe = true;
          }
        },
        (error) => {
          this.isLoading = false;
          this.showError = true;
          this.showHome = false;
        }
      );
    }
  }


  currentIndex = 0
  isLoadingForImg: boolean = false

  ChangePhoto(i: number) {
    this.isLoadingForImg = true;

    this.currentIndex += i;
    if (this.currentIndex >= this.imgUrl.length) {
      this.currentIndex = 0;
    } else if (this.currentIndex < 0) {
      this.currentIndex = this.imgUrl.length - 1;
    }

    this.index = this.currentIndex;
    this.image = this.imgUrl[this.index];
    this.isLoadingForImg = false;
  }


  onSearchChange(value: string) {

    if (value == "Home") {
      this.showPublic = false
      this.showHome = true
    }
    else if (value == "Public") {
      this.showPublic = true
      this.showHome = false
    }
  }


  GetAllConditions(): void {
    this.http.getData('api/ItemCondetions').subscribe((result: any) => {
      this.allCondetions = result
    })
  }

  GetCategories(): void {
    this.http.getData("api/CategoriesAPI").subscribe((result) => {
      this.Categories = result;
      this.Categories = this.Categories.filter((category: any) => category.platform_id === null);
    });
  }


  onCategoryChange(event: any): void {
    this.CategoryId = parseInt(event.target!.value!);
  }

  onplatformChange(event: any): void {
    this.platformId = parseInt(event.target!.value!);
  }

  onCondetionChange(event: any): void {
    this.CondetionId = parseInt(event.target!.value!);
  }

  onMerchantChange(event: any): void {
    this.MerchantId = parseInt(event.target!.value!);
  }


  onSystemChange(event: any): void {
    this.SysyemId = parseInt(event.target!.value!);
  }

  SaveItemInDB(): void {

    var payLoad = {
      "brand": this.Brand,
      "sku": this.storeSku,
      "model": this.model,
      "price": this.price,
      "imgUrl": this.imgUrl[0],
      "allImages": this.imgUrl,
      "internet": this.internet,
      "notes": this.Notes,
      "categoryId": this.CategoryId,
      "itemCondetionId": this.CondetionId,
      "engName": this.title,
      "platformId": this.platformId,
      "uPC": this.upc ?? "Does not apply",
      "merchantId": this.MerchantId,
      "qty": this.Qty,
      "height": this.height,
      "width": this.width,
      "length": this.length,
      "desc": this.description2

    }

    localStorage.setItem('merchant', this.MerchantId?.toString() || '0')

    this.http.postData(`api/HomeDepot`, payLoad).subscribe(res => {
      console.log(res)
      this.toastr.success('تم حفظ المنتج بنجاح')
      window.location.reload
    }, (er) => {
      this.toastr.error('حدث خطأ اثناء ادخال المنتج يرجى المحاولة مجددا')

    })

  }


  // SearchAboutUPC(upc: string): void {
  //   if (!upc) {
  //     this.toastr.error('الرجاء إدخال UPC صالح');
  //     return;
  //   }

  //   this.isLoadingPublic = true;

  //   this.http.getData(`api/HomeDepot/lookup?upc=${upc}`).subscribe({
  //     next: (Response: any) => {
  //       if (!Response.items || !Array.isArray(Response.items) || Response.items.length === 0) {
  //         this.toastr.warning('لم يتم العثور على منتجات لهذا UPC');
  //         this.isLoadingPublic = false;
  //         return;
  //       }
  //       this.products = Response.items.map((el: any) => Product.fromJson(el));
  //       if (this.products.length > 0) {
  //         const firstProduct = this.products[0];

  //         this.brand = firstProduct.brand;
  //         this.category = firstProduct.category;
  //         this.lowest_recorded_price = firstProduct.lowest_recorded_price;
  //         this.highest_recorded_price = firstProduct.highest_recorded_price;
  //         this.color = firstProduct.color;
  //         this.modelPublic = firstProduct.model;
  //         this.description = firstProduct.description;
  //         this.title = firstProduct.title;
  //         this.Images = firstProduct.images || [];
  //         this.Offers = firstProduct.offers;
  //       }

  //       this.isLoadingPublic = false;
  //     },
  //     error: (error) => {
  //       this.isLoadingPublic = false;
  //       this.toastr.error('حدث خطأ أثناء البحث عن المنتج');
  //       console.error('Error fetching product data:', error);
  //     }
  //   });
  // }


  onFileSelected(event: any) {
    console.log(this.imgUrl)
    const files: FileList = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('image', file);

      this.http1.post('https://www.apxcloud.somee.com/api/UploadImages', formData).subscribe({
        next: (res: any) => {
          const fileName = res.fileName;
          const fullImageUrl = `https://www.apxcloud.somee.com/images/${fileName}`;
          this.imgUrl.push(fullImageUrl);
          console.log(this.imgUrl)
          console.log(fullImageUrl)
          this.image = fullImageUrl

          this.toastr.success('تم رفع الصورة بنجاح');
        },
        error: (err) => {
          this.toastr.error('فشل رفع الصورة:');
        }
      });
    }
  }

  selectedSource: string = 'homeDepot';

  onSourceChange(source: string) {
    console.log("Selected source:", source);
  }

  GetPriceAndPhotoForLowes() {
    if (this.lowesOrHomeDepotFile) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('file', this.lowesOrHomeDepotFile);
      if (this.selectedSource == 'lowes') {
        this.http.postData(`api/HomeDepot/ParseLowesHtml`, formData).subscribe(
          (response: any) => {
            this.isLoading = false;
            console.log(response)

            if (response != null) {
              this.imgUrl = response.images || [];
              this.image = this.imgUrl.length > 0 ? this.imgUrl[0] : "";
              this.price = response.price;
              this.Brand = response.brand;
              this.model = response.model;
              this.storeSku = response.sku;
              this.internet = response.internet;
              this.source = response.source;
              this.title = response.title;
              this.description2 = response.desc;
              this.height = response.height
              this.width = response.wedth
              this.length = response.length

              if (this.imgUrl.length == 0) {
                this.showNoImages = true
              }

              const matchedPlatform = this.Platforms.find((el: any) => el.desciption?.includes(this.source));
              if (matchedPlatform) {
                this.platformId = matchedPlatform.platform_id;
              }

              this.showHome = true;
              this.showError = false;
            } else {
              this.showErrorForMe = true;
            }
          },
          (error) => {
            this.isLoading = false;
            this.showError = true;
            this.showHome = false;
          }
        );
      } else if (this.selectedSource == 'homeDepot') {
        this.http.postData(`api/HomeDepot/HomeDepotFileHtmlAnalyse`, formData).subscribe(
          (response: any) => {
            this.isLoading = false;
            console.log(response)

            if (response != null) {
              this.imgUrl = response.images || [];
              this.image = this.imgUrl.length > 0 ? this.imgUrl[0] : "";
              this.price = response.price;
              this.Brand = response.brand;
              this.model = response.model;
              this.storeSku = response.sku;
              this.internet = response.internet;
              this.source = response.source;
              this.title = response.title;
              this.description2 = response.desc;
              this.height = response.height
              this.width = response.wedth
              this.length = response.length

              if (this.imgUrl.length == 0) {
                this.showNoImages = true
              }

              const matchedPlatform = this.Platforms.find((el: any) => el.desciption?.includes(this.source));
              if (matchedPlatform) {
                this.platformId = matchedPlatform.platform_id;
              }

              this.showHome = true;
              this.showError = false;
            } else {
              this.showErrorForMe = true;
            }
          },
          (error) => {
            this.isLoading = false;
            this.showError = true;
            this.showHome = false;
          }
        );
      }

    } else {
      window.alert("يرجى اختيار ملف لاستخراج المعلومات")
    }

  }

  onFile2Selected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.lowesOrHomeDepotFile = files[0];
    }
  }

  ebaySuggetion?: any
  ebayCategory?: string

  GetSuggetion() {
    if (this.myEbayToken != null) {
      this.http.getData(`api/Ebay/search-ebay-product/${this.myEbayToken}/${this.upc}`).subscribe(Response => {
        console.log(Response)
        this.ebaySuggetion = Response
        if (this.ebaySuggetion)
          this.price = Number.parseFloat(this.ebaySuggetion.price);
        this.ebayCategory = this.ebaySuggetion.categoryId
      })
    } else {
      this.toastr.info('please login to ebay')
    }
  }

}
