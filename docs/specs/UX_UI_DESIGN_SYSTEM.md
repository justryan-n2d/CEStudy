# CEStudy UX/UI Design System

**Status:** Approved direction for implementation  
**Platforms:** Responsive web now; Android and iOS later  
**Product goal:** Help Civil Engineering students find subjects and useful math foundations quickly.

## Design principles

1. **Logo-led, not logo-disconnected.** Retain the canonical master logo and its geometry. The exact logo blue is `#0754B5`; use its transparent blue-art variant on pale or white surfaces when a larger brand mark is useful.
2. **White by default.** The website and future app launch in a white theme. Do not add a dark default or large full-width blue panels.
3. **Blue with restraint.** Use the logo blue for primary actions, links, focus indicators, and small selected states. Pale blue supports selected surfaces. Keep body text in dark neutral colors and retain teal for limited semantic accents.
4. **Useful copy only.** Text must help students navigate, understand a content status, learn a concept, or recover from a problem. Remove repeated claims, filler slogans, generic marketing copy, and statistics that do not help a student make a decision.
5. **Motion with purpose.** Motion may show hover, focus, selection, feedback, or the arrival of content. It must not delay studying or act as decoration.
6. **Performance is a design requirement.** Prefer CSS and existing dependencies; avoid large animations, continuous effects, unnecessary image payloads, repeated data fetching, and gratuitous blur or shadow.

## Design tokens

| Token | Value | Use |
|---|---|---|
| `--brand-blue` | `#0754B5` | Canonical logo color and primary actions |
| `--blue-hover` | `#06458F` | Hover/pressed state for primary actions |
| `--blue-soft` | `#E8F0F8` | Selected navigation and subtle emphasis |
| `--navy` | `#123451` | Strong text and secondary brand tone |
| `--navy-strong` | `#0B263D` | Headings |
| `--teal-dark` | `#236C62` | Limited accent and positive emphasis |
| `--muted` | `#637487` | Supporting text |
| `--line` | `#DCE5EC` | Borders and dividers |
| Page background | `#FFFFFF` | Default page surface |
| Card background | `#FFFFFF` | Cards and panels |
| Soft section surface | `#F7F9FC` | Low-emphasis grouping only |

Use Inter with system fallbacks. Body text starts at 16px; keep heading sizes responsive. Use consistent 4px/8px spacing increments and a restrained set of radii.

## Logo use

- Keep `public/branding/cestudy-master-logo.svg` as the full logo in the site header.
- Use `public/branding/cestudy-master-logo-transparent.svg` for a larger brand mark on a white/pale surface or on branded loading states.
- Keep `public/branding/cestudy-app-icon-rounded.svg` as favicon/app-icon source.
- Never redraw, stretch, rotate, independently recolor, or replace the canonical artwork with generated substitute artwork.
- Keep sufficient contrast around the blue-background master logo and preserve its proportions.

## Shared components

- **Header:** canonical logo, wordmark, concise navigation, white surface, thin border. Year levels opens the overview page, not Year 1.
- **Primary button:** logo blue with white text; one main action per region.
- **Secondary button:** white with a neutral border and navy text.
- **Subject card:** title, relevant year/category metadata, accurate content availability, and one clear destination.
- **Year card:** year number and label only unless useful verified metadata exists.
- **Search/filter:** accessible labels, visible active filters, live result count, clear reset.
- **Status:** distinguish coming soon, in preparation, and published study content; never imply review is complete without evidence.
- **Feedback states:** consistent loading, empty, error, success, focus, and disabled behavior.
- **Curriculum notice:** preserve important CHED-reference context where it affects a user's interpretation; avoid duplicating notices without a reason.

## Responsive behavior

- Mobile-first, with existing 560px and 850px breakpoints as initial reference points.
- Phone layouts prioritize the main action, search, and subject list. Cards may use two columns when readable.
- Tablet layouts use compact grids and filters without cramped labels.
- Desktop content remains centered, with a maximum width around 1120px where appropriate.
- Keep layouts usable at 320px and verify at 360, 390, 768, 1024, and 1440px.

## Motion and performance

| Element | Behavior | Constraint |
|---|---|---|
| Buttons | Quick color/press feedback | About 100–180ms |
| Cards | Small lift/border/shadow change on hover-capable devices | Avoid layout shifts |
| Page entry | One short opacity/translate transition where it helps orientation | No continuous animation |
| Loading | Skeleton or existing branded loader matching the expected content | No blocking delay |
| Reduced motion | Disable nonessential transitions and entrance effects | Respect OS preference |

- Prefer `transform` and `opacity` over animations that trigger layout.
- Avoid continuous parallax, autoplay, large video backgrounds, excessive backdrop blur, and new animation libraries without a demonstrated need.
- Reserve image dimensions and optimize assets; do not load hero assets larger than needed.
- Avoid duplicate catalog fetches and unnecessary React re-renders.
- Compare build size, mobile loading, layout stability, interaction responsiveness, and browser errors before and after the redesign.

## Content rule

**If a sentence does not help a student act, understand, or recover, remove it.** Do not add text to fill empty space. Do not repeat a heading in another sentence, claim content is reviewed without verification, or display meaningless/unnecessary statistics.

## Acceptance checks

- The real master logo is unchanged and visible against a white theme.
- Logo blue is used sparingly; white remains the default surface.
- All current routes use the same token, type, spacing, button, card, and focus patterns.
- Year levels links to an overview that lists all four years.
- No filler marketing statements or non-actionable metrics appear on the homepage.
- Hover/focus states work, and reduced-motion is respected.
- Contrast, 320px layout, keyboard behavior, route refreshes, and catalog/practice behavior remain intact.
- CI, browser smoke checks, and available accessibility checks pass before merging.
