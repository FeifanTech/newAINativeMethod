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
.cursor/skills/     # Agent Skills（Cursor/Kiro 通用）
.kiro/skills/      # Kiro 专用（软链接至 .cursor/skills）
projects/          # 样板 Demo
CURSOR.md          # 本仓与 AI 工具的约定（含 Kiro 设置）
```

## 快速开始

1. 阅读 **docs/overview.md** 了解「为何要、结构、如何落地」。
2. 阅读 **CURSOR.md** 了解在本仓中 AI 工具的定位与允许范围（含 Kiro 设置）。
3. 阅读 **docs/process/QUICK_START.md** 获取一页纸快速指南。
4. 若要在业务仓复用：见 **docs/process/adopt-this-project-in-your-repo.md**。
   - 首次使用推荐运行 `./scripts/init-repo.sh` 一键初始化。
5. Kiro 用户：执行 `mkdir -p .kiro/skills && ln -s "$(pwd)/.cursor/skills" .kiro/skills` 或复制使用。

## 千岛湖溯源示例

- PRD：`docs/product/QIANDAO_LAKE_FISHERY_TRACEABILITY_PRD.md`
- 技术方案：`docs/architecture/QIANDAO_LAKE_TRACEABILITY_TECH_SOLUTION.md`
- Demo：`projects/qiandao-lake-traceability-demo/`

## 基线仓与业务仓协同

- **全景图与执行清单**：见 **docs/overview.md** 的「五、基线仓与业务仓协同全景」（Mermaid 图）与「六、立即执行清单」。
- **分发**：业务仓使用 `scripts/sync-skills.sh` 从本仓同步 `.cursor/skills`。
- **统一入口**：可使用 `scripts/build-role-prompt.sh` 按角色拼接 `using-skills`、角色 Skills、`CURSOR.md` 与 `memory/`，生成团队统一 prompt 入口，减少多人协作时的上下文漂移。
- **遗留项目接入**：见 `docs/process/legacy-project-adoption-template.md`，按“先 Review、再 memory、后设计”的渐进方式导入。
- **防漂移**：Skill `doc-reflector` 在代码变更后反向更新 `docs/` 下 PRD/架构文档。
- **Ops**：Skill `k8s-deploy-guard` 在编写 K8s/Docker 配置时做资源、安全与探针检查。
- **Release Notes 与决策汇总**：Skill `release-notes-from-commits`、`decisions-summary` 用于自动生成发布说明草稿与决策摘要；使用说明与 CI 示例见 **docs/process/release-notes-and-decisions.md**。
- **企业级检查清单（可选）**：若项目为 **Java/Spring**、**Python/FastAPI 或 Django**、**TypeScript/Node/Nest**，架构与编码类 Skill 会结合对应 **docs/architecture/** 下 `JAVA_ENTERPRISE_CHECKLIST.md`、`PYTHON_ENTERPRISE_CHECKLIST.md`、`TS_ENTERPRISE_CHECKLIST.md` 逐项审查并给出结论；其他技术栈可跳过。详见各文档。
