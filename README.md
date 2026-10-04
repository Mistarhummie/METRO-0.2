# Metro Cleaners & Renovators Ltd: website

Website for Metro Cleaners & Renovators Ltd, Lavington, Nairobi. *We clean so you don't have to.*

It's plain HTML, CSS and JavaScript with no build step, so the files in this repository are exactly what goes live.

```
index.html              The whole page
assets/css/styles.css   Styles (brand colours are at the top)
assets/js/main.js       Animations, cursor glow, mobile menu and the quote form
assets/img/             Logo, white footer logo, favicon
```

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Publish with GitHub Pages

In **Settings → Pages**, set **Source** to **Deploy from a branch**, choose `main` and `/ (root)`, then save. Every push to `main` goes live a minute or two later. No build or Actions workflow is needed.

## Common edits

- **Social media links:** in `index.html`, search for `data-social` and replace each `href="#"` with the page address.
- **Phone, email and WhatsApp:** search `index.html` for `0706385869` / `0706 385869`, `2680618` and `info@metrocleaners.co.ke`. The quote form's email and WhatsApp number are at the top of `assets/js/main.js`.
- **Photos:** the hero and "Why Metro" images are free Unsplash stock photos. Swap the `src` for your own photos (put them in `assets/img/`).

## Quote form

The form opens the visitor's email app with a message to info@metrocleaners.co.ke already filled in (subject "New Inquiry: [service]"). After pressing send, visitors also get a one-tap WhatsApp button with the same details, in case their email app doesn't open.
