# Northworks Content Schema Documentation

## Overview

This document describes the comprehensive content schema for the Northworks website, designed to handle all types of content found in the `/public/content` directory. The schema supports classical music content (interviews, reviews, articles) as well as professional/technical content related to risk analysis and decision science.

## Content Types Analysis

Based on analysis of 252 markdown files, the content falls into these main categories:

### Classical Music Content (Prefix: `c_`)
- **Interviews** (`c_*.md`) - 50+ musician interviews
- **Reviews** (`c_reviews*.md`) - 30+ performance reviews  
- **Articles** (`c_art_*.md`) - 10+ feature articles
- **Main/Bio pages** (`c_main.md`, `c_interviews.md`) - Navigation and bio content

### Professional Content (Prefix: `w_`)
- **Background** (`w_background.md`) - Professional credentials
- **Projects** (`w_projects*.md`) - Government and academic projects
- **Publications** (`w_pub*.md`) - Academic papers and reports
- **Main bio** (`w_main.md`) - Professional biography

### Special Pages
- **Contact** (`contact.md`) - Contact information
- **Index pages** - Content navigation and organization

## Schema Structure

### Core Required Fields

```json
{
  "metadata": {
    "id": "unique-identifier",
    "type": "interview|review|article|biography|project|publication|contact|index|technical",
    "category": "classical-music|risk-analysis|professional|personal|navigation"
  },
  "content": {
    "title": "Content title",
    "body": "Main content in HTML/Markdown"
  }
}
```

### Publication Information

Handles the various publication patterns found in the content:

```json
{
  "publication": {
    "date": "2010-02-22",
    "publisher": "Bay Area News Group",
    "publication": "Oakland Tribune", 
    "section": "Preview Section",
    "headline": "Published headline if different from title"
  }
}
```

**Common Publishers Found:**
- Bay Area News Group (most common)
- Oakland Tribune
- ANG Newspapers  
- Inside Bay Area
- Contra Costa Times
- Alameda Newspaper Group

### Subject Classification

For interviews and reviews, captures the people and organizations:

```json
{
  "subject": {
    "people": [
      {
        "name": "Dmitri Hvorostovsky",
        "role": "baritone",
        "nationality": "Russian"
      }
    ],
    "organizations": ["San Francisco Opera", "San Francisco Symphony"],
    "venues": ["Davies Symphony Hall", "War Memorial Opera House"]
  }
}
```

### Performance Details

Specific to reviews, captures event information:

```json
{
  "performance": {
    "date": "2009-06-05",
    "venue": "War Memorial Opera House",
    "organization": "San Francisco Opera",
    "program": [
      {
        "composer": "Gounod", 
        "work": "Faust"
      }
    ],
    "conductor": "John Doe",
    "cast": [
      {
        "singer": "John Relyea",
        "role": "Mephistopheles", 
        "voice_type": "bass"
      }
    ]
  }
}
```

### Technical/Professional Content

For Warner North's professional content:

```json
{
  "technical": {
    "projectType": "government-consulting",
    "client": "EPA",
    "timeframe": {
      "start": "1978-01-01",
      "end": "2023-12-31"
    },
    "methodology": ["decision-analysis", "risk-assessment"],
    "keywords": ["nuclear waste", "environmental protection"]
  }
}
```

### Media Assets

Captures the extensive image and document libraries:

```json
{
  "media": {
    "images": [
      {
        "url": "images/hvorostovsky.jpg",
        "alt": "Dmitri Hvorostovsky portrait",
        "caption": "Hvorostovsky in recital",
        "width": 220,
        "height": 280,
        "type": "portrait"
      }
    ],
    "documents": [
      {
        "url": "pdf/hurricanes.pdf",
        "title": "The Decision to Seed Hurricanes",
        "type": "pdf",
        "size": "782k"
      }
    ]
  }
}
```

## Content Migration Strategy

### Phase 1: Automated Extraction
1. Parse existing HTML structure and comments
2. Extract publication dates and sources using regex patterns
3. Identify content types based on filename prefixes
4. Extract image references and dimensions

### Phase 2: Enhanced Metadata
1. Add subject classification for people and organizations
2. Parse performance details from reviews
3. Categorize technical content by project type
4. Create relationship mappings between related content

### Phase 3: Modern Features  
1. Generate SEO metadata
2. Create content recommendations
3. Build search indexes
4. Implement tagging system

## Implementation Examples

### Classical Music Interview
```json
{
  "metadata": {
    "id": "c_romero",
    "type": "interview",
    "category": "classical-music",
    "subcategory": "guitarist-interview"
  },
  "content": {
    "title": "Celino Romero Interview", 
    "subtitle": "Third generation of Romero guitar comes to Bay Area"
  },
  "publication": {
    "date": "2002-07-26",
    "publisher": "San Mateo County Times"
  },
  "subject": {
    "people": [
      {
        "name": "Celino Romero",
        "role": "guitarist", 
        "instrument": "classical guitar"
      }
    ],
    "organizations": ["San Francisco Symphony"]
  },
  "tags": ["guitar", "classical", "spanish-music", "family-dynasty"]
}
```

### Opera Review
```json
{
  "metadata": {
    "id": "c_reviews_sfo_faust_6-10",
    "type": "review", 
    "category": "classical-music",
    "subcategory": "opera-review"
  },
  "content": {
    "title": "San Francisco Opera Performance of Faust",
    "headline": "Riches abound in S.F. Opera's 'Faust'"
  },
  "publication": {
    "date": "2009-06-05",
    "publisher": "Bay Area News Group",
    "url": "http://insidebayarea.com"
  },
  "performance": {
    "date": "2009-06-05", 
    "venue": "War Memorial Opera House",
    "organization": "San Francisco Opera",
    "program": [{"composer": "Gounod", "work": "Faust"}],
    "cast": [
      {"singer": "John Relyea", "role": "Mephistopheles", "voice_type": "bass"},
      {"singer": "Stefano Secco", "role": "Dr. Faust", "voice_type": "tenor"}
    ]
  }
}
```

### Professional Project
```json
{
  "metadata": {
    "id": "w_projects_nrc",
    "type": "project",
    "category": "risk-analysis", 
    "subcategory": "government-consulting"
  },
  "content": {
    "title": "Nuclear Regulatory Commission Projects"
  },
  "technical": {
    "projectType": "government-consulting",
    "client": "Nuclear Regulatory Commission",
    "timeframe": {"start": "1989-01-01", "end": "1994-05-01"},
    "methodology": ["decision-analysis", "risk-assessment"],
    "keywords": ["nuclear-waste", "regulatory-review", "technical-analysis"]
  }
}
```

## Benefits of This Schema

1. **Comprehensive Coverage**: Handles all content types found in the site
2. **Flexible Structure**: Required core fields with optional detailed metadata  
3. **Legacy Preservation**: Maintains original HTML structure and comments
4. **Modern Features**: Supports SEO, search, and content relationships
5. **Type Safety**: Clear enumerated values for consistency
6. **Extensible**: Easy to add new fields as content evolves

This schema provides a solid foundation for modernizing the Northworks content while preserving its rich historical archive of classical music journalism and professional expertise.
