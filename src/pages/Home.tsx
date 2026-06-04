
import { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, TrendingDown, Zap, RefreshCw, Search, X, Clock, FileText } from 'lucide-react';
import { useAppStore } from '../store';
import { StockCard } from '../components/StockCard';
import { searchRealStocks } from '../utils/realData';
import { Stock } from '../types';

// 部署信息配置
const DEPLOY_INFO = {
  version: '1.0.1',
  deployDate: '2026-06-04',
  deployTime: '10:30 CST',
  updates: [
    '✅ 更新部署信息机制，每次更新自动记录时间',
    '✅ 添加部署信息横幅，显示部署时间和更新内容',
    '✅ 首页搜索功能完善（支持代码、名称、拼音首字母）',
    '✅ 股票池扩展至50+只主要A股',
    '✅ 行情中心添加行业分类标签',
    '✅ 移除AI对话功能',
    '✅ 移除Trae Solo图标',
    '✅ 优化数据刷新机制'
  ]
};

export default function Home() {
  const {
    stocks,
    isLoading,
    fetchRealTimeData,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDeployInfo, setShowDeployInfo] = useState(true); // 默认显示

  const sortedByGain = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
  const sortedByLoss = [...stocks].sort((a, b) => a.changePercent - b.changePercent);
  const hotStocks = sortedByGain.slice(0, 3);
  const downStocks = sortedByLoss.slice(0, 3);

  // 搜索处理
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      try {
        const results = await searchRealStocks(query);
        setSearchResults(results);
      } catch (error) {
        console.error('搜索失败:', error);
        setSearchResults([]);
      }
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setSearchResults([]);
  };

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
      {/* 部署信息横幅 */}
      {showDeployInfo && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  部署时间：{DEPLOY_INFO.deployDate} {DEPLOY_INFO.deployTime}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-semibold">本次更新内容：</span>
              </div>
              <ul className="text-xs space-y-1 ml-6">
                {DEPLOY_INFO.updates.map((update, index) => (
                  <li key={index}>{update}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setShowDeployInfo(false)}
              className="text-white/80 hover:text-white ml-2"
              title="关闭"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

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

        {/* 搜索框 */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="搜索股票代码或名称..."
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/95 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
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
        {isSearching ? (
          /* 搜索结果 */
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-gray-900">
                搜索结果 ({searchResults.length})
              </h2>
            </div>
            {searchResults.length > 0 ? (
              <div className="space-y-3">
                {searchResults.map(stock => (
                  <StockCard key={stock.code} stock={stock} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>未找到匹配的股票</p>
                <p className="text-sm mt-2">试试输入股票代码或名称</p>
              </div>
            )}
          </div>
        ) : (
          /* 正常页面内容 */
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
