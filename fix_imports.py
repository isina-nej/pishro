import os
import re

admin_dir = 'app/api/admin'

for root, dirs, files in os.walk(admin_dir):
    for file in files:
        if file == 'route.ts':
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            # Find all import { getAdminAuth } lines and keep only the first
            lines = content.split('\n')
            import_seen = False
            new_lines = []
            
            for line in lines:
                if 'import { getAdminAuth }' in line and 'auth-simple' in line:
                    if not import_seen:
                        new_lines.append(line)
                        import_seen = True
                    # else: skip duplicate
                else:
                    new_lines.append(line)
            
            with open(filepath, 'w') as f:
                f.write('\n'.join(new_lines))
            
            print(f"Fixed: {filepath}")

print("Done!")
