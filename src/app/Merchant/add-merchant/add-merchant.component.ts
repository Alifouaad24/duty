import { Component } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-merchant',
  standalone: true,
  imports: [RouterLink, RouterOutlet, FormsModule, CommonModule],
  templateUrl: './add-merchant.component.html',
  styleUrl: './add-merchant.component.scss'
})
export class AddMerchantComponent {

  constructor(private http: ApiService, private toastr: ToastrService, private router: Router) {}

  merchantName?: string
  merchantCode?: string

  AddMerchant(){
    this.http.postData('api/MerchantAPI',{
      'merchantName': this.merchantName,
      'merchantCode': this.merchantCode
    }).subscribe(res => {
      this.toastr.success('تم اضافة التاجر بنجاح')
      this.router.navigate(['/Merchants'])
    },(error => {
      this.toastr.error('حدث خطأ ما. يرجى المحاولة مجددا')
    }))
  }
}
