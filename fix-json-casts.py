#!/usr/bin/env python3
import os
import re

api_dir = "/home/sina/Documents/project/pishro/pishro/app/api/comments"

fixed_files = []
total_fixed = 0

for root, dirs, files in os.walk(api_dir):
    for file in files:
        if file.endswith('.ts'):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original = content
                # Fix: const userLikes = comment.likes || [] → const userLikes = (comment.likes as string[]) || []
                content = re.sub(r'const (user\w+) = (comment\.\w+)\s*\|\|\s*\[\];', r'const \1 = (\2 as string[]) || [];', content)
                
                if content != original:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    fixed_files.append(filepath)
                    total_fixed += (len(re.findall(r' as string\[\]', content)) - len(re.findall(r' as string\[\]', original)))
            except Exception as e:
                print(f"Error processing {filepath}: {e}")

print(f"\n✅ Fixed {len(fixed_files)} files")
print(f"Total fixes: {total_fixed}")
for f in fixed_files:
    print(f"  - {f.replace(api_dir, '.')}")
