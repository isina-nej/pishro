## Context

The Pishro application needs to showcase user comments and testimonials on the landing/home page to build social proof. Currently, there's no dedicated slider component for this purpose. The application already has:
- A `comment-service.ts` in `lib/services/` for comment operations
- Tailwind CSS for styling and responsive design
- A home page component structure in `components/home/`
- Existing Swiper integration potential (common in modern Next.js projects)

## Goals / Non-Goals

**Goals:**
- Create a reusable, responsive slider component for displaying comments
- Implement smooth autoplay (4-second interval) with manual controls
- Support responsive layouts (1 card on mobile, 2 on tablet, 3 on desktop)
- Ensure the component integrates seamlessly with the landing page
- Component must persist through database seed operations

**Non-Goals:**
- Custom animation framework (use Swiper's built-in capabilities)
- Adding new comment data or modifying comment-service logic
- Changing the landing page layout significantly

## Decisions

### 1. Use Swiper Library for Slider Implementation
**Decision**: Use Swiper.js with React integration (`swiper/react`)

**Rationale**: Swiper provides:
- Battle-tested carousel functionality with excellent browser support
- Built-in autoplay, loop, responsive breakpoints, and navigation
- Smooth animations (horizontal slide) without custom implementation
- Rich configuration options for all requested features

**Alternatives considered**:
- Custom Framer Motion implementation: More control but requires manual timer management, swipe detection, and state handling - higher complexity for lower benefit
- HTML/CSS-only slider: Lacks autoplay and smooth animations out-of-the-box

### 2. Server-Side Data Fetching with React Server Components
**Decision**: Use async React Server Component or getStaticProps equivalent to fetch comments

**Rationale**: 
- Reduces client-side overhead
- Ensures comments are fetched once at build/request time
- Improves Core Web Vitals (LCP)

**Alternative**: Client-side useEffect - would work but increases initial load time and complexity

### 3. Component Structure
**Decision**: Create `components/home/CommentsSlider.tsx` as a self-contained, reusable component

**Rationale**:
- Maintains organization consistency with existing home components
- Can be reused on multiple pages if needed
- Cleaner separation of concerns

### 4. Responsive Configuration
**Decision**: Implement Swiper breakpoints configuration:
- Mobile (< 640px): 1 slide per view
- Tablet (640px - 1024px): 2 slides per view
- Desktop (> 1024px): 3 slides per view

**Rationale**: Standard responsive pattern; aligns with common Tailwind breakpoints

### 5. Styling Approach
**Decision**: Use Tailwind CSS for component styling and container layout

**Rationale**: Consistent with project standards; Swiper CSS can be overridden with Tailwind utilities

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Swiper library adds bundle size (~20-30KB gzipped) | Worth the trade-off for reliable carousel functionality; better than custom implementation |
| Comments data stale if not refreshed on seed | Seed script should preserve or re-insert comment data; ensure comments table is populated in seed |
| Performance impact with many comments | Limit visible slides to 50-100 most recent comments; Swiper handles DOM efficiently |
| Browser compatibility with autoplay | Swiper handles vendor prefixes; test on target browsers |

## Migration Plan

1. Install Swiper dependency: `npm install swiper`
2. Create `components/home/CommentsSlider.tsx` component
3. Add component to landing/home page
4. Test responsive behavior on different viewport sizes
5. Verify comments persist through seed operations (update seed script if needed)

## Open Questions

- Should comments be filtered by status (approved/active)?
- Should there be a fallback UI if no comments are available?
- Should the slider be pausable on hover (Swiper's pause-on-hover feature)?
- Should we implement server-side rendering or static generation for performance?
