#!/usr/bin/env python3
"""
Remove subjects fields from markdown frontmatter
Since we're standardizing on JSON tags, remove duplicate subjects from markdown files
"""

import os
import re
from pathlib import Path
from typing import Tuple

def remove_subjects_from_frontmatter(markdown_content: str) -> Tuple[str, bool]:
    """
    Remove subjects field from YAML frontmatter
    Returns (updated_content, was_modified)
    """
    # Match YAML frontmatter block
    frontmatter_match = re.search(r'^(---\n)(.*?)\n(---)', markdown_content, re.DOTALL)
    if not frontmatter_match:
        return markdown_content, False
    
    before_frontmatter = frontmatter_match.group(1)  # "---\n"
    frontmatter_content = frontmatter_match.group(2)
    after_frontmatter = frontmatter_match.group(3)   # "---"
    
    # Remove subjects section (including the field name and all list items)
    subjects_pattern = r'^subjects:\s*\n((?:  - .*\n?)*)'
    
    original_frontmatter = frontmatter_content
    updated_frontmatter = re.sub(subjects_pattern, '', frontmatter_content, flags=re.MULTILINE)
    
    # Clean up any double newlines left behind
    updated_frontmatter = re.sub(r'\n\n+', '\n\n', updated_frontmatter)
    updated_frontmatter = updated_frontmatter.strip()
    
    was_modified = original_frontmatter != updated_frontmatter
    
    if was_modified:
        # Reconstruct the file
        rest_of_file = markdown_content[frontmatter_match.end():]
        updated_content = before_frontmatter + updated_frontmatter + '\n' + after_frontmatter + rest_of_file
        return updated_content, True
    
    return markdown_content, False

def process_markdown_files():
    """Process all markdown files to remove subjects frontmatter"""
    
    markdown_dir = Path("public/content")
    
    if not markdown_dir.exists():
        print(f"❌ Directory {markdown_dir} does not exist!")
        return
    
    stats = {
        'total_files': 0,
        'files_with_subjects': 0,
        'files_modified': 0,
        'subjects_removed': 0
    }
    
    processed_files = []
    
    # Process all .md files
    markdown_files = list(markdown_dir.glob("*.md"))
    stats['total_files'] = len(markdown_files)
    
    for md_file in markdown_files:
        try:
            # Read file
            original_content = md_file.read_text(encoding='utf-8')
            
            # Check if it has subjects
            if 'subjects:' in original_content:
                stats['files_with_subjects'] += 1
                
                # Count subjects being removed
                subjects_matches = re.findall(r'^  - (.+)$', original_content, re.MULTILINE)
                stats['subjects_removed'] += len(subjects_matches)
                
                # Remove subjects
                updated_content, was_modified = remove_subjects_from_frontmatter(original_content)
                
                if was_modified:
                    # Write back to file
                    md_file.write_text(updated_content, encoding='utf-8')
                    stats['files_modified'] += 1
                    processed_files.append({
                        'file': md_file.name,
                        'subjects_count': len(subjects_matches)
                    })
                    print(f"✅ {md_file.name}: Removed {len(subjects_matches)} subjects")
                else:
                    print(f"⚠️  {md_file.name}: Had subjects but couldn't process")
        
        except Exception as e:
            print(f"❌ Error processing {md_file.name}: {e}")
    
    return stats, processed_files

def main():
    """Main execution"""
    print("🧹 Cleaning up frontmatter subjects from markdown files...")
    print("   (Standardizing on JSON tags only)")
    print()
    
    # Change to project directory
    project_root = Path(__file__).parent
    os.chdir(project_root)
    
    # Process files
    stats, processed_files = process_markdown_files()
    
    # Print summary
    print("\n" + "="*60)
    print("FRONTMATTER CLEANUP SUMMARY")
    print("="*60)
    print(f"Total markdown files:        {stats['total_files']}")
    print(f"Files with subjects:         {stats['files_with_subjects']}")
    print(f"Files modified:              {stats['files_modified']}")
    print(f"Total subjects removed:      {stats['subjects_removed']}")
    print()
    
    if processed_files:
        print("MODIFIED FILES:")
        for file_info in processed_files[:10]:  # Show first 10
            print(f"  📝 {file_info['file']}: {file_info['subjects_count']} subjects removed")
        if len(processed_files) > 10:
            print(f"  ... and {len(processed_files) - 10} more files")
        print()
    
    print("NEXT STEPS:")
    print("  1. ✅ Frontmatter subjects removed")
    print("  2. 🔄 Application now uses JSON tags exclusively") 
    print("  3. 🚧 TODO: Fix JSON tags data corruption")
    print("  4. 🔧 TODO: Regenerate accurate JSON tags from cleaned frontmatter")
    
    print(f"\n✅ Cleanup complete! {stats['files_modified']} files updated.")

if __name__ == "__main__":
    main()
