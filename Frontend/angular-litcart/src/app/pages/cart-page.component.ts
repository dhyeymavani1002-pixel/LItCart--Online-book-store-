import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LitcartStoreService } from '../services/litcart-store.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="cart-page">
      <div class="cart-items">
        <div class="section-heading">
          <div>
            <span class="eyebrow">Cart</span>
            <h1>Your reading stack</h1>
          </div>
          <a routerLink="/books">Continue shopping</a>
        </div>

        @if (store.cart().length > 0) {
          @for (item of store.cart(); track item.id) {
            <article class="cart-item">
              <img [src]="item.cover" [alt]="item.title" />
              <div class="cart-item-copy">
                <h2>{{ item.title }}</h2>
                <p>{{ item.author }}</p>
                <strong>{{ item.price | currency: 'INR' : 'symbol' : '1.0-0' }}</strong>
              </div>
              <div class="cart-actions">
                <div class="qty-picker">
                  <button type="button" (click)="store.updateQuantity(item.id, -1)">-</button>
                  <span>{{ item.qty }}</span>
                  <button type="button" (click)="store.updateQuantity(item.id, 1)">+</button>
                </div>
                <button type="button" class="remove" (click)="store.removeFromCart(item.id)">Remove</button>
              </div>
            </article>
          }
        } @else {
          <div class="empty-state">
            <h2>Your cart is empty</h2>
            <p>Pick a few titles from the storefront and they will show up here.</p>
          </div>
        }
      </div>

      <aside class="summary-card">
        <span class="eyebrow">Summary</span>
        <h2>Checkout ready</h2>
        <label>
          Promo code
          <div class="promo-row">
            <input [(ngModel)]="promoCode" placeholder="BOOK10" />
            <button type="button" (click)="applyPromo()">Apply</button>
          </div>
        </label>
        @if (promoMessage()) {
          <p class="promo-message" [class.success]="promoOk()">{{ promoMessage() }}</p>
        }
        <div class="summary-row"><span>Subtotal</span><strong>{{ store.subtotal() | currency: 'INR' : 'symbol' : '1.0-0' }}</strong></div>
        <div class="summary-row"><span>Shipping</span><strong>{{ 49 | currency: 'INR' : 'symbol' : '1.0-0' }}</strong></div>
        <div class="summary-row"><span>Tax</span><strong>{{ store.tax() | currency: 'INR' : 'symbol' : '1.0-0' }}</strong></div>
        <div class="summary-row"><span>Discount</span><strong>-{{ store.discountAmount() | currency: 'INR' : 'symbol' : '1.0-0' }}</strong></div>
        <div class="summary-total"><span>Total</span><strong>{{ store.total() | currency: 'INR' : 'symbol' : '1.0-0' }}</strong></div>
        @if (!auth.currentUser()) {
          <p class="auth-note">Login or sign up before placing an order.</p>
        }
        <a
          class="checkout-link"
          [routerLink]="auth.currentUser() ? '/checkout' : '/login'"
          [queryParams]="auth.currentUser() ? null : { redirect: '/checkout' }"
        >
          {{ auth.currentUser() ? 'Proceed to checkout' : 'Login to continue' }}
        </a>
      </aside>
    </section>
  `,
  styles: `
    .cart-page {
      display: grid;
      grid-template-columns: 1.6fr 1fr;
      gap: 1.5rem;
      padding: 2rem;
    }

    .section-heading {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .eyebrow {
      color: #a46b2b;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-size: 0.72rem;
      font-weight: 700;
    }

    h1,
    h2 {
      font-family: 'Libre Baskerville', serif;
    }

    .section-heading a,
    .cart-item p,
    .promo-message {
      color: #6f7268;
    }

    .cart-item,
    .summary-card,
    .empty-state {
      border-radius: 1.25rem;
      background: var(--glass-surface);
      border: var(--glass-border);
      box-shadow: var(--glass-shadow);
      backdrop-filter: var(--glass-button-blur);
      -webkit-backdrop-filter: var(--glass-button-blur);
    }

    .cart-item {
      display: grid;
      grid-template-columns: 96px 1fr auto;
      gap: 1rem;
      padding: 1rem;
      margin-bottom: 1rem;
      align-items: center;
    }

    .cart-item img {
      width: 96px;
      height: 124px;
      object-fit: cover;
      border-radius: 1rem;
      background: #e8dfcf;
    }

    .cart-item h2 {
      margin-bottom: 0.35rem;
      font-size: 1.1rem;
    }

    .cart-actions {
      display: grid;
      justify-items: end;
      gap: 0.7rem;
    }

    .qty-picker {
      display: inline-flex;
      align-items: center;
      gap: 0.9rem;
      padding: 0.3rem;
      border-radius: 999px;
      border: var(--glass-inset-border);
      background: var(--glass-field-bg);
    }

    .qty-picker button,
    .promo-row button {
      border: var(--glass-button-border);
      border-radius: 999px;
      padding: 0.65rem 0.95rem;
      background: var(--glass-button-bg-strong);
      color: var(--glass-button-text);
      cursor: pointer;
      font-weight: 700;
      backdrop-filter: var(--glass-button-blur);
      -webkit-backdrop-filter: var(--glass-button-blur);
      box-shadow: var(--glass-button-shadow);
    }

    .remove {
      border: none;
      background: transparent;
      color: #9a4a35;
      cursor: pointer;
      font-weight: 700;
    }

    .summary-card,
    .empty-state {
      padding: 1.4rem;
      height: fit-content;
    }

    label {
      display: grid;
      gap: 0.6rem;
      margin: 1rem 0;
      color: #223738;
      font-weight: 600;
    }

    .promo-row {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 0.65rem;
    }

    input {
      width: 100%;
      border: var(--glass-inset-border);
      border-radius: 0.85rem;
      padding: 0.85rem 1rem;
      background: var(--glass-field-bg);
    }

    .promo-message.success {
      color: #2a7c4c;
    }

    .auth-note {
      margin: 0.5rem 0 0;
      color: #9a4a35;
      font-size: 0.92rem;
    }

    .summary-row,
    .summary-total {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem 0;
      color: #223738;
    }

    .summary-total {
      border-top: 1px solid rgba(34, 55, 56, 0.12);
      margin-top: 0.5rem;
      padding-top: 1rem;
      font-weight: 700;
    }

    .checkout-link {
      display: inline-flex;
      justify-content: center;
      width: 100%;
      margin-top: 1rem;
      padding: 0.95rem 1.25rem;
      border-radius: 999px;
      background: var(--glass-button-bg-strong);
      color: var(--glass-button-text);
      text-decoration: none;
      font-weight: 700;
      border: var(--glass-button-border);
      backdrop-filter: var(--glass-button-blur);
      -webkit-backdrop-filter: var(--glass-button-blur);
      box-shadow: var(--glass-button-shadow);
    }

    @media (max-width: 900px) {
      .cart-page {
        grid-template-columns: 1fr;
      }

      .cart-item {
        grid-template-columns: 96px minmax(0, 1fr);
      }

      .cart-actions {
        grid-column: 1 / -1;
        grid-template-columns: repeat(2, max-content);
        justify-content: space-between;
        justify-items: start;
      }

      .summary-card {
        order: -1;
      }
    }

    @media (max-width: 640px) {
      .cart-page {
        padding: 1rem;
      }

      .section-heading {
        align-items: start;
        flex-direction: column;
      }

      .cart-item {
        grid-template-columns: 1fr;
      }

      .cart-actions,
      .promo-row {
        grid-template-columns: 1fr;
      }

      .qty-picker,
      .promo-row button,
      .checkout-link {
        width: 100%;
      }

      .qty-picker {
        justify-content: center;
      }

      .remove {
        padding-left: 0;
      }
    }
  `
})
export class CartPageComponent {
  protected readonly store = inject(LitcartStoreService);
  protected readonly auth = inject(AuthService);
  protected promoCode = '';
  protected readonly promoMessage = signal('');
  protected readonly promoOk = signal(false);

  constructor() {
    void this.store.initialize();
  }

  protected applyPromo(): void {
    const result = this.store.applyPromo(this.promoCode);
    this.promoMessage.set(result.message);
    this.promoOk.set(result.ok);
  }
}
