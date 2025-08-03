import { AfterContentInit, AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { Product } from '../Models/Product';
import { Offer } from '../Models/Offer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-iherb',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './iherb.component.html',
  styleUrl: './iherb.component.scss'
})
export class IHerbComponent implements AfterViewInit {
  
  @ViewChild('myInput') myInputElement!: ElementRef;

  ngAfterViewInit(): void {
    this.myInputElement.nativeElement.focus();
  }

  constructor(private api: ApiService) {}
  code?: string
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
    currency?: string
    ///////////////////////////////////////
    title?: string
    brand?: string
    image: string = ""
    images?: []
    index: number = 0
    currentIndex = 0
    product?: any
    isLoadingForImg: boolean = false
    name?: string

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

  GetItemInfo(code: string | undefined){
    this.showError = false

    this.api.getData(`api/IHerb/images/${code}`).subscribe(res =>{
      this.product = res
      this.images = res.images
      this.brand = res.brand
      this.price = res.price
      this.currency = res.currency
      this.title = res.name
      this.showHome = true
    },(error) => {
      this.showHome = false
      this.showError = true
    })
  }
}
