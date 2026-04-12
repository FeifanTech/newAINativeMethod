# 多人协作规范

> 本文档说明在 AI-native 研发方法论下，如何进行多人协作。
> 
> 适用于中大型项目，团队规模 5+ 人。

---

## 与项目原则的对齐

本规范遵循 [approach.md](../../RFC/ai_native_org/approach.md) 与 AI-DLC（[RFC-ai-dlc-implementation.md](../../RFC/ai-dlc/RFC-ai-dlc-implementation.md)）的约定：

- **契约优先**：Human Gate、memory/ 写入时机与格式与基线仓约定一致；产出/记录须落入 memory/ 或约定文档。
- **记忆层是底座**：需求决策 → `memory/product.md`，技术决策 → `memory/decisions.md`，工程约定 → `memory/engineering.md`，变更 → `memory/changelog.md`；决策落盘可先写 Proposed，负责人确认后移至 Accepted（与 decisions 约定一致）。
- **AI 建议、人确认**：所有 AI 产出须经 Human Gate 确认后落盘；不得未经审核即合并或发布。
- **Human Gate 与 Stage**：需求/设计阶段的「评审通过」对应 AI-DLC 的 **Mob Elaboration**（计划/方案批准）；开发阶段的 L1/L2 审核对应 **Mob Construction**（执行结果审查）。执行任一 Stage 时须加载对应 Skill（见 [using-skills](../../.cursor/skills/using-skills/SKILL.md)）。
- **可追溯**：Commit 信息或 PR 描述建议带任务 ID / Plan-ID / 需求编号，便于与 memory/、发布说明关联。

---

## 团队结构

### 角色与职责

| 角色 | 人数 | 职责 |
|------|------|------|
| **需求组** | 1 人 | 负责 PRD 编写、需求澄清、验收标准定义 |
| **设计组** | 1 人 | 负责技术方案、架构设计、接口定义 |
| **开发组** | 4 人 | 负责代码实现、Code Review、测试 |
| **L1 Human Gate** | 每个开发小组 1 人 | 代码规范、接口设计、任务粒度 |
| **L2 Human Gate** | 1 人 | 架构评审、技术选型、跨模块决策 |

### 分组建议

```
开发组(4人) = 小组A(2人) + 小组B(2人)
    ↓
L1 Human Gate = 小组长A + 小组长B
```

**说明**：角色可按实际人手兼任（如需求+设计同一人），但职责边界须清晰；谁负责 PRD 评审通过、谁负责方案评审通过、谁做 L1/L2 审核须在项目内明确。

---

## Human Gate 分层

### L1: 小组 Human Gate

| 项目 | 说明 |
|------|------|
| **角色** | 小组长 / 资深工程师 |
| **决策范围** | 代码规范、接口设计、任务粒度、Code Review |
| **通过规则** | 各自负责自己小组，通过即可进入下一阶段 |

### L2: 架构 Human Gate

| 项目 | 说明 |
|------|------|
| **角色** | 架构师 / Tech Lead（通常 1 人） |
| **决策范围** | 架构方案、技术选型、跨模块决策、外部对接 |
| **通过规则** | 需 L2 确认后才能合并（任务分级见下方） |

### 任务分级（P0/P1）

为避免 L2 成为瓶颈，采用任务分级制度：

| 级别 | 定义 | Human Gate |
|------|------|------------|
| **P0** | 架构级：技术选型、跨模块接口、外部对接、新增服务 | L2 确认后才能合并 |
| **P1** | 普通开发：单模块功能、Bugfix、常规优化 | L1 确认后即可合并 |

### L2 审核策略（避免单点瓶颈）

- **异步审核**：P0 任务先由 L1 初步评估，L2 异步审核
- **时间盒**：L2 每周安排固定时间集中审核（如每周二、四）
- **决策下沉**：非关键决策 L1 可先行判断，后续补报备

### 什么情况需要 L2

- P0 级别任务（见上方任务分级）
- 涉及架构变更
- 涉及安全/合规

---

## 阶段流转

```
需求组 (1人)    设计组 (1人)    开发组 (4人)
    ↓               ↓                ↓
 PRD 编写   ──→  技术方案   ──→   代码实现
    ↓               ↓                ↓
 PRD 评审        方案评审        L1 Code Review
    ↓               ↓                ↓
 L1+产品        L2 架构          P0:L2 审核
   负责人                           P1:直接合并
    ↓               ↓                ↓
 同步            同步             同步
 memory/        memory/          memory/
 product.md    decisions.md     engineering.md
    ↓               ↓                ↓
 交接→设计      交接→开发       合并到主分支
```

### P1 任务（L1 确认即可）

```
开发完成 → L1 Code Review → 合并到主分支
                              ↓
                     L2 异步抽查（非必经；若发现严重问题走修复 PR 或回滚）
```

**说明**：P1 任务经 L1 确认即视为可合并，不要求 L2 审完才完成；L2 可定期抽查，若发现架构/合规等严重问题，通过新 PR 修复或按团队约定回滚，避免「P1 也要等 L2」造成瓶颈。

---

### 交接规则

1. **需求 → 设计**：PRD 评审通过后，需求组将PRD + 需求澄清纪要交接给设计组
2. **设计 → 开发**：技术方案评审通过后，设计组将方案 + 接口定义交接给开发组
3. **每个交接点都是 Human Gate**

---

## Context 同步机制

### 同步内容

| 同步内容 | 同步位置 | 触发时机 |
|----------|----------|----------|
| 需求决策 | `memory/product.md` | PRD 评审通过后 |
| 技术决策 | `memory/decisions.md` | 技术方案评审通过后（可先写 Proposed，L2 或负责人确认后移至 Accepted） |
| 工程约定 | `memory/engineering.md` | 详细设计/Code Review 后 |
| 变更记录 | `memory/changelog.md` | 每次任务完成后 |

**可追溯**：Commit 信息或 PR 描述建议带任务 ID、Plan-ID 或需求/Issue 编号，便于与 memory/、Release Notes 关联。

### 同步流程

```
Human Gate 通过
    ↓
更新对应 memory/ 文件
    ↓
通知相关人（邮件/群消息）
    ↓
（可选）每日站会简单同步
```

---

## Sprint 节奏

### 双周 Sprint 示例

| 时间 | 活动 |
|------|------|
| **Sprint 第1天** | Sprint Planning（任务拆解、认领） |
| **第2-5天** | 需求/设计/开发并行 |
| **第5天** | L2 Human Gate 集中审批（如需要） |
| **第6-9天** | 开发 + Code Review |
| **第10天** | Sprint Review + Retrospective |

### Human Gate 节奏

- **L1**：随时可审（开发过程中）
- **L2**：每周三集中审批一次（如需）

---

## Skills 变更流程

### 修改规范

```
修改 Skill
    ↓
创建 PR
    ↓
Owner Review（Owner 见 [SKILLS_OWNERS.md](./SKILLS_OWNERS.md) 中该 Skill 对应负责人）
    ↓
合并 + 更新 [SKILLS_CHANGELOG.md](./SKILLS_CHANGELOG.md)
    ↓
通知所有使用者
```

### 冲突处理

- 如果多人同时修改同一 Skill，先提交者合并，后提交者 rebase
- 重大变更（如红旗清单、触发条件、默认动作）建议 L2 或该 Skill Owner 所在组负责人确认

---

## 任务管理

### 任务拆解原则

- 每个任务 1-2 天完成
- 明确依赖关系
- 任务必须有明确验收标准

### 任务状态

| 状态 | 说明 |
|------|------|
| **待处理** | 已规划，未开始 |
| **进行中** | 正在开发 |
| **待审核** | AI 产出已完成，等待 Human Gate |
| **已完成** | Human Gate 通过 |

---

## 常见问题

### Q1: L2 架构师只有 1 人忙不过来怎么办？

- 采用轮值制，3-4 人轮值审批
- 非紧急问题可以积攒到每周集中处理
- 紧急问题可先由 L1 兜底，后续补 L2 确认

### Q2: 如何避免重复工作？

- 任务认领后，在群里公告
- 使用共享看板（如 GitHub Projects）
- 每日站会同步进度

### Q3: AI 产出质量不一致怎么办？

- 统一使用本仓模板（`docs/product/`、`docs/architecture/` 下 PRD/技术方案模板）
- 使用本仓 **Skills** 约束 AI 产出：每次响应前执行 [using-skills](../../.cursor/skills/using-skills/SKILL.md) 的检查，按任务类型加载 [product-design-principles](../../.cursor/skills/product-design-principles/SKILL.md)、[architecture-principles](../../.cursor/skills/architecture-principles/SKILL.md)、[code-standards](../../.cursor/skills/code-standards/SKILL.md) 等；多步 Agent / 工具链 / 生产可靠性场景叠加 [harness-engineering](../../.cursor/skills/harness-engineering/SKILL.md)；触达红旗清单须停止并交人决策
- Code Review 严格化，与 development-principles、code-standards 检查清单对齐

### Q4: 如何追踪 AI 产出的任务？

- 在任务卡片中标记 `AI草稿` Tag
- AI 产出必须经过人工审核才能标记完成

---

## 相关文档

- [approach.md](../../RFC/ai_native_org/approach.md) - 组织 AI-Native 思路与原则
- [RFC-ai-dlc-implementation.md](../../RFC/ai-dlc/RFC-ai-dlc-implementation.md) - AI-DLC 落地与 Human Gate/Stage 约定
- [QUICK_START.md](./QUICK_START.md) - 快速上手指南
- [SKILLS_OWNERS.md](./SKILLS_OWNERS.md) - Skills 维护与 Owner 列表
- [SKILLS_CHANGELOG.md](./SKILLS_CHANGELOG.md) - Skills 变更记录
- [CURSOR_SKILLS_GUIDE.md](./CURSOR_SKILLS_GUIDE.md) - Cursor Skills 使用指南
