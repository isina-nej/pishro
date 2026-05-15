## ADDED Requirements

### Requirement: Component SHALL render comments in a Swiper slider
The CommentsSlider component SHALL display user comments/testimonials in a horizontal slider powered by Swiper.js with smooth slide animations.

#### Scenario: Component renders with comments
- **WHEN** the CommentsSlider component is mounted with comment data available
- **THEN** it SHALL display the first comment in the slider with Swiper initialized

#### Scenario: Next slide transitions smoothly
- **WHEN** the user navigates to the next slide (via next button or programmatic navigation)
- **THEN** the slide SHALL transition with a smooth horizontal slide animation

### Requirement: Component SHALL implement autoplay with 4-second intervals
The component SHALL automatically advance to the next slide every 4 seconds (4000ms delay) without user interaction.

#### Scenario: Autoplay advances slides
- **WHEN** the component is rendered and autoplay is enabled
- **THEN** after 4 seconds, the slider SHALL automatically transition to the next slide

#### Scenario: Autoplay continues infinitely
- **WHEN** the slider reaches the last slide with autoplay enabled
- **THEN** it SHALL loop back to the first slide and continue autoplay

### Requirement: Component SHALL support infinite loop
The component SHALL enable loop mode so slides repeat continuously without stopping at the end.

#### Scenario: Loop wraps to first slide
- **WHEN** the user manually navigates to the next slide on the last slide
- **THEN** the slider SHALL transition back to the first slide seamlessly

#### Scenario: Autoplay wraps to first slide
- **WHEN** autoplay reaches the last slide
- **THEN** the slider SHALL loop back to the first slide automatically

### Requirement: Component SHALL provide navigation controls
The component SHALL display previous/next buttons (arrows) that allow users to manually navigate between slides.

#### Scenario: User clicks next button
- **WHEN** the user clicks the next navigation button
- **THEN** the slider SHALL advance to the next slide

#### Scenario: User clicks previous button
- **WHEN** the user clicks the previous navigation button
- **THEN** the slider SHALL go back to the previous slide

### Requirement: Component SHALL provide pagination indicators
The component SHALL display pagination dots/indicators at the bottom showing the current slide position and allowing direct navigation to any slide.

#### Scenario: Pagination dots are visible
- **WHEN** the component is rendered
- **THEN** pagination dots SHALL be displayed at the bottom indicating total slides and current position

#### Scenario: User clicks pagination dot
- **WHEN** the user clicks a pagination dot
- **THEN** the slider SHALL jump to the corresponding slide

### Requirement: Component SHALL be responsive with breakpoint-based slide counts
The component SHALL adapt the number of visible slides based on screen size:
- Mobile (< 640px): 1 slide
- Tablet (640px - 1024px): 2 slides  
- Desktop (> 1024px): 3 slides

#### Scenario: Mobile viewport shows 1 slide
- **WHEN** the component is viewed on a mobile device (< 640px width)
- **THEN** only 1 comment card SHALL be visible at a time

#### Scenario: Tablet viewport shows 2 slides
- **WHEN** the component is viewed on a tablet device (640px - 1024px width)
- **THEN** 2 comment cards SHALL be visible at a time

#### Scenario: Desktop viewport shows 3 slides
- **WHEN** the component is viewed on a desktop device (> 1024px width)
- **THEN** 3 comment cards SHALL be visible at a time

### Requirement: Component SHALL fetch comments from the database
The component SHALL fetch active/approved comments from the database using the existing comment-service.

#### Scenario: Comments are loaded on mount
- **WHEN** the component mounts
- **THEN** it SHALL fetch comments from the database via comment-service and display them in the slider

#### Scenario: Fallback display when no comments available
- **WHEN** no comments are available in the database
- **THEN** the component SHALL display a graceful fallback message

### Requirement: Component data SHALL persist through seed operations
The comments displayed by the slider SHALL not be deleted or lost during database seed operations.

#### Scenario: Comments remain after seed
- **WHEN** the database seed script runs
- **THEN** comments currently in the slider SHALL either be preserved or recreated by the seed script

#### Scenario: Slider functions after seed
- **WHEN** the seed script completes
- **THEN** the slider SHALL continue to function and display comments correctly

### Requirement: Component styling SHALL use Tailwind CSS
The component SHALL be styled using Tailwind CSS utilities for responsive design, spacing, colors, and theming consistency.

#### Scenario: Component respects theme
- **WHEN** the application theme changes (light/dark mode)
- **THEN** the component styling SHALL adapt to the current theme using Tailwind utilities

#### Scenario: Component is properly spaced
- **WHEN** the component is rendered on the page
- **THEN** it SHALL have appropriate margins and padding using Tailwind utilities
