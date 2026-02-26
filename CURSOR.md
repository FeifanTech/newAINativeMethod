# Cursor 使用约定 · 本仓库

## 仓库定位

本仓库是 **AI-native 研发方法论与可复用技能库** 的**模板仓 / 基线仓**，不是业务线上代码仓。

- **内容**：原则与规范、PRD/技术方案模板、Cursor Skills（.cursor/skills）、以及按方法论落地的**样板 Demo**（projects/）。
- **面向**：多项目、多产品线（如 AI 外呼、千岛湖溯源等）；供业务仓库**拷贝或引用**本仓的原则、Skills 与文档模板。

## 允许 / 不允许 AI 做的事

| 允许 | 不允许 |
|------|--------|
| 在本仓内编写或修改**规范、PRD、技术方案、Skill 模板、文档** | **不要假定本仓就是线上业务代码**，不要直接改业务仓库的代码 |
| 生成可复用的草稿、模板、检查清单，供人工或业务仓采纳 | 不要在本仓外执行提交、部署等会改变业务环境的操作 |
| 按 docs/ 与 .cursor/skills/ 的约定做**评审、建议、拆任务** | 涉及业务仓时，仅输出「可拷贝的片段」或「在业务仓中建议执行的步骤」 |

## Skills 使用约定（强制）

- **每次响应前**：必须执行 **using-skills** 的检查逻辑——判断当前任务是否涉及架构/设计/代码/需求/调试/Skill 开发等；若涉及，必须加载并遵循对应 Skill（architecture-principles、code-standards、development-principles、product-design-principles、systematic-debugging、skill-learner-developer 等）。
- 若任务已有 **Level 1 Plan**（AI-DLC），按 Plan 中「建议使用的 Skills」加载；执行任一 **Stage** 时须加载该 Stage 对应 Skill。**Human Gate** 须由人确认。
- 详见 `.cursor/skills/using-skills/SKILL.md`。

## 在本仓库中的主要任务

1. **生成/完善规范与模板**：PRD 模板、技术方案结构、评审检查清单等，放在 `docs/` 对应目录。
2. **维护与扩展 Skills**：遵循 `.cursor/skills/` 下既有结构（core / product / architecture），新增或修改 SKILL.md 时写清 name、description、触发条件与产出格式。
3. **产出可落地的草稿**：PRD 初稿、技术方案、工作量与风险分析等，供人工审阅后拷贝到业务仓或本仓 projects/ 使用。
4. **不做**：假定本仓即生产环境、直接修改业务仓库、执行未约定的部署或数据变更。

## 仓库结构速览

- **docs/architecture/**：架构与数据密集型应用方法论、技术方案。
- **docs/product/**：PRD、产品文档、工作量与风险等。
- **docs/process/**：研发流程、Code Review、AI 使用规范、Skills 与落地指南。
- **.cursor/skills/**：通用与分类 Skills（core / product / architecture），供 Cursor 匹配使用。
- **projects/**：按方法论落地的样板工程（如 qiandao-lake-traceability-demo）。

更多说明见 **docs/overview.md**。
