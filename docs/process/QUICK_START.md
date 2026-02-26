# AI-native 研发快速上手指南

> 这是一页纸的快速参考，帮助团队快速理解"什么时候用什么"。

---

## 核心原则

**AI 是执行与推演的加速器，人是决策者。**

- AI 负责：生成草稿、执行任务、提供建议
- 人负责：审核、决策、确认 Human Gate

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
# 初始化业务仓（首次使用）
./scripts/init-repo.sh

# 同步基线仓 Skills 更新
./scripts/sync-skills.sh

# 查看可用 Skills
ls -la .cursor/skills/
```

---

## 关键文件

| 文件 | 作用 |
|------|------|
| `CURSOR.md` | AI 工具的使用约定 |
| `docs/overview.md` | 方法论总览 |
| `.cursor/skills/` | 技能库目录 |
| `memory/` | 团队知识沉淀（可选） |

---

## Human Gate（必须人确认）

- 合并到 main/master 分支
- 部署到生产环境
- 修改数据模型/核心接口
- 安全/合规相关的决策

---

> 📌 **提示**：本卡片是简化参考。复杂场景请阅读完整的 Skill 文档（`.cursor/skills/*/SKILL.md`）。
