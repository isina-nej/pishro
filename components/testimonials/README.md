# Premium Testimonials Component

A high-performance, GPU-accelerated infinite scrolling testimonials section with a luxury aesthetic.

## Features

✨ **Premium Animation**
- Infinite horizontal scroll with GPU-accelerated `translateX`
- Linear motion for constant, smooth speed
- Zero visible jumps or resets
- Seamless looping using duplicated cards

🎨 **Luxury Design**
- Dark premium gradient background
- Glassmorphism effect on cards
- Elegant star ratings
- Soft shadows and smooth transitions
- Responsive fade masks on edges

⚡ **Performance**
- CSS animations (no JavaScript re-renders)
- GPU-accelerated transforms
- Optimized for 60 FPS
- Minimal bundle size
- `will-change` optimization

🎯 **User Experience**
- Pause-on-hover behavior
- Fully responsive (mobile, tablet, desktop)
- Accessible star ratings
- Clean typography
- No layout shifts

## Component Structure

```
TestimonialsSection/
├── TestimonialsSection.tsx (Main component with sample data)
├── MarqueeTrack.tsx (Animation container)
├── TestimonialCard.tsx (Individual card)
└── index.ts (Exports)
```

## Usage

### Basic Usage

```tsx
import { TestimonialsSection } from "@/components/testimonials";

export default function Page() {
  return <TestimonialsSection />;
}
```

### With Custom Testimonials

```tsx
import { TestimonialsSection, type TestimonialData } from "@/components/testimonials";

const myTestimonials: TestimonialData[] = [
  {
    id: "1",
    name: "احمد علی",
    role: "سرمایه‌گذار",
    avatar: "https://images.unsplash.com/...",
    content: "بهترین تجربه برای یادگیری سرمایه‌گذاری!",
    rating: 5,
    company: "شرکت X",
  },
  // ...
];

export default function Page() {
  return (
    <TestimonialsSection 
      testimonials={myTestimonials}
      title="نظرات کاربران"
      subtitle="ببینید چه کسانی از ما رضایت دارند"
      speed={50}
    />
  );
}
```

### Props

**TestimonialsSection:**
- `title` (string): Section heading - default: "نظرات کاربران"
- `subtitle` (string): Section subheading - default: "ببینید چه کسانی از ما رضایت دارند"
- `testimonials` (TestimonialData[]): Array of testimonials - default: Sample data
- `speed` (number): Animation duration in seconds - default: 60

**TestimonialData Interface:**
```typescript
{
  id: string;           // Unique identifier
  name: string;         // User name
  role: string;         // User role/title
  avatar: string;       // Avatar image URL
  content: string;      // Testimonial text
  rating: number;       // Star rating (1-5)
  company?: string;     // Optional company name
}
```

## Customization

### Change Animation Speed

```tsx
<TestimonialsSection speed={40} /> {/* Faster */}
<TestimonialsSection speed={80} /> {/* Slower */}
```

### Disable Pause-on-Hover

Edit `MarqueeTrack.tsx`:
```tsx
<MarqueeTrack testimonials={testimonials} speed={speed} pauseOnHover={false} />
```

### Modify Card Width

In `TestimonialCard.tsx`:
```tsx
<div className="flex-shrink-0 w-96 px-4">
  {/* Change w-96 to w-80, w-[28rem], etc. */}
```

Also update the animation calculation in `MarqueeTrack.tsx`:
```tsx
transform: translateX(calc(-${testimonials.length * 384}px))
// Change 384 to match card width (in pixels)
```

### Customize Colors & Styling

Dark theme defaults:
- Background: `from-slate-950 via-slate-900 to-slate-950`
- Cards: `from-slate-800/50 to-slate-900/50`
- Text: `text-slate-100` (primary), `text-slate-300` (secondary)
- Accent: `amber-400`

Edit these in component files to match your brand.

## Performance Notes

- ✅ CSS animations run on GPU (no JS overhead)
- ✅ `will-change: transform` for optimization
- ✅ Images use Next.js Image component for optimization
- ✅ No re-renders during animation
- ✅ Minimal DOM nodes

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

## RTL (Persian/Arabic) Support

The component is already optimized for RTL layouts:
- Text direction is preserved
- Avatar positioning works correctly
- Responsive spacing is symmetric

## Future Enhancements

- [ ] Mobile touch swipe support
- [ ] Keyboard navigation
- [ ] Lazy loading for many testimonials
- [ ] Analytics integration
- [ ] Testimonial filtering by category
