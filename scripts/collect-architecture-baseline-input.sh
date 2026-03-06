#!/bin/bash
# scripts/collect-architecture-baseline-input.sh
# 作用：收集遗留项目的基础结构信息，供 AI 生成 architecture-baseline 初稿。
# 用法：./scripts/collect-architecture-baseline-input.sh [--output <file>]

set -euo pipefail

REPO_ROOT="$(pwd)"
OUTPUT_FILE=""

usage() {
  cat <<'EOF'
Usage:
  ./scripts/collect-architecture-baseline-input.sh [--output <file>]

Examples:
  ./scripts/collect-architecture-baseline-input.sh
  ./scripts/collect-architecture-baseline-input.sh --output /tmp/architecture-input.md
EOF
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --output)
      OUTPUT_FILE="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

render_top_level_dirs() {
  find . -maxdepth 1 -mindepth 1 -type d \
    ! -name ".git" \
    ! -name ".cursor" \
    ! -name ".kiro" \
    ! -name "node_modules" \
    ! -name "dist" \
    ! -name "build" \
    ! -name "coverage" \
    | sed 's#^\./##' \
    | sort
}

render_existing_files() {
  while IFS= read -r file; do
    [ -f "$file" ] && printf '%s\n' "$file"
  done
  return 0
}

TEMP_OUTPUT="$(mktemp)"
trap 'rm -f "$TEMP_OUTPUT"' EXIT

{
  printf '# Architecture Baseline Input\n\n'
  printf 'Repository: %s\n\n' "$REPO_ROOT"
  printf 'This file is a raw repository scan for AI-assisted baseline drafting. It contains facts and signals, not final conclusions.\n'
} > "$TEMP_OUTPUT"

{
  printf '\n## Root Overview\n\n'
  printf '```text\n'
  printf 'Top-level directories:\n'
  render_top_level_dirs
  printf '\nLikely manifest and config files:\n'
  render_existing_files <<'EOF'
README.md
package.json
pnpm-lock.yaml
yarn.lock
package-lock.json
tsconfig.json
pom.xml
build.gradle
settings.gradle
gradle.properties
go.mod
Cargo.toml
pyproject.toml
requirements.txt
Pipfile
Gemfile
docker-compose.yml
docker-compose.yaml
compose.yml
compose.yaml
Dockerfile
Makefile
EOF
  printf '```\n'
} >> "$TEMP_OUTPUT"

{
  printf '\n## Common Source Directories\n\n'
  printf '```text\n'
  find . \
    \( -path "./src" -o -path "./app" -o -path "./apps" -o -path "./services" -o -path "./packages" -o -path "./libs" -o -path "./cmd" -o -path "./internal" -o -path "./server" -o -path "./api" \) \
    -type d | sed 's#^\./##' | sort
  printf '```\n'
} >> "$TEMP_OUTPUT"

{
  printf '\n## Dependency Manifests\n\n'
  printf '```text\n'
  rg --files -g 'package.json' -g 'pom.xml' -g 'build.gradle' -g 'settings.gradle' -g 'go.mod' -g 'Cargo.toml' -g 'pyproject.toml' -g 'requirements*.txt' -g 'Pipfile' -g 'Gemfile' | sort || true
  printf '```\n'
} >> "$TEMP_OUTPUT"

{
  printf '\n## Deployment And Operations Files\n\n'
  printf '```text\n'
  rg --files -g 'Dockerfile*' -g 'docker-compose*.yml' -g 'docker-compose*.yaml' -g 'compose*.yml' -g 'compose*.yaml' -g '.github/workflows/*.yml' -g '.github/workflows/*.yaml' -g 'helm/**' -g 'k8s/**' -g 'deploy/**' | sort || true
  printf '```\n'
} >> "$TEMP_OUTPUT"

{
  printf '\n## Entry Point Signals\n\n'
  printf '```text\n'
  rg -n -m 3 'SpringApplication\.run|NestFactory\.create|FastAPI\(|Flask\(|express\(|createServer\(|main\(|ServeHTTP|Router\(' \
    -g '*.java' -g '*.kt' -g '*.ts' -g '*.js' -g '*.py' -g '*.go' . || true
  printf '```\n'
} >> "$TEMP_OUTPUT"

{
  printf '\n## Integration And Infrastructure Signals\n\n'
  printf '```text\n'
  rg -n -m 80 'redis|mysql|postgres|mongodb|kafka|rabbitmq|rocketmq|elasticsearch|opensearch|s3|oss|endpoint|base[_-]?url|broker|payment|erp|oauth|openid|smtp' \
    -g '*.yml' -g '*.yaml' -g '*.json' -g '*.properties' -g '*.toml' -g '*.env*' -g '*.ts' -g '*.js' -g '*.java' -g '*.py' . || true
  printf '```\n'
} >> "$TEMP_OUTPUT"

{
  printf '\n## HTTP And RPC Route Signals\n\n'
  printf '```text\n'
  rg -n -m 80 '@RequestMapping|@GetMapping|@PostMapping|router\.|app\.get|app\.post|Controller\(|FastAPI\(|APIRouter\(|grpc|GraphQL' \
    -g '*.java' -g '*.kt' -g '*.ts' -g '*.js' -g '*.py' . || true
  printf '```\n'
} >> "$TEMP_OUTPUT"

{
  printf '\n## Database And Migration Signals\n\n'
  printf '```text\n'
  rg --files -g 'db/**' -g 'migrations/**' -g 'migration/**' -g 'prisma/**' -g 'sql/**' -g 'schema.sql' -g '*.ddl' | sort || true
  printf '```\n'
} >> "$TEMP_OUTPUT"

{
  printf '\n## Suggested Next Step\n\n'
  printf 'Use this scan together with:\n'
  printf '%s\n' '- docs/process/legacy-architecture-baseline-template.md'
  printf '%s\n' '- scripts/build-role-prompt.sh architect'
  printf '\nAsk AI to produce a draft baseline, then have a human only补充口头约束、历史原因、禁区和确认人。\n'
} >> "$TEMP_OUTPUT"

if [ -n "$OUTPUT_FILE" ]; then
  mkdir -p "$(dirname "$OUTPUT_FILE")"
  cp "$TEMP_OUTPUT" "$OUTPUT_FILE"
  printf 'Architecture input written to %s\n' "$OUTPUT_FILE"
else
  cat "$TEMP_OUTPUT"
fi
