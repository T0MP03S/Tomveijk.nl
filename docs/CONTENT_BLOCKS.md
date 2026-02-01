# Content Block System

## Overview

The content block system provides a flexible way to build portfolio items with different types of content in any order. Each portfolio item can contain multiple content blocks, and each block can be reordered via drag-and-drop in the admin interface.

## Available Block Types

### 1. **Photo** (`PHOTO`)
Display a single image with optional caption.
- **Fields**: Image URL, Caption (optional)
- **Use case**: Feature images, project screenshots

### 2. **Video** (`VIDEO`)
Embed or upload videos.
- **Fields**: Video URL (file or embed), Caption (optional)
- **Supports**: Direct video files, YouTube, Vimeo
- **Use case**: Project demos, animations

### 3. **Link** (`LINK`)
Create styled call-to-action links.
- **Fields**: Link text, URL
- **Use case**: External project links, live demos, GitHub repos

### 4. **Title** (`TITLE`)
Large, gradient-styled heading.
- **Fields**: Text
- **Use case**: Section headers, main titles

### 5. **Subtitle** (`SUBTITLE`)
Medium-sized heading.
- **Fields**: Text
- **Use case**: Subsection headers

### 6. **Text** (`TEXT`)
Multi-line text content.
- **Fields**: Text (supports line breaks)
- **Use case**: Project descriptions, explanations

### 7. **Website** (`WEBSITE`)
Embed a website or open in popup.
- **Fields**: URL, Display type (embed/popup)
- **Use case**: Live website previews, external content

### 8. **Gallery** (`GALLERY`)
Masonry-style photo gallery with lightbox.
- **Fields**: Multiple images with optional captions
- **Features**:
  - Responsive masonry layout
  - Click to open lightbox
  - Navigation between images
  - Proper image scaling
- **Use case**: Project galleries, multiple screenshots

### 9. **Slider** (`SLIDER`)
Auto-playing image carousel.
- **Fields**: Multiple images with optional captions
- **Features**:
  - Auto-play (configurable)
  - Navigation arrows
  - Dot indicators
  - Smooth transitions
- **Use case**: Before/after, step-by-step processes

## Database Schema

```prisma
model ContentBlock {
  id              String        @id @default(cuid())
  portfolioItemId String
  portfolioItem   PortfolioItem @relation(fields: [portfolioItemId], references: [id], onDelete: Cascade)
  type            String
  order           Int           @default(0)
  content         String        // JSON stringified content
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([portfolioItemId, order])
}
```

## API Endpoints

### Get Blocks
```
GET /api/admin/portfolio/[id]/blocks
```
Returns all content blocks for a portfolio item, ordered by `order` field.

### Create Block
```
POST /api/admin/portfolio/[id]/blocks
Body: { type, content, order }
```
Creates a new content block.

### Update Blocks
```
PUT /api/admin/portfolio/[id]/blocks
Body: { blocks: [{ id?, type, content, order }] }
```
Batch update or create multiple blocks with ordering.

### Delete Block
```
DELETE /api/admin/portfolio/[id]/blocks?blockId=[blockId]
```
Deletes a specific content block.

## Admin Interface

### Adding Blocks
1. Navigate to portfolio item edit/create page
2. Scroll to "Content Blokken" section
3. Click "Blok toevoegen"
4. Select block type from dropdown menu
5. Fill in block content
6. Repeat for additional blocks

### Reordering Blocks
- Use the grip icons (up/down arrows) to reorder blocks
- Changes are saved when you save the portfolio item

### Removing Blocks
- Click the trash icon on any block to remove it

## Frontend Rendering

Content blocks are automatically rendered on portfolio detail pages (`/portfolio/[slug]`) using the `ContentBlockRenderer` component.

### Component Structure
```tsx
<ContentBlockRenderer blocks={item.blocks} />
```

The renderer handles:
- Type-specific rendering for each block
- Responsive layouts
- Image optimization
- Video/iframe embeds
- Interactive components (galleries, sliders)

## Content Format

Each block's content is stored as JSON. Examples:

### Photo/Video
```json
{
  "url": "https://example.com/image.jpg",
  "caption": "Optional caption"
}
```

### Link
```json
{
  "text": "View Project",
  "url": "https://example.com"
}
```

### Title/Subtitle/Text
```json
{
  "text": "Content text"
}
```

### Website
```json
{
  "url": "https://example.com",
  "type": "embed" // or "popup"
}
```

### Gallery/Slider
```json
{
  "images": [
    { "url": "https://example.com/1.jpg", "caption": "Image 1" },
    { "url": "https://example.com/2.jpg", "caption": "Image 2" }
  ]
}
```

## Example Use Case

A typical portfolio item might have:
1. **Title** - "E-commerce Platform Redesign"
2. **Text** - Project overview and goals
3. **Photo** - Hero image
4. **Subtitle** - "Key Features"
5. **Gallery** - Multiple feature screenshots
6. **Subtitle** - "Live Demo"
7. **Website** (embed) - Live website preview
8. **Link** - "View on GitHub"

## Styling

All content blocks use the project's design system:
- Gradient colors: `from-[#A34BFF] to-[#30A8FF]`
- Dark theme with `border-white/10` borders
- Rounded corners (`rounded-2xl`)
- Responsive spacing and typography
- Lucide icons for UI elements

## Migration

The content block system was added via migration `20260131170512_add_content_blocks`.

To apply in a new environment:
```bash
npx prisma migrate deploy
```

## Future Enhancements

Potential additions:
- Code block with syntax highlighting
- Quote/testimonial block
- Stats/metrics block
- Timeline block
- Comparison (before/after) block
- Accordion/collapsible content
