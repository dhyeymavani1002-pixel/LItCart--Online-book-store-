import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthUser, LoginFormValue, SignupFormValue } from '../models/auth.models';
import { Book, ContactProfile, Order } from '../models/litcart.models';

@Injectable({ providedIn: 'root' })
export class LitcartApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = this.resolveBaseUrl();

  getBooks(): Promise<Book[]> {
    return firstValueFrom(this.http.get<Book[]>(`${this.baseUrl}/books`));
  }

  getOrders(owner?: { userId?: string; email?: string }): Promise<Order[]> {
    let params = new HttpParams();
    if (owner?.userId) {
      params = params.set('userId', owner.userId);
    }
    if (owner?.email) {
      params = params.set('email', owner.email);
    }

    return firstValueFrom(this.http.get<Order[]>(`${this.baseUrl}/orders`, { params }));
  }

  async checkHealth(): Promise<boolean> {
    const result = await firstValueFrom(
      this.http.get<{ status: string; storageMode: string }>(`${this.baseUrl}/health`)
    );
    return result.storageMode === 'mongo';
  }

  createOrder(payload: unknown): Promise<{ message: string; order: Order }> {
    return firstValueFrom(this.http.post<{ message: string; order: Order }>(`${this.baseUrl}/orders`, payload));
  }

  login(payload: LoginFormValue): Promise<{ message: string; user: AuthUser }> {
    return firstValueFrom(this.http.post<{ message: string; user: AuthUser }>(`${this.baseUrl}/auth/login`, payload));
  }

  signup(payload: SignupFormValue): Promise<{ message: string; user: AuthUser }> {
    return firstValueFrom(this.http.post<{ message: string; user: AuthUser }>(`${this.baseUrl}/auth/signup`, payload));
  }

  saveUser(payload: ContactProfile): Promise<unknown> {
    return firstValueFrom(this.http.post(`${this.baseUrl}/users`, payload));
  }

  private resolveBaseUrl(): string {
    const override = (window as Window & { LITCART_API_URL?: string }).LITCART_API_URL;
    if (override) {
      return override;
    }

    const hostname = window.location.hostname || 'localhost';
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    return `${protocol}//${hostname}:3000`;
  }
}
