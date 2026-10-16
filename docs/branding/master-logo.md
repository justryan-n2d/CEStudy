# CEStudy Master Logo

## Canonical asset

- **Primary SVG:** `public/branding/cestudy-master-logo.svg`
- **Small-size icon:** `public/branding/cestudy-app-icon.svg`
- **Reference:** The supplied “Blueprint C: Hard Hat and Book Logo” image.
- **Primary design:** Blue background (`#0754B5`) with the traced C, hard hat, open book, blueprint marks, and Cartesian plane rendered in white.
- **Cartesian origin:** Centered at approximately `(680, 645)` in the 1254 × 1254 viewBox, at the visual center of the C's inner opening. Both axes have arrowheads in both directions.
- **Small-size version:** The simplified icon keeps the C, hard hat, book, and coordinate axes while removing construction guides and tick marks that become noisy when scaled down.

## Usage

1. Use the full master logo on larger surfaces, such as branding pages, an About section, or a launch/splash screen.
2. Use `cestudy-app-icon.svg` for the website header, browser favicon, and future home-screen/app-icon derivatives. It is designed to remain legible at small sizes.
3. Keep proportions unchanged. Do not stretch, rotate, apply independent recolors, or add additional decoration.
4. Use the files documented in [logo variations](logo-variations.md) when a white or transparent background is required. The primary brand remains white artwork on blue.
5. If a platform requires a raster icon, export a derivative from the applicable SVG and keep the SVG as the source of truth.
6. CEStudy is an independent educational project. The logo does not imply endorsement by CHED or another institution.

## Web usage

Header and favicon use the small-size icon from `/branding/cestudy-app-icon.svg`:

```tsx
<img src="/branding/cestudy-app-icon.svg" alt="" aria-hidden="true" width={48} height={48} />
```

When the icon is inside a link that already has an accessible name, keep it decorative (`alt=""`) to avoid announcing the brand twice. For a standalone logo image, provide `alt="CEStudy"`.

## Future mobile app use

Use the simplified SVG as the base for Android and iOS app icons, exporting platform-specific sizes only when required. Review 16, 32, 48, and 64 px versions before release. Use the full master SVG for larger launch or brand screens.

## Change control

Update the SVG and this guide together for future logo changes. Preserve the blue background, white C/graphics, and centered Cartesian origin unless the product owner approves a deliberate rebrand.
