#!/usr/bin/env python3
"""
Image verification script for Northworks website.
Extracts all image paths from JSON files and verifies they exist in public/images.
"""

import os
import re

def extract_image_urls_from_json(json_file_path):
    """Extract all image URLs from a JSON file."""
    image_urls = set()
    
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Find all image URLs using regex
        # Matches: "url": "/images/filename.ext"
        pattern = r'"url":\s*"(/images/[^"]+)"'
        matches = re.findall(pattern, content)
        
        for match in matches:
            image_urls.add(match)
            
    except Exception as e:
        print(f"Error reading {json_file_path}: {e}")
    
    return image_urls

def find_all_image_files(images_dir):
    """Find all image files in the public/images directory."""
    image_files = set()
    
    if not os.path.exists(images_dir):
        print(f"Images directory not found: {images_dir}")
        return image_files
    
    # Common image extensions
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'}
    
    for root, dirs, files in os.walk(images_dir):
        for file in files:
            file_path = os.path.join(root, file)
            file_ext = os.path.splitext(file)[1].lower()
            
            if file_ext in image_extensions:
                # Convert to relative path from public directory
                rel_path = os.path.relpath(file_path, start=os.path.dirname(images_dir))
                # Normalize path separators and add leading slash
                web_path = '/' + rel_path.replace(os.sep, '/')
                image_files.add(web_path)
    
    return image_files

def main():
    """Main verification function."""
    # Set up paths
    workspace_root = "/Users/todddunning/Desktop/Northworks/northworks"
    json_dir = os.path.join(workspace_root, "src", "data", "normalized")
    images_dir = os.path.join(workspace_root, "public", "images")
    
    print("🔍 Analyzing image references in JSON files...")
    print("=" * 60)
    
    # Extract all image URLs from JSON files
    all_image_urls = set()
    json_files = []
    
    if os.path.exists(json_dir):
        for file in os.listdir(json_dir):
            if file.endswith('.json'):
                json_files.append(file)
                json_path = os.path.join(json_dir, file)
                urls = extract_image_urls_from_json(json_path)
                all_image_urls.update(urls)
                print(f"📄 {file}: {len(urls)} image references")
    
    print(f"\n📊 Total unique image URLs in JSON: {len(all_image_urls)}")
    
    # Find all actual image files
    print(f"\n🖼️  Scanning {images_dir}...")
    actual_images = find_all_image_files(images_dir)
    print(f"📊 Total image files found: {len(actual_images)}")
    
    # Verify each referenced image exists
    print("\n✅ Verification Results:")
    print("=" * 60)
    
    missing_images = []
    found_images = []
    
    for url in sorted(all_image_urls):
        file_path = os.path.join(workspace_root, "public" + url)
        if os.path.exists(file_path):
            found_images.append(url)
            print(f"✅ {url}")
        else:
            missing_images.append(url)
            print(f"❌ {url} - FILE NOT FOUND")
    
    # Find unused image files
    referenced_images = set(all_image_urls)
    unused_images = actual_images - referenced_images
    
    print("\n📈 Summary:")
    print("=" * 60)
    print(f"Total JSON image references: {len(all_image_urls)}")
    print(f"Found and verified: {len(found_images)}")
    print(f"Missing files: {len(missing_images)}")
    print(f"Total image files on disk: {len(actual_images)}")
    print(f"Unused image files: {len(unused_images)}")
    
    if missing_images:
        print(f"\n❌ Missing Images ({len(missing_images)}):")
        print("-" * 40)
        for img in missing_images:
            print(f"  {img}")
    
    if unused_images:
        print(f"\n📂 Unused Images ({len(unused_images)}) - First 20:")
        print("-" * 40)
        for img in sorted(list(unused_images))[:20]:
            print(f"  {img}")
        if len(unused_images) > 20:
            print(f"  ... and {len(unused_images) - 20} more")
    
    # Generate detailed report
    print("\n📋 Detailed Breakdown by JSON File:")
    print("=" * 60)
    
    for json_file in sorted(json_files):
        json_path = os.path.join(json_dir, json_file)
        urls = extract_image_urls_from_json(json_path)
        
        file_missing = []
        file_found = []
        
        for url in urls:
            file_path = os.path.join(workspace_root, "public" + url)
            if os.path.exists(file_path):
                file_found.append(url)
            else:
                file_missing.append(url)
        
        print(f"\n📄 {json_file}:")
        print(f"  Total references: {len(urls)}")
        print(f"  Found: {len(file_found)}")
        print(f"  Missing: {len(file_missing)}")
        
        if file_missing:
            print("  Missing files:")
            for img in sorted(file_missing):
                print(f"    ❌ {img}")

if __name__ == "__main__":
    main()
