# Skills 索引与逻辑分组

> 为保持 Cursor 兼容，本仓 Skills 仍为**扁平结构**（`.cursor/skills/<name>/SKILL.md`）。以下为逻辑分组，便于选用与同步到业务仓。

## 逻辑分组

| 分类 | Skill 目录名 | 说明 |
|------|--------------|------|
| **架构 (architecture)** | architecture-principles | 技术架构原则与方案评审清单 |
| | role-architect | 架构师角色：技术方案设计、架构评审、选型、ADR |
| **产品 (product)** | product-design-principles | 产品设计原则与 PRD/需求评审清单 |
| | role-product-designer | 产品设计角色：PRD 撰写、需求评审、功能设计 |
| **工程 (core)** | development-principles | 开发原则与交付质量清单 |
| | code-standards | 代码规范与 Code Review 清单 |
| | role-developer | 开发角色：实现、Code Review、规范自检 |
| | implementation-plan | 根据需求/设计拆解成可执行开发任务列表 |
| | skill-learner-developer | Skill 学习与开发（从市场学、写新 skill、优化既有） |
| **架构 (扩展)** | design-review-checklist | 设计文档架构维度审查，逐条给出结论 |

## 标准工作流与 Skills 对应

| 阶段 | 建议使用的 Skill |
|------|------------------|
| 需求 / PRD | role-product-designer、product-design-principles |
| 设计 / 技术方案 | role-architect、architecture-principles |
| 开发 / 实现 | role-developer、development-principles、code-standards |
| Review | role-developer + code-standards（Code Review）；role-architect（方案评审）；role-product-designer（PRD 评审） |
| 学技能 / 写技能 | skill-learner-developer |

## 业务仓复制建议

- 复制时可按需只拷贝上述部分目录（如只拷贝 architecture-principles + role-architect）。
- 本仓为 Skills 的**单一真相源**；业务仓可定期从本仓同步（手动拷贝或 git submodule/subtree）。
- 根目录另有 `roles.yaml.example`，可作多角色配置参考。
