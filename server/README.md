# 农业物流系统后端

这是智能农业物流管理系统的 Express 后端。它使用 Supabase 进行数据库存储。

## 设置说明

1. **安装依赖项**
   导航到此目录（`server`）并运行：
   ```bash
   npm install
   ```

2. **配置环境变量**
   将 `.env.example` 重命名为 `.env`，并填入您的 Supabase 项目 URL 和 anon API 密钥：
   ```env
   PORT=4000
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   ```

3. **设置 Supabase 数据库**
   转到您的 Supabase 项目的 SQL 编辑器，并运行位于此 `server` 目录中的 `database.sql` 文件里提供的 SQL 语句。这将会设置 `users` 和 `orders` 表以及一些模拟数据。

4. **启动服务器**
   ```bash
   npm run dev
   ```
   服务器将在 `http://localhost:4000` 上启动。

## API 端点

- **用户 (Users)**
  - `GET /api/users` - 获取所有用户
  - `POST /api/users` - 创建新用户
  - `PUT /api/users/:id` - 更新用户
  - `DELETE /api/users/:id` - 删除用户

- **订单 (Orders)**
  - `GET /api/orders` - 获取所有订单
  - `POST /api/orders` - 创建新订单
  - `PUT /api/orders/:id` - 更新订单
