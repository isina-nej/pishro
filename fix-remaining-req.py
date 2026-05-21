#!/usr/bin/env python3
import os
import re

api_dir = "/home/sina/Documents/project/pishro/pishro/app/api/admin"

# Pattern to find: GET/POST/PUT/DELETE with _req parameter but calling getAdminAuth(req)
pattern = r'(export async function (?:GET|POST|PUT|DELETE|PATCH)\(_?req: NextRequest\) \{[^}]*?\n\s+try \{\s*\n\s+const adminAuth = await getAdminAuth\()(req)(\);)'

fixed_files = []
total_fixed = 0

for root, dirs, files in os.walk(api_dir):
    for file in files:
        if file.endswith('.ts'):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Find all occurrences of getAdminAuth(req) in this file
                if 'getAdminAuth(req)' in content:
                    lines = content.split('\n')
                    fixed_in_file = False
                    
                    for i, line in enumerate(lines):
                        if 'getAdminAuth(req)' in line and i > 0:
                            # Check if this function uses _req parameter
                            for j in range(max(0, i-10), i):
                                if '_req: NextRequest' in lines[j]:
                                    # Fix this line
                                    lines[i] = line.replace('getAdminAuth(req)', 'getAdminAuth(_req)')
                                    fixed_in_file = True
                                    total_fixed += 1
                                    break
                    
                    if fixed_in_file:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write('\n'.join(lines))
                        fixed_files.append(filepath)
            except Exception as e:
                print(f"Error processing {filepath}: {e}")

print(f"\n✅ Fixed {len(fixed_files)} files")
print(f"Total fixes: {total_fixed}")
for f in fixed_files:
    print(f"  - {f.replace(api_dir, '.')}")
