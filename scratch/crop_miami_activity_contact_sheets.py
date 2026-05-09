from pathlib import Path
from PIL import Image

repo = Path.cwd()
generated_dir = Path.home() / ".codex" / "generated_images" / "019e0ce2-b435-7120-827b-818ca2a1a4a8"
out_dir = repo / "img"

places = [
    "ocean_drive",
    "wynwood_walls",
    "little_havana",
    "everglades",
    "vizcaya",
    "joes_stone_crab",
    "bayside_marketplace",
    "coconut_grove",
    "design_district",
]

files = sorted(generated_dir.glob("*.png"), key=lambda p: p.stat().st_mtime)[-9:]
if len(files) != 9:
    raise SystemExit(f"Expected 9 generated contact sheets, found {len(files)}")

for place_slug, source in zip(places, files):
    image = Image.open(source).convert("RGB")
    width, height = image.size
    cell_w = width // 3
    cell_h = height // 2
    for idx in range(6):
        col = idx % 3
        row = idx // 3
        crop = image.crop((col * cell_w, row * cell_h, (col + 1) * cell_w, (row + 1) * cell_h))
        crop = crop.resize((900, 650), Image.Resampling.LANCZOS)
        target = out_dir / f"miami_activity_{place_slug}_{idx + 1}.jpg"
        crop.save(target, "JPEG", quality=90, optimize=True)
        print(target.as_posix())
