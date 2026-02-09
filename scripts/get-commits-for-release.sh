#!/bin/bash
# scripts/get-commits-for-release.sh
# 作用：输出两个 ref 之间的 commit 列表，供 Release Notes 生成使用。
# 用法：./scripts/get-commits-for-release.sh [上一版本tag] [本版本tag或HEAD]
# 示例：./scripts/get-commits-for-release.sh v1.0.0 HEAD
#       ./scripts/get-commits-for-release.sh   # 自动取最近两个 tag

set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

PREV_TAG="${1:-}"
END_REF="${2:-HEAD}"

if [ -z "$PREV_TAG" ]; then
  PREV_TAG=$(git describe --tags --abbrev=0 2>/dev/null || true)
  if [ -z "$PREV_TAG" ]; then
    echo "未找到 tag，使用首次 commit 作为起点" >&2
    PREV_TAG=$(git rev-list --max-parents=0 HEAD 2>/dev/null || echo "HEAD")
  fi
fi

git log "$PREV_TAG..$END_REF" --pretty=format:"%h %s%n%b---"
