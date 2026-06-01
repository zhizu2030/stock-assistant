
import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, TrendingUp, TrendingDown, BarChart2, Activity, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store';
import { getStockByCode, generateKLineData } from '@/utils/mockData';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y';

export default function StockDetail() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { 
    stocks, 
    addToWatchlist, 
    removeFromWatchlist, 
    isInWatchlist,
    isRealData,
    fetchSingleStock,
    fetchKLineData,
    isLoading,
  } = useAppStore();
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');
  const [kLineData, setKLineData] = useState<any[]>([]);
  const [stock, setStock] = useState<any>(null);

  const timeRangeDays: Record<TimeRange, number> = {
    '1D': 1,
    '1W': 7,
    '1M': 30,
    '3M': 90,
    '1Y': 365,
  };

  // 获取股票数据
  useEffect(() => {
    const loadStockData = async () => {
      if (!code) return;
      
      let stockData = getStockByCode(code);
      if (!stockData) {
        stockData = stocks.find(s => s.code === code);
      }
      
      if (stockData) {
        setStock(stockData);
      }
      
      // 获取真实数据
      if (isRealData && code) {
        const realStock = await fetchSingleStock(code);
        if (realStock) {
          setStock(realStock);
        }
      }
      
      // 获取K线数据
      const kline = await fetchKLineData(code, timeRangeDays[timeRange]);
      setKLineData(kline);
    };
    
    loadStockData();
  }, [code, isRealData]);

  // 时间范围变化时重新获取K线
  useEffect(() => {
    if (code) {
      fetchKLineData(code, timeRangeDays[timeRange]).then(data => {
        setKLineData(data);
      });
    }
  }, [timeRange]);

  if (!stock && code) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">股票不存在</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">加载中...</p>
        </div>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(stock.code);
  const isPositive = stock.changePercent >= 0;
  const chartData = kLineData.length > 0 
    ? kLineData.slice(-timeRangeDays[timeRange])
    : generateKLineData(stock.code, timeRangeDays[timeRange]);

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-white sticky top-0 z-10 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="text-center">
            <h1 className="font-bold text-gray-900">{stock.name}</h1>
            <p className="text-xs text-gray-500">{stock.code}</p>
          </div>
          <div className="flex items-center gap-2">
            {isRealData && (
              <button
                onClick={() => code && fetchSingleStock(code)}
                disabled={isLoading}
                className="p-2 -mr-2 hover:bg-gray-100 rounded-full"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button
              onClick={() => inWatchlist ? removeFromWatchlist(stock.code) : addToWatchlist(stock.code)}
              className="p-2 -mr-2 hover:bg-gray-100 rounded-full"
            >
              <Star className={`w-6 h-6 ${inWatchlist ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className={`px-4 py-6 ${isPositive ? 'bg-green-50' : 'bg-red-50'}`}>
        <div className="flex items-end justify-between">
          <div>
            <div className={`text-4xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              ¥{stock.price.toFixed(2)}
            </div>
            <div className={`flex items-center gap-2 mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              <span className="font-medium">
                {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/80 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">今开</p>
            <p className="font-semibold text-gray-900">¥{stock.open.toFixed(2)}</p>
          </div>
          <div className="bg-white/80 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">最高</p>
            <p className="font-semibold text-green-600">¥{stock.high.toFixed(2)}</p>
          </div>
          <div className="bg-white/80 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">最低</p>
            <p className="font-semibold text-red-600">¥{stock.low.toFixed(2)}</p>
          </div>
          <div className="bg-white/80 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">成交量</p>
            <p className="font-semibold text-gray-900">{(stock.volume / 10000).toFixed(0)}万</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-gray-900">价格走势</h2>
            </div>
            <div className="flex gap-1">
              {(['1D', '1W', '1M', '3M', '1Y'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.1} />
                    <stop offset="95%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={30}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value.toFixed(0)}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`¥${value.toFixed(2)}`, '价格']}
                />
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke={isPositive ? '#10b981' : '#ef4444'}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-5 h-5 text-purple-600" />
            <h2 className="font-semibold text-gray-900">成交量</h2>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.slice(-20)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(5)}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${(value / 10000).toFixed(1)}万`, '成交量']}
                />
                <Bar dataKey="volume" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
