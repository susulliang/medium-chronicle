# The Metamedium Chronicle

> *"Printed on Recycled Electrons"* — A global broadside of digital art, media studies, and experimental curation.

A Vite-powered SPA that renders **The Metamedium Chronicle** from structured content files. New journal issues are published by pushing a dated folder to `journals/` — no code changes, no rebuilds, no CMS.

---

## Table of Contents

- [How It Works](#how-it-works)
- [Publishing a New Journal](#publishing-a-new-journal)
  - [1. Create the issue folder](#1-create-the-issue-folder)
  - [2. Write `issue.json`](#2-write-issuejson)
  - [3. Write article files](#3-write-article-files-articlesmdjson)
  - [4. Write infographic files](#4-write-infographic-files)
  - [5. Add assets](#5-add-assets)
  - [6. Push](#6-push)
- [Content Types](#content-types)
- [Article Layouts](#article-layouts)
- [Full Schema Reference](#full-schema-reference)
  - [issue.json](#issuejson-schema)
  - [Article Markdown Frontmatter](#article-markdown-frontmatter)
  - [radar.json](#radarjson-schema)
  - [calendar.json](#calendarjson-schema)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Repository Structure](#repository-structure)

---

## How It Works

```
journals/
└── 2026-08-15/            ← You create this folder
    ├── issue.json         ← Issue metadata & article list
    ├── articles/
    │   ├── my-article.md  ← Article body (Markdown + YAML frontmatter)
    │   └── ...
    ├── infographics/
    │   ├── radar.json     ← Trend radar data
    │   └── calendar.json  ← Festival/event calendar
    └── assets/
        └── cover.jpg      ← Images referenced by articles
```

When you push to `main`, GitHub Actions automatically:
1. Scans all `journals/*/` folders and regenerates `journals/manifest.json`
2. Commits the updated manifest
3. Builds the Vite app (`npm run build`)
4. Deploys to **Vercel** and **Cloudflare Pages**

The SPA fetches `manifest.json` at runtime and renders the **newest issue by date** on load. Older issues are accessible via the **Archives** overlay (`#/archives`).

---

## Publishing a New Journal

### 1. Create the issue folder

Name the folder with the publish date in `YYYY-MM-DD` format:

```
journals/
└── 2026-08-15/
    ├── issue.json
    ├── articles/
    ├── infographics/
    └── assets/
```

### 2. Write `issue.json`

This file defines the issue metadata and declares the ordered list of articles.

```json
{
  "date": "2026-08-15",
  "edition": "Vol. IV • No. 10",
  "title": "The Metamedium Chronicle",
  "subtitle": "Summer 2026: Bodies, Borders & Bandwidth",
  "description": "A broadsheet exploring embodied computation, border surveillance art, and low-bandwidth community networks across Southeast Asia and Southern Europe.",
  "scope": "Jakarta • Athens • Lagos • Montréal • Seoul",
  "scopeShort": "Global (SE Asia, EU, Africa, Americas)",
  "defaultTheme": "paper",
  "articles": [
    {
      "id": "jakarta-biennial",
      "type": "festival",
      "layout": "main",
      "columns": 3,
      "kicker": "Feature Report • Southeast Asia",
      "title": "Jakarta Biennale 2026: The Body as Infrastructure",
      "subtitle": "Indonesian artists reclaim the nervous system as a political site.",
      "author": "Sari Wijaya, Southeast Asia Correspondent",
      "location": "Jakarta, Indonesia",
      "coverImage": "assets/jakarta_biennial.jpg",
      "coverCaption": "Fig 1. Wearable biosensor installation by Mia Raharjo, Jakarta Art Space.",
      "file": "articles/jakarta-biennial.md"
    },
    {
      "id": "border-sound",
      "type": "theory",
      "layout": "sidebar",
      "columns": 1,
      "kicker": "Media Theory Corner",
      "title": "Listening at the Edge: Sound Art and Border Surveillance",
      "subtitle": "How artists are turning acoustic data into political testimony.",
      "author": "Dr. Amara Nwosu",
      "location": "Lagos / Athens",
      "coverImage": null,
      "file": "articles/border-sound.md"
    }
  ],
  "infographics": {
    "radar": "infographics/radar.json",
    "calendar": "infographics/calendar.json"
  }
}
```

### 3. Write article files (`articles/*.md`)

Each article is a Markdown file with a YAML frontmatter block at the top.

```markdown
---
id: jakarta-biennial
type: festival
pullQuote: "The body is the last unmonetised network."
---

The Jakarta Biennale, now in its 20th edition, has long been a bellwether for
Southeast Asian media art. This year's theme — *The Body as Infrastructure* —
arrives at a moment when wearable biosensors, neural interfaces, and implantable
RFID chips have become commonplace consumer products.

Curator Sari Wijaya assembled 47 artists from across the archipelago to examine
what it means when the nervous system itself becomes a site of data extraction.
The flagship installation, **"Synaptic Toll"** by Mia Raharjo, maps the galvanic
skin responses of ten volunteers onto a city-scale LED grid above Kota Tua.

> The body is the last unmonetised network — once capital colonises sensation,
> where does resistance live?

Artists push back not with abstraction but with intimacy. Reza Pratama's
*Slow Data* series presents hand-embroidered circuit diagrams, converting
electrical schematics into textile objects that must be held to be understood.
```

**Key rules:**
- The **first paragraph** automatically gets the drop-cap large-letter treatment — make it count.
- To trigger the **pull quote** banner mid-article, set `pullQuote` in the frontmatter. It is inserted automatically after the second paragraph.
- Standard Markdown formatting works: `**bold**`, `*italic*`, `> blockquote`, headings, lists.
- Do **not** add a `# Heading` at the top — the title comes from `issue.json`.

### 4. Write infographic files

#### `infographics/radar.json`

The interactive trend radar. Five vertices, each representing a media art trend.

```json
{
  "title": "Trend Radar",
  "subtitle": "Interactive Media Art Coordinates (Aug 2026)",
  "vertices": [
    {
      "key": "embodiment",
      "label": "EMBODIMENT",
      "x": 100, "y": 36,
      "labelX": 100, "labelY": 14,
      "labelAnchor": "middle",
      "title": "Embodied Computation",
      "strength": 88,
      "description": "Biosensors, neural interfaces, and wearables as artistic material..."
    },
    {
      "key": "surveillance",
      "label": "SURVEILLANCE",
      "x": 168, "y": 77,
      "labelX": 184, "labelY": 73,
      "labelAnchor": "start",
      "title": "Counter-Surveillance Art",
      "strength": 82,
      "description": "Artists using acoustic, thermal, and RF data to expose border apparatus..."
    },
    {
      "key": "lowtech",
      "label": "LOW-TECH",
      "x": 135, "y": 149,
      "labelX": 154, "labelY": 177,
      "labelAnchor": "start",
      "title": "Low-Bandwidth Networks",
      "strength": 74,
      "description": "Mesh radio, SMS art, and community-owned infrastructure..."
    },
    {
      "key": "textile",
      "label": "TEXTILE",
      "x": 60, "y": 155,
      "labelX": 46, "labelY": 177,
      "labelAnchor": "end",
      "title": "Textile + Computation",
      "strength": 68,
      "description": "Hand-woven circuit diagrams and e-textile interventions..."
    },
    {
      "key": "sonic",
      "label": "SONIC",
      "x": 47, "y": 82,
      "labelX": 16, "labelY": 73,
      "labelAnchor": "end",
      "title": "Sonic Geopolitics",
      "strength": 79,
      "description": "Sound as testimony, acoustic data as political archive..."
    }
  ],
  "gridPolygons": [
    "100,20 176,75 147,165 53,165 24,75",
    "100,40 157,81 135,149 65,149 43,81",
    "100,60 138,88 122,132 78,132 62,88",
    "100,80 119,94 111,116 89,116 81,94"
  ],
  "valuePolygon": "100,36 168,77 135,149 60,155 47,82"
}
```

**Radar geometry tips:**
- The SVG viewBox is `0 0 200 200`, centred at `(100, 100)`.
- The outermost grid polygon uses the **same 5 points** as the vertex `(x, y)` coordinates.
- `valuePolygon` is what gets filled — adjust its points to reflect each trend's `strength` (closer to centre = weaker).
- `labelAnchor` controls SVG text alignment: use `"middle"` for top/bottom, `"start"` for right side, `"end"` for left side.

#### `infographics/calendar.json`

The festival index table shown below the articles.

```json
{
  "title": "Global Festival & Exhibition Index",
  "subtitle": "Calendar covering SE Asia, EU, Africa, and Americas (2026)",
  "columns": ["Outlet / Program", "Date (2026)", "Region & Location", "Core Scope / Theme"],
  "rows": [
    {
      "type": "festival",
      "name": "Jakarta Biennale 2026",
      "date": "Aug 1 – Sept 15, 2026",
      "region": "Southeast Asia (Jakarta, Indonesia)",
      "theme": "The Body as Infrastructure",
      "badge": "festival"
    },
    {
      "type": "theory",
      "name": "Sonic Borders Symposium",
      "date": "Aug 20 – 22, 2026",
      "region": "Europe (Athens, Greece)",
      "theme": "Acoustic Data & Political Testimony",
      "badge": "symposium"
    },
    {
      "type": "trends",
      "name": "Lagos Media Lab Residency",
      "date": "Sept – Dec 2026",
      "region": "Africa (Lagos, Nigeria)",
      "theme": "Low-bandwidth Community Networks",
      "badge": "ongoing"
    }
  ]
}
```

### 5. Add assets

Place all images referenced in `issue.json` (`coverImage` fields) inside `assets/`:

```
journals/2026-08-15/assets/
├── jakarta_biennial.jpg   ← referenced as "assets/jakarta_biennial.jpg"
└── sonic_borders.jpg
```

- **Recommended size:** 1200×800px or wider, JPEG at 80% quality.
- The filename in `issue.json` is relative to the issue folder root (e.g. `"assets/jakarta_biennial.jpg"`).
- Articles with `"coverImage": null` show no illustration — this is fine for theory/excerpt pieces.

### 6. Push

```bash
git add journals/2026-08-15/
git commit -m "publish: August 2026 — Bodies, Borders & Bandwidth"
git push
```

**That's it.** GitHub Actions takes over:
- Regenerates `journals/manifest.json` (commits it with `[skip ci]`)
- Builds the Vite app
- Deploys to Vercel + Cloudflare Pages

The new issue becomes the default view as soon as the deploy completes (~2–3 min).

---

## Content Types

The `type` field on each article controls the **filter pill** it appears under:

| `type` value | Filter pill label | Typical use |
|---|---|---|
| `festival` | Festivals & Events | Festival coverage, exhibition reviews |
| `trends` | Aesthetic Trends | Style movements, material shifts |
| `theory` | Critical Theory | Academic essays, media theory |
| `review` | Reviews | Single-work or exhibition reviews |
| `excerpt` | Excerpts | Reprints, translated extracts |

The `type` value on each **calendar row** (`rows[].type`) uses the same keys, so calendar rows filter in sync with the article pills.

Calendar `badge` values control the coloured label in the table:

| `badge` value | Colour | Use for |
|---|---|---|
| `festival` | Blue | Time-bounded festivals |
| `symposium` | Crimson | Academic symposia, conferences |
| `ongoing` | Teal | Long-running exhibitions, residencies |

---

## Article Layouts

The `layout` field in `issue.json` determines where the article appears:

| `layout` | `columns` | Position | Best for |
|---|---|---|---|
| `main` | `3` | Left section, 3-column broadsheet | Long feature reports |
| `main` | `2` | Left section, 2-column | Medium-length dispatches |
| `sidebar` | `1` | Right column | Short pieces, theory notes, event previews |

**Recommended article count per issue:** 2–3 main + 2–4 sidebar = 4–7 total.

---

## Full Schema Reference

### `issue.json` schema

| Field | Type | Required | Description |
|---|---|---|---|
| `date` | `"YYYY-MM-DD"` | ✅ | Publication date. Must match folder name. |
| `edition` | `string` | ✅ | e.g. `"Vol. IV • No. 10"` |
| `title` | `string` | ✅ | Always `"The Metamedium Chronicle"` |
| `subtitle` | `string` | ✅ | Issue-specific tagline, shown in archive cards |
| `description` | `string` | ✅ | One-sentence summary for manifest/SEO |
| `scope` | `string` | ✅ | Full city list for submasthead (e.g. `"Jakarta • Athens"`) |
| `scopeShort` | `string` | ✅ | Abbreviated region for top controls bar |
| `defaultTheme` | `"paper"` \| `"cyber"` | — | Default visual theme. Omit to use `"paper"`. |
| `articles` | `Article[]` | ✅ | Ordered list — main articles first, then sidebar |
| `infographics.radar` | `string` | ✅ | Relative path to radar.json |
| `infographics.calendar` | `string` | ✅ | Relative path to calendar.json |

**Article object fields:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✅ | Slug, matches markdown filename (no `.md`) |
| `type` | `string` | ✅ | Content type — see [Content Types](#content-types) |
| `layout` | `"main"` \| `"sidebar"` | ✅ | Column position |
| `columns` | `1` \| `2` \| `3` | ✅ | Column count within the layout |
| `kicker` | `string` | ✅ | Small label above the title |
| `title` | `string` | ✅ | Article headline |
| `subtitle` | `string` | ✅ | Deck / standfirst |
| `author` | `string` | ✅ | Byline |
| `location` | `string` | ✅ | City / dateline |
| `coverImage` | `string` \| `null` | ✅ | Relative path to image, or `null` |
| `coverCaption` | `string` | — | Caption below the image |
| `file` | `string` | ✅ | Relative path to the `.md` file |

---

### Article Markdown Frontmatter

```yaml
---
id: my-article-slug          # must match issue.json article id
type: festival               # content type (see table above)
pullQuote: "Quote text here" # optional — injected as a banner after 2nd paragraph
---
```

Only `id`, `type`, and optionally `pullQuote` are used. All other metadata (title, author, layout) comes from `issue.json`.

---

### `radar.json` schema

| Field | Type | Description |
|---|---|---|
| `title` | `string` | Card heading |
| `subtitle` | `string` | Card subheading |
| `vertices` | `Vertex[]` | Exactly 5 trend vertices |
| `gridPolygons` | `string[]` | 4 SVG polygon point strings (outer → inner) |
| `valuePolygon` | `string` | SVG polygon for the filled data area |

**Vertex object:**

| Field | Type | Description |
|---|---|---|
| `key` | `string` | Unique identifier (used for click handlers) |
| `label` | `string` | Short label shown on the SVG axis |
| `x`, `y` | `number` | SVG coordinate of the vertex dot (viewBox 0 0 200 200) |
| `labelX`, `labelY` | `number` | SVG coordinate for the label text |
| `labelAnchor` | `"middle"` \| `"start"` \| `"end"` | SVG text-anchor for label alignment |
| `title` | `string` | Full trend name shown in the detail panel |
| `strength` | `number` | 0–100 trend strength, shown in the detail panel |
| `description` | `string` | Trend description shown on vertex click |

---

### `calendar.json` schema

| Field | Type | Description |
|---|---|---|
| `title` | `string` | Table card heading |
| `subtitle` | `string` | Table card subheading |
| `columns` | `string[4]` | Column header labels (exactly 4) |
| `rows` | `Row[]` | Table rows |

**Row object:**

| Field | Type | Description |
|---|---|---|
| `type` | `string` | Content type — controls filter sync with article pills |
| `name` | `string` | Festival/event name |
| `date` | `string` | Date string (free format, e.g. `"Aug 1 – Sept 15, 2026"`) |
| `region` | `string` | Region and city |
| `theme` | `string` | Theme or scope, shown as a badge |
| `badge` | `"festival"` \| `"symposium"` \| `"ongoing"` | Badge colour style |

---

## Local Development

```bash
# Install dependencies (one-time)
npm install

# Start dev server (journals/ served live at /journals/)
npm run dev
# → http://localhost:3000

# Production build + copy journals/ to dist/
npm run build

# Preview production build locally
npm run preview

# Manually regenerate journals/manifest.json
npm run manifest
```

---

## Deployment

### GitHub Actions (zero-touch)

Two workflows live in `.github/workflows/`:

| Workflow | Trigger | What it does |
|---|---|---|
| `publish.yml` | Push to `journals/**` | Regen manifest → commit → build → deploy to Vercel + CF |
| `deploy-only.yml` | Push to `src/**` or config files | Build → deploy (no manifest update) |

### Required GitHub Secrets

Add these in **GitHub → Settings → Secrets and variables → Actions:**

| Secret | Where to get it |
|---|---|
| `VERCEL_TOKEN` | Vercel → Account Settings → Tokens |
| `VERCEL_ORG_ID` | Run `npx vercel link` → `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Same file |
| `CF_API_TOKEN` | Cloudflare → My Profile → API Tokens → "Edit Cloudflare Pages" |
| `CF_ACCOUNT_ID` | Cloudflare dashboard → right sidebar |

### Manual deploy

```bash
# Deploy to Vercel
npx vercel --prod

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name=medium-chronicle
```

---

## Repository Structure

```
medium-chronicle/
│
├── journals/                        ← Content only — no framework code here
│   ├── manifest.json                ← Auto-generated index of all issues
│   └── YYYY-MM-DD/
│       ├── issue.json               ← Issue metadata & article list
│       ├── articles/
│       │   └── *.md                 ← Article bodies (Markdown + YAML frontmatter)
│       ├── infographics/
│       │   ├── radar.json           ← Trend radar data
│       │   └── calendar.json        ← Festival index table
│       └── assets/
│           └── *.jpg / *.png        ← Images
│
├── src/                             ← Vite SPA source
│   ├── main.js                      ← App bootstrap & routing lifecycle
│   ├── style.css                    ← Full design system (Paper + Terminal themes)
│   ├── router.js                    ← Hash-based router (#/, #/archives, #/issue/:date)
│   ├── store.js                     ← Reactive state (theme, filter, search)
│   ├── components/
│   │   ├── Masthead.js              ← Chronicle nameplate & tagline
│   │   ├── TopControls.js           ← Date bar, theme toggle, search, archives button
│   │   ├── FilterBar.js             ← Content-type filter pills
│   │   ├── IssueViewer.js           ← Full issue layout (newspaper grid)
│   │   ├── ArticleRenderer.js       ← Markdown → HTML, pull quotes, images
│   │   ├── RadarChart.js            ← Interactive SVG trend radar
│   │   ├── CalendarTable.js         ← Festival index table
│   │   ├── ArchivesOverlay.js       ← Slide-in archive browser
│   │   └── IssueCard.js             ← Single card in the archive grid
│   └── utils/
│       ├── contentLoader.js         ← fetch() helpers with caching
│       └── markdownParser.js        ← marked.js wrapper + frontmatter parser
│
├── scripts/
│   ├── generate-manifest.js         ← Scans journals/, writes manifest.json
│   └── copy-journals.js             ← Post-build: copies journals/ → dist/journals/
│
├── .github/workflows/
│   ├── publish.yml                  ← Zero-touch publish pipeline
│   └── deploy-only.yml              ← Site-only deploy (no manifest regen)
│
├── index.html                       ← Vite entry shell
├── vite.config.js                   ← Custom middleware for dev + build config
├── vercel.json                      ← Vercel build settings
├── wrangler.toml                    ← Cloudflare Pages config
└── package.json                     ← Vite + marked.js
```

---

*The Metamedium Chronicle is an open publication. Readers and correspondents welcome.*
