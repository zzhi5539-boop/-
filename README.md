# 🌾 智能农业物流管理系统

一个全栈的农业冷链物流管理平台，涵盖订单管理、路径优化、财务报表和系统设置等核心功能。

## ✨ 功能特性

| 模块 | 说明 |
|------|-----|
| 📊 **仪表盘** | 订单统计、实时地图概览、完成率趋势 |
| 📦 **订单管理** | 订单 CRUD、状态流转、冷链标识 |
| 🗺️ **路径规划** | 贪心最近邻 + **2-opt 局部优化算法**，Leaflet 地图可视化 |
| 💰 **财务报表** | 基于订单的收入/成本/利润自动派生 |
| ⚙️ **系统设置** | 温度阈值、自动派单、通知邮箱等参数配置 |
| 👥 **用户管理** | 管理员/调度员/司机角色体系 |

## 🛠️ 技术栈

**前端：** React 19 + TypeScript + Vite + Tailwind CSS 4 + React-Leaflet

**后端：** Node.js + Express + Supabase (PostgreSQL)

## 🚀 快速启动

### 前置条件

- [Node.js](https://nodejs.org/) v18+
- 一个 [Supabase](https://supabase.com/) 项目（免费注册即可）

### 1. 克隆项目

```bash
git clone https://github.com/zzhi5539-boop/-.git
cd -
```

### 2. 配置 Supabase 数据库

1. 登录 [Supabase 控制台](https://app.supabase.com/)
2. 打开你的项目 → **SQL Editor**
3. 将 `server/database.sql` 的内容粘贴并执行
4. 这会创建 `users`、`orders`、`system_settings` 三张表并插入初始数据

### 3. 配置后端环境变量

```bash
cd server
cp .env.example .env
```

编辑 `server/.env`，填入你的 Supabase 项目信息：

```env
PORT=4000
SUPABASE_URL=https://你的项目ID.supabase.co
SUPABASE_KEY=你的anon公钥
```

> 💡 在 Supabase 控制台的 **Settings → API** 中可以找到这两个值。

### 4. 安装依赖并启动

```bash
# 安装后端依赖 (在 server/ 目录下)
npm install

# 启动后端 (在 server/ 目录下)
npm run dev
```

新开一个终端窗口：

```bash
# 回到项目根目录，安装前端依赖
npm install

# 启动前端开发服务器
npm run dev
```

### 5. 访问系统

- **前端：** http://localhost:3000
- **后端 API：** http://localhost:4000/api

默认登录账号：
| 邮箱 | 密码 | 角色 |
|------|------|------|
| sarah.j@agrilogistics.com | 123 | 管理员 |

## 📁 项目结构

```
├── src/                    # 前端源码
│   ├── pages/              # 页面组件
│   │   ├── Dashboard.tsx   # 仪表盘
│   │   ├── Orders.tsx      # 订单管理
│   │   ├── RoutePlanning.tsx  # 路径规划
│   │   ├── Finance.tsx     # 财务报表
│   │   ├── Settings.tsx    # 系统设置
│   │   ├── Users.tsx       # 用户管理
│   │   └── Login.tsx       # 登录页
│   ├── App.tsx             # 路由配置
│   └── main.tsx            # 入口文件
├── server/                 # 后端源码
│   ├── src/
│   │   ├── config/         # Supabase 客户端
│   │   ├── routes/         # API 路由
│   │   │   ├── auth.js     # 认证
│   │   │   ├── orders.js   # 订单 CRUD
│   │   │   ├── users.js    # 用户 CRUD
│   │   │   ├── routes.js   # 路径优化 (2-opt)
│   │   │   ├── finance.js  # 财务统计
│   │   │   └── settings.js # 系统设置
│   │   └── index.js        # Express 入口
│   ├── database.sql        # 数据库建表脚本
│   └── .env.example        # 环境变量模板
└── package.json
```

## 📡 API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/login` | 用户登录 |
| GET | `/api/users` | 获取所有用户 |
| POST | `/api/users` | 创建用户 |
| PUT | `/api/users/:id` | 更新用户 |
| DELETE | `/api/users/:id` | 删除用户 |
| GET | `/api/orders` | 获取所有订单 |
| POST | `/api/orders` | 创建订单 |
| PUT | `/api/orders/:id` | 更新订单 |
| POST | `/api/routes/optimize` | 路径优化（Greedy + 2-opt） |
| GET | `/api/finance/summary` | 财务摘要 |
| GET | `/api/settings` | 获取系统设置 |
| PUT | `/api/settings` | 更新系统设置 |

## 📄 License

MIT
