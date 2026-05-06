import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { LitcartStoreService } from '../services/litcart-store.service';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="orders-page">
      @if (highlightOrder(); as latest) {
        <article class="highlight-card">
          <span class="eyebrow">Latest order</span>
          <h2>{{ latest.orderId }}</h2>
          <p>
            {{ latest.customer.fullName || latest.customer.firstName }} -
            {{ latest.total | currency: 'INR' : 'symbol' : '1.0-0' }} -
            {{ latest.status | titlecase }}
          </p>
        </article>
      }

      <div class="orders-grid">
        @for (order of store.orders(); track order.orderId) {
          <article class="order-card">
            <div class="order-header">
              <div>
                <h2>{{ order.orderId }}</h2>
                <p>{{ order.createdAt | date: 'medium' }}</p>
              </div>
              <span class="status">{{ order.status | titlecase }}</span>
            </div>

            <div class="order-grid">
              <section>
                <h3>Customer</h3>
                <p>{{ order.customer.fullName || order.customer.firstName }}</p>
                <p>{{ order.customer.email }}</p>
                <p>{{ order.customer.phone }}</p>
              </section>
              <section>
                <h3>Payment</h3>
                <p>{{ order.paymentMethod }}</p>
                <p>{{ order.transactionId }}</p>
                <p>Total: {{ order.total | currency: 'INR' : 'symbol' : '1.0-0' }}</p>
              </section>
            </div>

            <div class="items">
              @for (item of order.items; track item.id + ':' + item.qty) {
                <div class="item-row">
                  <span>{{ item.title }} x {{ item.qty }}</span>
                  <strong>{{ item.price * item.qty | currency: 'INR' : 'symbol' : '1.0-0' }}</strong>
                </div>
              }
            </div>
          </article>
        } @empty {
          <div class="empty-state">No orders yet. Place one from the checkout page.</div>
        }
      </div>
    </section>
  `,
  styles: `
    .orders-page {
      padding: 2rem;
    }

    .highlight-card,
    .order-card,
    .empty-state {
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
    h2,
    h3 {
      font-family: 'Libre Baskerville', serif;
    }

    .highlight-card p,
    .order-header p,
    section p {
      color: #6f7268;
    }

    .highlight-card {
      padding: 1.3rem;
      margin-bottom: 1rem;
      background:
        radial-gradient(circle at right top, rgba(243, 207, 122, 0.22), transparent 30%),
        var(--glass-surface);
    }

    .orders-grid {
      display: grid;
      gap: 1rem;
    }

    .order-card {
      padding: 1.3rem;
    }

    .order-header,
    .item-row {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }

    .order-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }

    section,
    .items {
      padding: 1rem;
      border-radius: 1rem;
      background: var(--glass-field-bg);
      border: var(--glass-inset-border);
      backdrop-filter: var(--glass-button-blur);
      -webkit-backdrop-filter: var(--glass-button-blur);
    }

    .status {
      height: fit-content;
      border-radius: 999px;
      padding: 0.45rem 0.85rem;
      background: rgba(243, 207, 122, 0.22);
      color: #6d4c1d;
      font-weight: 700;
    }

    .item-row + .item-row {
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid rgba(34, 55, 56, 0.08);
    }

    .empty-state {
      padding: 2.5rem;
      color: #6f7268;
      text-align: center;
    }

    @media (max-width: 900px) {
      .order-header,
      .item-row {
        flex-direction: column;
      }

      .order-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .orders-page {
        padding: 1rem;
      }

      .highlight-card,
      .order-card {
        padding: 1rem;
      }

      .status {
        align-self: flex-start;
      }
    }
  `
})
export class OrdersPageComponent {
  protected readonly store = inject(LitcartStoreService);
  protected readonly highlightOrder = computed(() => this.store.lastOrder() ?? this.store.orders()[0] ?? null);

  constructor() {
    void this.store.initialize();
    void this.store.loadOrders();
  }
}
