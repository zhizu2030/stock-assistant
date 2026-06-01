# 股票数据本地服务器 📊

完全免费的本地股票数据解决方案，支持实时行情、历史K线、财务数据！

## 功能特点 ✨

- ✅ **完全免费** - 使用开源 AKShare 库
- ✅ **完整数据** - 5000+ 只A股股票
- ✅ **本地存储** - SQLite 数据库，无需云服务
- ✅ **一键同步** - 每天点一下即可更新数据
- ✅ **API 服务** - FastAPI 为您的应用提供接口

## 快速开始 🚀

### 1. 环境准备

确保您的电脑已安装 **Python 3.8+**

- Windows: 从 https://python.org 下载
- Mac/Linux: 通常系统自带，或用 brew/apt 安装

### 2. 启动服务器

#### Windows 用户：

1. 双击运行 **start_server.bat**
2. 等待依赖安装和数据初始化（首次约 5-10 分钟）
3. 看到 "服务器启动成功" 就完成了！

#### Mac/Linux 用户：

```bash
cd stock_data_server
chmod +x start_server.sh
./start_server.sh
```

### 3. 日常使用

- **更新数据**：双击运行 `sync_data.bat` (Windows) 或 `./sync_data.sh` (Mac/Linux)
- **启动服务**：用 `start_server` 脚本启动API
- **停止服务**：在命令行按 `Ctrl+C`

## API 接口说明 📖

启动后可以访问：
- **API 文档**: http://localhost:8000/docs
- **健康检查**: http://localhost:8000/api/health

### 可用接口

```javascript
// 获取股票列表
GET /api/stocks

// 获取单只股票详情
GET /api/stocks/{code}

// 获取K线数据
GET /api/stocks/{code}/kline?days=60

// 搜索股票（支持代码/名称/拼音首字母）
GET /api/search?query=茅台
```

## 与您的 Vercel 应用集成 🔗

在您的 Vercel 部署的应用中，可以配置：

1. **本地模式**（电脑在家时）：使用 `http://localhost:8000` 本地API
2. **远程模式**（出门时）：使用原来的腾讯财经API

## 目录结构 📁

```
stock_data_server/
├── requirements.txt          # Python 依赖
├── models.py                 # 数据库模型
├── data_collector.py         # 数据采集脚本
├── api_server.py             # FastAPI 服务器
├── start_server.bat/.sh     # 一键启动脚本
├── sync_data.bat/.sh       # 一键同步脚本
└── stock_data.db            # 本地数据库（自动生成）
```

## 常见问题 ❓

**Q: 首次同步数据很慢？**
A: 首次会下载完整股票列表，约 5-10 分钟，后续更新很快。

**Q: 数据来源是哪里？**
A: 使用 AKShare 开源库，从东方财富、新浪财经等公开数据源获取。

**Q: 可以在手机上用吗？**
A: 需要在同一 WiFi 下，用您电脑的局域网 IP 访问。

## 技术栈 🛠️

- **数据采集**: AKShare (Python)
- **数据库**: SQLite
- **API 服务**: FastAPI
- **数据类型**: 实时行情、历史K线、财务数据
