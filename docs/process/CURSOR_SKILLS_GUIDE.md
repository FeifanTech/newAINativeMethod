# Cursor Skills 使用指南：用 Skills 加速研发

本指南说明如何在 Cursor 中使用 **Skills（技能）** 和 **Rules（规则）**，让 AI 更懂你的项目与习惯，从而提升研发效率。

---

## 一、Skills 与 Rules 的区别

| 特性 | Skills（技能） | Rules（规则） |
|------|----------------|----------------|
| **作用** | 教 AI 完成特定任务或流程 | 为 AI 提供持久上下文（规范、约定） |
| **触发** | 根据描述自动匹配用户意图时使用 | 按「始终应用」或「打开某类文件」时应用 |
| **格式** | 目录 + `SKILL.md`（含 YAML 头） | `.cursor/rules/*.mdc`（含 YAML 头） |
| **典型用途** | 代码审查、提交信息、Excel/PDF 处理、专项工作流 | 编码规范、项目约定、文件类型专用模式 |

**简单记**：Rules 管「怎么写、按什么规范」；Skills 管「怎么一步步做某件事」。

---

## 二、Skills 详解

### 2.1 Skills 是什么

Skills 是一组 **Markdown 说明**（通常放在 `SKILL.md` 里），用来：

- 定义**何时**使用（description 里的触发场景）
- 说明**怎么做**（步骤、检查项、模板、示例）
- 可选：附带脚本、参考文档

AI 会根据你的问题 + Skill 的 **description** 自动判断是否启用某个 Skill，无需你每次手动选择。

### 2.2 存放位置

| 类型 | 路径 | 作用范围 |
|------|------|----------|
| **个人 Skill** | `~/.cursor/skills/<skill-name>/` | 所有项目共用 |
| **项目 Skill** | 项目内 `.cursor/skills/<skill-name>/` | 仅当前仓库（可提交给团队） |

**注意**：不要往 `~/.cursor/skills-cursor/` 里放自己的 Skill，那是 Cursor 内置技能目录。

### 2.3 目录结构示例

```
skill-name/
├── SKILL.md              # 必选，主说明
├── reference.md          # 可选，详细文档
├── examples.md           # 可选，使用示例
└── scripts/              # 可选，工具脚本
    ├── validate.py
    └── helper.sh
```

### 2.4 SKILL.md 基本格式

```markdown
---
name: your-skill-name
description: 用第三人称写：这个技能做什么；在什么情况下使用（触发词）。
---

# 技能标题

## 步骤 / 检查项 / 模板
（简明步骤、清单、代码示例等）
```

- **name**：小写、数字、连字符，最多 64 字符，作为唯一标识。
- **description**：**非常重要**。要写清「做什么」和「什么时候用」，便于 AI 自动匹配。

### 2.5 写好 description 的要点

1. **用第三人称**（会被注入系统提示）  
   - ✅ 「处理 Excel 并生成报表」  
   - ❌ 「我可以帮你处理 Excel」

2. **具体 + 触发词**  
   - ✅ 「从 PDF 提取文本与表格，填表、合并文档。在用户处理 PDF、填表或提到 PDF 时使用。」  
   - ❌ 「处理文档」

3. **同时包含「做什么」和「何时用」**  
   - WHAT：能力说明  
   - WHEN：触发场景（如：PR 审查、写 commit、处理 .xlsx 等）

### 2.6 常用写作模式

- **模板模式**：给出固定输出格式（如报告结构、commit 模板）。
- **示例模式**：多组「输入 → 输出」示例（如 commit 信息、评审话术）。
- **工作流模式**：分步骤 + 清单，便于逐步执行和勾选。
- **条件分支**：根据「新建 / 修改」等不同情况走不同步骤。
- **校验循环**：先改再跑脚本校验，不通过则修正再校验。

### 2.7 你当前可用的内置 Skills（skills-cursor）

这些已在 Cursor 里，可直接通过对话触发（说出对应场景即可）：

- **create-skill**：创建/编写新 Skill，或问 Skill 结构、SKILL.md 写法。
- **create-rule**：创建规则、编码标准、项目约定、RULE.md、`.cursor/rules/` 等。
- **update-cursor-settings**：改 Cursor/VSCode 设置（主题、字体、format on save 等）。
- **migrate-to-skills**：把「按需应用的规则」或斜杠命令迁移成 Skills 格式。

### 2.8 本仓库项目内 Skills（.cursor/skills/）

除上述内置技能外，本仓库在 `.cursor/skills/` 下还提供：

- **using-skills**（元 Skill）：每次响应前必须检查是否有相关 Skill；若任务涉及架构/设计/代码/需求/调试/Skill 开发等，必须加载并遵循对应 Skill。与 AI-DLC 一致：执行任一 **Stage** 时须加载该 Stage 对应 Skill；若已有 **Level 1 Plan**，按 Plan 中「建议使用的 Skills」加载；**Human Gate** 须由人确认。详见 `.cursor/skills/using-skills/SKILL.md` 与 **CURSOR.md**。
- **skill-learner-developer**：从市场学习 skills、开发新 skill、优化既有 skill 的 meta-skill。说「从市场学 skills」「帮我开发一个 skill」「优化现有 skill」时使用；内含 SkillsMP、Agent Skills Guide、Anthropic/skills、腾讯共享仓等来源与开发/优化检查清单；核心 Skill 建议用 TDD 方法开发（见 docs/process/skill-development-workflow.md）；写作与分发见 docs/process/skill-writing-and-distribution.md。
- **development-principles** / **code-standards** / **architecture-principles** / **product-design-principles**：原则与检查清单；各含**红旗清单**，触达须停止并交人决策。
- **systematic-debugging**：Bug/故障/异常时的系统化调试流程（根因→多层防御→验证→沉淀），与 memory/ 衔接。
- **harness-engineering**：Harness Engineering（缰绳工程）最小检查：多步 Agent、工具链、生产可靠性；含 AI-DLC Stage 对照与红旗。概念映射与外部开源对照见 `RFC/harness-engineering/RFC-harness-engineering-mapping.md`。
- **role-developer** / **role-architect** / **role-product-designer**：角色 Agent，串联对应原则类 skill。

---

## 三、Rules 详解

### 3.1 Rules 是什么

Rules 是放在 `.cursor/rules/` 下的 **.mdc** 文件，通过 YAML 头配置「何时应用」，给 AI 持久、稳定的项目上下文。

### 3.2 文件格式

```markdown
---
description: 规则简要说明（会在规则选择器中显示）
globs: "**/*.ts"        # 仅在这些文件被涉及时应用（可选）
alwaysApply: false      # 为 true 时则每次对话都应用
---

# 规则标题

规则正文：规范、约定、示例等。
```

- **description**：这条规则在做什么。
- **globs**：文件匹配模式，如 `**/*.ts`、`**/service/**/*.java`，不写则依赖 `alwaysApply`。
- **alwaysApply**：是否全局生效。

### 3.3 两种典型用法

**全局规则（如整体编码标准）：**

```yaml
---
description: 项目核心编码规范
alwaysApply: true
---
```

**按文件类型（如只对 Java）：**

```yaml
---
description: 本项目的 Java/Spring 约定
globs: "**/*.java"
alwaysApply: false
---
```

### 3.4 使用建议

- 单条规则尽量 **50 行以内**，一条规则只管一类事。
- 多写**可执行、可对照**的说明（例如「这样写 / 不要那样写」+ 代码示例）。
- 内容过长可考虑拆成多条规则，或用 `globs` 限定到具体文件类型。

---

## 四、实战：用 Skills 加速研发的几种方式

### 4.1 为项目加「代码审查」Skill

- **目的**：统一审查标准（正确性、安全、可维护性、测试）。
- **做法**：在项目里建 `.cursor/skills/code-review/SKILL.md`，按 create-skill 的「Code Review」示例写：  
  - description 里写「代码审查、PR 审查、code review」等触发词。  
  - 正文写检查清单、反馈格式（如 Critical / Suggestion / Nice to have）。
- **效果**：你说「帮我审查这段代码」或「review 这个 PR」时，AI 会按该 Skill 执行。

### 4.2 为团队加「Commit 信息」Skill

- **目的**：统一 commit 风格（如 feat/fix 前缀、简短说明）。
- **做法**：建 `.cursor/skills/commit-message/SKILL.md`，用「示例模式」：多组「改动描述 → 推荐 commit 信息」。
- **效果**：你说「根据当前改动写 commit 信息」时，AI 会按你们约定生成。

### 4.3 用 Rules 固定项目技术栈与规范

- **目的**：AI 默认就按你们的技术栈和规范回答（命名、异常处理、日志等）。
- **做法**：  
  - 在项目下建 `.cursor/rules/`（若还没有）。  
  - 新增例如 `java-standards.mdc`（globs: `**/*.java`），里面写：  
    - 用哪些框架、包结构、异常处理与日志约定。  
    - 简短「推荐写法 vs 不推荐写法」示例。
- **效果**：打开或讨论 Java 文件时，AI 会自动带上这些约定。

### 4.4 把现有「规则」或「命令」变成 Skill

- 若你已有 `.cursor/rules/*.mdc`（无 globs、非 alwaysApply）或 `.cursor/commands/*.md`，可以说：  
  **「帮我把当前项目里的 rules/commands 迁移成 skills」**  
  会用到 **migrate-to-skills** 的逻辑，生成对应的 `.cursor/skills/<name>/SKILL.md`，便于统一用「技能」触发。

---

## 五、日常使用技巧

1. **直接说出意图**  
   例如：「按我们项目的规范审查这段代码」「给这次改动写一条 commit」「按 Java 规范重写这个异常处理」。AI 会匹配到对应 Skill 或 Rule。

2. **创建新 Skill 时**  
   说：「我想做一个 Skill：在……的时候做……，步骤是……」  
   或：「帮我写一个 Skill，用来……」  
   Cursor 会按 **create-skill** 的流程帮你起名、写 description、搭 SKILL.md 结构。

3. **创建新 Rule 时**  
   说：「加一条规则：所有 Java 文件都要……」或「加一个全局规则：提交前必须……」  
   会走 **create-rule**，在 `.cursor/rules/` 下生成合适的 `.mdc`。

4. **改编辑器设置**  
   说「字体调大」「保存时自动格式化」「换深色主题」等，会走 **update-cursor-settings**。

5. **个人 vs 项目**  
   - 只在自己机器上有用的习惯 → 放在 `~/.cursor/skills/`。  
   - 希望团队统一用的流程/规范 → 放在项目 `.cursor/skills/` 或 `.cursor/rules/`，并提交到仓库。

---

## 六、注意事项与最佳实践

### Skills

- **SKILL.md 主体建议不超过 500 行**，细节放到 `reference.md`、`examples.md` 或脚本里。
- **描述里别写时间敏感信息**（如「2025 年 8 月前用旧 API」），易过期；可改用「当前做法」+「已废弃做法」折叠块。
- **术语统一**：整份 Skill 里对同一概念用同一说法（如统一用「API 端点」或「接口」）。
- **优先给一个默认做法**，再在少数例外里说明「否则用……」。

### Rules

- 一条规则**一个关注点**，过长就拆成多条或按 `globs` 拆分。
- 尽量带**具体代码示例**（✅ 推荐 / ❌ 不推荐），便于 AI 和人工对照。

### 通用

- 不要修改 `~/.cursor/skills-cursor/` 下的内容。
- 项目里若还没有 `.cursor/rules/` 或 `.cursor/skills/`，可在第一次创建 Rule 或 Skill 时让 Cursor 自动创建。

---

## 七、快速对照表

| 我想… | 用哪个 | 怎么说 / 怎么做 |
|-------|--------|------------------|
| 让 AI 按固定流程做一件事（审查、写 commit、处理某类文件） | Skill | 说「做一个 Skill：在……时做……」，或直接描述任务让 AI 匹配现有 Skill |
| 让 AI 始终或对某类文件遵守项目规范 | Rule | 说「加一条规则：……」「给 Java 文件加规范」等，或使用 create-rule |
| 新建/改 Skill 结构或 SKILL.md | create-skill | 「帮我写一个 Skill」「Skill 该怎么写」 |
| 新建/改规则或 RULE | create-rule | 「加一条规则」「.cursor/rules 怎么用」 |
| 改 Cursor 设置 | update-cursor-settings | 「字体调大」「保存时格式化」等 |
| 把现有 rules/commands 转成 skills | migrate-to-skills | 「把项目里的 rules/commands 迁移成 skills」 |
| 从市场学 skills / 开发或优化 skill | skill-learner-developer | 「从市场学 skills」「帮我开发一个 skill」「优化现有 skill」 |

---

按上述方式配置 Skills 和 Rules 后，日常只要用自然语言说出你的意图，Cursor 就会自动选用合适的技能与规则，从而加速研发与代码一致性。若你愿意，我可以根据你当前项目（例如 Java/Spring、SIP 相关）直接帮你起草一个「代码审查」或「Java 规范」的 Skill/Rule 示例文件。

---

## 八、跨 IDE / CLI 使用 Skills（一份技能多处用）

若希望同一套 Skills 能在 **Cursor、Codex、CLI 或其他兼容工具** 里共用，可以按「开放格式 + 统一源目录」来做。

### 8.1 开放标准：Agent Skills

- **Agent Skills**（[agentskills.io](https://agentskills.io)）是一套开放格式：`SKILL.md` + YAML 头（`name`、`description`）+ 可选 `scripts/`、`references/`、`assets/`。
- 理念是 **「写一次，多处用」**：同一份 skill 可被多种 agent 产品（IDE、CLI、Web、集成）读取。
- Cursor 与 Codex 的 Skill 格式都与该规范兼容（都要求 `name`、`description` 和 Markdown 正文）。

### 8.2 各工具默认读取的目录

| 工具 | 个人/全局 | 项目内 |
|------|-----------|--------|
| **Cursor** | `~/.cursor/skills/` | `.cursor/skills/` |
| **Codex (OpenAI)** | `~/.agents/skills`、`$HOME/.agents/skills` | `$CWD/.agents/skills`、仓库根 `.agents/skills` |
| **Codex 系统/Admin** | `/etc/codex/skills` | — |

差异在于：**目录名不同**（`.cursor/skills` vs `.agents/skills`），格式一致。要让「同一份 skill」在多个工具里生效，需要让各工具都能看到同一目录下的内容。

### 8.3 方案一：统一源目录 + 符号链接（推荐）

把 **唯一真实副本** 放在一个「规范源」目录，其他工具通过**符号链接**指向它，这样只维护一份。

1. **选一个规范源**（任选其一）：
   - **`~/.agents/skills`**（推荐：Codex 原生支持，且符合 Agent Skills 惯例）
   - 或 `~/skills`、`~/.config/skills` 等你习惯的目录

2. **所有自建/安装的 skill 只放在规范源**，例如：
   ```text
   ~/.agents/skills/
   ├── code-review/
   │   └── SKILL.md
   └── commit-message/
       └── SKILL.md
   ```

3. **让 Cursor 也读同一份**（二选一）：
   - **整目录链接**（个人技能统一从规范源读）：
     ```bash
     # 若 ~/.cursor/skills 已存在，先备份或清空
     ln -sfn ~/.agents/skills ~/.cursor/skills
     ```
   - **仅链接部分 skill**：在 `~/.cursor/skills/` 下为每个 skill 建链接，例如：
     ```bash
     mkdir -p ~/.cursor/skills
     ln -sfn ~/.agents/skills/code-review ~/.cursor/skills/code-review
     ln -sfn ~/.agents/skills/commit-message ~/.cursor/skills/commit-message
     ```

4. **Codex**：已直接读 `~/.agents/skills`，无需改。

这样：**编辑/增删只动 `~/.agents/skills`，Cursor 与 Codex 都会看到同一批 skill**。

### 8.4 方案二：项目内跨工具共享

希望团队在同一仓库里共用 skills，且同时给 Cursor 和 Codex 用：

1. **在仓库里只维护一份**，建议用 **`.agents/skills`**（Codex 会从仓库根和当前目录读）：
   ```text
   your-repo/
   └── .agents/
       └── skills/
           ├── code-review/
           └── deploy-checklist/
   ```

2. **让 Cursor 也读到**：在仓库根建符号链接：
   ```bash
   cd your-repo
   ln -sfn .agents/skills .cursor/skills
   ```
   提交时通常只提交 `.agents/skills` 和链接 `.cursor/skills`（若团队都用 Cursor）；若不想提交链接，可在 README 里写「首次克隆后执行 `ln -sfn .agents/skills .cursor/skills`」。

3. 把 `.agents/skills` 纳入 git，这样任何人拉代码后，Codex 与 Cursor（在做了链接的前提下）都会用同一套 skills。

### 8.5 方案三：在任意 CLI 里使用同一套 Skills

不依赖特定 IDE，在终端里调用 LLM 时也想带上 skill 内容（例如 `aichat`、`llm`、或直接调 API）：

1. **用规范格式**：skill 仍按 Agent Skills 规范放在 `~/.agents/skills`（或你指定的目录）。

2. **用官方参考工具生成 prompt 片段**：  
   [agentskills/agentskills](https://github.com/agentskills/agentskills) 的 **skills-ref** 提供：
   - **校验**：`skills-ref validate <skill-path>`
   - **生成可注入的 prompt**：`skills-ref to-prompt <path>...`  
   会把 skill 的 metadata（或完整内容）转成可插入系统提示的 XML/文本，你再把这段拼进自己的 system prompt 后调 LLM。

3. **自写小脚本**（思路）：
   - 扫描 `~/.agents/skills` 下每个子目录的 `SKILL.md`；
   - 解析 YAML 头得到 `name`、`description`；
   - 根据用户输入或参数匹配要用的 skill（例如按关键词匹配 description）；
   - 读取对应 `SKILL.md` 全文，拼进「系统提示」或「用户第一条消息」；
   - 调用任意 CLI/API（如 `aichat`、OpenAI API）。

这样 **skills 只维护一份**，IDE 和 CLI 都能用同一套能力。

### 8.6 小结：跨 IDE/CLI 检查清单

- [ ] 所有 skill 按 **Agent Skills** 规范写（`SKILL.md` + `name` + `description`）。
- [ ] 统一放在 **一个规范源**（如 `~/.agents/skills` 或项目 `.agents/skills`）。
- [ ] Cursor：用 **symlink** `~/.cursor/skills` → 规范源（或项目内 `.cursor/skills` → `.agents/skills`）。
- [ ] Codex：已读 `~/.agents/skills` 与仓库 `.agents/skills`，无需额外配置。
- [ ] CLI/脚本：用 **skills-ref** 的 `to-prompt` 或自写逻辑，从规范源读 skill 并注入到 LLM 的 prompt。

---

## 九、本仓库：写作规范与分发（借鉴腾讯共享仓 / DeepSeek 对照）

本仓 Skills 的**真源**固定为 `.cursor/skills/`。对外对照与落地细则见：

- [skill-writing-and-distribution.md](./skill-writing-and-distribution.md) — MUST/NOT/preflight、`examples/`、多 IDE 软链接、Commands 索引、`npx skills add` 关系
- [RFC/harness-engineering/RFC-harness-engineering-mapping.md](../../RFC/harness-engineering/RFC-harness-engineering-mapping.md) §6 — DeepSeek Harness（概念）与腾讯 awesome-devbuddy / CloudBase / TRTC skills（分发）

**原则**：学模式、不绑 DeepSeek 运行时；不把 `.codebuddy/` 当作第二真源。