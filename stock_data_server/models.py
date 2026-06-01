from sqlalchemy import Column, String, Float, Integer, Date, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Stock(Base):
    __tablename__ = "stocks"
    
    code = Column(String, primary_key=True, index=True)  # 股票代码
    name = Column(String, index=True)                      # 股票名称
    pinyin = Column(String, default="")                    # 拼音首字母
    price = Column(Float, default=0.0)                     # 当前价格
    change = Column(Float, default=0.0)                    # 涨跌额
    change_percent = Column(Float, default=0.0)            # 涨跌幅
    volume = Column(Integer, default=0)                    # 成交量
    high = Column(Float, default=0.0)                      # 最高
    low = Column(Float, default=0.0)                       # 最低
    open = Column(Float, default=0.0)                      # 今开
    market_cap = Column(Float, default=0.0)                # 市值
    pe = Column(Float, default=0.0)                        # 市盈率
    pb = Column(Float, default=0.0)                        # 市净率
    updated_at = Column(DateTime, default=datetime.utcnow) # 更新时间
    industry = Column(String, default="")                  # 行业分类

class KLineData(Base):
    __tablename__ = "kline_data"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String, index=True)
    date = Column(Date, index=True)
    open = Column(Float)
    high = Column(Float)
    low = Column(Float)
    close = Column(Float)
    volume = Column(Integer)
    amount = Column(Float, default=0.0)                    # 成交额
    change = Column(Float, default=0.0)
    change_percent = Column(Float, default=0.0)

class FinancialData(Base):
    __tablename__ = "financial_data"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String, index=True)
    date = Column(Date, index=True)  # 报告期
    report_type = Column(String)      # 报告类型：年报/半年报/季报
    revenue = Column(Float, default=0.0)          # 营收
    net_profit = Column(Float, default=0.0)       # 净利润
    eps = Column(Float, default=0.0)              # 每股收益
    roe = Column(Float, default=0.0)              # ROE
    debt_ratio = Column(Float, default=0.0)       # 资产负债率
