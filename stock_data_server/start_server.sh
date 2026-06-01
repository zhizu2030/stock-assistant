#!/bin/bash
echo "========================================"
echo "  股票数据服务器启动脚本"
echo "========================================"
echo ""

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "[错误] 未找到Python，请先安装Python 3.8+"
        exit 1
    fi
    PYTHON_CMD=python
else
    PYTHON_CMD=python3
fi

echo "[1/4] 检查并安装依赖..."
$PYTHON_CMD -m pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
if [ $? -ne 0 ]; then
    echo "[警告] 部分依赖安装失败，但继续尝试启动"
fi

echo ""
echo "[2/4] 初始化数据..."
$PYTHON_CMD data_collector.py
if [ $? -ne 0 ]; then
    echo "[错误] 数据初始化失败"
    exit 1
fi

echo ""
echo "[3/4] 启动API服务器..."
echo ""
echo "========================================"
echo "  服务器启动成功！"
echo "  本地API地址: http://localhost:8000"
echo "  API文档: http://localhost:8000/docs"
echo ""
echo "  按 Ctrl+C 停止服务器"
echo "========================================"
echo ""

$PYTHON_CMD api_server.py
