# SPEED - 软件实践经验证据数据库

SPEED (Software Practice Empirical Evidence Database) 是一个用于存储和检索软件工程实践相关证据的平台。该系统允许用户提交、评审、分析和搜索有关软件工程实践有效性的研究证据。

## 项目结构

项目由两部分组成：

- **前端**: 使用Next.js构建的Web应用
- **后端**: 使用Nest.js和MongoDB构建的API服务

### 前端结构

```
frontend/
  ├── src/
  │   ├── app/            # App Router页面
  │   │   ├── dashboard/  # 仪表板和相关页面
  │   │   ├── layout.tsx  # 主布局
  │   │   └── page.tsx    # 首页/登录页
  │   └── components/     # 可复用组件
  ├── public/             # 静态资源
  └── package.json        # 依赖配置
```

### 后端结构

```
backend/
  ├── src/
  │   ├── models/         # MongoDB数据模型
  │   ├── modules/        # 功能模块
  │   │   ├── articles/   # 文章模块
  │   │   ├── practices/  # 实践模块
  │   │   ├── claims/     # 声明模块
  │   │   └── evidence/   # 证据模块
  │   ├── app.module.ts   # 应用主模块
  │   └── main.ts         # 应用入口
  ├── test/               # 测试文件
  └── package.json        # 依赖配置
```

## 数据模型

系统包含以下主要数据模型：

1. **Article**: 表示已发布的研究文章
2. **Practice**: 软件工程实践（如TDD、Pair Programming等）
3. **Claim**: 关于软件工程实践的声明（如"提高代码质量"）
4. **Evidence**: 连接文章和声明的证据，包含结果（同意、不同意、中立）
5. **User**: 系统用户信息和角色
6. **Rating**: 用户对文章的评分
7. **SavedQuery**: 用户保存的搜索查询

## 功能特性

- 用户注册和身份验证
- 提交文献参考
- 审核提交的文献
- 分析文献并提取证据
- 按实践、声明和年份搜索证据
- 保存常用查询
- 对文章进行评分
- 可视化搜索结果

## 开发环境设置

### 前提条件

- Node.js (v16+)
- MongoDB (v4+)

### 后端设置

```bash
cd backend
npm install
npm run start:dev
```

服务将在 http://localhost:3000 上运行。

### 前端设置

```bash
cd frontend
npm install
npm run dev
```

前端应用将在 http://localhost:3001 上运行。

## API接口

详细的API文档可访问运行中的后端服务的 /api 路径。

## 贡献

欢迎提交问题和合并请求！

## 许可证

[MIT](LICENSE)