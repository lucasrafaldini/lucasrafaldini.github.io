#!/usr/bin/env python3
"""
Zero-Dash Linter for lucasrafaldini.github.io
Enforces the strict rule: No em-dashes or en-dashes anywhere in text or code.
"""

import os
import sys

EXTENSIONS = ('.html', '.md', '.js', '.css', '.json', '.yml', '.yaml', '.sh')
FORBIDDEN = ['\u2014', '\u2013', '&mdash;', '&ndash;']

def check_file(filepath):
    errors = []
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            for idx, line in enumerate(f, 1):
                for char in FORBIDDEN:
                    if char in line:
                        errors.append((idx, line.strip()))
                        break
    except Exception as e:
        print(f"Error reading {filepath}: {e}", file=sys.stderr)
    return errors

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    total_violations = 0

    print(f"==> Scanning repository for prohibited dashes at {root_dir}...")
    for root, dirs, files in os.walk(root_dir):
        if '.git' in dirs:
            dirs.remove('.git')
        for file in files:
            if file.endswith(EXTENSIONS):
                p = os.path.join(root, file)
                rel = os.path.relpath(p, root_dir)
                errs = check_file(p)
                if errs:
                    for line_num, text in errs:
                        print(f"❌ {rel}:{line_num}: {text[:100]}")
                        total_violations += 1

    if total_violations == 0:
        print("✅ Zero-Dash Linter Passed: 0 violations found across all files.")
        sys.exit(0)
    else:
        print(f"\n❌ Failed: {total_violations} forbidden dash characters detected.")
        sys.exit(1)

if __name__ == '__main__':
    main()
