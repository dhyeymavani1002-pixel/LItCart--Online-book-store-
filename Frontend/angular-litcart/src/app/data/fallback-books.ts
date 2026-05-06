import { Book } from '../models/litcart.models';

export const fallbackBooks: Book[] = [
  {
    id: 1,
    title: 'The Midnight Library',
    author: 'Matt Haig',
    price: 499,
    oldPrice: 699,
    rating: 4.8,
    ratingCount: 12453,
    category: 'fiction',
    badge: 'Bestseller',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=900&q=80',
    desc: 'A dazzling novel about all the choices that go into a life well lived.',
    pages: 288,
    publisher: 'Canongate Books',
    reviews: [
      { name: 'Aryan Patel', rating: '5/5', date: 'March 2025', text: 'Absolutely captivating. A must-read.' },
      { name: 'Neha Joshi', rating: '4/5', date: 'February 2025', text: 'Beautiful and moving with a creative concept.' }
    ]
  },
  {
    id: 2,
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 399,
    oldPrice: 599,
    rating: 4.9,
    ratingCount: 34821,
    category: 'self-help',
    badge: 'Top Rated',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=900&q=80',
    desc: 'Tiny changes, remarkable results, and practical systems for lasting habits.',
    pages: 320,
    publisher: 'Penguin Random House',
    reviews: [
      { name: 'Vivek Sharma', rating: '5/5', date: 'April 2025', text: 'Every concept is practical and usable.' },
      { name: 'Pooja Mehta', rating: '5/5', date: 'March 2025', text: 'Perfect for improving daily routines.' }
    ]
  },
  {
    id: 3,
    title: 'Dune',
    author: 'Frank Herbert',
    price: 549,
    oldPrice: 749,
    rating: 4.7,
    ratingCount: 89234,
    category: 'sci-fi',
    badge: 'Classic',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&q=80',
    desc: 'Epic science fiction filled with politics, prophecy, and survival on Arrakis.',
    pages: 896,
    publisher: 'Chilton Books',
    reviews: [
      { name: 'Suresh Nair', rating: '5/5', date: 'March 2025', text: 'The world-building is unparalleled.' },
      { name: 'Meera Singh', rating: '4/5', date: 'February 2025', text: 'Dense but incredibly rewarding.' }
    ]
  },
  {
    id: 4,
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    price: 449,
    oldPrice: 599,
    rating: 4.5,
    ratingCount: 21567,
    category: 'mystery',
    badge: 'New',
    cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=900&q=80',
    desc: 'A gripping psychological thriller about silence, obsession, and truth.',
    pages: 336,
    publisher: 'Celadon Books',
    reviews: [
      { name: 'Ritesh Kapoor', rating: '5/5', date: 'April 2025', text: 'The twist at the end was unforgettable.' },
      { name: 'Sunita Verma', rating: '4/5', date: 'March 2025', text: 'Gripping and very well constructed.' }
    ]
  },
  {
    id: 5,
    title: 'Ikigai',
    author: 'Hector Garcia',
    price: 299,
    oldPrice: 450,
    rating: 4.6,
    ratingCount: 15234,
    category: 'self-help',
    badge: 'Popular',
    cover: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=900&q=80',
    desc: 'A calm, thoughtful exploration of purpose and the Japanese secret to a happy life.',
    pages: 208,
    publisher: 'Hutchinson',
    reviews: [
      { name: 'Priya Iyer', rating: '5/5', date: 'April 2025', text: 'A beautiful philosophy anyone can apply.' },
      { name: 'Rahul Desai', rating: '4/5', date: 'March 2025', text: 'Short, calm, and insightful.' }
    ]
  },
  {
    id: 6,
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    price: 699,
    oldPrice: 899,
    rating: 4.8,
    ratingCount: 67832,
    category: 'non-fiction',
    badge: 'Must Read',
    cover: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=900&q=80',
    desc: 'A brief and brilliant history of humankind from prehistory to modern systems.',
    pages: 464,
    publisher: 'Harper Collins',
    reviews: [
      { name: 'Vikram Bose', rating: '5/5', date: 'April 2025', text: 'Makes history feel fascinating.' },
      { name: 'Ananya Roy', rating: '5/5', date: 'March 2025', text: 'Absolutely mind-blowing.' }
    ]
  }
];
