# Car Rental Application - Implementation Documentation

## Overview

This document describes the implementation of the Car Rental home page with advanced search and filtering capabilities using Next.js App Router, TypeScript, and Tailwind CSS v4.

## Architecture

### Tech Stack

- **Framework**: Next.js 16.2.6 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **State Management**: URL Query Parameters (via Next.js `useSearchParams`, `useRouter`, `usePathname`)
- **Theming**: next-themes (Light/Dark mode support)

### Key Principles

1. **URL-Driven State**: All search queries and filters are managed via URL search parameters, ensuring:
   - Shareable URLs
   - Browser back/forward compatibility
   - Bookmarkable search states
   - No client-side state duplication

2. **Server-Side Data Fetching**: The main page component fetches car data from the RapidAPI "Cars by API Ninjas" endpoint

3. **Dark Mode Support**: Full Tailwind v4 semantic dark mode with class-based approach

4. **Clean UI/UX**:
   - No aggressive hover animations that cause layout shifts
   - Smooth transitions with stable layouts
   - Loading skeletons during data fetching
   - Empty state feedback

---

## Components

### 1. **SearchBar.tsx** (`components/SearchBar.tsx`)

A client-side component for searching cars by manufacturer and model.

#### Features

- Dual input fields for "Manufacturer" and "Model"
- Embedded magnifying glass icons
- Clear button to reset search
- Updates URL query parameters (`?manufacturer=toyota&model=camry`)
- Preserves existing filter parameters (fuel, year, etc.)

#### Props

```typescript
interface SearchBarProps {
  onSearch?: () => void;
}
```

#### Usage

```tsx
<SearchBar onSearch={() => console.log("Search initiated")} />
```

#### Key Implementation Details

- Uses `useRouter` and `useSearchParams` from next/navigation
- Form submission updates URL with cleaned lowercase parameters
- Client component ("use client")
- Stable UI layout without hover shifts

---

### 2. **CustomFilter.tsx** (`components/CustomFilter.tsx`)

A reusable, generic filter dropdown component that works with any list of options.

#### Features

- Dropdown-based filtering
- Dynamic label showing current selection
- Clear filter option to reset
- Click-outside detection to close dropdown
- URL parameter management (preserves other params)
- Accepts dynamic filter options

#### Props

```typescript
interface FilterOption {
  title: string;
  value: string;
}

interface CustomFilterProps {
  title: string;
  options: FilterOption[];
  paramKey: string;
}
```

#### Usage

```tsx
<CustomFilter title="Fuel Type" options={FUEL_OPTIONS} paramKey="fuel" />
```

#### Key Implementation Details

- Reads selected value directly from `searchParams` (no redundant state)
- Handles dropdown state locally
- Updates URL on selection
- Supports clearing filters with visual feedback
- Client component ("use client")

---

### 3. **page.tsx** (`app/page.tsx`)

The main server component that renders the home page with all layouts, search, filters, and car grid.

#### Features

- **Navbar & Hero**: Preserved from original design
- **Search Section**: Includes SearchBar and CustomFilter dropdowns
- **Car Grid**: Dynamic grid displaying fetched cars
- **Loading State**: Skeleton loaders during data fetch
- **Empty State**: Helpful message when no cars match filters
- **Why Choose Us**: Feature section at the bottom

#### Props

```typescript
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
```

#### Data Fetching

```typescript
async function fetchCars(
  params: Record<string, string | string[] | undefined>,
): Promise<CarData[]>;
```

The `fetchCars` function:

- Constructs RapidAPI request with dynamic filters
- Handles manufacturer, model, fuel_type, and year parameters
- Returns up to 12 results
- Handles errors gracefully

#### Filter Options

**Fuel Types:**

- Gasoline
- Diesel
- Hybrid
- Electric
- Natural Gas
- LPG

**Years:**

- Dynamically generates last 30 years

#### Car Card Component

Displays individual car information with:

- Make and model
- Year
- Price per day (calculated from model)
- Car image
- Specifications (fuel, transmission, drive type)
- Favorite button
- Rent Now CTA

#### Layout Structure

```
Main Page
├── Navbar
├── Hero Section
└── Car Catalogue
    ├── Search Bar
    ├── Filters Row
    │   ├── Fuel Type Filter
    │   └── Year Filter
    └── Car Grid (with Suspense boundary)
        ├── Car Cards (if data found)
        └── Empty State (if no results)
└── Why Choose Us Section
```

---

## URL Query Parameters

All active filters are reflected in the URL for bookmarking and sharing:

```
/?manufacturer=toyota&model=camry&fuel=Gasoline&year=2023
```

### Supported Parameters

- `manufacturer`: Vehicle manufacturer name (e.g., "toyota")
- `model`: Vehicle model name (e.g., "camry")
- `fuel`: Fuel type (e.g., "Gasoline", "Diesel")
- `year`: Vehicle year (e.g., "2023")

---

## Styling Approach

### Tailwind CSS v4 Updates

The implementation uses modern Tailwind v4 semantics:

- `shrink-0` instead of `flex-shrink-0`
- `min-h-125` instead of `min-h-[500px]`
- Dark mode with `dark:` prefix (class-based)
- Semantic color variables from `globals.css`

### Dark Mode Support

```css
/* Light Mode */
.text-black dark:text-white

/* Color Variables */
--color-primary-blue: #2b59ff (light), #ff4d4d (dark)
--color-black-100: #2b2c35 (light), #f5f5f5 (dark)
```

### No Layout Shifts

- Cards use `transition-all` with `duration-300` for smooth changes
- Hover states don't change width/height (only border/colors)
- Button click uses `active:scale-95` for feedback without layout shift

---

## Environment Setup

### Required Environment Variables

```env
RAPIDAPI_KEY=your_api_key_here
```

Get your API key from [RapidAPI](https://rapidapi.com/api-ninjas/api/cars).

### Dependencies

Already included in `package.json`:

```json
{
  "next": "16.2.6",
  "react": "19.2.4",
  "tailwindcss": "^4",
  "next-themes": "^0.4.6"
}
```

---

## Usage Examples

### Basic Search

User enters "Toyota" and "Camry", clicks Search → URL becomes `/?manufacturer=toyota&model=camry`

### Filter by Fuel Type

User selects "Diesel" from fuel filter → URL becomes `/?fuel=Diesel`

### Combined Filters

User searches for "Honda Civic" AND filters by "2022" → URL becomes:

```
/?manufacturer=honda&model=civic&year=2022
```

### Clear Filters

User clicks "Clear" in fuel filter → `fuel` parameter is removed from URL

---

## Component Hierarchy

```
<Root Layout>
  <Providers (Theme)>
    <Page (Server)>
      <Navbar (Client)>
      <Hero (Server)>
      <Section: Car Catalogue>
        <SearchBar (Client)>
        <CustomFilter (Client)> x2
        <Suspense>
          <CarGrid (Server)>
            <CarCard (Server)> x N
        </Suspense>
      </Section>
      <Section: Why Choose Us>
```

---

## Performance Considerations

1. **Server-Side Data Fetching**: Moved from client to server for:
   - Reduced JavaScript bundle
   - Direct API access without exposing credentials
   - Better SEO

2. **Suspense Boundaries**: Loading states shown while fetching data
   - 8 skeleton cards during load
   - Smooth transition to real data

3. **URL-Driven State**: No Redux/Context needed, leveraging Next.js navigation

4. **Image Optimization**: Using Next.js Image component for automatic optimization

---

## Error Handling

- **API Errors**: Logged to console, returns empty array
- **No Results**: Shows empty state with helpful message
- **Network Issues**: Graceful fallback to empty state

---

## Future Enhancements

1. Add pagination/infinite scroll for large result sets
2. Implement car detail modal/page
3. Add booking flow integration
4. User profile and saved cars feature
5. Advanced filters (price range, mileage, etc.)
6. Map view of available cars
7. Customer reviews and ratings

---

## Testing

### Manual Testing Checklist

- [ ] Search by manufacturer
- [ ] Search by model
- [ ] Filter by fuel type
- [ ] Filter by year
- [ ] Combine multiple filters
- [ ] Clear individual filters
- [ ] Clear all filters
- [ ] Dark mode toggle
- [ ] Mobile responsiveness
- [ ] URL sharing (paste URL in new tab)
- [ ] Browser back/forward buttons
- [ ] Empty state display

---

## File Structure

```
app/
├── page.tsx (Main home page)
├── layout.tsx
├── provider.tsx
└── globals.css

components/
├── index.ts
├── Navbar.tsx
├── Hero.tsx
├── SearchBar.tsx
├── CustomFilter.tsx
└── Footer.tsx
```

---

## Notes

- The `SearchBar` and `CustomFilter` components are designed to be reusable across the application
- All filter logic uses URL parameters to maintain a single source of truth
- The page automatically re-renders when query parameters change
- No external UI library is used; all styling is pure Tailwind CSS v4
