#!/usr/bin/env python3
"""
Remove all tagIds field assignments and references from admin routes
"""

import os
import re

admin_routes_dir = '/home/sina/Documents/project/pishro/pishro/app/api/admin'

def remove_tagids(filepath):
    """Remove all tagIds references"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Remove: tagIds = [],
    content = re.sub(r'tagIds\s*=\s*\[\]\s*[,;]?\s*\n', '', content)
    
    # Remove: tagIds = []
    content = re.sub(r'tagIds\s*=\s*\[\]\s*[,;]?', '', content)
    
    # Remove comma after tagIds: ,tagIds,  -> ,
    content = re.sub(r',\s*tagIds\s*,', ',', content)
    
    # Remove trailing comma from tagIds in object literals
    content = re.sub(r',\s*tagIds\s*([,\}])', r'\1', content)
    
    # Remove: if (body.tagIds !== undefined) updateData.tagIds = body.tagIds;
    content = re.sub(
        r'if\s*\(\s*body\.tagIds\s*!==\s*undefined\s*\)\s*updateData\.tagIds\s*=\s*body\.tagIds;\n',
        '',
        content
    )
    
    # Remove: tagIds: validTagIds,
    content = re.sub(r'tagIds:\s*validTagIds,?\n', '', content)
    
    # Remove: tagIds (from destructuring and parameters)
    content = re.sub(r'\n\s*tagIds', '', content)
    
    # Remove comments about tagIds
    content = re.sub(r'//.*tagIds.*\n', '', content)
    
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
            if remove_tagids(filepath):
                fixed_count += 1
                print(f"Fixed: {filepath}")

print(f"\nTotal files fixed: {fixed_count}")
