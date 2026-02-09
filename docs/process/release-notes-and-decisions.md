# Release Notes 与决策汇总 · 使用说明与 CI 示例

> 本仓提供 **release-notes-from-commits** 与 **decisions-summary** 两个 Skill，用于自动生成 Release Notes 草稿与决策摘要。本文说明手动使用方式与可选 CI 集成思路。

---

## 一、使用场景

| 能力 | 作用 | 输入 | 输出 |
|------|------|------|------|
| **Release Notes** | 根据本 release 的 commit/PR 生成发布说明草稿 | commit 列表或 tag 区间 | Markdown（新增/修复/变更/破坏性） |
| **决策汇总** | 汇总 memory/decisions 或 ADR 的已采纳决策 | decisions 文件、可选时间范围 | 决策摘要 Markdown |

二者可单独使用，也可在发版时一起用：先汇总决策（作为「重要变更」一节），再根据 commit 生成 Release Notes，合并后写入 GitHub Release 或 `docs/process/release-notes/`。

---

## 二、手动使用方式

### 2.1 生成 Release Notes

1. **获取 commit 列表**（在仓库根目录执行）：
   ```bash
   # 上一版本 tag 到当前 HEAD
   git log --oneline v1.0.0..HEAD

   # 或带 subject + body，便于 AI 分类
   git log v1.0.0..HEAD --pretty=format:"%h %s%n%b---"
   ```
2. **在 Cursor 中**：将上述输出粘贴给 AI，并说「请根据这些 commit 生成 Release Notes 草稿」或「使用 release-notes-from-commits 生成发布说明」。
3. **审阅后**：将生成的 Markdown 写入 `docs/process/release-notes/YYYY-MM-DD-v1.1.0.md` 或复制到 GitHub Release 描述。

### 2.2 汇总决策

1. **确认决策来源**：业务仓若有 `memory/decisions.md`，确保 Accepted 区有内容；或使用 `docs/architecture/` 下 ADR 文件。
2. **在 Cursor 中**：说「请汇总 memory/decisions.md 中已采纳的决策」或「使用 decisions-summary 生成本 release 的决策摘要」。
3. **审阅后**：将摘要写入 `docs/process/decisions-summary.md` 或作为 Release Notes 的一节。

### 2.3 发版时组合使用

- 先运行 **decisions-summary**，得到「本 release 重要决策」。
- 再运行 **release-notes-from-commits**，得到「新增/修复/变更/破坏性」。
- 将决策摘要作为 Release Notes 的「重要变更」或「架构与决策」一节，与 commit 分类结果合并，形成完整发布说明。

---

## 三、获取 commit 列表的脚本示例

业务仓可将以下逻辑放入脚本，供 CI 或本地调用，将 commit 列表输出到 stdout，再交给 AI 或后续步骤处理。

```bash
#!/bin/bash
# scripts/get-commits-for-release.sh
# 用法：./scripts/get-commits-for-release.sh [上一版本tag] [本版本tag或HEAD]
# 示例：./scripts/get-commits-for-release.sh v1.0.0 HEAD

PREV_TAG="${1:-$(git describe --tags --abbrev=0 2>/dev/null)}"
END_REF="${2:-HEAD}"
git log "$PREV_TAG..$END_REF" --pretty=format:"%h %s%n%b---"
```

CI 中可先打 tag，再执行该脚本将输出写入 artifact 或环境变量，供生成 Release Notes 的步骤使用。

---

## 四、CI 集成示例（GitHub Actions）

以下为**思路示例**：在 push tag 时获取 commit 列表，生成 Release Notes 草稿并创建或更新 GitHub Release。实际使用时需按业务仓替换 tag 格式、分支与权限。

```yaml
# .github/workflows/release-notes.yml（示例）
name: Release Notes

on:
  push:
    tags:
      - 'v*'

jobs:
  release-notes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Get commit list
        id: commits
        run: |
          PREV=$(git describe --tags --abbrev=0 HEAD^ 2>/dev/null || echo "")
          if [ -z "$PREV" ]; then PREV=$(git rev-list --max-parents=0 HEAD); fi
          echo "commits<<EOF" >> $GITHUB_OUTPUT
          git log "$PREV..HEAD" --pretty=format:"%h %s%n%b---" >> $GITHUB_OUTPUT
          echo "EOF" >> $GITHUB_OUTPUT

      # --- 以下需替换为实际生成逻辑 ---
      # 方案 A：将 commit 列表写入 artifact，由人工在 Cursor 中粘贴给 release-notes-from-commits
      # 方案 B：调用内部 API/脚本（如封装 LLM）生成 Markdown，再写入 Release
      # - name: Generate release notes draft
      #   env:
      #     COMMITS: ${{ steps.commits.outputs.commits }}
      #     # API_KEY: ${{ secrets.RELEASE_NOTES_API_KEY }}  # 若用 LLM
      #   run: |
      #     # 调用脚本或 API，传入 COMMITS，得到 Markdown
      #     # echo "$COMMITS" | your-script.sh > release-notes.md

      # - name: Create GitHub Release
      #   uses: softprops/action-gh-release@v1
      #   with:
      #     body_path: release-notes.md
      #     draft: true
      #   env:
      #     GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**决策汇总** 若要在 CI 中执行，可增加一个 job 或 step：读取 `memory/decisions.md`（或 ADR 路径），按约定格式解析 Accepted 条目，生成摘要并写入 artifact 或 Release 的某一节。触发条件可为同一 tag 或定时（如每周）。

---

## 五、与现有体系的衔接

| 项 | 说明 |
|----|------|
| **memory/changelog.md** | release-notes-from-commits 可将「版本号 + 发布日期 + 简要条目」追加到 changelog，便于与项目记忆统一。 |
| **memory/decisions.md** | decisions-summary 消费 Accepted 区；各 Skill 写入 Proposed 并经人工确认后移至 Accepted，保证汇总来源一致。 |
| **docs/process/release-notes/** | 建议将生成的 Release Notes 草稿按版本号或日期归档于此，便于回溯。 |
| **docs/process/decisions-summary.md** | 可将决策汇总结果定期写入该文件，或作为 Release Notes 的一部分。 |

---

## 六、Skill 索引

- **release-notes-from-commits**：`.cursor/skills/release-notes-from-commits/SKILL.md`
- **decisions-summary**：`.cursor/skills/decisions-summary/SKILL.md`

更多 Skill 见 [SKILLS_INDEX.md](./SKILLS_INDEX.md)。

---

**文档版本**：v0.1  
**维护**：随 Release Notes / 决策汇总流程变更更新。
