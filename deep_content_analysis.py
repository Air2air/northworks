#!/usr/bin/env python3

"""
Deep Content Analysis Tagging System for NorthWorks
==================================================

This system analyzes markdown content and generates exactly 6 meaningful tags
for each article based on comprehensive content analysis.

Tag Categories:
1. PEOPLE - Composers, performers, conductors (e.g., "Mozart", "Yo-Yo Ma")
2. WORKS - Specific compositions, operas, symphonies (e.g., "Symphony No. 9", "La Bohème")
3. GENRES - Musical styles and forms (e.g., "Opera", "Chamber Music", "Contemporary")
4. VENUES - Performance locations (e.g., "Carnegie Hall", "Davies Symphony Hall")
5. INSTRUMENTS - Featured instruments (e.g., "Piano", "Violin", "Orchestra")
6. CONCEPTS - Musical concepts, techniques, themes (e.g., "Interpretation", "Technique")

Strategy:
- Extract and weight keywords based on frequency and context
- Identify proper nouns (people, places, works)
- Recognize musical terminology and concepts
- Score relevance based on title, first paragraph, and content frequency
- Select exactly 6 tags that best represent the content's essence
"""

import re
import json
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Set

class ContentAnalyzer:
    def __init__(self):
        # Musical terminology and concepts
        self.musical_terms = {
            # Genres and Forms
            'opera', 'symphony', 'concerto', 'sonata', 'quartet', 'quintet', 'chamber music',
            'baroque', 'classical', 'romantic', 'contemporary', 'modern', 'folk', 'jazz',
            'oratorio', 'mass', 'requiem', 'cantata', 'lieder', 'art song',
            
            # Performance contexts
            'recital', 'concert', 'performance', 'premiere', 'debut', 'masterclass',
            'festival', 'competition', 'audition', 'rehearsal',
            
            # Musical concepts
            'interpretation', 'technique', 'virtuosity', 'expression', 'dynamics',
            'tempo', 'rhythm', 'harmony', 'melody', 'composition', 'improvisation',
            'conducting', 'collaboration', 'ensemble', 'solo',
            
            # Career and education
            'education', 'pedagogy', 'teaching', 'mentorship', 'career', 'training',
            'scholarship', 'award', 'recognition', 'achievement'
        }
        
        # Common instruments
        self.instruments = {
            'piano', 'violin', 'viola', 'cello', 'bass', 'guitar', 'harp',
            'flute', 'oboe', 'clarinet', 'bassoon', 'horn', 'trumpet', 'trombone', 'tuba',
            'percussion', 'drums', 'timpani', 'organ', 'harpsichord',
            'orchestra', 'strings', 'woodwinds', 'brass', 'choir', 'vocals', 'voice'
        }
        
        # Famous venues
        self.venues = {
            'carnegie hall', 'lincoln center', 'davies symphony hall', 'war memorial opera house',
            'metropolitan opera', 'covent garden', 'la scala', 'vienna state opera',
            'salzburg', 'bayreuth', 'tanglewood', 'aspen', 'marlboro',
            'san francisco opera', 'san francisco symphony', 'berkeley opera',
            'stanford', 'uc berkeley', 'conservatory'
        }
        
        # Famous composers (last names for recognition)
        self.composers = {
            'bach', 'mozart', 'beethoven', 'chopin', 'brahms', 'tchaikovsky', 'wagner',
            'verdi', 'puccini', 'debussy', 'ravel', 'stravinsky', 'bartok', 'prokofiev',
            'shostakovich', 'mahler', 'schubert', 'schumann', 'liszt', 'rachmaninoff',
            'haydn', 'handel', 'vivaldi', 'monteverdi', 'purcell', 'berlioz', 'bizet',
            'rossini', 'donizetti', 'bellini', 'massenet', 'saint-saëns', 'fauré',
            'sibelius', 'grieg', 'dvořák', 'smetana', 'janáček', 'respighi',
            'copland', 'bernstein', 'barber', 'gershwin', 'ives', 'carter', 'adams',
            'glass', 'reich', 'heggie', 'adès', 'saariaho'
        }

    def extract_content_from_markdown(self, markdown_path: Path) -> Dict:
        """Extract content from markdown file"""
        try:
            with open(markdown_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Split frontmatter and content
            parts = content.split('---', 2)
            if len(parts) >= 3:
                frontmatter = parts[1].strip()
                main_content = parts[2].strip()
            else:
                frontmatter = ""
                main_content = content
            
            # Extract title from frontmatter
            title_match = re.search(r'title:\s*(.+)', frontmatter)
            title = title_match.group(1).strip() if title_match else ""
            
            # Clean title of markdown and quotes
            title = re.sub(r'[*_`"\'"]', '', title)
            
            # Extract type
            type_match = re.search(r'type:\s*(.+)', frontmatter)
            content_type = type_match.group(1).strip() if type_match else "unknown"
            
            # Clean content of markdown syntax for analysis
            clean_content = self.clean_markdown(main_content)
            
            return {
                'title': title,
                'type': content_type,
                'content': clean_content,
                'word_count': len(clean_content.split())
            }
        
        except Exception as e:
            print(f"Error processing {markdown_path}: {e}")
            return None

    def clean_markdown(self, text: str) -> str:
        """Clean markdown syntax and normalize text"""
        # Remove markdown syntax
        text = re.sub(r'!\[.*?\]\(.*?\)', '', text)  # Images
        text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)  # Links
        text = re.sub(r'[*_`#]+', '', text)  # Emphasis and headers
        text = re.sub(r'\n+', ' ', text)  # Multiple newlines
        text = re.sub(r'\s+', ' ', text)  # Multiple spaces
        
        return text.strip()

    def extract_proper_nouns(self, text: str) -> Set[str]:
        """Extract potential proper nouns (capitalized words/phrases)"""
        # Find sequences of capitalized words
        proper_nouns = set()
        
        # Pattern for proper nouns (capitalized words)
        pattern = r'\b[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*\b'
        matches = re.findall(pattern, text)
        
        for match in matches:
            # Filter out common words that are often capitalized
            if match.lower() not in {'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'}:
                proper_nouns.add(match)
        
        return proper_nouns

    def analyze_content(self, content_data: Dict) -> List[str]:
        """Perform deep content analysis and generate 6 tags"""
        if not content_data:
            return []
        
        title = content_data['title'].lower()
        content = content_data['content'].lower()
        content_type = content_data['type']
        
        # Combine title and content for analysis, giving title more weight
        full_text = f"{title} {title} {title} {content}"
        
        # Extract proper nouns from original case text
        proper_nouns = self.extract_proper_nouns(content_data['title'] + " " + content_data['content'])
        
        # Score different categories
        scores = defaultdict(int)
        
        # 1. Score composers
        for composer in self.composers:
            count = full_text.count(composer)
            if count > 0:
                scores[f"composer_{composer}"] = count * 3
        
        # 2. Score instruments
        for instrument in self.instruments:
            count = full_text.count(instrument)
            if count > 0:
                scores[f"instrument_{instrument}"] = count * 2
        
        # 3. Score venues
        for venue in self.venues:
            count = full_text.count(venue)
            if count > 0:
                scores[f"venue_{venue}"] = count * 2
        
        # 4. Score musical terms
        for term in self.musical_terms:
            count = full_text.count(term)
            if count > 0:
                scores[f"concept_{term}"] = count
        
        # 5. Score proper nouns (potential people, works, places)
        for noun in proper_nouns:
            if len(noun) > 3:  # Filter very short words
                scores[f"proper_{noun}"] = 2
        
        # 6. Special scoring for content type
        if content_type == 'interview':
            scores['concept_interview'] = 3
        elif content_type == 'review':
            scores['concept_performance'] = 3
        elif content_type == 'article':
            scores['concept_analysis'] = 2
        
        # Sort by score and select top candidates
        sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        
        # Generate final tags with category balancing
        final_tags = []
        
        # First pass: get highest scoring items from each category
        for score_key, score in sorted_scores:
            if len(final_tags) >= 6:
                break
            
            category, term = score_key.split('_', 1)
            
            # Format the tag appropriately
            if category == 'composer':
                tag = self.format_composer_name(term, content_data['title'] + " " + content_data['content'])
            elif category == 'instrument':
                tag = term.title()
            elif category == 'venue':
                tag = self.format_venue_name(term)
            elif category == 'concept':
                tag = term.title().replace('_', ' ')
            elif category == 'proper':
                tag = term
            else:
                tag = term.title()
            
            # Avoid duplicates and overly similar tags
            if tag not in final_tags and not self.is_similar_tag(tag, final_tags):
                final_tags.append(tag)
        
        # Second pass: fill remaining slots with next best options
        for score_key, score in sorted_scores:
            if len(final_tags) >= 6:
                break
            
            category, term = score_key.split('_', 1)
            tag = term.title().replace('_', ' ')
            
            if tag not in final_tags and not self.is_similar_tag(tag, final_tags):
                final_tags.append(tag)
        
        # Ensure we have exactly 6 tags
        while len(final_tags) < 6:
            if content_type == 'interview':
                final_tags.extend(['Classical Music', 'Interview', 'Performance', 'Artist', 'Music', 'Biography'])
            elif content_type == 'review':
                final_tags.extend(['Classical Music', 'Performance', 'Review', 'Concert', 'Music', 'Critique'])
            elif content_type == 'article':
                final_tags.extend(['Classical Music', 'Analysis', 'Music', 'Culture', 'Arts', 'Commentary'])
            else:
                final_tags.extend(['Classical Music', 'Music', 'Performance', 'Arts', 'Culture', 'Education'])
            
            # Remove duplicates and trim to 6
            final_tags = list(dict.fromkeys(final_tags))[:6]
        
        return final_tags[:6]

    def format_composer_name(self, last_name: str, full_text: str) -> str:
        """Try to find full composer name in text"""
        # Common full names
        full_names = {
            'mozart': 'Wolfgang Amadeus Mozart',
            'beethoven': 'Ludwig van Beethoven',
            'bach': 'Johann Sebastian Bach',
            'chopin': 'Frédéric Chopin',
            'brahms': 'Johannes Brahms',
            'tchaikovsky': 'Pyotr Ilyich Tchaikovsky',
            'wagner': 'Richard Wagner',
            'verdi': 'Giuseppe Verdi',
            'puccini': 'Giacomo Puccini',
            'debussy': 'Claude Debussy',
            'ravel': 'Maurice Ravel',
            'mahler': 'Gustav Mahler',
            'schubert': 'Franz Schubert',
            'schumann': 'Robert Schumann',
            'liszt': 'Franz Liszt',
            'rachmaninoff': 'Sergei Rachmaninoff'
        }
        
        return full_names.get(last_name, last_name.title())

    def format_venue_name(self, venue: str) -> str:
        """Format venue names properly"""
        venue_formats = {
            'davies symphony hall': 'Davies Symphony Hall',
            'war memorial opera house': 'War Memorial Opera House',
            'carnegie hall': 'Carnegie Hall',
            'lincoln center': 'Lincoln Center',
            'metropolitan opera': 'Metropolitan Opera',
            'san francisco opera': 'San Francisco Opera',
            'san francisco symphony': 'San Francisco Symphony',
            'berkeley opera': 'Berkeley Opera'
        }
        
        return venue_formats.get(venue, venue.title())

    def is_similar_tag(self, new_tag: str, existing_tags: List[str]) -> bool:
        """Check if a tag is too similar to existing tags"""
        new_lower = new_tag.lower()
        for existing in existing_tags:
            existing_lower = existing.lower()
            # Check for substring matches or very similar words
            if (new_lower in existing_lower or existing_lower in new_lower or
                abs(len(new_lower) - len(existing_lower)) < 3 and 
                sum(c1 == c2 for c1, c2 in zip(new_lower, existing_lower)) / max(len(new_lower), len(existing_lower)) > 0.7):
                return True
        return False

def main():
    """Main function to process all markdown files and update JSON files"""
    content_dir = Path("/Users/todddunning/Desktop/Northworks/northworks/public/content")
    data_dir = Path("/Users/todddunning/Desktop/Northworks/northworks/src/data")
    
    analyzer = ContentAnalyzer()
    
    # Process all markdown files
    print("🔍 Analyzing content for deep tagging...")
    
    md_files = list(content_dir.glob("*.md"))
    total_files = len(md_files)
    processed = 0
    
    # Map of file ID to new tags
    new_tags_map = {}
    
    for md_file in md_files:
        # Extract file ID from filename
        file_id = md_file.stem
        
        # Analyze content
        content_data = analyzer.extract_content_from_markdown(md_file)
        if content_data:
            new_tags = analyzer.analyze_content(content_data)
            new_tags_map[file_id] = new_tags
            processed += 1
            
            if processed % 10 == 0:
                print(f"   Processed {processed}/{total_files} files...")
    
    print(f"✅ Analysis complete! Processed {processed} files.")
    print("\n📊 Sample results:")
    
    # Show sample results
    sample_count = 0
    for file_id, tags in new_tags_map.items():
        if sample_count < 3:
            print(f"   {file_id}: {tags}")
            sample_count += 1
    
    print(f"\n💾 Updated tag mappings for {len(new_tags_map)} files.")
    print("\n🔧 Next steps:")
    print("   1. Review sample results above")
    print("   2. Run update script to apply changes to JSON files")
    print("   3. Test and validate results")
    
    # Save the new tags mapping for potential use
    with open(data_dir / "new_tags_mapping.json", 'w') as f:
        json.dump(new_tags_map, f, indent=2)
    
    print(f"   📁 Tag mapping saved to: {data_dir}/new_tags_mapping.json")

if __name__ == "__main__":
    main()
