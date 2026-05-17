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
                
                # Find lines with "if (!session" or "if (session" after adminAuth is defined
                if ('session' in content and 'adminAuth' in content):
                    lines = content.split('\n')
                    fixed_in_file = False
                    
                    for i, line in enumerate(lines):
                        # Check for patterns like "if (!session?.user" or "if (session"
                        if 'session' in line and ('if (' in line or 'if (' in line):
                            # Check if adminAuth is defined somewhere before
                            found_adminauth = False
                            for j in range(max(0, i-20), i):
                                if 'const adminAuth = await getAdminAuth' in lines[j]:
                                    found_adminauth = True
                                    break
                            
                            if found_adminauth:
                                # Replace session checks with adminAuth
                                new_line = line
                                new_line = re.sub(r'if \(\s*!session\?\.\w+\s*\|\|\s*', 'if (!', new_line)
                                new_line = re.sub(r'if \(\s*!session\?\.\w+\s*&&\s*', 'if (!', new_line)
                                new_line = re.sub(r'if \(\s*session\?\.\w+', 'if (adminAuth', new_line)
                                new_line = re.sub(r'session\.user', 'adminAuth', new_line)
                                
                                if new_line != line:
                                    lines[i] = new_line
                                    fixed_in_file = True
                                    total_fixed += 1
                    
                    if fixed_in_file:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write('\n'.join(lines))
                        fixed_files.append(filepath)
            except Exception as e:
                print(f"Error processing {filepath}: {e}")

print(f"\n✅ Fixed {len(fixed_files)} files")
print(f"Total session fixes: {total_fixed}")
for f in fixed_files:
    print(f"  - {f.replace(api_dir, '.')}")
