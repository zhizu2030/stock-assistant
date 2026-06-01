@echo off
echo ========================================
echo   股票数据服务器启动脚本
echo ========================================
echo.

REM 检查Python是否安装
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未找到Python，请先安装Python 3.8+
    pause
    exit /b 1
)

echo [1/4] 检查并安装依赖...
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
if %errorlevel% neq 0 (
    echo [警告] 部分依赖安装失败，但继续尝试启动
)

echo.
echo [2/4] 初始化数据...
python data_collector.py
if %errorlevel% neq 0 (
    echo [错误] 数据初始化失败
    pause
    exit /b 1
)

echo.
echo [3/4] 启动API服务器...
echo.
echo ========================================
echo   服务器启动成功！
echo   本地API地址: http://localhost:8000
echo   API文档: http://localhost:8000/docs
echo.
echo   按 Ctrl+C 停止服务器
echo ========================================
echo.

python api_server.py
pause
