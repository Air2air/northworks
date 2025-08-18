#!/usr/bin/env python3
"""
Image path correction script for Northworks website.
Finds alternative names for missing images and provides fix recommendations.
"""

import os
import re

def find_similar_images(missing_filename, actual_images):
    """Find images with similar names to a missing image."""
    # Extract the base name without extension
    base_name = os.path.splitext(missing_filename)[0]
    name_parts = re.split(r'[-_\s]+', base_name.lower())
    
    candidates = []
    
    for actual_path in actual_images:
        actual_name = os.path.basename(actual_path).lower()
        actual_base = os.path.splitext(actual_name)[0]
        
        # Check if any significant part of the missing name appears in actual name
        matches = 0
        total_parts = len([part for part in name_parts if len(part) > 2])  # Ignore very short parts
        
        for part in name_parts:
            if len(part) > 2 and part in actual_base:
                matches += 1
        
        if matches > 0:
            score = matches / max(total_parts, 1)
            candidates.append((actual_path, score, matches))
    
    # Sort by score (best matches first)
    candidates.sort(key=lambda x: (-x[1], -x[2]))
    return candidates[:3]  # Return top 3 matches

def main():
    """Main function to find corrections for missing images."""
    workspace_root = "/Users/todddunning/Desktop/Northworks/northworks"
    images_dir = os.path.join(workspace_root, "public", "images")
    
    # Missing images from the verification script
    missing_images = [
        "/images/1990-sab-figure1.jpg",
        "/images/1990-sab-figure2.jpg", 
        "/images/1990-sab-figure3.jpg",
        "/images/cerny-dallas.jpg",
        "/images/christopher-ventris.jpg",
        "/images/hvorostovsky-sb08.jpg",
        "/images/james-conlon-conducting.jpg",
        "/images/kent-nagano.jpg",
        "/images/kissine-with-wife-and-c-3-4-10.jpg",
        "/images/lang-lang-mother.jpg",
        "/images/leon-bates.jpg",
        "/images/richard-goode.jpg",
        "/images/rolando-villazon.jpg",
        "/images/russell-braun.jpg",
        "/images/sarah-chang-informal.jpg",
        "/images/stuttgart-state-opera.jpg",
        "/images/tappan-wilder-c-w-2007.jpg",
        "/images/thibaudet-wandc.jpg",
        "/images/wnstuttgart10-04.jpg"
    ]
    
    # Get all actual image files
    actual_images = []
    for root, dirs, files in os.walk(images_dir):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg')):
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, start=os.path.dirname(images_dir))
                web_path = '/' + rel_path.replace(os.sep, '/')
                actual_images.append(web_path)
    
    print("🔧 Image Path Correction Recommendations")
    print("=" * 60)
    
    corrections_found = []
    no_matches = []
    
    for missing_path in missing_images:
        missing_filename = os.path.basename(missing_path)
        print(f"\n❌ Missing: {missing_path}")
        
        # Find similar images
        candidates = find_similar_images(missing_filename, actual_images)
        
        if candidates:
            print("   Possible matches:")
            for i, (candidate_path, score, matches) in enumerate(candidates):
                confidence = "High" if score > 0.5 else "Medium" if score > 0.3 else "Low"
                print(f"   {i+1}. {candidate_path} (confidence: {confidence}, score: {score:.2f})")
                
            # Store the best match for correction script
            best_match = candidates[0]
            corrections_found.append((missing_path, best_match[0], best_match[1]))
        else:
            print("   No similar images found")
            no_matches.append(missing_path)
    
    # Generate correction recommendations
    print("\n📝 Correction Summary:")
    print("=" * 60)
    print(f"Missing images with potential matches: {len(corrections_found)}")
    print(f"Missing images with no matches: {len(no_matches)}")
    
    if corrections_found:
        print("\n✅ Recommended Corrections (High Confidence):")
        print("-" * 50)
        high_confidence = [c for c in corrections_found if c[2] > 0.5]
        for missing, replacement, score in high_confidence:
            print(f"Replace: {missing}")
            print(f"   With: {replacement}")
            print(f"   Confidence: {score:.2f}")
            print()
    
    if no_matches:
        print("\n🚫 Images that need to be created or sourced:")
        print("-" * 50)
        for missing in no_matches:
            print(f"  {missing}")
    
    # Generate JSON update script
    print("\n🔧 JSON Update Commands:")
    print("=" * 60)
    print("# To fix high-confidence matches, run these commands:")
    
    for missing, replacement, score in corrections_found:
        if score > 0.5:
            # Generate sed command to replace in JSON files
            escaped_missing = missing.replace('/', r'\/')
            escaped_replacement = replacement.replace('/', r'\/')
            print(f"# Replace {missing} with {replacement}")
            print(f"find src/data/normalized -name '*.json' -exec sed -i '' 's|{escaped_missing}|{escaped_replacement}|g' {{}} \\;")

if __name__ == "__main__":
    main()
