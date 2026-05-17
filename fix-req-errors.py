#!/usr/bin/env python3
"""
Fix all getAdminAuth(req) calls where req is undefined due to parameter being _req
"""

import os
import re

admin_routes_dir = '/home/sina/Documents/project/pishro/pishro/app/api/admin'

def fix_req_errors(filepath):
    """Fix req/_ req parameter issues"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Find function signatures where parameter is _req, _request, _req, etc.
    # and replace getAdminAuth(req) with getAdminAuth(_req) or appropriate variant
    
    # Check if function has _req or _request parameter
    if '(_req:' in content or '(_request:' in content:
        # Replace getAdminAuth(req) with getAdminAuth(_req)
        content = re.sub(r'getAdminAuth\(req\)', 'getAdminAuth(_req)', content)
        
        # Replace getAdminAuth(request) with getAdminAuth(_request)
        content = re.sub(r'getAdminAuth\(request\)', 'getAdminAuth(_request)', content)
    
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
            if fix_req_errors(filepath):
                fixed_count += 1
                print(f"Fixed: {filepath}")

print(f"\nTotal files fixed: {fixed_count}")
