import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../Auth/role.service';
import { ToastrService, ToastNoAnimation } from 'ngx-toastr';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [RouterLink, RouterOutlet, FormsModule, CommonModule ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent implements OnInit {

  constructor(private router: Router, private api: ApiService,
     private roleService: RoleService, private http: ApiService,
      private toastr: ToastrService) {}
  ngOnInit(): void {
    history.pushState(null, '', location.href);
    window.onpopstate = () => {
      history.pushState(null, '', location.href);
    };
  }

  showPassword: boolean = false;
  email: string = '';
  password: string = '';
  errorMessage: string = '';


  togglePassword() {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    this.showPassword = !this.showPassword;
    passwordInput.type = this.showPassword ? 'text' : 'password';
  }

  onSubmit() {

    var payLoad = {
      'email': this.email,
      'password': this.password
    }

    this.http.postData('api/Account/LogIn', payLoad).subscribe((response) => {
      localStorage.setItem('token', response.token)
      console.log(response)
      this.toastr.success("اهلا بكم في موقع عين الفهد", "تم تسجيل الدخول بنجاح",
        { progressAnimation: 'increasing',
          progressBar: true

         })
      this.router.navigate(['/LangingPage/MainScreenForMain']);
    },(error) =>{
            console.log(error.error)

      this.toastr.error("يرجى التحقق من البريد الإلكتروني او كلمة المرو", "فشل تسجيل الدخول",
        { 
          progressBar: true,
          timeOut: 2000

         })  
    })

    // if (this.email === 'Saif@saif.com' && this.password === '123456' ||
    //   this.email === 'Tara@AinAlfahd.com' && this.password === '123456' ||
    //   this.email === 'Karrar@AinAlfahd.com' && this.password === '123456' ||
    //    this.email === 'yousif@ainalfahad.com' && this.password === 'Yousif@2025')  {
    //   this.roleService.login(this.email);
    //   this.toastr.success("اهلا بكم في موقع عين الفهد", "تم تسجيل الدخول بنجاح",
    //     { progressAnimation: 'increasing',
    //       progressBar: true

    //      })
    //   this.router.navigate(['/LangingPage/MainScreenForMain']);

    // } else {
    //   this.toastr.error("يرجى التحقق من البريد الإلكتروني او كلمة المرو", "فشل تسجيل الدخول",
    //     { 
    //       progressBar: true,
    //       timeOut: 2000
    //     })
    // }
  }
}
