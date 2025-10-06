# Northworks Website

A modern Next.js 15 website showcasing the work of Cheryl North (classical music journalist) and D. Warner North (risk analysis expert).

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 📚 **For AI Assistants & Developers**

### 🎯 **START HERE:**
1. **[CODEBASE_MAP.md](./CODEBASE_MAP.md)** - Complete codebase structure and navigation guide
2. **[AI_ASSISTANT_GUIDE.md](./AI_ASSISTANT_GUIDE.md)** - Critical rules, patterns, and debugging workflows

**These guides will help you**:
- Understand the codebase architecture quickly
- Avoid common pitfalls and bugs
- Maintain consistency across changes
- Find the right files for any task
- Preserve context during long conversations

## 🏗️ Architecture

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Content**: Markdown with Gray Matter frontmatter
- **Testing**: Vitest + Testing Library
- **Deployment**: Vercel

## 📁 Key Directories

```
northworks/
├── src/
│   ├── app/              # Next.js pages (App Router)
│   ├── components/       # React components
│   ├── lib/              # Utility functions
│   ├── types/            # TypeScript type definitions
│   └── schemas/          # Data schemas
├── public/
│   ├── content/          # Markdown content files
│   ├── data/             # JSON data
│   └── images/           # Image assets
└── docs/                 # Documentation
```

## 🎨 Design Principles

1. **Unified Components** - One component handles all content types
2. **Type Safety** - Centralized types in `@/types`
3. **Content-First** - Markdown content with rich frontmatter
4. **Performance** - Optimized images, static generation
5. **Accessibility** - Semantic HTML, ARIA labels

## 🧪 Testing

```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage report
```

**Test Coverage**: 308 tests, 100% passing ✅

## 📦 Key Features

- **Dual Collections**: Separate content for Cheryl North (music) and D. Warner North (risk analysis)
- **Unified Content Model**: All content types (interviews, articles, reviews, etc.) use same structure
- **Advanced Search**: Full-text search across all content with filters
- **Responsive Images**: Optimized image loading with Next.js Image
- **Static Generation**: Pre-rendered pages for fast performance
- **Type Safety**: Full TypeScript coverage

## 🛠️ Scripts

```bash
# Development
npm run dev              # Start dev server (port 3000)
npm run lint            # Lint code

# Production
npm run build           # Build for production
npm start              # Start production server

# Testing
npm test                # Run tests
npm run test:coverage   # Test with coverage

# Image Management
npm run images:verify   # Verify image references
npm run images:analyze  # Analyze image usage
```

## 📖 Documentation

- **[CODEBASE_MAP.md](./CODEBASE_MAP.md)** - Complete codebase navigation
- **[AI_ASSISTANT_GUIDE.md](./AI_ASSISTANT_GUIDE.md)** - AI assistant guidelines
- **[docs/TYPE_SYSTEM_ANALYSIS.md](./docs/TYPE_SYSTEM_ANALYSIS.md)** - Type architecture analysis
- **[docs/CODEBASE_CLEANUP_REPORT.md](./docs/CODEBASE_CLEANUP_REPORT.md)** - Recent cleanup summary
- **[FIELD_NORMALIZATION.md](./FIELD_NORMALIZATION.md)** - Content field standards

## 🎯 Common Tasks

### Add a New Page
1. Create file in `/src/app/[route]/page.tsx`
2. Import data from `@/lib/unified-data`
3. Use `UnifiedLayout` for consistent layout
4. See existing pages for examples

### Add a New Component
1. Create in appropriate subfolder under `/src/components`
2. Add TypeScript props interface
3. Add test file in `__tests__/` subfolder
4. Use existing components as reference

### Load Content
```typescript
import { getContentBySlug } from '@/lib/content';
const content = getContentBySlug('article-slug', true);
```

### Display Content List
```typescript
import { getContentByType } from '@/lib/unified-data';
import UnifiedList from '@/components/ui/UnifiedList';

const articles = getContentByType('article');
<UnifiedList items={articles} />
```

## 🚨 Important Notes

### For AI Assistants
- **ALWAYS** read `AI_ASSISTANT_GUIDE.md` before making changes
- **NEVER** import types from individual files (use `@/types`)
- **ALWAYS** use `OptimizedImage` component (not raw `<img>`)
- **ALWAYS** run tests after changes (`npm test`)

### For Developers
- Follow TypeScript strict mode
- Use Tailwind for styling (no custom CSS files)
- Write tests for new features
- Keep components small and focused
- Document complex logic

## 📊 Project Stats

- **Total Files**: ~432 files
- **Components**: 29 React components
- **Utilities**: 15 library modules
- **Content**: ~200 markdown files
- **Tests**: 308 tests (100% passing)
- **Bundle Size**: Optimized

## 🔗 Collections

### Cheryl North (Music)
- Classical music journalism
- Interviews with performers
- Concert and opera reviews
- Music articles and analysis
- **Prefix**: `c-` (e.g., `c-interview-pianist.md`)

### D. Warner North (Risk Analysis)
- Professional work and projects
- Academic publications
- Background and education
- Risk analysis expertise
- **Prefix**: `w-` (e.g., `w-professional-nrc.md`)

## 🌐 Deployment

Deployed on Vercel with automatic deployments from `main` branch.

```bash
# Deploy to production
npm run deploy:prod

# Deploy to preview
npm run deploy:dev
```

## 📝 Content Management

Content is stored as Markdown files in `/public/content/` with YAML frontmatter:

```markdown
---
id: unique-id
title: Article Title
type: article
category: articles
tags: [tag1, tag2]
publishedDate: 2025-01-15
---

Content goes here...
```

## 🤝 Contributing

1. Read `CODEBASE_MAP.md` and `AI_ASSISTANT_GUIDE.md`
2. Create a feature branch
3. Make your changes
4. Run tests (`npm test`)
5. Build locally (`npm run build`)
6. Submit pull request

## 📄 License

Private project - All rights reserved

## 👥 Authors

- **Cheryl North** - Classical Music Journalism
- **D. Warner North** - Risk Analysis & Professional Work
- **Development Team** - Website Development

---

**Last Updated**: October 6, 2025  
**Version**: 2.0.0  
**Next.js**: 15.4.6  
**React**: 19.1.0
