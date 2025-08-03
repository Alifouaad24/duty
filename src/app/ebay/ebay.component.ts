import { Component } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ebay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ebay.component.html',
  styleUrl: './ebay.component.scss'
})
export class EbayComponent {
  isLoadingForImg: boolean = false;
  currentIndex: number = 0;
  imgUrl: any;
  index: number = 0;
  image: any;
  showError: boolean = false;
  product: any;
  brand: any;
  price: any;
  currency: any;
  title: any;
  showHome: boolean = false;
  code: string | undefined
  isLoading: boolean = false

constructor(private api :ApiService) {}

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

  GetItemInfo(query: string | undefined){
    this.showError = false
    this.isLoading = true

    this.api.getData(`api/search/search/${query}`).subscribe(res =>{
      this.product = res
      // this.image = res.images
      // this.brand = res.brand
      // this.price = res.price
      // this.currency = res.currency
      // this.title = res.name
      this.showHome = true
      this.isLoading = false

    },(error) => {
      this.isLoading = false
      this.showHome = false
      this.showError = true
    })
  }
}
