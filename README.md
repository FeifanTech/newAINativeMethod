# AI-native 研发方法论与可复用技能库

本仓库是 **AI-native 研发方法论与 Agent Skills 的模板仓 / 基线仓**，不是业务线上代码仓。

## 内容概览

- **原则与规范**：架构、产品、开发各有一套原则与评审检查清单。
- **文档模板**：PRD、技术方案、工作量与风险分析等，位于 `docs/` 下按类型拆分。
- **Agent Skills**：`.cursor/skills/` 下按类型分类，供 Cursor、Kiro、Claude Code 等主流 AI 工具匹配使用。
- **正式角色配置**：`.cursor/skills/roles.yaml` 为可直接复制到业务仓的默认角色配置；`.cursor/skills/roles.yaml.example` 保留为最小示例。
- **样板工程**：`projects/` 下为按方法论落地的 Demo（如千岛湖溯源 demo）。

## 结构速览

```
docs/architecture/   # 技术方案、架构方法论
docs/product/       # PRD、产品文档、工作量与风险
docs/process/       # 流程、规范、采纳指南
.cursor/skills/     # Agent Skills（Cursor/Kiro/Claude 通用）
.kiro/skills/      # Kiro 专用（软链接至 .cursor/skills）
.claude/skills/    # Claude 专用（软链接至 .cursor/skills）
projects/          # 样板 Demo
CURSOR.md          # 本仓与 AI 工具的约定（含 Kiro/Claude 设置）
CLAUDE.md          # Claude Code 约定（可直接复制到业务仓）
```

## 快速开始

1. **先看图**：打开 **[docs/process/QUICK_START.md](docs/process/QUICK_START.md)**（仓库结构图、一条需求怎么走、场景→Skill 路由）。
2. 阅读 **docs/overview.md** 了解「为何要」与基线↔业务协同全景。
3. 阅读 **CURSOR.md** 了解 AI 工具约定（含 Kiro/Claude）。
4. 业务仓复用：见 **docs/process/adopt-this-project-in-your-repo.md**；首次推荐 `./scripts/init-repo.sh`。
5. Kiro：`mkdir -p .kiro/skills && ln -s "$(pwd)/.cursor/skills" .kiro/skills`
6. Claude：`mkdir -p .claude/skills && ln -s "$(pwd)/.cursor/skills" .claude/skills`

## 千岛湖溯源示例

- PRD：`docs/product/QIANDAO_LAKE_FISHERY_TRACEABILITY_PRD.md`
- 技术方案：`docs/architecture/QIANDAO_LAKE_TRACEABILITY_TECH_SOLUTION.md`
- Demo：`projects/qiandao-lake-traceability-demo/`

## 基线仓与业务仓协同

- **全景图与执行清单**：见 **docs/overview.md** 的「五、基线仓与业务仓协同全景」（Mermaid 图）与「六、立即执行清单」。
- **分发**：业务仓使用 `scripts/sync-skills.sh` 从本仓同步 `.cursor/skills`。
- **统一入口**：可使用 `scripts/build-role-prompt.sh` 按角色拼接 `using-skills`、角色 Skills、`CURSOR.md` 与 `memory/`，生成团队统一 prompt 入口，减少多人协作时的上下文漂移。
- **Harness Engineering**：概念映射与外部开源对照见 **RFC/harness-engineering/RFC-harness-engineering-mapping.md**；执行检查见 Skill **harness-engineering**；写作/分发见 **docs/process/skill-writing-and-distribution.md**。
- **飞书 + GitHub 全流程**：见 **docs/process/feishu-github-workflow.md**（RFC：`RFC/feishu-github-flow/`），含需求卡、PR 模板、三态门控、四指标。
- **遗留项目接入**：先用 `docs/process/legacy-architecture-baseline-template.md` 产出架构基线快照；若要让 AI 先出初稿，见 `docs/process/generate-legacy-architecture-baseline-with-ai.md`；随后再按 `docs/process/legacy-project-adoption-template.md` 渐进导入。
- **防漂移**：Skill `doc-reflector` 在代码变更后反向更新 `docs/` 下 PRD/架构文档。
- **Ops**：Skill `k8s-deploy-guard` 在编写 K8s/Docker 配置时做资源、安全与探针检查。
- **Release Notes 与决策汇总**：Skill `release-notes-from-commits`、`decisions-summary` 用于自动生成发布说明草稿与决策摘要；使用说明与 CI 示例见 **docs/process/release-notes-and-decisions.md**。
- **企业级检查清单（可选）**：若项目为 **Java/Spring**、**Python/FastAPI 或 Django**、**TypeScript/Node/Nest**，架构与编码类 Skill 会结合对应 **docs/architecture/** 下 `JAVA_ENTERPRISE_CHECKLIST.md`、`PYTHON_ENTERPRISE_CHECKLIST.md`、`TS_ENTERPRISE_CHECKLIST.md` 逐项审查并给出结论；其他技术栈可跳过。详见各文档。
