import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from './Services/api.service';
import { DecodeTokenService } from './Services/decode-token.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoutesService } from './Services/routes.service';
import { NotFoundComponent } from './not-found/not-found.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet , HttpClientModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
   title = 'Ain AlFahd Company';
  http = inject(ApiService);
  router = inject(Router);
  systemService = inject(RoutesService);
  route = inject(ActivatedRoute)
  decodeToken = inject(DecodeTokenService)

  isAdmin: boolean = false
  selectSideBar: string ='';
  env: string = ''
  activeButton = ''
  currentUser: any = null;
  isSidebarOpen = false;
  Systems: any;
  routesFromApi: any;

  constructor() {

  }

  ngOnInit(): void {
    this.systemService.loadRoutesFromApi().subscribe(routes => {
      this.routesFromApi = routes;

      const dynamicRoutes = routes.map((route: any) => ({
        path: route.routingName,
        loadComponent: () => this.getComponentByPath(route.routingName)
      }));

      const staticRoutes = this.router.config.filter(r => r.path !== '**');
      this.router.resetConfig([
        ...staticRoutes,
        ...dynamicRoutes,
        { path: '**', component: NotFoundComponent }
      ]);

      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('tokenId');

      if (token) {
        localStorage.setItem('tokenId', token);
        this.router.navigate(['/store']);
      } else {
        this.router.navigate(['/']);
      }
    });

    this.http.getData("api/Enviroment").subscribe(res => {
      this.env = res.db_env;
    })
  }

  async getComponentByPath(path: string): Promise<any> {
  switch (path) {
    case 'store':
      const { ShowOrdersDetailsComponent } = await import('./show-orders-details/show-orders-details.component');
      return ShowOrdersDetailsComponent;

    case 'ebay':
      const { SearchInEbayComponent } = await import('./Store/search-in-ebay/search-in-ebay.component');
      return SearchInEbayComponent;

    case 'marketPlace':
      const { MarketPlaceComponent } = await import('./Store/market-place/market-place.component');
      return MarketPlaceComponent;

    default:
      throw new Error(`No component found for path: ${path}`);
  }
}

getUserRole(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const payload = token.split('.')[1];
  const decodedPayload = atob(payload);
  const tokenData = JSON.parse(decodedPayload); 
  return tokenData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
}


  GetCurrentUser(): void{
    const token = localStorage.getItem('token');
    const payload = token!.split('.')[1];
    const decodedPayload = atob(payload);
    const tokenData = JSON.parse(decodedPayload); 
    var userName = tokenData['unique_name'];

  }


  showSideBar(selectSide: string): void{
    this.selectSideBar = selectSide;
    this.activeButton = selectSide
  }

  IsAdmin(): boolean {
    return this.getUserRole() === "Admin" || this.getUserRole() === "Sub_Admin";
  }

  IsSuper_Admin(): boolean {
    return this.getUserRole() === "Admin";
  }

  logout() {
    localStorage.removeItem('token')
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  divideNum(num: number | undefined): string {
    if (num === undefined) {
      return 'N/A';
    }
    let magnitude = Math.pow(10, Math.floor(Math.log10(num) - 1));
    let final = Math.ceil(num / magnitude) * magnitude;
    return final.toLocaleString();
  }



  toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
      const sidebar = document.getElementById('accordionSidebar');
      if (this.isSidebarOpen) {
          sidebar?.classList.add('toggled');
      } else {
          sidebar?.classList.remove('toggled');
      }
  }
}
