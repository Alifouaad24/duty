import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { MainScreenForMaimComponent } from './main-screen-for-maim/main-screen-for-maim.component';
import { AddHomeDepotProductComponent } from './Store/add-home-depot-product/add-home-depot-product.component';
import { AddMerchantComponent } from './Merchant/add-merchant/add-merchant.component';
import { ShowMerchantComponent } from './Merchant/show-merchant/show-merchant.component';

export const routes: Routes = [

    { path: "MainScreen", component: MainScreenForMaimComponent},
    { path: '', redirectTo: "MainScreen", pathMatch: 'full' },
    { path: '**', component: NotFoundComponent },
    { path: 'AddHomeDepotItem', component: AddHomeDepotProductComponent },
    { path: 'AddMerchant', component: AddMerchantComponent },
    { path: 'Merchants', component: ShowMerchantComponent },

]
