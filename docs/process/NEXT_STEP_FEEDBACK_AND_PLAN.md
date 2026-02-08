# 《next_step.md》优化建议 · 可行性反馈与执行计划

> 针对 [next_step.md](./next_step.md) 中「AI-native 方法论 + 可复用技能库」优化方案的可行性评估与分阶段执行计划。

---

## 一、总体结论

| 维度 | 结论 |
|------|------|
| **方向** | 与当前仓库定位（原则 + Skills + 千岛湖溯源等 demo）高度一致，**建议采纳**。 |
| **可行性** | 大部分建议**可行**；少数需按 Cursor/本仓库现状做**微调**（见下文）。 |
| **优先级** | 建议先做「结构 + 文档 + 顶层约定」，再做「Skills 重组 + 新技能」，最后做「自动化与业务落地文档」。 |

---

## 二、分项可行性反馈

### 1. 仓库结构优化

| 建议 | 可行性 | 说明与调整 |
|------|--------|------------|
| **顶层 CLAUDE.md / CURSOR.md** | ✅ 高 | 明确「本仓是模板/方法论仓，不直接改业务代码」很有必要。当前无根目录约定文件，可新增；若团队主要用 Cursor，可保留 `CURSOR.md` 或同时保留两者并说明分工。 |
| **docs 拆成 architecture / product / process** | ✅ 高 | 现有 docs 已有多份 PRD、原则与指南，按三类拆分后更清晰。需一次性地移动文件并更新文档内引用与 README 链接。 |
| **projects/ 作为样板项目目录** | ✅ 已部分具备 | 已有 `projects/qiandao-lake-traceability-demo/`，只需在文档中明确「projects/ = 按方法论落地的 demo」，后续新增 demo 时统一放此目录即可。 |
| **Skills 拆成 core / product / architecture / traceability-demo** | ⚠️ 中 | 当前 skills 为「角色 + 原则」混合（如 role-architect、architecture-principles）。重组为 core / product / architecture 可行，但需：① 明确现有 7 个 skill 的归属；② 检查 Cursor 的 skills 加载方式是否支持子目录（若仅按名称加载则保留扁平或仅一层分类）。**建议**：先做一层子目录（如 core、product、architecture），项目专属 skill（traceability-demo）可等有明确「仅在 demo 内加载」需求时再加。 |

### 2. Skills 设计优化（三大类 + 新技能）

| 建议 | 可行性 | 说明与调整 |
|------|--------|------------|
| **产品类**：/prd-from-idea、/ai-native-principles-check、/domain-knowledge-primer | ✅ 高 | 与现有 product-design-principles、PRD 文档可衔接。可作为**新 SKILL.md** 放在 product/ 下，描述输入/输出与触发词；实现上可引用现有原则文档，避免重复。 |
| **架构类**：/data-flow-analysis、/service-impact-analysis、/design-review-checklist | ✅ 高 | 与现有 architecture-principles、技术方案文档一致。design-review-checklist 可直接复用或引用现有「评审检查清单」；data-flow、service-impact 需新写 SKILL.md 定义输入输出。 |
| **工程类**：/implementation-plan、/test-plan、/release-notes-from-commits | ✅ 高 | 与 development-principles、code-standards 呼应。可作为 core/ 或 process/ 下新技能，对多仓库/多服务拆任务、测试计划、Release Notes 模板很有用。 |
| **项目专属**：traceability-demo 专属 skill | ⚠️ 低优先级 | 当前 demo 体量小，专属 skill 收益有限；可等 demo 扩展或接入真实业务后再加，避免技能膨胀。 |

### 3. 大团队流程对齐（业务仓库如何用本仓）

| 建议 | 可行性 | 说明与调整 |
|------|--------|------------|
| **docs/process/adopt-this-project-in-your-repo.md** | ✅ 高 | 纯文档工作，说明「复制 CLAUDE.md、复制 Skills 子集、使用 PRD/设计模板、可选 submodule/subtree 同步」即可。 |
| **标准工作流**：需求→设计→开发→Review 各阶段用哪些 skill | ✅ 高 | 与现有「原则 + 角色」可对应，在 adopt 文档或 overview 中列成表格/流程图即可。 |
| **技能漂移**：源头在模板仓、业务仓定期同步 | ✅ 高 | 文档中明确「本仓为单一真相源」；同步方式写清可选方案（手动拷贝 / git submodule / subtree），不强制工具。 |

### 4. 自动化与 GitHub Actions

| 建议 | 可行性 | 说明与调整 |
|------|--------|------------|
| **.github/workflows/claude-review.yml 示例** | ⚠️ 中 | 依赖「Claude Code GitHub Action」的可用性与计费；若团队主要用 Cursor 而非 Claude Code，可改为「Cursor / 其它 AI 的 PR 审查」示例或仅提供文档示例（见下）。 |
| **docs 中 github-actions-example.md** | ✅ 高 | 不依赖实际跑通，在 docs/process 或 docs/examples 下写一份示例配置 + 需替换变量说明即可，便于业务仓拷贝。 |
| **建议** | — | 若暂不启用 Claude Code Action，可先只做「文档示例 + 注释说明」，待有明确 CI 需求再在本仓或业务仓真正加 workflow。 |

### 5. 文档层：总览与故事线

| 建议 | 可行性 | 说明与调整 |
|------|--------|------------|
| **README-zh.md 或 docs/overview.md** | ✅ 高 | 建议用 **docs/overview.md**（或根目录 README.md 增补）统一说明：为何要 AI-native 方法论仓、本仓结构、如何在新项目落地、千岛湖 demo 示例路径。与 next_step 第五部分一一对应即可。 |

---

## 三、执行计划（分阶段）

### 阶段一：结构 + 顶层约定 + 总览文档（优先，约 1～2 天）

| 序号 | 任务 | 产出 | 备注 |
|------|------|------|------|
| 1.1 | 新增根目录 AI/仓库约定文件 | `CURSOR.md` 或 `CLAUDE.md`（或两者） | 写清：本仓定位、面向场景、AI 只做模板/草稿不直接改业务代码 |
| 1.2 | 拆分 docs 目录 | `docs/architecture/`、`docs/product/`、`docs/process/` | 将现有 PRD、原则、指南按类型移动；更新内部链接与 README |
| 1.3 | 明确 projects/ 约定 | 在 README 或 overview 中说明 | projects/ = 按方法论落地的 demo，已有 qiandao-lake-traceability-demo |
| 1.4 | 新增总览文档 | `docs/overview.md` 或扩充 `README.md` | 四部分：为何要方法论仓、仓库结构、如何落地、千岛湖 demo 示例 |

**完成标准**：新人通过 README + overview 能理解「这是什么仓、怎么用」。

### 阶段二：Skills 重组 + 新技能（约 2～3 天）

| 序号 | 任务 | 产出 | 备注 |
|------|------|------|------|
| 2.1 | Skills 目录重组 | `.cursor/skills/core/`、`product/`、`architecture/` | 将现有 7 个 skill 按性质迁入对应子目录；核对 Cursor 加载方式 |
| 2.2 | 产品类新技能（可选 1～2 个先做） | 如 `product/prd-from-idea`、`product/ai-native-principles-check` 的 SKILL.md | 输入/输出、触发词、引用现有 PRD 模板与原则 |
| 2.3 | 架构类新技能（可选 1～2 个先做） | 如 `architecture/design-review-checklist`、`architecture/data-flow-analysis` 的 SKILL.md | 引用现有架构原则与评审清单 |
| 2.4 | 工程类新技能（可选 1 个先做） | 如 `core/implementation-plan` 或 `core/test-plan` 的 SKILL.md | 与 development-principles 对应 |

**完成标准**：至少完成目录重组 + 2～3 个新 SKILL.md，且现有 skill 仍可被正常引用。

### 阶段三：业务落地文档 + 流程说明（约 1 天）

| 序号 | 任务 | 产出 | 备注 |
|------|------|------|------|
| 3.1 | 业务仓采纳指南 | `docs/process/adopt-this-project-in-your-repo.md` | 在业务仓要做的事、建议工作流、技能同步方式 |
| 3.2 | 标准工作流与 Skills 对应表 | 同上或 overview | 需求/设计/开发/Review 各阶段用哪些 skill，表格或流程图 |
| 3.3 | 技能漂移与同步说明 | 写在 adopt 文档中 | 本仓为真相源，业务仓同步方式（拷贝 / submodule / subtree） |

**完成标准**：业务团队能按文档在自家仓库「复制约定 + 复制 Skills 子集 + 套用模板」。

### 阶段四：自动化示例（按需，约 0.5～1 天）

| 序号 | 任务 | 产出 | 备注 |
|------|------|------|------|
| 4.1 | GitHub Actions 示例文档 | `docs/process/github-actions-example.md` 或 `docs/examples/` 下 | 示例 claude-review.yml（或 Cursor/通用 PR 审查）+ 需替换变量 |
| 4.2 | 本仓实际 workflow（可选） | `.github/workflows/claude-review.yml` 或类似 | 仅当确定使用 Claude Code Action 或对应 CI 时再加；否则可略过 |

**完成标准**：文档中有可拷贝的 workflow 示例；若启用 CI，PR 触发与审查流程可跑通。

---

## 四、风险与注意点

| 风险 | 缓解 |
|------|------|
| **docs 移动后链接失效** | 移动后全局搜索相对路径引用（如 `docs/xxx`、`](./xxx`），批量更新；README/overview 中链接用相对路径并复核。 |
| **Skills 重组后 Cursor 找不到** | 先确认 Cursor 对 `.cursor/skills/` 子目录的加载规则（文档或实测）；若只认扁平，则保留一层分类或暂不拆子目录，仅在 SKILL.md 的 description 中标注类型。 |
| **新技能过多导致维护成本高** | 优先做「与现有原则/文档强绑定」的 2～3 个新技能，其余按需迭代；每个 SKILL.md 保持「name + description + 典型输入输出 + 引用文档」即可。 |
| **Claude Code Action 与团队工具链不一致** | 自动化阶段以「文档示例」为主，实际 workflow 标注为可选，避免强依赖。 |

---

## 五、建议优先级汇总

| 优先级 | 内容 | 预计投入 |
|--------|------|----------|
| **P0** | 阶段一：根目录约定 + docs 拆分 + projects 约定 + 总览文档 | 1～2 天 |
| **P1** | 阶段二：Skills 目录重组 + 2～3 个新 SKILL.md | 2～3 天 |
| **P1** | 阶段三：adopt-this-project-in-your-repo.md + 标准工作流 | 1 天 |
| **P2** | 阶段四：GitHub Actions 示例文档；实际 workflow 按需 | 0.5～1 天 |

整体约 **5～7 个工作日** 可完成 P0～P1，形成「结构清晰、可对外说明、可被业务仓复用」的模板仓；P2 视是否接入 CI 再定。

---

**文档版本**：v0.1  
**依据**：docs/next_step.md 优化建议 + 当前仓库现状  
**维护**：执行过程中若结构调整或 Cursor/Skills 行为有变化，可更新本计划。
