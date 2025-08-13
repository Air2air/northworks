#!/usr/bin/env python3
"""
Convert legacy HTML content files to clean Markdown format
Removes all HTML table structures, inline styles, and navigation elements
while preserving the actual content.
"""

import os
import re
import html
from pathlib import Path
from typing import Dict, List, Optional
import yaml

class HTMLToMarkdownConverter:
    def __init__(self, content_dir: str):
        self.content_dir = Path(content_dir)
        self.processed_files = []
        self.skipped_files = []
        
    def convert_all_files(self):
        """Convert all markdown files in the content directory"""
        
        print(f"Converting HTML to Markdown in: {self.content_dir}")
        
        # Find all .md files
        md_files = list(self.content_dir.glob("*.md"))
        print(f"Found {len(md_files)} markdown files to process")
        
        for file_path in md_files:
            try:
                self.convert_file(file_path)
                self.processed_files.append(file_path.name)
                print(f"✓ Converted: {file_path.name}")
            except Exception as e:
                self.skipped_files.append((file_path.name, str(e)))
                print(f"✗ Error converting {file_path.name}: {e}")
        
        # Print summary
        print("\n=== CONVERSION SUMMARY ===")
        print(f"Successfully converted: {len(self.processed_files)} files")
        print(f"Skipped due to errors: {len(self.skipped_files)} files")
        
        if self.skipped_files:
            print("\nSkipped files:")
            for filename, error in self.skipped_files:
                print(f"  - {filename}: {error}")
    
    def convert_file(self, file_path: Path):
        """Convert a single file from HTML to Markdown"""
        
        # Read original content
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        # Extract metadata and convert content
        frontmatter = self.extract_frontmatter(content, file_path.stem)
        markdown_content = self.convert_html_to_markdown(content)
        
        # Create new content with YAML frontmatter
        new_content = self.create_markdown_file(frontmatter, markdown_content)
        
        # Write back to file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
    
    def extract_frontmatter(self, content: str, file_id: str) -> Dict:
        """Extract metadata from content and create YAML frontmatter"""
        
        frontmatter = {
            'id': file_id,
            'title': self.extract_title(content),
            'type': self.determine_content_type(file_id),
            'converted_from_html': True,
            'conversion_date': '2025-08-13'
        }
        
        # Extract publication info if present
        if pub_info := self.extract_publication_info(content):
            frontmatter['publication'] = pub_info
        
        # Extract images
        if images := self.extract_image_references(content):
            frontmatter['images'] = images
        
        # Extract people/subjects mentioned
        if subjects := self.extract_subjects(content):
            frontmatter['subjects'] = subjects
        
        return frontmatter
    
    def extract_title(self, content: str) -> str:
        """Extract the main title from content"""
        
        # Look for h1, h2, h3 tags
        title_patterns = [
            r'<h[123][^>]*>(.*?)</h[123]>',
            r'<title>(.*?)</title>',
            r'<b><font[^>]*>(.*?)</font></b>',
            r'<center><b>(.*?)</b></center>'
        ]
        
        for pattern in title_patterns:
            match = re.search(pattern, content, re.IGNORECASE | re.DOTALL)
            if match:
                title = self.clean_text(match.group(1))
                if len(title) > 5 and len(title) < 200:  # Reasonable title length
                    return title
        
        return "Untitled"
    
    def extract_publication_info(self, content: str) -> Optional[Dict]:
        """Extract publication information"""
        
        pub_info = {}
        
        # Look for date patterns
        date_patterns = [
            r'(\d{1,2}[-/]\d{1,2}[-/]\d{4})',
            r'(\d{4}[-/]\d{1,2}[-/]\d{1,2})',
            r'(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}',
            r'(\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})'
        ]
        
        for pattern in date_patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                pub_info['date'] = match.group(1)
                break
        
        # Look for publisher/source
        publisher_patterns = [
            r'(San Francisco Chronicle|San Jose Mercury News|Oakland Tribune|Contra Costa Times|San Mateo County Times)',
            r'By\s+([A-Z][a-z]+\s+[A-Z][a-z]+)',
            r'Copyright.*?(\d{4})',
        ]
        
        for pattern in publisher_patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                if 'publisher' not in pub_info:
                    pub_info['publisher'] = match.group(1)
                elif 'author' not in pub_info and 'By' in pattern:
                    pub_info['author'] = match.group(1)
        
        return pub_info if pub_info else None
    
    def extract_image_references(self, content: str) -> List[Dict]:
        """Extract image references from content"""
        
        images = []
        img_pattern = r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>'
        
        for match in re.finditer(img_pattern, content, re.IGNORECASE):
            img_tag = match.group(0)
            src = match.group(1)
            
            # Skip button/navigation images
            if any(skip in src.lower() for skip in ['btn_', 'button', 'nav_', 'arrow']):
                continue
            
            image_info = {'src': src}
            
            # Extract alt text
            alt_match = re.search(r'alt=["\']([^"\']+)["\']', img_tag, re.IGNORECASE)
            if alt_match:
                image_info['alt'] = alt_match.group(1)
            
            # Extract dimensions
            width_match = re.search(r'width=["\']?(\d+)["\']?', img_tag, re.IGNORECASE)
            height_match = re.search(r'height=["\']?(\d+)["\']?', img_tag, re.IGNORECASE)
            
            if width_match:
                image_info['width'] = int(width_match.group(1))
            if height_match:
                image_info['height'] = int(height_match.group(1))
            
            images.append(image_info)
        
        return images
    
    def extract_subjects(self, content: str) -> List[str]:
        """Extract people and organizations mentioned"""
        
        subjects = []
        
        # Common classical music terms and names
        classical_terms = [
            r'\b([A-Z][a-z]+\s+[A-Z][a-z]+)\b(?=\s+(?:conducts?|performs?|sings?|plays?))',
            r'\b(San Francisco (?:Symphony|Opera|Ballet))\b',
            r'\b(Berkeley (?:Symphony|Opera))\b',
            r'\b(Oakland (?:Symphony|Ballet))\b',
            r'\b(Davies Symphony Hall|War Memorial Opera House|Zellerbach Hall)\b'
        ]
        
        content_text = self.strip_html_tags(content)
        
        for pattern in classical_terms:
            matches = re.finditer(pattern, content_text, re.IGNORECASE)
            for match in matches:
                subject = match.group(1).strip()
                if subject and len(subject) > 3 and subject not in subjects:
                    subjects.append(subject)
        
        return subjects[:10]  # Limit to first 10 found
    
    def determine_content_type(self, file_id: str) -> str:
        """Determine content type from filename"""
        
        if file_id.startswith('c_interview'):
            return 'interview'
        elif file_id.startswith('c_review'):
            return 'review'
        elif file_id.startswith('c_art'):
            return 'article'
        elif 'background' in file_id or 'bio' in file_id:
            return 'biography'
        else:
            return 'article'
    
    def convert_html_to_markdown(self, content: str) -> str:
        """Convert HTML content to clean Markdown"""
        
        # Remove HTML comments
        content = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)
        
        # Remove script and style tags completely
        content = re.sub(r'<script.*?</script>', '', content, flags=re.DOTALL | re.IGNORECASE)
        content = re.sub(r'<style.*?</style>', '', content, flags=re.DOTALL | re.IGNORECASE)
        
        # Remove table structure tags but preserve content
        content = re.sub(r'</?table[^>]*>', '', content, flags=re.IGNORECASE)
        content = re.sub(r'</?tbody[^>]*>', '', content, flags=re.IGNORECASE)
        content = re.sub(r'</?thead[^>]*>', '', content, flags=re.IGNORECASE)
        content = re.sub(r'</?tr[^>]*>', '\n', content, flags=re.IGNORECASE)
        content = re.sub(r'</?td[^>]*>', ' ', content, flags=re.IGNORECASE)
        content = re.sub(r'</?th[^>]*>', ' ', content, flags=re.IGNORECASE)
        
        # Remove navigation and UI elements
        content = re.sub(r'<img[^>]+btn_[^>]*>', '', content, flags=re.IGNORECASE)
        content = re.sub(r'<img[^>]+(?:button|nav_|arrow)[^>]*>', '', content, flags=re.IGNORECASE)
        
        # Remove div containers but preserve content
        content = re.sub(r'</?div[^>]*>', '\n', content, flags=re.IGNORECASE)
        content = re.sub(r'</?span[^>]*>', '', content, flags=re.IGNORECASE)
        
        # Convert headings to Markdown
        content = re.sub(r'<h1[^>]*>(.*?)</h1>', r'\n# \1\n', content, flags=re.IGNORECASE | re.DOTALL)
        content = re.sub(r'<h2[^>]*>(.*?)</h2>', r'\n## \1\n', content, flags=re.IGNORECASE | re.DOTALL)
        content = re.sub(r'<h3[^>]*>(.*?)</h3>', r'\n### \1\n', content, flags=re.IGNORECASE | re.DOTALL)
        content = re.sub(r'<h4[^>]*>(.*?)</h4>', r'\n#### \1\n', content, flags=re.IGNORECASE | re.DOTALL)
        
        # Convert text formatting
        content = re.sub(r'<b[^>]*>(.*?)</b>', r'**\1**', content, flags=re.IGNORECASE | re.DOTALL)
        content = re.sub(r'<strong[^>]*>(.*?)</strong>', r'**\1**', content, flags=re.IGNORECASE | re.DOTALL)
        content = re.sub(r'<i[^>]*>(.*?)</i>', r'*\1*', content, flags=re.IGNORECASE | re.DOTALL)
        content = re.sub(r'<em[^>]*>(.*?)</em>', r'*\1*', content, flags=re.IGNORECASE | re.DOTALL)
        content = re.sub(r'<u[^>]*>(.*?)</u>', r'_\1_', content, flags=re.IGNORECASE | re.DOTALL)
        
        # Convert links
        content = re.sub(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', r'[\2](\1)', content, flags=re.IGNORECASE | re.DOTALL)
        
        # Convert paragraphs
        content = re.sub(r'<p[^>]*>', '\n\n', content, flags=re.IGNORECASE)
        content = re.sub(r'</p>', '', content, flags=re.IGNORECASE)
        
        # Convert line breaks
        content = re.sub(r'<br[^>]*>', '\n', content, flags=re.IGNORECASE)
        
        # Convert lists
        content = re.sub(r'<ul[^>]*>', '\n', content, flags=re.IGNORECASE)
        content = re.sub(r'</ul>', '\n', content, flags=re.IGNORECASE)
        content = re.sub(r'<ol[^>]*>', '\n', content, flags=re.IGNORECASE)
        content = re.sub(r'</ol>', '\n', content, flags=re.IGNORECASE)
        content = re.sub(r'<li[^>]*>(.*?)</li>', r'- \1\n', content, flags=re.IGNORECASE | re.DOTALL)
        
        # Convert images to Markdown syntax (preserve meaningful images)
        def convert_image(match):
            img_tag = match.group(0)
            src_match = re.search(r'src=["\']([^"\']+)["\']', img_tag, re.IGNORECASE)
            alt_match = re.search(r'alt=["\']([^"\']+)["\']', img_tag, re.IGNORECASE)
            
            if not src_match:
                return ''
            
            src = src_match.group(1)
            
            # Skip button/navigation images
            if any(skip in src.lower() for skip in ['btn_', 'button', 'nav_', 'arrow']):
                return ''
            
            alt = alt_match.group(1) if alt_match else ''
            return f'\n![{alt}]({src})\n'
        
        content = re.sub(r'<img[^>]+>', convert_image, content, flags=re.IGNORECASE)
        
        # Remove remaining HTML tags
        content = re.sub(r'<[^>]+>', '', content)
        
        # Decode HTML entities
        content = html.unescape(content)
        
        # Clean up whitespace
        content = re.sub(r'\n\s*\n\s*\n+', '\n\n', content)  # Multiple empty lines to double
        content = re.sub(r'[ \t]+', ' ', content)  # Multiple spaces to single
        content = re.sub(r'[ \t]*\n', '\n', content)  # Remove trailing spaces
        
        # Remove leading/trailing whitespace
        content = content.strip()
        
        return content
    
    def strip_html_tags(self, content: str) -> str:
        """Strip all HTML tags and return plain text"""
        return re.sub(r'<[^>]+>', '', content)
    
    def clean_text(self, text: str) -> str:
        """Clean text by removing extra whitespace and HTML entities"""
        text = html.unescape(text)
        text = re.sub(r'\s+', ' ', text)
        return text.strip()
    
    def create_markdown_file(self, frontmatter: Dict, content: str) -> str:
        """Create the final Markdown file with YAML frontmatter"""
        
        # Create YAML frontmatter
        yaml_content = yaml.dump(frontmatter, default_flow_style=False, allow_unicode=True)
        
        # Combine frontmatter and content
        return f"---\n{yaml_content}---\n\n{content}"


def main():
    """Main function to run the conversion"""
    
    content_dir = "/Users/todddunning/Desktop/Northworks/northworks/public/content"
    
    if not os.path.exists(content_dir):
        print(f"Error: Content directory not found: {content_dir}")
        return
    
    print("=== HTML to Markdown Converter ===")
    print("Converting legacy HTML content to clean Markdown format...")
    print("This will:")
    print("- Remove all HTML table structures")
    print("- Convert HTML formatting to Markdown")
    print("- Extract metadata into YAML frontmatter")
    print("- Preserve images and content")
    print("- Remove navigation elements")
    
    converter = HTMLToMarkdownConverter(content_dir)
    converter.convert_all_files()
    
    print("\n=== Conversion Complete ===")
    print("All files have been converted to clean Markdown format!")


if __name__ == "__main__":
    main()
