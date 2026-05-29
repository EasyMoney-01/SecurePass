# SecurePass Academy - Architectural Mandates

## 1. Layout & Styling Architecture (FROZEN)
- **Strict Vertical Flow:** The layout has been painstakingly optimized to be a strict, single-column vertical stack (`flex-direction: column` on the `main` container). 
- **NO Side-by-Side Elements:** Absolutely no elements (cards, text, inputs, or buttons) should be placed side-by-side using multi-column grids (like `1fr 1fr`). Everything MUST flow downwards ("one below the other") on all devices.
- **Responsive Wrappers:** All internal buttons and inputs must use `flex-wrap: wrap` or single-column grids to prevent horizontal overflow.
- **Preserve Existing Elements:** When adding new "Labs" or "Features", do NOT modify the layout CSS of existing elements. Simply append the new element as a new `<section class="bento-card">` child inside `<main>` following the exact same structural pattern.

## 2. General Rules
- Always maintain the premium "Bento 2.0" aesthetic (dark theme, glassmorphism, JetBrains Mono accents).
- Do not introduce horizontal scroll (`overflow-x: hidden` is applied globally).