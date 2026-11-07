# DwellSafe Brand and Icon Asset Registry

## Audit status

The supplied PDF at the repository root was inspected page by page and
rendered for visual review. It is a seven-page Canva PDF 1.4 document; each
page is 1440 × 810 points. No `design-source/` directory, standalone SVGs, or
individual production icon exports were found. The PDF provides a visual
system and size guidance, but not editable SVG source markup or explicit
numeric color tokens.

No application pages or branding components were changed. The rendered
application was not compared because this task was limited to the requested
asset audit and registry; no asset is marked implemented.

## Asset inventory

| Original filename | Asset category | Intended meaning | Approved usage | Supported variants | Original dimensions | Export format | Frontend destination |
|---|---|---|---|---|---|---|---|
| `DwellSafe icon system.pdf` (repository root) | Authoritative digital icon-system specification | A home/safety mark with verification integrated into the form; the document describes home, trust, connection, and clarity | Use as the visual authority for later icon exports and implementation; the PDF itself is a reference, not a production icon | Page 6 shows navy, green, white, and neutral-on-light/dark-background treatments; page 4 shows light/dark-context examples | 7 pages; each page 1440 × 810 pt | PDF 1.4, Canva export | Reference only; no direct frontend destination |
| `frontend/image.png` | Composite brand concept sheet | Labeled concept explorations, logo/icon/badge examples, palette, typography, and application examples | Reference only; do not use the contact sheet as a logo, favicon, or icon | Shows several concepts and examples that do not consistently match the supplied PDF's final icon | 1080 × 720 px | PNG | None; reference only |
| `frontend/public/dwellsafe-brand.png` | Duplicate composite brand concept sheet | Same image as `frontend/image.png` | Not approved as a standalone brand mark; current use conflicts with the file's contact-sheet content | Identical to `frontend/image.png`; no independent variant | 1080 × 720 px | PNG | Currently referenced by `App.tsx` and `AuthShared.tsx` as the brand image; replace only when approved standalone exports are available |
| `frontend/public/favicon.png` | Duplicate composite brand concept sheet | Same image as `frontend/image.png` | Not approved as a favicon; current use conflicts with the file's contact-sheet content | Identical to `frontend/image.png`; no independent variant | 1080 × 720 px | PNG | Currently referenced by `frontend/index.html`; replace only when approved favicon exports are available |

The three PNGs have matching SHA-256 hashes and are byte-identical.

## PDF icon and visual specifications

### Mark meaning and form

Page 2 describes the mark's foundations as:

- **Home at the core:** a place of safety and belonging.
- **Trust built in:** verification woven into the form.
- **Connection matters:** linking people, property, and peace of mind.
- **Clarity first:** a strong silhouette intended to work at different sizes.

The final mark is a rounded, continuous house/shield-like outline with a
check integrated at its lower center. It is shown in signature green on the
cover and in single-color navy, green, white, and neutral variants on page 6.
The PDF labels contexts and sizes, not separate semantic icons for verified
properties, landlords, or agents.

### Named icon identifiers and intended uses

| Identifier | PDF label | Intended meaning/use | Specified size |
|---|---|---|---|
| `app-icon` | Mobile app icon | Primary, full-scale app mark | 1024 × 1024 px @3x |
| `web-favicon` | Web favicon | Browser and bookmark icon | 32 × 32 px and 16 × 16 px |
| `browser-tab-icon` | Browser tab icon | Tab, history, and address-bar mark | 16 × 16 px |
| `pwa-icon` | PWA icon | Add to Home Screen | 192 × 192 px |
| `avatar-icon` | Avatar / profile icon | User avatar and profile | 64 × 64 px @1x |
| `notification-icon` | Small / notification icon | Menus, alerts, and indicators | 24 × 24 px @1x |

Page 4 explicitly discusses favicon/icon clarity at 16 px and 32 px and
attributes small-size legibility to simplified geometry, balanced stroke
weight, and generous negative space. It shows app, favicon, and browser-tab
examples on light and dark backgrounds. No downloadable, individually
exported files for these variants are included in the audited workspace.

### Background treatments and color

Page 6 recommends light backgrounds for everyday use and dark backgrounds for
dark mode, overlays, app interfaces, and marketing. Its labeled combinations
are:

- **Light:** Navy on White; Navy on Warm Neutral; Green on White; Green on Warm
  Neutral; Neutral on Warm Neutral.
- **Dark:** White on Navy; Green on Navy; White on Green; Green on Green;
  Neutral on Navy.

The PDF names primary navy, signature green, and warm neutral and describes
navy as reliability, green as emphasis, and neutral as subtle/premium. It
does not provide legible numeric color values in the audited pages; do not
copy palette values from the separate PNG contact sheet as if they were
verified PDF tokens.

## Missing assets and conflicting specifications

- The requested `design-source/` directory is absent.
- The PDF is a visual specification; no standalone vector source was found.
  SVG `viewBox`, dimensions, fills, and strokes therefore cannot be recorded.
- No separate production files were found for the primary/stacked wordmark,
  icon sizes, favicon, PWA icon, or background variants.
- The frontend PNG contact sheet shows a different selected logo concept and
  additional labels (including “Verified Property,” “Verified Landlord,” and
  “Verified Agent,” plus Poppins and hex palette values) not established by
  the PDF. Treat these as conflicting/unverified until the design owner
  confirms which source is current.
- Minimum sizes are specified for icon contexts above, but minimums for the
  wordmark, badge, spacing, and clear space are not specified.
- The PDF shows a “Verified Member” profile treatment and house/check
  navigation examples in a mockup, but does not define a standalone,
  production-ready verification badge or a complete set of verification-state
  icons.

## Implementation gate

Obtain individual approved exports (preferably SVGs) for the wordmark, icon
variants, favicon/PWA sizes, and any verification badges. Confirm whether the
PDF supersedes the older/different PNG contact sheet and request numeric
palette, clear-space, badge, and wordmark-size specifications. Implement only
after those assets are available, then compare the rendered light/dark and
small-screen variants against the inspected PDF. The composite PNG files are
not approved substitutes for those exports.
