# AI-native 研发快速上手指南

> 这是一页纸的快速参考，帮助团队快速理解「什么时候用什么」。  
> 与 [approach.md](../../RFC/ai_native_org/approach.md)、[CURSOR.md](../../CURSOR.md) 约定一致。

---

## 核心原则

**AI 是执行与推演的加速器，人是决策者。**

- AI 负责：生成草稿、执行任务、提供建议
- 人负责：审核、决策、确认 Human Gate
- **响应前检查**：AI 在给出实质性响应前会按 [using-skills](../../.cursor/skills/using-skills/SKILL.md) 检查并加载相关 Skill（本仓 CURSOR.md 约定）

---

## 场景速查表

| 场景 | 使用的 Skill | 流程深度 |
|------|-------------|----------|
| 写/评审 PRD | `product-design-principles` | 完整流程 |
| 写技术方案 | `architecture-principles` | 完整流程 |
| 写代码 / Code Review | `code-standards` + `development-principles` | 完整流程 |
| 调试 Bug | `systematic-debugging` | 四阶段流程 |
| 部署 K8s | `k8s-deploy-guard` | 检查清单 |
| 更新文档 | `doc-reflector` | 代码→文档同步 |
| 生成 Release Notes | `release-notes-from-commits` | 自动生成 |
| 做架构/设计决策 | `decisions-summary` | 自动汇总 |
| 多步 Agent / 工具链 / 生产可靠性 | `harness-engineering`（叠加 `using-skills`） | 缰绳检查 + Stage 对照 |

---

## 轻量模式（简单场景）

以下场景可以跳过部分流程，直接使用：

| 场景 | 简化操作 |
|------|----------|
| 简单 Bugfix | 直接用 `systematic-debugging`，聚焦根因+修复 |
| 文档修改 | 用 `doc-reflector` 同步，或直接改 |
| 配置变更 | 用 `k8s-deploy-guard` 检查安全性 |
| 小需求（1-2天） | `product-design-principles` 只写核心 3 点：背景、目标、功能 |

---

## 红灯清单（触达即停）

无论什么场景，以下情况必须停下来交由人决策：

1. 需求/方案未形成文档就进入实现
2. 验收标准不可测或不可验收
3. 关键假设/决策未记录
4. 未考虑边界与异常场景
5. 未经 Code Review 就合并到主分支

---

## 常用命令

```bash
# 初始化业务仓（首次使用：需先将 scripts/init-repo.sh 从基线仓复制到业务仓 scripts/，详见 adopt-this-project-in-your-repo.md）
./scripts/init-repo.sh

# 同步基线仓 Skills 更新（init-repo.sh 会复制此脚本到业务仓）
./scripts/sync-skills.sh

# 查看可用 Skills
ls -la .cursor/skills/
```

多 IDE（Kiro/Claude）软链接、Skill 写作（MUST/NOT、examples）、与社区 `npx skills add` 的关系：见 [skill-writing-and-distribution.md](./skill-writing-and-distribution.md)。

---

## 关键文件

| 文件 | 作用 |
|------|------|
| `CURSOR.md` | AI 工具使用约定（含「每次响应前检查」using-skills、**Kiro/Claude 使用设置**） |
| `CLAUDE.md` | Claude Code 使用约定（建议复制到业务仓并按团队流程定制） |
| `docs/overview.md` | 方法论总览 |
| `docs/process/QUICK_START.md` | 本卡片 |
| `.cursor/skills/` | 技能库目录（Cursor / 通用） |
| `.kiro/skills/` | Kiro 读取的 Skills；软链接至 .cursor/skills 或复制使用，与 Cursor 共用同一套内容 |
| `.claude/skills/` | Claude 读取的 Skills；软链接至 .cursor/skills 或复制使用，与 Cursor 共用同一套内容 |
| `memory/` | 团队知识沉淀（可选；decisions / product / engineering / changelog） |

---

## Human Gate（必须人确认）

- 合并到 main/master 分支
- 部署到生产环境
- 修改数据模型/核心接口
- 安全/合规相关的决策

---

## 相关文档

- [adopt-this-project-in-your-repo.md](./adopt-this-project-in-your-repo.md) - 在业务仓中落地本方法论（含 init-repo 步骤）
- [multi-person-collaboration.md](./multi-person-collaboration.md) - 多人协作与 Human Gate 分层
- [skill-writing-and-distribution.md](./skill-writing-and-distribution.md) - Skill 写作（MUST/NOT）与多 IDE 分发
- [feishu-github-workflow.md](./feishu-github-workflow.md) - 飞书 + GitHub 全流程（三个真人门）；配套 [需求卡](./requirement-card-template.md)、[度量](./ai-native-metrics.md)
- [CURSOR_SKILLS_GUIDE.md](./CURSOR_SKILLS_GUIDE.md) - Skills 与 Rules 使用指南

---

> 📌 **提示**：本卡片是简化参考。复杂场景请阅读完整的 Skill 文档（`.cursor/skills/*/SKILL.md`）。
