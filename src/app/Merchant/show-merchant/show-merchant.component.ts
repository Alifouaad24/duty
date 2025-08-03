import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-show-merchant',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, FormsModule],
  templateUrl: './show-merchant.component.html',
  styleUrl: './show-merchant.component.scss'
})
export class ShowMerchantComponent implements OnInit{
  
  constructor(private http: ApiService, private toastr: ToastrService) {}

  Merchants: any[] = []

  ngOnInit(): void {
    this.http.getData('api/MerchantAPI').subscribe(res => {
      this.Merchants = res
    })
  }
}
