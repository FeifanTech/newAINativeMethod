# Skills 维护指南

> 本文件说明 Skills 的维护机制，包括变更记录和 owner 分配。

---

## Skills Owner 列表

| Skill | Owner | 职责 |
|-------|-------|------|
| architecture-principles | @架构组 | 架构原则、技术方案评审 |
| code-standards | @开发组 | 代码规范、Code Review |
| product-design-principles | @产品组 | PRD 规范、需求评审 |
| development-principles | @开发组 | 开发流程、交付质量 |
| systematic-debugging | @开发组 | 调试流程、故障处理 |
| design-review-checklist | @架构组 | 设计评审清单 |
| implementation-plan | @开发组 | 实施计划、任务拆解 |
| doc-reflector | @文档组 | 文档同步维护 |
| k8s-deploy-guard | @运维组 | 部署配置检查 |
| release-notes-from-commits | @开发组 | 发布说明生成 |
| decisions-summary | @架构组 | 决策汇总 |
| role-architect | @架构组 | 架构师角色定义 |
| role-developer | @开发组 | 开发者角色定义 |
| role-product-designer | @产品组 | 产品设计师角色定义 |
| skill-learner-developer | @开发组 | Skill 开发规范 |
| using-skills | @文档组 | Skill 使用说明 |
| harness-engineering | @开发组 | 缰绳工程（Harness）最小检查与 AI-DLC Stage 对照；与 @架构组 协同评审运行时设计 |

---

## 变更规则

### 新增 Skill

1. 在 `.cursor/skills/` 下创建新目录
2. 编写 `SKILL.md`，包含完整的 name、description、触发条件、产出格式
3. 更新本文档的 Owner 列表，分配负责人
4. 在 CHANGELOG 中记录新增

### 修改 Skill

1. 修改对应的 `SKILL.md`
2. 更新 CHANGELOG，记录变更内容、日期、变更人
3. 如有重大变更（破坏性改动），通知相关 Owner review

### 废弃 Skill

1. 在 CHANGELOG 中标记为 deprecated
2. 在 `SKILL.md` frontmatter 中添加 `deprecated: true`
3. 保留 1 个月后移除

---

## 重大变更定义

以下情况视为重大变更，需要 Owner 确认：

- 改变 Skill 的核心职责
- 修改触发条件（可能导致激活逻辑变化）
- 删除或重命名已有字段
- 产出格式的重大调整

---

## Review 节奏

- **季度 Review**：每季度检查所有 Skills 的有效性
- **即时 Review**：重大变更时触发

---

## 如何贡献

1. 提交 PR 到本仓库
2. PR 内容包含：变更说明、测试/验证方式
3. 由对应 Owner 审核
4. 合并后更新 CHANGELOG
