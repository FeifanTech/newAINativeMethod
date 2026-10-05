# RFC：Harness Engineering 与本仓库映射（A：概念对齐）

**状态**：采纳（轻量落地：文档 + Skill，不上独立运行时平台）  
**外部参考**：[What Is Harness Engineering?](https://harness-engineering.ai/blog/what-is-harness-engineering/)（五组件：Context / Tools / Verification / Cost / Observability & Evaluation）

---

## 1. 为何需要映射

业界讨论的 **Harness Engineering** 强调：**可靠性主要来自「缰绳」而非换模型**——上下文、工具、验证、成本与可观测/评测要工程化。本仓库以 **Agent Skills、memory、AI-DLC、Human Gate** 为主轴，已与 harness 思想同向；本 RFC 把**术语对齐到具体路径**，避免团队把 harness 误解为「多写几句 prompt」。

---

## 2. 五组件 → 本仓库落点

| Harness 组件 | 含义（摘要） | 本仓库中的对应落点 | 典型缺口（可渐进补） |
|--------------|--------------|---------------------|----------------------|
| **Context engineering** | 每步只给必要上下文，避免 dump 全库 | `CURSOR.md` / `CLAUDE.md`、`using-skills`、按 Stage 选 Skill、`memory/`、`scripts/build-role-prompt.sh`、Skills 索引 | 缺「按任务类型」的**标准上下文包**与篇幅/优先级约定 |
| **Tool orchestration** | 工具少而硬、参数与错误策略清晰 | Skills 的触发与产出格式、IDE 内工具、可选 `k8s-deploy-guard` 等 | 缺显式 **失败/超时/重试** 策略文档（尤其在多工具链并存时） |
| **Verification loops** | 每步可判定通过/失败，避免静默烂数据传导 | `development-principles`、`code-standards`、测试与 CI 约定、`systematic-debugging`、核心 Skill **红旗** | 缺与 Stage 绑定的**最小机械验证**清单（见 Skill **harness-engineering**） |
| **Cost envelope** | 单任务预算上限，防重试/漂移烧穿 | 本仓库**未产品化**；可在业务仓约定 token/调用上限 | 方法论层可先原则后数字（由各业务仓自定阈值） |
| **Observability & evaluation** | 结构化 trace + 定期任务集评测 | `memory/changelog.md`、决策与复盘文档、case study、可选 CI 示例 | 缺**固定小任务集**与通过率记录（可选在样板项目中试点） |

---

## 3. 与 AI-DLC / Human Gate 的关系

- **Harness**：偏 **机械可重复**（有没有跑检查、工具是否报错、是否超预算）。  
- **Human Gate**：偏 **价值与风险判断**（是否允许合并、是否上生产、是否接受范围变更）。

二者互补：**Harness 不过关则不应进入「宣称完成」；Human Gate 不过关则不应进入「组织承诺」**。

---

## 4. 与现有 Skills 的分工

| Skill | 与 Harness 的关系 |
|-------|-------------------|
| **using-skills** | 决定加载哪些 Skill；多步/工具链/生产可靠性场景须叠加 **harness-engineering** |
| **harness-engineering** | 给出 **Stage × 最小缰绳检查点**与红旗，落实 B（可执行） |
| **development-principles** | 交付节奏、质量门禁、可追溯 |
| **systematic-debugging** | 故障时的四阶段闭环 |
| **architecture-principles** / **product-design-principles** | 方案与需求侧的边界与红旗 |

---

## 5. 落地范围（本次）

- **A**：本文档（映射与术语）。  
- **B**：`.cursor/skills/harness-engineering/SKILL.md`（检查清单 + 红旗 + AI-DLC Stage 对照）。  
- **非目标**：自建统一 Agent 运行时、全仓自动化评测平台、商业 harness 产品集成；**不**将 DeepSeek Harness 等运行时绑为本仓默认依赖。

---

## 6. 外部开源对照（学模式，不绑依赖）

本节记录对业界开源项目的对照结论，用于指导本仓「借什么 / 不借什么」。详细写作与分发约定见 **docs/process/skill-writing-and-distribution.md**。

### 6.1 DeepSeek Harness（运行时级）

- **仓库**：[deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`；Cordis「Everything is a Plugin」）
- **定位**：完整 Agent 运行时（模型适配、工具护栏、session log、sandbox/approval、profile：`web` / `headless` / `sdk` / `acp` 等）
- **状态**：MIT；官方标注 **developer preview**，存在破坏性变更风险
- **对本仓**：
  - **可借鉴（概念）**：session 为真源、工具 pre/post 护栏、capability seam、approval/sandbox、turn/step 可观测——可充实 `harness-engineering` 的检查表述
  - **不采纳（默认路径）**：不把 `dsh` 作为基线仓默认执行引擎或 submodule；个人可可选试用，产出仍经 PR 回写 `.cursor/skills` / `memory`

### 6.2 腾讯 Skills 共享（分发与写作）

| 项目 | 仓库 | 对本仓的价值 |
|------|------|--------------|
| **Awesome CodeBuddy** | [Tencent/awesome-devbuddy](https://github.com/Tencent/awesome-devbuddy) | Agents / Commands / Skills / Rules **分层共享**；Skill 可带 **examples/** 渐进样例；选择性复制进业务仓 |
| **CloudBase Skills** | [TencentCloudBase/skills](https://github.com/TencentCloudBase/skills) | `npx skills add …` 安装体验；description 的 **MUST / NOT for / preflight** 路由纪律 |
| **TRTC Agent Skills** | [Tencent-RTC/agent-skills](https://github.com/Tencent-RTC/agent-skills) | `add --ide cursor\|claude\|codex\|all` 的多 IDE 安装 UX |

- **对本仓**：
  - **可借鉴**：写作规范（何时用/何时不用、preflight）、可选 `examples/`、多 IDE 一次对齐、Commands 作为「可发现一键动作」索引
  - **不采纳**：不以 `.codebuddy/` 替代 `.cursor/skills` 真源；不批量搬运 CloudBase/TRTC 业务 Skill 正文

### 6.3 对照总表

| 维度 | 本仓 | DeepSeek Harness | 腾讯 Skills 共享 |
|------|------|------------------|------------------|
| 定位 | 方法论 + Agent Skills 模板 | Agent 运行时 / 插件 OS | 能力包共享与产品 Skills |
| Context | CURSOR / memory / prompt 脚本 | Session log + prompt assembly | 约定文件 + Skill 正文 |
| Tools | IDE + Skill 约定 | 护栏流水线 + sandbox | 引导/脚本为主 |
| Verification | 红旗 + 流程清单 | pre/post tool、approval | examples 自测、review skill |
| 分发 | `sync-skills.sh` / init-repo | 插件包 / profiles | 复制目录 / `npx skills add` / 多 IDE |
| 借鉴优先级 | — | 概念高、代码接入低 | 分发与写作高、业务内容低 |

---

## 7. 修订记录

| 日期 | 说明 |
|------|------|
| 2026-04-12 | 初版：A 映射 + 与 B（Skill）配套 |
| 2026-04-12 | 增补 §6 外部开源对照（DeepSeek Harness、腾讯 Skills 共享） |
