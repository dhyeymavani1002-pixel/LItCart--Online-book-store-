import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from '../models/litcart.models';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <article class="book-card">
      <a class="book-cover" [routerLink]="['/books', book.id]">
        <img [src]="book.cover" [alt]="book.title" />
        @if (book.badge) {
          <span class="book-badge">{{ book.badge }}</span>
        }
      </a>

      <div class="book-content">
        <div class="book-meta">{{ book.category | titlecase }}</div>
        <a class="book-title" [routerLink]="['/books', book.id]">{{ book.title }}</a>
        <p class="book-author">{{ book.author }}</p>
        <div class="book-rating">
          <span>{{ book.rating }}</span>
          <small>{{ book.ratingCount | number }} readers</small>
        </div>
        <div class="book-footer">
          <div>
            <strong>{{ book.price | currency: 'INR' : 'symbol' : '1.0-0' }}</strong>
            @if (book.oldPrice) {
              <span>{{ book.oldPrice | currency: 'INR' : 'symbol' : '1.0-0' }}</span>
            }
          </div>
          <button type="button" (click)="add.emit(book)">Add</button>
        </div>
      </div>
    </article>
  `,
  styles: `
    .book-card {
      display: grid;
      grid-template-rows: 240px 1fr;
      overflow: hidden;
      border-radius: 1.25rem;
      border: var(--glass-border);
      background: var(--glass-surface);
      box-shadow: var(--glass-shadow);
      backdrop-filter: var(--glass-button-blur);
      -webkit-backdrop-filter: var(--glass-button-blur);
    }

    .book-cover {
      position: relative;
      display: block;
      background: #e8dfcf;
    }

    .book-cover img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .book-badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
      padding: 0.35rem 0.7rem;
      border-radius: 999px;
      background: rgba(243, 207, 122, 0.68);
      border: var(--glass-inset-border);
      backdrop-filter: var(--glass-button-blur);
      -webkit-backdrop-filter: var(--glass-button-blur);
      color: #1d1610;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .book-content {
      display: grid;
      gap: 0.65rem;
      padding: 1rem;
    }

    .book-meta {
      color: #a46b2b;
      text-transform: uppercase;
      font-size: 0.74rem;
      letter-spacing: 0.12em;
      font-weight: 700;
    }

    .book-title {
      color: #162123;
      text-decoration: none;
      font-family: 'Libre Baskerville', serif;
      font-size: 1rem;
      line-height: 1.4;
    }

    .book-author,
    .book-rating small,
    .book-footer span {
      color: #6f7268;
    }

    .book-rating {
      display: flex;
      align-items: center;
      gap: 0.55rem;
      color: #162123;
      font-weight: 600;
    }

    .book-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .book-footer strong {
      display: block;
      color: #162123;
    }

    .book-footer span {
      text-decoration: line-through;
      font-size: 0.86rem;
    }

    button {
      border: var(--glass-button-border);
      border-radius: 999px;
      padding: 0.65rem 1rem;
      background: var(--glass-button-bg-strong);
      color: var(--glass-button-text);
      font-weight: 700;
      cursor: pointer;
      backdrop-filter: var(--glass-button-blur);
      -webkit-backdrop-filter: var(--glass-button-blur);
      box-shadow: var(--glass-button-shadow);
    }

    @media (max-width: 480px) {
      .book-card {
        grid-template-rows: 220px 1fr;
      }

      .book-content {
        gap: 0.55rem;
        padding: 0.9rem;
      }

      .book-footer {
        flex-direction: column;
        align-items: stretch;
      }

      button {
        width: 100%;
      }
    }
  `
})
export class BookCardComponent {
  @Input({ required: true }) book!: Book;
  @Output() readonly add = new EventEmitter<Book>();
}
