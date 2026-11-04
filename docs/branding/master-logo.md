# CEStudy Master Logo

## Canonical asset

- **Primary SVG:** `public/branding/cestudy-master-logo.svg`
- **Website header:** `public/branding/cestudy-master-logo.svg`
- **Browser favicon:** `public/branding/cestudy-app-icon-rounded.svg`
- **Small-size derivative:** `public/branding/cestudy-app-icon.svg` (retained as an optional variant, not the main website mark)
- **Loading states:** `public/branding/cestudy-master-logo-transparent.svg`
- **Reference:** The supplied “Blueprint C: Hard Hat and Book Logo” image.
- **Primary design:** Blue background (`#0754B5`) with the traced C, hard hat, open book, blueprint marks, and Cartesian plane rendered in white. The blue square has a soft 176-unit corner radius (about 14% of the 1254-unit canvas), with clipping to preserve clean, rounded outer edges.
- **Cartesian origin:** Centered at approximately `(680, 645)` in the 1254 × 1254 viewBox, at the visual center of the C's inner opening. Both axes have arrowheads in both directions.
- **Small-size version:** The small-size icon is a crop of the actual traced master artwork, not a separately redrawn C/helmet/book. It retains the reference C, hard hat, book, and blueprint linework, removes the graph tick marks and x/y labels, and uses bolder Cartesian axes for better visibility.

## Usage

1. Use the full master logo on larger surfaces, such as branding pages, an About section, or a launch/splash screen.
2. Use the full `cestudy-master-logo.svg` in the website header, preserving the primary master identity and the same soft rounded corners as the approved app icon.
3. Use `cestudy-app-icon-rounded.svg` as the browser favicon and rounded-square app-icon variant.
4. Use `cestudy-master-logo-transparent.svg` in loading states on light surfaces. The shared `BrandLoader` component gives it a subtle pulse and respects reduced-motion preferences.
5. Keep `cestudy-app-icon.svg` as an optional simplified derivative for future app-icon trials; it is not used as the website's main logo.
6. Keep proportions unchanged. Do not stretch, rotate, apply independent recolors, or add additional decoration.
7. Use the files documented in [logo variations](logo-variations.md) when a white or transparent background is required. The primary brand remains white artwork on blue.
8. If a platform requires a raster icon, export a derivative from the applicable SVG and keep the SVG as the source of truth.
9. CEStudy is an independent educational project. The logo does not imply endorsement by CHED or another institution.

## Web usage

The website header uses the full master logo with rounded corners. The browser favicon uses the matching rounded-square app icon:

```tsx
<img src="/branding/cestudy-master-logo.svg" alt="" aria-hidden="true" width={52} height={52} />
```

When the icon is inside a link that already has an accessible name, keep it decorative (`alt=""`) to avoid announcing the brand twice. For a standalone logo image, provide `alt="CEStudy"`.

## Future mobile app use

Use the simplified SVG as the base for Android and iOS app icons, exporting platform-specific sizes only when required. Review 16, 32, 48, and 64 px versions before release. Use the full master SVG for larger launch or brand screens.

## Change control

Update the SVG and this guide together for future logo changes. Preserve the blue background, white C/graphics, and centered Cartesian origin unless the product owner approves a deliberate rebrand.
