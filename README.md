# The Ultimate Guide for Architects Using AI — sales site

A single-page static site. Plain HTML, CSS and a little vanilla JavaScript.
No framework, no build step, no dependencies to install. Open `index.html` in
a browser and it runs.

---

## File map

```
index.html                    The whole page. Every section lives here.
README.md                     This file.

css/
  fonts.css                   Archivo + IBM Plex Mono, embedded as data URIs.
                              Chrome blocks cross-origin font loads over
                              file://, so the bytes live inside the CSS.
                              You should never need to touch this.
  styles.css                  All styling. Palette and type scale are custom
                              properties at the top, under ":root".

js/
  main.js                     Footer year, the mobile buy bar that appears
                              after the hero and stands down at the final
                              call to action, and the free-prompts dialog.

assets/
  cover.png                   Book cover, 593x780, shown in the hero.
  cover-placeholder.svg       Stand-in if cover.png ever goes missing, so the
                              hero never renders as a broken image.
  og-image.png                1200x630 image used when the page is shared.
  og-image.html               Source for og-image.png. Not part of the site.
  favicon.svg                 Browser tab icon.
  favicon-32.png              Fallback for browsers without SVG icon support.
  apple-touch-icon.png        180x180, used when saved to an iOS home screen.
  fonts/                      Original .woff2 files, kept for reference. The
                              page loads the copies embedded in fonts.css.
```

---

## The domain

The site is set to **`https://architectsandai.com`** — no trailing slash.

It appears **9 times in the page's metadata**: the canonical link, `og:url`,
`og:image`, `twitter:image`, three times in the Book node (`@id`, `url`,
`image`) and twice in the Product node (`@id`, `image`). Open Graph and
structured data require absolute URLs — relative ones are ignored — so if the
domain ever changes, all nine change together.

Searching `index.html` for `architectsandai.com` returns **11** hits: those
nine plus two mentions inside the explanatory comment above the canonical
link.

**Pick one host and redirect the other.** If `www.architectsandai.com`
resolves as well as the bare domain, point it at the bare domain with a 301.
Two addresses serving identical pages splits your search ranking between them,
and only one of them matches the canonical.

---

## Where to change things

### The price

`$20` appears in **10 places in `index.html`**, plus one more file. Changing
the number in only some of them is the easiest mistake to make here, so change
all of them:

| Where | What it looks like |
|---|---|
| `<meta name="description">` | `...62 chapters, $20.` |
| `<meta property="og:description">` | `...62 chapters, $20.` |
| `<meta name="twitter:description">` | `...62 chapters, $20.` |
| JSON-LD, Book `offers` | `"price": "20.00"` |
| JSON-LD, Product `offers` | `"price": "20.00"` |
| Hero title block | `<dd>$20 <span class="titleblock__sub">USD</span></dd>` |
| Final call to action | `<p class="final__price"><span>$20</span> USD</p>` |
| **All five buy buttons** | `Get the 139-page guide — $20` |
| `assets/og-image.html` | `<dt>Price</dt><dd>$20 <small>USD</small></dd>` |

After editing `assets/og-image.html`, re-render the share image — see
**Re-rendering the share image** below.

A quick way to catch a miss: search `index.html` for `$20` and confirm you get
10 hits, then search for `20.00` and confirm you get 2.

### The Payhip link

`https://payhip.com/b/b2wDl` appears **7 times in `index.html`**: once in each
of the five buy buttons, and twice more in the structured data (the Book and
Product `offers`).

The five buttons also carry `data-product="b2wDl"`, which is what Payhip's
overlay script keys on. If you change the product, change both the URL and the
`data-product` value — the ID is the part after `/b/` in the URL.

### The buy button label

All five buttons read `Get the 139-page guide — $20`. Keep them identical; the
page is built on the assumption that every button says and does the same thing.

### The free prompts

The three saved prompts from the video (the Brief, the Code & Zoning
Checklist, the 2D to 3D Model Handoff) live in a `<dialog id="prompts">` near
the bottom of `index.html`. Two things open it: the outlined button under the
hero's buy button, and the **Free prompts** link in the header nav. Each
prompt has a **Copy prompt** button.

To edit a prompt, change the text inside its `<pre class="prompt__text">`.
What's in that element is exactly what gets copied, line breaks included.
Avoid typing a bare `<` or `&` in it; write `&lt;` and `&amp;` instead.

**Linking straight to the prompts:** add `#prompts` to the site address —
`https://architectsandai.com/#prompts` — and the page opens with the prompts
already showing. That's the link to put in a video description.

The prompts button is deliberately teal and outlined, not cyan: it sits right
under the buy button and shouldn't compete with it.

### Colours and type

Top of `css/styles.css`, under `:root`. The four brand hexes, three neutrals
and the whole type scale are defined once there.

One rule worth preserving: **cyan (`#33CBCC`) appears in only four rules** —
button fill, button border, skip link and focus ring. Everything else accents
with teal (`#35A9A7`). That is what keeps the buy buttons the loudest thing on
the page. Note also that teal on the light background measures 2.6:1 and fails
accessibility contrast as text, which is why light sections flip labels to
navy through the `--label` custom property.

---

## Re-rendering the share image

`assets/og-image.png` is a screenshot of `assets/og-image.html`.

To update it: open `assets/og-image.html` in Chrome, set the window to exactly
1200x630 (easiest with DevTools device toolbar — Ctrl+Shift+M, then enter
1200 x 630), and take a screenshot. In Chrome DevTools you can also press
Ctrl+Shift+P and run "Capture screenshot". Save the result over
`assets/og-image.png`, keeping the name and the 1200x630 size.

---

## Deploying free, from a Chromebook

All three options below work entirely in the browser. No terminal needed.

### Option 1 — Netlify Drop (fastest, about a minute)

1. Download this repository as a ZIP: on the GitHub page, **Code -> Download ZIP**.
2. Unzip it in the Files app so you have a plain folder.
3. Go to <https://app.netlify.com/drop>.
4. Drag the folder — the one containing `index.html`, not the ZIP — onto the page.
5. It publishes immediately and gives you a URL.

To use your own domain, or to redeploy later, you will need a free Netlify
account. Without one the site is temporary.

### Option 2 — Cloudflare Pages (connects to this repository)

1. Sign in at <https://dash.cloudflare.com> and open **Workers & Pages**.
2. **Create -> Pages -> Connect to Git**, and authorise GitHub.
3. Pick this repository and the branch you want to publish.
4. Leave the build settings empty:
   - Framework preset: **None**
   - Build command: **leave blank**
   - Build output directory: **`/`**
5. **Save and Deploy.**

Every push to that branch redeploys automatically.

### Option 3 — GitHub Pages (no third-party account)

1. In this repository, go to **Settings -> Pages**.
2. Under **Source**, choose **Deploy from a branch**.
3. Pick your branch and the **`/ (root)`** folder, then **Save**.
4. Wait a minute or two. The URL appears at the top of the same page, in the
   form `https://<username>.github.io/<repository>/`.

GitHub Pages serves from a subfolder unless you attach a custom domain. Since
the metadata points at `https://architectsandai.com`, add the domain under
**Settings -> Pages -> Custom domain** rather than launching on the
`github.io` subfolder URL — otherwise the canonical and Open Graph URLs will
name an address the site is not actually served from.

---

## Outstanding items

### Visible on the page

**Sample spreads** — the "Look inside" section shows two marked placeholder
frames. To fill them, save two page exports as `assets/sample-1.jpg` and
`assets/sample-2.jpg` (landscape spreads work best), delete the two
`<div class="placeholder">` blocks, and uncomment the `<img>` line beneath
each. Both already carry correct `width`, `height` and `loading="lazy"`.

Worth considering: now that all 62 chapter titles are listed on the page, this
section does less work than it did. Cutting it is a reasonable option.

### Marked in the source with `CONFIRM` comments

Five remain. None is visible to a reader; each marks something only you can
verify.

1. **`twitter:site`** — add `<meta name="twitter:site" content="@yourhandle">`
   if you have an X account. The card works without it; it only adds attribution.
2. **Practitioner input** — if working architects reviewed or contributed to
   the manuscript, the about section says where to add that. It is the
   strongest honest credibility line available. Leave it out if untrue.
3. **Payhip delivery wording** — the FAQ says a download link is emailed as
   soon as payment goes through. Confirm that matches what Payhip actually does
   on your account.
4. **Update notifications** — the FAQ promises free revised editions. Payhip
   can email existing buyers when you replace the product file; worth switching
   on, since the page now commits to it.
5. **Refund answer and consumer law** — the page states there is no refund
   policy and that sales are final. Two things to check: Payhip's own seller
   terms may grant buyers rights regardless, and UK and EU consumers normally
   hold a 14-day cancellation right on digital purchases unless they expressly
   waive it at checkout. If you sell into either market, that answer may need a
   sentence added.

### Needs one live check

The Payhip overlay checkout could not be tested during development, because the
build environment blocks `payhip.com`. Once deployed, click any buy button. A
checkout overlay should open on top of the page. If it navigates to Payhip
instead, the script is not engaging — which is safe, since that is the normal
purchase path, but the overlay would need looking at.

---

## What this site deliberately does not have

- No testimonials, review counts, star ratings or student numbers. Add them
  only when they are real.
- No countdown timers, fake scarcity or urgency devices.
- No claims about earnings, time saved or results.
- No third-party scripts other than Payhip's checkout. The analytics and pixel
  slots in `<head>` are empty and clearly marked.
- No claim, anywhere, that the author is an architect or has architectural
  training. The framing throughout is the creator of the AI for Architects
  channel, who tests these tools and reports what happens. Keep any copy you
  add consistent with that.
