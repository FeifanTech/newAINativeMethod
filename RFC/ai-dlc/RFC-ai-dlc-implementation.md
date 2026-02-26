# RFC：AI-DLC 落地实施需求

| 项目 | 说明 |
|------|------|
| 文档类型 | 落地需求 / 实施文件 |
| 状态 | 草案 Draft |
| 适用范围 | newAINativeMethod 基线仓及采纳该仓的组织 |
| 相关文档 | [ai-dlc-introduction.md](./ai-dlc-introduction.md)、[ai-dlc-adoption.md](./ai-dlc-adoption.md) |

---

## 一、目标与范围

### 1.1 目标

将 AWS AI-DLC（自适应、可变深度、人在回路）与现有 Cursor Skills + docs 融合，形成可执行的「Intent → Level 1 Plan → Stage + Human Gate → 可追踪」流程，使 newAINativeMethod 成为**开源可复用的 AI-DLC Workflow Scaffold / Steering 层**。

### 1.2 范围

- **在范围内**：顶层规划 Skill（ai_dlc_planner）、Plan 输入输出规范、Stage/深度与现有 Skills 的映射、Human Gate 与可追溯约定、流程文档（含示例路径）。
- **不在范围内**：改造 Cursor 本体、实现多 Agent 自动编排引擎、替代现有 PR/Code Review 工具。

### 1.3 原则约束

- **不硬编码流程**（Principle 10）：用 Stage 库 + 启发式生成 Plan，而非固定流程图。
- **深度显式**：每个 Stage 的 Light/Standard/Deep 在 Plan 中明确列出，Human Gate 时可调整。
- **AI 建议、人确认**：Plan 与执行结果均需人工批准或确认后落盘。
- **可追溯**：Plan-ID 与 Intent 可关联到 Commit/PR/决策，支持事后复盘。

---

## 二、术语与概念

| 术语 | 含义 |
|------|------|
| **Intent** | 任务意图声明（自然语言 + 可选结构化字段），作为 planner 的输入。 |
| **Level 1 Plan** | 由 planner 产出的一阶计划：建议的 Stage 列表、每 Stage 深度、Human Gate、建议使用的 Skills。 |
| **Stage** | 可组合的工作阶段，如需求澄清、设计、实现、测试、发布与运维；对应现有 Skills 或 Skill 组合。 |
| **深度 Depth** | Light / Standard / Deep，表示该 Stage 的执行力度（检查粒度、文档详细度、是否启用企业 Checklist 等）。 |
| **Human Gate** | 必须由人确认或审批的节点；通过后方可进入下一阶段或合入。 |
| **Mob Elaboration** | 人审阅并批准 Plan、补充上下文、澄清需求的环节。 |
| **Mob Construction** | AI 按 Plan 执行，人在关键 Checkpoint 审查结果并批准合入的环节。 |
| **Plan-ID** | 唯一标识一次 Level 1 Plan，用于 Commit/PR/决策追溯。 |

---

## 三、功能需求

### 3.1 顶层规划 Skill：ai_dlc_planner

**FR-1** 仓库须提供至少一个顶层 Skill（建议命名为 `ai_dlc_planner`），其职责为：

- **输入**：用户或上游提供的 Intent（见 3.2）。
- **输出**：一份结构化的 Level 1 Plan（见 3.3），包含建议 Stage、深度、Human Gate、建议 Skills、Plan-ID。

**FR-2** planner 的决策逻辑（启发式）须基于（可扩展）以下维度：

- 任务类型：新特性 / 缺陷修复 / 重构 / 架构变更 / 运维变更等。
- 风险与影响：低 / 中 / 高；影响范围（前端 / 后端 / 数据 / 生产配置等）。
- 合规与安全：是否涉及 PII、支付、合规审计等。
- 技术栈与上下文：是否已有 PRD/架构文档、测试覆盖情况等（若可获取）。

**FR-3** 第一版实现允许将启发式写在 planner 的 SKILL 描述或配套说明中；后续可拆为独立规则文件（如 YAML/JSON）由 planner 引用。

**FR-4** planner 不强制要求“自动调用”其他 Skills；产出 Plan 后由人按 Plan 选择并触发具体 Skill 即满足首版需求。

---

### 3.2 Intent 输入规范

**FR-5** Intent 须包含一段**自然语言描述**（必填），并可选择包含以下**结构化字段**（便于启发式更稳定）：

| 字段 | 说明 | 示例 |
|------|------|------|
| 类型 | 任务类型 | 新特性 / 缺陷修复 / 重构 / 架构变更 / 运维变更 |
| 影响范围 | 变更涉及的范围 | 前端 / 后端 / 数据 / 配置 / 多服务 |
| 风险 | 整体风险等级 | 低 / 中 / 高 |
| 合规/安全 | 是否涉及敏感或合规 | 无 / PII / 支付 / 审计要求等 |
| 技术栈 | 主要涉及的技术 | Java / 前端 / K8s / 数据库等 |

**FR-6** 仓库须在文档中提供至少三种 Intent 示例：新特性、缺陷修复、重构/架构变更（见附录 A）。

---

### 3.3 Level 1 Plan 输出规范

**FR-7** Level 1 Plan 须为可版本管理、可读的文档（建议 Markdown），且包含以下**必选节**：

1. **Intent 摘要**：对输入 Intent 的简要归纳及类型/风险/影响等。
2. **建议阶段与深度**：表格形式，列至少包括「阶段 Stage」「是否执行」「深度 Depth」「说明」。
3. **Human Gate**：表格形式，列至少包括「节点」「时机」「建议参与角色」「产出/记录」。
4. **建议使用的 Skills / 文档**：与当前仓 Skills、docs 的对应关系，便于执行时选用。
5. **可追溯标识**：Plan-ID 及（可选）Commit/PR 中引用方式的说明。

**FR-8** 深度取值须在计划中明确为 **Light / Standard / Deep** 之一，并可在 Human Gate（Mob Elaboration）中由人调整。

**FR-9** 仓库须提供至少一份完整的 Level 1 Plan 示例（见附录 B），对应「新特性」类 Intent。

---

### 3.4 Stage 与现有 Skills 的映射

**执行约定**：执行任一 Stage 时须加载该 Stage 对应 Skill（由 **using-skills** 元 Skill 保证；详见 CURSOR.md 与 `.cursor/skills/using-skills/SKILL.md`）。若触达核心 Skill（architecture-principles、code-standards、development-principles、product-design-principles）的**红旗清单**，须停止并交人决策，不自行合理化绕过。

**FR-10** 须在文档中维护一份「AI-DLC Stage ↔ 现有 Skills / docs」映射表，至少覆盖：

- Inception：需求澄清、PRD/范围、风险与工作量、初始架构 → 对应 product/architecture 相关 Skills 与 docs/product 模板。
- Construction：设计、实现、测试 → 对应 role-architect、role-developer、架构/企业 Checklist、测试约定。
- Operations：部署审查、发布、可观测性 → 对应 k8s-deploy-guard、release-notes、运维相关 Skill（若有）。

**FR-11** 可选：为现有 Skills 增加 Phase/Stage/Depth 元数据（在 Skill 描述或配置中），以便 planner 或后续工具更精确推荐；首版可不实现，在映射表中用文字说明即可。

---

### 3.5 Human Gate 与 Ritual

**FR-12** 流程文档须明确两类 Ritual 的触发时机与参与要求：

- **Mob Elaboration**：在“执行具体 Stage 之前”，对 Level 1 Plan 进行审阅、补充、批准；至少明确「谁可批准 Plan」（如 PO/TL）。
- **Mob Construction**：在“关键 Stage 完成后”（如设计评审后、PR 合并前、发布前），人对产出进行审查并批准；至少明确发布前 Review 的责任人（如 TL 或指定人）。

**FR-13** Plan 中的 Human Gate 表须列出「节点、时机、建议参与、产出/记录」，产出/记录须与现有约定一致（如 decisions、memory/、PR 描述、Release Notes）。

---

### 3.6 可追溯性（Traceability）

**FR-14** 须约定 Plan-ID 的**命名规则**，建议形式：`<项目或模块缩写>-<功能或需求缩写>-<日期YYYYMMDD>-<序号>`，例如 `qdl-trace-scan-20250205-1`。若与 JIRA/需求 ID 绑定，须在文档中说明。

**FR-15** 须在流程文档中规定：非琐碎变更的 Commit 或 PR 描述中，建议携带 Plan-ID 或 Intent 摘要，例如 `[Plan qdl-trace-scan-20250205-1]`，以便回溯。

**FR-16** 可选：CI 检查 PR 描述是否包含 Plan-ID 或指定标签；不做为必选实现，可在后续迭代加入。

---

## 四、非功能与约束

**NFR-1** 不得因引入 AI-DLC 而强制“所有任务必须走完全部 Stage”；planner 可根据 Intent 输出“跳过”或“Light”的 Stage，且人可在 Mob Elaboration 中简化 Plan。

**NFR-2** 深度决策须在 Plan 中可见、可改，避免“黑盒深度”；Mob Elaboration 时须能对任一 Stage 的深度进行调整。

**NFR-3** 与 approach.md 中「契约优先、记忆为底座、AI 建议人确认、度量为证渐进」保持一致；AI-DLC 相关产出（Plan、决策记录）建议落入 memory/ 或 docs 约定路径。

---

## 五、实施顺序建议

以下按阶段列出实施项，便于按「实施文件」执行。

| 阶段 | 实施项 | 说明 |
|------|--------|------|
| **P0** | 编写并落地 **ai_dlc_planner** Skill | 输入 Intent，输出符合 3.3 的 Level 1 Plan；启发式可写在 SKILL 描述中。 |
| **P0** | 定义 **Intent 与 Plan 的文档模板** | 在 docs/process 或 RFC/ai-dlc 下提供 Intent 模板与 Plan 模板（可参考附录 A、B）。 |
| **P0** | 编写 **AI_DLC_WITH_SKILLS_WORKFLOW.md** | 放在 docs/process 下，说明角色视角、典型路径（Intent→Plan→Stage→Human Gate）、与 Skills 的对应、Plan-ID 与可追溯约定。 |
| **P1** | 完成 **Stage ↔ Skills 映射表** | 在流程文档或本 RFC 附录中维护，并随 Skills 变更更新。 |
| **P1** | 提供 **一条端到端示例路径** | 建议以千岛湖溯源（或现有 demo）为蓝本，从 Intent 到发布的完整 Plan + Human Gate 示例（见附录 C）。 |
| **P2** | 为现有 Skills 增加 **Phase/Stage/Depth 元数据** | 在 Skill 描述或配置中标注，便于 planner 与文档引用。 |
| **P2** | 将 **企业 Checklist 与深度挂钩** | 当 Stage 深度为 Deep 时，明确引用对应 Checklist（如 JAVA_ENTERPRISE_CHECKLIST）；在 planner 或流程文档中说明。 |
| **P3** | **Traceability 增强** | doc-reflector、decisions-summary 等 Skill 产出中可选带 Plan-ID；CI 可选检查 PR 含 Plan-ID。 |

---

## 六、验收要点（可作 DoD）

- [ ] 存在可用的 ai_dlc_planner Skill，对示例 Intent 能产出符合 3.3 的 Level 1 Plan。
- [ ] 存在 Intent 与 Plan 的模板或示例，且文档中至少三种 Intent 示例、至少一份完整 Plan 示例。
- [ ] 存在 AI_DLC_WITH_SKILLS_WORKFLOW.md（或等价流程文档），含角色、典型路径、可追溯约定。
- [ ] 存在至少一条端到端示例路径（如千岛湖），含 Plan 与 Human Gate。
- [ ] Stage 与 Skills 的映射表已编写并随仓维护。

---

## 附录 A：Intent 示例

### A.1 新特性

```text
【Intent】
为千岛湖溯源项目增加「扫码查溯源」能力：消费者扫商品上的二维码，可查看从养殖/捕捞到当前环节的溯源记录。

【可选结构化】
- 类型：新特性
- 影响范围：新增 API + 前端页面 + 扫码落地页
- 风险：中（涉及对外展示、数据准确性）
- 合规/安全：无支付，但有溯源数据展示，需防篡改
- 技术栈：现有 Java 后端 + 前端，可能涉及二维码生成与校验
```

### A.2 缺陷修复

```text
【Intent】
修复溯源详情页在 Safari 上日期显示错位的问题。

【可选结构化】
- 类型：缺陷修复
- 影响范围：前端展示
- 风险：低
```

### A.3 重构/架构变更

```text
【Intent】
把溯源链路的「存证上链」从当前同步调用改为异步队列，避免阻塞主流程。

【可选结构化】
- 类型：重构/架构变更
- 影响范围：核心业务流程、与外部链/服务的交互
- 风险：高
- 合规/安全：涉及存证一致性
```

---

## 附录 B：Level 1 Plan 示例（新特性）

```markdown
# Level 1 Plan：千岛湖溯源 - 扫码查溯源

## 1. Intent 摘要
- 目标：消费者扫码查看从养殖/捕捞到当前的溯源记录。
- 类型：新特性 | 影响：新增 API + 前端 + 扫码页 | 风险：中 | 合规：溯源数据展示、防篡改。

## 2. 建议阶段与深度

| 阶段 Stage              | 是否执行 | 深度 Depth | 说明 |
|-------------------------|----------|------------|------|
| 需求澄清 / PRD 精炼     | 是       | Standard   | 需明确：扫码入口、展示字段、权限与防篡改要求。 |
| 接口/数据设计           | 是       | Standard   | 溯源查询 API、二维码携带信息与校验方式。 |
| 安全与一致性评审        | 是       | Standard   | 溯源数据不可篡改、展示脱敏与合规。 |
| 实现（后端+前端+落地页）| 是       | Standard   | 按现有栈实现，优先接口与校验逻辑。 |
| 测试                    | 是       | Standard   | 单测 + 关键路径集成测 + 扫码端到端。 |
| 发布与运维              | 是       | Light      | 变更审查 + 配置检查；无 K8s 大改则 Light。 |

## 3. Human Gate（人必须确认的节点）

| 节点               | 时机           | 建议参与     | 产出/记录 |
|--------------------|----------------|--------------|-----------|
| 计划批准           | 执行前         | PO/TL        | 本 Plan 批准 + 可补充约束 |
| PRD/需求确认       | 需求澄清后     | PO/业务      | 更新 PRD 或 memory/ 需求摘要 |
| 设计评审           | 接口/安全设计后 | 架构/后端 TL | 设计结论写入 decisions 或 ADR |
| 发布前 Review      | 合并 main 前   | TL 或指定人  | 确认发布范围与回滚方案 |

## 4. 建议使用的 Skills / 文档（与当前仓对应）

- 需求澄清：product-design-principles / PRD 相关 Skill；产出可写入 docs/product 或 memory/。
- 设计：role-architect / architecture；接口与安全可对照 JAVA_ENTERPRISE_CHECKLIST 中相关项。
- 实现：role-developer + 现有实现类 Skill。
- 测试：现有测试约定 + 关键路径用例。
- 发布：release-notes、k8s-deploy-guard（若涉及部署）；doc-reflector 在实现后同步文档。

## 5. 可追溯标识（建议）

- Plan-ID：qdl-trace-scan-20250205-1
- 后续 Commit/PR 描述中可带：`[Plan qdl-trace-scan-20250205-1]`，便于回溯。
```

---

## 附录 C：千岛湖溯源端到端路径（AI-DLC 表述）

| 阶段 | Stage | 深度建议 | Human Gate | 产出 |
|------|-------|----------|------------|------|
| **Inception** | 需求澄清、PRD/范围、风险与工作量、初始架构草图 | 新项目 Standard；迭代可按范围收窄至 Light | PRD 与范围由 PO/业务确认；架构草图由架构或 TL 确认 | docs/product 下 PRD 或需求摘要；memory/ 或 decisions 中关键假设 |
| **Construction** | 接口/数据设计 → 实现（业务逻辑+接口+存储）→ 测试（单测+集成+关键路径） | 动核心溯源/存证用 Standard 或 Deep；仅展示或配置用 Light | 设计评审通过再开发；PR 合并前 Code Review 且与 Plan 对应 | 代码、测试、ADR/设计结论；doc-reflector 同步文档 |
| **Operations** | 部署配置审查、发布、可观测性（日志/监控/告警） | 常规发布 Light；动 K8s/存储/链路用 Standard，k8s-deploy-guard 等 | 发布前 TL 或指定人确认发布范围与回滚方案 | release-notes、changelog；事故/变更可回溯到 Plan-ID |

**Intent 示例**：构建/演进千岛湖渔业从生产到销售的溯源链路（含存证、查询、对外展示）。

---

## 附录 D：Stage ↔ Skills 映射表（示例）

| AI-DLC Phase | Stage | 深度体现 | 对应 Skills / 文档（示例） |
|--------------|-------|----------|----------------------------|
| Inception | 需求澄清 / PRD 精炼 | Light: 简短范围说明；Standard/Deep: 完整 PRD + 风险分析 | product-design-principles、docs/product 模板 |
| Inception | 初始架构 / 设计草图 | Light: 关键组件；Deep: ADR + 企业 Checklist | role-architect、docs/architecture、*_ENTERPRISE_CHECKLIST |
| Construction | 接口/数据设计 | 同上 | role-architect、架构相关 Skill |
| Construction | 实现 | Light: 最小实现；Deep: 带评审与 Checklist | role-developer、code-standards |
| Construction | 测试 | Light: 关键路径；Standard/Deep: 单测+集成+覆盖 | 测试约定、现有测试 Skill |
| Construction | 文档与变更同步 | - | doc-reflector |
| Operations | 部署审查 / 发布 | Light: 变更清单；Standard/Deep: k8s-deploy-guard 等 | k8s-deploy-guard、release-notes |
| Operations | 可观测性 / 回滚 | - | 运维与监控相关（若有） |
| **元 / 全局** | 响应前检查、Stage 执行时加载对应 Skill | - | **using-skills**（每次响应前检查；若有 Plan 按 Plan 加载） |
| **故障 / Bug** | 根因→多层防御→验证→沉淀 | - | **systematic-debugging**（与 memory/ 衔接） |

*实际映射须随仓库 Skills 与 docs 变更而更新。核心 Skill 均含红旗清单（各 5 条），触达即停、交人决策。*

---

*本文档为落地需求与实施依据，与 ai-dlc-introduction.md、ai-dlc-adoption.md 配套使用。实施过程中可对本 RFC 进行修订，修订时请更新状态与变更说明。*
