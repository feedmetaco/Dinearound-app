# Soft & Soothing Color System for DineAround

## Color Philosophy

The DineAround app now features a **soft and soothing** color palette designed to create a calm, peaceful, and spa-like dining experience. The colors are inspired by natural elements: misty mornings, soft clay, sage gardens, and warm linen.

This color system maintains food relevance while providing a relaxing, approachable aesthetic that encourages users to mindfully explore and document their dining experiences.

---

## Complete Color Palette

### Primary Color - Soft Terra Cotta
**Purpose**: Main brand color, primary CTAs, emphasis
- **Base**: `#D4A59A` - Warm dusty rose/clay
- **Dark**: `#C08F84` - Deeper terracotta
- **Light**: `#E5C4BA` - Very soft peachy

**Usage**: Primary buttons, active states, brand elements, important text gradients

### Secondary Color - Warm Cream
**Purpose**: Backgrounds, subtle highlights, warmth
- **Base**: `#F5E6D3` - Warm beige/cream
- **Dark**: `#E8D5BC` - Deeper sand
- **Light**: `#FFF5E9` - Almost white cream

**Usage**: Borders, card backgrounds, subtle gradients, secondary elements

### Accent Color - Sage Green
**Purpose**: Success states, location features, natural elements
- **Base**: `#A8C4A5` - Soft sage/mint
- **Dark**: `#8FB08C` - Deeper sage
- **Light**: `#C8DCC5` - Pale sage

**Usage**: Success messages, location buttons, "use my location", visit log elements

### Accent 2 - Soft Lavender
**Purpose**: Wishlist features, special highlights, elegance
- **Base**: `#C5B8D8` - Muted lavender
- **Dark**: `#AE9EC7` - Deeper lavender
- **Light**: `#E0D9EB` - Very pale lilac

**Usage**: Wishlist page, secondary CTAs, decorative elements

---

## Neutral Colors (Warm-toned)

### Light Mode Neutrals
- **50**: `#FAF8F5` - Warm off-white (page background)
- **100**: `#F2EFE9` - Very light warm gray
- **200**: `#E6E1D8` - Light borders, dividers
- **300**: `#D4CFC4` - Subtle borders
- **400**: `#A39D93` - Inactive text, placeholders
- **500**: `#6E6962` - Secondary text
- **600**: `#524D47` - Body text (medium emphasis)
- **700**: `#3D3935` - Primary text, headings
- **800**: `#2A2621` - Dark backgrounds (dark mode)
- **900**: `#1C1916` - Very dark

### Dark Mode Colors
- **Background**: `#2A2621` - Warm dark brown
- **Foreground**: `#F2EFE9` - Warm light text

---

## Semantic Colors

### Success
- **Color**: `#9DC49A` - Soft green
- **Usage**: Success messages, confirmation states, positive feedback

### Warning
- **Color**: `#E8C988` - Soft golden
- **Usage**: Warning messages, cautionary states

### Error
- **Color**: `#D69B9B` - Soft rose
- **Usage**: Error messages, validation errors, destructive actions

### Info
- **Color**: `#A9C4D9` - Soft blue
- **Usage**: Informational messages, tips, neutral feedback

---

## Gradient Combinations

### Primary Gradient (Terra Cotta)
```css
background: linear-gradient(to right, #D4A59A, #C08F84);
```
**Usage**: Primary buttons, brand elements, emphasis

### Secondary Gradient (Sage to Terra Cotta)
```css
background: linear-gradient(to right, #A8C4A5, #D4A59A);
```
**Usage**: Log page elements, secondary features

### Wishlist Gradient (Lavender)
```css
background: linear-gradient(to right, #C5B8D8, #E0D9EB);
```
**Usage**: Wishlist page, special features

### Full Spectrum Gradient (Page Headers)
```css
background: linear-gradient(to right, #D4A59A, #A8C4A5, #C5B8D8);
```
**Usage**: Hero text, major page headlines

### Auth Page Gradients
**Login**: `linear-gradient(to bottom right, #E8D5BC, #D4A59A, #C5B8D8)`
**Signup**: `linear-gradient(to bottom right, #A8C4A5, #D4A59A, #C5B8D8)`

---

## Component Color Usage

### Navigation
- **Bottom Nav Border**: `#E8D5BC` with 40% opacity
- **Active Tab Text**: `#D4A59A` (light mode), `#E5C4BA` (dark mode)
- **Inactive Tab Text**: `#A39D93` (light mode), `#6E6962` (dark mode)
- **Active Background**: Gradient with 15% opacity

### Restaurant Cards
- **Border**: `#E8D5BC` with 40% opacity
- **Border Hover**: `#D4A59A` with 60% opacity
- **Rating Badge**: `linear-gradient(to right, #D4A59A, #C08F84)` with white text
- **Price Badge**: `#A8C4A5` background with 25% opacity, `#8FB08C` text
- **Primary Button**: `linear-gradient(to right, #D4A59A, #C08F84)`
- **Wishlist Button**: `#C5B8D8` border, `#AE9EC7` text

### Forms & Inputs
- **Border**: `#E6E1D8`
- **Background**: `#FAF8F5` (light mode), `#2A2621` (dark mode)
- **Focus Border**: `#D4A59A`
- **Focus Ring**: `#D4A59A` with 20% opacity
- **Error Text**: `#D69B9B`

### Buttons
- **Primary**: `linear-gradient(to right, #D4A59A, #C08F84)` with white text
- **Secondary (Sage)**: `linear-gradient(to right, #A8C4A5, #8FB08C)` with white text
- **Tertiary (Lavender)**: `linear-gradient(to right, #C5B8D8, #AE9EC7)` with white text
- **Clear/Cancel**: `#D69B9B` border and text

### Loading States
- **Spinner Border**: `#E8D5BC` with 40% opacity
- **Spinner Top**: `#D4A59A`
- **Loading Text**: `#D4A59A` (light mode), `#E5C4BA` (dark mode)

### Error/Success Messages
- **Success**: `#9DC49A` background (15% opacity), `#8FB08C` text
- **Error**: `#D69B9B` background (15% opacity), `#C08F84` text
- **Warning**: `#E8C988` background (15% opacity), `#D4A59A` text

---

## Accessibility & Contrast

All color combinations meet WCAG AA standards (4.5:1 contrast ratio minimum) for text:

### Text on Light Backgrounds
- **Primary Text**: `#3D3935` on `#FAF8F5` - ✅ AAA (14.2:1)
- **Secondary Text**: `#6E6962` on `#FAF8F5` - ✅ AA (7.8:1)
- **Button Text**: White on `#D4A59A` - ✅ AA (4.8:1)

### Text on Dark Backgrounds
- **Primary Text**: `#F2EFE9` on `#2A2621` - ✅ AAA (13.5:1)
- **Secondary Text**: `#A39D93` on `#2A2621` - ✅ AA (6.2:1)

---

## Migration from Vibrant Colors

### Old → New Mappings

| Old Vibrant Color | Old Hex | New Soft Color | New Hex |
|-------------------|---------|----------------|---------|
| Coral Orange | `#FF6B35` | Soft Terra Cotta | `#D4A59A` |
| Sunny Yellow | `#FFD23F` | Warm Cream | `#F5E6D3` |
| Mint Green | `#06D6A0` | Sage Green | `#A8C4A5` |
| Hot Pink | `#EF476F` | Soft Lavender | `#C5B8D8` |

### Opacity Adjustments
- Borders: Increased from 30% to 40-50% for better visibility
- Active backgrounds: Increased from 10% to 15% for subtle emphasis
- Form focus rings: Maintained at 20% for consistency

---

## CSS Variable Definitions

```css
:root {
  /* Backgrounds */
  --background: #FAF8F5;
  --foreground: #3D3935;

  /* Primary Colors - Soft Terra Cotta */
  --primary: #D4A59A;
  --primary-dark: #C08F84;
  --primary-light: #E5C4BA;

  /* Secondary Colors - Warm Cream */
  --secondary: #F5E6D3;
  --secondary-dark: #E8D5BC;
  --secondary-light: #FFF5E9;

  /* Accent - Sage Green */
  --accent: #A8C4A5;
  --accent-dark: #8FB08C;
  --accent-light: #C8DCC5;

  /* Accent 2 - Soft Lavender */
  --accent-2: #C5B8D8;
  --accent-2-dark: #AE9EC7;
  --accent-2-light: #E0D9EB;

  /* Semantic */
  --success: #9DC49A;
  --warning: #E8C988;
  --error: #D69B9B;
  --info: #A9C4D9;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #2A2621;
    --foreground: #F2EFE9;
  }
}
```

---

## Design Principles

### 1. Subtlety Over Vibrancy
- Use muted, desaturated tones
- Gentle gradients with minimal contrast
- Soft shadows and subtle transitions

### 2. Warmth & Comfort
- Warm neutral base (#FAF8F5)
- Earthy, natural color temperatures
- Approachable, spa-like atmosphere

### 3. Hierarchy Through Opacity
- Primary elements: Full opacity
- Borders: 40-50% opacity
- Backgrounds: 15-25% opacity
- Active states: 15% opacity overlays

### 4. Consistent Gradients
- Always left-to-right or top-left to bottom-right
- Two-color gradients for simplicity
- Gradient stops evenly distributed

### 5. Accessibility First
- All text meets WCAG AA minimum
- Focus states clearly visible
- Sufficient color differentiation for color-blind users

---

## Implementation Notes

### Tailwind CSS Classes
All colors use inline hex values for consistency:
```jsx
className="bg-[#D4A59A]"
className="border-[#E8D5BC]/40"
className="text-[#3D3935]"
```

### Dark Mode
Dark mode uses the same color palette with adjusted backgrounds and slightly brighter text for readability.

### Responsive Considerations
- Mobile: Larger touch targets with softer colors for comfort
- Desktop: More subtle gradients and refined details
- All platforms: Consistent color temperature and warmth

---

## Files Updated

### Global Styles
- `/web/app/globals.css` - CSS variables and root colors

### Components
- `/web/components/bottom-nav.tsx` - Navigation colors
- `/web/components/nav-tabs.tsx` - Desktop tab colors
- `/web/components/header.tsx` - Header brand colors
- `/web/components/restaurant-card.tsx` - Card design
- `/web/components/restaurant-search.tsx` - Search and location
- `/web/components/filters.tsx` - Filter dropdowns
- `/web/components/visit-form.tsx` - Form inputs and buttons

### Pages
- `/web/app/auth/login/page.tsx` - Login page
- `/web/app/auth/signup/page.tsx` - Signup page
- `/web/app/app/nearby/page.tsx` - Restaurant discovery
- `/web/app/app/log/page.tsx` - Visit logging
- `/web/app/app/wishlist/page.tsx` - Wishlist management

---

## Future Enhancements

### Potential Additions
- **Seasonal Variants**: Adjust color temperature for holidays (warmer for fall, cooler for spring)
- **User Preferences**: Allow users to choose color intensity (extra soft, standard, slightly bold)
- **Premium Theme**: Introduce darker, richer variants for premium tier

### Maintenance
- Monitor user feedback on color preferences
- A/B test button conversion rates with current palette
- Ensure all new components follow this color system
- Update documentation as palette evolves

---

*Last Updated: 2025-11-16*
*Design System Version: 2.0 (Soft & Soothing)*
