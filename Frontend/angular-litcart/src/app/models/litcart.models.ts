export interface Review {
  name: string;
  rating: string;
  date: string;
  text: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  oldPrice?: number;
  rating: number;
  ratingCount: number;
  category: string;
  badge?: string;
  cover: string;
  desc: string;
  pages: number;
  publisher: string;
  reviews: Review[];
}

export interface CartItem extends Book {
  qty: number;
}

export interface Address {
  line1: string;
  city: string;
  state: string;
  pin: string;
  country: string;
}

export interface Customer {
  firstName: string;
  lastName?: string;
  fullName?: string;
  email: string;
  phone: string;
  address: Address;
}

export interface OrderItem {
  id: number;
  title: string;
  price: number;
  qty: number;
  cover?: string;
}

export interface Order {
  orderId: string;
  transactionId: string;
  userId?: string;
  userEmail?: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export interface ContactProfile {
  name: string;
  email: string;
  phone: string;
}

export interface CheckoutFormValue {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  country: string;
  paymentMethod: string;
}
