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

## 功能说明

### 首页（电子站牌显示）
- 顶部信息栏显示当前线路名称、起止站点和系统时间
- 主体区域以醒目方式展示线路名称和站点信息
- 响应式布局适配不同尺寸的显示设备
- 实时时间显示，自动更新

### 管理后台
- 线路管理：增删改查公交线路
- 站点管理：为每条线路添加、编辑、删除站点
- 当前线路设置：选择当前电子站牌显示的线路
- 管理员登录验证

### 主题功能
- 支持浅色/深色主题切换
- 自动记忆用户主题偏好

## 数据库结构

系统使用 SQLite 数据库，包含以下数据表：

### routes（线路表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| name | TEXT | 线路名称（如 B25） |
| from_station | TEXT | 起点站 |
| to_station | TEXT | 终点站 |
| created_at | TIMESTAMP | 创建时间 |

### stations（站点表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| route_id | INTEGER | 关联线路 ID |
| name | TEXT | 站点名称 |
| order_num | INTEGER | 站点顺序 |

### admins（管理员表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| username | TEXT | 用户名（唯一） |
| password | TEXT | 密码 |
| created_at | TIMESTAMP | 创建时间 |

### settings（设置表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| key | TEXT | 设置键（唯一） |
| value | TEXT | 设置值 |

> 默认管理员账号：`admin` / `123456`

## 部署指南

### 开发环境部署

1. 克隆项目后安装依赖：
```bash
npm install
```

2. 启动后端服务：
```bash
npm run server
```

3. 启动前端开发服务器：
```bash
npm run dev
```

### 生产环境部署

#### 前端部署

1. 构建生产版本：
```bash
npm run build
```

2. 将 `dist` 目录下的文件部署到 Web 服务器（如 Nginx、Apache）

3. 配置 Nginx 示例：
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 后端部署

1. 使用 PM2 进程管理器：
```bash
npm install -g pm2
pm2 start api/server.js --name bus-pids-api
```

2. 设置开机自启：
```bash
pm2 save
pm2 startup
```

### 环境变量

如需修改默认配置，可编辑以下文件：
- `api/server.js` - 修改端口号
- `api/db.js` - 数据库配置

## 截图演示
<img width="1366" height="728" alt="演示" src="https://github.com/user-attachments/assets/06e60baf-9590-4be7-9108-f84b3cbc76b7" />

### 首页（电子站牌显示界面）
展示公交线路信息和站点列表，采用大字号、高对比度设计，适合户外电子站牌查看。

### 管理后台
- 线路列表管理
- 站点编辑功能
- 当前线路切换

---

**佛山公交 PIDS 系统** - 为市民提供清晰的公交线路信息服务
