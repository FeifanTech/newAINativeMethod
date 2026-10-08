# RFC：飞书 + GitHub 的 AI-native 全流程约定

- 状态：Draft
- 来源：AliExpress/淘宝天猫海外 AI Native 实践、阿里《AI Native 研发范式实践手册》（只借约定与判定规则，不借平台）

## 1. 目标与非目标

目标：把「需求在飞书澄清 → AI 出初稿 → 人确认 → GitHub 交付与门禁 → 放行 → 沉淀」固化为可复用约定，复用本仓既有 AI-DLC、Human Gate、`harness-engineering`、`memory/`。

非目标（本期不做）：数字员工平台、Sandbox、多角色 AI 分身、飞书机器人自动化、度量看板、用飞书文档替代 Git 中的 Spec。

## 2. 分工（硬规则）

| 载体 | 负责 | 真相源 |
|------|------|--------|
| 飞书 | 需求群讨论、澄清、评审沟通、放行通知 | 讨论记录（过程） |
| GitHub | 代码、PR、CI/门禁、Issue | 交付物与门禁结果（唯一真相） |
| 本仓 / 业务仓 `docs/`、`memory/` | Spec、决策、变更记录、Skills | 沉淀资产 |

硬规则：**群里定稿的结论必须回写 Git（PR），否则不算资产。**

## 3. 借鉴映射

| 外部实践 | 本仓落点 |
|----------|----------|
| 一需求一群 | `docs/process/feishu-github-workflow.md` §1 |
| ≤5 人日群内闭环 / 大需求群评审+IDE 编码 | 同上 §2 分流 |
| 三个真人门 | 同上 §3，对应 Mob Elaboration / Mob Construction / 发布 Human Gate |
| 需求卡 | `docs/process/requirement-card-template.md` |
| Guardrail 三态（UNKNOWN≠PASS） | `harness-engineering` Skill「三态门控」 |
| PR 带验证证据与归因 | `.github/pull_request_template.md` |
| 度量看周期与质量，不看生码率 | `docs/process/ai-native-metrics.md` |
| 知识沉淀回流 | `memory/` 经 PR 回写 |

## 4. 分阶段

- 阶段 0：本 RFC。
- 阶段 1：流程卡、需求卡。
- 阶段 2：三态门控、PR 模板、四指标（手工记录）。
- 阶段 3：真实小需求试点与复盘（待提供需求）。
- 阶段 4：机器人/自动同步/自动度量，试点有数据后再评估。

## 5. 风险

| 风险 | 对策 |
|------|------|
| 结论留在群里 | 硬规则 + PR 模板「关联需求卡」必填 |
| 复杂需求硬塞群内 | 分流阈值与例外清单 |
| 度量成负担 | 仅四指标、手工记录 |
| PR 模板被填空话 | 要求写具体命令与结果，评审抽查 |

## 6. 修订记录

- 初版：阶段 0～2 落地。
