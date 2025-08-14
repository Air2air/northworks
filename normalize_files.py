#!/usr/bin/env python3
"""
Script to normalize markdown filenames and update internal links
- Convert to lowercase
- Replace underscores with hyphens  
- Replace spaces with hyphens
- Update internal links accordingly
"""

import re
import json
from pathlib import Path
import shutil

def normalize_filename(filename):
    """Convert filename to normalized form: lowercase, hyphens instead of underscores/spaces"""
    # Remove extension
    name = filename.replace('.md', '')
    # Convert to lowercase
    name = name.lower()
    # Replace underscores and spaces with hyphens
    name = re.sub(r'[_\s]+', '-', name)
    # Remove any double hyphens
    name = re.sub(r'-+', '-', name)
    # Remove trailing/leading hyphens
    name = name.strip('-')
    return name + '.md'

def update_internal_links(content, name_mapping):
    """Update internal links in markdown content"""
    # Update links that reference .htm files (convert to .md with normalized names)
    def replace_htm_link(match):
        link_text = match.group(1)
        old_filename = match.group(2)
        
        # Convert .htm to .md and normalize
        md_filename = old_filename.replace('.htm', '.md')
        if md_filename in name_mapping:
            new_filename = name_mapping[md_filename]
        else:
            new_filename = normalize_filename(md_filename)
        
        # Remove .md extension for the link
        new_link = new_filename.replace('.md', '')
        return f'[{link_text}]({new_link})'
    
    # Pattern to match markdown links to internal files
    content = re.sub(r'\[(.*?)\]\(([c_w].*?\.htm)\)', replace_htm_link, content)
    
    return content

def update_json_files(name_mapping):
    """Update JSON data files with new filenames"""
    data_dir = Path('src/data')
    
    for json_file in data_dir.glob('*-specialized.json'):
        print(f"Updating {json_file.name}...")
        
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Update source_file references in the JSON
        def update_source_files(obj):
            if isinstance(obj, dict):
                for key, value in obj.items():
                    if key == 'source_file' and isinstance(value, str) and value.endswith('.md'):
                        if value in name_mapping:
                            obj[key] = name_mapping[value]
                            print(f"  Updated {value} -> {name_mapping[value]}")
                    else:
                        update_source_files(value)
            elif isinstance(obj, list):
                for item in obj:
                    update_source_files(item)
        
        update_source_files(data)
        
        # Write back the updated JSON
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

def main():
    content_dir = Path('public/content')
    
    # Get all markdown files
    md_files = list(content_dir.glob('*.md'))
    
    # Create mapping of old to new names
    name_mapping = {}
    for file_path in md_files:
        old_name = file_path.name
        new_name = normalize_filename(old_name)
        if old_name != new_name:
            name_mapping[old_name] = new_name
    
    print(f"Found {len(name_mapping)} files to rename")
    
    # Step 1: Update content in all markdown files
    print("\n1. Updating internal links in markdown files...")
    for file_path in md_files:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        updated_content = update_internal_links(content, name_mapping)
        
        if updated_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            print(f"  Updated links in {file_path.name}")
    
    # Step 2: Update JSON data files
    print("\n2. Updating JSON data files...")
    update_json_files(name_mapping)
    
    # Step 3: Rename the files
    print("\n3. Renaming files...")
    for old_name, new_name in name_mapping.items():
        old_path = content_dir / old_name
        new_path = content_dir / new_name
        
        if old_path.exists():
            # Check if target already exists
            if new_path.exists():
                print(f"  WARNING: {new_name} already exists, skipping {old_name}")
                continue
                
            shutil.move(str(old_path), str(new_path))
            print(f"  Renamed: {old_name} -> {new_name}")
    
    print(f"\nCompleted normalization of {len(name_mapping)} files!")

if __name__ == "__main__":
    main()
