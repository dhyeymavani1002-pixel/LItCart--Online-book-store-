import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BookCardComponent } from '../components/book-card.component';
import { Book } from '../models/litcart.models';
import { LitcartStoreService } from '../services/litcart-store.service';

@Component({
  selector: 'app-listing-page',
  standalone: true,
  imports: [CommonModule, FormsModule, BookCardComponent],
  template: `
    <section class="listing-hero">
      <span class="eyebrow">Browse collection</span>
      <h1>Explore LitCart</h1>
    </section>

    <section class="listing-layout">
      <aside class="filters">
        <label>
          Search
          <input
            [ngModel]="searchTerm()"
            (ngModelChange)="searchTerm.set($event)"
            placeholder="Title or author"
          />
        </label>

        <label>
          Category
          <select
            [ngModel]="selectedCategory()"
            (ngModelChange)="selectedCategory.set($event)"
          >
            <option value="all">All categories</option>
            @for (category of categories(); track category) {
              <option [value]="category">{{ category | titlecase }}</option>
            }
          </select>
        </label>

        <label>
          Sort by
          <select
            [ngModel]="sortBy()"
            (ngModelChange)="sortBy.set($event)"
          >
            <option value="relevant">Most relevant</option>
            <option value="price-asc">Price low to high</option>
            <option value="price-desc">Price high to low</option>
            <option value="rating">Best rated</option>
          </select>
        </label>
      </aside>

      <div class="results">
        <div class="results-header">
          <div>
            <strong>{{ filteredBooks().length }}</strong>
            <span>books found</span>
          </div>
          <button type="button" (click)="resetFilters()">Reset filters</button>
        </div>

        <div class="book-grid">
          @for (book of filteredBooks(); track book.id) {
            <app-book-card [book]="book" (add)="store.addToCart($event)" />
          } @empty {
            <div class="empty-state">No books match the current filters.</div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .listing-hero {
      padding: 3rem 2rem 1rem;
    }

    .listing-hero h1 {
      margin: 0.6rem 0;
      font-family: 'Libre Baskerville', serif;
      font-size: clamp(2rem, 4vw, 3rem);
    }

    .listing-hero p,
    .results-header span {
      color: #6f7268;
    }

    .eyebrow {
      color: #a46b2b;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-size: 0.72rem;
      font-weight: 700;
    }

    .listing-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 1.5rem;
      padding: 1rem 2rem 4rem;
    }

    .filters,
    .results-header {
      border-radius: 1.25rem;
      background: var(--glass-surface);
      border: var(--glass-border);
      box-shadow: var(--glass-shadow);
      backdrop-filter: var(--glass-button-blur);
      -webkit-backdrop-filter: var(--glass-button-blur);
    }

    .filters {
      display: grid;
      gap: 1rem;
      align-content: start;
      padding: 1.25rem;
      height: fit-content;
    }

    label {
      display: grid;
      gap: 0.5rem;
      color: #223738;
      font-weight: 600;
    }

    input,
    select {
      width: 100%;
      border: var(--glass-inset-border);
      border-radius: 0.85rem;
      padding: 0.85rem 1rem;
      background: var(--glass-field-bg);
    }

    .results {
      display: grid;
      gap: 1rem;
    }

    .results-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem 1.2rem;
    }

    .results-header strong {
      font-size: 1.2rem;
      margin-right: 0.35rem;
    }

    button {
      border: var(--glass-button-border);
      border-radius: 999px;
      padding: 0.7rem 1rem;
      background: var(--glass-button-bg-strong);
      color: var(--glass-button-text);
      font-weight: 700;
      cursor: pointer;
      backdrop-filter: var(--glass-button-blur);
      -webkit-backdrop-filter: var(--glass-button-blur);
      box-shadow: var(--glass-button-shadow);
    }

    .book-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 260px));
      gap: 1.25rem;
      justify-content: start;
      align-items: start;
    }

    .empty-state {
      padding: 2.5rem;
      border-radius: 1.25rem;
      background: var(--glass-surface);
      border: var(--glass-border);
      box-shadow: var(--glass-shadow);
      backdrop-filter: var(--glass-button-blur);
      -webkit-backdrop-filter: var(--glass-button-blur);
      color: #6f7268;
      text-align: center;
    }

    @media (max-width: 900px) {
      .listing-layout {
        grid-template-columns: 1fr;
      }

      .results-header {
        align-items: stretch;
        flex-direction: column;
      }
    }

    @media (max-width: 640px) {
      .listing-hero,
      .listing-layout {
        padding-left: 1rem;
        padding-right: 1rem;
      }

      .listing-hero {
        padding-top: 2rem;
      }

      .filters,
      .results-header {
        padding: 1rem;
      }

      .book-grid {
        grid-template-columns: 1fr;
      }

      button {
        width: 100%;
      }
    }
  `
})
export class ListingPageComponent {
  protected readonly store = inject(LitcartStoreService);
  private readonly route = inject(ActivatedRoute);

  protected readonly searchTerm = signal('');
  protected readonly selectedCategory = signal('all');
  protected readonly sortBy = signal('relevant');

  protected readonly categories = computed(() =>
    [...new Set(this.store.books().map((book) => book.category))].sort()
  );

  protected readonly filteredBooks = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const selectedCategory = this.selectedCategory();
    const sortBy = this.sortBy();

    const filtered = this.store.books().filter((book) => {
      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
      const matchesTerm =
        term.length === 0 ||
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term);

      return matchesCategory && matchesTerm;
    });

    return this.sortBooks(filtered, sortBy);
  });

  constructor() {
    void this.store.initialize();

    const category = this.route.snapshot.queryParamMap.get('category');
    if (category) {
      this.selectedCategory.set(category);
    }
  }

  protected resetFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('all');
    this.sortBy.set('relevant');
  }

  private sortBooks(books: Book[], sortBy: string): Book[] {
    const sorted = [...books];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((left, right) => left.price - right.price);
      case 'price-desc':
        return sorted.sort((left, right) => right.price - left.price);
      case 'rating':
        return sorted.sort((left, right) => right.rating - left.rating);
      default:
        return sorted.sort((left, right) => right.ratingCount - left.ratingCount);
    }
  }
}
