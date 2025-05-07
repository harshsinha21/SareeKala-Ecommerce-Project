import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserAuthService } from '../_services/user-auth.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../_services/user.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Product } from '../_model/product.model';
import { SearchService } from '../_services/search.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-header',
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatDividerModule, MatGridListModule, MatInputModule, MatIconModule, MatFormFieldModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  searchSubject: Subject<string> = new Subject();

  searchQuery: string = '';
  allProducts: Product[] = [];
  productDetails: Product[] = [];
  
  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
    public userService: UserService,
    private searchService: SearchService
  ) { }
  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((query) => {
      this.searchService.setSearchQuery(query);
    });
    this.loadProducts();
  }

  public isLoggedIn() {
    return this.userAuthService.isLoggedIn();
  }
  public logout() {
    this.userAuthService.clear();
    this.router.navigate(['/']);
  }
  public isAdmin() {
    return this.userAuthService.isAdmin();
  }
  public isUser() {
    return this.userAuthService.isUser();
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  goAbout() {
    this.router.navigate(['/about']);
  }

  goAdmin() {
    this.router.navigate(['/admin']);
  }

  goUser() {
    this.router.navigate(['/user']);
  }

  goLogin() {
    this.router.navigate(['/login']);
  }

  addProduct() {
    this.router.navigate(['/addProduct']);
  }

  showProduct() {
    this.router.navigate(['/showProduct']);
  }

  orders() {
    this.router.navigate(['/myorders']);
  }

  // accounts() {
  //   this.router.navigate(['/account']);
  // }

  cart() {
    this.router.navigate(['/cart']);
  }

  loadProducts() {
    this.router.navigate(['/home']);
  }
  
  onSearchChange() {
    this.searchSubject.next(this.searchQuery);
  }
  
  onSearch() {
    this.searchService.setSearchQuery(this.searchQuery);
    this.router.navigate(['/home']);
  }
  
  clearSearch() {
    this.searchQuery = '';
    this.searchService.setSearchQuery('');
    this.router.navigate(['/home']);
  }

  allOrders() {
    this.router.navigate(['/allOrders']);
  }



}
