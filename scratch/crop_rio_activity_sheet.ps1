param(
  [Parameter(Mandatory=$true)][string]$SheetPath,
  [Parameter(Mandatory=$true)][string[]]$OutputPaths
)

if ($OutputPaths.Count -ne 6) {
  throw "Se necesitan exactamente 6 rutas de salida."
}

Add-Type -AssemblyName System.Drawing
$Root = Resolve-Path (Join-Path $PSScriptRoot '..')
$sheet = [System.Drawing.Image]::FromFile($SheetPath)

$cellWidth = [int][math]::Floor($sheet.Width / 3)
$cellHeight = [int][math]::Floor($sheet.Height / 2)

for ($i = 0; $i -lt 6; $i++) {
  $col = $i % 3
  $row = [math]::Floor($i / 3)
  $source = New-Object System.Drawing.Rectangle -ArgumentList ([int]($col * $cellWidth)), ([int]($row * $cellHeight)), $cellWidth, $cellHeight
  $bitmap = New-Object System.Drawing.Bitmap -ArgumentList $cellWidth, $cellHeight
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $target = New-Object System.Drawing.Rectangle -ArgumentList 0, 0, $cellWidth, $cellHeight
  $graphics.DrawImage($sheet, $target, $source, [System.Drawing.GraphicsUnit]::Pixel)

  $out = Join-Path $Root $OutputPaths[$i]
  $dir = Split-Path $out
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
  $bitmap.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $bitmap.Dispose()
}

$sheet.Dispose()
Write-Output "Recortadas 6 actividades desde $SheetPath"
