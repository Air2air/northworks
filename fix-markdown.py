#!/usr/bin/env python3
"""
Markdown normalization fix script for critical issues.
"""

import re
from pathlib import Path

def fix_excessive_line_breaks(content):
    """Fix excessive line breaks (4+ consecutive newlines)."""
    # Replace 4+ consecutive newlines with exactly 2 newlines
    return re.sub(r'\n{4,}', '\n\n', content)

def fix_frontmatter_issues(file_path):
    """Fix specific frontmatter issues."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Fix c-art-gergiev9.md incomplete title
    if file_path.name == 'c-art-gergiev9.md':
        content = content.replace(
            'title: Impressions of Beethoven\'s Ninth Symphony Conducted by Valery Gergiev at the\n  Gergiev Festival in Rotterdam, The Netherlands',
            'title: Impressions of Beethoven\'s Ninth Symphony Conducted by Valery Gergiev at the Gergiev Festival in Rotterdam, The Netherlands'
        )
    
    # Fix c-art-wozzeck.md missing type field
    elif file_path.name == 'c-art-wozzeck.md':
        # Add type: article before the closing ---
        content = re.sub(
            r'(title: [^\n]+\n)---',
            r'\1type: article\n---',
            content
        )
    
    # Fix c-walkuere-2010.md empty title
    elif file_path.name == 'c-walkuere-2010.md':
        content = content.replace(
            'title:',
            'title: Die Walküre at San Francisco Opera, 2010'
        )
    
    # Fix generic "Untitled" titles with better defaults
    elif 'title: Untitled' in content:
        if file_path.name == 'c-articles.md':
            content = content.replace('title: Untitled', 'title: Articles Collection')
        elif file_path.name == 'c-main.md':
            content = content.replace('title: Untitled', 'title: Cheryl North - Main')
        elif file_path.name == 'c-reviews.md':
            content = content.replace('title: Untitled', 'title: Reviews Collection')
    
    # Fix null images fields
    if 'images:' in content and file_path.name in ['c-ax.md', 'c-conte.md', 'c-didonato.md']:
        content = re.sub(r'images:\s*\n', 'images:\n', content)
    
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def fix_link_spaces(content):
    """Fix links with spaces in URLs."""
    # Fix specific known issues
    replacements = {
        'phd thesis.pdf': 'phd-thesis.pdf',
        'science panel ltr to secretary perry- 17-11-14.pdf': 'science-panel-ltr-to-secretary-perry-17-11-14.pdf',
        'science panel ltr to governor perry-17-01-23 final.pdf': 'science-panel-ltr-to-governor-perry-17-01-23-final.pdf',
        'c hvorostovsky.htm#hor anchor': 'c-hvorostovsky.htm#hor-anchor'
    }
    
    for old_url, new_url in replacements.items():
        content = content.replace(old_url, new_url)
    
    return content

def fix_file(file_path):
    """Fix all issues in a single file."""
    print(f"Fixing {file_path.name}...")
    
    # Fix frontmatter issues
    frontmatter_fixed = fix_frontmatter_issues(file_path)
    
    # Read content again for other fixes
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Fix excessive line breaks
    content = fix_excessive_line_breaks(content)
    
    # Fix link spaces
    content = fix_link_spaces(content)
    
    # Write back if changed
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return frontmatter_fixed

def main():
    content_dir = Path('public/content')
    
    if not content_dir.exists():
        print("Content directory not found!")
        return
    
    # Files that need high priority fixes
    high_priority_files = [
        'c-art-gergiev9.md',
        'c-art-wozzeck.md',
        'c-walkuere-2010.md'
    ]
    
    # Files with generic titles
    title_fix_files = [
        'c-articles.md',
        'c-main.md', 
        'c-reviews.md'
    ]
    
    # Files with null images
    images_fix_files = [
        'c-ax.md',
        'c-conte.md',
        'c-didonato.md'
    ]
    
    # Files with excessive line breaks (we'll fix all markdown files for this)
    
    fixed_count = 0
    
    print("🔧 Fixing critical markdown normalization issues...\n")
    
    # Fix high priority issues first
    print("High Priority Fixes:")
    for filename in high_priority_files:
        file_path = content_dir / filename
        if file_path.exists():
            if fix_file(file_path):
                print(f"  ✅ Fixed {filename}")
                fixed_count += 1
            else:
                print(f"  ℹ️  No changes needed for {filename}")
    
    print("\nTitle Fixes:")
    for filename in title_fix_files:
        file_path = content_dir / filename
        if file_path.exists():
            if fix_file(file_path):
                print(f"  ✅ Fixed {filename}")
                fixed_count += 1
            else:
                print(f"  ℹ️  No changes needed for {filename}")
    
    print("\nImages Field Fixes:")
    for filename in images_fix_files:
        file_path = content_dir / filename
        if file_path.exists():
            if fix_file(file_path):
                print(f"  ✅ Fixed {filename}")
                fixed_count += 1
            else:
                print(f"  ℹ️  No changes needed for {filename}")
    
    print("\nExcessive Line Breaks & Link Fixes (all files):")
    for md_file in content_dir.glob('*.md'):
        if md_file.name not in high_priority_files + title_fix_files + images_fix_files:
            if fix_file(md_file):
                print(f"  ✅ Fixed {md_file.name}")
                fixed_count += 1
    
    print(f"\n🎉 Normalization complete! Fixed {fixed_count} files.")
    print("\nRecommendations for remaining issues:")
    print("- Review files with null publication dates and add proper dates")
    print("- Check image file references for files with duplicate 'src' keys")
    print("- Consider adding proper descriptions for files with minimal content")

if __name__ == '__main__':
    main()
