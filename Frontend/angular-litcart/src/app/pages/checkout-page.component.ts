import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CheckoutFormValue } from '../models/litcart.models';
import { AuthService } from '../services/auth.service';
import { LitcartStoreService } from '../services/litcart-store.service';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="checkout-page">
      <div class="checkout-form">
        <span class="eyebrow">Checkout</span>
        <h1>Complete the order</h1>

        @if (store.cart().length === 0) {
          <div class="empty-state">
            Your cart is empty. <a routerLink="/books">Browse books first.</a>
          </div>
        } @else {
          <form #checkoutForm="ngForm" (ngSubmit)="submitOrder()">
            <div class="grid">
              <label>
                First name
                <input name="firstName" [(ngModel)]="form.firstName" required />
              </label>
              <label>
                Last name
                <input name="lastName" [(ngModel)]="form.lastName" />
              </label>
              <label>
                Email
                <input name="email" [(ngModel)]="form.email" type="email" required readonly />
              </label>
              <label>
                Phone
                <input name="phone" [(ngModel)]="form.phone" required />
              </label>
              <label class="full">
                Address
                <input name="address" [(ngModel)]="form.address" required />
              </label>
              <label>
                City
                <input name="city" [(ngModel)]="form.city" />
              </label>
              <label>
                State
                <input name="state" [(ngModel)]="form.state" />
              </label>
              <label>
                PIN code
                <input name="pin" [(ngModel)]="form.pin" required />
              </label>
              <label>
                Country
                <input name="country" [(ngModel)]="form.country" />
              </label>
            </div>

            <label>
              Payment method
              <select name="paymentMethod" [(ngModel)]="form.paymentMethod">
                <option value="Credit / Debit Card">Credit / Debit Card</option>
                <option value="UPI">UPI</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
              </select>
            </label>

            @if (message()) {
              <p class="message" [class.error]="messageType() === 'error'">{{ message() }}</p>
            }

            <button type="submit" [disabled]="saving()">{{ saving() ? 'Saving...' : 'Place order' }}</button>
          </form>
        }
      </div>

      <aside class="summary-card">
        <span class="eyebrow">Order summary</span>
        <h2>{{ store.cartCount() }} items</h2>
        @for (item of store.cart(); track item.id) {
          <div class="summary-item">
            <span>{{ item.title }} x {{ item.qty }}</span>
            <strong>{{ item.price * item.qty | currency: 'INR' : 'symbol' : '1.0-0' }}</strong>
          </div>
        }
        <div class="summary-total">
          <span>Total</span>
          <strong>{{ store.total() | currency: 'INR' : 'symbol' : '1.0-0' }}</strong>
        </div>
      </aside>
    </section>
  `,
  styles: `
    .checkout-page {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 1.5rem;
      padding: 2rem;
    }

    .checkout-form,
    .summary-card {
      padding: 1.4rem;
      border-radius: 1.25rem;
      background: var(--glass-surface);
      border: var(--glass-border);
      box-shadow: var(--glass-shadow);
      backdrop-filter: var(--glass-button-blur);
      -webkit-backdrop-filter: var(--glass-button-blur);
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

    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }

    label {
      display: grid;
      gap: 0.5rem;
      color: #223738;
      font-weight: 600;
    }

    .full {
      grid-column: 1 / -1;
    }

    input,
    select {
      width: 100%;
      border: var(--glass-inset-border);
      border-radius: 0.85rem;
      padding: 0.85rem 1rem;
      background: var(--glass-field-bg);
    }

    button {
      margin-top: 1rem;
      border: var(--glass-button-border);
      border-radius: 999px;
      padding: 0.95rem 1.25rem;
      background: var(--glass-button-bg-strong);
      color: var(--glass-button-text);
      cursor: pointer;
      font-weight: 700;
      backdrop-filter: var(--glass-button-blur);
      -webkit-backdrop-filter: var(--glass-button-blur);
      box-shadow: var(--glass-button-shadow);
    }

    button:disabled {
      cursor: progress;
      opacity: 0.7;
    }

    .message,
    .empty-state {
      margin-top: 1rem;
      color: #2a7c4c;
    }

    .message.error {
      color: #9a4a35;
    }

    .summary-item,
    .summary-total {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.8rem 0;
      color: #223738;
    }

    .summary-total {
      border-top: 1px solid rgba(34, 55, 56, 0.12);
      margin-top: 0.5rem;
      font-weight: 700;
    }

    a {
      color: inherit;
    }

    @media (max-width: 900px) {
      .checkout-page,
      .grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .checkout-page {
        padding: 1rem;
      }

      .checkout-form,
      .summary-card {
        padding: 1rem;
      }

      button {
        width: 100%;
      }

      .summary-item,
      .summary-total {
        align-items: start;
        flex-direction: column;
      }
    }
  `
})
export class CheckoutPageComponent {
  protected readonly store = inject(LitcartStoreService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly saving = signal(false);
  protected readonly message = signal('');
  protected readonly messageType = signal<'success' | 'error'>('success');
  protected form: CheckoutFormValue = {
    firstName: this.auth.currentUser()?.name?.split(' ')[0] ?? 'Rahul',
    lastName: this.auth.currentUser()?.name?.split(' ').slice(1).join(' ') ?? 'Patel',
    email: this.auth.currentUser()?.email ?? this.store.contactProfile().email,
    phone: this.auth.currentUser()?.phone ?? this.store.contactProfile().phone,
    address: '42, Sunshine Apartments, Ring Road',
    city: 'Surat',
    state: 'Gujarat',
    pin: '395001',
    country: 'India',
    paymentMethod: 'Credit / Debit Card'
  };

  constructor() {
    void this.store.initialize();
  }

  protected async submitOrder(): Promise<void> {
    if (!this.auth.currentUser()) {
      this.message.set('Please login or sign up before placing an order.');
      this.messageType.set('error');
      await this.router.navigate(['/login'], {
        queryParams: { redirect: '/checkout' }
      });
      return;
    }

    if (this.store.cart().length === 0) {
      this.message.set('Your cart is empty.');
      this.messageType.set('error');
      return;
    }

    if (!this.form.firstName || !this.form.email || !this.form.phone || !this.form.address || !this.form.pin) {
      this.message.set('Please fill all required delivery details.');
      this.messageType.set('error');
      return;
    }

    this.saving.set(true);
    this.message.set('');

    try {
      await this.store.submitOrder(this.form);
      this.message.set('Order placed successfully.');
      this.messageType.set('success');
      await this.router.navigate(['/orders']);
    } catch {
      this.message.set('Unable to place the order.');
      this.messageType.set('error');
    } finally {
      this.saving.set(false);
    }
  }
}
