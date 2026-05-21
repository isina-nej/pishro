#!/usr/bin/env python3
"""
Dark Mode Fixer Script
Adds dark: prefixes to hardcoded Tailwind color classes
"""

import os
import re
from pathlib import Path

# Critical files to fix (by count)
FILES_TO_FIX = [
    "components/home/calculatorSection.tsx",
    "components/courses/courseDetailsModal.tsx",
    "components/courses/CourseDetailModal.tsx",
    "components/checkout/itemCard.tsx",
    "components/business-consulting/businessLanding.tsx",
    "components/investment-plans/plansList.tsx",
    "components/library/BookDetail.tsx",
    "components/library/loadingPlaceholder.tsx",
    "components/investmentPortfolios/portfoliosDisplay.tsx",
    "components/profile/transactionsTable.tsx",
    "components/checkout/result.tsx",
    "components/profile/ordersTable.tsx",
    "components/investmentPortfolios/calculatorSection.tsx",
    "components/investmentPortfolios/investmentModelsSection.tsx",
    "components/checkout/sidebar.tsx",
]

# Color replacement patterns
REPLACEMENTS = [
    # Background colors
    (r'bg-white(?!\s+dark:)', 'bg-white dark:bg-cardBg'),
    (r'bg-gray-50(?!\s+dark:)', 'bg-gray-50 dark:bg-darkBgHidden'),
    (r'bg-gray-100(?!\s+dark:)', 'bg-gray-100 dark:bg-gray-800'),
    (r'bg-gray-200(?!\s+dark:)', 'bg-gray-200 dark:bg-gray-700'),
    (r'bg-gray-300(?!\s+dark:)', 'bg-gray-300 dark:bg-gray-600'),
    (r'bg-gray-400(?!\s+dark:)', 'bg-gray-400 dark:bg-gray-500'),
    (r'bg-green-100(?!\s+dark:)', 'bg-green-100 dark:bg-green-950'),
    (r'bg-orange-50(?!\s+dark:)', 'bg-orange-50 dark:bg-orange-900'),
    (r'bg-orange-100(?!\s+dark:)', 'bg-orange-100 dark:bg-orange-950'),
    
    # Text colors
    (r'text-black(?!\s+dark:)', 'text-black dark:text-textPrimary'),
    (r'text-gray-400(?!\s+dark:)', 'text-gray-400 dark:text-gray-500'),
    (r'text-gray-500(?!\s+dark:)', 'text-gray-500 dark:text-gray-400'),
    (r'text-gray-600(?!\s+dark:)', 'text-gray-600 dark:text-textSecondary'),
    (r'text-gray-700(?!\s+dark:)', 'text-gray-700 dark:text-textPrimary'),
    (r'text-gray-800(?!\s+dark:)', 'text-gray-800 dark:text-textPrimary'),
    (r'text-gray-900(?!\s+dark:)', 'text-gray-900 dark:text-textPrimary'),
    (r'text-green-600(?!\s+dark:)', 'text-green-600 dark:text-green-400'),
    (r'text-green-700(?!\s+dark:)', 'text-green-700 dark:text-green-300'),
    (r'text-blue-600(?!\s+dark:)', 'text-blue-600 dark:text-blue-400'),
    (r'text-blue-700(?!\s+dark:)', 'text-blue-700 dark:text-blue-300'),
    (r'text-orange-600(?!\s+dark:)', 'text-orange-600 dark:text-orange-400'),
    (r'text-orange-700(?!\s+dark:)', 'text-orange-700 dark:text-orange-300'),
    
    # Border colors
    (r'border-gray-200(?!\s+dark:)', 'border-gray-200 dark:border-borderColor'),
    (r'border-gray-300(?!\s+dark:)', 'border-gray-300 dark:border-borderColor'),
    (r'border-gray-700(?!\s+dark:)', 'border-gray-700 dark:border-gray-600'),
    (r'border-green-300(?!\s+dark:)', 'border-green-300 dark:border-green-800'),
    (r'border-orange-200(?!\s+dark:)', 'border-orange-200 dark:border-orange-800'),
    
    # Hovers
    (r'hover:bg-gray-50(?!\s+dark:)', 'hover:bg-gray-50 dark:hover:bg-gray-800'),
    (r'hover:bg-gray-100(?!\s+dark:)', 'hover:bg-gray-100 dark:hover:bg-gray-700'),
    (r'hover:bg-gray-200(?!\s+dark:)', 'hover:bg-gray-200 dark:hover:bg-gray-600'),
    (r'hover:text-gray-600(?!\s+dark:)', 'hover:text-gray-600 dark:hover:text-gray-400'),
]

def fix_file(filepath):
    """Fix a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Apply all replacements
        for pattern, replacement in REPLACEMENTS:
            content = re.sub(pattern, replacement, content)
        
        # Only write if changed
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    base_path = Path("/home/sina/Documents/project/pishro/pishro")
    fixed_count = 0
    
    for rel_path in FILES_TO_FIX:
        full_path = base_path / rel_path
        
        if not full_path.exists():
            print(f"⚠️  File not found: {rel_path}")
            continue
        
        if fix_file(full_path):
            print(f"✅ Fixed: {rel_path}")
            fixed_count += 1
        else:
            print(f"⏭️  Skipped: {rel_path} (no changes needed)")
    
    print(f"\n✅ Total files fixed: {fixed_count}/{len(FILES_TO_FIX)}")

if __name__ == "__main__":
    main()
