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

// 基础股票列表 - 仅用于展示股票代码和名称
export const baseStocks: Stock[] = Object.entries(yahooStockMapping)
  .filter(([code]) => ['600519', '000858', '601318', '000001', '600036', '002594', '300750', '600900', '000333', '601899'].includes(code.replace('.SS', '').replace('.SZ', '')))
  .map(([code, { name }]) => ({
  code: code.replace('.SS', '').replace('.SZ', ''),
  name,
  price: 0,
  change: 0,
  changePercent: 0,
  volume: 0,
  high: 0,
  low: 0,
  open: 0,
}));

// 获取真实股票报价
export async function getRealTimeQuote(stockCode: string): Promise<Stock | null> {
  try {
    const yahooCode = yahooStockMapping[stockCode]?.code || stockCode;
    const stockName = yahooStockMapping[stockCode]?.name || stockCode;
    
    // 仅使用 Yahoo Finance API 获取真实数据
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${yahooCode}?interval=1d&range=5d`,
      { mode: 'cors' }
    );
    
    if (!response.ok) {
      console.log(`获取 ${stockName} 失败: HTTP ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    const result = data?.chart?.result?.[0];
    
    if (!result) {
      console.log(`获取 ${stockName} 失败: 无数据返回`);
      return null;
    }
    
    const meta = result.meta;
    const quotes = result.indicators?.quote?.[0];
    const timestamps = result.timestamp || [];
    
    if (!quotes || timestamps.length === 0) {
      console.log(`获取 ${stockName} 失败: 数据格式错误`);
      return null;
    }
    
    const currentIdx = timestamps.length - 1;
    const prevIdx = Math.max(0, timestamps.length - 2);
    
    const currentPrice = meta.regularMarketPrice || quotes.close?.[currentIdx] || 0;
    const prevClose = meta.chartPreviousClose || quotes.close?.[prevIdx] || currentPrice;
    const high = quotes.high?.[currentIdx] || currentPrice;
    const low = quotes.low?.[currentIdx] || currentPrice;
    const open = quotes.open?.[currentIdx] || currentPrice;
    const volume = quotes.volume?.[currentIdx] || 0;
    
    if (currentPrice <= 0) {
      console.log(`获取 ${stockName} 失败: 价格无效`);
      return null;
    }
    
    const change = currentPrice - prevClose;
    const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;
    
    console.log(`成功获取 ${stockName} 真实数据: ${currentPrice}`);
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
    console.error(`获取 ${stockCode} 真实行情失败:', error);
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
      console.log(`获取 ${stockCode} K线失败: HTTP ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    const result = data?.chart?.result?.[0];
    
    if (!result) {
      console.log(`获取 ${stockCode} K线失败: 无数据返回`);
      return [];
    }
    
    const quotes = result.indicators?.quote?.[0];
    const timestamps = result.timestamp || [];
    
    if (!quotes || timestamps.length === 0) {
      console.log(`获取 ${stockCode} K线失败: 数据格式错误`);
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
          volume,
        });
      }
    }
    
    return klineData.slice(-days);
  } catch (error) {
    console.error(`获取 ${stockCode} K线失败:', error);
    return [];
  }
}

// 搜索股票（基于预定义列表
export function searchRealStocks(query: string): Stock[] {
  const lowerQuery = query.toLowerCase();
  return baseStocks.filter(stock => 
    stock.code.toLowerCase().includes(lowerQuery) || 
    stock.name.toLowerCase().includes(lowerQuery)
  );
}
