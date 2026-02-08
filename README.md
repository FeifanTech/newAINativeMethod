# AI-native 研发方法论与可复用技能库

本仓库是 **AI-native 研发方法论与 Cursor Skills 的模板仓 / 基线仓**，不是业务线上代码仓。

## 内容概览

- **原则与规范**：架构、产品、开发各有一套原则与评审检查清单。
- **文档模板**：PRD、技术方案、工作量与风险分析等，位于 `docs/` 下按类型拆分。
- **Cursor Skills**：`.cursor/skills/` 下按 core / product / architecture 分类，供 Cursor 匹配使用。
- **样板工程**：`projects/` 下为按方法论落地的 Demo（如千岛湖溯源 demo）。

## 结构速览

```
docs/architecture/   # 技术方案、架构方法论
docs/product/       # PRD、产品文档、工作量与风险
docs/process/       # 流程、规范、采纳指南
.cursor/skills/     # Cursor 技能（core / product / architecture）
projects/           # 样板 Demo
CURSOR.md           # 本仓与 Cursor 的约定
```

## 快速开始

1. 阅读 **docs/overview.md** 了解「为何要、结构、如何落地」。
2. 阅读 **CURSOR.md** 了解在本仓中 Cursor/AI 的定位与允许范围。
3. 若要在业务仓复用：见 **docs/process/adopt-this-project-in-your-repo.md**。

## 千岛湖溯源示例

- PRD：`docs/product/QIANDAO_LAKE_FISHERY_TRACEABILITY_PRD.md`
- 技术方案：`docs/architecture/QIANDAO_LAKE_TRACEABILITY_TECH_SOLUTION.md`
- Demo：`projects/qiandao-lake-traceability-demo/`
