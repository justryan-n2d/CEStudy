# CEStudy Master Logo

## Canonical asset

- **SVG source:** `public/branding/cestudy-master-logo.svg`
- **Purpose:** The master symbol for the CEStudy website and future web/mobile app surfaces.
- **Concept:** A bold blue `C` represents CEStudy. The hard hat signals civil engineering, the open book represents learning, the Cartesian plane represents mathematics and technical fundamentals, and the thin construction marks reference engineering drawings.
- **Primary colors:** Blue gradient built from `#0754B8`, `#116BD4`, and `#064BAA`; white details; lighter blue grid lines. The SVG has a transparent canvas.
- **Current website use:** The SVG is used in the site header and as the browser's SVG favicon.

## Usage rules

1. Use the SVG directly wherever supported. Do not convert the master source into a raster image for the website header or app UI.
2. Preserve its proportions. Scale it uniformly and keep enough clear space around the outer construction marks.
3. Use it on a light or white background for the intended blue-and-white contrast. Do not stretch, rotate, add shadows, recolor individual parts, or redraw the mark independently.
4. Keep the SVG as the source of truth. If a platform requires PNG or another raster size, export a derivative from this SVG and do not replace the master source.
5. Treat the symbol as product branding, not as a claim of endorsement by CHED or another institution.

## Web usage

The canonical public asset is served at `/branding/cestudy-master-logo.svg`. The website header and browser icon should reference this same file so the brand stays consistent.

```tsx
<img
  src="/branding/cestudy-master-logo.svg"
  alt=""
  aria-hidden="true"
  width={48}
  height={48}
/>
```

When the logo is inside a link that already has an accessible name, keep the image decorative (`alt=""`) to avoid announcing the brand twice. For a standalone logo image, provide an appropriate text alternative such as `CEStudy`.

## App usage

For a future Android or iOS app, use this SVG as the vector source. Export platform-specific icon sizes from the same source only when required by the platform. Review the final icon at small sizes; retain the C, hard hat, and coordinate axes as the key features if a simplified app-icon derivative is needed.

## Changes

Any future logo changes should update this file and the SVG together. Preserve the blue C, hard hat, open book, and central Cartesian plane unless the product owner approves a deliberate rebrand.
