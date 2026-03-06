# 遗留项目渐进接入模板

> 本模板用于已有代码仓、已有流程、已有历史负担的项目。目标不是一次性导入全部 AI-native 机制，而是在不打断现有交付的前提下，分阶段接入 Skills、memory 和统一角色入口。

## 适用场景

- 已有业务系统，代码规模较大，模块边界或文档不完整。
- 团队成员较多，AI 使用方式不统一，输出质量波动明显。
- 现有流程已经存在 PR、Review、发布机制，不希望一次性重构研发流程。

## 原则

- **先约束 Review，再扩展生成**：先让 AI 帮你减少错误，再逐步让 AI 参与设计和实现。
- **先沉淀约定，再沉淀历史**：优先记录当前仍有效的工程约定和关键决策，而不是试图一次补齐全部历史。
- **先接入口，再接流程**：优先统一角色 prompt 入口，再推动团队采用完整角色工作流。
- **每一阶段都可独立停下**：每个阶段都应形成可见收益，不依赖后续阶段才能生效。

## 阶段 0：最低成本接入

### 目标

- 团队先使用统一的基础规范，不改动既有分工与发布流程。

### 建议接入内容

- `CURSOR.md`
- `.cursor/skills/using-skills/`
- `.cursor/skills/development-principles/`
- `.cursor/skills/code-standards/`
- `.cursor/skills/role-developer/`
- `.cursor/skills/roles.yaml`
- `scripts/build-role-prompt.sh`

### 执行动作

1. 运行 `scripts/sync-skills.sh` 或手工复制上述文件。
2. 生成开发角色入口：`bash scripts/build-role-prompt.sh developer --no-memory`。
3. 在 Code Review、缺陷修复、常规需求开发中统一使用该入口。

### 完成标准

- 团队至少有一类任务统一使用 `developer` 角色入口。
- Review 结论开始按统一检查项输出，而不是自由发挥。

## 阶段 1：接入最小项目记忆

### 目标

- 让 AI 能稳定复用团队约定和关键决策，减少跨人、跨会话漂移。

### 最小 memory 结构

```text
memory/
  decisions.md
  engineering.md
```

### 建议内容

- `memory/decisions.md`
  - 记录仍然有效的架构约束、外部依赖边界、不能轻易改动的技术选择。
- `memory/engineering.md`
  - 记录启动命令、测试命令、分支策略、目录约定、常见禁忌。

### 执行动作

1. 先由负责人补齐最近仍有效的 5 到 10 条约定，不追求历史完整。
2. 改用：`bash scripts/build-role-prompt.sh developer`。
3. 将 AI 发现的新约定或确认后的决策继续写入 `memory/`。

### 完成标准

- 新成员或新会话能从 `memory/` 快速恢复项目上下文。
- 相同问题不再反复解释。

## 阶段 2：接入架构与需求协作

### 目标

- 让 AI 不只参与编码，还参与需求评审和方案评审。

### 建议新增内容

- `.cursor/skills/product-design-principles/`
- `.cursor/skills/role-product-designer/`
- `.cursor/skills/architecture-principles/`
- `.cursor/skills/role-architect/`
- `memory/product.md`

### 执行动作

1. 新需求先走 `product-designer` 角色。
2. 涉及跨模块、选型、接口变更的事项走 `architect` 角色。
3. 方案评审通过后，将结论写入 `memory/decisions.md`。

### 完成标准

- 新需求与技术方案的输出结构稳定一致。
- 跨模块改动开始有明确决策沉淀，而不是只留在聊天记录或 PR 评论里。

## 阶段 3：接入文档回写与发布汇总

### 目标

- 把 AI 产出从“会话内建议”推进到“仓库内可追溯资产”。

### 建议新增内容

- `.cursor/skills/doc-reflector/`
- `.cursor/skills/release-notes-from-commits/`
- `.cursor/skills/decisions-summary/`
- `memory/changelog.md`

### 执行动作

1. 代码合并后，用 `doc-reflector` 回写 PRD/架构文档。
2. 每次迭代结束，用 `release-notes-from-commits` 生成发布说明草稿。
3. 定期用 `decisions-summary` 汇总 Accepted 决策。

### 完成标准

- 文档与代码不再长期漂移。
- 决策、变更、发布可以被追溯和复盘。

## 新项目与遗留项目的差异

| 项目类型 | 推荐方式 |
|----------|----------|
| **全新项目** | 直接采用 `roles.yaml` + 全量角色 Skills + `memory/` 四件套（product / decisions / engineering / changelog） |
| **遗留项目** | 从 `developer` 角色和最小 `memory/` 开始，先统一 Review 和工程约定，再逐步接入产品/架构角色 |

## 推荐的角色入口策略

- **新项目**：默认使用正式版 [roles.yaml](../../.cursor/skills/roles.yaml)。
- **遗留项目**：第一阶段只强制 `developer`；`architect` 和 `product-designer` 在新增需求、重构、外部接口变更时再启用。

## 风险提示

- 不要一开始就要求所有任务、所有成员、所有阶段都切到完整工作流，否则阻力会大于收益。
- 不要在 `memory/` 初始阶段追求补齐所有历史资料；优先记录还会继续影响开发的事实。
- 不要让 AI 直接替代 Human Gate；AI 的价值在于放大审查、总结、拆解、对齐，而不是替代负责人做最终判断。

## 可直接复用的最小落地清单

1. 同步 `CURSOR.md`、`using-skills`、`development-principles`、`code-standards`、`role-developer`、`roles.yaml`、`build-role-prompt.sh`。
2. 新建 `memory/engineering.md` 和 `memory/decisions.md`。
3. 团队统一使用 `bash scripts/build-role-prompt.sh developer`。
4. 先在 PR Review、Bugfix、常规开发中使用 2 周，再决定是否接入产品和架构角色。

