import { Star, Trash2, Plus } from 'lucide-react';
import { useAppStore } from '@/store';
import { StockCard } from '@/components/StockCard';
import { useNavigate } from 'react-router-dom';

export default function Watchlist() {
  const navigate = useNavigate();
  const { stocks, watchlist } = useAppStore();

  const watchlistStocks = watchlist
    .map(item => stocks.find(s => s.code === item.stockCode))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">我的自选</h1>
              <p className="text-yellow-100 text-sm">共 {watchlistStocks.length} 只股票</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/market')}
            className="px-4 py-2 bg-white/20 text-white rounded-xl text-sm font-medium hover:bg-white/30 transition-colors"
          >
            <Plus className="w-4 h-4 inline mr-1" />
            添加
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {watchlistStocks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-gray-900 font-medium mb-2">还没有自选股</h3>
            <p className="text-gray-500 text-sm mb-6">去行情中心添加感兴趣的股票吧</p>
            <button
              onClick={() => navigate('/market')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              去添加
            </button>
          </div>
        ) : (
          watchlistStocks.map((stock) => (
            <StockCard key={stock.code} stock={stock} />
          ))
        )}
      </div>
    </div>
  );
}
