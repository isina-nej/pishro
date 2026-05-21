#!/usr/bin/env python3
"""
Fix all mismatched req/_req parameter issues in admin routes
Find functions where parameter is 'req' but calling 'getAdminAuth(_req)' (or vice versa)
"""

import os
import re

admin_routes_dir = '/home/sina/Documents/project/pishro/pishro/app/api/admin'

def fix_req_mismatch(filepath):
    """Fix req/_req mismatches"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Pattern 1: export async function GET/POST(_req or _request) but calling getAdminAuth(req)
    # Replace getAdminAuth(req) with getAdminAuth(_req) if function has _req parameter
    if '(_req:' in content or '(_request:' in content:
        # Replace getAdminAuth(req) with getAdminAuth(_req)
        content = re.sub(r'getAdminAuth\(req\)', 'getAdminAuth(_req)', content)
        content = re.sub(r'getAdminAuth\(request\)', 'getAdminAuth(_request)', content)
        content = re.sub(r'req\.json\(\)', '_req.json()', content)
    
    # Pattern 2: export async function with (req:) but calling getAdminAuth(_req)
    # Find all function definitions
    func_matches = list(re.finditer(r'export async function (GET|POST|PATCH|DELETE|PUT)\(([^)]*)\)', content))
    
    for match in func_matches:
        func_type = match.group(1)
        params = match.group(2)
        
        # Check if parameter contains 'req' or '_req'
        if 'req:' in params and '_req' in content[match.start():match.end() + 500]:
            # Has req parameter but uses _req somewhere near function
            content = re.sub(r'getAdminAuth\(_req\)', 'getAdminAuth(req)', content)
            content = re.sub(r'_req\.json\(\)', 'req.json()', content)
        elif '_req:' in params and 'getAdminAuth(req)' in content[match.start():match.end() + 500]:
            # Has _req parameter but uses getAdminAuth(req) near function
            content = re.sub(r'getAdminAuth\(req\)', 'getAdminAuth(_req)', content)
            content = re.sub(r'req\.json\(\)', '_req.json()', content)
    
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
            if fix_req_mismatch(filepath):
                fixed_count += 1
                print(f"Fixed: {filepath}")

print(f"\nTotal files fixed: {fixed_count}")
