#!/usr/bin/env python3

import os
import json
import glob
import subprocess
from pathlib import Path

def main():
    print("🔍 Comprehensive Bloat and Dead Code Analysis")
    print("=" * 50)
    
    # 1. Analyze TypeScript syntax errors (dead code indicators)
    analyze_typescript_errors()
    
    # 2. Check for unused dependencies
    analyze_dependencies()
    
    # 3. Find dead files and temporary scripts
    find_dead_files()
    
    # 4. Check for duplicate routes
    analyze_duplicate_routes()
    
    # 5. Check for unused imports
    check_unused_imports()
    
    # 6. Analyze asset usage
    analyze_assets()
    
    # 7. Generate summary with recommendations
    generate_recommendations()

def analyze_typescript_errors():
    print("\n📘 TypeScript Error Analysis")
    print("-" * 30)
    
    # Files with syntax errors are likely problematic
    problematic_files = [
        "src/app/articles-dynamic/page.tsx",
        "src/app/interviews-dynamic/page.tsx"
    ]
    
    for file_path in problematic_files:
        if os.path.exists(file_path):
            print(f"⚠️  SYNTAX ERROR: {file_path}")
            with open(file_path, 'r') as f:
                lines = f.readlines()
                for i, line in enumerate(lines[50:60], 51):  # Check around error area
                    print(f"   {i:2}: {line.rstrip()}")
        else:
            print(f"✅ File not found: {file_path}")

def analyze_dependencies():
    print("\n📦 Dependency Analysis")
    print("-" * 30)
    
    with open('package.json', 'r') as f:
        package_data = json.load(f)
    
    deps = package_data.get('dependencies', {})
    print(f"Total dependencies: {len(deps)}")
    
    # Check for MDX usage
    mdx_deps = {k: v for k, v in deps.items() if 'mdx' in k.lower()}
    if mdx_deps:
        print("\n🔍 MDX Dependencies:")
        for dep, version in mdx_deps.items():
            print(f"   {dep}: {version}")
        
        # Check if actually used
        mdx_files = glob.glob("**/*.mdx", recursive=True)
        if not mdx_files:
            print("   ⚠️  No .mdx files found - MDX dependencies may be unused")
    
    # Check for duplicate markdown processors
    if 'marked' in deps and 'next-mdx-remote' in deps:
        print("\n⚠️  Potential duplication: Both 'marked' and 'next-mdx-remote' found")

def find_dead_files():
    print("\n🗃️  Dead Files Analysis")
    print("-" * 30)
    
    # Temporary development files
    temp_patterns = [
        "test_*.py",
        "analyze*.py", 
        "cleanup*.js",
        "*_test.js",
        "normalize*.py",
        "content-parser.py",
        "generate_json_data.py",
        "fix_remaining_links.py",
        "update_ids.py",
        "verify_ids.py",
        "convert_to_markdown.py"
    ]
    
    temp_files = []
    for pattern in temp_patterns:
        temp_files.extend(glob.glob(pattern))
    
    if temp_files:
        print("🧹 Temporary Development Files:")
        for file in temp_files:
            file_size = os.path.getsize(file) / 1024  # KB
            print(f"   {file} ({file_size:.1f} KB)")
    
    # Markdown files
    markdown_files = glob.glob("public/content/*.md")
    json_files = glob.glob("src/data/*.json")
    
    print(f"\n📄 Content Analysis:")
    print(f"   Markdown files: {len(markdown_files)}")
    print(f"   JSON data files: {len(json_files)}")
    
    if len(markdown_files) > 0 and len(json_files) > 0:
        print("   ⚠️  Both markdown and JSON data present - potential redundancy")

def analyze_duplicate_routes():
    print("\n🛣️  Route Duplication Analysis")
    print("-" * 30)
    
    # Find all page files
    page_files = glob.glob("src/app/**/page.tsx", recursive=True)
    
    # Group by base name
    route_groups = {
        'interviews': [],
        'articles': [],
        'portfolio': []
    }
    
    for page_file in page_files:
        route_path = page_file.replace('src/app/', '').replace('/page.tsx', '')
        for group in route_groups:
            if group in route_path:
                route_groups[group].append(route_path)
    
    for group, routes in route_groups.items():
        if len(routes) > 1:
            print(f"⚠️  {group.title()} duplicates: {', '.join(routes)}")

def check_unused_imports():
    print("\n🔍 Import Analysis")
    print("-" * 30)
    
    # Check specific known issue
    problematic_file = "src/components/ui/ProfessionalLists.tsx"
    if os.path.exists(problematic_file):
        with open(problematic_file, 'r') as f:
            content = f.read()
            
        # Check if useState is imported but not used
        if 'useState' in content:
            if content.count('useState(') == 0:
                print(f"⚠️  Unused import: useState in {problematic_file}")
            else:
                print(f"✅ useState properly used in {problematic_file}")

def analyze_assets():
    print("\n🖼️  Asset Analysis")
    print("-" * 30)
    
    # Count images
    if os.path.exists('public/images'):
        images = glob.glob('public/images/*')
        print(f"Total images: {len(images)}")
        
        # Check for naming inconsistencies
        underscore_files = [f for f in images if '_' in os.path.basename(f)]
        dash_files = [f for f in images if '-' in os.path.basename(f)]
        
        if underscore_files and dash_files:
            print(f"⚠️  Naming inconsistency: {len(underscore_files)} files with underscores, {len(dash_files)} with dashes")
    
    # Check PDFs
    if os.path.exists('public/pdf'):
        pdfs = glob.glob('public/pdf/*')
        print(f"PDF files: {len(pdfs)}")

def generate_recommendations():
    print("\n📋 CLEANUP RECOMMENDATIONS")
    print("=" * 50)
    
    print("\n🚨 HIGH PRIORITY:")
    print("   1. Fix TypeScript syntax errors in *-dynamic pages")
    print("   2. Remove unused development scripts")
    print("   3. Decide on markdown vs JSON data strategy")
    
    print("\n⚠️  MEDIUM PRIORITY:")
    print("   1. Consolidate duplicate routes")
    print("   2. Remove unused MDX dependencies if not needed")
    print("   3. Standardize image naming conventions")
    
    print("\n💡 LOW PRIORITY:")
    print("   1. Clean up build artifacts periodically")
    print("   2. Consider image optimization")
    print("   3. Add .gitignore entries for temp files")
    
    print("\n🧹 CLEANUP COMMANDS:")
    print("   # Remove development scripts:")
    print("   rm test_*.py analyze*.py cleanup*.js normalize*.py")
    print("   rm content-parser.py generate_json_data.py fix_remaining_links.py")
    print("   rm update_ids.py verify_ids.py convert_to_markdown.py")
    print("")
    print("   # Fix TypeScript errors:")
    print("   # Edit articles-dynamic and interviews-dynamic pages")
    print("")
    print("   # Consider removing unused dependencies:")
    print("   # npm uninstall @mdx-js/loader @mdx-js/react @next/mdx @types/mdx")

if __name__ == "__main__":
    main()
