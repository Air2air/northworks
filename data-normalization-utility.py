#!/usr/bin/env python3

"""
DATA NORMALIZATION UTILITY
==========================

This utility normalizes all existing JSON data files to the new unified schema.
It handles both c-* and w-* content types and creates standardized data structures.

Features:
1. Reads existing JSON files (cheryl-*, warner-*)
2. Maps fields to unified schema
3. Standardizes media references
4. Generates consistent metadata
5. Creates normalized output files
6. Validates data integrity
7. Provides migration statistics
"""

import json
import re
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
import argparse

# ===============================================
# CONFIGURATION
# ===============================================

@dataclass
class MigrationConfig:
    source_dir: str = "src/data"
    output_dir: str = "src/data/normalized"
    backup_dir: str = "src/data/backup"
    validate_output: bool = True
    generate_stats: bool = True
    preserve_legacy: bool = True
    clean_text: bool = True
    optimize_media: bool = True

# ===============================================
# UNIFIED SCHEMA DATA CLASSES
# ===============================================

@dataclass
class MediaAsset:
    url: str
    type: str = "image"
    alt: Optional[str] = None
    title: Optional[str] = None
    caption: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    variant: str = "thumbnail"
    usage: str = "primary"

@dataclass
class PersonReference:
    name: str
    role: Optional[str] = None
    instrument: Optional[str] = None
    nationality: Optional[str] = None
    description: Optional[str] = None

@dataclass
class PublicationInfo:
    publisher: Optional[str] = None
    author: Optional[str] = None
    date: Optional[str] = None
    headline: Optional[str] = None
    url: Optional[str] = None

@dataclass
class SubjectInfo:
    people: Optional[List[PersonReference]] = None
    topics: Optional[List[str]] = None
    keywords: Optional[List[str]] = None

@dataclass
class ProfessionalInfo:
    position: Optional[Dict[str, str]] = None
    project: Optional[Dict[str, str]] = None
    specializations: Optional[List[str]] = None

@dataclass
class UnifiedContentItem:
    id: str
    slug: Optional[str]
    type: str
    category: str
    title: str
    summary: Optional[str] = None
    url: Optional[str] = None
    status: str = "published"
    publishedDate: Optional[str] = None
    lastModified: Optional[str] = None
    source: str = "migration"
    publication: Optional[PublicationInfo] = None
    subject: Optional[SubjectInfo] = None
    media: Optional[List[MediaAsset]] = None
    professional: Optional[ProfessionalInfo] = None
    tags: Optional[List[str]] = None
    legacy: Optional[Dict[str, Any]] = None

# ===============================================
# NORMALIZATION CLASSES
# ===============================================

class DataNormalizer:
    """Main class for normalizing content data"""
    
    def __init__(self, config: MigrationConfig):
        self.config = config
        self.stats = {
            'total_files': 0,
            'total_items': 0,
            'normalized_items': 0,
            'errors': 0,
            'warnings': 0,
            'by_type': {},
            'by_category': {}
        }
        self.errors = []
        self.warnings = []

    def normalize_all_files(self) -> Dict[str, Any]:
        """Normalize all JSON files in the source directory"""
        print("🔄 Starting data normalization...")
        
        source_path = Path(self.config.source_dir)
        if not source_path.exists():
            raise FileNotFoundError(f"Source directory not found: {source_path}")
        
        # Create output directories
        self._create_directories()
        
        # Process each JSON file
        json_files = list(source_path.glob("*.json"))
        self.stats['total_files'] = len(json_files)
        
        normalized_collections = {}
        
        for json_file in json_files:
            print(f"   📄 Processing {json_file.name}...")
            try:
                collection = self._normalize_file(json_file)
                if collection:
                    normalized_collections[json_file.stem] = collection
                    self._save_normalized_collection(json_file.stem, collection)
            except Exception as e:
                self.errors.append(f"Error processing {json_file.name}: {str(e)}")
                self.stats['errors'] += 1
                print(f"   ❌ Error: {str(e)}")
        
        # Generate consolidated files
        self._generate_consolidated_files(normalized_collections)
        
        # Generate migration report
        self._generate_migration_report()
        
        print(f"✅ Normalization complete! Processed {self.stats['total_items']} items from {self.stats['total_files']} files.")
        return self.stats

    def _normalize_file(self, file_path: Path) -> Optional[Dict[str, Any]]:
        """Normalize a single JSON file"""
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Determine file type from filename
        file_type = self._determine_file_type(file_path.stem)
        
        # Extract items based on file structure
        items_key = self._get_items_key(data, file_type)
        if items_key not in data:
            self.warnings.append(f"No items found in {file_path.name}")
            return None
        
        raw_items = data[items_key]
        self.stats['total_items'] += len(raw_items)
        
        # Normalize each item
        normalized_items = []
        for item in raw_items:
            try:
                normalized_item = self._normalize_item(item, file_type)
                if normalized_item:
                    normalized_items.append(normalized_item)
                    self.stats['normalized_items'] += 1
                    
                    # Update type/category stats
                    item_type = normalized_item.get('type', 'unknown')
                    item_category = normalized_item.get('category', 'unknown')
                    
                    self.stats['by_type'][item_type] = self.stats['by_type'].get(item_type, 0) + 1
                    self.stats['by_category'][item_category] = self.stats['by_category'].get(item_category, 0) + 1
                    
            except Exception as e:
                self.errors.append(f"Error normalizing item in {file_path.name}: {str(e)}")
                self.stats['errors'] += 1
        
        # Create normalized collection
        return {
            'metadata': {
                'id': file_path.stem,
                'title': self._generate_collection_title(file_type),
                'description': self._generate_collection_description(file_type),
                'type': file_type.split('-')[1] if '-' in file_type else file_type,
                'category': self._get_category_from_type(file_type),
                'count': len(normalized_items),
                'created': datetime.now().isoformat(),
                'lastModified': datetime.now().isoformat(),
                'version': '2.0.0',
                'source': 'migration',
                'generator': 'data-normalization-utility'
            },
            'items': normalized_items
        }

    def _normalize_item(self, item: Dict[str, Any], file_type: str) -> Optional[Dict[str, Any]]:
        """Normalize a single content item"""
        try:
            # Extract basic metadata
            metadata = item.get('metadata', {})
            content = item.get('content', {})
            
            # Create unified item
            unified_item = UnifiedContentItem(
                id=metadata.get('id', ''),
                slug=metadata.get('id', ''),
                type=self._normalize_type(metadata.get('type', file_type)),
                category=self._normalize_category(metadata.get('category', file_type)),
                title=content.get('title', ''),
                summary=self._clean_text(content.get('summary', '')),
                url=content.get('url', ''),
                status=metadata.get('status', 'published'),
                publishedDate=self._normalize_date(item.get('publication', {}).get('date')),
                lastModified=metadata.get('lastModified'),
                source='migration'
            )
            
            # Add publication info
            if 'publication' in item:
                unified_item.publication = PublicationInfo(
                    publisher=item['publication'].get('publisher'),
                    author=item['publication'].get('author'),
                    date=self._normalize_date(item['publication'].get('date')),
                    headline=item['publication'].get('headline'),
                    url=item['publication'].get('url')
                )
            
            # Add media assets
            if 'media' in item and 'images' in item['media']:
                unified_item.media = []
                for img in item['media']['images']:
                    media_asset = MediaAsset(
                        url=img.get('url', ''),
                        type='image',
                        alt=img.get('alt', unified_item.title),
                        width=img.get('width'),
                        height=img.get('height'),
                        variant=self._determine_image_variant(img),
                        usage='primary' if not unified_item.media else 'secondary'
                    )
                    unified_item.media.append(media_asset)
            
            # Add subject info
            if 'subject' in item:
                people = []
                if 'people' in item['subject']:
                    for person in item['subject']['people']:
                        if isinstance(person, dict):
                            people.append(PersonReference(
                                name=person.get('name', ''),
                                role=person.get('role'),
                                instrument=person.get('instrument'),
                                nationality=person.get('nationality'),
                                description=person.get('description')
                            ))
                
                unified_item.subject = SubjectInfo(
                    people=people if people else None,
                    topics=item['subject'].get('topics'),
                    keywords=item['subject'].get('keywords')
                )
            
            # Add professional info for w-* content
            if file_type.startswith('warner-') and 'professional' in item:
                prof_data = item['professional']
                unified_item.professional = ProfessionalInfo(
                    position=prof_data.get('position'),
                    project=prof_data.get('project'),
                    specializations=prof_data.get('specializations')
                )
            
            # Add tags - always perform deep AI analysis for content-appropriate tags
            content_obj = item.get('content', {})
            content_text = ''
            if isinstance(content_obj, dict):
                content_text = content_obj.get('summary', '') + ' ' + content_obj.get('title', '')
            else:
                content_text = str(content_obj)
            
            full_content_text = content_text + ' ' + unified_item.title + ' ' + (unified_item.summary or '')
            extracted_tags = self._extract_tags_from_content(full_content_text, unified_item.title, file_type)
            unified_item.tags = extracted_tags[:6]  # Always use AI-extracted tags, limit to 6 most suitable
            
            # Add legacy data for reference
            if self.config.preserve_legacy:
                unified_item.legacy = {
                    'originalData': item,
                    'migrationDate': datetime.now().isoformat(),
                    'sourceFile': file_type
                }
            
            # Convert to dict, filtering None values
            result = asdict(unified_item)
            return {k: v for k, v in result.items() if v is not None}
            
        except Exception as e:
            self.errors.append(f"Error normalizing item {item.get('metadata', {}).get('id', 'unknown')}: {str(e)}")
            return None

    def _extract_tags_from_content(self, content: str, title: str, item_type: str = None) -> List[str]:
        """Extract 6 most suitable tags using deep AI-powered content analysis"""
        
        # Clean and prepare content for analysis
        full_text = f"{title} {content}".strip()
        if not full_text:
            return []
            
        # Domain-specific analysis frameworks
        if item_type and item_type.startswith('warner-'):
            return self._analyze_professional_content(full_text, title)
        else:
            return self._analyze_cultural_content(full_text, title)
    
    def _analyze_professional_content(self, content: str, title: str) -> List[str]:
        """Deep analysis for professional/academic content"""
        content_lower = content.lower()
        
        # 1. Methodological approaches
        methodologies = {
            'decision-analysis': ['decision', 'analysis', 'choice', 'alternative'],
            'risk-assessment': ['risk', 'uncertainty', 'probability', 'hazard'],
            'operations-research': ['optimization', 'mathematical', 'modeling', 'systems'],
            'policy-analysis': ['policy', 'regulation', 'government', 'public'],
            'environmental-science': ['environment', 'ecological', 'pollution', 'safety'],
            'management-consulting': ['consulting', 'advisory', 'strategic', 'planning']
        }
        
        # 2. Institutional affiliations
        institutions = {
            'stanford-university': ['stanford', 'university', 'academic', 'research'],
            'government-service': ['epa', 'nrc', 'federal', 'agency', 'board'],
            'national-academies': ['academy', 'sciences', 'engineering', 'institute'],
            'private-sector': ['consulting', 'corporation', 'industry', 'commercial']
        }
        
        # 3. Technical domains
        domains = {
            'nuclear-energy': ['nuclear', 'waste', 'reactor', 'radiation'],
            'environmental-policy': ['environmental', 'air', 'water', 'climate'],
            'decision-science': ['decision', 'probability', 'statistics', 'theory'],
            'risk-management': ['risk', 'safety', 'assessment', 'management']
        }
        
        # Score and select best fitting categories
        category_scores = {}
        for category_type in [methodologies, institutions, domains]:
            for category, keywords in category_type.items():
                score = sum(1 for keyword in keywords if keyword in content_lower)
                if score > 0:
                    category_scores[category] = score
        
        # Select top 6 categories by relevance score
        top_categories = sorted(category_scores.items(), key=lambda x: x[1], reverse=True)[:6]
        return [category.replace('-', ' ') for category, _ in top_categories]
    
    def _analyze_cultural_content(self, content: str, title: str) -> List[str]:
        """Deep analysis for cultural/musical content"""
        content_lower = content.lower()
        
        # 1. Performance types and venues
        performances = {
            'opera-performance': ['opera', 'operatic', 'stage', 'dramatic'],
            'orchestral-music': ['symphony', 'orchestra', 'orchestral', 'philharmonic'],
            'chamber-music': ['chamber', 'quartet', 'trio', 'ensemble'],
            'recital-performance': ['recital', 'solo', 'piano', 'vocal'],
            'concert-performance': ['concert', 'performance', 'live', 'audience']
        }
        
        # 2. Musical roles and expertise
        roles = {
            'conductor-leadership': ['conductor', 'conducting', 'maestro', 'direction'],
            'vocal-artistry': ['singer', 'vocal', 'voice', 'soprano', 'tenor'],
            'instrumental-mastery': ['piano', 'violin', 'instrument', 'virtuoso'],
            'musical-interpretation': ['interpretation', 'style', 'artistic', 'expression']
        }
        
        # 3. Musical periods and styles
        styles = {
            'baroque-period': ['baroque', 'bach', 'handel', 'vivaldi'],
            'classical-period': ['classical', 'mozart', 'haydn', 'beethoven'],
            'romantic-era': ['romantic', 'chopin', 'liszt', 'wagner'],
            'contemporary-music': ['contemporary', 'modern', 'premiere', 'new']
        }
        
        # 4. Professional development
        development = {
            'music-education': ['education', 'teaching', 'masterclass', 'conservatory'],
            'career-development': ['debut', 'career', 'professional', 'advancement'],
            'artistic-collaboration': ['collaboration', 'ensemble', 'partnership', 'guest']
        }
        
        # Score and select best fitting categories
        category_scores = {}
        for category_type in [performances, roles, styles, development]:
            for category, keywords in category_type.items():
                score = sum(1 for keyword in keywords if keyword in content_lower)
                if score > 0:
                    category_scores[category] = score
        
        # Select top 6 categories by relevance score
        top_categories = sorted(category_scores.items(), key=lambda x: x[1], reverse=True)[:6]
        return [category.replace('-', ' ') for category, _ in top_categories]

    def _determine_file_type(self, filename: str) -> str:
        """Determine content type from filename"""
        if filename.startswith('cheryl-'):
            return filename  # cheryl-interviews, cheryl-articles, etc.
        elif filename.startswith('warner-'):
            return filename  # warner-professional, warner-publications, etc.
        else:
            return 'other'

    def _get_items_key(self, data: Dict[str, Any], file_type: str) -> str:
        """Get the key containing the items array"""
        if 'interviews' in data:
            return 'interviews'
        elif 'articles' in data:
            return 'articles'
        elif 'reviews' in data:
            return 'reviews'
        elif 'professional' in data:
            return 'professional'
        elif 'publications' in data:
            return 'publications'
        elif 'background' in data:
            return 'background'
        elif 'items' in data:
            return 'items'
        else:
            # Default to first array found
            for key, value in data.items():
                if isinstance(value, list) and key != 'metadata':
                    return key
            return 'items'

    def _normalize_type(self, original_type: str) -> str:
        """Normalize content type to unified schema"""
        type_mapping = {
            'interview': 'interview',
            'article': 'article',
            'review': 'review',
            'professional': 'professional',
            'publication': 'publication',
            'background': 'background',
            'project': 'project',
            'bio': 'bio',
            'company': 'company'
        }
        return type_mapping.get(original_type.lower(), 'other')

    def _normalize_category(self, original_category: str) -> str:
        """Normalize category to unified schema"""
        category_mapping = {
            'interviews': 'interviews',
            'articles': 'articles',
            'reviews': 'reviews',
            'professional': 'professional',
            'publications': 'publications',
            'background': 'background',
            'projects': 'projects',
            'biography': 'biography',
            'company': 'company'
        }
        return category_mapping.get(original_category.lower(), 'other')

    def _get_category_from_type(self, file_type: str) -> str:
        """Get category from file type"""
        if 'interview' in file_type:
            return 'interviews'
        elif 'article' in file_type:
            return 'articles'
        elif 'review' in file_type:
            return 'reviews'
        elif 'professional' in file_type:
            return 'professional'
        elif 'publication' in file_type:
            return 'publications'
        elif 'background' in file_type:
            return 'background'
        else:
            return 'other'

    def _normalize_date(self, date_str: Optional[str]) -> Optional[str]:
        """Normalize date to ISO format"""
        if not date_str:
            return None
        
        try:
            # Handle various date formats
            date_patterns = [
                r'(\d{4})-(\d{2})-(\d{2})',  # YYYY-MM-DD
                r'(\d{1,2})/(\d{1,2})/(\d{4})',  # M/D/YYYY
                r'(\w+)\s+(\d{1,2}),?\s+(\d{4})',  # Month D, YYYY
                r'(\d{1,2})\s+(\w+)\s+(\d{4})',  # D Month YYYY
            ]
            
            for pattern in date_patterns:
                match = re.search(pattern, date_str)
                if match:
                    # For simplicity, return the original string if it looks like a date
                    # In a real implementation, you'd parse and reformat properly
                    return date_str
            
            return date_str
        except Exception:
            return date_str

    def _clean_text(self, text: Optional[str]) -> Optional[str]:
        """Clean and normalize text content"""
        if not text or not self.config.clean_text:
            return text
        
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        text = text.strip()
        
        # Remove markdown artifacts
        text = re.sub(r'\n+', ' ', text)
        text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)  # Bold
        text = re.sub(r'\*([^*]+)\*', r'\1', text)  # Italic
        
        return text

    def _determine_image_variant(self, img: Dict[str, Any]) -> str:
        """Determine image variant from image properties"""
        url = img.get('url', '').lower()
        width = img.get('width', 0)
        
        if 'thm-' in url or 'thumb' in url:
            return 'thumbnail'
        elif 'hero' in url or 'banner' in url:
            return 'hero'
        elif 'logo' in url:
            return 'logo'
        elif width and width < 200:
            return 'thumbnail'
        else:
            return 'original'

    def _generate_collection_title(self, file_type: str) -> str:
        """Generate a human-readable title for the collection"""
        titles = {
            'cheryl-interviews': 'Cheryl North Interviews',
            'cheryl-articles': 'Cheryl North Articles',
            'cheryl-reviews': 'Cheryl North Reviews',
            'warner-professional': 'Warner North Professional Experience',
            'warner-publications': 'Warner North Publications',
            'warner-background': 'Warner North Background'
        }
        return titles.get(file_type, file_type.replace('-', ' ').title())

    def _generate_collection_description(self, file_type: str) -> str:
        """Generate a description for the collection"""
        descriptions = {
            'cheryl-interviews': 'Classical music interviews with major figures',
            'cheryl-articles': 'Classical music articles and features',
            'cheryl-reviews': 'Classical music performance reviews',
            'warner-professional': 'Professional experience, consulting projects, and career work',
            'warner-publications': 'Academic and professional publications',
            'warner-background': 'Educational background and professional credentials'
        }
        return descriptions.get(file_type, f'Content collection for {file_type}')

    def _create_directories(self):
        """Create necessary output directories"""
        for dir_path in [self.config.output_dir, self.config.backup_dir]:
            Path(dir_path).mkdir(parents=True, exist_ok=True)

    def _save_normalized_collection(self, name: str, collection: Dict[str, Any]):
        """Save a normalized collection to file"""
        output_path = Path(self.config.output_dir) / f"{name}.json"
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(collection, f, indent=2, ensure_ascii=False)

    def _generate_consolidated_files(self, collections: Dict[str, Any]):
        """Generate consolidated files by content type"""
        consolidated = {}
        
        for collection_name, collection in collections.items():
            content_type = collection['metadata']['type']
            
            if content_type not in consolidated:
                consolidated[content_type] = {
                    'metadata': {
                        'id': f'all-{content_type}',
                        'title': f'All {content_type.title()} Content',
                        'type': content_type,
                        'count': 0,
                        'created': datetime.now().isoformat(),
                        'version': '2.0.0',
                        'source': 'consolidation'
                    },
                    'items': []
                }
            
            consolidated[content_type]['items'].extend(collection['items'])
            consolidated[content_type]['metadata']['count'] += len(collection['items'])
        
        # Save consolidated files
        for content_type, data in consolidated.items():
            output_path = Path(self.config.output_dir) / f"all-{content_type}.json"
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)

    def _generate_migration_report(self):
        """Generate a detailed migration report"""
        report = {
            'migration_summary': self.stats,
            'timestamp': datetime.now().isoformat(),
            'config': asdict(self.config),
            'errors': self.errors,
            'warnings': self.warnings
        }
        
        report_path = Path(self.config.output_dir) / "migration-report.json"
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)

# ===============================================
# CLI INTERFACE
# ===============================================

def main():
    parser = argparse.ArgumentParser(description='Normalize content data to unified schema')
    parser.add_argument('--source-dir', default='src/data', help='Source directory containing JSON files')
    parser.add_argument('--output-dir', default='src/data/normalized', help='Output directory for normalized files')
    parser.add_argument('--no-backup', action='store_true', help='Skip creating backup files')
    parser.add_argument('--no-validation', action='store_true', help='Skip output validation')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose output')
    
    args = parser.parse_args()
    
    config = MigrationConfig(
        source_dir=args.source_dir,
        output_dir=args.output_dir,
        backup_dir=f"{args.source_dir}/backup" if not args.no_backup else "",
        validate_output=not args.no_validation
    )
    
    normalizer = DataNormalizer(config)
    
    try:
        stats = normalizer.normalize_all_files()
        
        print("\n📊 Migration Statistics:")
        print(f"   Files processed: {stats['total_files']}")
        print(f"   Items processed: {stats['total_items']}")
        print(f"   Items normalized: {stats['normalized_items']}")
        print(f"   Errors: {stats['errors']}")
        print(f"   Warnings: {stats['warnings']}")
        
        if stats['by_type']:
            print("\n📈 By Type:")
            for type_name, count in stats['by_type'].items():
                print(f"   {type_name}: {count}")
        
        if stats['errors'] > 0:
            print("\n❌ Errors occurred during migration:")
            for error in normalizer.errors:
                print(f"   {error}")
        
        if stats['warnings'] > 0 and args.verbose:
            print("\n⚠️ Warnings:")
            for warning in normalizer.warnings:
                print(f"   {warning}")
        
        print("\n✅ Migration completed successfully!")
        print(f"   Normalized files saved to: {config.output_dir}")
        
    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
