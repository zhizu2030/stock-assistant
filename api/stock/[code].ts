
import type { VercelRequest, VercelResponse } from '@vercel/node';

// 腾讯财经股票代码映射
const getTencentCode = (code: string) => {
  if (code.startsWith('6')) return `sh${code}`;
  if (code.startsWith('0') || code.startsWith('3')) return `sz${code}`;
  return code;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code } = req.query;
  
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: '缺少股票代码' });
  }

  try {
    const tencentCode = getTencentCode(code);
    const response = await fetch(`https://qt.gtimg.cn/q=${tencentCode}`);
    const data = await response.text();
    
    if (!data || data.includes('v_pv_none_match')) {
      return res.status(404).json({ error: '未找到股票数据' });
    }

    // 解析腾讯财经数据
    const parts = data.split('~');
    if (parts.length < 32) {
      return res.status(500).json({ error: '数据解析失败' });
    }

    const name = parts[1];
    const currentPrice = parseFloat(parts[3]);
    const priceChange = parseFloat(parts[4]);
    const priceChangePercent = parseFloat(parts[5]);
    const open = parseFloat(parts[5]);
    const high = parseFloat(parts[33]);
    const low = parseFloat(parts[34]);
    const volume = parseInt(parts[6]) * 100;

    return res.json({
      code,
      name,
      price: currentPrice,
      change: priceChange,
      changePercent: priceChangePercent,
      volume,
      high,
      low,
      open,
    });
  } catch (error) {
    console.error('获取股票数据失败:', error);
    return res.status(500).json({ error: '获取股票数据失败' });
  }
}
