# SVGL icon asset log

Use SVGL as the first lookup for recognizable service/brand SVGs: https://svgl.app/. Its API docs describe searching by title and retrieving optimized SVG source: https://svgl.app/docs/api.

## Asset used
- PayPal wordmark: public/branding/icons/paypal-wordmark.svg
- Source repository: https://github.com/pheralb/svgl
- Original path: static/library/paypal-wordmark.svg
- Used next to the visible PayPal support label.
- Do not recolor or use this as CEStudy branding. Check provider brand-use requirements before production.

## Not found
- GCash did not appear in the SVGL repository paths checked during this work. Until a verified GCash logo is available, use a neutral QR-code icon beside the text label rather than inventing a provider logo.

## Rules
- Store chosen SVGs locally to avoid extra runtime requests.
- Preserve viewBox; avoid remote SVG embedding when a local asset is practical.
- Payment providers remain visibly named; the meaning is not carried by an image alone.
- Recheck source and provider brand requirements when introducing new service logos.