# 飞书 + GitHub 工作流（流程卡）

> 背景与取舍见 `RFC/feishu-github-flow/RFC-feishu-github-flow.md`。本文是可直接执行的一页流程。  
> 总览图见 [QUICK_START.md](./QUICK_START.md) §2。

```mermaid
graph TD
  subgraph Feishu [飞书 协作界面]
    G[一需求一群]
    Card[需求卡公告]
    Talk[澄清 评审 放行通知]
  end

  subgraph GitHubSide [GitHub 交付真相]
    Issue[Issue 即需求卡]
    PR[PR 与验证证据]
    CI[CI 与 Review]
  end

  subgraph GitAssets [Git 资产]
    Spec[docs Spec 与 PRD]
    Mem[memory 决策与 changelog]
  end

  G --> Card
  Card --> Issue
  Talk --> Spec
  Spec --> PR
  PR --> CI
  CI --> Mem
  Talk -.->|定稿后回写| Spec
```

```mermaid
graph TD
  G1[G1 Spec 放行] --> Code[编写草稿]
  Code --> Verify[自验证]
  Verify -->|未通过| Code
  Verify -->|通过| G2[G2 代码放行]
  G2 --> G3[G3 发布放行]
  G3 --> Obs[上线后观察]
  Obs -->|告警或回滚| Repro[复现证据包]
  Repro --> Code
```

## 1. 建群与立项

1. 每个需求建一个飞书群，群名：`[需求] 简称 #IssueNo`。
2. 先在 GitHub 建 Issue，按 [requirement-card-template.md](./requirement-card-template.md) 填需求卡；同一张卡贴到群公告。
3. 群里只讨论这一个需求；Issue 编号是两边唯一对账键。

## 2. 复杂度分流

| 类型 | 判定 | 做法 |
|------|------|------|
| 小需求 | 预估 ≤5 人日，单模块，无数据/权限/资金变更 | 群内澄清 → AI 出方案与实现 → 人确认 → PR |
| 大需求 | >5 人日，或跨模块/跨团队，或涉及数据、权限、资金、对外接口 | 群内评审 Spec → Plan（Level 1）→ IDE 中分步实现 → PR |

例外：即使 ≤5 人日，凡涉及数据迁移、权限、资金、生产配置，一律按大需求处理。拿不准时按大需求。

## 3. 三个真人门

| 门 | 位置 | 对应机制 | 通过条件 | 证据 |
|----|------|----------|----------|------|
| G1 Spec 放行 | 飞书群 | Mob Elaboration | 验收标准可测试；范围/不做项明确；负责人在群里明确确认 | Spec/PRD 已 PR 入库（`docs/`），群里贴链接 |
| G2 代码放行 | GitHub PR | Mob Construction + Harness | 自验证全部 PASS 之后才进入；CI 全 PASS；PR 验证证据完整；至少一名真人 Review | PR 评审记录 |
| G3 发布放行 | 飞书群 | 发布 Human Gate | 发布 checklist、回滚方案、观测项齐备；按风险由指定负责人确认 | 群内确认 + changelog |

任一门出现 BLOCKED 或 UNKNOWN：停，交人决策（见 `harness-engineering` 三态门控）。

## 3.1 自验证（进 G2 之前）

编写有两种方式，产出都是草稿，都走同一套门：

- 交互式：人在 IDE 里跟 Agent 分步改。
- 后台任务：任务边界清楚时，交出草稿 PR。

自验证规则：

1. 跑测试、lint 或约定的手工步骤，把命令和结果写入 PR 模板。
2. 任一项为 BLOCKED 或 UNKNOWN：回到编写。此时不得请求 Review，也不得视为进入 G2。
3. 全部 PASS 后，在 PR 里写明建议审查重点，再请人审。

证据用来缩小审查范围。审查结论仍由人做。Agent 只使用当前调用者已有的权限。

## 3.2 故障回路（与功能需求分开）

线上告警、回滚、用户报错不在原需求里硬改，单独开修复：

1. 先收复现证据：操作路径、请求或日志、相关开关、影响范围。记在 Issue。
2. 用 `systematic-debugging` 定位根因，再出修复 PR。
3. 修复 PR 回到自验证，用同一份证据再验一次，然后进 G2。
4. 结论写入 `memory/changelog.md`。下次需求卡的「已知风险」引用它。

维护类改动（依赖升级、死代码、日志降噪）不进功能需求群。它们单独提 PR，同样先自验证再进 G2。

## 4. 哪些必须在 Git，哪些可只在飞书

必须在 Git：Spec/PRD、方案与决策（`memory/decisions.md`）、代码、验证证据、变更记录。
可只在飞书：澄清过程、临时讨论、通知提醒。
结论性内容（范围变更、验收标准调整、风险接受）必须在 24 小时内通过 PR 或 Issue 评论回写。

## 5. 收尾与沉淀

1. 发布后在 Issue 写复盘三行：做对了什么、返工点、可沉淀规则。
2. 可复用规则/踩坑，经 PR 回写 `memory/` 或对应 Skill。
3. 按 [ai-native-metrics.md](./ai-native-metrics.md) 记录四项指标。
4. 上线后的告警、回滚写入 changelog，并回链到需求卡的已知风险，供下一轮规划使用。
