# Skill 开发工作流（TDD 方法）

本文档说明如何用 **RED–GREEN–REFACTOR** 方法开发或优化**核心 Skill**（architecture-principles、code-standards、development-principles、product-design-principles），使 Skill 针对「观察到的问题」而非「假设的问题」，并与 AI-DLC 的 Stage/Plan 表述一致。

---

## 原则

**若未观察过 AI 在没有该 Skill 时的失败行为，就不知道 Skill 是否教对了。**

- 先观察失败（RED），再写/改 Skill（GREEN），最后优化（REFACTOR）。
- 只为**观察到**的错误与合理化借口写红旗与流程，不为假设写。
- 核心 Skill 建议本流程；其它 Skill 可沿用「学习→开发→优化」的常规流程。

---

## 流程

### Step 1：RED — 观察失败（必须）

#### 1.1 设计测试场景

选一个**具体的、可复现**的任务，例如：

- 好：实现订单创建接口（Controller + Service + 存储）
- 坏：学习架构设计（太抽象）

#### 1.2 在没有目标 Skill 的情况下执行

- 临时禁用相关 Skill（如将 `architecture-principles/SKILL.md` 重命名为 `SKILL.md.disabled`，或移到备份目录）。
- 在 Cursor 中给 AI 该任务（如「请实现一个订单创建接口，包含 Controller 和 Service」）。
- 观察 AI 的**具体行为**与**说法**。

#### 1.3 记录观察结果

建议在 `memory/scratchpad.md` 或 `docs/process/skill-drafts/` 下建观察记录，包含：

- 测试日期、测试场景描述。
- **观察到的问题**（可观察的代码/文档行为）：例如 Controller 直接依赖 Mapper、贫血模型、无领域校验。
- **合理化借口**（AI 的原话或等价表述）：例如「简单 CRUD 不需要分层」「业务逻辑在 Service 统一管理」「前端会做校验」。

---

### Step 2：GREEN — 写/改 Skill 解决问题

#### 2.1 基于观察编写内容

- **红旗清单**：每条对应一个「可观察的违规行为」+ 1～2 句「常见借口」；格式：「❌ [行为]。常见借口：[…]。→ 触达即停，交人决策。」
- **强制流程/正确示例**：针对同一问题写出正确做法（代码或步骤），便于 AI 与人在执行时对照。

#### 2.2 恢复 Skill 并验证

- 恢复 Skill（如将 `SKILL.md.disabled` 改回 `SKILL.md`）。
- 再次执行**同一任务**，观察 AI 是否：
  - 宣布使用该 Skill；
  - 按红旗与流程执行；
  - 不再出现之前记录的借口或错误行为。

#### 2.3 记录验证结果

- 若通过：在 changelog 或 Skill 末尾注明「已验证场景：…」。
- 若仍有问题：补充新的红旗或流程，重复 Step 2。

---

### Step 3：REFACTOR — 优化 Skill

- 简化表述，去掉冗余。
- 补充完整示例与边界情况。
- 若后续使用中发现新的借口或错误，补充到红旗清单，并可选更新本文档的「观察记录」模板。

---

## 关键规则

### ✅ 应该做

- 先观察 AI 失败，再写/改 Skill。
- 记录具体错误与借口，针对它们写红旗。
- 写完后用同一场景验证 Skill 是否有效。
- 与 AI-DLC 一致：Skill 对应 Stage，Plan 中「建议使用的 Skills」可引用本仓 Skill。

### ❌ 不应该做

- 为「假设的问题」写 Skill。
- 写「完美的通用指南」而忽略可验证场景。
- 跳过观察步骤直接写 Skill。
- 一次性写完所有内容而不验证。

---

## 与 using-skills / AI-DLC 的对应

- **using-skills**：执行任一 Stage 时须加载该 Stage 对应 Skill；本工作流产出的 Skill 即这些 Stage 的实现。
- **Level 1 Plan**：Plan 中「建议使用的 Skills」可列出本仓核心 Skill；Human Gate 处由人确认，触达红旗时须停止并交人决策。
- **memory/**：观察记录可放在 `memory/scratchpad.md`；验证通过后的变更摘要可写入 `memory/changelog.md`。

---

## 观察记录模板（可选）

```markdown
# 观察记录：[Skill 名称]

## 测试日期
YYYY-MM-DD

## 测试场景
（一句话描述任务，如：实现订单创建接口）

## 观察到的问题
1. [可观察行为] — 借口：「…」
2. …

## 验证结果（GREEN 后）
- 再次执行同一任务，AI 行为是否改变：是/否
- 仍需补充的红旗/流程：…
```

---

## 与写作规范的关系

RED–GREEN–REFACTOR 解决「Skill 是否针对真实失败」。落笔时仍建议遵守 [skill-writing-and-distribution.md](./skill-writing-and-distribution.md)：description 含 MUST/NOT、流程类 Skill 可选 `examples/`。

---

*本文档与 `.cursor/skills/skill-learner-developer/SKILL.md` 中的「2.0 Skill 开发工作流（TDD）」对应；核心 Skill 开发/优化时请按本流程执行。*
