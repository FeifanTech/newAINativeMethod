#!/bin/bash
# scripts/sync-skills.sh
# 作用：从基线仓同步 .cursor/skills 到当前业务项目，使业务仓与基线仓技能保持一致。
# 语义：基线仓中的 skill 会覆盖本地同名目录；业务仓独有 skill（基线仓中不存在的目录）会保留。
# 依赖：git (2.25+ 支持 sparse-checkout)、rsync

set -e

BASELINE_REPO="${BASELINE_REPO:-https://github.com/FeifanTech/newAINativeMethod.git}"
TEMP_DIR=".sync-skills-temp"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET_DIR="$REPO_ROOT/.cursor/skills"

cd "$REPO_ROOT"
echo "📂 业务仓根目录: $REPO_ROOT"
echo "🔄 正在连接基线仓: $BASELINE_REPO"

# 1. 克隆基线仓到临时目录（只拉取 .cursor/skills）
if [ -d "$TEMP_DIR" ]; then
  rm -rf "$TEMP_DIR"
fi
git clone --depth 1 --filter=blob:none --sparse "$BASELINE_REPO" "$TEMP_DIR"
cd "$TEMP_DIR"
git sparse-checkout set .cursor/skills
cd "$REPO_ROOT"

# 2. 同步：基线仓 .cursor/skills 覆盖本地同名 skill；本地独有 skill 保留（rsync 不删目标中多出的目录）
mkdir -p "$TARGET_DIR"
echo "📦 同步基线技能到 $TARGET_DIR ..."
rsync -av "$TEMP_DIR/.cursor/skills/" "$TARGET_DIR/"

# 3. 维护 Kiro / Claude 的 skills 兼容目录
mkdir -p "$REPO_ROOT/.kiro" "$REPO_ROOT/.claude"
([ -e "$REPO_ROOT/.kiro/skills" ] || [ -L "$REPO_ROOT/.kiro/skills" ]) && rm -rf "$REPO_ROOT/.kiro/skills"
([ -e "$REPO_ROOT/.claude/skills" ] || [ -L "$REPO_ROOT/.claude/skills" ]) && rm -rf "$REPO_ROOT/.claude/skills"
ln -s "../.cursor/skills" "$REPO_ROOT/.kiro/skills"
ln -s "../.cursor/skills" "$REPO_ROOT/.claude/skills"

# 4. 清理
rm -rf "$TEMP_DIR"

echo "✅ Skills 同步完成！当前时间: $(date '+%Y-%m-%d %H:%M')"
echo "💡 提示：请检查 $TARGET_DIR 下的技能是否符合当前项目需求；业务仓独有 skill 已保留。"
echo "🔗 已同步兼容目录：.kiro/skills -> .cursor/skills，.claude/skills -> .cursor/skills"
