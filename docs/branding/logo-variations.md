# CEStudy Logo Variations

The primary identity is the **white master artwork on a solid blue background**. Keep the following alternate assets for future UI surfaces. They are variations, not replacements for the primary master.

## Retained variations

| Asset | Background and foreground | Intended use |
|---|---|---|
| `public/branding/cestudy-master-logo-white.svg` | White background, blue traced artwork | Retains the original reference's light-background treatment for future pages or materials that need it |
| `public/branding/cestudy-master-logo-transparent.svg` | Transparent background, blue traced artwork | Loading states and light surfaces where the logo should not have a white square behind it |
| `public/branding/cestudy-master-logo.svg` | Solid blue background with soft rounded corners, white traced artwork | Primary full logo, including the website header |
| `public/branding/cestudy-app-icon.svg` | Square blue background, master-traced white artwork with simplified central axes | Original square app-icon derivative without rounded-corner masking |
| `public/branding/cestudy-app-icon-rounded.svg` | Blue square with a 14% corner radius, transparent outside the corners, and the same white master artwork | Approved rounded-square app icon and browser favicon |

## Rules

- Preserve the supplied reference composition across variants: C, hard hat, open book, blueprint marks, and centered Cartesian plane.
- Both the full master logo and the rounded-square app icon use a 176-unit corner radius on the 1254-unit square (about 14%), with SVG clipping and geometric-precision rendering for clean outer edges. The master artwork and Cartesian origin remain unchanged.
- The website header uses the full rounded-corner master logo. The browser favicon uses `cestudy-app-icon-rounded.svg`.
- The full logo's Cartesian origin stays centered in the C opening. The small-size icon reuses the master-traced geometry and removes only coordinate tick marks and x/y labels; it does not independently redraw the C, hard hat, or book.
- Use the transparent blue-art variant on light backgrounds. Do not place white artwork on a white background or blue artwork on a similarly blue background.
- Avoid editing one variant without updating the related variants and the [master logo guide](master-logo.md).
- Keep all SVGs as editable vector source files. Raster exports are derivatives only.
