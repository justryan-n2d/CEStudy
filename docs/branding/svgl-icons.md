# SVGL and payment-brand icon asset log

Use [SVGL](https://svgl.app/) as the first lookup for recognizable service/brand SVGs. SVGL was checked for GCash, but the current library/repository tree did not contain a GCash asset.

## Brand and identity icons

- **Google sign-in mark**: `public/branding/icons/google.svg`
  - Source: [SVGL Google directory](https://svgl.app/directory/google), original asset [`static/library/google.svg`](https://github.com/pheralb/svgl/blob/main/static/library/google.svg).
  - Use only beside a clearly labelled Google sign-in action. Keep the multicolor mark unchanged and store it locally so the page makes no runtime request to SVGL.
  - Keep the mark on a white tile in both light and dark button themes. Follow the [Google Identity branding guidance](https://developers.google.com/identity/branding-guidelines): retain the standard-color G, use an explicit action label, and never recolor or distort the mark.

## Local payment icons

- **PayPal wordmark**: `public/branding/icons/paypal-wordmark.svg`
  - Source: [pheralb/svgl](https://github.com/pheralb/svgl), original path `static/library/paypal-wordmark.svg`.
- **GCash payment icon**: `public/branding/icons/gcash.svg`
  - SVG source: [elestyle/elepay-payment-logos](https://github.com/elestyle/elepay-payment-logos), original path `payment_logos/svg/gcash.svg`.
  - The repository README describes its payment-logo collection as free to use commercially. Confirm current provider brand-use requirements before production.
- **GCash support QR**: `public/branding/gcash-support-qr.png`
  - Cropped from the GCash QR image supplied in the owner's Library. The crop keeps the QR itself and its quiet margin, while omitting the larger card's displayed name and partial phone number.
  - QR was decoded in a local verification check and matched the encoded content in the supplied card. Do not edit the QR modules or add overlays on top of them.

## Asset rules

- Store icons locally to avoid extra runtime requests.
- Preserve the source logo's proportions and recognizable colors; don't use payment marks as CEStudy branding.
- Payment providers remain visibly named, so meaning is never conveyed by image alone.
- If SVGL adds a GCash asset later, compare quality and source before replacing the current icon.
