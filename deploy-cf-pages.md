# Cloudflare Pages + Pages Functions + KV 完整部署教程

零基础傻瓜式步骤，全程可复制粘贴。预计耗时 10-15 分钟。

---

## 前提准备

1. 一个 [Cloudflare 账号](https://dash.cloudflare.com/sign-up)（免费）
2. 一个 [GitHub 账号](https://github.com/signup)（免费）
3. 本项目的完整文件夹 `pixel-confession-love`

---

## 第一步：将项目上传到 GitHub

### 1.1 在 GitHub 创建新仓库

1. 打开 https://github.com/new
2. Repository name 填写：`pixel-confession-love`
3. 选择 **Private** 或 Public（随你）
4. **不要**勾选 "Add a README file"
5. 点击 **Create repository**

### 1.2 上传代码

打开终端（或 Windows PowerShell），逐条执行以下命令：

```bash
# 进入项目目录
cd E:\pixel-confession-love

# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "feat: pixel confession love website"

# 关联远程仓库（把下面地址换成你自己的仓库地址）
git remote add origin https://github.com/你的用户名/pixel-confession-love.git

# 推送
git branch -M main
git push -u origin main
```

推送完成后，刷新 GitHub 页面，确认所有文件都已上传。

---

## 第二步：创建 KV 命名空间

1. 打开 Cloudflare Dashboard：https://dash.cloudflare.com
2. 左侧菜单点击 **Workers & Pages** → **KV**
3. 点击 **Create namespace**
4. Namespace name 填写：`MESSAGES`
5. 点击 **Add**

记下这个命名空间名称 `MESSAGES`，下一步要用。

---

## 第三步：部署到 Cloudflare Pages

### 3.1 连接 Git 仓库

1. 在 Cloudflare Dashboard 左侧点击 **Workers & Pages**
2. 点击顶部的 **Pages** 标签
3. 点击 **Connect to Git** 按钮
4. 选择 **GitHub**，授权 Cloudflare 访问你的仓库
5. 选择 `pixel-confession-love` 仓库
6. 点击 **Begin setup**

### 3.2 配置构建设置

在 "Set up builds and deployments" 页面：

| 配置项 | 填写内容 |
|-------|---------|
| **Production branch** | `main` |
| **Build command** | 留空（不需要构建） |
| **Build output directory** | 留空（不需要构建） |

### 3.3 绑定 KV

在同一页面的 **Functions** 部分：

1. 点击 **KV namespace bindings** 下的 **Add binding**
2. **Variable name** 填写：`MESSAGES`（必须和 `functions/api/messages.js` 中 `env.MESSAGES` 一致）
3. **KV namespace** 下拉选择：`MESSAGES`（第二步创建的）
4. 点击 **Save**

### 3.4 部署

1. 点击页面底部的 **Save and Deploy** 按钮
2. 等待部署完成（约 1-3 分钟）
3. 部署成功后，Cloudflare 会分配一个域名，格式为：`https://你的项目名.pages.dev`

---

## 第四步：修改前端接口地址

部署成功后，你需要把 Cloudflare 分配的域名填写到前端代码中。

### 方法一：直接在 GitHub 修改（推荐）

1. 打开你 GitHub 上的 `pixel-confession-love` 仓库
2. 打开 `message.html` 文件
3. 点击右上角的 ✏️ 编辑按钮
4. 找到约第 220 行：
   ```javascript
   var API_BASE_URL = "";
   ```
5. 改为你的 Pages 域名：
   ```javascript
   var API_BASE_URL = "https://你的项目名.pages.dev";
   ```
6. 点击 **Commit changes** 提交
7. Cloudflare Pages 会自动检测到变更并重新部署（约 1 分钟）

### 方法二：本地修改后重新推送

```bash
# 编辑 E:\pixel-confession-love\message.html
# 修改 API_BASE_URL 为你的 Pages 域名

cd E:\pixel-confession-love
git add message.html
git commit -m "chore: update API base URL"
git push
```

---

## 第五步：验证部署

1. 在浏览器打开你的 Pages 域名：`https://你的项目名.pages.dev`
2. 你会看到加载页 → 点击后进入告白页 → 点击 continue 进入留言页
3. 在留言页输入一条测试留言，点击发送
4. 如果发送成功并显示在留言墙上，说明部署完全成功。

---

## 常见问题

### Q: 发送留言时报错 "接口地址未配置"

**A:** 你没有修改 `message.html` 中的 `API_BASE_URL` 变量。请按照第四步操作。

### Q: 发送留言时报错 "网络错误"

**A:** 检查以下几点：
1. `API_BASE_URL` 的域名是否正确（不要有多余的 `/`）
2. KV 绑定是否正确（变量名必须是 `MESSAGES`）
3. 部署是否已完成（不是 Building 状态）

### Q: 页面打开后没有声音

**A:** 现代浏览器要求用户先与页面交互（点击/触摸）后才能播放音频。点击页面任意位置即可激活音效和背景音乐。

### Q: 如何查看 API 日志

**A:** 在 Cloudflare Dashboard → Workers & Pages → 你的项目 → 顶部的 **Functions** 标签 → 选择 `api/messages` → 查看 **Logs** 标签。

### Q: 想用自己的域名

**A:** 在 Cloudflare Pages 项目设置 → **Custom domains** → 添加你的域名，按提示配置 DNS 即可。

---

## 成本说明

Cloudflare Pages Functions 和 KV 都有慷慨的免费额度：

- **Pages Functions**：每天 10 万次请求（免费）
- **KV**：每天 10 万次读取、1000 次写入（免费）

个人告白网站完全够用，无需付费。
