#!/usr/bin/env python3
"""
Script to fix HTML tags in content files:
1. Convert uppercase HTML tags to lowercase
2. Close unclosed self-closing tags like <P>, <BR>, <IMG>, <HR>, etc.
"""

import os
import re
import glob

# Directory containing the content files
content_dir = "/Users/todddunning/Desktop/Northworks/northworks/public/content"

def fix_html_tags(content):
    """
    Fix HTML tags in the given content:
    1. Convert uppercase tags to lowercase
    2. Close unclosed self-closing tags
    """
    
    # First, convert all HTML tags to lowercase
    def lowercase_tag(match):
        return match.group(0).lower()
    
    # Pattern to match HTML tags (both opening and closing)
    tag_pattern = r'</?[A-Z][^>]*>'
    content = re.sub(tag_pattern, lowercase_tag, content)
    
    # Fix unclosed self-closing tags
    # Handle <P> tags - close them properly
    content = re.sub(r'<p\s*>', '<p>', content)
    content = re.sub(r'<p([^>]*)>(?!</p>)', r'<p\1></p>', content)
    
    # Handle <BR> tags - make them self-closing
    content = re.sub(r'<br([^>]*)>(?!/)', r'<br\1 />', content)
    
    # Handle <IMG> tags - make them self-closing if not already
    content = re.sub(r'<img([^>]*?)>(?!</)', r'<img\1 />', content)
    content = re.sub(r'<img([^>]*?) />(?!</)', r'<img\1 />', content)  # Remove double slashes
    
    # Handle <HR> tags - make them self-closing
    content = re.sub(r'<hr([^>]*)>(?!/)', r'<hr\1 />', content)
    
    # Handle other common self-closing tags
    self_closing_tags = ['area', 'base', 'col', 'embed', 'input', 'link', 'meta', 'source', 'track', 'wbr']
    for tag in self_closing_tags:
        pattern = f'<{tag}([^>]*?)>(?!/)'
        replacement = f'<{tag}\\1 />'
        content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
    
    return content

def process_files():
    """Process all files in the content directory"""
    
    # Get all files in the content directory
    pattern = os.path.join(content_dir, "*")
    files = glob.glob(pattern)
    
    # Filter for text files (not binary)
    text_extensions = {'.md', '.htm', '.html', '.txt'}
    processed_files = []
    
    for file_path in files:
        if os.path.isfile(file_path):
            # Check if it's a text file
            _, ext = os.path.splitext(file_path)
            if ext.lower() in text_extensions or ext == '':
                try:
                    # Read the file
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Check if the file contains HTML tags
                    if re.search(r'<[^>]+>', content):
                        # Fix the HTML tags
                        fixed_content = fix_html_tags(content)
                        
                        # Only write if there were changes
                        if fixed_content != content:
                            with open(file_path, 'w', encoding='utf-8') as f:
                                f.write(fixed_content)
                            processed_files.append(file_path)
                            print(f"Fixed: {os.path.basename(file_path)}")
                        
                except UnicodeDecodeError:
                    print(f"Skipping binary file: {os.path.basename(file_path)}")
                except Exception as e:
                    print(f"Error processing {os.path.basename(file_path)}: {e}")
    
    print(f"\nProcessed {len(processed_files)} files with HTML tag fixes.")
    return processed_files

if __name__ == "__main__":
    print("Starting HTML tag fixing process...")
    processed_files = process_files()
    print("HTML tag fixing complete!")
