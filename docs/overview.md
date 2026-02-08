# AI-native 研发方法论仓库 · 总览

## 一、我们为什么要这个仓库？

### 背景

- **多团队、多系统、数据密集型业务**：传统研发流程很难把 AI 稳定嵌入到需求、设计、开发、评审各环节。
- **原则与技能分散**：架构原则、产品原则、开发规范若只存在于口头或零散文档，AI 与人都难以一致执行。
- **可复用模板缺失**：每个项目从零写 PRD、技术方案、评审清单，成本高且质量不稳定。

### 目标

用一套**可复制的原则、Skills 和流程**，把 AI 稳定嵌入日常研发：

- **原则**：架构、产品、开发各有一套原则与检查清单，供人与 AI 共同遵循。
- **Skills**：Cursor 可匹配的「技能包」（.cursor/skills），按角色与场景触发，产出规范格式的草稿与评审结论。
- **模板与 Demo**：PRD、技术方案、工作量与风险分析等模板，以及按方法论落地的样板工程（projects/），供业务仓库拷贝或参考。

---

## 二、仓库结构说明

| 目录 | 说明 |
|------|------|
| **docs/architecture/** | 架构与数据密集型应用方法论、技术方案、ADR 等。 |
| **docs/product/** | PRD、产品文档、工作量与风险分析等。 |
| **docs/process/** | 研发流程、Code Review、AI 使用规范、Skills 指南、业务仓采纳指南等。 |
| **.cursor/skills/** | 与上述原则对应的 Skills 集合（core / product / architecture），供 Cursor 匹配使用。 |
| **projects/** | 按方法论落地的 **Demo / 样板工程**，每个子目录一个样板项目。 |
| **CURSOR.md** | 本仓与 Cursor 的约定：定位、允许/不允许 AI 做的事、结构速览。 |

---

## 三、如何在新项目中落地这套方法

1. **复制或定制约定文件**：从本仓拷贝 `CURSOR.md` 到业务仓库根目录，按业务调整「允许/不允许」与结构说明。
2. **选择并复制 Skills 子集**：从 `.cursor/skills/` 中挑选需要的技能（如 core、product、architecture 中的部分），拷贝到业务仓的 `.cursor/skills/`；业务专属技能可自行新增。
3. **套用文档模板**：使用 `docs/product/` 下的 PRD 模板、`docs/architecture/` 下的技术方案结构，在业务仓的 docs 中生成 PRD、技术方案、工作量与风险等。
4. **（可选）配置自动化**：参考 `docs/process/github-actions-example.md` 在业务仓配置 PR 审查等 CI；本仓为 Skills 与原则的「单一真相源」，业务仓可定期同步（拷贝 / submodule / subtree）。

更细的步骤见 **docs/process/adopt-this-project-in-your-repo.md**。

---

## 四、千岛湖溯源 Demo 作为示例

- **位置**：`projects/qiandao-lake-traceability-demo/`
- **用到的原则与文档**：产品设计原则（PRD）、技术架构原则（技术方案）、工作量与风险分析。
- **对应文档**：
  - 产品：`docs/product/QIANDAO_LAKE_FISHERY_TRACEABILITY_PRD.md`
  - 架构：`docs/architecture/QIANDAO_LAKE_TRACEABILITY_TECH_SOLUTION.md`
  - 工作量与风险：`docs/product/QIANDAO_LAKE_TRACEABILITY_EFFORT_AND_RISKS.md`
- **示范路径**：PRD → 技术方案 → 工作量与风险 → Demo 实现；各阶段可由 Cursor 结合对应 Skills 生成草稿，人工审阅后采纳。

---

**文档版本**：v0.1  
**维护**：随本仓结构或流程变更更新本总览。
