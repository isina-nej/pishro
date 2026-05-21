#!/usr/bin/env python3
"""
Fix all Prisma join table select patterns
Replace select { id, slug, title } with include { tag: true } for join tables
"""

import os
import re

admin_routes_dir = '/home/sina/Documents/project/pishro/pishro/app/api/admin'

def fix_join_table_patterns(filepath):
    """Fix select patterns that don't work on join tables"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Pattern 1: tags: { select: { id: true, slug: true, title: true } }
    # Replace with: tags: { include: { tag: true } }
    content = re.sub(
        r"tags:\s*{\s*select:\s*{[^}]*(?:id|slug|title)[^}]*}\s*}",
        "tags: { include: { tag: true } }",
        content
    )
    
    # Pattern 2: relatedTags: { select: { id: true, slug: true, title: true } }
    # Replace with: relatedTags: { include: { tag: true } }
    content = re.sub(
        r"relatedTags:\s*{\s*select:\s*{[^}]*(?:id|slug|title)[^}]*}\s*}",
        "relatedTags: { include: { tag: true } }",
        content
    )
    
    # Pattern 3: categories: { select: { ... } }
    # Replace with: categories: { include: { category: true } }
    content = re.sub(
        r"categories:\s*{\s*select:\s*{[^}]*(?:id|title)[^}]*}\s*}",
        "categories: { include: { category: true } }",
        content
    )
    
    # Pattern 4: courses: { select: { ... } }
    # Replace with: courses: { include: { course: true } }
    content = re.sub(
        r"courses:\s*{\s*select:\s*{[^}]*(?:id|title|slug)[^}]*}\s*}",
        "courses: { include: { course: true } }",
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
            if fix_join_table_patterns(filepath):
                fixed_count += 1
                print(f"Fixed: {filepath}")

print(f"\nTotal files fixed: {fixed_count}")
