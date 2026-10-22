param(
    [string]$Python = "python",
    [string]$DependencyPath = ""
)
$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
Push-Location -LiteralPath $projectRoot
try {
    & $Python scripts/make_icon.py
    if ($LASTEXITCODE -ne 0) { throw "Icon generation failed." }
    $buildArgs = @("--noconfirm", "--clean", "--onefile", "--windowed", "--name", "LeahsLedger", "--icon", "assets/ledger.ico", "--add-data", "ui;ui", "--hidden-import", "reportlab.pdfbase.ttfonts", "--collect-data", "reportlab", "--collect-data", "docx", "--exclude-module", "numpy", "--exclude-module", "matplotlib", "--exclude-module", "pandas", "--exclude-module", "scipy", "--exclude-module", "IPython", "--exclude-module", "pytest")
    if ($DependencyPath) { $buildArgs += @("--paths", $DependencyPath) }
    $buildArgs += "app.py"
    & $Python -m PyInstaller @buildArgs
    if ($LASTEXITCODE -ne 0) { throw "Windows build failed." }
    & $Python scripts/collect_licenses.py
    if ($LASTEXITCODE -ne 0) { throw "License collection failed." }
    Get-FileHash -LiteralPath "dist/LeahsLedger.exe" -Algorithm SHA256 | ForEach-Object { "$($_.Hash.ToLower())  LeahsLedger.exe" } | Set-Content -LiteralPath "dist/SHA256SUMS.txt" -Encoding ascii
    Write-Output "Ready: dist/LeahsLedger.exe"
} finally {
    Pop-Location
}
