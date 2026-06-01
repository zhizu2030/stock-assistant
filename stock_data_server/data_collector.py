import akshare as ak
from sqlalchemy import create_engine, exists
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
import time
from models import Base, Stock, KLineData, FinancialData

DATABASE_URL = "sqlite:///./stock_data.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 拼音映射表
PINYIN_MAP = {
    '贵州茅台': 'gzmt', '五粮液': 'wly', '泸州老窖': 'lzl', '洋河股份': 'yhgf',
    '山西汾酒': 'sxf', '水井坊': 'sf', '双汇发展': 'shf', '伊利股份': 'ylgf',
    '恒顺醋业': 'hscc', '中国平安': 'zgpa', '平安银行': 'payh', '招商银行': 'zsyh',
    '兴业银行': 'xyyh', '交通银行': 'jtyh', '工商银行': 'gsh', '农业银行': 'nyh',
    '中国银行': 'zgth', '建设银行': 'jsyh', '民生银行': 'msyh', '比亚迪': 'byd',
    '宁德时代': 'ndsd', '长江电力': 'cjdl', '美的集团': 'mdjt', '格力电器': 'gldq',
    '隆基绿能': 'ljln', '阳光电源': 'ygdy', '中信证券': 'zxzq', '海通证券': 'htzq',
    '立讯精密': 'lxjm', '海康威视': 'hkws', '恒瑞医药': 'hryy', '长春高新': 'ccgx',
    '海螺水泥': 'hlsn', '紫金矿业': 'zjky', '云南铜业': 'ynty', '江西铜业': 'jxty',
    '天齐锂业': 'tqly', '盐湖股份': 'yhgf', '华友钴业': 'hygy', '国轩高科': 'gxgk',
    '当升科技': 'dsk', '卓胜微': 'zsw', '紫光国微': 'zggw', '中芯国际': 'zxgj',
    '长电科技': 'cdkj', '沃森生物': 'wsw', '复星医药': 'fxyy', '泰格医药': 'tgyy',
    '航发动力': 'hfd', '中航沈飞': 'zhsf', '航天电器': 'htdq', '振华科技': 'zhkj',
    '万科A': 'wka', '保利发展': 'blfz', '招商蛇口': 'zssk', '金地集团': 'jdjt',
    '光线传媒': 'gxcm', '万达电影': 'wddy', '芒果超媒': 'mgcm', '新希望': 'xxw',
    '牧原股份': 'mygf', '北大荒': 'bdh'
}

def get_pinyin(name):
    return PINYIN_MAP.get(name, '')

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def update_stock_list():
    """更新完整的A股股票列表"""
    print("正在获取股票列表...")
    try:
        stock_list = ak.stock_zh_a_spot_em()
        db = next(get_db())
        
        for index, row in stock_list.iterrows():
            code = str(row['代码'])
            # 格式化代码
            if len(code) == 6:
                if code.startswith('6'):
                    code = code
                else:
                    code = code
            
            stock = db.query(Stock).filter(Stock.code == code).first()
            if not stock:
                stock = Stock(code=code)
            
            stock.name = row['名称']
            stock.price = row['最新价'] if row['最新价'] else 0.0
            stock.change = row['涨跌额'] if row['涨跌额'] else 0.0
            stock.change_percent = row['涨跌幅'] if row['涨跌幅'] else 0.0
            stock.volume = int(row['成交量'] / 100) if row['成交量'] else 0
            stock.high = row['最高'] if row['最高'] else 0.0
            stock.low = row['最低'] if row['最低'] else 0.0
            stock.open = row['今开'] if row['今开'] else 0.0
            stock.pinyin = get_pinyin(row['名称'])
            stock.updated_at = datetime.utcnow()
            
            db.merge(stock)
            
            if index % 100 == 0:
                print(f"已处理 {index}/{len(stock_list)} 只股票")
                time.sleep(0.1)  # 避免请求过快
        
        db.commit()
        print(f"成功更新 {len(stock_list)} 只股票数据！")
    except Exception as e:
        print(f"更新股票列表失败: {e}")

def update_kline_data(code, days=365):
    """更新单只股票的K线数据"""
    print(f"正在获取 {code} 的K线数据...")
    try:
        end_date = datetime.now().strftime('%Y%m%d')
        start_date = (datetime.now() - timedelta(days=days)).strftime('%Y%m%d')
        
        kline_data = ak.stock_zh_a_hist(
            symbol=code,
            period="daily",
            start_date=start_date,
            end_date=end_date
        )
        
        db = next(get_db())
        
        for _, row in kline_data.iterrows():
            date_str = row['日期']
            date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
            
            kline = db.query(KLineData).filter(
                KLineData.code == code,
                KLineData.date == date_obj
            ).first()
            
            if not kline:
                kline = KLineData(code=code, date=date_obj)
            
            kline.open = row['开盘']
            kline.high = row['最高']
            kline.low = row['最低']
            kline.close = row['收盘']
            kline.volume = row['成交量'] if row['成交量'] else 0
            kline.amount = row['成交额'] if row['成交额'] else 0.0
            kline.change = row['涨跌额'] if row['涨跌额'] else 0.0
            kline.change_percent = row['涨跌幅'] if row['涨跌幅'] else 0.0
            
            db.merge(kline)
        
        db.commit()
        print(f"成功更新 {code} 的 {len(kline_data)} 条K线数据！")
    except Exception as e:
        print(f"更新 {code} K线数据失败: {e}")

def update_all_kline_data(days=365):
    """更新所有股票的K线数据（先更新热门股票）"""
    db = next(get_db())
    stocks = db.query(Stock).order_by(Stock.volume.desc()).limit(200).all()
    
    print(f"开始更新 {len(stocks)} 只股票的K线数据...")
    
    for stock in stocks:
        update_kline_data(stock.code, days)
        time.sleep(0.5)

def sync_all_data():
    """一键同步所有数据"""
    print("="*50)
    print("开始同步数据...")
    print("="*50)
    
    print("\n1. 初始化数据库...")
    init_db()
    
    print("\n2. 更新股票列表...")
    update_stock_list()
    
    print("\n3. 更新热门股票K线数据（最近一年）...")
    update_all_kline_data(365)
    
    print("\n" + "="*50)
    print("✅ 数据同步完成！")
    print("="*50)

if __name__ == "__main__":
    sync_all_data()
