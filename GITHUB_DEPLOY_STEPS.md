# 🔐 GitHub 部署步骤

## 方法一：使用 Personal Access Token（推荐）

### 第一步：创建 GitHub Personal Access Token
1. 登录 GitHub：https://github.com
2. 点击右上角头像 → Settings
3. 左侧菜单滚动到底部，点击 "Developer settings"
4. 点击 "Personal access tokens" → "Tokens (classic)"
5. 点击 "Generate new token (classic)"
6. 设置：
   - Note: `stock-assistant-deploy`
   - Expiration: 选择 `30 days` 或更长
   - Select scopes: ✅ `repo` (完整仓库访问)
7. 点击 "Generate token"
8. **⚠️ 重要：立即复制并保存这个token！**（只显示一次）

### 第二步：运行部署命令
创建token后，把以下命令中的 `YOUR_TOKEN` 替换成您的token：

```bash
cd /workspace

# 添加远程仓库
git remote add origin https://github.com/USER_TOKEN@github.com/zhizu2030/stock-assistant.git

# 推送代码
git push -u origin master
```

提示：运行时会要求输入用户名，输入 `zhizu2030`，密码输入刚才创建的 Personal Access Token。

---

## 方法二：在 GitHub 网页上操作

### 如果您更喜欢网页操作：

1. **手动下载代码**
   - 告诉我，我可以为您打包项目代码

2. **在 GitHub 网页上创建仓库**
   - 访问 https://github.com/new
   - Repository name: `stock-assistant`
   - 选择 Public
   - 点击 "Create repository"

3. **上传代码**
   - 在新仓库页面，点击 "uploading an existing file"
   - 把代码文件拖拽上传
   - 点击 "Commit changes"

4. **然后在 Vercel 导入**
   - 访问 https://vercel.com
   - 点击 "New Project"
   - 选择刚才创建的 GitHub 仓库
   - 点击 "Deploy"

---

## 🚀 Vercel 部署步骤

无论用哪种方法创建 GitHub 仓库，Vercel 部署都很快：

1. **登录 Vercel**
   - https://vercel.com
   - 用 GitHub 账号登录

2. **创建新项目**
   - 点击 "New Project"
   - 在 "Import Git Repository" 中找到 `zhizu2030/stock-assistant`
   - 点击 "Import"

3. **配置并部署**
   - Framework Preset: `Vite` (通常会自动检测)
   - 点击 "Deploy"

4. **等待部署完成** ⏱️ (约1-2分钟)

5. **获取访问链接** 🎉
   - 部署成功后，您会看到类似：`stock-assistant.vercel.app`
   - 点击链接即可在手机浏览器中使用！

---

## 📱 优化使用体验

部署成功后：

1. **打开应用**：用手机浏览器打开 Vercel 给您的链接
2. **添加到主屏幕**：
   - iPhone：Safari浏览器 → 分享按钮 → "添加到主屏幕"
   - Android：Chrome浏览器 → 菜单(三个点) → "添加至主屏幕"

这样应用就会像原生APP一样出现在您的手机桌面上！

---

## ❓ 遇到问题？

如果遇到问题，请告诉我：
1. 您选择用哪种方式创建 GitHub 仓库？
2. 具体在哪个步骤遇到困难了？
3. 有什么错误提示吗？

我会一步步帮您解决！ 💪
