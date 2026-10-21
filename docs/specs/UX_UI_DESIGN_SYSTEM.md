# CEStudy UX/UI Design System

**Status:** Approved visual direction; website information architecture is being revised  
**Platforms:** Website-first responsive web now; native Android and iOS later  
**Product goal:** Help Civil Engineering students find subjects and useful math foundations quickly.

**Website strategy (updated 2026-10-21):** CEStudy is website-first, not mobile-first. Plan the desktop information architecture and primary website workflows first, then adapt the approved structure for tablet and phone browsers. Mobile-browser usability remains required, but must not dictate the entire website architecture. The future native app will receive a separately designed interaction model. See the [dated website-first information architecture plan](../plans/2026-10-21-website-first-information-architecture-plan.md).

## Design principles

1. **Website-first information architecture.** Design the desktop website structure and primary workflows first. Adapt them responsively for tablet and phone browsers afterward; mobile-browser usability remains required but does not set the overall architecture.
2. **Logo-led, not logo-disconnected.** Retain the canonical master logo and its geometry. The exact logo blue is `#0754B5`; use its transparent blue-art variant on pale or white surfaces when a larger brand mark is useful.
3. **White by default.** The website and future app launch in a white theme. Do not add a dark default or large full-width blue panels.
4. **Blue with restraint.** Use the logo blue for primary actions, links, focus indicators, and small selected states. Pale blue supports selected surfaces. Keep body text in dark neutral colors and retain teal for limited semantic accents.
5. **Useful copy only.** Text must help students navigate, understand a content status, learn a concept, or recover from a problem. Remove repeated claims, filler slogans, generic marketing copy, and statistics that do not help a student make a decision.
6. **Motion with purpose.** Motion may show hover, focus, selection, feedback, or the arrival of content. It must not delay studying or act as decoration.
7. **Performance is a design requirement.** Prefer CSS and existing dependencies; avoid large animations, continuous effects, unnecessary image payloads, repeated data fetching, and gratuitous blur or shadow.

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

## Responsive website behavior

- Website-first: establish the desktop information architecture, page hierarchy, and wide-screen workflows first, then design responsive adaptations. Existing 560px and 850px breakpoints are initial references, not mandatory boundaries.
- Desktop content should use page-appropriate widths. Reading pages may stay centered and constrained; reference tables and dense study workspaces may need wider containers.
- Tablet layouts should retain useful hierarchy, readable filters, and adequate content space without cramped labels.
- Phone browser layouts must remain usable and should prioritize the current task, search, and content. They may use different navigation presentation from desktop without changing the underlying destination model.
- Keep layouts usable at 320px and verify at 360, 390, 768, 1024, and 1440px. Do not force desktop tables or multi-column layouts into unreadable narrow surfaces.

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
- Desktop information architecture and primary journeys are clear at 1440px and 1024px; responsive layouts remain usable at 768px, 390px, and 320px.
- Contrast, keyboard behavior, route refreshes, and catalog/practice behavior remain intact without horizontal page overflow.
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

### Website-specific structure (current baseline, subject to redesign)
- Main-branch baseline: brand header, desktop links for Subject catalog, Year levels, and Math foundations, with additional destinations available through secondary navigation/footer patterns. The documented mobile web pattern has a four-item quick-navigation bar (Home, Subjects, Years, Math) plus a More menu.
- PR #44 is an unmerged draft and proposes related account/profile/history/streak/community routes and a five-destination mobile navigation pattern including Menu. Keep this distinct from current main and preserve PR #44's release gates.
- Treat the current desktop and mobile-web structures as audit baselines, not fixed requirements. The approved website-first IA may reorganize, group, rename, replace, or remove navigation elements after review.
- The mobile web navigation must not cover final content; allow room for safe-area insets on gesture-navigation devices.
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
