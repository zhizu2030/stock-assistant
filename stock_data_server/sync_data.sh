#!/bin/bash
echo "========================================"
echo "  股票数据同步脚本"
echo "========================================"
echo ""
echo "开始同步最新数据..."
echo ""

if command -v python3 &> /dev/null; then
    python3 data_collector.py
else
    python data_collector.py
fi

echo ""
echo "========================================"
echo "  数据同步完成！"
echo "========================================"
echo ""
