#!/usr/bin/env python3
"""
Fix all remaining session references in admin routes
Replaces session checks with adminAuth checks
"""

import os
import re

admin_routes_dir = '/home/sina/Documents/project/pishro/pishro/app/api/admin'

def fix_session_refs(filepath):
    """Fix session references in a single file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Remove unused auth import
    content = re.sub(
        r"import\s+{\s*auth\s*}\s+from\s+['\"]@/auth['\"];?\n",
        "",
        content
    )
    
    # Fix: if (!session?.user) → if (!adminAuth)
    content = re.sub(
        r"if\s*\(\s*!session\?\s*\.\s*user\s*\)\s*{",
        "if (!adminAuth) {",
        content
    )
    
    # Fix: if (session?.user) → if (adminAuth)
    content = re.sub(
        r"if\s*\(\s*session\?\s*\.\s*user\s*\)\s*{",
        "if (adminAuth) {",
        content
    )
    
    # Fix: if (!session?.user?.role) and role !== 'ADMIN'
    # This regex finds the pattern and replaces both checks with single adminAuth check
    content = re.sub(
        r"if\s*\(\s*!session\?\s*\.\s*user\)\s*{[^}]*return\s+errorResponse\([^)]*\);?\s*\}\s*if\s*\(\s*session\?\s*\.\s*user\s*\.\s*role\s*!==\s*['\"]ADMIN['\"]\)\s*{",
        "if (!adminAuth) {",
        content,
        flags=re.DOTALL
    )
    
    # Fix: session.user.id → userId or adminAuth.id
    content = re.sub(
        r"session\?\s*\.\s*user\s*\?\s*\.\s*id",
        "adminAuth?.id",
        content
    )
    
    content = re.sub(
        r"session\.\s*user\s*\.\s*id",
        "adminAuth.id",
        content
    )
    
    # Fix: session?.user?.role → adminAuth?.role
    content = re.sub(
        r"session\?\s*\.\s*user\s*\?\s*\.\s*role",
        "adminAuth?.role",
        content
    )
    
    # Fix: session.user.role → adminAuth.role
    content = re.sub(
        r"session\.\s*user\s*\.\s*role",
        "adminAuth.role",
        content
    )
    
    # Fix: session?.user?.phone → adminAuth?.phone (if it exists)
    content = re.sub(
        r"session\?\s*\.\s*user\s*\?\s*\.\s*phone",
        "adminAuth?.phone",
        content
    )
    
    # Fix: session.user.phone → adminAuth.phone
    content = re.sub(
        r"session\.\s*user\s*\.\s*phone",
        "adminAuth.phone",
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
            if fix_session_refs(filepath):
                fixed_count += 1
                print(f"Fixed: {filepath}")

print(f"\nTotal files fixed: {fixed_count}")
