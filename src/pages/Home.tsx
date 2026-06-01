
import { useEffect } from 'react';
import { Sparkles, TrendingUp, TrendingDown, Zap, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store';
import { StockCard } from '@/components/StockCard';

export default function Home() {
  const {
    stocks,
    isLoading,
    fetchRealTimeData,
  } = useAppStore();

  const sortedByGain = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
  const sortedByLoss = [...stocks].sort((a, b) => a.changePercent - b.changePercent);
  const hotStocks = sortedByGain.slice(0, 3);
  const downStocks = sortedByLoss.slice(0, 3);

  // 自动获取真实数据
  useEffect(() => {
    fetchRealTimeData(true);
    const interval = setInterval(() => {
      fetchRealTimeData();
    }, 60000); // 每分钟更新
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
      <div className="px-4 py-6 bg-gradient-to-r from-blue-900 to-cyan-600">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">智能炒股助手</h1>
            <p className="text-blue-100 text-sm">AI 赋能，智慧投资</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-100 text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>今日上涨</span>
            </div>
            <div className="text-2xl font-bold text-white">{hotStocks.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-100 text-sm mb-1">
              <Zap className="w-4 h-4" />
              <span>热门股票</span>
            </div>
            <div className="text-2xl font-bold text-white">{stocks.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <button
              onClick={() => fetchRealTimeData(true)}
              disabled={isLoading}
              className="flex items-center gap-2 text-blue-100 text-sm hover:text-white transition-all w-full"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? '刷新中...' : '刷新数据'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h2 className="font-semibold text-gray-900">热门涨幅榜</h2>
          </div>
          <div className="space-y-3">
            {hotStocks.map(stock => (
              <StockCard key={stock.code} stock={stock} />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <h2 className="font-semibold text-gray-900">跌幅榜</h2>
          </div>
          <div className="space-y-3">
            {downStocks.map(stock => (
              <StockCard key={stock.code} stock={stock} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
