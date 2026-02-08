# 农田作物种植数据管理系统

## How to Run

### 方式一：Docker 运行（推荐）

```bash
# 使用 docker-compose 构建并启动
docker-compose up --build -d

# 查看运行状态
docker-compose ps

# 查看日志
docker-compose logs -f frontend-admin

# 停止服务
docker-compose down
```

启动成功后访问：http://localhost:8081

### 方式二：本地开发运行

```bash
# 进入前端项目目录
cd frontend-admin

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## Services

| 服务名称 | 端口 | 描述 |
|---------|------|------|
| frontend-admin | 8081 | 农田作物管理系统前端服务 |

## 测试账号

本系统为纯前端应用，无需登录账号。

## 题目内容

### 作业需求

设计一个「农田作物种植数据管理系统」，包含3个核心组件，实现以下功能：

#### 一、父组件（FarmManagement.vue）
1. 存储农田作物核心数据（包含作物名称、种植面积、产量、种植日期）
2. 通过 onMounted 初始化模拟农业数据
3. 接收子组件传递的新增作物数据并更新
4. 展示所有作物数据及统计信息（总种植面积、平均产量）

#### 二、子组件1（CropList.vue）
1. 通过 Props 接收父组件的作物列表数据
2. 格式化展示作物信息（种植日期格式化、产量单位显示）

#### 三、子组件2（CropForm.vue）
1. 提供表单用于新增作物数据（包含作物名称、种植面积、产量、种植日期输入项）
2. 表单验证（必填项、数值为正数）
3. 通过 Emits 向父组件传递新增的作物数据

### 项目要求
1. 必须提供 README.md
2. 编写 Dockerfile（跨平台支持 ARM 和 X86）
3. 前端项目对外映射端口为 8081
4. 根目录增加 docker-compose.yml 和 .gitignore
5. 项目目录清晰，禁止所有逻辑堆在单一文件中
6. 视觉分层、布局对齐、交互反馈、风格统一

---

## 项目介绍

本项目是一个基于 Vue 3 + TypeScript + Vite 构建的农田作物种植数据管理系统，采用 Composition API 开发，实现了作物数据的增删查改和统计功能。

### 技术栈

- **框架**: Vue 3.4+ (Composition API)
- **语言**: TypeScript
- **构建工具**: Vite 5
- **UI 组件库**: Element Plus
- **容器化**: Docker + Nginx

### 项目结构

```
.
├── README.md                        # 项目文档
├── .gitignore                       # Git 忽略配置
├── docker-compose.yml               # Docker Compose 配置
└── frontend-admin/                  # 前端管理后台
    ├── Dockerfile                   # Docker 构建文件（支持 ARM/X86）
    ├── nginx.conf                   # Nginx 配置
    ├── index.html                   # HTML 入口
    ├── package.json                 # 项目依赖
    ├── tsconfig.json                # TypeScript 配置
    ├── tsconfig.node.json           # Node TypeScript 配置
    ├── vite.config.ts               # Vite 配置
    ├── public/                      # 静态资源
    │   └── favicon.svg
    └── src/                         # 源代码
        ├── main.ts                  # 应用入口
        ├── App.vue                  # 根组件
        ├── vite-env.d.ts            # Vite 类型声明
        ├── components/              # 组件目录
        │   ├── FarmManagement.vue   # 父组件 - 主管理页面
        │   ├── CropList.vue         # 子组件1 - 作物列表展示
        │   └── CropForm.vue         # 子组件2 - 新增作物表单
        ├── types/                   # TypeScript 类型定义
        │   └── crop.ts              # 作物相关类型
        ├── utils/                   # 工具函数
        │   └── format.ts            # 格式化工具
        └── styles/                  # 全局样式
            └── variables.css        # CSS 变量
```

### 功能特性

- ✅ 作物数据的新增和删除
- ✅ 实时统计总种植面积和平均亩产量（计算属性）
- ✅ 表单验证（必填项、正数校验）
- ✅ 日期格式化显示（Element Plus DatePicker）
- ✅ 响应式布局
- ✅ 交互反馈（Toast 提示、按钮 Hover/Loading 状态）
- ✅ 视觉分层设计（卡片阴影、背景色区分）
- ✅ Docker 跨平台支持（ARM64 / AMD64）
