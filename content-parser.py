#!/usr/bin/env python3
"""
Sample Content Parser for Northworks Schema
This script demonstrates how to parse existing markdown files and extract data
according to the comprehensive content schema.
"""

import os
import re
import json
from datetime import datetime
from typing import Dict, List, Optional, Any
import glob

class NorthworksContentParser:
    """Parser for extracting structured data from Northworks content files"""
    
    def __init__(self, content_dir: str):
        self.content_dir = content_dir
        self.schema_data = []
        
    def parse_all_content(self) -> List[Dict[str, Any]]:
        """Parse all markdown files in the content directory"""
        
        md_files = glob.glob(os.path.join(self.content_dir, "*.md"))
        
        for file_path in md_files:
            try:
                content_data = self.parse_file(file_path)
                if content_data:
                    self.schema_data.append(content_data)
                    print(f"Parsed: {os.path.basename(file_path)}")
            except Exception as e:
                print(f"Error parsing {file_path}: {e}")
                
        return self.schema_data
    
    def parse_file(self, file_path: str) -> Optional[Dict[str, Any]]:
        """Parse a single markdown file according to the schema"""
        
        filename = os.path.basename(file_path)
        file_id = os.path.splitext(filename)[0]
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Initialize schema structure
        schema_data = {
            "metadata": {
                "id": file_id,
                "type": self._determine_type(filename),
                "category": self._determine_category(filename)
            },
            "content": {
                "title": self._extract_title(content),
                "body": content
            },
            "legacy": {
                "originalFile": filename,
                "comments": self._extract_html_comments(content)
            }
        }
        
        # Add optional sections based on content type
        if pub_info := self._extract_publication_info(content):
            schema_data["publication"] = pub_info
            
        if subject_info := self._extract_subject_info(content, filename):
            schema_data["subject"] = subject_info
            
        if performance_info := self._extract_performance_info(content):
            schema_data["performance"] = performance_info
            
        if technical_info := self._extract_technical_info(content, filename):
            schema_data["technical"] = technical_info
            
        if media_info := self._extract_media_info(content):
            schema_data["media"] = media_info
            
        # Add tags based on content analysis
        schema_data["tags"] = self._generate_tags(content, filename)
        
        return schema_data
    
    def _determine_type(self, filename: str) -> str:
        """Determine content type from filename"""
        if filename.startswith("c_reviews"):
            return "review"
        elif filename.startswith("c_art_"):
            return "article"
        elif filename.startswith("c_") and filename not in ["c_main.md", "c_interviews.md", "c_reviews.md"]:
            return "interview"
        elif filename.startswith("w_projects"):
            return "project" 
        elif filename.startswith("w_pub"):
            return "publication"
        elif filename.startswith("w_"):
            return "biography"
        elif filename in ["c_interviews.md", "c_reviews.md"]:
            return "index"
        else:
            return "technical"
    
    def _determine_category(self, filename: str) -> str:
        """Determine content category from filename"""
        if filename.startswith("c_"):
            return "classical-music"
        elif filename.startswith("w_"):
            return "risk-analysis" if filename != "w_main.md" else "professional"
        else:
            return "navigation"
    
    def _extract_title(self, content: str) -> str:
        """Extract title from content"""
        # Look for h3 tags first
        h3_match = re.search(r'<h3[^>]*>([^<]+)</h3>', content, re.IGNORECASE)
        if h3_match:
            return h3_match.group(1).strip()
            
        # Look for bold titles
        bold_title = re.search(r'<b>([^<]+)</b>', content, re.IGNORECASE)
        if bold_title:
            title = bold_title.group(1).strip()
            # Clean up common patterns
            if not any(word in title.lower() for word in ['performance', 'interview', 'review']):
                return title
                
        # Look for img title attributes
        img_title = re.search(r'<img[^>]+title_([^.]+)\\.gif', content, re.IGNORECASE)
        if img_title:
            return img_title.group(1).replace('_', ' ').title()
            
        return "Untitled"
    
    def _extract_publication_info(self, content: str) -> Optional[Dict[str, Any]]:
        """Extract publication information"""
        pub_info = {}
        
        # Extract publication date and source
        pub_patterns = [
            r'published[^,]*?(\w+ \d{1,2}, \d{4})',  # "published February 22, 2010"
            r'(\w+ \d{1,2}, \d{4})[^.]*published',   # "February 22, 2010 in papers"
            r'published[^,]*?(\d{4})',               # "published 1999"
            r'Column[^-]*-\s*(\w+ \d{1,2}, \d{4})',  # "Column - August 10, 2007"
        ]
        
        for pattern in pub_patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                date_str = match.group(1)
                try:
                    # Try to parse the date
                    parsed_date = self._parse_date(date_str)
                    if parsed_date:
                        pub_info["date"] = parsed_date
                        break
                except Exception:
                    continue
        
        # Extract publisher
        publishers = [
            r'(Bay Area News Group)',
            r'(Oakland Tribune)',
            r'(ANG Newspapers)',
            r'(Inside Bay Area)',
            r'(Contra Costa Times)',
            r'(Alameda Newspaper Group)',
            r'(San Mateo County Times)'
        ]
        
        for pub_pattern in publishers:
            match = re.search(pub_pattern, content, re.IGNORECASE)
            if match:
                pub_info["publisher"] = match.group(1)
                break
        
        # Extract headline if different from title
        headline_match = re.search(r'under headline[^,]*[",]([^"]+)[",]', content, re.IGNORECASE)
        if headline_match:
            pub_info["headline"] = headline_match.group(1).strip()
            
        return pub_info if pub_info else None
    
    def _extract_subject_info(self, content: str, filename: str) -> Optional[Dict[str, Any]]:
        """Extract subject information for interviews/reviews"""
        if not filename.startswith("c_"):
            return None
            
        subject_info = {}
        
        # Extract person names (basic pattern matching)
        # This would need more sophisticated NLP for production use
        # names = []  # TODO: Implement name extraction
        
        # Common organizations
        orgs = []
        org_patterns = [
            r'(San Francisco (?:Symphony|Opera))',
            r'(Oakland East Bay Symphony)',
            r'(Berkeley Opera)',
            r'(Philharmonia)',
            r'(Metropolitan Opera)'
        ]
        
        for pattern in org_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            orgs.extend([match for match in matches if match not in orgs])
        
        # Common venues
        venues = []
        venue_patterns = [
            r'(Davies Symphony Hall)',
            r'(War Memorial Opera House)',
            r'(Carnegie Hall)',
            r'(Barbican Hall)'
        ]
        
        for pattern in venue_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            venues.extend([match for match in matches if match not in venues])
        
        if orgs:
            subject_info["organizations"] = orgs
        if venues:
            subject_info["venues"] = venues
            
        return subject_info if subject_info else None
    
    def _extract_performance_info(self, content: str) -> Optional[Dict[str, Any]]:
        """Extract performance details from reviews"""
        performance_info = {}
        
        # Extract performance date
        perf_date_patterns = [
            r'performance of (\w+ \d{1,2}, \d{4})',
            r'(\w+ \d{1,2}, \d{4}) performance',
            r'evening of (\w+ \d{1,2}, \d{4})'
        ]
        
        for pattern in perf_date_patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                parsed_date = self._parse_date(match.group(1))
                if parsed_date:
                    performance_info["date"] = parsed_date
                    break
        
        # Extract conductor
        conductor_match = re.search(r'conductor[^,]*?([A-Z][a-z]+ [A-Z][a-z]+)', content, re.IGNORECASE)
        if conductor_match:
            performance_info["conductor"] = conductor_match.group(1)
            
        return performance_info if performance_info else None
    
    def _extract_technical_info(self, content: str, filename: str) -> Optional[Dict[str, Any]]:
        """Extract technical/professional information"""
        if not filename.startswith("w_"):
            return None
            
        technical_info = {}
        
        # Determine project type
        if "government" in filename or any(org in content.upper() for org in ["EPA", "DOE", "NRC", "NASA"]):
            technical_info["projectType"] = "government-consulting"
        elif "stanford" in filename.lower() or "Stanford" in content:
            technical_info["projectType"] = "academic-research"
        elif "pub" in filename:
            technical_info["projectType"] = "publication"
        
        # Extract client organizations
        clients = []
        client_patterns = [
            r'\\b(EPA)\\b',
            r'\\b(DOE)\\b', 
            r'\\b(NRC)\\b',
            r'\\b(NASA)\\b',
            r'(Stanford University)',
            r'(National Research Council)'
        ]
        
        for pattern in client_patterns:
            matches = re.findall(pattern, content)
            clients.extend([match for match in matches if match not in clients])
            
        if clients:
            technical_info["client"] = clients[0]  # Primary client
            
        # Extract keywords
        keywords = []
        keyword_patterns = [
            r'(risk assessment)',
            r'(decision analysis)', 
            r'(nuclear waste)',
            r'(environmental protection)',
            r'(laser technology)'
        ]
        
        for pattern in keyword_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                keywords.append(pattern.strip('()'))
                
        if keywords:
            technical_info["keywords"] = keywords
            
        return technical_info if technical_info else None
    
    def _extract_media_info(self, content: str) -> Optional[Dict[str, Any]]:
        """Extract media references"""
        media_info = {}
        
        # Extract images
        images = []
        img_pattern = r'<img[^>]+src=["\']([^"\']+)["\'][^>]*(?:width=["\'](\d+)["\'])?[^>]*(?:height=["\'](\d+)["\'])?[^>]*>'
        
        for match in re.finditer(img_pattern, content, re.IGNORECASE):
            img_data = {
                "url": match.group(1),
                "width": int(match.group(2)) if match.group(2) else None,
                "height": int(match.group(3)) if match.group(3) else None
            }
            images.append(img_data)
        
        if images:
            media_info["images"] = images
            
        # Extract PDF documents
        documents = []
        pdf_pattern = r'<a[^>]+href=["\']([^"\']+\\.pdf)["\'][^>]*>([^<]+)</a>'
        
        for match in re.finditer(pdf_pattern, content, re.IGNORECASE):
            doc_data = {
                "url": match.group(1),
                "title": match.group(2).strip()
            }
            documents.append(doc_data)
            
        if documents:
            media_info["documents"] = documents
            
        return media_info if media_info else None
    
    def _extract_html_comments(self, content: str) -> List[str]:
        """Extract HTML comments for legacy preservation"""
        comment_pattern = r'<!--([^>]+)-->'
        comments = re.findall(comment_pattern, content)
        return [comment.strip() for comment in comments]
    
    def _generate_tags(self, content: str, filename: str) -> List[str]:
        """Generate content tags based on analysis"""
        tags = []
        
        # Add category-based tags
        if filename.startswith("c_"):
            tags.append("classical-music")
            if "opera" in content.lower():
                tags.append("opera")
            if "symphony" in content.lower():
                tags.append("symphony")
            if "piano" in content.lower():
                tags.append("piano")
                
        elif filename.startswith("w_"):
            tags.append("risk-analysis")
            if "nuclear" in content.lower():
                tags.append("nuclear")
            if "environment" in content.lower():
                tags.append("environmental")
                
        # Add instrument tags
        instruments = ["piano", "violin", "guitar", "opera", "voice"]
        for instrument in instruments:
            if instrument in content.lower():
                tags.append(instrument)
                
        return tags
    
    def _parse_date(self, date_str: str) -> Optional[str]:
        """Parse date string to ISO format"""
        try:
            # Handle common date formats
            date_patterns = [
                ("%B %d, %Y", r"\\w+ \\d{1,2}, \\d{4}"),  # "February 22, 2010"
                ("%b %d, %Y", r"\\w+ \\d{1,2}, \\d{4}"),   # "Feb 22, 2010"
                ("%Y", r"\\d{4}")                          # "2010"
            ]
            
            for fmt, pattern in date_patterns:
                if re.match(pattern, date_str):
                    try:
                        parsed = datetime.strptime(date_str, fmt)
                        return parsed.strftime("%Y-%m-%d")
                    except ValueError:
                        continue
                        
        except Exception:
            pass
            
        return None
    
    def save_schema_data(self, output_file: str):
        """Save parsed data to JSON file"""
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.schema_data, f, indent=2, ensure_ascii=False)
        print(f"Schema data saved to {output_file}")
        
    def generate_stats(self) -> Dict[str, Any]:
        """Generate statistics about the parsed content"""
        stats = {
            "total_files": len(self.schema_data),
            "by_type": {},
            "by_category": {},
            "with_publication_info": 0,
            "with_media": 0,
            "date_range": {"earliest": None, "latest": None}
        }
        
        dates = []
        
        for item in self.schema_data:
            # Count by type
            item_type = item["metadata"]["type"]
            stats["by_type"][item_type] = stats["by_type"].get(item_type, 0) + 1
            
            # Count by category  
            category = item["metadata"]["category"]
            stats["by_category"][category] = stats["by_category"].get(category, 0) + 1
            
            # Count items with publication info
            if "publication" in item:
                stats["with_publication_info"] += 1
                if "date" in item["publication"]:
                    dates.append(item["publication"]["date"])
                    
            # Count items with media
            if "media" in item:
                stats["with_media"] += 1
        
        # Calculate date range
        if dates:
            dates.sort()
            stats["date_range"]["earliest"] = dates[0]
            stats["date_range"]["latest"] = dates[-1]
            
        return stats

def main():
    """Main execution function"""
    content_dir = "/Users/todddunning/Desktop/Northworks/northworks/public/content"
    
    if not os.path.exists(content_dir):
        print(f"Content directory not found: {content_dir}")
        return
    
    print("Starting Northworks content parsing...")
    parser = NorthworksContentParser(content_dir)
    
    # Parse all content
    parser.parse_all_content()
    
    # Generate statistics
    stats = parser.generate_stats()
    print("\\n--- Content Analysis Statistics ---")
    print(f"Total files processed: {stats['total_files']}")
    print(f"Files with publication info: {stats['with_publication_info']}")
    print(f"Files with media: {stats['with_media']}")
    
    print("\\nBy Type:")
    for content_type, count in stats['by_type'].items():
        print(f"  {content_type}: {count}")
        
    print("\\nBy Category:")
    for category, count in stats['by_category'].items():
        print(f"  {category}: {count}")
        
    if stats['date_range']['earliest']:
        print(f"\\nDate range: {stats['date_range']['earliest']} to {stats['date_range']['latest']}")
    
    # Save parsed data
    output_file = "northworks-content-schema.json"
    parser.save_schema_data(output_file)
    
    print(f"\\nParsing complete! Check {output_file} for full schema data.")

if __name__ == "__main__":
    main()
