# 🚀 手机端部署指南 - 智能炒股助手

## 方案一：使用 Vercel 部署（推荐）

### 第一步：准备 GitHub 仓库
由于您在手机上操作，需要：

1. **创建 GitHub 账号**（如果还没有）
   - 访问 github.com
   - 用手机浏览器完成注册

2. **创建新仓库**
   - 登录 GitHub 后，点击右上角 "+" → "New repository"
   - 仓库名称：`stock-assistant`
   - 选择 "Public"（公开）
   - 点击 "Create repository"

3. **推送代码到 GitHub**
   在电脑上运行以下命令（需要先安装 GitHub CLI）：
   ```bash
   # 安装 GitHub CLI（可选）
   brew install gh  # macOS
   # 或访问 https://cli.github.com 安装

   # 登录 GitHub
   gh auth login

   # 推送代码
   cd /workspace
   gh repo create stock-assistant --public --push --source=.
   ```

### 第二步：连接 Vercel 部署

1. **创建 Vercel 账号**
   - 手机浏览器访问 https://vercel.com
   - 使用 GitHub 账号登录（推荐）

2. **导入项目**
   - 点击 "New Project"
   - 选择 "Import Git Repository"
   - 找到您的 `stock-assistant` 仓库
   - 点击 "Import"

3. **配置项目**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - 点击 "Deploy"

4. **完成！**
   - 等待 1-2 分钟部署完成
   - Vercel 会提供一个免费域名（如：`stock-assistant.vercel.app`）
   - 用手机浏览器打开这个链接即可使用！

---

## 方案二：使用 Netlify 部署

1. 访问 https://app.netlify.com
2. 用 GitHub 账号登录
3. 点击 "Add new site" → "Import an existing project"
4. 连接 GitHub 仓库
5. 部署配置：
   - Build command: `npm run build`
   - Publish directory: `dist`
6. 点击 "Deploy site"

---

## 方案三：下载后在本地运行（需要电脑）

如果您临时可以使用电脑：

1. 下载项目代码（我可以通过文件传输给您）
2. 在电脑上运行：
   ```bash
   npm install
   npm run build
   npm run preview
   ```
3. 获取电脑 IP 地址
4. 手机访问 `http://[电脑IP]:4173`

---

## 🎉 部署成功后的使用

部署完成后，您会获得一个类似这样的链接：
- `https://stock-assistant.vercel.app`

在手机上打开这个链接即可使用！

### 功能说明
- **首页**：热门股票、AI智能对话
- **行情**：搜索和浏览所有股票
- **自选**：管理您关注的股票
- **我的**：个人设置

---

## 📱 添加到手机主屏幕

部署成功后，您可以：
1. 用手机浏览器打开应用链接
2. 点击浏览器菜单（三个点）
3. 选择"添加到主屏幕"或"安装应用"
4. 应用会像原生APP一样出现在手机桌面上！

---

## ❓ 遇到问题？

如果部署过程中遇到问题，请告诉我：
- 您是否有 GitHub 账号？
- 您是否可以使用电脑进行任何操作？
- 遇到的具体错误信息是什么？

我会帮您一步步解决！
