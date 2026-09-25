# VEYRA Design System & Component Reference Guide
**Phase 1 Deliverable — Shared UI Foundations**

This guide documents the design tokens and foundational components established in Phase 1 for all subsequent implementation phases (Phase 2 to 6).

---

## 1. Master Design Tokens

The design tokens are declared in `src/index.css` via Tailwind v4's `@theme` directive and are available as utility classes (e.g. `bg-primary`, `text-secondary`, `font-serif-caslon`):

### Color System
| Role | Token Class | Hex Value | Semantic Usage |
|:---|:---|:---|:---|
| **Primary** | `bg-primary`, `text-primary` | `#002520` | Brand text, headers, primary buttons |
| **Primary Container**| `bg-primary-container` | `#173B35` | Hero panels, main action buttons, dark surfaces |
| **On Primary** | `text-on-primary` | `#FFFFFF` | Text on primary containers |
| **Primary Fixed** | `bg-primary-fixed` | `#C4EAE1` | Accent badges, subtle highlights |
| **Secondary** | `text-secondary` | `#7D5718` | Muted Warm Gold / Ochre accent, verified links |
| **Secondary Container** | `bg-secondary-container` | `#FFCC82` | Warm gold pill highlights, tags |
| **Secondary Fixed** | `bg-secondary-fixed` | `#FFDDB1` | Secondary action buttons, escrow highlights |
| **Surface** | `bg-surface` | `#F6FAF8` | Page body background (earthy sage-tinted off-white) |
| **Surface Container Lowest** | `bg-surface-container-lowest` | `#FFFFFF` | Elevated cards, modal dialogs, inputs |
| **Surface Container Low** | `bg-surface-container-low` | `#F0F5F2` | Subtle section backgrounds, table headers |
| **Surface Container** | `bg-surface-container` | `#EAEFED` | Dividers, chips, secondary icon buttons |
| **Surface Container High**| `bg-surface-container-high` | `#E5E9E7` | Card borders, subtle hover borders |
| **Outline** | `text-outline`, `border-outline` | `#717976` | Neutral icons, placeholder text, quiet borders |
| **Outline Variant** | `border-outline-variant` | `#C1C8C5` | Default card & input borders |
| **Error** | `bg-error`, `text-error` | `#BA1A1A` | Validation errors, destructive alerts |

### Typography
* **Editorial Headlines (`font-serif`, `font-serif-caslon`):** `Libre Caslon Text` (weights: 400, 600, 700). Applied automatically to `h1`, `h2`, `h3`, and product titles.
* **Interface & Body (`font-sans`):** `Work Sans` (weights: 300, 400, 500, 600, 700). Default font for all paragraphs, inputs, labels, and data tables.
* **Icons:** `Material Symbols Outlined` (rendered using `<span className="material-symbols-outlined">icon_name</span>`).

---

## 2. Foundational Components (`src/components/common/`)

All components can be imported together:
```jsx
import { BrandLogo, Button, Input, Select, StatusBadge, Card } from "../components/common";
```

### 2.1 BrandLogo
Official vector Veyra monogram and wordmark.
```jsx
// Full logo (Monogram + VEYRA + INDEPENDENT MARKETPLACE)
<BrandLogo variant="full" size="md" />

// Monogram only (for mobile headers or collapsed sidebars)
<BrandLogo variant="monogram" size="sm" />

// Compact (Monogram + VEYRA without subtext)
<BrandLogo variant="compact" size="md" />

// Light theme (for dark footers or forest green sidebars)
<BrandLogo variant="full" theme="light" />
```

### 2.2 Button
Universal accessible action button supporting links, states, and icons.
```jsx
// Primary Action
<Button variant="primary" iconTrailing="arrow_forward">
  Shop Collection
</Button>

// Secondary / Accent Action
<Button variant="secondary" iconLeading="storefront">
  Explore Stores
</Button>

// Outline
<Button variant="outline" size="sm">
  Filter Options
</Button>

// Loading & Disabled States
<Button variant="primary" loading={isSubmitting}>
  Placing Order...
</Button>

// Router Link Polymorphic Support
<Button as={Link} to="/products" variant="primary">
  Browse All Products
</Button>
```

### 2.3 Input
Form input with built-in label, helper text, error state, and icon support.
```jsx
<Input
  label="Workshop Address"
  required
  placeholder="Enter studio street address"
  iconLeading="location_on"
  error={errors.address}
  helperText="Street address where your atelier crafts are dispatched from"
  value={form.address}
  onChange={(e) => setForm({ ...form, address: e.target.value })}
/>
```

### 2.4 Select
Styled dropdown with custom chevron indicator and accessible validation.
```jsx
<Select
  label="Craft Department"
  required
  options={[
    { value: "handloom", label: "Handloom & Textiles" },
    { value: "brass", label: "Brass & Metalware" },
    { value: "ceramics", label: "Handmade Ceramics" },
  ]}
  value={department}
  onChange={(e) => setDepartment(e.target.value)}
/>
```

### 2.5 StatusBadge
Consistent color-coded status pills for orders, merchant compliance, and inventory.
```jsx
<StatusBadge status="verified" dot>480 Verified</StatusBadge>
<StatusBadge status="pending">Under GI Review</StatusBadge>
<StatusBadge status="escrow" icon="lock_clock">₹14.2L In Escrow</StatusBadge>
<StatusBadge status="out-of-stock">Out of Stock</StatusBadge>
<StatusBadge status="delivered">Delivered</StatusBadge>
```

### 2.6 Card
Standardized surface container with border tokens, header/footer slots, and hover effects.
```jsx
<Card elevation="lowest" hoverable header={<h4 className="font-semibold">Atelier Details</h4>}>
  <p className="text-sm text-on-surface-variant">Content inside card...</p>
</Card>
```

---

## 3. Backward Compatibility Preservation

Existing legacy utility classes in `src/index.css` have been upgraded to the Veyra color system:
* `.btn-primary` now maps to `bg-primary-container` with subtle elevation.
* `.btn-outline` now maps to Veyra borders with focus rings.
* `.input` now maps to Veyra outline and surface tokens.
* `.card` now maps to `bg-surface-container-lowest` with subtle borders.

All existing pages (Home, Products, ProductDetail, Cart, Checkout, Login, Register, Vendor Dashboard, Admin Dashboard) remain **100% operational** with zero API or state regressions.
