#!/bin/bash
# scripts/build-role-prompt.sh
# 作用：按角色配置拼接统一 prompt，包含 using-skills、角色 skills、CURSOR.md 与可选 memory。
# 用法：./scripts/build-role-prompt.sh <role> [--roles <yaml>] [--output <file>] [--no-memory]

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
if [ -f "$REPO_ROOT/.cursor/skills/roles.yaml" ]; then
  DEFAULT_ROLES_FILE="$REPO_ROOT/.cursor/skills/roles.yaml"
else
  DEFAULT_ROLES_FILE="$REPO_ROOT/.cursor/skills/roles.yaml.example"
fi
ROLE="${1:-}"
ROLES_FILE="$DEFAULT_ROLES_FILE"
OUTPUT_FILE=""
INCLUDE_MEMORY=1

usage() {
  cat <<'EOF'
Usage:
  ./scripts/build-role-prompt.sh <role> [--roles <yaml>] [--output <file>] [--no-memory]

Examples:
  ./scripts/build-role-prompt.sh developer
  ./scripts/build-role-prompt.sh architect --output /tmp/architect-prompt.md
  ./scripts/build-role-prompt.sh product-designer --roles .cursor/skills/roles.yaml.example --no-memory
EOF
}

if [ -z "$ROLE" ]; then
  usage
  exit 1
fi

shift
while [ "$#" -gt 0 ]; do
  case "$1" in
    --roles)
      ROLES_FILE="${2:-}"
      shift 2
      ;;
    --output)
      OUTPUT_FILE="${2:-}"
      shift 2
      ;;
    --no-memory)
      INCLUDE_MEMORY=0
      shift
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

if [ ! -f "$ROLES_FILE" ]; then
  echo "Roles file not found: $ROLES_FILE" >&2
  exit 1
fi

ROLE_DATA="$(
  awk -v role="$ROLE" '
    /^roles:/ { in_roles=1; next }
    in_roles && $0 ~ /^  [^[:space:]][^:]*:/ {
      current=$1
      sub(/:$/, "", current)
      in_target=(current == role)
    }
    in_target && $0 ~ /^    description:/ {
      line=$0
      sub(/^    description: /, "", line)
      gsub(/^"/, "", line)
      gsub(/"$/, "", line)
      print "DESC\t" line
    }
    in_target && $0 ~ /^      - / {
      line=$0
      sub(/^      - /, "", line)
      print "SKILL\t" line
    }
  ' "$ROLES_FILE"
)"

if [ -z "$ROLE_DATA" ]; then
  echo "Role not found in roles file: $ROLE" >&2
  exit 1
fi

ROLE_DESCRIPTION="$(printf '%s\n' "$ROLE_DATA" | awk -F '\t' '$1 == "DESC" { print $2; exit }')"
ROLE_SKILLS=()
while IFS= read -r skill; do
  ROLE_SKILLS+=("$skill")
done <<EOF
$(printf '%s\n' "$ROLE_DATA" | awk -F '\t' '$1 == "SKILL" { print $2 }')
EOF

if [ "${#ROLE_SKILLS[@]}" -eq 0 ]; then
  echo "No skills configured for role: $ROLE" >&2
  exit 1
fi

append_file() {
  local target="$1"
  local title="$2"
  local path="$3"

  if [ ! -f "$path" ]; then
    return
  fi

  {
    printf '\n## %s\n' "$title"
    printf 'Source: %s\n\n' "${path#$REPO_ROOT/}"
    cat "$path"
    printf '\n'
  } >> "$target"
}

TEMP_OUTPUT="$(mktemp)"
trap 'rm -f "$TEMP_OUTPUT"' EXIT

{
  printf '# Generated Team Prompt\n\n'
  printf 'Repository: %s\n' "$REPO_ROOT"
  printf 'Role: %s\n' "$ROLE"
  if [ -n "$ROLE_DESCRIPTION" ]; then
    printf 'Role description: %s\n' "$ROLE_DESCRIPTION"
  fi
  printf '\nUse the following repository conventions, mandatory meta-skill, ordered role skills, and project memory as the working prompt context.\n'
} > "$TEMP_OUTPUT"

append_file "$TEMP_OUTPUT" "Repository Conventions" "$REPO_ROOT/CURSOR.md"
append_file "$TEMP_OUTPUT" "Meta Skill: using-skills" "$REPO_ROOT/.cursor/skills/using-skills/SKILL.md"

for skill in "${ROLE_SKILLS[@]}"; do
  append_file "$TEMP_OUTPUT" "Role Skill: $skill" "$REPO_ROOT/.cursor/skills/$skill/SKILL.md"
done

if [ "$INCLUDE_MEMORY" -eq 1 ] && [ -d "$REPO_ROOT/memory" ]; then
  MEMORY_FOUND=0
  for file in product.md decisions.md engineering.md tasks.md; do
    if [ -f "$REPO_ROOT/memory/$file" ]; then
      MEMORY_FOUND=1
      append_file "$TEMP_OUTPUT" "Project Memory: $file" "$REPO_ROOT/memory/$file"
    fi
  done

  if [ -f "$REPO_ROOT/memory/changelog.md" ]; then
    MEMORY_FOUND=1
    {
      printf '\n## Project Memory: changelog.md (last 200 lines)\n'
      printf 'Source: memory/changelog.md\n\n'
      tail -n 200 "$REPO_ROOT/memory/changelog.md"
      printf '\n'
    } >> "$TEMP_OUTPUT"
  fi

  if [ "$MEMORY_FOUND" -eq 0 ]; then
    {
      printf '\n## Project Memory\n'
      printf 'No memory files were found under memory/. Continue without project memory.\n'
    } >> "$TEMP_OUTPUT"
  fi
fi

if [ -n "$OUTPUT_FILE" ]; then
  mkdir -p "$(dirname "$OUTPUT_FILE")"
  cp "$TEMP_OUTPUT" "$OUTPUT_FILE"
  printf 'Prompt written to %s\n' "$OUTPUT_FILE"
else
  cat "$TEMP_OUTPUT"
fi
