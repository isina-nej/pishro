## Why

Displaying comments and testimonials on the landing/home page is a key way to build trust with users. A smooth, auto-playing slider component makes the presentation engaging and professional, encouraging users to explore feedback from other customers without manual interaction.

## What Changes

- Add a new reusable comments slider component using Swiper
- Integrate the component into the landing page
- Implement responsive design (1 card on mobile, 2 on tablet, 3 on desktop)
- Enable autoplay with 4-second intervals, infinite loop, and manual navigation controls
- Ensure the component persists through database seed operations

## Capabilities

### New Capabilities
- `comments-slider`: A responsive Swiper-based slider component for displaying user comments/testimonials with autoplay, pagination, and navigation controls

### Modified Capabilities
<!-- No existing capabilities are being modified for this feature -->

## Impact

- **Code**: New component in `components/` directory, likely `components/home/CommentsSlider.tsx`
- **Dependencies**: Swiper library and React integration
- **Pages**: Landing/home page will include the new slider
- **Data**: Will fetch comments from the database using existing comment-service
- **Styling**: Tailwind CSS for responsive styling and theming
