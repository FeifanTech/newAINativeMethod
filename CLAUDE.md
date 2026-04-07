# Claude Code 使用约定 · 本仓库

## 仓库定位

本仓库是 **AI-native 研发方法论与可复用技能库** 的模板仓 / 基线仓，不是业务线上代码仓。

- 内容：原则与规范、PRD/技术方案模板、Agent Skills（`.cursor/skills/`）、样板 Demo（`projects/`）。
- 面向：业务仓复用本仓原则、Skills 与文档模板。
- 兼容方式：Claude Code 通过 `.claude/skills/` 读取 Skills；本仓建议将其软链接到 `.cursor/skills/`，保证单一真相源。

## Skills 目录约定（Claude）

```bash
# 方式一：软链接（推荐）
mkdir -p .claude/skills
ln -s "$(pwd)/.cursor/skills" .claude/skills

# 方式二：直接复制
mkdir -p .claude/skills
cp -r .cursor/skills/* .claude/skills/
```

说明：
- 推荐软链接，避免 Cursor/Kiro/Claude 三套目录发生漂移。
- 如需在业务仓初始化，直接运行 `./scripts/init-repo.sh` 会自动创建 `.claude/skills` 软链接。
- 如需后续同步，运行 `./scripts/sync-skills.sh` 会同步 `.cursor/skills` 并更新 `.claude/skills` 软链接。

## Skills 使用约定（强制）

- 每次响应前执行 `using-skills` 的检查逻辑；任务匹配到对应 Skill 时必须加载并遵循。
- 若任务存在 AI-DLC 的 Level 1 Plan，按 Plan 指定 Skills 加载；涉及 Human Gate 必须交由人确认。
- 以 `.cursor/skills/` 作为唯一维护源，Claude 仅通过 `.claude/skills/` 引用同一套 Skill。

## 相关文档

- `CURSOR.md`：统一的 AI 工具约定（Cursor/Kiro/Claude）。
- `docs/overview.md`：方法论总览与落地方式。
- `docs/process/QUICK_START.md`：一页纸速查。
