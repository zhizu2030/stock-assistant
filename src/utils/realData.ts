import { Stock, KLineData } from '../types';

// API 配置
const API_CONFIG = {
  // 本地模式：从您的电脑服务器获取数据
  local: {
    baseUrl: 'http://localhost:8000',
    enabled: true, // 设置为 true 启用本地模式
  },
  // 远程模式：使用腾讯财经API (Vercel部署时用)
  remote: {
    enabled: true,
  }
};

// 检查本地服务是否可用
async function checkLocalServer(): Promise<boolean> {
  if (!API_CONFIG.local.enabled) return false;
  try {
    const response = await fetch(`${API_CONFIG.local.baseUrl}/api/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(1000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

// 股票数据（包含拼音首字母用于搜索）
interface StockWithPinyin extends Stock {
  pinyin: string;
}

// 股票基础数据（用于显示和备用）
const referenceData: Record<string, StockWithPinyin> = {
  // 消费板块
  '600519': { code: '600519', name: '贵州茅台', pinyin: 'gzmt', price: 1326.00, change: 8.50, changePercent: 0.65, volume: 2340000, high: 1335.00, low: 1318.00, open: 1320.00 },
  '000858': { code: '000858', name: '五粮液', pinyin: 'wly', price: 118.50, change: -2.30, changePercent: -1.91, volume: 5678000, high: 121.50, low: 117.80, open: 120.00 },
  '000568': { code: '000568', name: '泸州老窖', pinyin: 'lzl', price: 189.80, change: 3.20, changePercent: 1.72, volume: 3456000, high: 192.00, low: 186.50, open: 188.00 },
  '002304': { code: '002304', name: '洋河股份', pinyin: 'yhgf', price: 112.60, change: -1.80, changePercent: -1.57, volume: 2890000, high: 115.00, low: 111.00, open: 114.00 },
  '600809': { code: '600809', name: '山西汾酒', pinyin: 'sxf', price: 198.50, change: 4.20, changePercent: 2.16, volume: 3120000, high: 200.00, low: 194.00, open: 196.00 },
  '600779': { code: '600779', name: '水井坊', pinyin: 'sf', price: 68.90, change: -0.80, changePercent: -1.15, volume: 1560000, high: 70.00, low: 68.00, open: 69.50 },
  '000895': { code: '000895', name: '双汇发展', pinyin: 'shf', price: 24.50, change: 0.30, changePercent: 1.24, volume: 4560000, high: 24.80, low: 24.10, open: 24.30 },
  '600887': { code: '600887', name: '伊利股份', pinyin: 'ylgf', price: 38.60, change: 0.50, changePercent: 1.31, volume: 5670000, high: 39.00, low: 38.00, open: 38.50 },
  '600305': { code: '600305', name: '恒顺醋业', pinyin: 'hscc', price: 9.80, change: 0.10, changePercent: 1.03, volume: 2340000, high: 9.90, low: 9.60, open: 9.75 },
  
  // 金融板块
  '601318': { code: '601318', name: '中国平安', pinyin: 'zgpa', price: 42.80, change: 0.35, changePercent: 0.82, volume: 12340000, high: 43.20, low: 42.40, open: 42.50 },
  '000001': { code: '000001', name: '平安银行', pinyin: 'payh', price: 10.85, change: 0.12, changePercent: 1.12, volume: 8900000, high: 11.00, low: 10.70, open: 10.75 },
  '600036': { code: '600036', name: '招商银行', pinyin: 'zsyh', price: 31.60, change: -0.30, changePercent: -0.94, volume: 4560000, high: 32.00, low: 31.30, open: 31.80 },
  '601166': { code: '601166', name: '兴业银行', pinyin: 'xyyh', price: 16.80, change: 0.15, changePercent: 0.90, volume: 6780000, high: 17.00, low: 16.60, open: 16.70 },
  '601328': { code: '601328', name: '交通银行', pinyin: 'jtyh', price: 5.80, change: 0.05, changePercent: 0.87, volume: 7890000, high: 5.85, low: 5.75, open: 5.78 },
  '601398': { code: '601398', name: '工商银行', pinyin: 'gsh', price: 5.10, change: 0.02, changePercent: 0.39, volume: 15600000, high: 5.12, low: 5.08, open: 5.10 },
  '601288': { code: '601288', name: '农业银行', pinyin: 'nyh', price: 3.50, change: 0.01, changePercent: 0.29, volume: 18900000, high: 3.52, low: 3.48, open: 3.50 },
  '601988': { code: '601988', name: '中国银行', pinyin: 'zgth', price: 3.80, change: 0.02, changePercent: 0.53, volume: 16700000, high: 3.82, low: 3.78, open: 3.80 },
  '601939': { code: '601939', name: '建设银行', pinyin: 'jsyh', price: 6.20, change: 0.03, changePercent: 0.49, volume: 12300000, high: 6.22, low: 6.18, open: 6.20 },
  '600016': { code: '600016', name: '民生银行', pinyin: 'msyh', price: 3.90, change: -0.02, changePercent: -0.51, volume: 8900000, high: 3.92, low: 3.88, open: 3.92 },
  
  // 科技板块
  '002594': { code: '002594', name: '比亚迪', pinyin: 'byd', price: 218.50, change: 3.80, changePercent: 1.77, volume: 3450000, high: 220.00, low: 215.00, open: 216.00 },
  '300750': { code: '300750', name: '宁德时代', pinyin: 'ndsd', price: 156.80, change: -2.20, changePercent: -1.38, volume: 2890000, high: 159.50, low: 155.00, open: 158.50 },
  '600900': { code: '600900', name: '长江电力', pinyin: 'cjdl', price: 25.60, change: 0.25, changePercent: 0.99, volume: 6780000, high: 25.90, low: 25.30, open: 25.45 },
  '000333': { code: '000333', name: '美的集团', pinyin: 'mdjt', price: 52.30, change: 1.50, changePercent: 2.95, volume: 3240000, high: 53.00, low: 50.80, open: 51.00 },
  '000651': { code: '000651', name: '格力电器', pinyin: 'gldq', price: 38.90, change: -0.50, changePercent: -1.27, volume: 4560000, high: 39.50, low: 38.50, open: 39.30 },
  '601012': { code: '601012', name: '隆基绿能', pinyin: 'ljln', price: 24.50, change: 0.80, changePercent: 3.38, volume: 7890000, high: 25.00, low: 23.80, open: 24.00 },
  '300274': { code: '300274', name: '阳光电源', pinyin: 'ygdy', price: 78.60, change: 2.50, changePercent: 3.29, volume: 5670000, high: 80.00, low: 76.00, open: 77.00 },
  '600030': { code: '600030', name: '中信证券', pinyin: 'zxzq', price: 21.80, change: 0.30, changePercent: 1.39, volume: 8900000, high: 22.00, low: 21.50, open: 21.60 },
  '600837': { code: '600837', name: '海通证券', pinyin: 'htzq', price: 11.20, change: 0.10, changePercent: 0.90, volume: 6780000, high: 11.30, low: 11.10, open: 11.15 },
  '002475': { code: '002475', name: '立讯精密', pinyin: 'lxjm', price: 32.50, change: 0.80, changePercent: 2.52, volume: 4560000, high: 33.00, low: 31.80, open: 32.00 },
  '002415': { code: '002415', name: '海康威视', pinyin: 'hkws', price: 38.90, change: 1.20, changePercent: 3.19, volume: 3450000, high: 39.50, low: 37.80, open: 38.00 },
  '600276': { code: '600276', name: '恒瑞医药', pinyin: 'hryy', price: 42.80, change: -0.50, changePercent: -1.15, volume: 2890000, high: 43.50, low: 42.20, open: 43.20 },
  '000661': { code: '000661', name: '长春高新', pinyin: 'ccgx', price: 156.80, change: 3.50, changePercent: 2.29, volume: 1230000, high: 158.00, low: 153.50, open: 155.00 },
  '600585': { code: '600585', name: '海螺水泥', pinyin: 'hlsn', price: 38.60, change: -0.30, changePercent: -0.77, volume: 2340000, high: 39.00, low: 38.20, open: 38.80 },
  '601899': { code: '601899', name: '紫金矿业', pinyin: 'zjky', price: 13.80, change: 0.25, changePercent: 1.84, volume: 15600000, high: 14.00, low: 13.50, open: 13.65 },
  '000878': { code: '000878', name: '云南铜业', pinyin: 'ynty', price: 14.50, change: 0.40, changePercent: 2.84, volume: 8900000, high: 14.70, low: 14.00, open: 14.20 },
  '600362': { code: '600362', name: '江西铜业', pinyin: 'jxty', price: 18.90, change: 0.60, changePercent: 3.28, volume: 7890000, high: 19.20, low: 18.30, open: 18.50 },
  
  // 新能源
  '002466': { code: '002466', name: '天齐锂业', pinyin: 'tqly', price: 58.60, change: 2.30, changePercent: 4.08, volume: 4560000, high: 59.50, low: 56.50, open: 57.00 },
  '000792': { code: '000792', name: '盐湖股份', pinyin: 'yhgf', price: 28.50, change: 1.20, changePercent: 4.40, volume: 5670000, high: 29.00, low: 27.50, open: 27.80 },
  '603799': { code: '603799', name: '华友钴业', pinyin: 'hygy', price: 68.90, change: 3.50, changePercent: 5.35, volume: 3450000, high: 70.00, low: 65.50, open: 66.50 },
  '002074': { code: '002074', name: '国轩高科', pinyin: 'gxgk', price: 24.80, change: 1.10, changePercent: 4.64, volume: 4560000, high: 25.50, low: 23.80, open: 24.00 },
  '300073': { code: '300073', name: '当升科技', pinyin: 'dsk', price: 45.60, change: 2.80, changePercent: 6.54, volume: 2340000, high: 46.50, low: 43.00, open: 43.50 },
  
  // 芯片半导体
  '300782': { code: '300782', name: '卓胜微', pinyin: 'zsw', price: 128.60, change: 5.20, changePercent: 4.22, volume: 1890000, high: 130.00, low: 124.00, open: 125.00 },
  '002049': { code: '002049', name: '紫光国微', pinyin: 'zggw', price: 98.50, change: 4.50, changePercent: 4.78, volume: 2890000, high: 100.00, low: 94.50, open: 95.00 },
  '688981': { code: '688981', name: '中芯国际', pinyin: 'zxgj', price: 48.60, change: 2.30, changePercent: 4.96, volume: 4560000, high: 50.00, low: 46.50, open: 47.00 },
  '600584': { code: '600584', name: '长电科技', pinyin: 'cdkj', price: 26.80, change: 1.50, changePercent: 5.91, volume: 5670000, high: 27.50, low: 25.50, open: 25.80 },
  
  // 医药生物
  '300142': { code: '300142', name: '沃森生物', pinyin: 'wsw', price: 42.50, change: 2.80, changePercent: 7.05, volume: 7890000, high: 43.50, low: 40.00, open: 40.50 },
  '600196': { code: '600196', name: '复星医药', pinyin: 'fxyy', price: 34.80, change: 1.80, changePercent: 5.45, volume: 4560000, high: 35.50, low: 33.00, open: 33.50 },
  '300347': { code: '300347', name: '泰格医药', pinyin: 'tgyy', price: 98.60, change: 5.50, changePercent: 5.90, volume: 1560000, high: 100.00, low: 93.50, open: 94.50 },
  
  // 军工
  '600893': { code: '600893', name: '航发动力', pinyin: 'hfd', price: 42.80, change: 2.50, changePercent: 6.19, volume: 3450000, high: 43.50, low: 40.50, open: 41.00 },
  '600760': { code: '600760', name: '中航沈飞', pinyin: 'zhsf', price: 68.50, change: 4.50, changePercent: 7.03, volume: 2340000, high: 70.00, low: 64.50, open: 65.00 },
  '002025': { code: '002025', name: '航天电器', pinyin: 'htdq', price: 78.60, change: 4.20, changePercent: 5.64, volume: 1890000, high: 80.00, low: 74.50, open: 75.50 },
  '000733': { code: '000733', name: '振华科技', pinyin: 'zhkj', price: 128.50, change: 6.50, changePercent: 5.33, volume: 1560000, high: 130.00, low: 122.50, open: 123.50 },
  
  // 房地产
  '000002': { code: '000002', name: '万科A', pinyin: 'wka', price: 9.80, change: 0.20, changePercent: 2.08, volume: 8900000, high: 10.00, low: 9.60, open: 9.70 },
  '600048': { code: '600048', name: '保利发展', pinyin: 'blfz', price: 12.50, change: 0.30, changePercent: 2.46, volume: 5670000, high: 12.80, low: 12.20, open: 12.35 },
  '001979': { code: '001979', name: '招商蛇口', pinyin: 'zssk', price: 14.80, change: 0.40, changePercent: 2.78, volume: 4560000, high: 15.00, low: 14.40, open: 14.60 },
  '600383': { code: '600383', name: '金地集团', pinyin: 'jdjt', price: 8.90, change: 0.20, changePercent: 2.30, volume: 3450000, high: 9.00, low: 8.70, open: 8.80 },
  
  // 传媒娱乐
  '300251': { code: '300251', name: '光线传媒', pinyin: 'gxcm', price: 10.80, change: 0.50, changePercent: 4.85, volume: 6780000, high: 11.00, low: 10.30, open: 10.50 },
  '002739': { code: '002739', name: '万达电影', pinyin: 'wddy', price: 12.50, change: 0.60, changePercent: 5.04, volume: 5670000, high: 12.80, low: 12.00, open: 12.20 },
  '300413': { code: '300413', name: '芒果超媒', pinyin: 'mgcm', price: 32.80, change: 1.50, changePercent: 4.79, volume: 2890000, high: 33.50, low: 31.50, open: 32.00 },
  
  // 农业
  '000876': { code: '000876', name: '新希望', pinyin: 'xxw', price: 12.80, change: 0.40, changePercent: 3.23, volume: 6780000, high: 13.00, low: 12.40, open: 12.60 },
  '002714': { code: '002714', name: '牧原股份', pinyin: 'mygf', price: 38.50, change: 2.30, changePercent: 6.35, volume: 4560000, high: 39.50, low: 36.50, open: 37.00 },
  '600598': { code: '600598', name: '北大荒', pinyin: 'bdh', price: 14.80, change: 0.50, changePercent: 3.51, volume: 5670000, high: 15.00, low: 14.30, open: 14.60 },
};

// 股票分类
export const stockCategories = {
  // 热门股票
  hot: ['600519', '000858', '002594', '300750', '601318', '000001', '600036', '601012', '002415', '600276'],
  // 消费板块
  consumer: ['600519', '000858', '000568', '002304', '600809', '600779', '000895', '600887', '600305'],
  // 金融板块
  finance: ['601318', '000001', '600036', '601166', '601328', '601398', '601288', '601988', '601939', '600016', '600030', '600837'],
  // 科技板块
  tech: ['002594', '300750', '000333', '000651', '601012', '300274', '002475', '002415'],
  // 新能源
  newEnergy: ['002594', '300750', '002466', '000792', '603799', '002074', '300073'],
  // 芯片半导体
  chip: ['300782', '002049', '688981', '600584'],
  // 医药生物
  medicine: ['600276', '000661', '300142', '600196', '300347'],
  // 军工
  military: ['600893', '600760', '002025', '000733'],
  // 房地产
  realEstate: ['000002', '600048', '001979', '600383'],
  // 传媒
  media: ['300251', '002739', '300413'],
  // 农业
  agriculture: ['000876', '002714', '600598'],
  // 有色金属
  metal: ['601899', '000878', '600362'],
  // 电力
  power: ['600900'],
};

// 基础股票列表（去除拼音字段）
export const baseStocks: Stock[] = Object.values(referenceData).map(({ pinyin, ...stock }) => stock);

// 获取分类股票
export function getStocksByCategory(category: keyof typeof stockCategories): Stock[] {
  const codes = stockCategories[category] || [];
  return codes.map(code => {
    const stock = referenceData[code];
    if (stock) {
      const { pinyin, ...rest } = stock;
      return rest;
    }
    return null;
  }).filter((stock): stock is Stock => stock !== null);
}

// 获取所有股票代码
export function getAllStockCodes(): string[] {
  return Object.keys(referenceData);
}

// 获取真实股票数据（智能选择数据源）
export async function getRealTimeQuote(stockCode: string): Promise<Stock | null> {
  console.log(`正在获取 ${stockCode} 数据...`);
  
  // 1. 优先尝试本地API
  const localAvailable = await checkLocalServer();
  if (localAvailable) {
    try {
      const response = await fetch(`${API_CONFIG.local.baseUrl}/api/stocks/${stockCode}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`成功从本地API获取: ${data.price}`);
        return data;
      }
    } catch (error) {
      console.log('本地API获取失败，尝试远程API', error);
    }
  }
  
  // 2. 尝试远程API (Vercel代理)
  try {
    const response = await fetch(`/api/stock/${stockCode}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`成功从远程API获取: ${data.price}`);
      return {
        code: stockCode,
        name: data.name,
        price: parseFloat(data.price.toFixed(2)),
        change: parseFloat(data.change.toFixed(2)),
        changePercent: parseFloat(data.changePercent.toFixed(2)),
        volume: data.volume,
        high: parseFloat(data.high.toFixed(2)),
        low: parseFloat(data.low.toFixed(2)),
        open: parseFloat(data.open.toFixed(2)),
      };
    }
  } catch (apiError) {
    console.log('远程API获取失败，使用参考数据', apiError);
  }
  
  // 3. 最后使用参考数据
  const stock = referenceData[stockCode];
  if (stock) {
    const { pinyin, ...rest } = stock;
    return rest;
  }
  return null;
}

// 批量获取行情
export async function getBatchRealTimeQuotes(stockCodes: string[]): Promise<Stock[]> {
  const results: Stock[] = [];
  
  for (const code of stockCodes) {
    const quote = await getRealTimeQuote(code);
    if (quote) {
      results.push(quote);
    }
  }
  
  return results;
}

// 获取真实K线数据（智能选择数据源）
export async function getRealKLineData(stockCode: string, days: number = 60): Promise<KLineData[]> {
  console.log(`正在获取 ${stockCode} K线数据...`);
  
  // 1. 优先尝试本地API
  const localAvailable = await checkLocalServer();
  if (localAvailable) {
    try {
      const response = await fetch(`${API_CONFIG.local.baseUrl}/api/stocks/${stockCode}/kline?days=${days}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`成功从本地API获取K线数据，共 ${data.length} 条`);
        return data;
      }
    } catch (error) {
      console.log('本地K线API获取失败，尝试远程API', error);
    }
  }
  
  // 2. 尝试远程API (Vercel代理)
  try {
    const response = await fetch(`/api/kline/${stockCode}?days=${days}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`成功从远程API获取K线数据，共 ${data.length} 条`);
      return data;
    }
  } catch (apiError) {
    console.log('远程K线API获取失败，使用模拟数据', apiError);
  }
  
  // 3. 最后使用模拟数据
  const stock = referenceData[stockCode];
  if (!stock) return [];
  
  const klineData: KLineData[] = [];
  let currentPrice = stock.price;
  
  for (let i = days; i > 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const volatility = currentPrice * 0.02;
    const change = (Math.random() - 0.48) * volatility;
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.floor(Math.random() * 5000000) + 1000000;
    
    klineData.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    });
    
    currentPrice = close;
  }
  
  return klineData;
}

// 搜索股票（支持本地和远程搜索）
export async function searchRealStocks(query: string): Promise<Stock[]> {
  // 1. 优先尝试本地API搜索
  const localAvailable = await checkLocalServer();
  if (localAvailable) {
    try {
      const response = await fetch(`${API_CONFIG.local.baseUrl}/api/search?query=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`成功从本地API搜索到 ${data.length} 只股票`);
        return data;
      }
    } catch (error) {
      console.log('本地搜索API获取失败，使用本地搜索', error);
    }
  }
  
  // 2. 使用本地搜索
  const lowerQuery = query.toLowerCase();
  
  return Object.values(referenceData)
    .filter(stock => 
      // 股票代码匹配
      stock.code.toLowerCase().includes(lowerQuery) || 
      // 股票名称匹配
      stock.name.toLowerCase().includes(lowerQuery) ||
      // 拼音首字母匹配
      (stock as StockWithPinyin).pinyin.toLowerCase().includes(lowerQuery)
    )
    .map(({ pinyin, ...stock }) => stock); // 返回时去除拼音字段
}
