import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookCardComponent } from '../components/book-card.component';
import { LitcartStoreService } from '../services/litcart-store.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, BookCardComponent],
  template: `
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow">Curated bookstore</span>
        <h1>Bring your LitCart storefront to life without losing the style you built.</h1>
        <p>
          World best online book store with 24/7 support .
        </p>
        <div class="hero-actions">
          <a class="primary" routerLink="/books">Browse collection</a>
          <a class="secondary" routerLink="/orders">View orders</a>
        </div>
      </div>
      <div class="hero-panel">
        <div class="metric">
          <strong>{{ booksCount() }}</strong>
          <span>Books available</span>
        </div>
        <div class="metric">
          <strong>{{ store.cartCount() }}</strong>
          <span>Items in cart</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-heading">
        <div>
          <span class="eyebrow">Featured</span>
          <h2>Handpicked books from the backend</h2>
        </div>
        <a routerLink="/books">See all</a>
      </div>
      <div class="book-grid">
        @for (book of store.featuredBooks(); track book.id) {
          <app-book-card [book]="book" (add)="store.addToCart($event)" />
        }
      </div>
    </section>

    <section class="section">
      <div class="section-heading">
        <div>
          <span class="eyebrow">Bestsellers</span>
          <h2>Most-loved titles in LitCart</h2>
        </div>
      </div>
      <div class="book-grid">
        @for (book of store.bestsellerBooks(); track book.id) {
          <app-book-card [book]="book" (add)="store.addToCart($event)" />
        }
      </div>
    </section>
  `,
  styles: `
    .hero {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 2rem;
      padding: 4rem 2rem;
      background:
        radial-gradient(circle at 18% 16%, rgba(125, 211, 252, 0.22), transparent 25%),
        radial-gradient(circle at 84% 22%, rgba(244, 114, 182, 0.18), transparent 26%),
        var(--glass-surface-dark);
      color: #f7f8fc;
    }

    .hero-copy h1,
    .section-heading h2 {
      font-family: var(--font-display);
      line-height: 0.96;
      letter-spacing: -0.04em;
    }

    .hero-copy h1 {
      font-size: clamp(3.2rem, 7vw, 6.1rem);
      font-weight: 500;
      max-width: 10ch;
      margin: 0.5rem 0 1rem;
    }

    .hero-copy p {
      max-width: 58ch;
      color: rgba(245, 247, 255, 0.8);
      font-size: 1.05rem;
      line-height: 1.8;
    }

    .eyebrow {
      display: inline-flex;
      padding: 0.45rem 0.9rem;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.22);
      color: rgba(247, 248, 252, 0.88);
      text-transform: uppercase;
      letter-spacing: 0.18em;
      font-size: 0.72rem;
      font-weight: 500;
      background: rgba(255, 255, 255, 0.08);
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
      flex-wrap: wrap;
    }

    .hero-actions a {
      text-decoration: none;
      border-radius: 999px;
      padding: 0.9rem 1.25rem;
      font-weight: 700;
      border: var(--glass-button-border);
      backdrop-filter: var(--glass-button-blur);
      -webkit-backdrop-filter: var(--glass-button-blur);
      box-shadow: var(--glass-button-shadow);
    }

    .primary {
      background: var(--glass-button-bg-strong);
      color: #2b3150;
    }

    .secondary {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: #f7f8fc;
    }

    .hero-panel {
      display: grid;
      gap: 1rem;
      align-content: center;
    }

    .metric {
      padding: 1.35rem;
      border-radius: 1.3rem;
      background: rgba(255, 255, 255, 0.13);
      border: var(--glass-inset-border);
      backdrop-filter: var(--glass-button-blur);
      -webkit-backdrop-filter: var(--glass-button-blur);
    }

    .metric strong {
      display: block;
      font-size: 2rem;
      font-family: var(--font-display);
      font-weight: 600;
    }

    .metric span {
      color: rgba(245, 247, 255, 0.72);
    }

    .section {
      padding: 3rem 2rem 4rem;
    }

    .section-heading {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .section-heading a {
      color: #5b54a7;
      text-decoration: none;
      font-weight: 600;
    }

    .book-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
    }

    @media (max-width: 900px) {
      .hero {
        grid-template-columns: 1fr;
      }

      .hero-panel {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        align-content: stretch;
      }
    }

    @media (max-width: 640px) {
      .hero,
      .section {
        padding-left: 1rem;
        padding-right: 1rem;
      }

      .hero {
        padding-top: 2.5rem;
        padding-bottom: 2.5rem;
      }

      .hero-copy h1 {
        max-width: none;
        line-height: 1;
      }

      .hero-copy p {
        font-size: 1rem;
        line-height: 1.7;
      }

      .hero-actions a {
        width: 100%;
        justify-content: center;
        text-align: center;
      }

      .hero-panel,
      .book-grid {
        grid-template-columns: 1fr;
      }

      .section-heading {
        align-items: start;
        flex-direction: column;
      }
    }
  `
})
export class HomePageComponent {
  protected readonly store = inject(LitcartStoreService);
  protected readonly booksCount = computed(() => this.store.books().length);

  constructor() {
    void this.store.initialize();
  }
}
