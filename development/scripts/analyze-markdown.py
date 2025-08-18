#!/usr/bin/env python3
"""
Comprehensive markdown file normalization analysis script.
"""

import re
from pathlib import Path
from collections import defaultdict

def parse_yaml_simple(content):
    """Simple YAML parser for basic frontmatter."""
    lines = content.strip().split('\n')
    data = {}
    current_key = None
    in_list = False
    
    for line in lines:
        line = line.rstrip()
        if not line:
            continue
            
        # Handle list items
        if line.startswith('  - '):
            if current_key and current_key not in data:
                data[current_key] = []
            if isinstance(data.get(current_key), list):
                item_content = line[4:].strip()
                if ':' in item_content:
                    # This is a dict item in the list
                    key, value = item_content.split(':', 1)
                    item = {key.strip(): value.strip()}
                    data[current_key].append(item)
                else:
                    data[current_key].append(item_content)
            in_list = True
            continue
        elif line.startswith('    ') and in_list:
            # Sub-item in list
            continue
        elif line.startswith('  ') and not line.startswith('  - '):
            # Sub-field
            if ':' in line:
                key, value = line.split(':', 1)
                key = key.strip()
                value = value.strip()
                if value == 'null':
                    value = None
                elif value == '':
                    value = ''
                if current_key and current_key in data and isinstance(data[current_key], dict):
                    data[current_key][key] = value
            continue
        else:
            in_list = False
            
        # Handle top-level fields
        if ':' in line and not line.startswith(' '):
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip()
            
            if value == 'null':
                data[key] = None
            elif value == '':
                data[key] = ''
            elif not value:  # Empty value, might be followed by sub-items
                data[key] = {}
                current_key = key
            else:
                data[key] = value
                current_key = key
    
    return data

def analyze_frontmatter(file_path):
    """Analyze frontmatter issues in a markdown file."""
    issues = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract frontmatter
        if not content.startswith('---'):
            issues.append("Missing frontmatter")
            return issues
        
        try:
            # Find frontmatter boundaries
            parts = content.split('---', 2)
            if len(parts) < 3:
                issues.append("Malformed frontmatter (missing closing ---)")
                return issues
            
            frontmatter_content = parts[1].strip()
            if not frontmatter_content:
                issues.append("Empty frontmatter")
                return issues
            
            # Parse YAML
            try:
                fm = parse_yaml_simple(frontmatter_content)
                if fm is None or not fm:
                    issues.append("Empty YAML frontmatter")
                    return issues
            except Exception as e:
                issues.append(f"YAML parsing error: {str(e)}")
                return issues
            
            # Check required fields
            required_fields = ['id', 'title', 'type']
            for field in required_fields:
                if field not in fm:
                    issues.append(f"Missing required field: {field}")
                elif fm[field] is None or fm[field] == '':
                    issues.append(f"Empty required field: {field}")
            
            # Check title issues
            if 'title' in fm and fm['title']:
                title = str(fm['title']).strip()
                if title == 'Untitled':
                    issues.append("Generic 'Untitled' title")
                elif title.endswith(' at the') or title.endswith(' with the'):
                    issues.append("Incomplete title (ends with 'at the' or 'with the')")
                elif title.endswith(' - '):
                    issues.append("Title ends with dangling dash")
            
            # Check publication date issues
            if 'publication' in fm and isinstance(fm['publication'], dict):
                pub = fm['publication']
                if 'date' in pub:
                    if pub['date'] is None:
                        issues.append("Publication date is null")
                    elif pub['date'] == '':
                        issues.append("Publication date is empty")
                else:
                    issues.append("Missing publication date")
            
            # Check images field
            if 'images' in fm:
                if fm['images'] is None:
                    issues.append("Images field is null")
                elif isinstance(fm['images'], list):
                    for i, img in enumerate(fm['images']):
                        if isinstance(img, dict):
                            # Check for duplicate keys in YAML (this shows as dict with multiple values)
                            if 'src' in img:
                                # Check if there are duplicate src entries
                                src_count = str(frontmatter_content).count(f"src: {img['src']}")
                                if src_count > 1:
                                    issues.append(f"Duplicate 'src' key in image {i}")
                        
            # Check for conversion date inconsistencies
            if 'conversion date' in fm:
                conv_date = fm['conversion date']
                if conv_date != '2025-08-13' and conv_date != '2025-08-15':
                    issues.append(f"Unusual conversion date: {conv_date}")
            
            # Check type field
            valid_types = ['article', 'interview', 'review', 'publication', 'professional', 'background', 'homepage']
            if 'type' in fm and fm['type'] not in valid_types:
                issues.append(f"Invalid type: {fm['type']}")
                
        except Exception as e:
            issues.append(f"Error processing frontmatter: {str(e)}")
    
    except Exception as e:
        issues.append(f"Error reading file: {str(e)}")
    
    return issues

def analyze_content(file_path):
    """Analyze content issues in a markdown file."""
    issues = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check for multiple frontmatter blocks
        frontmatter_count = content.count('---\n---')
        if frontmatter_count > 0:
            issues.append("Contains duplicate frontmatter pattern (---\\n---)")
        
        # Check for orphaned subjects (leftover from cleanup)
        if 'subjects:' in content and '---' in content:
            # Check if subjects appear after the first frontmatter block
            parts = content.split('---', 2)
            if len(parts) >= 3 and 'subjects:' in parts[2]:
                issues.append("Orphaned 'subjects:' field in content")
        
        # Check for malformed links
        link_pattern = r'\[([^\]]*)\]\(([^)]*)\)'
        links = re.findall(link_pattern, content)
        for link_text, link_url in links:
            if ' ' in link_url and not link_url.startswith('http') and not link_url.startswith('/'):
                issues.append(f"Link with spaces in URL: {link_url}")
        
        # Check for excessive line breaks
        if '\n\n\n\n' in content:
            issues.append("Contains excessive line breaks (4+ consecutive)")
        
    except Exception as e:
        issues.append(f"Error analyzing content: {str(e)}")
    
    return issues

def main():
    content_dir = Path('public/content')
    
    if not content_dir.exists():
        print("Content directory not found!")
        return
    
    total_files = 0
    files_with_issues = 0
    all_issues = defaultdict(list)
    issue_counts = defaultdict(int)
    
    print("🔍 Analyzing markdown files for normalization issues...\n")
    
    # Analyze all markdown files
    for md_file in content_dir.glob('*.md'):
        total_files += 1
        file_issues = []
        
        # Analyze frontmatter
        fm_issues = analyze_frontmatter(md_file)
        file_issues.extend(fm_issues)
        
        # Analyze content
        content_issues = analyze_content(md_file)
        file_issues.extend(content_issues)
        
        if file_issues:
            files_with_issues += 1
            all_issues[md_file.name] = file_issues
            for issue in file_issues:
                issue_counts[issue] += 1
    
    # Print summary
    print("📊 SUMMARY")
    print(f"Total files analyzed: {total_files}")
    print(f"Files with issues: {files_with_issues}")
    print(f"Files without issues: {total_files - files_with_issues}")
    print()
    
    # Print issue frequency
    print("🔥 MOST COMMON ISSUES")
    sorted_issues = sorted(issue_counts.items(), key=lambda x: x[1], reverse=True)
    for issue, count in sorted_issues[:10]:
        print(f"  {count:3d} files: {issue}")
    print()
    
    # Print detailed issues by category
    categories = {
        'Frontmatter Structure': ['Missing frontmatter', 'Malformed frontmatter', 'Empty frontmatter', 'YAML parsing error', 'Empty YAML frontmatter'],
        'Required Fields': ['Missing required field', 'Empty required field'],
        'Title Issues': ["Generic 'Untitled' title", "Incomplete title", "Title ends with dangling dash"],
        'Date Issues': ['Publication date is null', 'Publication date is empty', 'Missing publication date', 'Unusual conversion date'],
        'Images Issues': ['Images field is null', "Duplicate 'src' key"],
        'Content Issues': ['Contains duplicate frontmatter pattern', "Orphaned 'subjects:' field", 'Link with spaces in URL', 'Contains excessive line breaks'],
        'Type Issues': ['Invalid type']
    }
    
    print("📋 ISSUES BY CATEGORY")
    for category, issue_patterns in categories.items():
        category_files = []
        for file_name, file_issues in all_issues.items():
            for issue in file_issues:
                if any(pattern in issue for pattern in issue_patterns):
                    if file_name not in category_files:
                        category_files.append(file_name)
        
        if category_files:
            print(f"\n{category} ({len(category_files)} files):")
            for file_name in sorted(category_files)[:10]:  # Show first 10
                file_issues = [issue for issue in all_issues[file_name] 
                             if any(pattern in issue for pattern in issue_patterns)]
                print(f"  {file_name}: {', '.join(file_issues)}")
            if len(category_files) > 10:
                print(f"  ... and {len(category_files) - 10} more files")
    
    # Print files that need immediate attention
    high_priority_patterns = ['YAML parsing error', 'Missing required field', 'Incomplete title', 'Contains duplicate frontmatter pattern']
    high_priority_files = []
    
    for file_name, file_issues in all_issues.items():
        for issue in file_issues:
            if any(pattern in issue for pattern in high_priority_patterns):
                high_priority_files.append((file_name, issue))
                break
    
    if high_priority_files:
        print(f"\n🚨 HIGH PRIORITY FIXES NEEDED ({len(high_priority_files)} files):")
        for file_name, issue in sorted(high_priority_files):
            print(f"  {file_name}: {issue}")

if __name__ == '__main__':
    main()
