# Skills Changelog

> 本文件记录 Skills 的变更历史。遵循 [Keep a Changelog](https://keepachangelog.com/) 格式。

---

## [未发布] - 建设中

### 新增

- `systematic-debugging`: 系统化调试流程，四阶段（根因追踪→多层防御→修复验证→经验沉淀）
- `using-skills`: Skill 自动加载逻辑，根据任务类型自动匹配

### 更新

- 统一所有 Skills 遵循 [Agent Skills](https://agentskills.io) 标准

---

## [v1.0.0] - 2025-02-05

### 新增

- **原则类**
  - `architecture-principles`: 技术架构原则与评审清单
  - `product-design-principles`: 产品设计原则与评审清单
  - `development-principles`: 开发原则与交付质量清单
  - `code-standards`: 代码规范与 Code Review 清单

- **角色类**
  - `role-architect`: 架构师角色定义
  - `role-developer`: 开发者角色定义
  - `role-product-designer`: 产品设计师角色定义

- **流程类**
  - `design-review-checklist`: 设计评审清单
  - `implementation-plan`: 实施计划、任务拆解

- **Ops 类**
  - `doc-reflector`: 代码变更后反向更新文档
  - `k8s-deploy-guard`: K8s/Docker 部署配置检查
  - `release-notes-from-commits`: 自动生成 Release Notes
  - `decisions-summary`: 决策汇总

- **工具类**
  - `skill-learner-developer`: Skill 开发规范
  - `roles.yaml.example`: 角色配置示例
