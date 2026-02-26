# 标杆案例：千岛湖全鱼品溯源平台

> 本案例展示如何应用 AI-native 研发方法论完成一个真实业务项目。
> 
> 这是一个**示范性构建**的案例，基于现有文档还原 AI-native 工作流程，展示每个阶段使用 Skills 的产出、审核点和决策过程。

---

## 与项目设计原则的对齐

本案例遵循 [approach.md](../../../RFC/ai_native_org/approach.md) 与 [RFC-ai-dlc-implementation.md](../../../RFC/ai-dlc/RFC-ai-dlc-implementation.md) 的约定：

- **契约优先**：各阶段产出与 memory/、docs 约定一致；Human Gate 明确，决策落盘到 memory/。
- **记忆层是底座**：需求决策→product、技术决策→decisions、工程约定→engineering、变更→changelog（见 4.3 踩坑记录中的经验沉淀）。
- **AI 建议、人确认**：PRD/技术方案/任务拆解均为 AI 草稿，经 Human Gate 评审后定稿；踩坑与决策记录到 memory/。
- **可追溯**：案例中阶段流转、审核点、决策点均有记录；实际项目建议 Commit/PR 带任务 ID 或 Plan-ID。
- **实现与 Demo 关系**：第 4 章任务拆解与实施描述的是「计划中的后端实现路径」；本仓实际可运行 Demo 见 [projects/qiandao-lake-traceability-demo](../../projects/qiandao-lake-traceability-demo)（前端 Demo，localStorage），与 PRD/技术方案一致，用于验证闭环与交互。

---

## 案例概述

| 项目 | 内容 |
|------|------|
| **项目名称** | 千岛湖全鱼品溯源平台 |
| **业务背景** | 为商达公用集团（千岛湖智慧鱼谷）构建可验真、不可篡改、多方共治的全鱼品溯源体系 |
| **技术选型** | 蚂蚁链（AntChain）存证 + 链上核验 |
| **覆盖范围** | 种源/投放、养殖/捕捞、加工、检测 + 蚂蚁数科流通系统对接 |
| **养殖模式** | 保水渔业（湖泊天然有机）+ RAS 工厂化循环水 |

---

## 方法论应用概览

| 阶段 | 使用的 Skill | 产出 |
|------|--------------|------|
| 需求分析 | `product-design-principles` | PRD 文档 |
| 架构设计 | `architecture-principles` | 技术方案 |
| 工作量评估 | `implementation-plan` | 工作量与风险分析 |
| 实施 | `development-principles` + `code-standards` | Demo 实现 |
| 复盘 | - | 经验总结 |

---

## 目录结构

```
docs/case-studies/qiandao-lake-traceability/
├── README.md                    # 本文件，案例索引
├── 1_overview.md               # 项目概述
├── 2_requirements/
│   ├── 2.1_initial_request.md  # 原始需求
│   ├── 2.2_ai_prd_draft.md     # AI PRD 草稿
│   ├── 2.3_review.md            # 审核与反馈
│   └── 2.4_final.md            # 定稿
├── 3_architecture/
│   ├── 3.1_design_request.md   # 设计需求
│   ├── 3.2_ai_tech_draft.md    # AI 技术方案草稿
│   ├── 3.3_review.md            # 审核与反馈
│   └── 3.4_final.md            # 定稿
├── 4_implementation/
│   ├── 4.1_task_breakdown.md   # 任务拆解
│   ├── 4.2_code_generation.md  # 代码生成
│   └── 4.3_issues.md          # 踩坑记录
├── 5_review/
│   └── 5.1_retrospective.md    # 复盘总结
└── assets/                      # 图表/截图
```

---

## 如何使用本案例

1. **学习流程**：按目录顺序阅读，理解 AI-native 方法论如何落地
2. **参考产出**：查看各阶段的产出格式，作为自己项目的模板
3. **踩坑预警**：关注 `4.3_issues.md` 章节，了解可能遇到的问题及处理方式

---

## 使用的 Skills

- [using-skills](../../../.cursor/skills/using-skills/SKILL.md) - 响应前检查并加载相关 Skill（与 CURSOR.md 约定一致）
- [product-design-principles](../../../.cursor/skills/product-design-principles/SKILL.md)
- [architecture-principles](../../../.cursor/skills/architecture-principles/SKILL.md)
- [implementation-plan](../../../.cursor/skills/implementation-plan/SKILL.md)
- [development-principles](../../../.cursor/skills/development-principles/SKILL.md)
- [code-standards](../../../.cursor/skills/code-standards/SKILL.md)
- [systematic-debugging](../../../.cursor/skills/systematic-debugging/SKILL.md) - 踩坑与故障排查（见 4.3、5.1）

---

## 相关文档

- [approach.md](../../../RFC/ai_native_org/approach.md) - 组织 AI-Native 思路与原则
- [multi-person-collaboration.md](../../process/multi-person-collaboration.md) - 多人协作规范（Human Gate 分层、memory/ 同步）
- [projects/qiandao-lake-traceability-demo](../../../projects/qiandao-lake-traceability-demo) - 本仓可运行前端 Demo

---

> 📌 **提示**：本案例为**示范性构建**，展示了 AI-native 方法论的理想工作流程。真实项目可根据实际情况调整流程深度。
