import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LitcartStoreService } from '../services/litcart-store.service';

@Component({
  selector: 'app-book-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (book(); as book) {
      <section class="detail-layout">
        <img class="detail-image" [src]="book.cover" [alt]="book.title" />

        <div class="detail-copy">
          <a routerLink="/books" class="back-link">Back to listing</a>
          <span class="eyebrow">{{ book.category | titlecase }}</span>
          <h1>{{ book.title }}</h1>
          <p class="author">by {{ book.author }}</p>

          <div class="detail-pills">
            <span>{{ book.rating }} rating</span>
            <span>{{ book.ratingCount | number }} reviews</span>
            <span>{{ book.pages }} pages</span>
          </div>

          <p class="description">{{ book.desc }}</p>

          <div class="price-row">
            <strong>{{ book.price | currency: 'INR' : 'symbol' : '1.0-0' }}</strong>
            @if (book.oldPrice) {
              <span>{{ book.oldPrice | currency: 'INR' : 'symbol' : '1.0-0' }}</span>
            }
          </div>

          <div class="actions">
            <div class="qty-picker">
              <button type="button" (click)="changeQty(-1)">-</button>
              <span>{{ qty() }}</span>
              <button type="button" (click)="changeQty(1)">+</button>
            </div>
            <button class="primary" type="button" (click)="store.addToCart(book, qty())">Add to cart</button>
            <button class="secondary" type="button" (click)="store.toggleWishlist(book.id)">
              {{ store.isWishlisted(book.id) ? 'Wishlisted' : 'Add to wishlist' }}
            </button>
          </div>

          <div class="info-grid">
            <div>
              <span>Publisher</span>
              <strong>{{ book.publisher }}</strong>
            </div>
            <div>
              <span>Format</span>
              <strong>Paperback</strong>
            </div>
          </div>
        </div>
      </section>

      <section class="reviews">
        <h2>Reader reviews</h2>
        <div class="review-grid">
          @for (review of book.reviews; track review.name + review.date) {
            <article>
              <strong>{{ review.name }}</strong>
              <span>{{ review.date }} - {{ review.rating }}</span>
              <p>{{ review.text }}</p>
            </article>
          }
        </div>
      </section>
    } @else {
      <section class="missing">Book not found.</section>
    }
  `,
  styles: `
    .detail-layout,
    .reviews {
      padding: 2rem;
    }

    .detail-layout {
      display: grid;
      grid-template-columns: minmax(280px, 420px) 1fr;
      gap: 2rem;
    }

    .detail-image {
      width: 100%;
      border-radius: 1.5rem;
      object-fit: cover;
      min-height: 420px;
      background: #e8dfcf;
      box-shadow: 0 24px 60px rgba(18, 31, 31, 0.1);
    }

    .back-link,
    .eyebrow,
    .author,
    .detail-pills span,
    .info-grid span,
    .review-grid span {
      color: #6f7268;
    }

    .back-link {
      display: inline-block;
      margin-bottom: 1rem;
      text-decoration: none;
    }

    .eyebrow {
      text-transform: uppercase;
      letter-spacing: 0.14em;
      font-size: 0.72rem;
      font-weight: 700;
      color: #a46b2b;
    }

    h1,
    h2 {
      font-family: 'Libre Baskerville', serif;
    }

    h1 {
      margin: 0.5rem 0;
      font-size: clamp(2rem, 5vw, 3.25rem);
    }

    .detail-pills,
    .actions,
    .info-grid,
    .review-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;
    }

    .detail-pills span,
    .info-grid div,
    .review-grid article {
      padding: 0.75rem 1rem;
      border-radius: 1rem;
      background: var(--glass-surface);
      border: var(--glass-border);
      box-shadow: 0 12px 32px rgba(42, 48, 80, 0.1);
      backdrop-filter: var(--glass-button-blur);
      -webkit-backdrop-filter: var(--glass-button-blur);
    }

    .description {
      margin: 1.5rem 0;
      line-height: 1.8;
      color: #223738;
    }

    .price-row {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
      margin-bottom: 1.4rem;
    }

    .price-row strong {
      font-size: 2rem;
      color: #162123;
    }

    .price-row span {
      color: #6f7268;
      text-decoration: line-through;
    }

    .qty-picker {
      display: inline-flex;
      align-items: center;
      gap: 1rem;
      padding: 0.35rem;
      border-radius: 999px;
      background: var(--glass-field-bg);
      border: var(--glass-inset-border);
      backdrop-filter: var(--glass-button-blur);
      -webkit-backdrop-filter: var(--glass-button-blur);
    }

    button {
      border: var(--glass-button-border);
      cursor: pointer;
      font-weight: 700;
      backdrop-filter: var(--glass-button-blur);
      -webkit-backdrop-filter: var(--glass-button-blur);
      box-shadow: var(--glass-button-shadow);
    }

    .qty-picker button {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.24);
      color: #162123;
    }

    .primary,
    .secondary {
      border-radius: 999px;
      padding: 0.9rem 1.2rem;
    }

    .primary {
      background: var(--glass-button-bg-strong);
      color: var(--glass-button-text);
    }

    .secondary {
      background: var(--glass-button-bg);
      border: var(--glass-button-border);
      color: #223738;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(160px, 1fr));
      margin-top: 1.5rem;
    }

    .info-grid div {
      display: grid;
      gap: 0.3rem;
    }

    .review-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      margin-top: 1rem;
    }

    .review-grid article strong {
      color: #162123;
    }

    .review-grid article p {
      margin: 0.8rem 0 0;
      color: #223738;
      line-height: 1.7;
    }

    .missing {
      padding: 4rem 2rem;
      text-align: center;
      color: #6f7268;
    }

    @media (max-width: 900px) {
      .detail-layout {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .detail-layout,
      .reviews {
        padding: 1rem;
      }

      .detail-image {
        min-height: 320px;
      }

      .actions {
        flex-direction: column;
        align-items: stretch;
      }

      .qty-picker {
        justify-content: center;
      }

      .primary,
      .secondary {
        width: 100%;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class BookDetailPageComponent {
  protected readonly store = inject(LitcartStoreService);
  private readonly route = inject(ActivatedRoute);
  protected readonly qty = signal(1);

  protected readonly book = computed(() => {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    return this.store.getBookById(id);
  });

  constructor() {
    void this.store.initialize();
  }

  protected changeQty(delta: number): void {
    this.qty.update((current) => Math.max(1, current + delta));
  }
}
