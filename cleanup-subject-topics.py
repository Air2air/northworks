#!/usr/bin/env python3
"""
Clean up JSON files by removing unused subject.topics fields
The app only uses 'tags' field, so we can safely remove 'subject.topics'
"""

import json
import os
import glob
from typing import Dict, Any

def clean_json_file(file_path: str) -> Dict[str, Any]:
    """Remove subject.topics from a JSON file and return stats"""
    
    print(f"Processing: {os.path.basename(file_path)}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    stats = {
        "file": os.path.basename(file_path),
        "items_processed": 0,
        "topics_removed": 0,
        "entries_with_both": 0,
        "entries_with_only_topics": 0,
        "entries_with_only_tags": 0
    }
    
    # Find the main content array
    content_arrays = []
    for key in ['interviews', 'articles', 'reviews', 'professional', 'publications', 'background']:
        if key in data:
            content_arrays.append((key, data[key]))
    
    for array_name, items in content_arrays:
        for item in items:
            stats["items_processed"] += 1
            
            has_subject_topics = 'subject' in item and isinstance(item['subject'], dict) and 'topics' in item['subject']
            has_tags = 'tags' in item and isinstance(item['tags'], list)
            
            if has_subject_topics and has_tags:
                stats["entries_with_both"] += 1
            elif has_subject_topics and not has_tags:
                stats["entries_with_only_topics"] += 1
            elif not has_subject_topics and has_tags:
                stats["entries_with_only_tags"] += 1
            
            # Remove subject.topics if it exists
            if has_subject_topics:
                del item['subject']['topics']
                stats["topics_removed"] += 1
                
                # If subject object is now empty, remove it entirely
                if not item['subject']:
                    del item['subject']
    
    # Write back the cleaned data
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"  ✓ Processed {stats['items_processed']} items")
    print(f"  ✓ Removed {stats['topics_removed']} subject.topics fields")
    if stats["entries_with_only_topics"] > 0:
        print(f"  ⚠ Warning: {stats['entries_with_only_topics']} entries had only topics (no tags)")
    
    return stats

def main():
    """Main function to clean all JSON files"""
    
    # Find all JSON data files
    data_dir = "src/data"
    json_files = glob.glob(os.path.join(data_dir, "*.json"))
    
    # Filter to content files (not config files)
    content_files = [f for f in json_files if any(keyword in os.path.basename(f) 
                    for keyword in ['interviews', 'articles', 'reviews', 'professional', 'publications', 'background'])]
    
    if not content_files:
        print("No content JSON files found!")
        return
    
    print(f"Found {len(content_files)} content JSON files to process:")
    for file_path in content_files:
        print(f"  - {os.path.basename(file_path)}")
    
    print("\n" + "="*60)
    print("CLEANING JSON FILES - REMOVING subject.topics")
    print("="*60)
    
    all_stats = []
    
    for file_path in content_files:
        try:
            stats = clean_json_file(file_path)
            all_stats.append(stats)
            print()
        except Exception as e:
            print(f"❌ Error processing {file_path}: {e}")
            print()
    
    # Summary report
    print("="*60)
    print("CLEANUP SUMMARY")
    print("="*60)
    
    total_items = sum(s["items_processed"] for s in all_stats)
    total_removed = sum(s["topics_removed"] for s in all_stats)
    total_both = sum(s["entries_with_both"] for s in all_stats)
    total_only_topics = sum(s["entries_with_only_topics"] for s in all_stats)
    total_only_tags = sum(s["entries_with_only_tags"] for s in all_stats)
    
    print(f"Total items processed: {total_items}")
    print(f"Total subject.topics removed: {total_removed}")
    print(f"Entries with both tags and topics: {total_both}")
    print(f"Entries with only topics (no tags): {total_only_topics}")
    print(f"Entries with only tags (no topics): {total_only_tags}")
    
    if total_only_topics > 0:
        print(f"\n⚠ WARNING: {total_only_topics} entries had subject.topics but no tags!")
        print("  You may want to review these entries to ensure no data was lost.")
    
    print(f"\n✅ Cleanup complete! {total_removed} subject.topics fields removed.")
    print("🎯 The app now uses only the 'tags' field consistently.")

if __name__ == "__main__":
    main()
