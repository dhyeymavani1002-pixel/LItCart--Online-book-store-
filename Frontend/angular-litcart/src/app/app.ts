import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { LitcartStoreService } from './services/litcart-store.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <header class="topbar-wrap">
        <div class="topbar">
          <a class="brand" routerLink="/">
            <span class="brand-mark">
              <img class="brand-logo" src="assets/litcart-logo.svg" alt="LitCart logo" />
            </span>
            <span class="brand-name">LitCart</span>
          </a>

          <nav class="topnav" aria-label="Primary navigation">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
            <a routerLink="/books" routerLinkActive="active">Browse</a>
            <a routerLink="/orders" routerLinkActive="active">Orders</a>
            <a routerLink="/profile" routerLinkActive="active">Profile</a>
          </nav>

          <div class="topbar-actions">
            @if (auth.currentUser(); as user) {
              <span class="user-chip">{{ user.name }}</span>
              <button class="auth-button subtle" type="button" (click)="logout()">Logout</button>
            } @else {
              <a class="auth-button subtle" routerLink="/login" routerLinkActive="active">Login</a>
              <a class="auth-button" routerLink="/signup" routerLinkActive="active">Join now</a>
            }
            <a class="cart-link" routerLink="/cart" aria-label="View cart">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M7 7.5V7a5 5 0 0 1 10 0v.5M6 9h12l-.7 9.1a2 2 0 0 1-2 1.9H8.7a2 2 0 0 1-2-1.9L6 9Z"
                />
              </svg>
              <span class="cart-count">{{ cartCount() }}</span>
            </a>
          </div>
        </div>
      </header>

      <main class="page-shell">
        <router-outlet />
      </main>

      <footer class="app-footer">
        <a class="footer-brand" routerLink="/">
          <img class="footer-logo" src="assets/litcart-logo.svg" alt="LitCart logo" />
          <span>LitCart</span>
        </a>
        <div class="footer-links">
          <a routerLink="/books">Books</a>
          <a routerLink="/orders">Orders</a>
          <a routerLink="/profile">Profile</a>
          <a routerLink="/login">Login</a>
        </div>
      </footer>
    </div>
  `,
  styleUrl: './app-shell.css'
})
export class App {
  protected readonly store = inject(LitcartStoreService);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly cartCount = computed(() => this.store.cartCount());

  protected logout(): void {
    this.auth.logout();
    void this.store.loadOrders();
    void this.router.navigate(['/login']);
  }
}
