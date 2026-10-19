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

## Theme system

Light mode remains the default. Students can switch to dark mode from Menu; the choice is saved locally and applied before the application renders. Both themes must use the same component, spacing, typography, and navigation system. Dark mode is a coordinated color change, not a page-by-page redesign.

| Semantic role | Light | Dark |
|---|---|---|
| Page background | `#FFFFFF` | `#0B1421` |
| Card and panel surface | `#FFFFFF` | `#121F30` |
| Raised surface and inputs | `#F7F9FC` | `#172538` |
| Header and bottom navigation | `#FFFFFF` | `#101C2B` |
| Primary text | `#24384B` | `#E5EDF6` |
| Headings | `#0B263D` | `#F3F7FB` |
| Supporting text | `#637487` | `#B6C4D4` |
| Border and divider | `#DCE5EC` | `#2B3D51` |
| Focus and link accent | `#0754B5` | `#90C4FF` |
| Selected surface | `#E8F0F8` | `#1B3147` |

- Use a deep navy background rather than pure black. Do not carry over the purple palette from the visual reference; retain CEStudy's blue identity, neutral surfaces, and restrained teal/green success cues.
- All card, form, dialog, empty, loading, error, selected, and disabled states must be readable in both themes. Use semantic tokens instead of adding unrelated colors to individual pages.
- Keep text and control contrast at WCAG AA targets where applicable. Focus indicators must remain clearly visible on dark surfaces, and status must not rely on color alone.
- Keep the official blue-and-white logo artwork unchanged. White tiles behind the Google mark and payment QR/brand assets are intentional exceptions.
- The saved preference must not depend on sign-in or clear history/progress. Update the browser's `theme-color` alongside the document color scheme, and initialize the saved theme before first paint without inline script because the site uses a restrictive Content Security Policy.


## Logo use

- Keep `public/branding/cestudy-master-logo.svg` as the full logo in the site header.
- Use `public/branding/cestudy-master-logo-transparent.svg` for a larger brand mark on a white/pale surface or on branded loading states.
- Keep `public/branding/cestudy-app-icon-rounded.svg` as favicon/app-icon source.
- Never redraw, stretch, rotate, independently recolor, or replace the canonical artwork with generated substitute artwork.
- Keep sufficient contrast around the blue-background master logo and preserve its proportions.

## Authentication and account access

- Browsing the engineering library never requires sign-in. Google sign-in is optional and is currently limited to activating/account-separating the streak feature; it does not turn local history or progress into cloud sync.
- Keep `/login` as the authentication route and `/profile` as the account destination. A guest sees a clear Google sign-in action on Profile. A signed-in user sees account status, study shortcuts, and a sign-out action.
- After OAuth, return students to the destination they were trying to open when safe; otherwise use Profile. Show a useful retryable error if sign-in fails. Never interrupt lesson browsing with a forced registration wall.
- Use a local copy of the multicolor Google G sourced from SVGL at `public/branding/icons/google.svg`; do not use a typed letter, emoji, monochrome mark, or an external runtime image URL.
- Use a plainly labelled `Continue with Google` button. Keep the G at its original proportions and on a white tile. The button uses a light outlined treatment in light mode and a dark neutral treatment in dark mode, aligned with [Google Identity branding guidance](https://developers.google.com/identity/branding-guidelines).

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


## Footer

- Show the current year and `© YEAR CEStudy. All rights reserved.` without adding a long promotional description.
- Provide compact navigation links to the subject catalog, year-level overview, and math foundations.
- Link the footer to four dedicated pages: Contact, Support, Report a bug, and Feedback. The public contact and bug-report address is `cestudy00@gmail.com`.
- Clearly mark external links and open them safely in a new tab.
- Use a three-column desktop layout that becomes two columns on tablet and one column on phones.
- Keep the footer white, use the same neutral border and typography tokens, and reserve logo blue for link interaction/focus states.

## Cross-platform product system

CEStudy uses one design language with two intentionally different interfaces. The future app should not simply squeeze the responsive website into a native shell.

### Shared foundations
- The master logo, logo blue #0754B5, white surfaces, type hierarchy, semantic color roles, spacing and radius tokens.
- Consistent meaning for primary and secondary actions, subject availability states, search, filters, progress, feedback, loading, errors and success.
- Shared subject/content taxonomy, Supabase data contracts, validation rules, and access-control behavior.
- Motion principles: short, purposeful transitions; no animation blocking study tasks; reduced-motion preferences are respected.
- Brand/service logos are sourced from SVGL (https://svgl.app/) when available and stored locally. Generic interface icons remain simple and visually consistent.

### Website-specific structure
- Desktop: compact top navigation and multi-column subject lists.
- Mobile web: persistent five-item quick navigation (Home, Subjects, Years, Math, Menu), with safe-area spacing for gesture-navigation devices.
- The Menu page contains Profile, History (recently opened lessons), Streak (study-day calendar), Progress, Community, About, Contact, Support, Feedback, and bug reporting, plus a persistent light/dark appearance switch. The retired More popover must not return.
- Place a compact global streak shortcut at the header's right edge. Show the consecutive-day count before the flame. Use gray for zero/inactive and warm animated flame styling only for a signed-in active streak; honor reduced-motion preferences. Active signed-in streaks link to their calendar; signed-out inactive streaks prompt for Google sign-in.
- Keep the flame movement subtle: a small sway (about -3° to +3°) with a very small scale change, plus a soft low-amplitude glow. The motion should feel like gentle feedback, not an attention-grabbing notification. Do not animate a zero/locked streak, do not change layout while animating, and disable the flame and glow animations when `prefers-reduced-motion: reduce` is active.
- History and appearance preferences are device-local at this stage; do not imply cross-device sync. The mobile quick bar must not cover final content; allow room for safe-area insets on gesture-navigation devices.
- The homepage uses a responsive hero photograph with appropriate srcset widths and reserved dimensions. Only the primary hero is loaded eagerly.
- Scroll reveal applies only to major content sections. Use IntersectionObserver, unobserve after the first reveal, animate only opacity/transform, and show content immediately if reduced motion is requested or the API is unavailable. See MDN: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API.

### Future native mobile app
- Use a study-first home screen: Continue studying when progress exists, search, subjects, and practice reachable without a deep menu.
- Use native bottom tabs and touch-first patterns, not the website DOM, header, footer, or mobile web menu.
- Reuse the same brand, type/spacing tokens, statuses, data contracts, and interaction semantics; rebuild visual components in the future mobile framework.
- Defer the framework decision until app implementation. Do not add React Native, Expo, or another mobile framework to the current website.
- Use photography selectively; repeated study screens should stay content-first and lighter than the website homepage.

## Photography and service icons
- Homepage bridge photograph: Juan Coronel on Unsplash, https://unsplash.com/photos/an-aerial-view-of-a-bridge-over-a-river-RFJb724c660. Delivered through Unsplash's image CDN using responsive widths. Browser smoke tests check loading and CSP.
- PayPal wordmark: public/branding/icons/paypal-wordmark.svg, sourced from SVGL. See docs/branding/svgl-icons.md.
- Use object-fit: cover and a tested focal point. Never stretch a small thumbnail to fill a large hero.

## Homepage photo and brand overlay
- The hero photo is configured centrally in `src/config/hero-image.ts`. Replacing the photograph means updating the photo ID, alternative text, and credit in that file, not changing the homepage component.
- The transparent master logo is centered above the hero photo, with a low-opacity white circle behind the logo. Keep the photo, circle, and logo as independently sized responsive layers.
- Dialogs use short opacity/transform enter and exit transitions; they do not block the close action and honor reduced-motion preferences.

## About page
- The About page explains CEStudy's purpose, navigation approach, publication/review standards, independent relationship to CHED, and ways to contact the maintainer. Avoid claims of official affiliation, accreditation, or comprehensive content coverage.
