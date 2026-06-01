
import type { VercelRequest, VercelResponse } from '@vercel/node';

// 腾讯财经股票代码映射
const getTencentCode = (code: string) => {
  if (code.startsWith('6')) return `sh${code}`;
  if (code.startsWith('0') || code.startsWith('3')) return `sz${code}`;
  return code;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code, days = '60' } = req.query;
  
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: '缺少股票代码' });
  }

  try {
    const tencentCode = getTencentCode(code);
    const dayCount = parseInt(days as string) || 60;
    
    // 腾讯财经K线API
    const response = await fetch(`https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?_var=kline_dayqfq&param=${tencentCode},day,,,${dayCount},qfq`);
    const data = await response.text();
    
    // 提取JSON数据
    const jsonMatch = data.match(/=\s*(\{.+\})/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'K线数据解析失败' });
    }

    const result = JSON.parse(jsonMatch[1]);
    const klineData = result.data?.[tencentCode]?.dayqfq || result.data?.[tencentCode]?.day;

    if (!klineData || !Array.isArray(klineData)) {
      return res.status(500).json({ error: '未获取到K线数据' });
    }

    const formattedData = klineData.map((item: any[]) => ({
      date: item[0],
      open: parseFloat(item[1]),
      high: parseFloat(item[3]),
      low: parseFloat(item[4]),
      close: parseFloat(item[2]),
      volume: parseInt(item[5]) || 0,
    }));

    return res.json(formattedData);
  } catch (error) {
    console.error('获取K线数据失败:', error);
    return res.status(500).json({ error: '获取K线数据失败' });
  }
}
