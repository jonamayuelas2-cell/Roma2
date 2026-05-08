Add-Type -AssemblyName System.Drawing

$Root = Resolve-Path (Join-Path $PSScriptRoot '..')
$CitiesPath = Join-Path $Root 'cities.json'
$Cities = Get-Content -Raw $CitiesPath | ConvertFrom-Json

function New-Brush($color) {
  return New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml($color))
}

function Draw-ImageAsset($Path, $Title, $Kind, $Seed) {
  $width = 1200
  $height = 800
  $bitmap = New-Object System.Drawing.Bitmap $width, $height
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

  $palettes = @(
    @('#0f172a', '#0e7490', '#f59e0b', '#f8fafc'),
    @('#1f2937', '#7c2d12', '#facc15', '#fff7ed'),
    @('#082f49', '#0369a1', '#f97316', '#ecfeff'),
    @('#312e81', '#be123c', '#fbbf24', '#fff1f2'),
    @('#14532d', '#0f766e', '#eab308', '#f7fee7')
  )
  $palette = $palettes[$Seed % $palettes.Count]

  $rect = New-Object System.Drawing.Rectangle 0, 0, $width, $height
  $gradient = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, ([System.Drawing.ColorTranslator]::FromHtml($palette[0])), ([System.Drawing.ColorTranslator]::FromHtml($palette[1])), 25
  $graphics.FillRectangle($gradient, $rect)

  $sunBrush = New-Brush $palette[2]
  $graphics.FillEllipse($sunBrush, 885, 95, 160, 160)

  $waterBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (New-Object System.Drawing.Rectangle 0, 560, $width, 240), ([System.Drawing.Color]::FromArgb(180, 20, 184, 166)), ([System.Drawing.Color]::FromArgb(220, 8, 47, 73)), 90
  if ($Kind -in @('cultura', 'museos', 'cafes')) {
    $waterBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (New-Object System.Drawing.Rectangle 0, 590, $width, 210), ([System.Drawing.Color]::FromArgb(210, 76, 29, 149)), ([System.Drawing.Color]::FromArgb(230, 17, 24, 39)), 90
  }
  $graphics.FillRectangle($waterBrush, 0, 560, $width, 240)

  $shadow = New-Brush '#111827'
  $accent = New-Brush $palette[3]
  $warm = New-Brush $palette[2]

  for ($i = 0; $i -lt 8; $i++) {
    $x = 70 + ($i * 138) + (($Seed * 17 + $i * 23) % 34)
    $h = 150 + (($Seed * 31 + $i * 41) % 190)
    $y = 560 - $h
    $graphics.FillRectangle($shadow, $x, $y, 78, $h)
    $graphics.FillRectangle($accent, $x + 10, $y + 18, 12, 22)
    $graphics.FillRectangle($accent, $x + 42, $y + 48, 12, 22)
    if ($Kind -eq 'cultura') {
      $graphics.FillPolygon($warm, @(
        (New-Object System.Drawing.Point ($x - 8), $y),
        (New-Object System.Drawing.Point ($x + 39), ($y - 58)),
        (New-Object System.Drawing.Point ($x + 86), $y)
      ))
    }
  }

  if ($Kind -eq 'parques') {
    $treeBrush = New-Brush '#22c55e'
    for ($i = 0; $i -lt 14; $i++) {
      $x = 30 + (($Seed * 71 + $i * 83) % 1080)
      $y = 470 + (($Seed * 29 + $i * 37) % 120)
      $graphics.FillEllipse($treeBrush, $x, $y, 82, 82)
      $graphics.FillRectangle($shadow, $x + 36, $y + 58, 12, 80)
    }
  }

  if ($Kind -in @('mercados', 'cafes')) {
    for ($i = 0; $i -lt 6; $i++) {
      $x = 105 + $i * 170
      $graphics.FillRectangle($warm, $x, 470, 120, 90)
      $graphics.FillPolygon($accent, @(
        (New-Object System.Drawing.Point $x, 470),
        (New-Object System.Drawing.Point ($x + 60), 420),
        (New-Object System.Drawing.Point ($x + 120), 470)
      ))
    }
  }

  $overlay = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(70, 0, 0, 0))
  $graphics.FillRectangle($overlay, 0, 0, $width, $height)

  $dir = Split-Path $Path
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
  $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)

  $gradient.Dispose()
  $waterBrush.Dispose()
  $sunBrush.Dispose()
  $shadow.Dispose()
  $accent.Dispose()
  $warm.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

$created = 0
$seed = 1
foreach ($city in $Cities) {
  $hero = Join-Path $Root $city.imagen
  if (!(Test-Path $hero)) {
    Draw-ImageAsset $hero $city.nombre 'vistas' $seed
    $created++
  }
  foreach ($place in $city.lugares) {
    foreach ($field in @('imagen', 'imagenCard')) {
      $src = $place.$field
      if ($src -and -not $src.StartsWith('http')) {
        $path = Join-Path $Root $src
        if (!(Test-Path $path)) {
          Draw-ImageAsset $path $place.nombre $place.tipo $seed
          $created++
        }
      }
    }
    $seed++
  }
}

Write-Output "Imagenes generadas: $created"
