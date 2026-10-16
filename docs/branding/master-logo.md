# CEStudy Master Logo

## Canonical asset

- **SVG source:** `public/branding/cestudy-master-logo.svg`
- **Reference:** The supplied “Blueprint C: Hard Hat and Book Logo” image.
- **Purpose:** The master mark for the CEStudy website and future web/mobile app.
- **Design:** Retains the reference's blue C silhouette, hard hat, open book, and blueprint construction marks. A simple Cartesian plane with x/y axes and tick marks is placed inside the C's central negative space. The axes intersect at the visual center of the C, so the origin is centered rather than offset to one side. Both axes have arrowheads at both ends.
- **Colors and canvas:** Blue gradients and white details on a white square background, matching the reference's blue-and-white presentation.
- **Format:** The shapes are traced vector paths in SVG. The file does not embed the reference PNG.

## Usage rules

1. Use the SVG as the source of truth wherever SVG is supported. Do not recreate or substitute the mark with a different C, helmet, or book design.
2. Preserve the original proportions and the relative position of the helmet, C, book, and blueprint marks. Keep the Cartesian plane centered in the open area inside the C, with the x- and y-axes crossing at the center of the C (the origin).
3. Scale uniformly. Do not stretch, rotate, independently recolor, or add extra decorations.
4. The asset includes a white background to retain the white fields and details of the supplied reference. Use it on white or light neutral surfaces.
5. If a platform requires a raster icon, export the derivative from this SVG and do not replace the master source.
6. This is independent CEStudy branding and does not imply endorsement by CHED or another institution.

## Web usage

The public asset is served from `/branding/cestudy-master-logo.svg`. The header and browser favicon should use the same file for consistent branding.

```tsx
<img
  src="/branding/cestudy-master-logo.svg"
  alt=""
  aria-hidden="true"
  width={48}
  height={48}
/>
```

When the logo sits inside a link that already has an accessible name, a decorative image (`alt=""`) avoids announcing the brand twice. For a standalone logo image, use `alt="CEStudy"`.

## Future mobile app usage

Use this SVG as the vector source for Android and iOS derivatives. Check small-size readability before exporting platform-specific icons. Keep the C, hard hat, book, and centered coordinate plane recognizable.

## Change control

Update this file and this guide together for future logo changes. Preserve the supplied reference's composition unless the product owner explicitly approves a rebrand.