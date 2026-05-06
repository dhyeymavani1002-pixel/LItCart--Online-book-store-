// ===== DATA =====
const API_BASE_URL = window.LITCART_API_URL || 'http://localhost:3000';

const fallbackBooks = [
  { id:1, title:"The Midnight Library", author:"Matt Haig", price:499, oldPrice:699, rating:4.8, ratingCount:12453, category:"fiction", badge:"Bestseller", cover:"https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80", desc:"A dazzling novel about all the choices that go into a life well lived. Nora Seed finds herself in a Midnight Library where every book represents a different life she could have lived.", pages:288, publisher:"Canongate Books",
    reviews:[{name:"Aryan Patel",rating:"★★★★★",date:"March 2025",text:"Absolutely captivating! Could not put it down. A must-read."},{name:"Neha Joshi",rating:"★★★★☆",date:"Feb 2025",text:"Beautiful and moving. The concept is so creative and original."},{name:"Karan Shah",rating:"★★★★★",date:"Jan 2025",text:"One of the best books I've read in years. Highly recommended."},{name:"Riya Gupta",rating:"★★★★☆",date:"Dec 2024",text:"Thoughtful and well-written. Perfect for a rainy day read."}]},
  { id:2, title:"Atomic Habits", author:"James Clear", price:399, oldPrice:599, rating:4.9, ratingCount:34821, category:"self-help", badge:"Top Rated", cover:"https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80", desc:"Tiny Changes, Remarkable Results. An easy and proven way to build good habits and break bad ones. Transform your life through the science of habit formation.", pages:320, publisher:"Penguin Random House",
    reviews:[{name:"Vivek Sharma",rating:"★★★★★",date:"April 2025",text:"Changed my life completely. Every concept is practical and immediately applicable."},{name:"Pooja Mehta",rating:"★★★★★",date:"March 2025",text:"Must-read for anyone who wants to improve their daily routines."},{name:"Ravi Kumar",rating:"★★★★☆",date:"Feb 2025",text:"Excellent scientific approach to habit formation. Very well researched."},{name:"Anita Bose",rating:"★★★★★",date:"Jan 2025",text:"Clear and concise. The best productivity book I've ever read."}]},
  { id:3, title:"Dune", author:"Frank Herbert", price:549, oldPrice:749, rating:4.7, ratingCount:89234, category:"sci-fi", badge:"Classic", cover:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&q=80", desc:"A stunning blend of adventure and mysticism, environmentalism and politics. Set on the desert planet Arrakis, it's one of the greatest science fiction novels ever written.", pages:896, publisher:"Chilton Books",
    reviews:[{name:"Suresh Nair",rating:"★★★★★",date:"March 2025",text:"The greatest sci-fi novel ever written. The world-building is unparalleled."},{name:"Meera Singh",rating:"★★★★☆",date:"Feb 2025",text:"Dense but incredibly rewarding. A true epic."},{name:"Akash Patel",rating:"★★★★★",date:"Jan 2025",text:"Herbert's imagination is breathtaking. A must for any sci-fi fan."},{name:"Devika Rao",rating:"★★★★☆",date:"Dec 2024",text:"Complex and rich. Takes time to get into but worth every page."}]},
  { id:4, title:"The Silent Patient", author:"Alex Michaelides", price:449, oldPrice:599, rating:4.5, ratingCount:21567, category:"mystery", badge:"New", cover:"https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&q=80", desc:"Alicia Berenson has lived what seems a perfect life — until the day she shoots her husband five times in the face and then never speaks another word.", pages:336, publisher:"Celadon Books",
    reviews:[{name:"Ritesh Kapoor",rating:"★★★★★",date:"April 2025",text:"The twist at the end blew my mind! Couldn't put it down."},{name:"Sunita Verma",rating:"★★★★☆",date:"March 2025",text:"Gripping psychological thriller. Very well constructed."},{name:"Amir Shah",rating:"★★★★★",date:"Feb 2025",text:"One of the best thrillers I've read. Unexpected ending!"},{name:"Kavya Nair",rating:"★★★★☆",date:"Jan 2025",text:"Dark and addictive. Perfect page-turner for mystery lovers."}]},
  { id:5, title:"Ikigai", author:"Héctor García", price:299, oldPrice:450, rating:4.6, ratingCount:15234, category:"self-help", badge:"Popular", cover:"https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=300&q=80", desc:"The Japanese secret to a long and happy life. Discover your reason for being through the ancient wisdom of Okinawa, the region with the world's longest-living people.", pages:208, publisher:"Hutchinson",
    reviews:[{name:"Priya Iyer",rating:"★★★★★",date:"April 2025",text:"A beautiful, simple philosophy that anyone can apply to their life."},{name:"Rahul Desai",rating:"★★★★☆",date:"March 2025",text:"Short but profound. Changed how I think about purpose and joy."},{name:"Nisha Pillai",rating:"★★★★☆",date:"Feb 2025",text:"Calming and insightful. A perfect book for finding direction."},{name:"Arjun Menon",rating:"★★★★★",date:"Jan 2025",text:"Loved every page. The concept of ikigai is life-changing."}]},
  { id:6, title:"Sapiens", author:"Yuval Noah Harari", price:699, oldPrice:899, rating:4.8, ratingCount:67832, category:"non-fiction", badge:"Must Read", cover:"https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300&q=80", desc:"A brief history of humankind from the Stone Age to the present. How did our species succeed in the battle for dominance? Why did our foraging ancestors unite in revolutions?", pages:464, publisher:"Harper Collins",
    reviews:[{name:"Vikram Bose",rating:"★★★★★",date:"April 2025",text:"Harari makes history feel like the most fascinating subject in the world."},{name:"Ananya Roy",rating:"★★★★★",date:"March 2025",text:"Absolutely mind-blowing. Reframes everything you know about humanity."},{name:"Sanjay Gupta",rating:"★★★★☆",date:"Feb 2025",text:"Dense with ideas but compulsively readable. A modern classic."},{name:"Deepa Krishnan",rating:"★★★★★",date:"Jan 2025",text:"Every educated person should read this. Brilliant and accessible."}]},
  { id:7, title:"The Alchemist", author:"Paulo Coelho", price:299, oldPrice:399, rating:4.7, ratingCount:145678, category:"fiction", badge:"Timeless", cover:"https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&q=80", desc:"A symbolic novel about following your dream and realizing your Personal Legend. Santiago's journey teaches us about the importance of listening to our hearts.", pages:208, publisher:"HarperOne",
    reviews:[{name:"Lakshmi Sharma",rating:"★★★★★",date:"April 2025",text:"A timeless masterpiece. Read it every year and discover something new."},{name:"Rohan Mehta",rating:"★★★★★",date:"March 2025",text:"Magical and inspiring. One of those books that stays with you forever."},{name:"Pooja Agarwal",rating:"★★★★☆",date:"Feb 2025",text:"Simple but profound. A beautiful story about following your dreams."},{name:"Chirag Patel",rating:"★★★★★",date:"Jan 2025",text:"A must-read. Coelho's writing is luminous and deeply moving."}]},
  { id:8, title:"Gone Girl", author:"Gillian Flynn", price:379, oldPrice:549, rating:4.4, ratingCount:32145, category:"mystery", badge:"Thriller", cover:"https://images.unsplash.com/photo-1495640452828-3df6795cf69b?w=300&q=80", desc:"On a warm summer morning in North Carthage, Missouri, it is Nick and Amy Dunne's fifth wedding anniversary. Presents are unwrapped, champagne is flowing — and then Amy disappears.", pages:432, publisher:"Crown Publishing",
    reviews:[{name:"Simran Kaur",rating:"★★★★★",date:"April 2025",text:"Twisted, dark, and utterly brilliant. Flynn is a genius."},{name:"Nikhil Reddy",rating:"★★★★☆",date:"March 2025",text:"Kept me on the edge of my seat the entire time. Incredible thriller."},{name:"Ishaan Bansal",rating:"★★★★☆",date:"Feb 2025",text:"Complex characters and an unpredictable plot. Highly recommended."},{name:"Shruti Joshi",rating:"★★★★★",date:"Jan 2025",text:"Couldn't put it down. The writing is sharp and clever throughout."}]},
];

let books = [...fallbackBooks];
let cart = [];
let wishlist = [];
let orderHistory = [];
let currentBook = null;
let currentQty = 1;
let activeCategory = 'all';
let promoApplied = false;
const PROMOS = { 'BOOK10': 10, 'LITCART20': 20, 'READ30': 30 };
const LAST_ORDER_STORAGE_KEY = 'litcart-last-confirmed-order';
let lastConfirmedOrder = loadStoredLastOrder();

async function apiRequest(path, options = {}) {
  const requestOptions = {
    method: options.method || 'GET',
    headers: { ...(options.headers || {}) }
  };

  if (options.body) {
    requestOptions.body = options.body;
    requestOptions.headers['Content-Type'] = requestOptions.headers['Content-Type'] || 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${path}`, requestOptions);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error((data && data.error) || `Request failed with status ${response.status}`);
  }

  return data;
}

function getCurrentProfileEmail(fallback = '') {
  const profileEmail = document.getElementById('pf-email')?.value?.trim();
  if (profileEmail) return profileEmail;

  const displayEmail = document.getElementById('profileDisplayEmail')?.textContent?.split('·')[0]?.trim();
  if (displayEmail) return displayEmail;

  return fallback.trim();
}

function getOrdersApiPath(fallbackEmail = '') {
  const email = getCurrentProfileEmail(fallbackEmail);
  return email ? `/orders?email=${encodeURIComponent(email)}` : '/orders';
}

async function loadBooksFromApi() {
  try {
    const apiBooks = await apiRequest('/books');
    if (Array.isArray(apiBooks) && apiBooks.length > 0) {
      books = apiBooks;
      syncCurrentBook();
    }
  } catch (error) {
    books = [...fallbackBooks];
    console.warn('Using fallback books because the backend is unavailable.', error);
  }

  renderFeatured();
  renderBestsellers();

  if (document.getElementById('page-listing')?.classList.contains('active')) {
    applyFilters();
  }
}

async function loadOrdersFromApi() {
  const existingOrders = [...orderHistory];
  try {
    const apiOrders = await apiRequest(getOrdersApiPath());
    orderHistory = Array.isArray(apiOrders) ? apiOrders.map(normalizeOrder) : [];
    if (lastConfirmedOrder) {
      const refreshedOrder = orderHistory.find(order => order.orderId === lastConfirmedOrder.orderId);
      if (refreshedOrder) {
        storeLastConfirmedOrder(refreshedOrder);
      }
    } else if (orderHistory.length > 0) {
      storeLastConfirmedOrder(orderHistory[0]);
    }
  } catch (error) {
    orderHistory = existingOrders;
    console.warn('Unable to load order history from the backend.', error);
  }

  renderOrderHistory();
  updateProfileStats();
  renderOrdersPage();
  renderSuccessOrder();
}

function syncCurrentBook() {
  if (!currentBook) return;
  const refreshedBook = books.find(book => book.id === currentBook.id);
  if (refreshedBook) currentBook = refreshedBook;
}

function formatCurrency(value) {
  return '₹' + Number(value || 0).toLocaleString();
}

function formatOrderDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Just now';
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function getSelectedPaymentMethod() {
  return document
    .querySelector('.payment-option.selected label')
    ?.textContent.replace(/\s+/g, ' ')
    .trim() || 'Credit / Debit Card';
}

function getOrderStatusClass(status) {
  const normalized = String(status || 'processing').toLowerCase();
  if (
    normalized === 'pending' ||
    normalized === 'delivered' ||
    normalized === 'processing' ||
    normalized === 'confirmed'
  ) {
    return normalized;
  }
  return 'processing';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function loadStoredLastOrder() {
  try {
    const raw = localStorage.getItem(LAST_ORDER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Unable to read the last confirmed order from storage.', error);
    return null;
  }
}

function storeLastConfirmedOrder(order) {
  lastConfirmedOrder = order;
  try {
    localStorage.setItem(LAST_ORDER_STORAGE_KEY, JSON.stringify(order));
  } catch (error) {
    console.warn('Unable to store the last confirmed order locally.', error);
  }
}

function createClientTransactionId(seed = Date.now().toString(36).toUpperCase()) {
  const stableSeed = String(seed).replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(-12);
  return 'TXN-' + (stableSeed || Date.now().toString(36).toUpperCase());
}

function normalizeOrder(order) {
  if (!order) return null;

  return {
    ...order,
    transactionId: order.transactionId || createClientTransactionId(order.orderId || order.createdAt),
    status: order.status || 'confirmed',
    paymentMethod: order.paymentMethod || 'Credit / Debit Card',
    subtotal: Number(order.subtotal || 0),
    shipping: Number(order.shipping || 49),
    tax: Number(order.tax || 0),
    discount: Number(order.discount || 0),
    total: Number(order.total || 0),
    items: Array.isArray(order.items) ? order.items : [],
    customer: {
      ...(order.customer || {}),
      address: { ...((order.customer && order.customer.address) || {}) }
    }
  };
}

function formatAddress(address = {}) {
  return [address.line1, address.city, address.state, address.pin, address.country]
    .filter(Boolean)
    .join(', ');
}

function ensureOrdersPage() {
  if (document.getElementById('page-orders')) return;

  const profilePage = document.getElementById('page-profile');
  if (!profilePage) return;

  const ordersPage = document.createElement('div');
  ordersPage.id = 'page-orders';
  ordersPage.className = 'page';
  ordersPage.innerHTML = `
    <div class="page-hero">
      <div class="breadcrumb"><span onclick="showPage('home')">Home</span><span class="sep">></span><span>Orders</span></div>
      <h1>Order Dashboard</h1>
      <p>Review every confirmed order, transaction reference, customer detail, and delivery address.</p>
    </div>
    <div class="orders-page">
      <div class="orders-toolbar">
        <div>
          <div class="section-title">Saved Orders</div>
          <div class="section-subtitle" id="ordersPageSubtitle">0 orders available</div>
        </div>
        <button class="profile-save-btn" onclick="refreshOrdersPage()">Refresh Orders</button>
      </div>
      <div id="ordersPageList" class="orders-grid">
        <div class="orders-empty">No orders yet. Confirm an order to see full details here.</div>
      </div>
    </div>`;

  profilePage.before(ordersPage);
}

function ensureSuccessDetailsPanel() {
  const successCard = document.querySelector('#page-success .success-card');
  if (!successCard || document.getElementById('successTransactionId')) return;

  successCard.classList.add('success-card-wide');

  const orderLine = document.getElementById('successOrderId')?.closest('p');
  const backHomeButton = successCard.querySelector('.btn-primary');
  const detailsWrapper = document.createElement('div');

  detailsWrapper.innerHTML = `
    <div class="success-badges">
      <span class="success-badge">Status: <strong id="successStatus">Confirmed</strong></span>
      <span class="success-badge">Payment: <strong id="successPaymentMethod">Credit / Debit Card</strong></span>
    </div>
    <div class="success-details-grid">
      <div class="success-detail-card">
        <h3>Order Summary</h3>
        <div class="success-detail-row"><span>Transaction ID</span><strong id="successTransactionId">TXN-PENDING</strong></div>
        <div class="success-detail-row"><span>Placed On</span><strong id="successPlacedAt">Just now</strong></div>
        <div class="success-detail-row"><span>Total Paid</span><strong id="successTotal">₹0</strong></div>
      </div>
      <div class="success-detail-card">
        <h3>Customer Details</h3>
        <div class="success-detail-row"><span>Name</span><strong id="successCustomerName">Rahul Patel</strong></div>
        <div class="success-detail-row"><span>Email</span><strong id="successCustomerEmail">rahul@example.com</strong></div>
        <div class="success-detail-row"><span>Phone</span><strong id="successCustomerPhone">+91 98765 43210</strong></div>
        <div class="success-address" id="successCustomerAddress">Ring Road, Surat, Gujarat - 395001, India</div>
      </div>
    </div>
    <div class="success-detail-card success-items-card">
      <h3>Items In This Order</h3>
      <div id="successItemsList">
        <div class="success-empty">Your confirmed items will appear here.</div>
      </div>
    </div>`;

  if (orderLine) {
    orderLine.insertAdjacentElement('afterend', detailsWrapper);
  } else if (backHomeButton) {
    backHomeButton.insertAdjacentElement('beforebegin', detailsWrapper);
  } else {
    successCard.appendChild(detailsWrapper);
  }

  if (backHomeButton && !successCard.querySelector('.success-orders-button')) {
    const ordersButton = document.createElement('button');
    ordersButton.className = 'btn-secondary success-orders-button';
    ordersButton.textContent = 'View All Orders';
    ordersButton.onclick = () => showPage('orders');
    backHomeButton.insertAdjacentElement('beforebegin', ordersButton);
  }
}

function ensureOrderExperience() {
  ensureOrdersPage();
  ensureSuccessDetailsPanel();
}

// ===== PAGE NAV =====
function showPage(page) {
  ensureOrderExperience();
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  window.scrollTo(0,0);
  if(page==='home') { renderFeatured(); renderBestsellers(); }
  if(page==='listing') { applyFilters(); }
  if(page==='cart') renderCart();
  if(page==='checkout') renderCheckout();
  if(page==='success') renderSuccessOrder();
  if(page==='orders') renderOrdersPage();
  if(page==='profile') renderProfile();
}

// ===== RENDER =====
function bookCardHTML(b) {
  return `
  <div class="book-card" onclick="openBook(${b.id})">
    <div class="book-cover">
      <img src="${b.cover}" alt="${b.title}" loading="lazy">
      ${b.badge ? `<div class="book-badge">${b.badge}</div>` : ''}
    </div>
    <div class="book-info">
      <div class="book-title">${b.title}</div>
      <div class="book-author">${b.author}</div>
      <div class="book-rating">
        <span class="stars">${starsHTML(b.rating)}</span>
        <span class="rating-num">(${b.ratingCount.toLocaleString()})</span>
      </div>
      <div class="book-footer">
        <div class="book-price">₹${b.price}</div>
        <button class="add-to-cart-mini" onclick="event.stopPropagation();addToCart(${b.id})">+ Cart</button>
      </div>
    </div>
  </div>`;
}

function starsHTML(r) {
  const full = Math.floor(r);
  const half = r % 1 >= 0.5 ? 1 : 0;
  return '★'.repeat(full) + (half?'½':'') + '☆'.repeat(5-full-half);
}

function renderFeatured() {
  const el = document.getElementById('featuredBooks');
  if(el) el.innerHTML = books.slice(0,8).map(b => bookCardHTML(b)).join('');
}

function renderBestsellers() {
  const el = document.getElementById('bestsellersGrid');
  if(el) el.innerHTML = [...books].sort((a,b)=>b.ratingCount-a.ratingCount).slice(0,4).map(b => bookCardHTML(b)).join('');
}

// ===== FILTERING & SORTING (FIXED) =====
function applyFilters() {
  const checkedGenres = [...document.querySelectorAll('#page-listing input[type="checkbox"]:checked')].map(cb => cb.value);
  const maxPrice = parseInt(document.getElementById('priceRange').value);
  const minRating = parseFloat(document.querySelector('input[name="rating"]:checked').value);
  const sortVal = document.getElementById('sortSelect').value;
  const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();

  let filtered = [...books];

  // Genre filter
  if(checkedGenres.length > 0) {
    filtered = filtered.filter(b => checkedGenres.includes(b.category));
  }

  // Active category from pill
  if(activeCategory !== 'all') {
    filtered = filtered.filter(b => b.category === activeCategory);
  }

  // Price filter
  filtered = filtered.filter(b => b.price <= maxPrice);

  // Rating filter
  if(minRating > 0) filtered = filtered.filter(b => b.rating >= minRating);

  // Search filter
  if(searchQuery) {
    filtered = filtered.filter(b =>
      b.title.toLowerCase().includes(searchQuery) ||
      b.author.toLowerCase().includes(searchQuery) ||
      b.category.toLowerCase().includes(searchQuery)
    );
  }

  // Sort
  if(sortVal === 'price-asc') filtered.sort((a,b) => a.price - b.price);
  else if(sortVal === 'price-desc') filtered.sort((a,b) => b.price - a.price);
  else if(sortVal === 'rating') filtered.sort((a,b) => b.rating - a.rating);
  else if(sortVal === 'popular') filtered.sort((a,b) => b.ratingCount - a.ratingCount);

  const el = document.getElementById('listingGrid');
  const countEl = document.getElementById('resultCount');
  if(el) {
    if(filtered.length === 0) {
      el.innerHTML = `<div class="no-results" style="grid-column:1/-1;">😕 No books match your filters. <a style="color:var(--gold);cursor:pointer;" onclick="clearFilters()">Clear filters</a></div>`;
    } else {
      el.innerHTML = filtered.map(b => bookCardHTML(b)).join('');
    }
  }
  if(countEl) countEl.innerHTML = `Showing <strong>${filtered.length}</strong> of <strong>${books.length}</strong> books`;
}

function clearFilters() {
  document.querySelectorAll('#page-listing input[type="checkbox"]').forEach(cb => cb.checked = false);
  document.getElementById('priceRange').value = 2000;
  document.getElementById('priceMax').textContent = '₹2000';
  document.getElementById('r0').checked = true;
  document.getElementById('sortSelect').value = 'relevant';
  document.getElementById('searchInput').value = '';
  activeCategory = 'all';
  document.querySelectorAll('.cat-pill').forEach((p,i) => { p.classList.toggle('active', i===0); });
  applyFilters();
}

function filterCategory(el, cat) {
  activeCategory = cat;
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  if(el) el.classList.add('active');
  // Uncheck genre checkboxes when using pill
  document.querySelectorAll('#page-listing input[type="checkbox"]').forEach(cb => cb.checked = false);
}

// ===== SEARCH =====
function liveSearch(val) {
  if(document.getElementById('page-listing').classList.contains('active')) {
    applyFilters();
  }
}

function doSearch() {
  showPage('listing');
  setTimeout(applyFilters, 50);
}

function handleSearch(e) {
  if(e.key==='Enter') { doSearch(); }
}

function updatePriceLabel(v) {
  const el = document.getElementById('priceMax');
  if(el) el.textContent = '₹'+v;
}

// ===== BOOK DETAIL =====
function openBook(id) {
  const b = books.find(x=>x.id===id);
  if(!b) return;
  currentBook = b;
  currentQty = 1;
  document.getElementById('detailQty').textContent = 1;
  document.getElementById('detailBreadcrumb').textContent = b.title;
  document.getElementById('detailPageTitle').textContent = b.title;
  document.getElementById('detailImg').src = b.cover;
  document.getElementById('detailImg').alt = b.title;
  document.getElementById('detailCat').textContent = b.category.toUpperCase();
  document.getElementById('detailTitle').textContent = b.title;
  document.getElementById('detailAuthor').textContent = 'by ' + b.author;
  document.getElementById('detailStars').textContent = starsHTML(b.rating);
  document.getElementById('detailRatingText').textContent = b.rating + ' · ' + b.ratingCount.toLocaleString() + ' reviews';
  document.getElementById('detailPrice').innerHTML = '₹' + b.price + (b.oldPrice ? ` <span class="old-price">₹${b.oldPrice}</span>` : '');
  document.getElementById('detailDesc').textContent = b.desc;
  document.getElementById('detailPub').textContent = b.publisher;
  document.getElementById('detailPages').textContent = b.pages;

  // Book-specific reviews
  const reviewsEl = document.getElementById('detailReviews');
  if(reviewsEl && b.reviews) {
    reviewsEl.innerHTML = b.reviews.map(r => `
      <div class="review-card">
        <div class="review-header">
          <div><div class="reviewer">${r.name}</div><div class="stars" style="font-size:0.8rem;">${r.rating}</div></div>
          <span class="review-date">${r.date}</span>
        </div>
        <p class="review-text">${r.text}</p>
      </div>`).join('');
  }

  // Wishlist button state
  updateWishlistBtn();

  // Similar books
  const sim = books.filter(x=>x.id!==id).slice(0,4);
  const el = document.getElementById('similarBooks');
  if(el) el.innerHTML = sim.map(b=>bookCardHTML(b)).join('');
  showPage('detail');
}

function changeQty(d) {
  currentQty = Math.max(1, currentQty + d);
  document.getElementById('detailQty').textContent = currentQty;
}

function addCurrentToCart() {
  if(!currentBook) return;
  addToCart(currentBook.id, currentQty);
}

// ===== WISHLIST (FIXED) =====
function toggleWishlist() {
  if(!currentBook) return;
  const idx = wishlist.findIndex(x => x.id === currentBook.id);
  if(idx === -1) {
    wishlist.push(currentBook);
    showToast('❤️ "' + currentBook.title + '" added to wishlist!');
  } else {
    wishlist.splice(idx, 1);
    showToast('💔 Removed from wishlist');
  }
  updateWishlistBtn();
  updateWishlistCount();
}

function updateWishlistBtn() {
  const btn = document.getElementById('wishlistBtn');
  if(!btn || !currentBook) return;
  const inWishlist = wishlist.some(x => x.id === currentBook.id);
  btn.textContent = inWishlist ? '❤️ In Wishlist' : '♡ Add to Wishlist';
  btn.classList.toggle('wishlisted', inWishlist);
}

function updateWishlistCount() {
  const el = document.getElementById('wishlistCount');
  if(el) el.textContent = wishlist.length;
}

// ===== CART =====
function addToCart(id, qty=1) {
  const b = books.find(x=>x.id===id);
  if(!b) return;
  const existing = cart.find(x=>x.id===id);
  if(existing) existing.qty += qty;
  else cart.push({...b, qty});
  updateCartCount();
  showToast('📚 "' + b.title + '" added to cart!');
}

function removeFromCart(id) {
  cart = cart.filter(x=>x.id!==id);
  updateCartCount();
  renderCart();
}

function updateCartCount() {
  const total = cart.reduce((s,x)=>s+x.qty,0);
  document.getElementById('cartCount').textContent = total;
}

function renderCart() {
  const el = document.getElementById('cartItems');
  if(!el) return;
  const sub = document.getElementById('cartHeroSubtitle');
  if(cart.length===0) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">🛒</div><h3>Your cart is empty</h3><p>Browse our collection and add books you love!</p><br><button class="btn-primary" onclick="showPage('listing')">Browse Books</button></div>`;
    if(sub) sub.textContent = 'No items yet';
  } else {
    el.innerHTML = cart.map(b=>`
    <div class="cart-item">
      <img class="cart-item-img" src="${b.cover}" alt="${b.title}">
      <div class="cart-item-body">
        <div class="cart-item-title">${b.title}</div>
        <div class="cart-item-author">by ${b.author}</div>
        <div class="stars" style="font-size:0.8rem;">${starsHTML(b.rating)}</div>
        <div class="cart-item-footer">
          <div style="display:flex;align-items:center;gap:0.5rem;">
            <div class="qty-btns"><button class="qty-btn" onclick="updateQty(${b.id},-1)">−</button><div class="qty-num">${b.qty}</div><button class="qty-btn" onclick="updateQty(${b.id},1)">+</button></div>
          </div>
          <div style="text-align:right">
            <div class="cart-item-price">₹${(b.price*b.qty).toLocaleString()}</div>
            <button class="remove-btn" onclick="removeFromCart(${b.id})">Remove</button>
          </div>
        </div>
      </div>
    </div>`).join('');
    if(sub) sub.textContent = cart.length + ' item' + (cart.length>1?'s':'') + ' in your cart';
  }
  updateSummary();
}

function updateQty(id, d) {
  const item = cart.find(x=>x.id===id);
  if(!item) return;
  item.qty = Math.max(1, item.qty + d);
  updateCartCount();
  renderCart();
}

// ===== PROMO CODE (FIXED) =====
function applyPromo() {
  const code = document.getElementById('promoInput').value.trim().toUpperCase();
  const msgEl = document.getElementById('promoMsg');
  if(!code) { msgEl.textContent = 'Please enter a promo code.'; msgEl.className='promo-msg error'; return; }
  if(PROMOS[code]) {
    promoApplied = PROMOS[code];
    msgEl.textContent = `✅ "${code}" applied! ${promoApplied}% discount unlocked.`;
    msgEl.className = 'promo-msg success';
    updateSummary();
  } else {
    promoApplied = false;
    msgEl.textContent = `❌ Invalid promo code. Try BOOK10, LITCART20, or READ30.`;
    msgEl.className = 'promo-msg error';
    updateSummary();
  }
}

function updateSummary() {
  const sub = cart.reduce((s,x)=>s+x.price*x.qty,0);
  const tax = Math.round(sub*0.05);
  const discount = promoApplied ? Math.round(sub * promoApplied / 100) : 0;
  const total = sub + 49 + tax - discount;
  setEl('sumSubtotal','₹'+sub.toLocaleString());
  setEl('sumTax','₹'+tax.toLocaleString());
  setEl('sumDiscount','−₹'+discount.toLocaleString());
  setEl('sumTotal','₹'+total.toLocaleString());
}

function renderCheckout() {
  const el = document.getElementById('checkoutItems');
  if(!el) return;
  el.innerHTML = cart.map(b=>`<div style="display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid var(--beige-dark);font-size:0.85rem;"><span style="color:var(--text-mid)">${b.title} ×${b.qty}</span><strong>₹${(b.price*b.qty).toLocaleString()}</strong></div>`).join('');
  const sub = cart.reduce((s,x)=>s+x.price*x.qty,0);
  const tax = Math.round(sub*0.05);
  setEl('co-subtotal','₹'+sub.toLocaleString());
  setEl('co-tax','₹'+tax.toLocaleString());
  setEl('co-total','₹'+(sub+49+tax).toLocaleString());
}

function setEl(id,val){const e=document.getElementById(id);if(e)e.textContent=val;}

// ===== ORDER PLACE =====
function placeOrder() {
  const fname = document.getElementById('co-fname').value.trim();
  const email = document.getElementById('co-email').value.trim();
  const phone = document.getElementById('co-phone').value.trim();
  const addr = document.getElementById('co-addr').value.trim();
  const pin = document.getElementById('co-pin').value.trim();
  if(!fname || !email || !phone || !addr || !pin) {
    showToast('⚠️ Please fill all delivery details.');
    return;
  }
  const orderId = '#LC-2025-' + Math.floor(10000 + Math.random() * 90000);
  document.getElementById('successOrderId').textContent = orderId;
  cart = [];
  promoApplied = false;
  updateCartCount();
  showPage('success');
}

function selectPayment(el) {
  document.querySelectorAll('.payment-option').forEach(e=>e.classList.remove('selected'));
  el.classList.add('selected');
  el.querySelector('input').checked = true;
}

// ===== PROFILE =====
function renderProfile() {
  updateWishlistCount();
  const wGrid = document.getElementById('wishlistGrid');
  const wSub = document.getElementById('wishlistSubtitle');
  if(wGrid) {
    if(wishlist.length === 0) {
      wGrid.innerHTML = `<div style="color:var(--text-light);font-size:0.9rem;padding:1rem 0;">No books in your wishlist yet. Browse and add some! <a style="color:var(--gold);cursor:pointer;" onclick="showPage('listing')">Browse →</a></div>`;
    } else {
      wGrid.innerHTML = wishlist.map(b=>`
        <div class="wishlist-book" onclick="openBook(${b.id})">
          <img src="${b.cover}" alt="${b.title}">
          <div class="wishlist-book-info">
            <div class="wishlist-book-title">${b.title}</div>
            <div class="wishlist-book-price">₹${b.price}</div>
          </div>
        </div>`).join('');
    }
    if(wSub) wSub.textContent = wishlist.length > 0 ? `(${wishlist.length} book${wishlist.length>1?'s':''})` : '';
  }
}

function savePersonalInfo() {
  const name = document.getElementById('pf-name').value.trim();
  if(name) {
    document.getElementById('profileDisplayName').textContent = name;
    document.getElementById('profileAvatar').textContent = name[0].toUpperCase();
    showToast('✅ Personal info saved!');
  }
}

function saveContact() {
  const email = document.getElementById('pf-email').value.trim();
  if(email) {
    document.getElementById('profileDisplayEmail').textContent = email + ' · Member since Jan 2024';
  }
  showToast('✅ Contact details saved!');
}

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  const m = document.getElementById('toastMsg');
  if(m) m.textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3000);
}

// Init
renderFeatured();
renderBestsellers();

function getOrderHistoryContainer() {
  const orderSection = [...document.querySelectorAll('.profile-section-card.full-width')].find(section =>
    section.textContent.includes('Order History')
  );

  if (!orderSection) return null;

  let container = orderSection.querySelector('.order-history-list');
  if (!container) {
    orderSection.querySelectorAll('.order-row').forEach(row => row.remove());
    container = document.createElement('div');
    container.className = 'order-history-list';
    const title = orderSection.querySelector('.profile-section-title');
    if (title) {
      title.insertAdjacentElement('afterend', container);
    } else {
      orderSection.appendChild(container);
    }
  }

  return container;
}

function getProfileStatValue(index) {
  return document.querySelectorAll('.profile-stat-card .profile-stat-num')[index] || null;
}

function renderOrderHistory() {
  const orderList = getOrderHistoryContainer();
  if (!orderList) return;

  if (orderHistory.length === 0) {
    orderList.innerHTML =
      '<div style="color:var(--text-light);font-size:0.9rem;padding:1rem 0;">No backend orders yet. Place your first order to see it here.</div>';
    return;
  }

  orderList.innerHTML = orderHistory
    .map(order => `
      <div class="order-row">
        <span class="order-id">${order.orderId || 'Pending order'}</span>
        <span class="order-date">${formatOrderDate(order.createdAt)}</span>
        <span class="order-status ${getOrderStatusClass(order.status)}">${order.status || 'processing'}</span>
        <span class="order-amt">${formatCurrency(order.total)}</span>
      </div>`)
    .join('');
}

function renderSuccessOrder() {
  ensureSuccessDetailsPanel();

  const order = normalizeOrder(lastConfirmedOrder);
  if (!order) return;
  if (!lastConfirmedOrder?.transactionId || lastConfirmedOrder.transactionId !== order.transactionId) {
    storeLastConfirmedOrder(order);
  }

  const customer = order.customer || {};
  const address = customer.address || {};
  const itemsMarkup = order.items.length
    ? order.items
        .map(
          item => `
        <div class="success-item-row">
          <div>
            <div class="success-item-title">${escapeHtml(item.title)}</div>
            <div class="success-item-meta">Qty ${escapeHtml(item.qty)} · ${formatCurrency(item.price)}</div>
          </div>
          <strong>${formatCurrency(Number(item.price || 0) * Number(item.qty || 0))}</strong>
        </div>`
        )
        .join('')
    : '<div class="success-empty">No line items available for this order.</div>';

  document.getElementById('successOrderId').textContent = order.orderId || 'Pending order';
  if (document.getElementById('successStatus')) document.getElementById('successStatus').textContent = order.status || 'confirmed';
  if (document.getElementById('successPaymentMethod')) document.getElementById('successPaymentMethod').textContent = order.paymentMethod || 'Credit / Debit Card';
  if (document.getElementById('successTransactionId')) document.getElementById('successTransactionId').textContent = order.transactionId || 'Not available';
  if (document.getElementById('successPlacedAt')) document.getElementById('successPlacedAt').textContent = formatOrderDate(order.createdAt);
  if (document.getElementById('successTotal')) document.getElementById('successTotal').textContent = formatCurrency(order.total);
  if (document.getElementById('successCustomerName')) document.getElementById('successCustomerName').textContent = customer.fullName || [customer.firstName, customer.lastName].filter(Boolean).join(' ') || 'Customer name not available';
  if (document.getElementById('successCustomerEmail')) document.getElementById('successCustomerEmail').textContent = customer.email || 'Email not available';
  if (document.getElementById('successCustomerPhone')) document.getElementById('successCustomerPhone').textContent = customer.phone || 'Phone not available';
  if (document.getElementById('successCustomerAddress')) document.getElementById('successCustomerAddress').textContent = formatAddress(address) || 'Address not available';
  if (document.getElementById('successItemsList')) document.getElementById('successItemsList').innerHTML = itemsMarkup;
}

function renderOrdersPage() {
  ensureOrdersPage();

  const ordersList = document.getElementById('ordersPageList');
  const subtitle = document.getElementById('ordersPageSubtitle');
  if (!ordersList || !subtitle) return;

  subtitle.textContent = `${orderHistory.length} order${orderHistory.length === 1 ? '' : 's'} available`;

  if (orderHistory.length === 0) {
    ordersList.innerHTML = '<div class="orders-empty">No orders yet. Confirm an order to see full details here.</div>';
    return;
  }

  ordersList.innerHTML = orderHistory
    .map(order => {
      const customer = order.customer || {};
      const address = customer.address || {};
      const fullName = customer.fullName || [customer.firstName, customer.lastName].filter(Boolean).join(' ');
      const itemsMarkup = order.items.length
        ? order.items
            .map(
              item => `
            <div class="orders-item-row">
              <span>${escapeHtml(item.title)} x ${escapeHtml(item.qty)}</span>
              <strong>${formatCurrency(Number(item.price || 0) * Number(item.qty || 0))}</strong>
            </div>`
            )
            .join('')
        : '<div class="orders-empty-inline">No items saved for this order.</div>';

      return `
        <article class="orders-card">
          <div class="orders-card-header">
            <div>
              <div class="orders-card-id">${escapeHtml(order.orderId || 'Pending order')}</div>
              <div class="orders-card-meta">Placed ${escapeHtml(formatOrderDate(order.createdAt))}</div>
            </div>
            <div class="orders-card-summary">
              <span class="order-status ${getOrderStatusClass(order.status)}">${escapeHtml(order.status || 'confirmed')}</span>
              <strong>${formatCurrency(order.total)}</strong>
            </div>
          </div>
          <div class="orders-card-grid">
            <div class="orders-card-panel">
              <h3>Customer</h3>
              <p><strong>${escapeHtml(fullName || 'Unknown customer')}</strong></p>
              <p>${escapeHtml(customer.email || 'Email not available')}</p>
              <p>${escapeHtml(customer.phone || 'Phone not available')}</p>
              <p>${escapeHtml(formatAddress(address) || 'Address not available')}</p>
            </div>
            <div class="orders-card-panel">
              <h3>Payment & Totals</h3>
              <p>Transaction: <strong>${escapeHtml(order.transactionId || 'Not available')}</strong></p>
              <p>Method: <strong>${escapeHtml(order.paymentMethod || 'Credit / Debit Card')}</strong></p>
              <p>Subtotal: <strong>${formatCurrency(order.subtotal)}</strong></p>
              <p>Shipping: <strong>${formatCurrency(order.shipping)}</strong></p>
              <p>Tax: <strong>${formatCurrency(order.tax)}</strong></p>
              <p>Discount: <strong>${formatCurrency(order.discount)}</strong></p>
            </div>
          </div>
          <div class="orders-card-panel">
            <h3>Items</h3>
            <div class="orders-items-list">${itemsMarkup}</div>
          </div>
        </article>`;
    })
    .join('');
}

async function refreshOrdersPage() {
  await loadOrdersFromApi();
  showToast('Orders refreshed.');
}

function updateProfileStats() {
  const ordersPlaced = getProfileStatValue(0);
  if (ordersPlaced) ordersPlaced.textContent = String(orderHistory.length);
  const totalSpent = orderHistory.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const totalSpentEl = getProfileStatValue(2);
  if (totalSpentEl) totalSpentEl.textContent = formatCurrency(totalSpent);
}

async function placeOrder() {
  const fname = document.getElementById('co-fname').value.trim();
  const lname = document.getElementById('co-lname').value.trim();
  const email = document.getElementById('co-email').value.trim();
  const phone = document.getElementById('co-phone').value.trim();
  const addr = document.getElementById('co-addr').value.trim();
  const city = document.getElementById('co-city').value.trim();
  const state = document.getElementById('co-state').value;
  const pin = document.getElementById('co-pin').value.trim();

  if (cart.length === 0) {
    showToast('Your cart is empty.');
    return;
  }

  if (!fname || !email || !phone || !addr || !pin) {
    showToast('Please fill all delivery details.');
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.round(subtotal * 0.05);
  const discount = promoApplied ? Math.round(subtotal * promoApplied / 100) : 0;
  const checkoutButton = document.querySelector('#page-checkout .place-order-btn');
  const originalButtonLabel = checkoutButton ? checkoutButton.textContent : '';

  if (checkoutButton) {
    checkoutButton.disabled = true;
    checkoutButton.textContent = 'Saving...';
  }

  try {
    const result = await apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify({
        userEmail: email,
        customer: {
          firstName: fname,
          lastName: lname,
          fullName: [fname, lname].filter(Boolean).join(' '),
          email,
          phone,
          address: {
            line1: addr,
            city,
            state,
            pin,
            country: document.querySelector('#page-checkout select:not(#co-state)')?.value || 'India'
          }
        },
        items: cart.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          qty: item.qty,
          cover: item.cover
        })),
        discount,
        paymentMethod: getSelectedPaymentMethod()
      })
    });

    const savedOrder = normalizeOrder(result.order || {});
    orderHistory = [savedOrder, ...orderHistory.filter(order => order.orderId !== savedOrder.orderId)];
    storeLastConfirmedOrder(savedOrder);
    showToast('Order placed successfully.');
  } catch (error) {
    const fallbackOrder = normalizeOrder({
      orderId: '#LC-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000),
      transactionId: createClientTransactionId(),
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      paymentMethod: getSelectedPaymentMethod(),
      userEmail: email,
      subtotal,
      shipping: 49,
      tax,
      discount,
      total: subtotal + 49 + tax - discount,
      customer: {
        firstName: fname,
        lastName: lname,
        fullName: [fname, lname].filter(Boolean).join(' '),
        email,
        phone,
        address: {
          line1: addr,
          city,
          state,
          pin,
          country: document.querySelector('#page-checkout select:not(#co-state)')?.value || 'India'
        }
      },
      items: cart.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        qty: item.qty,
        cover: item.cover
      }))
    });

    orderHistory = [fallbackOrder, ...orderHistory];
    storeLastConfirmedOrder(fallbackOrder);
    console.warn('Backend unavailable while saving the order.', error);
    showToast('Backend unavailable. Order was saved only in this browser session.');
  } finally {
    if (checkoutButton) {
      checkoutButton.disabled = false;
      checkoutButton.textContent = originalButtonLabel;
    }
  }

  renderOrderHistory();
  renderOrdersPage();
  renderSuccessOrder();
  updateProfileStats();
  cart = [];
  promoApplied = false;
  updateCartCount();
  renderCart();
  renderCheckout();
  updateSummary();
  showPage('success');
}

function renderProfile() {
  renderOrderHistory();
  updateProfileStats();
  updateWishlistCount();
  const wGrid = document.getElementById('wishlistGrid');
  const wSub = document.getElementById('wishlistSubtitle');

  if (wGrid) {
    if (wishlist.length === 0) {
      wGrid.innerHTML =
        '<div style="color:var(--text-light);font-size:0.9rem;padding:1rem 0;">No books in your wishlist yet. Browse and add some! <a style="color:var(--gold);cursor:pointer;" onclick="showPage(\'listing\')">Browse →</a></div>';
    } else {
      wGrid.innerHTML = wishlist
        .map(
          b => `
        <div class="wishlist-book" onclick="openBook(${b.id})">
          <img src="${b.cover}" alt="${b.title}">
          <div class="wishlist-book-info">
            <div class="wishlist-book-title">${b.title}</div>
            <div class="wishlist-book-price">₹${b.price}</div>
          </div>
        </div>`
        )
        .join('');
    }

    if (wSub) {
      wSub.textContent = wishlist.length > 0 ? `(${wishlist.length} book${wishlist.length > 1 ? 's' : ''})` : '';
    }
  }
}

function savePersonalInfo() {
  const name = document.getElementById('pf-name').value.trim();
  if (name) {
    document.getElementById('profileDisplayName').textContent = name;
    document.getElementById('profileAvatar').textContent = name[0].toUpperCase();
    showToast('Personal info saved.');
  }
}

async function saveContact() {
  const name = document.getElementById('pf-name').value.trim();
  const email = document.getElementById('pf-email').value.trim();
  const phone = document.getElementById('pf-phone').value.trim();

  if (email) {
    document.getElementById('profileDisplayEmail').textContent = `${email} · Member since Jan 2024`;
  }

  try {
    await apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone })
    });
    await loadOrdersFromApi();
    showToast('Contact details saved to the backend.');
  } catch (error) {
    console.warn('Unable to save contact details to the backend.', error);
    showToast('Contact details updated in the UI, but the backend is unavailable.');
  }
}

async function initApp() {
  ensureOrderExperience();
  updateCartCount();
  updateWishlistCount();
  renderOrderHistory();
  renderOrdersPage();
  renderSuccessOrder();
  updateProfileStats();
  await Promise.all([loadBooksFromApi(), loadOrdersFromApi()]);
}

initApp();
