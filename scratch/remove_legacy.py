import os

file_path = r"c:\Users\jamayuelas\OneDrive - ELMUBAS IBERICA, SLU\Documentos\Personal\IA\Antigravity\Roma\app.js"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if "function renderCruiseHeaderLegacy(cruise)" in line:
        skip = True
        continue
    if skip and line.strip() == "}":
        skip = False
        continue
    if not skip:
        new_lines.append(line)

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Legacy function removed.")
