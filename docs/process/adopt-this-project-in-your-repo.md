# 在业务仓库中采纳本方法论

> 本仓库是 **AI-native 方法论与 Skills 的模板仓**，不是业务代码仓。本文说明如何在业务仓库中复用本仓的原则、Skills 与文档模板。

---

## 一、在业务仓库中要做的事

### 1.1 复制或定制约定文件

- 在业务仓库**根目录**新建 `CURSOR.md`（或 `CLAUDE.md`），可从本仓 [CURSOR.md](../../CURSOR.md) 拷贝后按业务调整：
  - 明确「本仓为业务代码仓」与「允许/不允许 AI 做的事」。
  - 若业务仓仅做实现、不产 PRD/方案模板，可缩小 AI 产出范围（如只做代码与 Code Review）。

### 1.2 复制 Skills 子集

- 从本仓 `.cursor/skills/` 拷贝需要的技能到业务仓的 `.cursor/skills/` 下：
  - **通用**：`architecture-principles`、`role-architect`、`product-design-principles`、`role-product-designer`、`development-principles`、`code-standards`、`role-developer`。
  - **可选**：`design-review-checklist`、`implementation-plan`、`skill-learner-developer`。
- 业务专属技能可自行新增，参考本仓 [SKILL.md 结构](https://www.agentskills.guide) 与 [docs/process/SKILLS_INDEX.md](./SKILLS_INDEX.md)。
- 本仓为 Skills 的**单一真相源**；业务仓建议定期与本仓同步（见下文「技能漂移」）。

### 1.3 使用文档模板

- 在业务仓的 `docs/` 中使用本仓的文档结构：
  - **PRD**：参考 [docs/product/](../../docs/product/) 下的 PRD 结构（背景、目标、用户与场景、功能列表、非功能需求、成功指标）。
  - **技术方案**：参考 [docs/architecture/](../../docs/architecture/) 下的技术方案结构（背景、目标、架构图、核心模块、接口与数据流、选型理由、风险与回滚）。
  - **工作量与风险**：参考 [docs/product/QIANDAO_LAKE_TRACEABILITY_EFFORT_AND_RISKS.md](../../docs/product/QIANDAO_LAKE_TRACEABILITY_EFFORT_AND_RISKS.md) 的表格与结构。
- 可由 Cursor 结合对应 Skills 生成草稿，人工审阅后采纳。

### 1.4 （可选）配置自动化

- 参考 [docs/process/github-actions-example.md](./github-actions-example.md) 在业务仓配置 PR 审查等 CI。
- 本仓提供的是**示例配置**，需在业务仓中替换 API Key、触发条件等。

### 1.5 （可选）在业务仓增加项目记忆 memory/

- 若希望**跨会话保持上下文、减少 AI 失忆与幻觉**，可在业务仓库根目录增加一个 `memory/` 目录，用项目内文件做「项目级、会话级」记忆：当前任务、近期决策、工程约定等写入该目录，会话前后让 AI 先读再写（或由你按会话总结更新）。这样每次自然语言协作都能沉淀为可复用上下文，第二天/下周继续聊也不会断片。
- 与本仓的 docs/、Skills 是**互补**的：docs 放已定稿产出（PRD、技术方案），memory 放进行中的工作记忆（product/engineering/decisions/tasks/changelog/scratchpad 等）。本仓在此仅说明该可选能力；是否采用、是否接入具备中长短期记忆能力的外部服务，由业务仓自行决定。具体文件结构与会话协议可参考本仓 [tmp/memory.md](../../tmp/memory.md) 中的方案思路。

---

## 二、建议的标准工作流

| 阶段 | 建议动作 | 可用的 Skill |
|------|----------|--------------|
| **需求** | 写 PRD 初稿、需求评审 | role-product-designer、product-design-principles |
| **设计** | 写技术方案、架构评审 | role-architect、architecture-principles、design-review-checklist |
| **开发** | 拆任务、实现、自检 | implementation-plan、role-developer、development-principles、code-standards |
| **Review** | Code Review、方案评审、PRD 评审 | role-developer + code-standards；role-architect；role-product-designer |
| **发布** | 提交、发布说明 | 建议 commit 信息与需求/任务关联；可选 release-notes 类 skill |

- **（可选）项目记忆**：在业务仓维护 `memory/` 时，可在开发与协作阶段让 AI 会话前后读/写 project state，以保持跨会话一致性；详见上文 1.5。

---

## 三、如何避免「技能漂移」

- **单一真相源**：本仓（模板仓）为原则与 Skills 的**源头**；业务仓中的 Skills 应从本仓拷贝或同步，避免在业务仓长期独立修改后与本仓脱节。
- **同步方式**（任选其一）：
  1. **手动拷贝**：定期从本仓拉取最新 `.cursor/skills/` 下对应目录，覆盖业务仓同名目录。
  2. **git submodule**：将本仓作为 submodule 挂到业务仓（如 `vendor/ai-methodology`），业务仓 `.cursor/skills/` 下放符号链接或脚本，指向 submodule 内对应 skill。
  3. **git subtree**：将本仓的 `.cursor/skills/` 以 subtree 方式合并到业务仓，定期 `git subtree pull` 更新。
- **业务专属 skill**：仅在业务仓使用的 skill 可放在业务仓 `.cursor/skills/` 下，命名时与模板仓 skill 区分（如加业务前缀），避免覆盖。

---

## 四、千岛湖溯源 Demo 作为参考

- 本仓中的 **projects/qiandao-lake-traceability-demo/** 是按本方法论落地的样板工程。
- 对应文档：PRD（docs/product）、技术方案（docs/architecture）、工作量与风险（docs/product）。
- 在业务仓落地新项目时，可参照「PRD → 技术方案 → 任务拆解 → 实现 → 评审」的路径，并结合上表选择 Skills。

---

**文档版本**：v0.1  
**维护**：随本仓结构或流程变更更新。
