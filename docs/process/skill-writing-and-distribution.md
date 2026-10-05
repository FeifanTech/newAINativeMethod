# Skill 写作与分发约定（借鉴外部开源）

本文落实对 **DeepSeek Harness**（概念对照）与 **腾讯 Skills 共享仓**（写作 / 分发）的轻量采纳：**学模式、不绑运行时**。概念映射见 [RFC-harness-engineering-mapping.md](../../RFC/harness-engineering/RFC-harness-engineering-mapping.md) §6。

---

## 1. 单一真相源

- **正式 Skills** 只维护在 `.cursor/skills/<name>/SKILL.md`。
- Cursor / Kiro / Claude 通过软链接或复制共用同一套内容（见 `CURSOR.md`、`scripts/init-repo.sh`、`scripts/sync-skills.sh`）。
- **不要**把 `.codebuddy/skills` 或其它 IDE 目录当作第二套维护源；若团队使用 CodeBuddy，可另建软链接指向 `.cursor/skills`，或按需复制后再定期与真源同步。

---

## 2. SKILL.md 写作强化（MUST / NOT / preflight）

借鉴 [TencentCloudBase/skills](https://github.com/TencentCloudBase/skills) 的路由纪律，新写或重大优化 Skill 时，`description` 与正文建议包含：

| 要素 | 作用 | 示例 |
|------|------|------|
| **做什么（WHAT）** | 能力边界 | 「按架构原则评审技术方案」 |
| **何时用（WHEN / MUST）** | 触发场景 | 「当用户写/评审技术方案、选型、ADR 时使用」 |
| **何时不用（NOT for）** | 防误触发 | 「不用于纯文案润色或与架构无关的小改」 |
| **preflight（可选）** | 执行前最小检查 | 「先确认是否已有 PRD/约束；无则先澄清或加载 product-design-principles」 |

### 2.1 description 推荐模板

```text
<做什么>。当用户说「…」或涉及「…」时使用。MUST：…。NOT for：…。
```

### 2.2 可选目录：`examples/`

借鉴 [Tencent/awesome-devbuddy](https://github.com/Tencent/awesome-devbuddy) 的渐进样例：

```text
.cursor/skills/<skill-name>/
├── SKILL.md              # 必选
├── examples/             # 可选：可复现的小示例或对照输入/输出
│   └── 01-minimal.md
└── scripts/              # 可选：校验脚本
```

- 核心原则类 Skill 可不强制 examples；带流程/工具的 Skill（如调试、部署守卫、测试）**建议**至少 1 个最小示例。
- examples **不替代**红旗清单与检查清单。

### 2.3 与 TDD 工作流的关系

核心 Skill 仍优先走 [skill-development-workflow.md](./skill-development-workflow.md)（RED–GREEN–REFACTOR）。本文的 MUST/NOT/examples 是**写作与可发现性**增强，不替代观察失败再写红旗。

---

## 3. 分层能力包（可选索引，不改真源）

借鉴 awesome-devbuddy 的 **Agents / Commands / Skills / Rules** 分层，本仓对应关系：

| 外部说法 | 本仓落点 |
|----------|----------|
| Skills | `.cursor/skills/*/SKILL.md` |
| Agents / 角色 | `role-*` Skills + `roles.yaml` + `build-role-prompt.sh` |
| Rules / 约定 | `CURSOR.md`、`CLAUDE.md`、`.cursor/rules/`（若有） |
| Commands | 可发现的脚本入口：见下文「Commands 索引」 |

不必新建平行目录树；在文档中把「命令」列清楚即可。

### 3.1 Commands 索引（本仓脚本）

| 意图 | 命令 |
|------|------|
| 初始化业务仓结构 | `./scripts/init-repo.sh` |
| 同步基线 Skills | `./scripts/sync-skills.sh` |
| 按角色拼统一 prompt | `./scripts/build-role-prompt.sh <role> [--output …]` |
| 收集遗留架构基线输入 | `./scripts/collect-architecture-baseline-input.sh`（若存在） |
| 发版相关 commit 列表 | `./scripts/get-commits-for-release.sh`（若存在） |

新增脚本时：在本表与 [QUICK_START.md](./QUICK_START.md)「常用命令」同步一行。

---

## 4. 多 IDE / 分发 UX

### 4.1 推荐：软链接对齐（与 init-repo 一致）

业务仓在已有 `.cursor/skills` 后：

```bash
# Kiro
mkdir -p .kiro/skills
ln -s "$(pwd)/.cursor/skills" .kiro/skills

# Claude Code
mkdir -p .claude/skills
ln -s "$(pwd)/.cursor/skills" .claude/skills
```

`./scripts/init-repo.sh` 与 `./scripts/sync-skills.sh` 会维护上述链接。灵感来自 TRTC 的「一次安装、多 IDE」UX，实现上用**软链接 + 单一真源**，避免多份拷贝漂移。

### 4.2 与 `npx skills add` 生态的关系

CloudBase / 社区常用 `npx skills add <org/repo>`。本仓**当前**以 `sync-skills.sh` / 手动拷贝为主，原因：

- 真源在 GitHub 基线仓，语义是「覆盖同名、保留业务独有」；
- 需同时维护 Kiro/Claude 兼容目录。

若团队已习惯 `skills` CLI：可将本仓当作上游，**安装后仍执行一次** `./scripts/sync-skills.sh` 或手动确认 `.kiro/skills`、`.claude/skills` 指向 `.cursor/skills`。本仓**不强制**自建 npm registry。

### 4.3 选择性复制（共享集合模式）

不必全量同步。可只拷贝：

```bash
# 示例：只要架构 + harness
rsync -av /path/to/baseline/.cursor/skills/architecture-principles/ .cursor/skills/architecture-principles/
rsync -av /path/to/baseline/.cursor/skills/harness-engineering/ .cursor/skills/harness-engineering/
rsync -av /path/to/baseline/.cursor/skills/using-skills/ .cursor/skills/using-skills/
```

并更新业务仓的 `SKILLS_INDEX` 或 README 说明已采纳子集。

---

## 5. DeepSeek Harness：个人可选，非默认

- 文档与概念对照：RFC §6.1。
- **基线仓不默认安装** `dsh`；若个人试用，遵循：危险操作二次确认；Skill/记忆草稿经 PR 合入；不修改本仓默认工作流为「必须经 dsh」。

---

## 6. 相关文档

- [SKILLS_INDEX.md](./SKILLS_INDEX.md)
- [skill-development-workflow.md](./skill-development-workflow.md)
- [CURSOR_SKILLS_GUIDE.md](./CURSOR_SKILLS_GUIDE.md)
- [adopt-this-project-in-your-repo.md](./adopt-this-project-in-your-repo.md)
- Skill：`.cursor/skills/skill-learner-developer/SKILL.md`、`.cursor/skills/harness-engineering/SKILL.md`
