# Technical Fix Brief — soundwaystohealth.com

**Paste this whole file into a fresh coding session (Claude Code, Cursor, or similar) with
access to `/Users/s/wix-redesign`.**

Written 31 August 2026 from a live audit of the production site. Every fact below was
verified against the live domain or the local repo — do not re-derive them, and do not
assume they are still true if you are reading this more than a few weeks later. Re-verify
with the commands in §7 before you start.

---

## 0. Context you need before touching anything

The brand exists twice, in two unrelated systems:

- **Layer A — Wix** (`soundwaystohealth.com`). Nine public pages. Owns the domain, the
  booking engine (Wix Bookings, 6 live priced services), the blog, and the footer.
  Eight of the nine pages are unedited Wix therapist-template placeholder content.
- **Layer B — this repo** (`/Users/s/wix-redesign`, deployed to Netlify site
  `3ca851ca-3554-469b-a5e4-7a5bcb2f13de`, live at
  `https://remarkable-pastelito-ef19b1.netlify.app/soundways-to-health.html`).
  This is the real brand: 58KB, 10 sections, 18,823px tall, full design system.

Layer B reaches the public through **two nested iframes**: the Wix `/home` page embeds
`https://www-soundwaystohealth-com.filesusr.com/html/1e3b94_3c6bb0dccffa109ec4b3e66384212775.html`,
a 329-byte shim whose entire body is a second `<iframe>` pointing at the Netlify URL.

**You can only fix Layer B.** Layer A changes require the site owner in the Wix editor.
Tasks are split accordingly. Do not attempt to script Wix changes.

Brand system of record: `/Users/s/wix-redesign/BRAND-GUIDELINES.md`. Read it before
changing any colour, type, or copy value.

---

## 1. Verified defects

| # | Defect | Evidence | Severity |
|---|---|---|---|
| D1 | Every Wix page carries `<meta name="robots" content="noindex">` | Present in HTML of all 9 pages | **Critical** |
| D2 | `robots.txt` in this repo is `User-agent: * / Disallow: /` | `/Users/s/wix-redesign/robots.txt` | **Critical** |
| D3 | Homepage content is in a cross-origin iframe, so search engines cannot attribute it to the domain | Confirmed nested-iframe chain above | **Critical** |
| D4 | JSON-LD (`HealthAndBeautyBusiness`, `Person`, 6 × `Service`/`Offer`) sits inside the iframed document on a `Disallow: /` host — never crawled | 1 `application/ld+json` block in `soundways-to-health.html` | **Critical** |
| D5 | On mobile the entire 18,823px page renders inside a **320 × 585px** iframe | Measured live at 375px viewport: `iframe.getBoundingClientRect()` → `{w:320, h:585}`; outer `document.body.scrollHeight` = 1057 | **Critical** |
| D6 | Regulated-practice copy: "A fast, safe and permanent process for anxiety, PTSD, fears and trauma — most issues resolved within 1–3 targeted sessions." | 2 occurrences of `permanent` in `soundways-to-health.html` | **Critical (legal)** |
| D7 | Four live Wix pages titled *Individual Psychotherapy*, *Couples Therapy*, *Family Therapy*, *Sex Therapy*; `/about-me` lists PTSD, OCD, eating issues, sexual abuse | All return HTTP 200 | **Critical (legal)** |
| D8 | Eight Wix pages contain verbatim Wix placeholder copy ("At Wix we're passionate about making templates…") | `/about-me`, `/my-approach`, 4 therapy pages | **High** |
| D9 | `og:image` points at `https://www.soundwaystohealth.com/media/hero-bowl.jpg` → **404** | `curl -I` returns 404 | **High** |
| D10 | `--muted: #6E7690` on `--night: #080B16` = **4.34:1**, fails WCAG AA (needs 4.5:1) | Computed from declared values | **High** |
| D11 | Four hero/section JPEGs served at one resolution, no `srcset`, no WebP/AVIF. 192KB + 203KB + 244KB + 150KB = 789KB of images | `<img src>` only, no `<picture>` | **Medium** |
| D12 | Seven corner radii in use (2, 4, 6, 8, 10, 12, 999px); three hexes outside the token set (`#0a0a0a`, `#05070e`, `#140c00`) | Grep of `soundways-to-health.html` | **Medium** |
| D13 | Wix footer Social Bar links to `https://www.facebook.com/wix` | Live on every Wix page | **Medium** |
| D14 | Wix footer reads "Mississauaga, ON." (misspelled) | Live on every Wix page | **Medium** |
| D15 | "over 50 five-star reviews" claimed with no link and no testimonials anywhere on the page | 0 occurrences of a review source | **Medium** |
| D16 | Wix pages have no header content and no navigation (`header` renders 69px empty; `nav a` → `[]`) | Measured live | **Medium** |
| D17 | Group Sound Bath and Corporate Wellness priced "By quote" with no enquiry path | Live copy | **Low** |

---

## 2. The architectural decision (get this answered before Phase B)

D1–D5 all share one root cause: **the real site is a guest inside Wix.** Patching around
that will not fix search visibility or mobile.

**Recommended: move the site to Netlify and keep Wix for bookings only.**

- Point `soundwaystohealth.com` (apex + `www`) at the Netlify site.
- Serve `soundways-to-health.html` as `index.html` at the root.
- Move Wix Bookings to `book.soundwaystohealth.com` (Wix supports a subdomain) and point
  all booking CTAs there.
- Delete the seven dead Wix pages entirely.

Result: content is first-party, indexable, mobile-correct, JSON-LD crawlable, one design
system end to end. Cost is a DNS change and a booking-URL update — no rebuild.

**Fallback if the owner will not move the domain:** the iframe stays, and D3/D4 cannot be
fixed. Mitigate by fixing D5 (§4) and rebuilding the Wix pages natively (owner task).
Search visibility will remain near zero. Say this plainly to the owner rather than
implying the fallback is equivalent.

**Do not proceed past Phase A until the owner has picked one.**

---

## 3. PHASE A — do these now, they are correct under either architecture

These are all in `/Users/s/wix-redesign`. Work on a branch. Do not deploy until the whole
phase passes §7.

### A1 — Fix the regulated-practice copy (D6)

In `soundways-to-health.html`, both occurrences of the Compassion Key claim.

Replace:
```
A fast, safe and permanent process for anxiety, PTSD, fears and trauma — most issues resolved within 1–3 targeted sessions.
```
With:
```
A guided compassion process for fear, anxiety and long-held emotional pain. Many people notice a clear shift within one to three sessions; some need longer. A complementary wellness practice, not a substitute for medical or psychological care.
```

Then sweep the whole file for the banned list in `BRAND-GUIDELINES.md` §3.3 and rewrite
each hit to the stated replacement:

- `permanent` / `permanently` → `lasting`, or restructure to `many people notice`
- `resolved` / `removed` / `nullified` → `shifted`, `released`, `quieter`
- `treat` / `treatment` / `therapy` / `therapeutic` (describing a session) → `session`,
  `practice`, `work`
- `cure` / `fix` / `heal` (transitive) → `support`, `ease`, `work with`
- `guaranteed` / `proven` / `always` / `everyone` → `often`, `many people`, `studied for`

Specific known hits beyond the main claim:
- "Permanent — works on removing the source of the suffering, not the symptoms" →
  "Durable — the work is aimed at the source of the distress, not only the symptoms."
- "until it is nullified — not managed, removed" → "until its charge softens — not
  managed around, but met directly."
- "Fear to love. Anxiety to calm. PTSD to joy." → keep the two-beat rhythm but drop the
  clinical term: "Fear to love. Anxiety to calm. Grief to ground."

**Constraint:** the existing medical disclaimer must be moved so it sits inside the same
visual block as any mention of PTSD, trauma, anxiety, or ADHD — not only in the science
section. Duplicate it into the Compassion Key section.

**Do not delete the benefit claims entirely.** The brand position is honest hedging, not
silence. Hedge them; keep them.

### A2 — Fix the contrast failure (D10)

In the `:root` block:
```diff
- --muted:#6E7690;
+ --muted:#7A8299;
```
`#7A8299` on `#080B16` = 5.42:1, passes AA at all sizes. No other colour changes.

### A3 — Fix the OG image (D9)

Produce a 1200×630 share image from `media/hero-bowl.jpg` — brand-graded, with the
mono-ink logo lockup bottom-left in the clear-space margin. Save as
`media/og-share.jpg`, ≤ 200KB.

Then update the meta so the URL resolves. Under the recommended architecture:
```html
<meta property="og:image" content="https://www.soundwaystohealth.com/media/og-share.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Shri Vivek playing a Himalayan singing bowl by candlelight">
```
Under the fallback architecture, point it at the Netlify origin instead — an absolute URL
that returns 200 is the only requirement. Verify with a real request, not by reading the
file.

### A4 — Consolidate radii and remove stray hexes (D12)

Add to `:root`:
```css
--r-sm:4px; --r-md:10px; --r-lg:16px; --r-pill:999px;
```
Map every existing radius: `2px`→`--r-sm`, `4px`→`--r-sm`, `6px`→`--r-sm`, `8px`→`--r-md`,
`10px`→`--r-md`, `12px`→`--r-md`, `999px`→`--r-pill`. Introduce `--r-lg` only where a
full-bleed feature block genuinely needs it.

Replace the three untokenised hexes: `#0a0a0a` and `#05070e` → `var(--night)`;
`#140c00` → a `--amber-d` derivative or `var(--night)`, whichever matches the visual
intent at that location. Check each one visually before and after — do not blind-replace.

Add the spacing tokens from `BRAND-GUIDELINES.md` Appendix A and migrate hard-coded
section padding to `var(--s-8)`.

### A5 — Responsive images (D11)

Convert the four large JPEGs to a responsive set. For each of `hero-bowl`, `about-snow`,
`access-bars`, `compassion-key`:

- Generate AVIF + WebP + JPEG fallback at widths 640, 960, 1440, 1920.
- Replace each `<img src>` with a `<picture>` carrying `srcset` and a correct `sizes`.
- `loading="lazy"` and `decoding="async"` on everything **except** the hero image, which
  gets `fetchpriority="high"` and a `<link rel="preload" as="image">` with matching
  `imagesrcset`.
- Add explicit `width` and `height` attributes to every image to eliminate layout shift.

Target: hero LCP image ≤ 120KB at 1440w in AVIF.

### A6 — Scroll-reveal must be safe without JS (motion spec)

Confirm scroll-reveal elements are **visible by default in CSS** and hidden only by
script on load. If they currently start at `opacity: 0` in CSS, a JS failure or a
`prefers-reduced-motion` edge case yields a blank page. Fix by adding a `js-enabled`
class on `<html>` from an inline script in `<head>`, and scoping the initial hidden state
to `.js-enabled`.

Verify the existing `@media (prefers-reduced-motion: reduce)` block also neutralises
`scroll-behavior`.

### A7 — Remove or substantiate the review claim (D15)

Locate "over 50 five-star reviews". Either:
- link it to the real review source (Google Business Profile is the likely one) and
  restate as `Rated 5.0 across 50+ reviews — read them →`, or
- **delete the sentence.**

Do not leave an unlinked count. Ask the owner for the review URL; if they cannot supply
one within the task, delete it and note that you did.

### A8 — Accessibility and semantics pass

- Every `<section>` gets an `aria-labelledby` pointing at its heading `id`.
- Heading order is strictly sequential — no `h2` following `h4`.
- All decorative SVG gets `aria-hidden="true"`; the logo keeps its existing `role="img"`
  and `aria-label`.
- Visible focus states on every interactive element: `outline: 2px solid var(--amber);
  outline-offset: 3px`. Do not rely on the default.
- Add a skip-to-content link as the first focusable element.
- Verify the mobile nav toggle has `aria-expanded` and `aria-controls`, and traps focus
  when open.

### A9 — Self-host the fonts

Currently three separate Google Fonts requests including a duplicated stylesheet link
(one with `media="print"` + `onload` swap, one plain — the plain one makes the swap
pointless). Download the Cormorant Garamond and Jost subsets actually used, self-host as
WOFF2 under `assets/fonts/`, declare `@font-face` with `font-display: swap`, and delete
all Google Fonts links and preconnects. This removes a third-party render-blocking
dependency and a privacy exposure.

---

## 4. PHASE B — architecture

### If the owner chose "move to Netlify" (recommended)

**B1.** Copy `soundways-to-health.html` → `index.html` at repo root. Keep the old path as
a copy for the transition, then add a redirect once DNS has moved.

**B2.** Replace `robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://www.soundwaystohealth.com/sitemap.xml
```
Generate `sitemap.xml` covering `/` and any real sub-pages.

**B3.** Update `_headers`. The existing file explicitly forbids frame-ancestors headers
because the pages are meant to be iframed — that constraint is now gone for this page.
Add:
```
/*
  X-Frame-Options: SAMEORIGIN
  Content-Security-Policy: frame-ancestors 'self'
```
**Careful:** `infinite-in-me.html` in this same repo is still intentionally iframed by
`infiniteinme.com`. Scope the new headers to `/index.html` and `/` only, and leave the
existing permissive rules in place for the other page. Do not apply a blanket
`frame-ancestors` at `/*` or you will break the other site.

**B4.** Update all seven booking CTAs from `https://www.soundwaystohealth.com/book-online`
to the new booking subdomain. `target="_top"` is no longer needed once the page is not
iframed — remove it. Verify every link resolves 200 after the change.

**B5.** Move the JSON-LD to the root document, and extend it: add `areaServed`,
`openingHoursSpecification` (from the Wix footer: Mon–Fri 07:00–22:00, Sat 08:00–22:00,
Sun 08:00–23:00), `telephone`, `email`, `sameAs` for real social profiles, and
`aggregateRating` **only if** the review claim in A7 was substantiated. Never publish
`aggregateRating` without a verifiable source.

**B6.** Add a canonical: `<link rel="canonical" href="https://www.soundwaystohealth.com/">`.

**B7.** DNS and domain move is an **owner task** — you cannot do it. Write the exact
steps out for them (§6).

### If the owner chose "keep Wix" (fallback)

**B1-alt — fix the mobile iframe (D5).** The iframe cannot resize itself cross-origin, so
implement `postMessage` height syncing:

- In `soundways-to-health.html`, add a `ResizeObserver` on `document.documentElement` that
  posts `{type:'sw-height', height: document.documentElement.scrollHeight}` to
  `window.parent` on every change and on load. Restrict `targetOrigin` to the known Wix
  and filesusr origins — never `'*'`.
- Rewrite the filesusr shim to listen for that message and set its own iframe height,
  then post the value up to the Wix page.
- The Wix outer container must also be told to grow — that part **requires Wix Velo code
  on the owner's side** and is not something you can deploy from this repo. Write the Velo
  snippet for them; do not claim the fix is complete until they have added it.

Be explicit with the owner: this is a workaround with two cross-origin hops, it will
still scroll imperfectly on iOS Safari, and it does nothing for D3 or D4. It is strictly
worse than moving the domain.

---

## 5. PHASE C — owner tasks in Wix (you cannot do these; produce the checklist)

Write these into a short handover note for the owner:

1. **Delete** `/individual-psychotherapy`, `/couples-therapy`, `/family-therapy`,
   `/sex-therapy`. These are unedited template pages whose titles describe a regulated
   practice. Deleting them is the single highest-priority action on the whole list.
2. **Delete or rewrite** `/about-me` and `/my-approach` — both are pure Wix placeholder
   text, and `/about-me` carries a 20-item list of clinical presenting problems.
3. **Turn off "Hide site from search engines"** in Wix SEO settings (this is what emits
   the `noindex` tag on all nine pages).
4. **Fix the footer:** "Mississauaga" → "Mississauga"; repoint the Facebook Social Bar
   icon away from `facebook.com/wix` to the real profile, or remove the icon.
5. **Fix the header:** it currently renders empty with no navigation on every Wix page.
   Add the logo and a link back to home at minimum.
6. **Restyle the booking page** to the brand system — it is currently Wix default cream
   `#F5F0E8` and Futura, and it is where every CTA lands. It uses the same blurred stock
   photo on all six service cards; replace with real instrument photography per
   `BRAND-GUIDELINES.md` §7.
7. **Supply the review URL** so the "50+ reviews" claim can be linked (see A7).
8. **Claim and populate the Google Business Profile.** For a local appointment-based
   service this is the highest-value channel and is currently the most under-invested
   surface in the brand.

---

## 6. DNS runbook for the owner (recommended architecture only)

Do not execute this yourself — it is irreversible from the owner's side and affects live
booking traffic. Hand it over:

1. In Wix, move the Bookings app to a subdomain (`book.soundwaystohealth.com`) and
   confirm the booking flow works there end to end, including payment.
2. In Netlify, add `soundwaystohealth.com` and `www.soundwaystohealth.com` as custom
   domains on site `3ca851ca-3554-469b-a5e4-7a5bcb2f13de`.
3. At the registrar, point the apex A record and the `www` CNAME at Netlify. Leave the
   `book` record pointing at Wix.
4. Wait for TLS provisioning, then verify: apex loads the brand site, `/book` CTAs land
   on Wix Bookings, and old Wix URLs 301 to sensible destinations.
5. Submit the new sitemap in Google Search Console and request indexing.

**Take a full backup of the Wix site before step 1.**

---

## 7. Verification — run these, paste the output, do not claim done without them

```bash
cd /Users/s/wix-redesign

# banned words must all return 0
grep -ioc "permanent\|nullified\|\bcure\b\|guaranteed\|psychotherapy" soundways-to-health.html

# contrast token updated
grep -o '\-\-muted:#[0-9A-Fa-f]\{6\}' soundways-to-health.html

# no stray hexes outside the token block
grep -o '#0a0a0a\|#05070e\|#140c00' soundways-to-health.html   # expect no output

# og:image must return 200, not 404
curl -s -o /dev/null -w "og:image %{http_code}\n" \
  "$(grep -o 'property="og:image" content="[^"]*"' soundways-to-health.html | sed 's/.*content="//;s/"//')"

# every booking CTA resolves
grep -o 'href="https://[^"]*book[^"]*"' soundways-to-health.html | sort -u

# JSON-LD still parses
python3 -c "import re,json,sys; h=open('soundways-to-health.html').read(); [json.loads(m) for m in re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>', h, re.S)]; print('JSON-LD OK')"

# robots.txt state
cat robots.txt
```

Then, in a browser, against the deployed URL:

- Load at 375px width. **The full page must scroll in the viewport, not inside a 585px
  box.** This is the single decisive mobile check.
- Run Lighthouse. Targets: Performance ≥ 90 mobile, Accessibility 100, SEO ≥ 95.
- Run axe or Lighthouse a11y and confirm zero contrast violations.
- Tab through the entire page and confirm a visible focus ring on every interactive
  element, and that the mobile nav traps focus.
- Toggle `prefers-reduced-motion` and confirm all content is visible with animations off.
- Disable JavaScript and confirm the page still renders all content.
- Paste the deployed URL into Facebook's Sharing Debugger and confirm the OG image
  renders.

**Report honestly.** If a check fails, say which one and paste the failing line. Do not
report "done" on any phase without the output above. The site owner is non-technical and
cannot catch a false pass.

---

## 8. Order of work

1. **A1** (legal copy) — before anything else, it is the only item with real-world risk.
2. **Phase C item 1** (owner deletes the four psychotherapy pages) — flag it to the owner
   the moment you start, do not wait until handover.
3. A2, A3, A7 — quick, high-value, independent.
4. Get the §2 architecture decision.
5. A4, A5, A6, A8, A9.
6. Phase B for whichever architecture was chosen.
7. Full §7 verification, then deploy.

Do not batch A1 into a larger commit. It should land on its own, immediately.
