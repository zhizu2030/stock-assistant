import { Stock, KLineData } from '../types';

export const mockStocks: Stock[] = [
  { code: '600519', name: '贵州茅台', price: 1820.50, change: 25.80, changePercent: 1.44, volume: 2345000, high: 1850.00, low: 1790.00, open: 1800.00, marketCap: 22900, pe: 35.2 },
  { code: '000858', name: '五粮液', price: 156.80, change: -3.20, changePercent: -2.00, volume: 5678000, high: 162.00, low: 155.00, open: 160.00, marketCap: 6080, pe: 28.5 },
  { code: '601318', name: '中国平安', price: 48.50, change: 1.20, changePercent: 2.53, volume: 12340000, high: 49.00, low: 47.20, open: 47.50, marketCap: 8850, pe: 12.3 },
  { code: '000001', name: '平安银行', price: 12.35, change: 0.25, changePercent: 2.07, volume: 8900000, high: 12.50, low: 12.10, open: 12.15, marketCap: 2400, pe: 8.5 },
  { code: '600036', name: '招商银行', price: 35.80, change: -0.80, changePercent: -2.19, volume: 4560000, high: 37.00, low: 35.50, open: 36.80, marketCap: 8800, pe: 9.8 },
  { code: '002594', name: '比亚迪', price: 256.30, change: 8.50, changePercent: 3.44, volume: 3450000, high: 260.00, low: 248.00, open: 249.00, marketCap: 7500, pe: 45.2 },
  { code: '300750', name: '宁德时代', price: 185.60, change: -5.20, changePercent: -2.73, volume: 2890000, high: 192.00, low: 183.00, open: 191.00, marketCap: 8200, pe: 38.5 },
  { code: '600900', name: '长江电力', price: 28.90, change: 0.50, changePercent: 1.76, volume: 6780000, high: 29.20, low: 28.30, open: 28.50, marketCap: 5200, pe: 15.8 },
  { code: '000333', name: '美的集团', price: 62.50, change: 1.80, changePercent: 2.96, volume: 3240000, high: 63.50, low: 60.80, open: 60.90, marketCap: 4400, pe: 14.2 },
  { code: '601899', name: '紫金矿业', price: 15.60, change: 0.30, changePercent: 1.96, volume: 15600000, high: 15.80, low: 15.20, open: 15.30, marketCap: 3800, pe: 18.5 },
];

export function generateKLineData(stockCode: string, days: number = 60): KLineData[] {
  const data: KLineData[] = [];
  const stock = mockStocks.find(s => s.code === stockCode) || mockStocks[0];
  let currentPrice = stock.price * 0.8;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const volatility = currentPrice * 0.03;
    const change = (Math.random() - 0.5) * volatility;
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * volatility;
    const low = Math.min(open, close) - Math.random() * volatility;
    const volume = Math.floor(Math.random() * 5000000) + 1000000;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    });
    
    currentPrice = close;
  }
  
  return data;
}

export function searchStocks(query: string): Stock[] {
  const lowerQuery = query.toLowerCase();
  return mockStocks.filter(stock => 
    stock.code.toLowerCase().includes(lowerQuery) || 
    stock.name.toLowerCase().includes(lowerQuery)
  );
}

export function getStockByCode(code: string): Stock | undefined {
  return mockStocks.find(s => s.code === code);
}

export const aiResponses = [
  "根据当前市场分析，建议关注消费和新能源板块的龙头企业。近期市场波动较大，注意控制仓位风险。",
  "从技术面来看，该股票当前处于震荡整理阶段，MACD指标有金叉迹象，可关注后续走势。",
  "基本面分析显示，公司营收稳定增长，市盈率处于合理区间，适合中长期持有。",
  "建议采用分散投资策略，不要把资金集中在单一股票上，以降低风险。",
  "近期市场情绪偏谨慎，建议等待更明确的信号再进行大额交易。",
  "该股票近期成交量有所放大，资金流入明显，可关注其突破机会。",
  "从行业周期来看，当前处于景气度上升阶段，相关龙头企业有望受益。",
  "投资有风险，入市需谨慎。以上建议仅供参考，不构成投资建议。"
];

export function getAIResponse(): string {
  return aiResponses[Math.floor(Math.random() * aiResponses.length)];
}
