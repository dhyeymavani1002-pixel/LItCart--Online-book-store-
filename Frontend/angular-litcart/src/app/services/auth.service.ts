import { Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthUser, LoginFormValue, SignupFormValue } from '../models/auth.models';
import { LitcartApiService } from './litcart-api.service';

const AUTH_CURRENT_USER_KEY = 'litcart-current-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(LitcartApiService);
  readonly currentUser = signal<AuthUser | null>(this.readStorage<AuthUser | null>(AUTH_CURRENT_USER_KEY, null));

  async signup(form: SignupFormValue): Promise<{ ok: boolean; message: string }> {
    if (form.password !== form.confirmPassword) {
      return { ok: false, message: 'Password and confirm password do not match.' };
    }

    try {
      const result = await this.api.signup({
        ...form,
        email: form.email.trim().toLowerCase()
      });
      this.setCurrentUser(result.user);
      return { ok: true, message: result.message };
    } catch (error) {
      return { ok: false, message: this.getErrorMessage(error, 'Signup failed.') };
    }
  }

  async login(form: LoginFormValue): Promise<{ ok: boolean; message: string }> {
    try {
      const result = await this.api.login({
        email: form.email.trim().toLowerCase(),
        password: form.password
      });
      this.setCurrentUser(result.user);
      return { ok: true, message: result.message };
    } catch (error) {
      return { ok: false, message: this.getErrorMessage(error, 'Login failed.') };
    }
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(AUTH_CURRENT_USER_KEY);
  }

  syncCurrentUserProfile(profile: Pick<AuthUser, 'name' | 'phone'>): void {
    const currentUser = this.currentUser();
    if (!currentUser) {
      return;
    }

    this.setCurrentUser({
      ...currentUser,
      name: profile.name,
      phone: profile.phone
    });
  }

  private setCurrentUser(user: AuthUser): void {
    this.currentUser.set(user);
    localStorage.setItem(AUTH_CURRENT_USER_KEY, JSON.stringify(user));
  }

  private readStorage<T>(key: string, fallback: T): T {
    try {
      const value = localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      return error.error?.error || fallback;
    }
    return fallback;
  }
}
