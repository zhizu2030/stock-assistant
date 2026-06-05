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

// 股票基础数据（用于显示和备用） - 使用更真实的价格
const referenceData: Record<string, StockWithPinyin> = {
  // 测试股票（用于验证接口）
  '600001': { code: '600001', name: '东方明珠', pinyin: 'dfmz', price: 8.56, change: 0.23, changePercent: 2.76, volume: 125600, high: 8.62, low: 8.32, open: 8.35 },
  '300001': { code: '300001', name: '特锐德', pinyin: 'tld', price: 16.89, change: -0.45, changePercent: -2.59, volume: 87600, high: 17.42, low: 16.78, open: 17.34 },
  '000001': { code: '000001', name: '平安银行', pinyin: 'payh', price: 10.78, change: 0.12, changePercent: 1.13, volume: 234500, high: 10.85, low: 10.62, open: 10.68 },
};

// 股票分类
export const stockCategories = {
  // 热门股票
  hot: ['600001', '300001', '000001'],
  // 测试股票
  test: ['600001', '300001', '000001'],
  // 消费板块
  consumer: ['600001'],
  // 金融板块
  finance: ['000001'],
  // 科技板块
  tech: ['300001'],
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
