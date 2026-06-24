# 佛山公交 PIDS 系统

公交电子站牌信息显示系统，基于 Vue 3 + Node.js + Express + SQLite 构建。

## 技术栈

### 前端
- **Vue 3** + **TypeScript** + **Vite**
- **Tailwind CSS** - 样式框架
- **Vue Router** - 路由管理
- **Lucide Vue Next** - 图标库

### 后端
- **Node.js** + **Express**
- **SQLite3** - 数据库
- **CORS** - 跨域支持

## 项目结构

```
Foshan Bus PIDS/
├── api/                    # 后端代码
│   ├── server.js          # Express 服务入口
│   ├── db.js              # 数据库配置
│   └── bus.db             # SQLite 数据库文件
├── src/                    # 前端源码
│   ├── components/        # 组件
│   ├── pages/             # 页面
│   ├── router/            # 路由
│   ├── composables/       # 组合式函数
│   └── main.ts            # 入口文件
├── public/                 # 静态资源
├── package.json           # 项目配置
├── vite.config.ts         # Vite 配置
├── tailwind.config.js     # Tailwind 配置
└── tsconfig.json          # TypeScript 配置
```

## 快速开始

### 环境要求

- Node.js >= 14.x
- npm >= 6.x

### 安装依赖

```bash
npm install
```

### 启动开发服务

#### 方式一：分别启动（推荐开发时使用）

**启动前端开发服务器：**

```bash
npm run dev
```

前端运行地址：`http://localhost:5173`

**启动后端 API 服务器：**

```bash
npm run server
```

后端运行地址：`http://localhost:3001`

> 注意：需要分别打开两个终端窗口执行以上命令。

#### 方式二：同时启动

如果需要同时启动前后端，可使用并发工具（需自行安装 `concurrently`）：

```bash
npx concurrently "npm run dev" "npm run server"
```

## 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动前端开发服务器（Vite） |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览构建产物 |
| `npm run server` | 启动后端 Express 服务器 |
| `npm run check` | TypeScript 类型检查 |
| `npm run lint` | 代码风格检查 |
| `npm run lint:fix` | 自动修复代码风格问题 |

## API 接口

后端服务默认端口：`3001`

### 认证

- `POST /api/login` - 管理员登录

### 线路管理

- `GET /api/routes` - 获取所有线路
- `GET /api/routes/:id` - 获取指定线路详情（含站点）
- `POST /api/routes` - 新增线路
- `PUT /api/routes/:id` - 更新线路
- `DELETE /api/routes/:id` - 删除线路

### 当前线路

- `GET /api/current-route` - 获取当前显示的线路信息

## 页面说明

- **首页** (`/`) - 公交电子站牌显示界面，展示线路信息和站点列表
- **管理页** (`/admin`) - 后台管理界面，用于管理线路和站点
