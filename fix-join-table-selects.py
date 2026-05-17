#!/usr/bin/env python3
"""
Fix all Prisma select patterns on join tables
Replace select with include for join tables like DigitalBookTags, CategoryTags, etc.
"""

import os
import re

admin_routes_dir = '/home/sina/Documents/project/pishro/pishro/app/api/admin'

def fix_join_table_selects(filepath):
    """Fix select patterns on join tables"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Pattern: some_table: { select: { ... } } where some_table is a join table
    # Replace with: some_table: { include: { ... } }
    
    # Common join tables
    join_tables = ['relatedTags', 'tags', 'categories', 'category', 'categoryTags', 'courseTags', 'lessonTags', 'bookTags']
    
    for table_name in join_tables:
        # Pattern to match: tableName: { select: { ... } }
        # This regex finds select blocks and converts them to include
        pattern = rf"({table_name}:\s*{{\s*)select\s*:\s*{{\s*(?:id:\s*true,?\s*)?(?:slug:\s*true,?\s*)?(?:title:\s*true,?\s*)?(?:.*?)\s*}}\s*}}"
        
        # Replace select with include and simplify to just including the relation
        if table_name in content:
            # More targeted replacement
            content = re.sub(
                rf"({table_name}:\s*{{\s*)select\s*:\s*{{[^}}]*}}",
                rf"\1include: {{ tag: true }}",
                content
            )
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# Walk through all route.ts files
fixed_count = 0
for root, dirs, files in os.walk(admin_routes_dir):
    for file in files:
        if file == 'route.ts':
            filepath = os.path.join(root, file)
            if fix_join_table_selects(filepath):
                fixed_count += 1
                print(f"Fixed: {filepath}")

print(f"\nTotal files fixed: {fixed_count}")
