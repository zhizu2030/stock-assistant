import { Stock, KLineData } from '@/types';

// 股票数据（包含拼音首字母用于搜索）
interface StockWithPinyin extends Stock {
  pinyin: string;
}

// 股票基础数据（用于显示和备用）
const referenceData: Record<string, StockWithPinyin> = {
  '600519': { code: '600519', name: '贵州茅台', pinyin: 'gzmt', price: 1326.00, change: 8.50, changePercent: 0.65, volume: 2340000, high: 1335.00, low: 1318.00, open: 1320.00 },
  '000858': { code: '000858', name: '五粮液', pinyin: 'wly', price: 118.50, change: -2.30, changePercent: -1.91, volume: 5678000, high: 121.50, low: 117.80, open: 120.00 },
  '601318': { code: '601318', name: '中国平安', pinyin: 'zgpa', price: 42.80, change: 0.35, changePercent: 0.82, volume: 12340000, high: 43.20, low: 42.40, open: 42.50 },
  '000001': { code: '000001', name: '平安银行', pinyin: 'payh', price: 10.85, change: 0.12, changePercent: 1.12, volume: 8900000, high: 11.00, low: 10.70, open: 10.75 },
  '600036': { code: '600036', name: '招商银行', pinyin: 'zsyh', price: 31.60, change: -0.30, changePercent: -0.94, volume: 4560000, high: 32.00, low: 31.30, open: 31.80 },
  '002594': { code: '002594', name: '比亚迪', pinyin: 'byd', price: 218.50, change: 3.80, changePercent: 1.77, volume: 3450000, high: 220.00, low: 215.00, open: 216.00 },
  '300750': { code: '300750', name: '宁德时代', pinyin: 'ndsd', price: 156.80, change: -2.20, changePercent: -1.38, volume: 2890000, high: 159.50, low: 155.00, open: 158.50 },
  '600900': { code: '600900', name: '长江电力', pinyin: 'cjdl', price: 25.60, change: 0.25, changePercent: 0.99, volume: 6780000, high: 25.90, low: 25.30, open: 25.45 },
  '000333': { code: '000333', name: '美的集团', pinyin: 'mdjt', price: 52.30, change: 1.50, changePercent: 2.95, volume: 3240000, high: 53.00, low: 50.80, open: 51.00 },
  '601899': { code: '601899', name: '紫金矿业', pinyin: 'zjky', price: 13.80, change: 0.25, changePercent: 1.84, volume: 15600000, high: 14.00, low: 13.50, open: 13.65 },
};

// 基础股票列表（去除拼音字段）
export const baseStocks: Stock[] = Object.values(referenceData).map(({ pinyin, ...stock }) => stock);

// 获取真实股票数据（通过我们的后端代理）
export async function getRealTimeQuote(stockCode: string): Promise<Stock | null> {
  console.log(`正在通过后端获取 ${stockCode} 数据...`);
  
  try {
    const response = await fetch(`/api/stock/${stockCode}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`成功获取真实数据: ${data.price}`);
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
    console.log('后端API获取失败，使用参考数据', apiError);
  }
  
  // 如果获取不到真实数据，返回参考数据
  return referenceData[stockCode] || null;
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

// 获取真实K线数据（通过我们的后端代理）
export async function getRealKLineData(stockCode: string, days: number = 60): Promise<KLineData[]> {
  console.log(`正在通过后端获取 ${stockCode} K线数据...`);
  
  try {
    const response = await fetch(`/api/kline/${stockCode}?days=${days}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`成功获取K线数据，共 ${data.length} 条`);
      return data;
    }
  } catch (apiError) {
    console.log('K线API获取失败，使用模拟数据', apiError);
  }
  
  // 生成模拟K线数据
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

// 搜索股票（支持代码、名称、拼音首字母）
export function searchRealStocks(query: string): Stock[] {
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
