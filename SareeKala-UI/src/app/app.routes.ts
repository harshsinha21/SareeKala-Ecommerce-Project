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


export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full'}, //default route
    { path: 'home', component: HomeComponent },
    { path: 'admin', component: AdminComponent, canActivate: [authGuard], data:{roles:['Admin']} },
    { path: 'user', component: UserComponent, canActivate: [authGuard], data:{roles:['User']} },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'login', component: LoginComponent },
    { path: 'forbidden', component: ForbiddenComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'register', component: RegisteruserComponent },
    { path: 'forgot', component: ForgotpasswordComponent },
    { path: 'addProduct', component: AddProductComponent, canActivate: [authGuard], data:{roles:['Admin']}, resolve:{product: ProductResolverService}  },
    { path: 'showProduct', component: ShowProductComponent, canActivate: [authGuard], data:{roles:['Admin']}  },
    { path: '**', component: PagenotfoundComponent }
];

export const routing = RouterModule.forRoot(routes, { useHash: true });

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}