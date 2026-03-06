# 用 AI 生成遗留项目架构基线

> 本文档说明如何用 AI 为遗留项目生成 `memory/architecture-baseline.md` 的初稿。目标是低成本拿到一份可靠的基线快照，而不是一开始就写完整技术方案。

## 适用场景

- 遗留项目刚接入这套方法论。
- 团队缺少最新架构文档，但代码、配置和部署文件还在。
- 希望先让 AI 产出 60% 到 80% 的初稿，再由负责人补关键事实。

## 产出物

- 原始扫描输入：`/tmp/architecture-input.md` 或项目内临时文件
- AI 初稿：`memory/architecture-baseline.md`
- 人工确认后的版本：继续保留在 `memory/architecture-baseline.md`

## 分工原则

- **脚本**：负责收集可观察事实，不下判断。
- **AI**：负责归纳技术栈、模块边界、调用链、外部依赖和风险，生成初稿。
- **人工**：负责补口头约束、历史原因、允许与禁止、确认人和待补项。

## 推荐流程

### 第一步：收集项目结构事实

在业务仓根目录执行：

```bash
bash scripts/collect-architecture-baseline-input.sh --output /tmp/architecture-input.md
```

这个脚本会扫描：

- 顶层目录和常见清单文件
- 依赖清单和构建文件
- 部署与 CI 文件
- 入口点信号
- 集成与基础设施信号
- 路由、数据库和迁移信号

它的输出不是最终文档，而是给 AI 用的“原始事实包”。

### 第二步：给 AI 生成初稿

推荐同时提供三类输入：

1. 项目规则与角色约束

```bash
bash scripts/build-role-prompt.sh architect --no-memory --output /tmp/architect-prompt.md
```

2. 原始结构扫描

```bash
/tmp/architecture-input.md
```

3. 基线模板

```text
docs/process/legacy-architecture-baseline-template.md
```

### 第三步：使用推荐提示词

可直接给 AI 这样的请求：

```text
请基于 /tmp/architect-prompt.md、/tmp/architecture-input.md 和 docs/process/legacy-architecture-baseline-template.md，
为当前项目生成一版 memory/architecture-baseline.md 初稿。

要求：
1. 只写从代码和配置中能 reasonably infer 的事实，不要编造组织信息。
2. 技术栈、模块边界、核心调用链、外部依赖、已知风险、允许与禁止要尽量具体。
3. 不确定的内容放到“待补充项”，并标记需要人工确认。
4. 输出尽量控制在 2 到 5 页。
```

### 第四步：人工只补 AI 看不到的部分

人工重点补这些内容：

- 哪些模块没人敢动，为什么
- 哪些外部接口有口头约束
- 哪些表、脚本、状态流转不能直接改
- 哪些风险来自组织、发布、合规，而不是代码
- 谁是对应事实的确认人

不要让人工重写整份文档。正确做法是“AI 先成稿，人工补盲区”。

## 推荐检查清单

在确认 `memory/architecture-baseline.md` 前，至少检查：

- 技术栈是否与实际仓库一致
- 模块划分是否能映射到真实目录或服务
- 核心调用链是否抓住了主要业务路径
- 外部依赖是否漏掉关键系统
- “允许与禁止”是否有负责人确认
- 不确定项是否被显式列入“待补充项”

## 什么时候需要重新生成

- 发生明显架构调整
- 新增核心服务或拆分单体
- 外部系统边界变化
- 发布形态变化
- 团队发现现有基线已不能指导开发判断

## 与其他文档的关系

- [legacy-architecture-baseline-template.md](/Volumes/T7/projects/newAINativeMethod/docs/process/legacy-architecture-baseline-template.md)
  - 定义输出结构。
- [legacy-project-adoption-template.md](/Volumes/T7/projects/newAINativeMethod/docs/process/legacy-project-adoption-template.md)
  - 定义遗留项目接入顺序。
- [build-role-prompt.sh](/Volumes/T7/projects/newAINativeMethod/scripts/build-role-prompt.sh)
  - 提供角色和规则上下文。
- [collect-architecture-baseline-input.sh](/Volumes/T7/projects/newAINativeMethod/scripts/collect-architecture-baseline-input.sh)
  - 提供原始事实扫描。
