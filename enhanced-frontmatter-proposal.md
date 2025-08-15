# Enhanced Frontmatter Schema Proposal

## Overview
This proposal outlines a comprehensive frontmatter enhancement that will enable maximum component consolidation while maintaining backward compatibility and significantly improving content management.

## Core Enhanced Fields

### 1. Performance & Event Details
```yaml
performance:
 date: "2008-08-15"   # ISO date format
 time: "8:00 PM"    # Performance time
 venue: "War Memorial Opera House"
 venue capacity: 3146
 venue address: "301 Van Ness Ave, San Francisco, CA"
 organization: "San Francisco Opera"
 conductor: "Nicola Luisotti"
 director: "Mark Streshinsky" # Stage director for opera
 program:
 - composer: "Giacomo Puccini"
  work: "La Bohème"
  act: "Complete Opera"
 - composer: "Wolfgang Amadeus Mozart"
  work: "Don Giovanni Overture"
 cast:
 - name: "John Relyea"
  role: "Mephistopheles"
  voice type: "bass"
 - name: "Patricia Racette"
  role: "Marguerite"
  voice type: "soprano"
```

### 2. Content Classification & Discovery
```yaml
content:
 category: "classical-music" # primary category
 subcategory: "opera-review" # specific type
 genre: ["opera", "symphony"] # musical genres covered
 era: ["romantic", "modern"] # musical periods
 difficulty level: "intermediate" # for educational content
 reading time: 8    # estimated minutes
 content warnings: []   # any sensitive content
 featured: true    # highlight content
 editorial status: "published" # draft, review, published
```

### 3. Rich Media & Assets
```yaml
media:
 hero image:
 src: "/images/sfo-boheme-2008.jpg"
 alt: "San Francisco Opera La Bohème production"
 caption: "Patricia Racette and John Relyea in SF Opera's La Bohème"
 photographer: "Cory Weaver"
 copyright: "© San Francisco Opera"
 gallery:
 - src: "/images/boheme-act1.jpg"
  alt: "Act I scene"
  caption: "The garret scene in Act I"
 - src: "/images/boheme-act4.jpg"
  alt: "Final scene"
  caption: "The tragic finale"
 audio clips:
 - title: "Che gelida manina excerpt"
  src: "/audio/boheme-tenor-aria.mp3"
  duration: "2:45"
 video clips:
 - title: "Behind the scenes interview"
  src: "/video/boheme-interview.mp4"
  duration: "5:20"
  thumbnail: "/images/interview-thumb.jpg"
```

### 4. Enhanced Publication Metadata
```yaml
publication:
 original date: "2008-11-20" # when originally published
 updated date: "2025-01-15" # last updated
 publisher: "Bay Area News Group"
 publication name: "Oakland Tribune"
 section: "Entertainment"
 page number: "B1"
 byline: "By Cheryl North"
 editor: "Music Editor Name"
 word count: 847
 print edition: true
 online url: "https://oaklandtribune.com/article/123"
 archive url: "https://archive.org/details/..."
 copyright holder: "Bay Area News Group"
 license: "All Rights Reserved"
 syndication: ["Inside Bay Area", "Contra Costa Times"]
```

### 5. Advanced Taxonomy & Relationships
```yaml
taxonomy:
 primary subjects: ["opera", "classical music"]
 people:
 - name: "Nicola Luisotti"
  role: "conductor"
  bio link: "/people/luisotti"
 - name: "Patricia Racette"
  role: "soprano"
  bio link: "/people/racette"
 organizations:
 - name: "San Francisco Opera"
  type: "opera company"
  location: "San Francisco, CA"
  website: "https://sfopera.com"
 venues:
 - name: "War Memorial Opera House"
  type: "opera house"
  capacity: 3146
  location: "San Francisco, CA"
 composers:
 - name: "Giacomo Puccini"
  birth year: 1858
  death year: 1924
  nationality: "Italian"
  period: "romantic"
 works:
 - title: "La Bohème"
  composer: "Giacomo Puccini"
  premiere year: 1896
  genre: "opera"
  acts: 4
 instruments: ["orchestra", "voice"]
 musical keys: ["D major", "B-flat major"]
 tempo markings: ["Andante", "Allegro"]
```

### 6. User Experience & Navigation
```yaml
navigation:
 breadcrumbs:
 - label: "Reviews"
  url: "/reviews"
 - label: "Opera Reviews"
  url: "/reviews/opera"
 - label: "San Francisco Opera"
  url: "/reviews/opera/sfo"
 related content:
 - id: "c-reviews-sfo-tosca-2008"
  title: "SF Opera's Stunning Tosca"
  relation: "same season"
 - id: "c-interviews-luisotti"
  title: "Interview with Nicola Luisotti"
  relation: "same conductor"
 tags: ["puccini", "sfo", "luisotti", "racette", "romantic opera"]
 series: "San Francisco Opera 2008 Season"
 part number: 3
 total parts: 12
```

### 7. SEO & Discovery Enhancement
```yaml
seo:
 meta title: "SF Opera's La Bohème: Grand Opera at its Grandest | Classical Music Review"
 meta description: "Cheryl North reviews San Francisco Opera's magnificent La Bohème production conducted by Nicola Luisotti with Patricia Racette and John Relyea."
 keywords: ["La Bohème", "San Francisco Opera", "Puccini", "Nicola Luisotti", "Patricia Racette", "opera review"]
 canonical url: "/reviews/sfo-boheme-luisotti-2008"
 social sharing:
 twitter card: "summary large image"
 og image: "/images/social/boheme-share.jpg"
 og description: "A magnificent realization of Puccini's masterwork at San Francisco Opera"
```

### 8. Analytics & Performance Tracking
```yaml
analytics:
 page views: 1247
 average time on page: "4:32"
 bounce rate: 0.23
 social shares: 45
 comments count: 12
 last viewed: "2025-01-15T10:30:00Z"
 popular sections: ["cast analysis", "musical interpretation"]
 referral sources: ["google", "sfopera.com", "operanews.com"]
```

### 9. Accessibility & Internationalization
```yaml
accessibility:
 alt text quality: "verified"
 transcript available: true
 audio description: false
 sign language: false
 reading level: "college"
 screen reader optimized: true
language:
 primary: "en-US"
 available translations: ["es", "fr"]
 translation status: "complete"
 translator notes: "Musical terms kept in original language"
```

### 10. Technical Metadata
```yaml
technical:
 last modified: "2025-01-15T14:22:00Z"
 version: "2.1"
 schema version: "1.0"
 migration status: "complete"
 validation errors: []
 optimization score: 0.92
 mobile friendly: true
 amp version available: false
 pdf available: true
 epub available: false
```

## Implementation Benefits

### Component Consolidation Advantages
1. **Ultimate Unified Components**: Single components can handle all content types with rich conditional rendering
2. **Smart Filtering**: Advanced taxonomy enables sophisticated content discovery
3. **Automated Relationships**: Related content suggestions based on rich metadata
4. **Unified Navigation**: Consistent breadcrumbs and navigation across all content types

### Content Management Benefits
1. **Enhanced Discovery**: Rich taxonomy and tagging for better search
2. **Performance Tracking**: Built-in analytics for content optimization
3. **SEO Optimization**: Comprehensive meta data for search engine visibility
4. **Media Management**: Structured handling of images, audio, and video

### User Experience Improvements
1. **Richer Content Pages**: Detailed performance information and media
2. **Better Navigation**: Series/collection awareness and smart related content
3. **Accessibility**: Enhanced support for all users
4. **Mobile Optimization**: Responsive design considerations built-in

## Migration Strategy

### Phase 1: Core Enhancement (Week 1-2)
- Implement essential fields: performance, content classification, enhanced publication
- Update 10-15 key content files as examples
- Create enhanced unified components with backward compatibility

### Phase 2: Rich Media Integration (Week 3-4)
- Add media management fields
- Implement taxonomy and relationship systems
- Enhanced SEO and navigation features

### Phase 3: Advanced Features (Week 5-6)
- Analytics integration
- Accessibility enhancements
- Full content migration

### Phase 4: Optimization (Week 7-8)
- Performance monitoring
- User feedback integration
- Final consolidation of all components

## Example Enhanced File

```yaml
---
# Core identification
conversion date: '2025-08-13'
id: c-reviews-sfo-boheme-luisotti-11-08
schema version: "1.0"

# Content classification
content:
 category: "classical-music"
 subcategory: "opera-review"
 genre: ["opera"]
 era: ["romantic"]
 reading time: 6
 featured: true
 editorial status: "published"

# Enhanced publication
publication:
 original date: "2008-11-20"
 updated date: "2025-01-15"
 publisher: "Bay Area News Group"
 publication name: "Oakland Tribune"
 byline: "By Cheryl North"
 word count: 847

# Performance details
performance:
 date: "2008-11-16"
 venue: "War Memorial Opera House"
 organization: "San Francisco Opera"
 conductor: "Nicola Luisotti"
 program:
 - composer: "Giacomo Puccini"
  work: "La Bohème"
 cast:
 - name: "Patricia Racette"
  role: "Mimì"
  voice type: "soprano"

# Rich taxonomy
taxonomy:
 people:
 - name: "Nicola Luisotti"
  role: "conductor"
 - name: "Patricia Racette"
  role: "soprano"
 organizations:
 - name: "San Francisco Opera"
  type: "opera company"
 composers:
 - name: "Giacomo Puccini"
  period: "romantic"

# Navigation
navigation:
 tags: ["puccini", "sfo", "luisotti", "boheme"]
 series: "San Francisco Opera 2008 Season"

# SEO
seo:
 meta title: "SF Opera's La Bohème: Grand Opera at its Grandest"
 meta description: "Review of San Francisco Opera's magnificent La Bohème with Nicola Luisotti conducting."
 keywords: ["La Bohème", "San Francisco Opera", "Puccini", "opera review"]

title: "San Francisco Opera's La Bohème: A Masterwork Realized"
type: review
---
```

This enhanced frontmatter system will enable the creation of truly unified components that can intelligently render any content type while providing rich, contextual information and superior user experience.
