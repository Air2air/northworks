#!/usr/bin/env python3
"""
Verify data consistency between frontmatter.subjects and JSON tags
Analyzes all content to understand duplication and inconsistencies
"""

import json
import os
import re
from pathlib import Path
from typing import Dict, List, Any

def extract_frontmatter_subjects(markdown_content: str) -> List[str]:
    """Extract subjects from YAML frontmatter"""
    # Match YAML frontmatter block
    frontmatter_match = re.search(r'^---\n(.*?)\n---', markdown_content, re.DOTALL)
    if not frontmatter_match:
        return []
    
    frontmatter = frontmatter_match.group(1)
    
    # Extract subjects section
    subjects_match = re.search(r'^subjects:\s*\n((?:  - .*\n?)*)', frontmatter, re.MULTILINE)
    if not subjects_match:
        return []
    
    subjects_text = subjects_match.group(1)
    
    # Extract individual subjects
    subjects = []
    for line in subjects_text.split('\n'):
        line = line.strip()
        if line.startswith('- '):
            subject = line[2:].strip()
            if subject:
                subjects.append(subject)
    
    return subjects

def load_json_data(file_path: str) -> Dict[str, Any]:
    """Load JSON data from file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
        return {}

def analyze_content_consistency():
    """Analyze consistency between markdown subjects and JSON tags"""
    
    # Paths
    markdown_dir = Path("public/content")
    json_dir = Path("src/data")
    
    # Results tracking
    results = {
        'markdown_files_with_subjects': 0,
        'json_entries_with_tags': 0,
        'matched_pairs': 0,
        'inconsistent_pairs': 0,
        'missing_json_for_markdown': 0,
        'missing_markdown_for_json': 0,
        'details': []
    }
    
    # Load all JSON data
    json_data = {}
    json_files = [
        'cheryl-interviews.json',
        'cheryl-articles.json', 
        'cheryl-reviews.json',
        'warner-professional.json',
        'warner-publications.json',
        'warner-background.json'
    ]
    
    for json_file in json_files:
        json_path = json_dir / json_file
        if json_path.exists():
            data = load_json_data(str(json_path))
            collection_key = 'interviews' if 'interview' in json_file else \
                           'articles' if 'article' in json_file else \
                           'reviews' if 'review' in json_file else \
                           'professional' if 'professional' in json_file else \
                           'publications' if 'publication' in json_file else \
                           'background'
            
            if collection_key in data:
                for item in data[collection_key]:
                    item_id = item.get('metadata', {}).get('id', '')
                    if item_id:
                        json_data[item_id] = {
                            'tags': item.get('tags', []),
                            'source_file': json_file
                        }
    
    # Process markdown files
    markdown_files = list(markdown_dir.glob("*.md"))
    
    for md_file in markdown_files:
        try:
            content = md_file.read_text(encoding='utf-8')
            subjects = extract_frontmatter_subjects(content)
            file_id = md_file.stem
            
            if subjects:
                results['markdown_files_with_subjects'] += 1
                
                # Check if corresponding JSON entry exists
                if file_id in json_data:
                    json_tags = json_data[file_id]['tags']
                    
                    # Compare subjects and tags
                    subjects_set = set(subjects)
                    tags_set = set(json_tags)
                    
                    if subjects_set == tags_set:
                        results['matched_pairs'] += 1
                        status = "MATCH"
                    else:
                        results['inconsistent_pairs'] += 1
                        status = "INCONSISTENT"
                    
                    results['details'].append({
                        'id': file_id,
                        'status': status,
                        'markdown_subjects': subjects,
                        'json_tags': json_tags,
                        'json_source': json_data[file_id]['source_file'],
                        'subjects_only': list(subjects_set - tags_set),
                        'tags_only': list(tags_set - subjects_set)
                    })
                else:
                    results['missing_json_for_markdown'] += 1
                    results['details'].append({
                        'id': file_id,
                        'status': "NO_JSON",
                        'markdown_subjects': subjects,
                        'json_tags': [],
                        'json_source': None
                    })
        
        except Exception as e:
            print(f"Error processing {md_file}: {e}")
    
    # Count JSON entries with tags
    for item_id, item_data in json_data.items():
        if item_data['tags']:
            results['json_entries_with_tags'] += 1
    
    # Check for JSON entries without corresponding markdown
    for item_id in json_data:
        md_file = markdown_dir / f"{item_id}.md"
        if not md_file.exists():
            results['missing_markdown_for_json'] += 1
    
    return results

def print_analysis_report(results: Dict[str, Any]):
    """Print comprehensive analysis report"""
    
    print("=" * 80)
    print("TAGS vs SUBJECTS CONSISTENCY ANALYSIS")
    print("=" * 80)
    print()
    
    print("SUMMARY:")
    print(f"  Markdown files with subjects: {results['markdown_files_with_subjects']}")
    print(f"  JSON entries with tags:       {results['json_entries_with_tags']}")
    print(f"  Matched pairs:                {results['matched_pairs']}")
    print(f"  Inconsistent pairs:           {results['inconsistent_pairs']}")
    print(f"  Missing JSON for markdown:    {results['missing_json_for_markdown']}")
    print(f"  Missing markdown for JSON:    {results['missing_markdown_for_json']}")
    print()
    
    # Group by status
    matched = [d for d in results['details'] if d['status'] == 'MATCH']
    inconsistent = [d for d in results['details'] if d['status'] == 'INCONSISTENT']
    no_json = [d for d in results['details'] if d['status'] == 'NO_JSON']
    
    if matched:
        print(f"MATCHED PAIRS ({len(matched)}):")
        for item in matched[:5]:  # Show first 5
            print(f"  ✅ {item['id']}: {len(item['markdown_subjects'])} subjects/tags")
        if len(matched) > 5:
            print(f"  ... and {len(matched) - 5} more")
        print()
    
    if inconsistent:
        print(f"INCONSISTENT PAIRS ({len(inconsistent)}):")
        for item in inconsistent:
            print(f"  ❌ {item['id']} ({item['json_source']}):")
            if item['subjects_only']:
                print(f"     Subjects only: {item['subjects_only']}")
            if item['tags_only']:
                print(f"     Tags only: {item['tags_only']}")
        print()
    
    if no_json:
        print(f"MARKDOWN WITHOUT JSON ({len(no_json)}):")
        for item in no_json[:10]:  # Show first 10
            print(f"  📄 {item['id']}: {len(item['markdown_subjects'])} subjects")
        if len(no_json) > 10:
            print(f"  ... and {len(no_json) - 10} more")
        print()

def main():
    """Main execution"""
    print("Analyzing tags vs subjects consistency...")
    print()
    
    # Change to project directory
    project_root = Path(__file__).parent
    os.chdir(project_root)
    
    # Perform analysis
    results = analyze_content_consistency()
    
    # Print report
    print_analysis_report(results)
    
    # Recommendations
    print("RECOMMENDATIONS:")
    if results['inconsistent_pairs'] > 0:
        print("  🔧 Fix inconsistent data between markdown subjects and JSON tags")
    if results['matched_pairs'] > 0:
        print("  🗑️  Remove duplicate subjects from markdown (keep JSON tags)")
    if results['missing_json_for_markdown'] > 0:
        print("  📥 Consider migrating orphaned markdown subjects to JSON")
    
    print()
    print("✅ Analysis complete!")

if __name__ == "__main__":
    main()
