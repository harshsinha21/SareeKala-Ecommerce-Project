import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { ProductsComponent } from './products/products.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { RegisteruserComponent } from './registeruser/registeruser.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { NgModule } from '@angular/core';
import { authGuard } from './_authorization/auth.guard';
import { AddProductComponent } from './add-product/add-product.component';
import { ShowProductComponent } from './show-product/show-product.component';
import { ProductResolverService } from './product-resolver.service';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { BuyProductComponent } from './buy-product/buy-product.component';
import { BuyProductResolverService } from './buy-product-resolver.service';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { CartComponent } from './cart/cart.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { AllOrdersComponent } from './all-orders/all-orders.component';


export const routes: Routes = [
    { path: 'order-success', component: OrderSuccessComponent },
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full'}, //default route
    { path: 'admin', component: AdminComponent, canActivate: [authGuard], data:{roles:['Admin']} },
    { path: 'user', component: UserComponent, canActivate: [authGuard], data:{roles:['User']} },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'login', component: LoginComponent },
    { path: 'forbidden', component: ForbiddenComponent },
    { path: 'register', component: RegisteruserComponent },
    { path: 'forgot', component: ForgotpasswordComponent },
    { path: 'addProduct', component: AddProductComponent, canActivate: [authGuard], data:{roles:['Admin']}, resolve:{product: ProductResolverService}  },
    { path: 'showProduct', component: ShowProductComponent, canActivate: [authGuard], data:{roles:['Admin']}  },
    { path: 'viewDetails', component: ViewDetailsComponent, resolve:{product: ProductResolverService}  },
    { path: 'buyProduct', component: BuyProductComponent, canActivate: [authGuard], data:{roles:['User']}, resolve:{productDetails: BuyProductResolverService}  },
    
    { path: 'cart', component: CartComponent, canActivate: [authGuard], data:{roles:['User']} },
    { path: 'myorders', component: MyOrdersComponent, canActivate: [authGuard], data:{roles:['User']} },
    { path: 'allOrders', component: AllOrdersComponent, canActivate: [authGuard], data:{roles:['Admin']} },
    { path: '**', component: PagenotfoundComponent }
];

export const routing = RouterModule.forRoot(routes, { useHash: true });

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}