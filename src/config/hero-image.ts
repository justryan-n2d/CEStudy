/**
 * Change photoId, alt, and credit together to replace the homepage hero photo.
 * The source stays centralized here; HomePage does not need layout changes.
 */
const HERO_PHOTO_ID = "photo-1637078846596-0efb09c121f2";
const HERO_PHOTO_ALT =
  "Aerial view of a bridge crossing a river, illustrating civil engineering infrastructure";
const HERO_PHOTO_CREDIT =
  "Bridge infrastructure photo by Juan Coronel on Unsplash.";

function heroPhotoAtWidth(width: number): string {
  return `https://images.unsplash.com/${HERO_PHOTO_ID}?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=78&w=${width}`;
}

const widths = [640, 960, 1200, 1600] as const;

export const HERO_IMAGE = {
  src: heroPhotoAtWidth(1200),
  srcSet: widths.map((width) => `${heroPhotoAtWidth(width)} ${width}w`).join(", "),
  sizes: "(max-width: 680px) calc(100vw - 28px), (max-width: 1120px) 48vw, 540px",
  alt: HERO_PHOTO_ALT,
  credit: HERO_PHOTO_CREDIT,
  width: 1600,
  height: 1200,
} as const;
