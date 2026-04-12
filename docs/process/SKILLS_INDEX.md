# Skills 索引与逻辑分组

> 为保持 Cursor 兼容，本仓 Skills 仍为**扁平结构**（`.cursor/skills/<name>/SKILL.md`）。以下为逻辑分组，便于选用与同步到业务仓。

## 逻辑分组

| 分类 | Skill 目录名 | 说明 |
|------|--------------|------|
| **元 Skill (core)** | using-skills | 每次响应前检查并加载相关 Skill；与 AI-DLC Stage/Plan 一致；Human Gate 须人确认 |
| **Harness (core)** | harness-engineering | 缰绳工程最小实践：上下文/工具/验证/成本/可观测；多步 Agent 与生产可靠性；含红旗与 AI-DLC Stage 对照；映射见 RFC/harness-engineering/ |
| **架构 (architecture)** | architecture-principles | 技术架构原则与方案评审清单；含红旗清单（5 条，触达即停） |
| | role-architect | 架构师角色：技术方案设计、架构评审、选型、ADR |
| **产品 (product)** | product-design-principles | 产品设计原则与 PRD/需求评审清单；含红旗清单（5 条，触达即停） |
| | role-product-designer | 产品设计角色：PRD 撰写、需求评审、功能设计 |
| **工程 (core)** | development-principles | 开发原则与交付质量清单；含红旗清单（5 条，触达即停） |
| | code-standards | 代码规范与 Code Review 清单；含红旗清单（5 条，触达即停） |
| | role-developer | 开发角色：实现、Code Review、规范自检 |
| | implementation-plan | 根据需求/设计拆解成可执行开发任务列表 |
| | skill-learner-developer | Skill 学习与开发（从市场学、写新 skill、优化既有）；核心 Skill 用 TDD 工作流，见 docs/process/skill-development-workflow.md |
| | systematic-debugging | Bug/故障系统化调试：根因→多层防御→验证→沉淀，与 memory/ 衔接 |
| | doc-reflector | 代码变更后反向更新 docs/ 下 PRD 或架构文档（防漂移） |
| **架构 (扩展)** | design-review-checklist | 设计文档架构维度审查，逐条给出结论 |
| **Ops (可选)** | k8s-deploy-guard | K8s/Docker 部署配置守卫（资源、安全、探针） |
| **发布与汇总** | release-notes-from-commits | 根据 commit/PR 列表生成 Release Notes 草稿 |
| | decisions-summary | 汇总 memory/decisions 或 ADR 的已采纳决策摘要 |

## 标准工作流与 Skills 对应

| 阶段 | 建议使用的 Skill |
|------|------------------|
| **响应前（强制）** | using-skills（检查并加载相关 Skill；若有 Level 1 Plan 按 Plan 加载） |
| 需求 / PRD | role-product-designer、product-design-principles |
| 设计 / 技术方案 | role-architect、architecture-principles |
| 开发 / 实现 | role-developer、development-principles、code-standards |
| Review | role-developer + code-standards（Code Review）；role-architect（方案评审）；role-product-designer（PRD 评审） |
| Bug / 故障 / 调试 | systematic-debugging（根因→多层防御→验证→沉淀） |
| 代码变更→文档同步 | doc-reflector（根据代码变更更新 PRD/架构文档） |
| 部署 / K8s | k8s-deploy-guard（部署配置守卫） |
| 发版 / Release Notes | release-notes-from-commits（从 commit 生成发布说明） |
| 决策汇总 | decisions-summary（汇总已采纳决策） |
| 学技能 / 写技能 | skill-learner-developer（核心 Skill 用 TDD 工作流，见 skill-development-workflow.md） |
| 多步 Agent / 工具链 / 生产可靠性 | harness-engineering（与 Human Gate 互补；概念映射见 RFC/harness-engineering） |

## 业务仓复制建议

- 复制时可按需只拷贝上述部分目录（如只拷贝 architecture-principles + role-architect）。
- 本仓为 Skills 的**单一真相源**；业务仓可定期从本仓同步（手动拷贝或 git submodule/subtree）。
- 根目录另有 `roles.yaml.example`，可作多角色配置参考。
