
import { useState, useMemo } from 'react';
import { Search, TrendingUp, Filter } from 'lucide-react';
import { useAppStore } from '@/store';
import { StockCard } from '@/components/StockCard';
import { searchStocks } from '@/utils/mockData';

type SortType = 'change' | 'price' | 'volume';

export default function Market() {
  const [query, setQuery] = useState('');
  const [sortType, setSortType] = useState<SortType>('change');
  const { stocks } = useAppStore();

  const filteredStocks = useMemo(() => {
    let result = query.trim() ? searchStocks(query) : stocks;
    
    switch (sortType) {
      case 'change':
        return [...result].sort((a, b) => b.changePercent - a.changePercent);
      case 'price':
        return [...result].sort((a, b) => b.price - a.price);
      case 'volume':
        return [...result].sort((a, b) => b.volume - a.volume);
      default:
        return result;
    }
  }, [stocks, query, sortType]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-4 py-6 border-b border-gray-200 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900 mb-4">行情中心</h1>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索股票代码或名称..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex gap-2">
          {[
            { type: 'change' as SortType, label: '涨跌幅' },
            { type: 'price' as SortType, label: '价格' },
            { type: 'volume' as SortType, label: '成交量' },
          ].map((item) => (
            <button
              key={item.type}
              onClick={() => setSortType(item.type)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                sortType === item.type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {filteredStocks.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">未找到相关股票</p>
          </div>
        ) : (
          filteredStocks.map((stock) => (
            <StockCard key={stock.code} stock={stock} />
          ))
        )}
      </div>
    </div>
  );
}

