import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LitcartStoreService } from '../services/litcart-store.service';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="auth-page">
      <div class="auth-panel">
        <div class="auth-copy">
          <span class="eyebrow">Join LitCart</span>
          <h1>Create your reading account</h1>
          <p>Sign up to save your details, track orders, and build your wishlist.</p>
        </div>

        <form class="auth-card" (ngSubmit)="signup()">
          <h2>Signup</h2>

          <label>
            Full name
            <input name="name" [(ngModel)]="name" placeholder="Enter your name" />
          </label>

          <label>
            Email
            <input name="email" [(ngModel)]="email" type="email" placeholder="you@example.com" />
          </label>

          <label>
            Phone
            <input name="phone" [(ngModel)]="phone" placeholder="+91 98765 43210" />
          </label>

          <label>
            Password
            <input name="password" [(ngModel)]="password" type="password" placeholder="Create password" />
          </label>

          <label>
            Confirm password
            <input name="confirmPassword" [(ngModel)]="confirmPassword" type="password" placeholder="Confirm password" />
          </label>

          @if (message()) {
            <p class="message" [class.error]="messageType() === 'error'">{{ message() }}</p>
          }

          <button type="submit">Create account</button>

          <p class="switch-link">
            Already have an account?
            <a routerLink="/login">Login</a>
          </p>
        </form>
      </div>
    </section>
  `,
  styles: `
    .auth-page {
      padding: 2rem;
    }

    .auth-panel {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      min-height: calc(100vh - 220px);
      align-items: center;
    }

    .auth-copy,
    .auth-card {
      border-radius: 1.5rem;
      border: var(--glass-border);
      background: var(--glass-surface);
      box-shadow: var(--glass-shadow);
      backdrop-filter: var(--glass-button-blur);
      -webkit-backdrop-filter: var(--glass-button-blur);
    }

    .auth-copy {
      padding: 2.5rem;
      background:
        radial-gradient(circle at top right, rgba(243, 207, 122, 0.2), transparent 32%),
        var(--glass-surface-dark);
      color: #fff6e5;
    }

    .eyebrow {
      color: #f3cf7a;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-size: 0.72rem;
      font-weight: 700;
    }

    h1,
    h2 {
      font-family: 'Libre Baskerville', serif;
    }

    h1 {
      margin: 0.7rem 0 1rem;
      font-size: clamp(2.2rem, 5vw, 3.5rem);
      max-width: 10ch;
      line-height: 1.15;
    }

    .auth-copy p {
      max-width: 42ch;
      line-height: 1.8;
      color: #eadcbc;
    }

    .auth-card {
      display: grid;
      gap: 1rem;
      padding: 2rem;
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
      border-radius: 0.9rem;
      padding: 0.9rem 1rem;
      background: var(--glass-field-bg);
    }

    button {
      border: var(--glass-button-border);
      border-radius: 999px;
      padding: 0.95rem 1.2rem;
      background: var(--glass-button-bg-strong);
      color: var(--glass-button-text);
      cursor: pointer;
      font-weight: 700;
      backdrop-filter: var(--glass-button-blur);
      -webkit-backdrop-filter: var(--glass-button-blur);
      box-shadow: var(--glass-button-shadow);
    }

    .message {
      margin: 0;
      color: #2a7c4c;
    }

    .message.error {
      color: #9a4a35;
    }

    .switch-link {
      margin: 0;
      color: #6f7268;
    }

    .switch-link a {
      color: #6d4c1d;
      font-weight: 700;
      text-decoration: none;
    }

    @media (max-width: 900px) {
      .auth-panel {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .auth-page {
        padding: 1rem;
      }

      .auth-panel {
        min-height: auto;
      }

      .auth-copy,
      .auth-card {
        padding: 1.25rem;
      }

      button {
        width: 100%;
      }
    }
  `
})
export class SignupPageComponent {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(LitcartStoreService);
  private readonly router = inject(Router);

  protected name = '';
  protected email = '';
  protected phone = '';
  protected password = '';
  protected confirmPassword = '';
  protected readonly message = signal('');
  protected readonly messageType = signal<'success' | 'error'>('success');

  protected async signup(): Promise<void> {
    const result = await this.auth.signup({
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password,
      confirmPassword: this.confirmPassword
    });

    this.message.set(result.message);
    this.messageType.set(result.ok ? 'success' : 'error');

    if (!result.ok) {
      return;
    }

    this.store.contactProfile.set({
      name: this.name.trim(),
      email: this.email.trim(),
      phone: this.phone.trim()
    });
    await this.store.saveContact({
      name: this.name.trim(),
      email: this.email.trim(),
      phone: this.phone.trim()
    });

    const redirect = this.route.snapshot.queryParamMap.get('redirect');
    if (redirect) {
      await this.router.navigateByUrl(redirect);
      return;
    }

    await this.router.navigate(['/profile']);
  }
}
