#!/usr/bin/env python3
import os
import re

api_dir = "/home/sina/Documents/project/pishro/pishro/app/api/admin"

fixed_files = []
total_fixed = 0

for root, dirs, files in os.walk(api_dir):
    for file in files:
        if file.endswith('.ts'):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Find malformed patterns like "if (!adminAuth.role !== "
                if 'if (!adminAuth.role' in content:
                    original = content
                    # Fix: if (!adminAuth.role !== "X") → if (!adminAuth || adminAuth.role !== "X")
                    content = re.sub(r'if \(!adminAuth\.role !== ', 'if (!adminAuth || adminAuth.role !== ', content)
                    
                    if content != original:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(content)
                        fixed_files.append(filepath)
                        total_fixed += content.count('if (!adminAuth || adminAuth.role !== ') - original.count('if (!adminAuth || adminAuth.role !== ')
            except Exception as e:
                print(f"Error processing {filepath}: {e}")

print(f"\n✅ Fixed {len(fixed_files)} files")
print(f"Total fixes: {total_fixed}")
for f in fixed_files:
    print(f"  - {f.replace(api_dir, '.')}")
