import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { LitcartStoreService } from '../services/litcart-store.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="profile-page">
      <article class="hero-card">
        <span class="eyebrow">Profile</span>
        <h1>Customer details</h1>
      </article>

      <div class="profile-grid">
        <form class="profile-card" (ngSubmit)="saveContact()">
          <h2>Contact details</h2>
          <label>
            Full name
            <input name="name" [(ngModel)]="profile.name" />
          </label>
          <label>
            Email
            <input name="email" [(ngModel)]="profile.email" type="email" readonly />
            <span class="locked-note">Email is locked to the account.</span>
          </label>
          <label>
            Phone
            <input name="phone" [(ngModel)]="profile.phone" />
          </label>
          @if (message()) {
            <p class="message" [class.error]="messageType() === 'error'">{{ message() }}</p>
          }
          <button type="submit">Save contact</button>
        </form>

        <aside class="profile-card">
          <h2>Quick stats</h2>
          <div class="stat-grid">
            <div>
              <strong>{{ store.orders().length }}</strong>
              <span>Orders</span>
            </div>
            <div>
              <strong>{{ store.wishlist().length }}</strong>
              <span>Wishlist</span>
            </div>
            <div>
              <strong>{{ store.cartCount() }}</strong>
              <span>Cart items</span>
            </div>
            <div>
              <strong>{{ store.backendConnected() ? 'Live' : 'Offline' }}</strong>
              <span>Backend</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  `,
  styles: `
    .profile-page {
      display: grid;
      gap: 1rem;
      padding: 2rem;
    }

    .hero-card,
    .profile-card {
      padding: 1.4rem;
      border-radius: 1.25rem;
      background: var(--glass-surface);
      border: var(--glass-border);
      box-shadow: var(--glass-shadow);
      backdrop-filter: var(--glass-button-blur);
      -webkit-backdrop-filter: var(--glass-button-blur);
    }

    .profile-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 1rem;
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

    .hero-card p,
    .message {
      color: #6f7268;
    }

    form,
    .stat-grid {
      display: grid;
      gap: 1rem;
    }

    label {
      display: grid;
      gap: 0.5rem;
      color: #223738;
      font-weight: 600;
    }

    input {
      width: 100%;
      border: var(--glass-inset-border);
      border-radius: 0.85rem;
      padding: 0.85rem 1rem;
      background: var(--glass-field-bg);
    }

    input[readonly] {
      color: #6f7268;
      background: rgba(255, 255, 255, 0.24);
      cursor: not-allowed;
    }

    .locked-note {
      font-size: 0.86rem;
      font-weight: 500;
      color: #6f7268;
    }

    button {
      border: var(--glass-button-border);
      border-radius: 999px;
      padding: 0.9rem 1.2rem;
      background: var(--glass-button-bg-strong);
      color: var(--glass-button-text);
      cursor: pointer;
      font-weight: 700;
      backdrop-filter: var(--glass-button-blur);
      -webkit-backdrop-filter: var(--glass-button-blur);
      box-shadow: var(--glass-button-shadow);
    }

    .message.error {
      color: #9a4a35;
    }

    .stat-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .stat-grid div {
      display: grid;
      gap: 0.35rem;
      padding: 1rem;
      border-radius: 1rem;
      background: var(--glass-field-bg);
      border: var(--glass-inset-border);
      backdrop-filter: var(--glass-button-blur);
      -webkit-backdrop-filter: var(--glass-button-blur);
    }

    .stat-grid strong {
      font-size: 1.6rem;
      color: #162123;
    }

    .stat-grid span {
      color: #6f7268;
    }

    @media (max-width: 900px) {
      .profile-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .profile-page {
        padding: 1rem;
      }

      .hero-card,
      .profile-card {
        padding: 1rem;
      }
    }

    @media (max-width: 480px) {
      .stat-grid {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class ProfilePageComponent {
  protected readonly store = inject(LitcartStoreService);
  private readonly auth = inject(AuthService);
  protected readonly message = signal('');
  protected readonly messageType = signal<'success' | 'error'>('success');
  protected profile = {
    name: this.auth.currentUser()?.name ?? this.store.contactProfile().name,
    email: this.auth.currentUser()?.email ?? this.store.contactProfile().email,
    phone: this.auth.currentUser()?.phone ?? this.store.contactProfile().phone
  };

  constructor() {
    void this.store.initialize();
    void this.store.loadOrders();
  }

  protected async saveContact(): Promise<void> {
    const lockedEmail = this.auth.currentUser()?.email ?? this.store.contactProfile().email;
    const nextProfile = {
      ...this.profile,
      email: lockedEmail
    };
    this.profile = nextProfile;

    const saved = await this.store.saveContact(nextProfile);
    if (saved) {
      this.auth.syncCurrentUserProfile({
        name: nextProfile.name,
        phone: nextProfile.phone
      });
    }
    this.messageType.set(saved ? 'success' : 'error');
    this.message.set(
      saved
        ? 'Contact details saved to the backend and local state.'
        : 'Saved locally, but the backend could not be reached.'
    );
  }
}
