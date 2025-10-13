# PublicationItem Component

A React component for displaying publications with thumbnail images inline with markdown content.

## Features

- **Thumbnail Display**: Shows book covers or publication images on the left side
- **Flexible Layout**: Title, authors, and publication details flow to the right of the thumbnail
- **Link Support**: Optionally wraps entire entry in a link to the full publication
- **Responsive Design**: Works well in narrow layouts with mobile support
- **Hover Effects**: Subtle background color change on hover for linked items
- **MDX Compatible**: Can be used directly in markdown files with proper configuration

## Usage in MDX

The component is automatically available in all MDX files. Here's how to use it:

### Basic Usage (Required Props Only)

```jsx
<PublicationItem
  thumbnail="book-understanding.gif"
  alt="Understanding Risk book cover"
  title="Understanding Risk: Informing Decisions in a Democratic Society"
/>
```

### With All Optional Props

```jsx
<PublicationItem
  thumbnail="book-understanding.gif"
  alt="Understanding Risk book cover"
  title="Understanding Risk: Informing Decisions in a Democratic Society"
  authors="Paul C. Stern and Harvey V. Fineberg (Eds.)"
  details="National Academy Press, 1996"
  href="/publications/understanding-risk"
/>
```

### With External Link

```jsx
<PublicationItem
  thumbnail="book-judgement.gif"
  alt="Science and Judgment book cover"
  title="Science and Judgment in Risk Assessment"
  authors="National Research Council"
  details="National Academy Press, 1994"
  href="https://nap.nationalacademies.org/catalog/2125"
/>
```

### Custom Dimensions

```jsx
<PublicationItem
  thumbnail="book-disposition.jpg"
  alt="Disposition book cover"
  title="Disposition of High-Level Waste and Spent Nuclear Fuel"
  authors="National Research Council"
  details="National Academy Press, 2001"
  width={150}
  height={200}
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `thumbnail` | `string` | Yes | - | Filename of the thumbnail image (automatically prefixed with `/images/pubs/`) |
| `alt` | `string` | Yes | - | Alternative text for the image (accessibility) |
| `title` | `string` | Yes | - | Publication title |
| `authors` | `string` | No | - | Authors or editors of the publication |
| `details` | `string` | No | - | Publication details (publisher, year, etc.) |
| `href` | `string` | No | - | Link to full publication (internal or external) |
| `width` | `number` | No | `120` | Thumbnail width in pixels |
| `height` | `number` | No | `160` | Thumbnail height in pixels |

## Thumbnail Image Path Handling

The component automatically handles thumbnail paths in multiple formats:

- `"book-understanding.gif"` → `/images/pubs/book-understanding.gif`
- `"images/pubs/book-understanding.gif"` → `/images/pubs/book-understanding.gif`
- `"/images/pubs/book-understanding.gif"` → `/images/pubs/book-understanding.gif`

## Available Thumbnails

Located in `public/images/pubs/`:

- `book-communication.gif` - Improving Risk Communication
- `book-disposition.jpg` - Disposition of High-Level Waste
- `book-government.gif` - Risk Assessment in the Federal Government
- `book-human.jpg` - Human-System Risk Management
- `book-judgement.gif` - Science and Judgment in Risk Assessment
- `book-understanding.gif` - Understanding Risk
- `public-participation-image.gif` - Public Participation in Environmental Assessment

## Styling

The component uses Tailwind CSS classes and includes:

- Light gray background (`bg-gray-50`)
- Hover effect for linked items (`hover:bg-gray-100`)
- Rounded corners (`rounded-lg`)
- Shadow on thumbnails (`shadow-sm`)
- Responsive gap between thumbnail and text (`gap-4`)
- Not prose class to prevent markdown styling conflicts (`not-prose`)

## External vs Internal Links

The component automatically detects external URLs (starting with `http`) and:

- Opens them in a new tab (`target="_blank"`)
- Adds security attributes (`rel="noopener noreferrer"`)

Internal links open in the same window for better navigation flow.

## Example: Publications List

Here's how you might use multiple PublicationItem components to create a publications list:

```jsx
## National Research Council Reports

<PublicationItem
  thumbnail="book-understanding.gif"
  alt="Understanding Risk book cover"
  title="Understanding Risk: Informing Decisions in a Democratic Society"
  authors="Paul C. Stern and Harvey V. Fineberg (Eds.)"
  details="National Academy Press, 1996"
  href="https://nap.nationalacademies.org/catalog/5138"
/>

<PublicationItem
  thumbnail="book-judgement.gif"
  alt="Science and Judgment book cover"
  title="Science and Judgment in Risk Assessment"
  authors="National Research Council"
  details="National Academy Press, 1994"
  href="https://nap.nationalacademies.org/catalog/2125"
/>

<PublicationItem
  thumbnail="book-communication.gif"
  alt="Improving Risk Communication book cover"
  title="Improving Risk Communication"
  authors="National Research Council"
  details="National Academy Press, 1989"
  href="https://nap.nationalacademies.org/catalog/1189"
/>
```

## Accessibility

The component follows accessibility best practices:

- Requires `alt` text for all images
- Semantic HTML structure with proper heading levels
- Keyboard navigable when used with links
- Sufficient color contrast for text
- Screen reader friendly markup

## Testing

The component includes comprehensive tests covering:

- Required and optional props rendering
- Link behavior (internal vs external)
- Image path handling
- Default values
- Styling classes
- TypeScript type safety

All 12 tests pass successfully.
