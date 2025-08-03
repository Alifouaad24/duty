import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import JsBarcode from 'jsbarcode';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tom-supply-items',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet, RouterModule],
  templateUrl: './tom-supply-items.component.html',
  styleUrl: './tom-supply-items.component.scss'
})
export class TomSupplyItemsComponent implements OnInit {


  constructor(private http: ApiService){}

  Items: any = []
  isLoading: boolean = false
  isFaild: boolean = false
  selectedProduct: any = null;

  ngOnInit(): void {
    this.GetItems()
  }

changePhoto(item: any, direction: number) {
  const images = item.item.itemImages;
  item.currentImageIndex = (item.currentImageIndex + direction + images.length) % images.length;
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

openPopup(product: any) {
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

downloadImageViaServer(imageUrl: string) {
  console.log(imageUrl)
  const encodedUrl = encodeURIComponent(imageUrl);
  const apiUrl = `${this.http.baseUrl}api/Inventory/DownloadImage?url=${encodedUrl}`;
  const link = document.createElement('a');
  link.href = apiUrl;
  link.download = 'downloaded-image.jpg';
  link.click();
}

}
