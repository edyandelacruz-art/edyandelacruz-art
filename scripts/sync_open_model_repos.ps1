$ErrorActionPreference = 'Stop'

$Root = Join-Path $PSScriptRoot '..\vendor-model-repos'
New-Item -ItemType Directory -Force -Path $Root | Out-Null

$repos = @(
  @{ Name='Kimi-K3'; Url='https://github.com/MoonshotAI/Kimi-K3.git'; Commit='3cb39dfd32e51c3328e2e4b4af21341247d06c43' },
  @{ Name='GLM-5'; Url='https://github.com/zai-org/GLM-5.git'; Commit='c8ad661c6cf4cb0a78064987bc42f97e14355929' },
  @{ Name='Qwen3.6'; Url='https://github.com/AlibabaCloud-Official/Qwen3.6.git'; Commit='59f5f824c1841f1fba5c90389c68447e16d7a1e0' }
)

foreach ($r in $repos) {
  $dest = Join-Path $Root $r.Name
  if (-not (Test-Path $dest)) {
    git clone $r.Url $dest
  }
  Push-Location $dest
  try {
    git fetch --all --tags --prune
    git checkout $r.Commit
  } finally {
    Pop-Location
  }
}

Write-Host "Pinned source repositories are available under $Root"
Write-Host "Large model weights are intentionally not stored in GitHub. Download weights separately from the official model host and verify their hashes."
