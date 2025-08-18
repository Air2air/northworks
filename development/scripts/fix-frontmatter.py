#!/usr/bin/env python3
"""
Fix malformed YAML frontmatter after subjects cleanup
Remove orphaned list items and fix indentation issues
"""

import re
from pathlib import Path

def fix_malformed_frontmatter(markdown_content: str) -> str:
    """Fix malformed YAML frontmatter"""
    
    # Match YAML frontmatter block
    frontmatter_match = re.search(r'^(---\n)(.*?)\n(---)', markdown_content, re.DOTALL)
    if not frontmatter_match:
        return markdown_content
    
    before_frontmatter = frontmatter_match.group(1)  # "---\n"
    frontmatter_content = frontmatter_match.group(2)
    after_frontmatter = frontmatter_match.group(3)   # "---"
    
    # Remove orphaned list items (lines that start with "  - " but aren't under a field)
    lines = frontmatter_content.split('\n')
    fixed_lines = []
    
    for i, line in enumerate(lines):
        # Skip orphaned list items
        if re.match(r'^  - ', line):
            # Check if previous non-empty line ends with ":"
            prev_lines = [line for line in lines[:i] if line.strip()]
            if not prev_lines or not prev_lines[-1].strip().endswith(':'):
                continue  # Skip orphaned list item
        
        fixed_lines.append(line)
    
    # Clean up multiple empty lines
    fixed_content = '\n'.join(fixed_lines)
    fixed_content = re.sub(r'\n\n+', '\n\n', fixed_content)
    fixed_content = fixed_content.strip()
    
    # Reconstruct the file
    rest_of_file = markdown_content[frontmatter_match.end():]
    updated_content = before_frontmatter + fixed_content + '\n' + after_frontmatter + rest_of_file
    
    return updated_content

def main():
    """Fix all markdown files"""
    
    markdown_dir = Path("public/content")
    
    if not markdown_dir.exists():
        print(f"❌ Directory {markdown_dir} does not exist!")
        return
    
    fixed_count = 0
    
    # Process all .md files
    for md_file in markdown_dir.glob("*.md"):
        try:
            original_content = md_file.read_text(encoding='utf-8')
            fixed_content = fix_malformed_frontmatter(original_content)
            
            if fixed_content != original_content:
                md_file.write_text(fixed_content, encoding='utf-8')
                fixed_count += 1
                print(f"✅ Fixed {md_file.name}")
        
        except Exception as e:
            print(f"❌ Error fixing {md_file.name}: {e}")
    
    print(f"\n✅ Fixed {fixed_count} files with malformed frontmatter")

if __name__ == "__main__":
    main()
