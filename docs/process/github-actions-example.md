# GitHub Actions 示例：PR 审查

> 本仓为**方法论模板仓**，不强制在本仓启用 CI。本文提供一份可在**业务仓库**中复用的 PR 审查 workflow 示例；实际使用时需在业务仓中替换 API Key、触发条件等。

---

## 使用场景

- 在 **Pull Request** 打开或更新时，触发 AI 或规则对变更做一轮审查（如架构/代码规范预审）。
- 团队主要使用 **Cursor** 时，本示例可作为「在 CI 中跑审查」的参考；若使用 Claude Code、GitHub Copilot 等，可替换为对应 Action 或脚本。

---

## 示例：基于提示的 PR 审查（通用思路）

以下为**伪代码级**示例，展示 workflow 结构与需替换项。实际可用的 Action 依赖具体工具（如 [Claude Code](https://github.com/anthropics/claude-code-github-actions)、[Cursor 相关](https://cursor.directory) 或自建脚本）。

```yaml
# .github/workflows/pr-review.yml（示例，需按实际工具替换）
name: PR Review

on:
  pull_request:
    branches: [main, develop]
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      # --- 以下为占位，需替换为实际可用的 Action 或脚本 ---
      # 思路：用 AI 或规则引擎对 PR 的 diff 做审查，输出结论到 comment 或 job summary
      # - name: Run review
      #   env:
      #     API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}  # 或 CURSOR/其它，按实际替换
      #   run: |
      #     # 调用审查脚本或 API，传入 PR 信息与「审查原则」提示
      #     # 提示可引用本仓原则，例如：按架构原则与代码规范做预审
      #   ...

      # - name: Comment review result
      #   uses: actions/github-script@v7
      #   with:
      #     script: |
      #       github.rest.issues.createComment({
      #         issue_number: context.issue.number,
      #         owner: context.repo.owner,
      #         repo: context.repo.repo,
      #         body: '...'  # 上一步输出的审查结论
      #       })
```

---

## 需在业务仓中替换的部分

| 项 | 说明 |
|----|------|
| **API Key / 鉴权** | 若使用需鉴权的 AI 服务，将密钥放入 GitHub Secrets（如 `ANTHROPIC_API_KEY`），在 workflow 中通过 `secrets.xxx` 使用。 |
| **触发分支** | 将 `branches: [main, develop]` 改为业务仓实际使用的分支。 |
| **审查逻辑** | 将「Run review」步骤替换为实际可执行的 Action 或脚本（如调用 Claude API、或运行基于本仓原则的规则检查脚本）。 |
| **审查原则** | 审查提示中可引用本仓原则（如「按 docs/architecture 下的架构原则与 code-standards 做预审」），需在业务仓中能访问到这些文档（拷贝到业务仓或通过 submodule 引用）。 |

---

## 本仓的定位

- 本仓**不默认启用**上述 workflow，以避免依赖外部 API 与计费。
- 本仓提供此文档作为**可拷贝的参考**；业务仓采纳时可将上述示例复制到业务仓 `.github/workflows/` 下，并按上表替换后使用。
- 更多流程与 Skills 说明见 [adopt-this-project-in-your-repo.md](./adopt-this-project-in-your-repo.md)、[SKILLS_INDEX.md](./SKILLS_INDEX.md)。

---

**文档版本**：v0.1  
**维护**：随 CI 工具与团队实践更新。
