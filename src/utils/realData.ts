import { Stock, KLineData } from '@/types';

// Yahoo Finance股票代码映射
const yahooStockMapping: Record<string, { code: string; name: string }> = {
  '600519': { code: '600519.SS', name: '贵州茅台' },
  '000858': { code: '000858.SZ', name: '五粮液' },
  '601318': { code: '601318.SS', name: '中国平安' },
  '000001': { code: '000001.SZ', name: '平安银行' },
  '600036': { code: '600036.SS', name: '招商银行' },
  '002594': { code: '002594.SZ', name: '比亚迪' },
  '300750': { code: '300750.SZ', name: '宁德时代' },
  '600900': { code: '600900.SS', name: '长江电力' },
  '000333': { code: '000333.SZ', name: '美的集团' },
  '601899': { code: '601899.SS', name: '紫金矿业' },
  'AAPL': { code: 'AAPL', name: '苹果' },
  'MSFT': { code: 'MSFT', name: '微软' },
  'GOOGL': { code: 'GOOGL', name: '谷歌' },
  'TSLA': { code: 'TSLA', name: '特斯拉' },
  'AMZN': { code: 'AMZN', name: '亚马逊' },
};

// 基础股票列表（用于展示）
export const baseStocks: Stock[] = [
  { code: '600519', name: '贵州茅台', price: 0, change: 0, changePercent: 0, volume: 0, high: 0, low: 0, open: 0 },
  { code: '000858', name: '五粮液', price: 0, change: 0, changePercent: 0, volume: 0, high: 0, low: 0, open: 0 },
  { code: '601318', name: '中国平安', price: 0, change: 0, changePercent: 0, volume: 0, high: 0, low: 0, open: 0 },
  { code: '000001', name: '平安银行', price: 0, change: 0, changePercent: 0, volume: 0, high: 0, low: 0, open: 0 },
  { code: '600036', name: '招商银行', price: 0, change: 0, changePercent: 0, volume: 0, high: 0, low: 0, open: 0 },
  { code: '002594', name: '比亚迪', price: 0, change: 0, changePercent: 0, volume: 0, high: 0, low: 0, open: 0 },
  { code: '300750', name: '宁德时代', price: 0, change: 0, changePercent: 0, volume: 0, high: 0, low: 0, open: 0 },
  { code: '600900', name: '长江电力', price: 0, change: 0, changePercent: 0, volume: 0, high: 0, low: 0, open: 0 },
  { code: '000333', name: '美的集团', price: 0, change: 0, changePercent: 0, volume: 0, high: 0, low: 0, open: 0 },
  { code: '601899', name: '紫金矿业', price: 0, change: 0, changePercent: 0, volume: 0, high: 0, low: 0, open: 0 },
];

// 获取真实股票报价（通过免费CORS代理）
export async function getRealTimeQuote(stockCode: string): Promise<Stock | null> {
  try {
    const yahooCode = yahooStockMapping[stockCode]?.code || stockCode;
    const stockName = yahooStockMapping[stockCode]?.name || stockCode;
    
    // 使用Yahoo Finance API获取最新数据
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${yahooCode}?interval=1d&range=5d`,
      { mode: 'cors' }
    );
    
    if (!response.ok) {
      throw new Error('获取数据失败');
    }
    
    const data = await response.json();
    const result = data?.chart?.result?.[0];
    
    if (!result) {
      return null;
    }
    
    const meta = result.meta;
    const quotes = result.indicators?.quote?.[0];
    const timestamps = result.timestamp || [];
    
    if (!quotes || timestamps.length === 0) {
      return null;
    }
    
    // 获取最新数据
    const currentIdx = timestamps.length - 1;
    const prevIdx = Math.max(0, timestamps.length - 2);
    
    const currentPrice = meta.regularMarketPrice || quotes.close?.[currentIdx] || 0;
    const prevClose = meta.chartPreviousClose || quotes.close?.[prevIdx] || currentPrice;
    const high = quotes.high?.[currentIdx] || currentPrice;
    const low = quotes.low?.[currentIdx] || currentPrice;
    const open = quotes.open?.[currentIdx] || currentPrice;
    const volume = quotes.volume?.[currentIdx] || 0;
    
    const change = currentPrice - prevClose;
    const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;
    
    return {
      code: stockCode,
      name: stockName,
      price: parseFloat(currentPrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: volume,
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      open: parseFloat(open.toFixed(2)),
    };
  } catch (error) {
    console.error('获取真实行情失败:', error);
    return null;
  }
}

// 批量获取真实行情
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

// 获取真实K线数据
export async function getRealKLineData(stockCode: string, days: number = 60): Promise<KLineData[]> {
  try {
    const yahooCode = yahooStockMapping[stockCode]?.code || stockCode;
    
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${yahooCode}?interval=1d&range=${Math.max(days, 30)}d`,
      { mode: 'cors' }
    );
    
    if (!response.ok) {
      throw new Error('获取K线失败');
    }
    
    const data = await response.json();
    const result = data?.chart?.result?.[0];
    
    if (!result) {
      return [];
    }
    
    const quotes = result.indicators?.quote?.[0];
    const timestamps = result.timestamp || [];
    
    if (!quotes) {
      return [];
    }
    
    const klineData: KLineData[] = [];
    
    for (let i = 0; i < timestamps.length; i++) {
      const date = new Date(timestamps[i] * 1000);
      const open = quotes.open?.[i];
      const high = quotes.high?.[i];
      const low = quotes.low?.[i];
      const close = quotes.close?.[i];
      const volume = quotes.volume?.[i];
      
      if (open !== undefined && high !== undefined && low !== undefined && close !== undefined && volume !== undefined) {
        klineData.push({
          date: date.toISOString().split('T')[0],
          open: parseFloat(open.toFixed(2)),
          high: parseFloat(high.toFixed(2)),
          low: parseFloat(low.toFixed(2)),
          close: parseFloat(close.toFixed(2)),
          volume: volume,
        });
      }
    }
    
    return klineData.slice(-days);
  } catch (error) {
    console.error('获取真实K线失败:', error);
    return [];
  }
}

// 搜索股票（基于预定义列表）
export function searchRealStocks(query: string): Stock[] {
  const lowerQuery = query.toLowerCase();
  return baseStocks.filter(stock => 
    stock.code.toLowerCase().includes(lowerQuery) || 
    stock.name.toLowerCase().includes(lowerQuery)
  );
}
