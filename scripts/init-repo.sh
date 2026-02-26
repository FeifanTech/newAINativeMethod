#!/bin/bash
# scripts/init-repo.sh
# 作用：在业务仓库中初始化 AI-native 方法论所需的文件结构。
# 用法：直接运行即可，或指定 BASELINE_REPO 环境变量指向基线仓。
# 依赖：git, rsync

set -e

BASELINE_REPO="${BASELINE_REPO:-https://github.com/FeifanTech/newAINativeMethod.git}"
TEMP_DIR=".init-repo-temp"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$REPO_ROOT"
echo "📂 业务仓根目录: $REPO_ROOT"
echo "🔄 正在连接基线仓: $BASELINE_REPO"

# 1. 克隆基线仓到临时目录
if [ -d "$TEMP_DIR" ]; then
  rm -rf "$TEMP_DIR"
fi
git clone --depth 1 --filter=blob:none --sparse "$BASELINE_REPO" "$TEMP_DIR"
cd "$TEMP_DIR"

# 2. 同步 docs 目录（保留本地已有的同名文件）
echo "📚 同步文档模板到 docs/ ..."
mkdir -p "$REPO_ROOT/docs"
rsync -av --ignore-existing docs/ "$REPO_ROOT/docs/"

# 3. 同步 .cursor/skills
echo "🎯 同步 Skills 到 .cursor/skills/ ..."
mkdir -p "$REPO_ROOT/.cursor/skills"
rsync -av .cursor/skills/ "$REPO_ROOT/.cursor/skills/"

# 4. 创建 .kiro/skills 软链接
echo "🔗 创建 Kiro Skills 软链接 ..."
mkdir -p "$REPO_ROOT/.kiro"
if [ -L "$REPO_ROOT/.kiro/skills" ]; then
  rm "$REPO_ROOT/.kiro/skills"
fi
ln -s "../../.cursor/skills" "$REPO_ROOT/.kiro/skills"

# 5. 创建可选的 memory 目录结构
echo "🧠 创建 memory 目录结构（可选）..."
mkdir -p "$REPO_ROOT/memory"
cat > "$REPO_ROOT/memory/.gitkeep" << 'EOF'
# 这个目录用于沉淀团队决策、故障复盘、约定俗成等知识。
# AI 工具会自动读写这里的内容来保持上下文一致性。
#
# 建议的目录结构：
# - decisions.md   # 架构/设计决策记录
# - product.md    # 产品范围、用户画像、成功指标
# - engineering.md # 开发约定、分支策略、命令等
# - changelog.md  # 变更记录
# - incidents/    # 故障复盘（可选）
EOF

# 6. 复制 CURSOR.md
echo "📋 复制 AI 工具约定文件 ..."
cp CURSOR.md "$REPO_ROOT/"

# 7. 清理
cd "$REPO_ROOT"
rm -rf "$TEMP_DIR"

echo ""
echo "✅ 初始化完成！"
echo ""
echo "📁 已创建/同步的文件："
echo "   - .cursor/skills/     # Agent Skills"
echo "   - .kiro/skills/      # Kiro 软链接（指向 .cursor/skills）"
echo "   - docs/              # 文档模板"
echo "   - memory/            # 知识沉淀目录（可选）"
echo "   - CURSOR.md          # AI 工具约定"
echo ""
echo "📖 下一步："
echo "   1. 阅读 CURSOR.md 了解 AI 工具的使用约定"
echo "   2. 查看 docs/overview.md 了解方法论"
echo "   3. 根据项目需要定制 docs/ 和 .cursor/skills/ 中的内容"
echo "   4. 如有需要，运行 scripts/sync-skills.sh 同步基线仓更新"
