$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$generated = @(Get-ChildItem -Path $HOME\.codex\generated_images -Recurse -File |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 9 |
    Sort-Object LastWriteTime)

$placeSlugs = @('shibuya','sensoji','meiji','teamlab','tsukiji','akihabara','ueno','skytree','goldengai')
$outDir = Join-Path (Get-Location) 'img\tokyo_activities'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

Get-ChildItem $outDir -Filter 'tokyo_activity_*.png' -ErrorAction SilentlyContinue | ForEach-Object {
    try { Remove-Item -LiteralPath $_.FullName -Force -ErrorAction Stop } catch { }
}

for ($i = 0; $i -lt $generated.Count; $i++) {
    $src = $generated[$i].FullName
    $slug = $placeSlugs[$i]
    $img = New-Object System.Drawing.Bitmap($src)
    try {
        if ($img.Width -ne 1536 -or $img.Height -ne 1024) {
            throw ("Tamano inesperado para {0}: {1}x{2}." -f $slug, $img.Width, $img.Height)
        }

        $cellWidth = 512
        $cellHeight = 512
        $idx = 1

        for ($row = 0; $row -lt 2; $row++) {
            for ($col = 0; $col -lt 3; $col++) {
                $x = $col * $cellWidth
                $y = $row * $cellHeight

                $crop = New-Object System.Drawing.Bitmap($cellWidth, $cellHeight)
                $graphics = [System.Drawing.Graphics]::FromImage($crop)
                try {
                    $srcRect = New-Object System.Drawing.Rectangle($x, $y, $cellWidth, $cellHeight)
                    $destRect = New-Object System.Drawing.Rectangle(0, 0, $cellWidth, $cellHeight)
                    $graphics.DrawImage($img, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
                    $outPath = Join-Path $outDir ("tokyo_activity_{0}_{1}.png" -f $slug, $idx)
                    $crop.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
                } finally {
                    $graphics.Dispose()
                    $crop.Dispose()
                }
                $idx++
            }
        }
    } finally {
        $img.Dispose()
    }
}

Write-Output "generated=$((Get-ChildItem $outDir -Filter 'tokyo_activity_*.png').Count)"
