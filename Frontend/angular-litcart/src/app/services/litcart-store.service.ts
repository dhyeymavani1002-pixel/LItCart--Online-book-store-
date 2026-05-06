import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { fallbackBooks } from '../data/fallback-books';
import {
  Book,
  CartItem,
  CheckoutFormValue,
  ContactProfile,
  Order
} from '../models/litcart.models';
import { AuthService } from './auth.service';
import { LitcartApiService } from './litcart-api.service';

const CART_KEY = 'angular-litcart-cart';
const WISHLIST_KEY = 'angular-litcart-wishlist';
const PROFILE_KEY = 'angular-litcart-profile';

@Injectable({ providedIn: 'root' })
export class LitcartStoreService {
  private readonly api = inject(LitcartApiService);
  private readonly auth = inject(AuthService);
  private readonly shippingFee = 49;
  private ordersOwnerKey = '';
  private readonly promoMap: Record<string, number> = {
    BOOK10: 10,
    LITCART20: 20,
    READ30: 30
  };

  readonly books = signal<Book[]>(fallbackBooks);
  readonly orders = signal<Order[]>([]);
  readonly cart = signal<CartItem[]>(this.readStorage<CartItem[]>(CART_KEY, []));
  readonly wishlist = signal<number[]>(this.readStorage<number[]>(WISHLIST_KEY, []));
  readonly contactProfile = signal<ContactProfile>(
    this.readStorage<ContactProfile>(PROFILE_KEY, {
      name: 'Rahul Patel',
      email: 'rahul.patel@example.com',
      phone: '+91 98765 43210'
    })
  );
  readonly promoCode = signal('');
  readonly promoPercent = signal(0);
  readonly backendConnected = signal(false);
  readonly initialized = signal(false);
  readonly lastOrder = signal<Order | null>(null);

  readonly featuredBooks = computed(() => this.books().slice(0, 4));
  readonly bestsellerBooks = computed(() =>
    [...this.books()]
      .sort((left, right) => right.ratingCount - left.ratingCount)
      .slice(0, 4)
  );
  readonly cartCount = computed(() => this.cart().reduce((sum, item) => sum + item.qty, 0));
  readonly subtotal = computed(() =>
    this.cart().reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0)
  );
  readonly tax = computed(() => Math.round(this.subtotal() * 0.05));
  readonly discountAmount = computed(() =>
    Math.round((this.subtotal() * this.promoPercent()) / 100)
  );
  readonly total = computed(() => this.subtotal() + this.shippingFee + this.tax() - this.discountAmount());

  constructor() {
    effect(() => {
      localStorage.setItem(CART_KEY, JSON.stringify(this.cart()));
    });

    effect(() => {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(this.wishlist()));
    });

    effect(() => {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(this.contactProfile()));
    });
  }

  async initialize(): Promise<void> {
    if (this.initialized()) {
      return;
    }

    this.initialized.set(true);
    await Promise.allSettled([this.loadBooks(), this.loadOrders(), this.loadHealth()]);
  }

  async loadBooks(): Promise<void> {
    try {
      const books = await this.api.getBooks();
      if (books.length > 0) {
        this.books.set(books);
      }
    } catch (error) {
      console.warn('Unable to load books from backend, using fallback data.', error);
    }
  }

  async loadOrders(): Promise<void> {
    const owner = this.currentOrderOwner();
    if (!owner) {
      this.ordersOwnerKey = '';
      this.orders.set([]);
      this.lastOrder.set(null);
      return;
    }

    const nextOwnerKey = `${owner.userId}|${owner.email}`;
    if (this.ordersOwnerKey !== nextOwnerKey) {
      this.ordersOwnerKey = nextOwnerKey;
      this.orders.set([]);
      this.lastOrder.set(null);
    }

    try {
      const orders = await this.api.getOrders(owner);
      this.orders.set(
        [...orders].sort(
          (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
        )
      );
    } catch (error) {
      console.warn('Unable to load orders from backend.', error);
    }
  }

  async loadHealth(): Promise<void> {
    try {
      this.backendConnected.set(await this.api.checkHealth());
    } catch (error) {
      this.backendConnected.set(false);
      console.warn('Unable to reach backend health endpoint.', error);
    }
  }

  getBookById(id: number): Book | undefined {
    return this.books().find((book) => book.id === id);
  }

  addToCart(book: Book, qty = 1): void {
    this.cart.update((items) => {
      const existing = items.find((item) => item.id === book.id);
      if (existing) {
        return items.map((item) =>
          item.id === book.id ? { ...item, qty: item.qty + qty } : item
        );
      }

      return [...items, { ...book, qty }];
    });
  }

  updateQuantity(bookId: number, delta: number): void {
    this.cart.update((items) =>
      items
        .map((item) =>
          item.id === bookId ? { ...item, qty: Math.max(1, item.qty + delta) } : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  removeFromCart(bookId: number): void {
    this.cart.update((items) => items.filter((item) => item.id !== bookId));
  }

  clearCart(): void {
    this.cart.set([]);
    this.clearPromo();
  }

  isWishlisted(bookId: number): boolean {
    return this.wishlist().includes(bookId);
  }

  toggleWishlist(bookId: number): void {
    this.wishlist.update((ids) =>
      ids.includes(bookId) ? ids.filter((id) => id !== bookId) : [...ids, bookId]
    );
  }

  applyPromo(rawCode: string): { ok: boolean; message: string } {
    const code = rawCode.trim().toUpperCase();
    const percent = this.promoMap[code];
    if (!percent) {
      this.promoCode.set('');
      this.promoPercent.set(0);
      return {
        ok: false,
        message: 'Invalid promo code. Try BOOK10, LITCART20, or READ30.'
      };
    }

    this.promoCode.set(code);
    this.promoPercent.set(percent);
    return {
      ok: true,
      message: `${code} applied successfully. ${percent}% discount unlocked.`
    };
  }

  clearPromo(): void {
    this.promoCode.set('');
    this.promoPercent.set(0);
  }

  async submitOrder(form: CheckoutFormValue): Promise<Order> {
    const currentUser = this.auth.currentUser();
    const customerEmail = currentUser?.email ?? form.email;
    const payload = {
      userId: currentUser?.id ?? '',
      userEmail: customerEmail,
      customer: {
        firstName: form.firstName,
        lastName: form.lastName,
        fullName: [form.firstName, form.lastName].filter(Boolean).join(' '),
        email: customerEmail,
        phone: form.phone,
        address: {
          line1: form.address,
          city: form.city,
          state: form.state,
          pin: form.pin,
          country: form.country
        }
      },
      items: this.cart().map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        qty: item.qty,
        cover: item.cover
      })),
      discount: this.discountAmount(),
      paymentMethod: form.paymentMethod
    };

    let savedOrder: Order;

    try {
      const result = await this.api.createOrder(payload);
      savedOrder = result.order;
      this.backendConnected.set(true);
    } catch (error) {
      console.warn('Unable to save the order to backend, generating a local fallback.', error);
      this.backendConnected.set(false);
      savedOrder = this.buildFallbackOrder(form);
    }

    this.orders.update((orders) => [savedOrder, ...orders.filter((order) => order.orderId !== savedOrder.orderId)]);
    this.lastOrder.set(savedOrder);
    this.contactProfile.set({
      name: savedOrder.customer.fullName || savedOrder.customer.firstName,
      email: savedOrder.customer.email,
      phone: savedOrder.customer.phone
    });
    this.clearCart();
    return savedOrder;
  }

  async saveContact(profile: ContactProfile): Promise<boolean> {
    this.contactProfile.set(profile);

    try {
      await this.api.saveUser(profile);
      this.backendConnected.set(true);
      return true;
    } catch (error) {
      console.warn('Unable to save contact details to backend.', error);
      this.backendConnected.set(false);
      return false;
    }
  }

  private buildFallbackOrder(form: CheckoutFormValue): Order {
    const createdAt = new Date().toISOString();
    const currentUser = this.auth.currentUser();
    const customerEmail = currentUser?.email ?? form.email;
    return {
      orderId: `#LC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      transactionId: `TXN-${Date.now().toString(36).toUpperCase()}`,
      userId: currentUser?.id ?? '',
      userEmail: customerEmail,
      customer: {
        firstName: form.firstName,
        lastName: form.lastName,
        fullName: [form.firstName, form.lastName].filter(Boolean).join(' '),
        email: customerEmail,
        phone: form.phone,
        address: {
          line1: form.address,
          city: form.city,
          state: form.state,
          pin: form.pin,
          country: form.country
        }
      },
      items: this.cart().map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        qty: item.qty,
        cover: item.cover
      })),
      subtotal: this.subtotal(),
      shipping: this.shippingFee,
      tax: this.tax(),
      discount: this.discountAmount(),
      total: this.total(),
      status: 'confirmed',
      paymentMethod: form.paymentMethod,
      createdAt
    };
  }

  private currentOrderOwner(): { userId: string; email: string } | null {
    const currentUser = this.auth.currentUser();
    if (!currentUser) {
      return null;
    }

    return {
      userId: currentUser.id,
      email: currentUser.email
    };
  }

  private readStorage<T>(key: string, fallback: T): T {
    try {
      const value = localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : fallback;
    } catch {
      return fallback;
    }
  }
}
