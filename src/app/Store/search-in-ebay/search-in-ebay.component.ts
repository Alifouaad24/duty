import { Component } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../Services/storage.service';

interface Product {
  itemId: string;
  title: string;
  imageUrl: string;
  price: string;
  currency: string;
  itemWebUrl: string;
  sellerUsername: string;
  condition?: string;
  buyingOptions?: string[];
}

@Component({
  selector: 'app-search-in-ebay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-in-ebay.component.html',
  styleUrl: './search-in-ebay.component.scss'
})
export class SearchInEbayComponent {
  constructor(private http: ApiService, private router: Router, private http1: HttpClient, private storage: StorageService,
    private route: ActivatedRoute, private toastr: ToastrService,
    private httpClient: HttpClient) { }
  products: Product[] = [];
  loading = false;
  byImg = true;
  textForSearch?: string;
  getItemsByImage(event: any) {
    this.loading = true
    const token = this.storage.getWithExpiry('ebayToken') //localStorage.getItem('tokenId');
    if (!token) {
      console.error('Token not found');
      return;
    }

    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append('imageFile', file);

    this.http.postData(`api/Ebay/SearchByImage/${token}`, formData).subscribe({
      next: (res) => {
        this.products = res || [];
        console.log('Products:', this.products);
        this.loading = false

      },
      error: (err) => {
        console.error('Error fetching items:', err);
        this.loading = false
        this.toastr.error('حدث خطأ أثناء جلب العناصر، تأكد من صلاحية التوكن وحاول مجددًا');

      }
    });
  }

  getItemsByText() {
    this.loading = true
    const token = this.storage.getWithExpiry('ebayToken') //localStorage.getItem('tokenId');
    if (!token) {
      console.error('Token not found');
      return;
    }

    this.http.postData(`api/Ebay/SearchByText/${token}`, {
      searchText: this.textForSearch
    }).subscribe({
      next: (res) => {
        this.products = res || [];
        console.log('Products:', this.products);
        this.loading = false

      },
      error: (err) => {
        console.error('Error fetching items:', err);
        this.loading = false
        this.toastr.error('حدث خطأ أثناء جلب العناصر، تأكد من صلاحية التوكن وحاول مجددًا');
      }
    });
  }

  ChangeView(event: any) {
    this.byImg = event.target.value === 'Image' ? true : false;
  }

  LogInToEbayDiredty(tokenInput: HTMLInputElement) {
    const token = tokenInput.value;
    if (!token.trim()) {
      this.toastr.warning('الرجاء إدخال التوكن');
      return;
    }

    this.http.postData('api/Ebay/save-token', { accessToken: token })
      .subscribe({
        next: (res) => {
          //localStorage.setItem('tokenId', res.tokenId);
          this.storage.setItem('ebayToken', res.tokenId, 2 * 60 * 60 * 1000); 
          this.toastr.success('تم تخزين المعرف بنجاح');
          tokenInput.value = '';
        },
        error: () => {
          this.toastr.error('فشل تخزين المعرف، حاول مجددًا');
        }
      });
  }



}
