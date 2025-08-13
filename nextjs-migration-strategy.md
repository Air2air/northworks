# Next.js Migration Strategy for Legacy Northworks Content

## Current Challenge Analysis

The legacy content files contain complex HTML table layouts with multiple embedded schema fields that need to be preserved while converting to modern Next.js components.

### Identified Structure Patterns

1. **Main Content Layout**: `<tr class="table_main"><td class="td_center">` wrapper
2. **Sidebar Content**: `<td class="td_right">` with related images and info
3. **Navigation Elements**: Button images and breadcrumbs
4. **Gallery Components**: Thumbnail grids with links
5. **Publication Metadata**: Embedded in content flow
6. **Image Associations**: Multiple images with captions and dimensions

## Proposed Migration Strategy

### Phase 1: Content Separation & Schema Extraction

#### 1.1 Create Enhanced Parser
```python
class NextJSContentMigrator:
    def extract_layout_sections(self, content):
        return {
            "frontmatter": self.extract_yaml_frontmatter(),
            "hero_content": self.extract_main_content(),
            "sidebar_content": self.extract_sidebar(),
            "navigation": self.extract_navigation_elements(),
            "gallery": self.extract_image_gallery(),
            "metadata": self.extract_publication_info()
        }
```

#### 1.2 YAML Frontmatter Conversion
Transform each file to have structured frontmatter:

```yaml
---
# Core Metadata
id: "c_romero"
type: "interview"
category: "classical-music"
title: "Celino Romero Interview"
subtitle: "Third generation of Romero guitar comes to Bay Area"

# Publication Info
publication:
  date: "2002-07-26"
  publisher: "San Mateo County Times"
  author: "Cheryl North"

# Subject Classification
subject:
  people:
    - name: "Celino Romero"
      role: "classical guitarist"
      instrument: "guitar"
  organizations:
    - "San Francisco Symphony"
    - "Los Romeros Guitar Quartet"
  venues:
    - "Davies Symphony Hall"

# Layout Components
layout:
  hasHero: true
  hasSidebar: true
  hasGallery: true
  
# Media Assets
hero_image:
  src: "images/title_gray_romeros.gif"
  width: 220
  height: 28
  alt: "Romeros Family Title"

sidebar_images:
  - src: "images/celedonio_romero.jpg"
    width: 220
    height: 224
    caption: "Celedonio Romero"
    type: "portrait"
  - src: "images/romeros.jpg" 
    width: 220
    height: 260
    caption: "(Back) Celin Romero, Pepe Romero. (Front) Celino Romero, Lito Romero."
    type: "group"

# Navigation Context
breadcrumbs:
  - label: "Home"
    href: "/"
  - label: "Interviews"
    href: "/interviews"
  - label: "Celino Romero"
    href: "/interviews/c_romero"

# Related Content
related:
  - "c_guitar_family"
  - "c_classical_guitar_tradition"
  - "c_spanish_music"

# SEO
seo:
  title: "Celino Romero Interview - Third Generation Guitar Master"
  description: "Interview with classical guitarist Celino Romero about the Royal Family of Guitar and their musical legacy"
  keywords: ["classical guitar", "Romero family", "Spanish music", "San Francisco Symphony"]
---

# Main Content Here (Clean Markdown)

LEGENDARY Spanish guitar master Celedonio Romero certainly knew a great deal about the guitar...
```

### Phase 2: Next.js Component Architecture

#### 2.1 Layout Components
```typescript
// components/layouts/ContentLayout.tsx
interface ContentLayoutProps {
  frontmatter: ContentFrontmatter;
  children: React.ReactNode;
}

export default function ContentLayout({ frontmatter, children }: ContentLayoutProps) {
  return (
    <div className="content-container">
      <Breadcrumbs items={frontmatter.breadcrumbs} />
      
      <div className="content-grid">
        <main className="main-content">
          {frontmatter.hero_image && (
            <HeroImage {...frontmatter.hero_image} />
          )}
          <ContentHeader frontmatter={frontmatter} />
          {children}
        </main>
        
        {frontmatter.layout.hasSidebar && (
          <aside className="sidebar">
            <SidebarContent frontmatter={frontmatter} />
          </aside>
        )}
      </div>
      
      {frontmatter.layout.hasGallery && (
        <ImageGallery images={frontmatter.sidebar_images} />
      )}
      
      <RelatedContent items={frontmatter.related} />
    </div>
  );
}
```

#### 2.2 Content-Specific Components
```typescript
// components/content/InterviewLayout.tsx
interface InterviewLayoutProps {
  frontmatter: InterviewFrontmatter;
  content: string;
}

export default function InterviewLayout({ frontmatter, content }: InterviewLayoutProps) {
  return (
    <ContentLayout frontmatter={frontmatter}>
      <PublicationInfo publication={frontmatter.publication} />
      <SubjectInfo subject={frontmatter.subject} />
      
      <article className="interview-content">
        <MDXRenderer content={content} />
      </article>
      
      <AuthorBio author={frontmatter.publication.author} />
    </ContentLayout>
  );
}

// components/content/ReviewLayout.tsx
interface ReviewLayoutProps {
  frontmatter: ReviewFrontmatter;
  content: string;
}

export default function ReviewLayout({ frontmatter, content }: ReviewLayoutProps) {
  return (
    <ContentLayout frontmatter={frontmatter}>
      <PerformanceInfo performance={frontmatter.performance} />
      
      <article className="review-content">
        <MDXRenderer content={content} />
      </article>
      
      <CastInfo cast={frontmatter.performance?.cast} />
      <ProgramInfo program={frontmatter.performance?.program} />
    </ContentLayout>
  );
}
```

#### 2.3 Reusable UI Components
```typescript
// components/ui/ImageGallery.tsx
interface ImageGalleryProps {
  images: ContentImage[];
  layout?: 'grid' | 'carousel' | 'masonry';
}

// components/ui/SubjectCard.tsx
interface SubjectCardProps {
  person: Person;
  showBio?: boolean;
  linkToProfile?: boolean;
}

// components/ui/PublicationBadge.tsx
interface PublicationBadgeProps {
  publication: PublicationInfo;
  showDate?: boolean;
  showPublisher?: boolean;
}
```

### Phase 3: File Structure & Organization

#### 3.1 Directory Structure
```
content/
├── interviews/
│   ├── c_romero.mdx
│   ├── c_hvorostovsky.mdx
│   └── ...
├── reviews/
│   ├── sfo-faust-2009.mdx
│   ├── berkeley-don-giovanni.mdx
│   └── ...
├── articles/
│   ├── music-trains-brain.mdx
│   └── ...
├── professional/
│   ├── background.mdx
│   ├── projects/
│   └── publications/
└── _schemas/
    ├── interview.schema.json
    ├── review.schema.json
    └── ...

pages/
├── interviews/
│   ├── index.tsx
│   └── [slug].tsx
├── reviews/
│   ├── index.tsx
│   └── [slug].tsx
└── ...

components/
├── layouts/
├── content/
├── ui/
└── navigation/
```

#### 3.2 Type Definitions
```typescript
// types/content.ts
interface BaseFrontmatter {
  id: string;
  type: ContentType;
  category: ContentCategory;
  title: string;
  subtitle?: string;
  layout: LayoutConfig;
  seo: SEOConfig;
  breadcrumbs: Breadcrumb[];
  related?: string[];
}

interface InterviewFrontmatter extends BaseFrontmatter {
  type: 'interview';
  subject: SubjectInfo;
  publication: PublicationInfo;
  sidebar_images?: ContentImage[];
}

interface ReviewFrontmatter extends BaseFrontmatter {
  type: 'review';
  performance: PerformanceInfo;
  publication: PublicationInfo;
  rating?: number;
}

interface PublicationInfo {
  date: string;
  publisher: string;
  author?: string;
  url?: string;
  headline?: string;
}

interface SubjectInfo {
  people: Person[];
  organizations: string[];
  venues?: string[];
}

interface PerformanceInfo {
  date: string;
  venue: string;
  organization: string;
  conductor?: string;
  program: MusicalWork[];
  cast?: CastMember[];
}
```

### Phase 4: Migration Tooling

#### 4.1 Automated Migration Script
```python
#!/usr/bin/env python3
"""
Enhanced migration script for converting legacy HTML content to Next.js MDX format
"""

import os
import re
import yaml
from pathlib import Path
from typing import Dict, List, Any

class NextJSMigrator:
    def __init__(self, source_dir: str, output_dir: str):
        self.source_dir = source_dir
        self.output_dir = output_dir
        
    def migrate_all_content(self):
        """Migrate all content files to Next.js format"""
        
        for file_path in Path(self.source_dir).glob("*.md"):
            try:
                migrated = self.migrate_file(file_path)
                self.save_migrated_file(migrated)
                print(f"Migrated: {file_path.name}")
            except Exception as e:
                print(f"Error migrating {file_path}: {e}")
    
    def migrate_file(self, file_path: Path) -> Dict[str, Any]:
        """Migrate a single file"""
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract structured data
        frontmatter = self.extract_frontmatter(content, file_path.stem)
        clean_content = self.clean_content_body(content)
        
        # Determine output path based on content type
        output_path = self.determine_output_path(frontmatter)
        
        return {
            "frontmatter": frontmatter,
            "content": clean_content,
            "output_path": output_path
        }
    
    def extract_frontmatter(self, content: str, file_id: str) -> Dict[str, Any]:
        """Extract YAML frontmatter from legacy content"""
        
        frontmatter = {
            "id": file_id,
            "type": self._determine_type(file_id),
            "category": self._determine_category(file_id),
            "title": self._extract_title(content),
        }
        
        # Add type-specific fields
        if frontmatter["type"] == "interview":
            frontmatter.update(self._extract_interview_fields(content))
        elif frontmatter["type"] == "review":
            frontmatter.update(self._extract_review_fields(content))
        elif frontmatter["type"] == "article":
            frontmatter.update(self._extract_article_fields(content))
            
        # Extract layout information
        frontmatter["layout"] = self._extract_layout_config(content)
        
        # Extract media assets
        if images := self._extract_images(content):
            frontmatter["sidebar_images"] = images
            
        # Extract navigation context
        frontmatter["breadcrumbs"] = self._generate_breadcrumbs(frontmatter)
        
        # Generate SEO metadata
        frontmatter["seo"] = self._generate_seo(frontmatter, content)
        
        return frontmatter
    
    def clean_content_body(self, content: str) -> str:
        """Clean legacy HTML and extract main content"""
        
        # Remove HTML table structure
        content = re.sub(r'<tr[^>]*>|</tr>', '', content)
        content = re.sub(r'<td[^>]*>|</td>', '', content)
        content = re.sub(r'<table[^>]*>|</table>', '', content)
        
        # Remove HTML comments
        content = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)
        
        # Clean up navigation elements
        content = re.sub(r'<img[^>]+btn_[^>]+>', '', content)
        
        # Remove external links section
        content = re.sub(r'<div[^>]+position: absolute[^>]*>.*?</div>', '', content, flags=re.DOTALL)
        
        # Extract main content (everything between title and sidebar)
        main_content_match = re.search(
            r'<h3>.*?</h3>.*?(<p></p>.*?)(?=<td class="td_right"|$)', 
            content, 
            re.DOTALL
        )
        
        if main_content_match:
            main_content = main_content_match.group(1)
        else:
            # Fallback: extract everything after the title
            title_match = re.search(r'<h3>.*?</h3>', content)
            if title_match:
                main_content = content[title_match.end():]
            else:
                main_content = content
        
        # Convert remaining HTML to Markdown
        main_content = self._html_to_markdown(main_content)
        
        return main_content.strip()
    
    def _html_to_markdown(self, html_content: str) -> str:
        """Convert HTML elements to Markdown"""
        
        # Bold and italic
        html_content = re.sub(r'<b>(.*?)</b>', r'**\\1**', html_content)
        html_content = re.sub(r'<i>(.*?)</i>', r'*\\1*', html_content)
        
        # Paragraphs
        html_content = re.sub(r'<p></p>', '\n\n', html_content)
        html_content = re.sub(r'<p[^>]*>', '\n\n', html_content)
        html_content = re.sub(r'</p>', '', html_content)
        
        # Line breaks
        html_content = re.sub(r'<br[^>]*>', '\n', html_content)
        
        # Links
        html_content = re.sub(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', r'[\\2](\\1)', html_content)
        
        # Clean up whitespace
        html_content = re.sub(r'\n\s*\n\s*\n', '\n\n', html_content)
        
        return html_content
    
    def save_migrated_file(self, migrated: Dict[str, Any]):
        """Save migrated content to MDX file"""
        
        output_path = Path(self.output_dir) / migrated["output_path"]
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Create MDX content
        mdx_content = "---\n"
        mdx_content += yaml.dump(migrated["frontmatter"], default_flow_style=False, allow_unicode=True)
        mdx_content += "---\n\n"
        mdx_content += migrated["content"]
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(mdx_content)
```

### Phase 5: Dynamic Page Generation

#### 5.1 Dynamic Routes
```typescript
// pages/interviews/[slug].tsx
import { GetStaticProps, GetStaticPaths } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import { getContentBySlug, getAllContentSlugs } from '@/lib/content';
import InterviewLayout from '@/components/content/InterviewLayout';

export default function InterviewPage({ frontmatter, mdxSource }) {
  return (
    <InterviewLayout frontmatter={frontmatter}>
      <MDXRemote {...mdxSource} />
    </InterviewLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllContentSlugs('interviews');
  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { frontmatter, content } = getContentBySlug('interviews', params.slug);
  const mdxSource = await serialize(content);
  
  return {
    props: {
      frontmatter,
      mdxSource
    }
  };
};
```

#### 5.2 Content Management Utilities
```typescript
// lib/content.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ContentType, ContentFrontmatter } from '@/types/content';

export function getContentBySlug(
  contentType: string, 
  slug: string
): { frontmatter: ContentFrontmatter; content: string } {
  
  const contentDirectory = path.join(process.cwd(), 'content', contentType);
  const filePath = path.join(contentDirectory, `${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  const { data: frontmatter, content } = matter(fileContent);
  
  return {
    frontmatter: frontmatter as ContentFrontmatter,
    content
  };
}

export function getAllContent(contentType: string): ContentFrontmatter[] {
  const contentDirectory = path.join(process.cwd(), 'content', contentType);
  const filenames = fs.readdirSync(contentDirectory);
  
  return filenames
    .filter(name => name.endsWith('.mdx'))
    .map(filename => {
      const { frontmatter } = getContentBySlug(contentType, filename.replace('.mdx', ''));
      return frontmatter;
    })
    .sort((a, b) => new Date(b.publication?.date || 0).getTime() - new Date(a.publication?.date || 0).getTime());
}
```

## Benefits of This Approach

### ✅ **Preserves All Relationships**
- Images remain associated with content through frontmatter
- Navigation context maintained through breadcrumbs
- Related content links preserved

### ✅ **Modern Next.js Architecture**
- Component-based layouts
- Type-safe props and data
- Static generation for performance
- Dynamic routing

### ✅ **Maintains Legacy Data**
- All original metadata preserved
- HTML structure documented
- Migration path documented

### ✅ **Enhanced Features**
- SEO optimization
- Responsive design
- Search and filtering
- Content recommendations

### ✅ **Developer Experience**
- Type safety throughout
- Reusable components
- Clear content structure
- Easy content management

This migration strategy transforms the legacy table-based HTML structure into modern, component-based Next.js pages while preserving all the rich metadata and relationships that make the content valuable.
