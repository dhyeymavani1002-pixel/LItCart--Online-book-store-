# LitCart — Frontend

A literary e-commerce website frontend for LitCart, your book destination.

## Folder Structure

```
litcart-frontend/
├── index.html          # Main HTML file (entry point)
├── css/
│   └── styles.css      # All styles and CSS variables
├── js/
│   └── main.js         # All JavaScript logic (data, cart, routing, UI)
├── assets/
│   ├── images/         # Place your image assets here
│   └── fonts/          # Place any custom font files here
└── README.md           # This file
```

## Pages

The website uses a single-page application (SPA) approach with JavaScript-controlled page visibility:

- **Home** — Hero section, featured books, promo banner, testimonials, footer
- **Listing** — Browse all books with filters & search
- **Book Detail** — Individual book page with reviews
- **Cart** — Shopping cart with promo codes
- **Checkout** — Delivery details & payment
- **Order Success** — Order confirmation
- **Profile** — User profile, wishlist, order history

## How to Run

Simply open `index.html` in any modern browser. No build step required.

## Tech Stack

- Pure HTML5, CSS3, and vanilla JavaScript
- Google Fonts: Playfair Display + DM Sans
- No external dependencies or frameworks

## Promo Codes (for testing)

| Code       | Discount |
|------------|----------|
| BOOK10     | 10%      |
| LITCART20  | 20%      |
| READ30     | 30%      |

## Customization

- Edit CSS variables in `css/styles.css` under `:root {}` to change the color theme
- Edit the `books` array in `js/main.js` to update book data
- Replace placeholder cover images with real ones via the `cover` field in each book object
