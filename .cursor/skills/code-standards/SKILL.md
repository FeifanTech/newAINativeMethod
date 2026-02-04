---
name: code-standards
description: 代码规范与 Code Review 清单。在编写代码、代码审查、重构、Code Review、提交前自检时使用；当用户提到代码规范、Code Review、代码审查时应用。
---

# 代码规范

## 通用原则（请按团队实际替换）

1. **可读优先**：命名达意、结构清晰，注释解释「为什么」而非「是什么」。
2. **单一职责**：函数/类职责单一，避免过长函数与上帝类。
3. **错误与边界**：异常与错误路径显式处理，边界条件有测试或说明。
4. **可测试**：核心逻辑可单测，依赖可替换（构造注入/接口）。
5. **与项目一致**：遵循项目既有风格（命名、包结构、框架约定）。

## Code Review 检查清单

- [ ] 命名是否达意、是否符合项目约定？
- [ ] 是否有明显重复？是否可抽取复用？
- [ ] 异常与错误是否处理？日志是否合理？
- [ ] 是否有安全/合规风险（如敏感数据、注入）？
- [ ] 关键逻辑是否有测试或可验证方式？
- [ ] 是否引入不必要的依赖或复杂度？

## 示例（Java，可按语言替换）

```java
// ✅ 推荐：异常打日志并包装再抛
try {
  return client.call();
} catch (IOException e) {
  log.warn("Call failed", e);
  throw new ServiceException("调用失败", e);
}

// ❌ 避免：吞掉异常
try {
  return client.call();
} catch (IOException e) {}
```

## 使用说明

本 Skill 可被「开发角色」引用；也可在单独做 Code Review 时由 Agent 自动匹配。若希望「打开 Java 就带规范」，可在 `.cursor/rules/` 下增加 `java-standards.mdc`（globs: `**/*.java`）。
