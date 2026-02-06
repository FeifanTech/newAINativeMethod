# newAINativeMethod

> AI 原生开发方法论的探索与实践

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Cursor Skills](https://img.shields.io/badge/Cursor-Skills-green.svg)](https://cursor.sh)

## 📖 项目简介

**newAINativeMethod** 是一个系统化探索 **AI 原生开发方法** 的实践仓库。通过 **Cursor Skills** 技能库，我们将开发原则、产品设计原则和架构原则沉淀为可复用的技能，并通过真实业务场景验证其有效性。

### 核心理念

- **原则即代码**（Principles as Code）：将抽象的开发原则转化为可执行的 Skills
- **角色化 Agent**：不同角色使用专业的 AI 助手（产品设计 Agent、架构师 Agent、开发者 Agent）
- **小步交付**：通过 Demo 快速验证想法，可独立交付、可验证、可回滚
- **可复用生态**：Skills 可以跨项目、跨团队使用，形成可扩展的技能库

## 🚀 快速开始

### 浏览项目

```bash
# 克隆仓库
git clone https://github.com/FeifanTech/newAINativeMethod.git
cd newAINativeMethod

# 查看项目结构
tree -L 2 -I '.git'

# 阅读完整项目分析
cat PROJECT_ANALYSIS.md
```

### 使用 Cursor Skills

1. **复制 Skills 到个人目录**（所有项目可用）：
   ```bash
   cp -r .cursor/skills/* ~/.cursor/skills/
   ```

2. **或在项目中直接使用**（仅当前项目）：
   - Skills 已在 `.cursor/skills/` 目录下
   - 在 Cursor 中打开项目即可自动识别

3. **触发 Skills**：
   - 说"按产品设计原则评审这个 PRD"
   - 说"作为架构师看下这个技术方案"
   - 说"按代码规范做一次 Code Review"
   - 说"从市场学习 skills"

### 运行 Demo

```bash
# 进入千岛湖溯源 Demo
cd projects/qiandao-lake-traceability-demo

# 方式1: 直接用浏览器打开
open index.html

# 方式2: 启动本地服务器
python3 -m http.server 8080
# 访问 http://localhost:8080
```

## 📁 项目结构

```
newAINativeMethod/
├── .cursor/skills/          # Cursor Skills 技能库
│   ├── product-design-principles/   # 产品设计原则
│   ├── architecture-principles/     # 技术架构原则
│   ├── code-standards/             # 代码规范
│   ├── development-principles/      # 开发原则
│   ├── role-product-designer/      # 角色：产品设计 Agent
│   ├── role-architect/             # 角色：架构师 Agent
│   ├── role-developer/             # 角色：开发者 Agent
│   └── skill-learner-developer/    # 元技能：学习和开发 Skills
│
├── docs/                    # 项目文档
│   ├── PRINCIPLES_AND_ROLE_AGENTS_GUIDE.md  # 原则沉淀与角色 Agent 指南
│   ├── CURSOR_SKILLS_GUIDE.md               # Cursor Skills 使用指南
│   ├── QIANDAO_LAKE_FISHERY_TRACEABILITY_PRD.md    # 千岛湖溯源 PRD
│   ├── AI_OUTBOUND_CALLING_PLATFORM_PRD.md         # AI 外呼平台 PRD
│   └── ...
│
├── projects/                # 实战项目
│   └── qiandao-lake-traceability-demo/  # 千岛湖全鱼品溯源平台 Demo
│
├── PROJECT_ANALYSIS.md      # 📊 完整项目分析报告
└── README.md               # 本文件
```

## 🎯 核心特性

### 1. 可复用的 Skills 技能库

| Skill | 说明 | 适用场景 |
|-------|------|----------|
| **product-design-principles** | 产品设计原则：用户优先、目标可衡量、优先级清晰 | PRD 评审、需求设计、功能规划 |
| **architecture-principles** | 架构原则：可扩展、可维护、性能与安全 | 架构设计、技术选型、系统拆分 |
| **code-standards** | 代码规范：命名、结构、注释、错误处理 | 代码审查、重构、开发规范 |
| **development-principles** | 开发原则：小步交付、质量门禁、可追溯 | 迭代规划、开发流程、协作 |
| **role-product-designer** | 产品设计 Agent：串联产品原则+模板 | 作为产品经理工作 |
| **role-architect** | 架构师 Agent：串联架构原则+ADR | 作为架构师工作 |
| **role-developer** | 开发者 Agent：串联代码规范+审查清单 | 作为开发者工作 |
| **skill-learner-developer** | 元技能：学习、开发、优化 Skills | 扩展技能库 |

### 2. 真实业务场景

#### 千岛湖全鱼品溯源平台

- **业务价值**：政府监管水产品质量安全，覆盖养殖→检测→加工→流通→消费全链条
- **产品特点**：三角色入口、五步向导、地图选点、上下游数量约束
- **技术栈**：纯前端 Demo（HTML/CSS/JavaScript + Leaflet + localStorage）
- **代码量**：~1,948 行

#### AI 智能外呼平台

- **业务价值**：企业外呼场景（营销、回访、通知、调研）的 AI 化
- **产品设计**：任务配置、AI 对话引擎、监控报表、合规安全
- **技术方案**：ASR/TTS、多轮对话、转人工、录音存储

### 3. 完整的文档体系

- **使用指南**：[Cursor Skills 使用指南](docs/CURSOR_SKILLS_GUIDE.md)
- **开发指南**：[原则沉淀与角色 Agent 指南](docs/PRINCIPLES_AND_ROLE_AGENTS_GUIDE.md)
- **产品文档**：完整的 PRD、技术方案、工作量评估
- **项目分析**：[完整项目分析报告](PROJECT_ANALYSIS.md)

## 💡 核心价值

### 对个人开发者

✅ 学习 AI 辅助开发的最佳实践  
✅ 获得可直接使用的 Skills 模板  
✅ 掌握小步交付的实践方法  
✅ 提升产品思维和架构能力

### 对团队

✅ 沉淀团队开发原则和规范  
✅ 构建可复用的技能库  
✅ 提高团队协作效率  
✅ 降低新人学习成本

### 对组织

✅ 探索 AI 原生工作方式  
✅ 建立知识管理体系  
✅ 提升研发效率和质量  
✅ 形成可扩展的方法论

## 📚 学习路径

### 入门（1 小时）

1. 阅读 [README.md](README.md)（本文件）
2. 浏览 [Cursor Skills 使用指南](docs/CURSOR_SKILLS_GUIDE.md)
3. 运行千岛湖溯源 Demo，体验交互

### 进阶（半天）

1. 阅读 [原则沉淀与角色 Agent 指南](docs/PRINCIPLES_AND_ROLE_AGENTS_GUIDE.md)
2. 查看 `.cursor/skills/` 下的所有 Skills
3. 在 Cursor 中触发不同的 Skills，观察 AI 的响应

### 实践（1-2 天）

1. 根据团队实际情况，调整 Skills 内容
2. 开发团队专属的新 Skills（使用 `skill-learner-developer`）
3. 在实际项目中使用 Skills，记录效果

### 深入（持续）

1. 阅读 [完整项目分析报告](PROJECT_ANALYSIS.md)
2. 研究千岛湖溯源 Demo 的代码实现
3. 贡献优质 Skills 到 [SkillsMP](https://skillsmp.com)

## 🛠️ 技术栈

- **开发工具**: Cursor IDE
- **AI 能力**: Cursor Skills + Claude/GPT
- **前端技术**: HTML/CSS/JavaScript（原生）
- **地图库**: Leaflet
- **版本控制**: Git

## 🤝 贡献指南

欢迎贡献新的 Skills、改进现有 Skills、或分享使用经验！

### 贡献方式

1. **提交 Issue**：报告问题或建议新 Skills
2. **提交 Pull Request**：改进文档或代码
3. **分享经验**：在 Issue 中分享使用心得

### 开发新 Skill

1. 参考 `.cursor/skills/` 下的现有 Skills
2. 按照 [原则沉淀指南](docs/PRINCIPLES_AND_ROLE_AGENTS_GUIDE.md) 开发
3. 在 Cursor 中触发 `skill-learner-developer` 获取帮助

## 📄 License

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🔗 相关资源

- [SkillsMP](https://skillsmp.com) - Skills 市场
- [Agent Skills Guide](https://www.agentskills.guide) - 精选 Skills
- [Anthropic/skills](https://github.com/anthropics/skills) - 官方示例
- [Cursor Directory](https://cursor.directory) - 官方社区
- [Awesome Cursor Rules](https://github.com/PatrickJS/awesome-cursorrules) - 规则集合

## 📧 联系方式

- **Issues**: [GitHub Issues](https://github.com/FeifanTech/newAINativeMethod/issues)
- **Discussions**: [GitHub Discussions](https://github.com/FeifanTech/newAINativeMethod/discussions)

---

**让 AI 成为每个角色的专业助手** 🚀
