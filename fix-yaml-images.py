#!/usr/bin/env python3

from pathlib import Path

def fix_image_array_duplicates(content):
    """Fix duplicate keys in YAML image arrays"""
    lines = content.split('\n')
    in_images = False
    in_frontmatter = False
    fixed_lines = []
    current_image = {}
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Track frontmatter boundaries
        if line.strip() == '---':
            if not in_frontmatter:
                in_frontmatter = True
            else:
                in_frontmatter = False
                in_images = False
            fixed_lines.append(line)
            i += 1
            continue
        
        if not in_frontmatter:
            fixed_lines.append(line)
            i += 1
            continue
        
        # Check if we're entering images section
        if line.strip() == 'images:':
            in_images = True
            fixed_lines.append(line)
            i += 1
            continue
        
        # Check if we're leaving images section
        if in_images and line and not line.startswith('  ') and not line.startswith('-'):
            in_images = False
            fixed_lines.append(line)
            i += 1
            continue
        
        if in_images:
            # Handle image array items
            if line.strip().startswith('- '):
                # Start of new image object - flush previous if exists
                if current_image:
                    # Write out the previous image
                    fixed_lines.append('  - height: ' + str(current_image.get('height', '')))
                    fixed_lines.append('    src: ' + current_image.get('src', ''))
                    fixed_lines.append('    width: ' + str(current_image.get('width', '')))
                    current_image = {}
                
                # Parse the first property of new image
                prop_line = line.strip()[2:].strip()  # Remove '- '
                if ':' in prop_line:
                    key, value = prop_line.split(':', 1)
                    current_image[key.strip()] = value.strip()
            
            elif line.strip() and line.startswith('    ') and ':' in line:
                # Additional properties of current image
                prop_line = line.strip()
                if ':' in prop_line:
                    key, value = prop_line.split(':', 1)
                    current_image[key.strip()] = value.strip()
            
            elif line.strip() == '':
                fixed_lines.append(line)
            
            # Don't append the original line - we'll construct it properly
        else:
            fixed_lines.append(line)
        
        i += 1
    
    # Flush any remaining image
    if current_image and in_images:
        fixed_lines.append('  - height: ' + str(current_image.get('height', '')))
        fixed_lines.append('    src: ' + current_image.get('src', ''))
        fixed_lines.append('    width: ' + str(current_image.get('width', '')))
    
    return '\n'.join(fixed_lines)

def fix_yaml_structure_issues(content):
    """Fix various YAML structure issues"""
    # Remove any duplicate width/height keys in image objects
    lines = content.split('\n')
    fixed_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Skip duplicate width keys in image arrays
        if (line.strip().startswith('width:') and 
            i > 0 and 
            lines[i-1].strip().startswith('width:')):
            i += 1
            continue
        
        # Skip duplicate height keys in image arrays  
        if (line.strip().startswith('height:') and 
            i > 0 and 
            lines[i-1].strip().startswith('height:')):
            i += 1
            continue
        
        # Skip duplicate src keys in image arrays
        if (line.strip().startswith('src:') and 
            i > 0 and 
            lines[i-1].strip().startswith('src:')):
            i += 1
            continue
        
        fixed_lines.append(line)
        i += 1
    
    return '\n'.join(fixed_lines)

def process_file(file_path):
    """Process a single markdown file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Apply fixes
        content = fix_image_array_duplicates(content)
        content = fix_yaml_structure_issues(content)
        
        # Only write if changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed: {file_path}")
            return True
        
        return False
    
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    content_dir = Path("/Users/todddunning/Desktop/Northworks/northworks/public/content")
    
    if not content_dir.exists():
        print(f"Content directory not found: {content_dir}")
        return
    
    md_files = list(content_dir.glob("*.md"))
    print(f"Found {len(md_files)} markdown files to process")
    
    fixed_count = 0
    for file_path in md_files:
        if process_file(file_path):
            fixed_count += 1
    
    print("\nProcessing complete!")
    print(f"Fixed {fixed_count} files out of {len(md_files)} total files")

if __name__ == "__main__":
    main()
