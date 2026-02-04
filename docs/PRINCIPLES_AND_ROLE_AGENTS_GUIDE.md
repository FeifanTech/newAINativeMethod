# 将原则沉淀为 Skills，并串联为角色 Agent

本指南说明如何：  
1）把**产品设计原则 / 技术架构原则 / 代码规范**沉淀为 Skills；  
2）把多个 Skills **合并或串联**成不同**角色 Agent** 的动作。

---

## 一、原则类内容如何沉淀为 Skills

### 1.1 三类原则对应的 Skill 形态

| 内容类型 | 建议 Skill 名称 | 触发场景（description 里要写） | 正文重点 |
|----------|-----------------|--------------------------------|----------|
| **产品设计原则** | `product-design-principles` | PRD、需求评审、功能设计、产品方案、用户体验 | 原则列表 + 检查清单 + 反例/正例 |
| **技术架构原则** | `architecture-principles` | 架构设计、技术选型、系统拆分、接口设计、技术方案评审 | 原则 + 决策树/检查项 + 示例 |
| **代码规范** | `code-standards` | 写代码、代码审查、重构、Code Review | 规范条目 + 示例代码（✅/❌） |

原则类 Skill 的共性：**description 要覆盖「做什么」和「何时用」**，正文要**简洁、可执行、带检查项或示例**。

### 1.2 推荐目录结构（原则 Skill）

每个原则一个独立 skill，便于复用和组合进不同角色：

```
.cursor/skills/
├── product-design-principles/
│   ├── SKILL.md              # 原则摘要 + 检查清单
│   └── references/           # 可选：详细文档
│       └── principles-detail.md
├── architecture-principles/
│   ├── SKILL.md
│   └── references/
│       └── adr-templates.md
└── code-standards/
    ├── SKILL.md
    └── references/
        └── java-standards.md
```

### 1.3 SKILL.md 写作要点（原则类）

- **Frontmatter**  
  - `name`：小写连字符，如 `product-design-principles`。  
  - `description`：第三人称，写清「做什么 + 何时用」，并包含触发词（如 PRD、架构设计、Code Review）。

- **正文结构建议**  
  1. **原则列表**：每条一两句话，可带优先级（P0/P1）。  
  2. **检查清单**：评审/设计时逐条核对。  
  3. **示例**：正例 / 反例（产品可写用户故事/场景，架构可写决策示例，代码用 ✅/❌ 代码块）。

- **控制篇幅**：SKILL.md 主体建议 < 500 行，细节放到 `references/`，在 SKILL.md 里用「详见 references/xxx」引用。

### 1.4 与 Cursor Rules 的分工

- **原则/规范「按任务触发」**（如：做产品方案时、做架构评审时、做 Code Review 时）→ 用 **Skill**（原则类）。  
- **规范「按文件始终生效」**（如：一打开 Java 就按某套规范）→ 用 **Rules**（`.cursor/rules/*.mdc`）。

可以同时存在：例如 `code-standards` 作为 Skill 在「代码审查」「重构」时被调用；再在 `.cursor/rules/` 里放一条 `java-standards.mdc`（globs: `**/*.java`），写代码时自动带上。

---

## 二、把多个 Skills 合并/串联成「角色 Agent」

目标：**不同角色**（如产品设计 Agent、架构师 Agent、开发 Agent）各自有一套「动作」，这些动作由多个 Skills 组合而成。

### 2.1 实现方式概览

| 方式 | 做法 | 适用场景 |
|------|------|----------|
| **A. 角色 Skill 引用其他 Skill** | 一个「角色 Skill」的正文里写明：先遵循 X、再遵循 Y，并给出其他 Skill 的路径或摘要 | Cursor/Codex 等能读多文件的 IDE |
| **B. 角色 Skill 内聚原则** | 一个角色一个 Skill，把该角色需要的原则/步骤全部写进这一个 SKILL.md（或 references） | 希望一次对话只拉取一个技能、逻辑简单 |
| **C. 配置 + 脚本生成 Prompt** | 用 YAML/JSON 定义「角色 → Skills 列表 + 顺序」，脚本按顺序拼接 skill 内容生成 system prompt | CLI、自建 Agent、需要严格顺序时 |

下面以 **A** 为主（可复用原则 Skill），**B** 为备选，**C** 作为 CLI/自动化补充。

### 2.2 方式 A：角色 Skill 引用并串联其他 Skills

思路：每个角色一个 Skill（如 `role-product-designer`），其 **SKILL.md** 中：

1. **声明角色与目标**：当用户说「作为产品设计」「产品评审」等时使用本 Skill。  
2. **规定动作顺序**：先做什么、再做什么（例如：先套产品原则，再套产出物模板）。  
3. **引用其他 Skills**：通过「请先阅读并遵循 xxx 的 SKILL.md」或「遵循以下原则（来自 product-design-principles）」把原则类 Skill 串联进来。

这样，一次对话里用户只要触发「角色 Skill」，Agent 就会按该 Skill 的说明去读、遵循被引用的原则 Skill，形成**串联动作**。

推荐目录结构：

```
.cursor/skills/
├── product-design-principles/   # 基础原则
├── architecture-principles/
├── code-standards/
├── role-product-designer/       # 角色：串联 产品原则 + 可选模板
│   └── SKILL.md
├── role-architect/               # 角色：串联 架构原则 + 可选 ADR
│   └── SKILL.md
└── role-developer/              # 角色：串联 代码规范 + 审查清单
    └── SKILL.md
```

**角色 Skill 的 description** 要包含该角色的触发词，例如：

- `role-product-designer`：产品设计、PRD 评审、需求评审、功能设计、产品方案、扮演产品经理  
- `role-architect`：架构设计、技术方案评审、技术选型、系统设计、扮演架构师  
- `role-developer`：代码实现、Code Review、重构、开发规范、扮演开发

**角色 Skill 的正文** 示例结构（以产品设计为例）：

```markdown
# 产品设计角色

## 角色与目标
以产品设计角色工作：产出 PRD/需求、做方案评审、保证体验与优先级一致。

## 动作顺序
1. **先**遵循《产品设计原则》：阅读并应用同目录下或项目中的 product-design-principles 的 SKILL.md。
2. **再**按当前任务选择产出物（PRD 模板 / 用户故事清单 / 评审检查表）。
3. 输出时标明：依据的原则、检查项与结论。

## 产出物要求
- PRD：背景、目标、用户与场景、功能列表、非功能需求、成功指标。
- 评审：对照 product-design-principles 检查清单逐条给出是否满足及说明。
```

这样就把「产品设计原则」和「角色动作顺序」合并成了一个可被 Cursor 匹配的**角色 Agent 动作**。

### 2.3 方式 B：角色 Skill 内聚所有原则（不引用其他 Skill）

若希望**不依赖「读另一个 SKILL.md」**，可以把该角色需要的原则**直接写进角色 Skill**（或写到其 `references/` 再在 SKILL.md 里引用）。

- 优点：一次只加载一个 Skill，实现简单。  
- 缺点：原则在多角色间重复时需同步维护。

做法：  
- 在 `role-product-designer/SKILL.md` 里开一节「产品设计原则」，把核心条目 + 检查清单写进去；  
- 更细的内容放在 `role-product-designer/references/`，在 SKILL.md 里写「详见 references/xxx」。

### 2.4 方式 C：用配置 + 脚本生成「角色 = 有序 Skills」

当你在 **CLI 或自建 Agent** 里调用 LLM 时，可以：

1. 用一份配置定义角色与 Skills 的对应关系，例如：

```yaml
# roles.yaml（示例）
roles:
  product-designer:
    description: "产品设计：PRD、需求评审、功能设计"
    skills:
      - product-design-principles
      - prd-template
  architect:
    description: "架构设计：技术方案、选型、接口设计"
    skills:
      - architecture-principles
      - adr-template
  developer:
    description: "开发与 Code Review"
    skills:
      - code-standards
      - code-review-checklist
```

2. 写一个小脚本：根据当前选择的角色，按 `skills` 列表**顺序**读取对应目录下的 `SKILL.md`，拼接成一段 system prompt（或 `<available_skills>` 等格式），再调用 LLM。  
3. 这样「角色 Agent」= 固定顺序的多个 Skills 内容组合，便于在 Cursor 外复用同一批 Skills。

（若使用 [skills-ref](https://github.com/agentskills/agentskills) 的 `to-prompt`，可先为每个 skill 生成片段，再按 roles.yaml 的顺序拼接。）

---

## 三、实际操作步骤小结

### 第一步：沉淀原则为独立 Skills

1. 在 `.cursor/skills/` 下为每类原则建目录：`product-design-principles`、`architecture-principles`、`code-standards`。  
2. 每个目录下写 `SKILL.md`：  
   - name、description（含触发词），  
   - 正文：原则列表 + 检查清单 + 少量示例，  
   - 过长内容放到 `references/`。  
3. 若希望「打开某类文件就带规范」，再在 `.cursor/rules/` 里为该项目配对应 Rules（如 Java 规范）。

### 第二步：为每个角色建「角色 Skill」

1. 在 `.cursor/skills/` 下建 `role-<角色名>`，如 `role-product-designer`、`role-architect`、`role-developer`。  
2. 每个角色一个 `SKILL.md`：  
   - description 里写该角色的触发词（产品设计、架构评审、开发/Code Review 等）。  
   - 正文里写「动作顺序」+「请遵循 xxx 的 SKILL.md」或直接内聚原则（方式 B）。  
3. 这样在 Cursor 里说「按产品设计角色评审这份 PRD」「作为架构师看下这个方案」就会匹配到对应角色 Skill，从而串联到原则 Skills。

### 第三步：（可选）CLI/自动化里串联

1. 把同一批 Skills 放在统一目录（如 `.agents/skills` 或 `.cursor/skills`）。  
2. 用 `roles.yaml`（或等价配置）定义角色 → skills 列表与顺序。  
3. 用脚本按顺序读取各 Skill 的 SKILL.md，拼成 prompt，供 CLI/自建 Agent 使用。

---

## 四、示例与模板位置

本仓库在 **`.cursor/skills/`** 下已放置可用的示例，包括：

- **原则类**：`product-design-principles`、`architecture-principles`、`code-standards` 的 SKILL.md 模板，可按你司实际原则替换正文。  
- **角色类**：`role-product-designer`、`role-architect`、`role-developer` 的 SKILL.md，演示如何引用并串联上述原则，形成不同角色 Agent 的动作。

你可以直接在本项目中使用，或复制到 `~/.cursor/skills` 做个人全局使用。

### 本仓库当前结构

```
.cursor/skills/
├── product-design-principles/
│   └── SKILL.md
├── architecture-principles/
│   └── SKILL.md
├── code-standards/
│   └── SKILL.md
├── role-product-designer/
│   └── SKILL.md
├── role-architect/
│   └── SKILL.md
└── role-developer/
    └── SKILL.md
```

### 使用方式

- **仅用原则**：对 Cursor 说「按我们的产品设计原则评审这段 PRD」「按架构原则看下这个技术方案」「按代码规范做一次 Code Review」，会匹配到对应原则 Skill。  
- **用角色**：对 Cursor 说「作为产品设计 agent 评审这个需求」「作为架构师给这个方案提意见」「作为开发 agent 按规范审查这段代码」，会匹配到角色 Skill，从而串联对应原则（并可按角色 Skill 里的顺序执行）。

---

## 五、（可选）角色与 Skills 的配置化串联（CLI/脚本）

若在 **CLI 或自建 Agent** 里需要按「角色 → 有序 Skills」生成 prompt，可使用配置 + 脚本：

1. 在项目或个人目录下建 `roles.yaml`（或 `roles.json`），例如：

```yaml
# roles.yaml 示例
roles:
  product-designer:
    description: "产品设计：PRD、需求评审、功能设计"
    skills:
      - product-design-principles
      - role-product-designer
  architect:
    description: "架构设计：技术方案、选型、接口设计"
    skills:
      - architecture-principles
      - role-architect
  developer:
    description: "开发与 Code Review"
    skills:
      - code-standards
      - role-developer
```

2. 脚本逻辑：根据当前选择的角色，按 `skills` 列表**顺序**读取对应目录下的 `SKILL.md`，拼接成 system prompt（或使用 [skills-ref](https://github.com/agentskills/agentskills) 的 `to-prompt` 再按顺序拼接），再调用 LLM。  
3. 这样同一批 Skills 既在 Cursor 里用「角色 Skill」串联，又在 CLI 里用配置串联，实现跨 IDE/CLI 的角色 Agent。

---

这样，你就把**产品设计原则 / 技术架构原则 / 代码规范**沉淀为了 Skills，并把它们**合并/串联成了不同角色 Agent 的动作**。
