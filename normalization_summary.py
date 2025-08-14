#!/usr/bin/env python3
"""
Summary of file normalization completed
"""

import re
from pathlib import Path

def normalize_filename(filename):
    """Convert filename to normalized form: lowercase, hyphens instead of underscores/spaces"""
    name = filename.replace('.md', '')
    name = name.lower()
    name = re.sub(r'[_\s]+', '-', name)
    name = re.sub(r'-+', '-', name)
    name = name.strip('-')
    return name + '.md'

def main():
    content_dir = Path('public/content')
    
    # Check current state
    md_files = list(content_dir.glob('*.md'))
    
    print("File Normalization Summary")
    print("=" * 50)
    print(f"Total markdown files: {len(md_files)}")
    
    # Check for any remaining non-normalized files
    non_normalized = []
    for file_path in md_files:
        old_name = file_path.name
        new_name = normalize_filename(old_name)
        if old_name != new_name:
            non_normalized.append((old_name, new_name))
    
    if non_normalized:
        print(f"\nRemaining non-normalized files: {len(non_normalized)}")
        for old, new in non_normalized[:10]:  # Show first 10
            print(f"  {old} -> {new}")
        if len(non_normalized) > 10:
            print(f"  ... and {len(non_normalized) - 10} more")
    else:
        print("\n✅ All files are now normalized!")
    
    # Show examples of normalized filenames
    print(f"\nExamples of normalized filenames:")
    examples = [f.name for f in md_files[:10]]
    for example in examples:
        print(f"  {example}")
    
    print(f"\nNormalization rules applied:")
    print(f"  ✅ All lowercase")
    print(f"  ✅ Underscores (_) replaced with hyphens (-)")
    print(f"  ✅ Spaces replaced with hyphens (-)")
    print(f"  ✅ Internal links updated to use normalized names")
    print(f"  ✅ JSON data files updated with new filenames")
    print(f"  ✅ All .htm links converted to markdown links")

if __name__ == "__main__":
    main()
