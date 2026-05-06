import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page.component';
import { ListingPageComponent } from './pages/listing-page.component';
import { BookDetailPageComponent } from './pages/book-detail-page.component';
import { CartPageComponent } from './pages/cart-page.component';
import { CheckoutPageComponent } from './pages/checkout-page.component';
import { OrdersPageComponent } from './pages/orders-page.component';
import { ProfilePageComponent } from './pages/profile-page.component';
import { LoginPageComponent } from './pages/login-page.component';
import { SignupPageComponent } from './pages/signup-page.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'books',
    component: ListingPageComponent
  },
  {
    path: 'books/:id',
    component: BookDetailPageComponent
  },
  {
    path: 'cart',
    component: CartPageComponent
  },
  {
    path: 'checkout',
    component: CheckoutPageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'orders',
    component: OrdersPageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: ProfilePageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'signup',
    component: SignupPageComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
