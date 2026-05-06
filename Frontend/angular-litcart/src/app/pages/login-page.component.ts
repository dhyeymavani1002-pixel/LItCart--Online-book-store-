import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="auth-page">
      <div class="auth-panel">
        <div class="auth-copy">
          <span class="eyebrow">Welcome back</span>
          <h1>Login to LitCart</h1>
          <p>Access your books, orders, wishlist, and profile from one place.</p>
        </div>

        <form class="auth-card" (ngSubmit)="login()">
          <h2>Login</h2>

          <label>
            Email
            <input name="email" [(ngModel)]="email" type="email" placeholder="you@example.com" />
          </label>

          <label>
            Password
            <input name="password" [(ngModel)]="password" type="password" placeholder="Enter password" />
          </label>

          @if (message()) {
            <p class="message" [class.error]="messageType() === 'error'">{{ message() }}</p>
          }

          <button type="submit">Login</button>

          <p class="switch-link">
            Don't have an account?
            <a routerLink="/signup">Create one</a>
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
      grid-template-columns: 1.1fr 0.9fr;
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
        radial-gradient(circle at top right, rgba(243, 207, 122, 0.18), transparent 34%),
        var(--glass-surface-dark);
      color: #f6f0df;
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
      font-size: clamp(2.3rem, 5vw, 3.6rem);
      max-width: 10ch;
      line-height: 1.15;
    }

    .auth-copy p {
      max-width: 42ch;
      line-height: 1.8;
      color: #d3c7b0;
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
export class LoginPageComponent {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected email = '';
  protected password = '';
  protected readonly message = signal('');
  protected readonly messageType = signal<'success' | 'error'>('success');

  protected async login(): Promise<void> {
    const result = await this.auth.login({
      email: this.email,
      password: this.password
    });

    this.message.set(result.message);
    this.messageType.set(result.ok ? 'success' : 'error');

    if (result.ok) {
      const redirect = this.route.snapshot.queryParamMap.get('redirect');
      if (redirect) {
        await this.router.navigateByUrl(redirect);
        return;
      }

      await this.router.navigate(['/profile']);
    }
  }
}
