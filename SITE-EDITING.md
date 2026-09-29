# Editing and operating the sites

## Main source files

- Soundways to Health homepage: `index.html`
- Soundways service and information pages: the other root-level `.html` files
- Shared Soundways styling and behaviour: `assets/main.css` and `assets/main.js`
- Infinite In Me homepage: `infinite-in-me.html`
- Images: `media/` for Soundways and `img/` for Infinite In Me

Edit visible wording directly in the relevant HTML file. Keep prices, credentials,
legal disclaimers, email, and phone number accurate. Do not edit generated Netlify
deploy files under `.netlify/`.

## Preview locally

From this directory:

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080/` for Soundways or
`http://localhost:8080/infinite-in-me.html` for Infinite In Me.

## Booking requests

Both sites use native Netlify Forms. Requests appear in each Netlify project's
**Forms** section and trigger email notifications to `shriramvivek@gmail.com`.
Never collect medical histories or payment information through these forms.

Free 15-minute fit calls use Cal.com at
`https://cal.com/shriramd/free-fit-call`. Cal.com handles availability,
calendar events, confirmations, rescheduling, and cancellation. Session and
home-visit requests stay in Netlify Forms for personal confirmation.

## Analytics

The pages emit privacy-safe local conversion events without cookies or network
tracking. Soundways writes events to `window.dataLayer`. Infinite In Me emits the
`infiniteinme:analytics` browser event. A future GA4, Matomo, or other consent-aware
adapter can consume these events after its measurement ID and privacy configuration
are approved. Form values are never included.

## SEO checklist for future edits

1. Keep one descriptive `h1` per page.
2. Keep titles under 60 characters and descriptions under 155 characters.
3. Preserve canonical, Open Graph, Twitter, and JSON-LD metadata.
4. Add useful image `alt` text.
5. Update `sitemap.xml` or `sitemap-infiniteinme.xml` when adding a public page.
6. Keep medical and wellness claims within the published scope-of-practice wording.
7. Test all links, both forms, mobile layout, and structured data before deployment.

## Deployment

Soundways uses Netlify project `remarkable-pastelito-ef19b1`.
Infinite In Me uses Netlify project `infinite-in-me-shri`.
Deploy from this repository only after validation; the public domains are configured
inside Netlify and should not be hard-coded to deploy-preview URLs.
