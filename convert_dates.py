#!/usr/bin/env python3
"""
Convert publication dates to ISO format (YYYY-MM-DD) in all content files.
"""

import os
import re

def month_name_to_number(month_name):
    """Convert month name to number."""
    months = {
        'january': 1, 'february': 2, 'march': 3, 'april': 4,
        'may': 5, 'june': 6, 'july': 7, 'august': 8,
        'september': 9, 'october': 10, 'november': 11, 'december': 12
    }
    return months.get(month_name.lower())

def convert_date_to_iso(date_str):
    """Convert various date formats to ISO format (YYYY-MM-DD)."""
    if not date_str or date_str.lower() in ['null', '', 'none']:
        return None
        
    # Remove quotes and extra whitespace
    date_str = date_str.strip().strip('"\'')
    
    # Handle empty string after cleaning
    if not date_str:
        return None
    
    # Pattern 1: "Month DD, YYYY" (e.g., "November 18, 1995")
    pattern1 = r'^([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$'
    match = re.match(pattern1, date_str)
    if match:
        month_name, day, year = match.groups()
        month_num = month_name_to_number(month_name)
        if month_num:
            return f"{year}-{month_num:02d}-{int(day):02d}"
    
    # Pattern 2: "Month YYYY" (e.g., "December 2004")
    pattern2 = r'^([A-Za-z]+)\s+(\d{4})$'
    match = re.match(pattern2, date_str)
    if match:
        month_name, year = match.groups()
        month_num = month_name_to_number(month_name)
        if month_num:
            return f"{year}-{month_num:02d}-01"  # Default to 1st of month
    
    # Pattern 3: "Month DD" (e.g., "April 30")
    pattern3 = r'^([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?$'
    match = re.match(pattern3, date_str)
    if match:
        month_name, day = match.groups()
        month_num = month_name_to_number(month_name)
        if month_num:
            # Need to guess year - use a reasonable default or skip
            return None  # Skip incomplete dates for now
    
    # Pattern 4: "Month" only (e.g., "December", "January", "April")
    pattern4 = r'^([A-Za-z]+)$'
    match = re.match(pattern4, date_str)
    if match:
        month_name = match.group(1)
        month_num = month_name_to_number(month_name)
        if month_num:
            # Need year - skip for now
            return None
    
    # Pattern 5: "YYYY" only (e.g., "2017")
    pattern5 = r'^(\d{4})$'
    match = re.match(pattern5, date_str)
    if match:
        year = match.group(1)
        return f"{year}-01-01"  # Default to January 1st
    
    # Already in ISO format or close to it
    pattern6 = r'^(\d{4})-(\d{1,2})-(\d{1,2})$'
    match = re.match(pattern6, date_str)
    if match:
        year, month, day = match.groups()
        return f"{year}-{int(month):02d}-{int(day):02d}"
    
    print(f"Could not parse date: '{date_str}'")
    return None

def process_file(filepath):
    """Process a single markdown file to convert dates."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find publication date lines
        pattern = r'(\s+date:\s*)(.*)$'
        
        def replace_date(match):
            indent_and_key = match.group(1)
            original_date = match.group(2).strip()
            
            if not original_date or original_date.lower() in ['null', '']:
                return f"{indent_and_key}null"
            
            iso_date = convert_date_to_iso(original_date)
            if iso_date:
                return f"{indent_and_key}{iso_date}"
            else:
                print(f"Skipping date conversion in {filepath}: '{original_date}'")
                return match.group(0)  # Return unchanged
        
        # Replace dates
        new_content = re.sub(pattern, replace_date, content, flags=re.MULTILINE)
        
        # Only write if content changed
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated: {filepath}")
            return True
        
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False
    
    return False

def main():
    """Main function to process all content files."""
    content_dir = 'public/content'
    
    if not os.path.exists(content_dir):
        print(f"Content directory not found: {content_dir}")
        return
    
    updated_files = 0
    total_files = 0
    
    for filename in os.listdir(content_dir):
        if filename.endswith('.md'):
            filepath = os.path.join(content_dir, filename)
            total_files += 1
            
            if process_file(filepath):
                updated_files += 1
    
    print(f"\nProcessed {total_files} files, updated {updated_files} files")

if __name__ == '__main__':
    main()
