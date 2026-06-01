
import { Star, AlertCircle } from 'lucide-react';
import { Stock } from '@/types';
import { useAppStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

interface StockCardProps {
  stock: Stock;
}

export function StockCard({ stock }: StockCardProps) {
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useAppStore();
  const inWatchlist = isInWatchlist(stock.code);
  const isPositive = stock.changePercent >= 0;
  const hasFailed = stock.price === 0; // 价格为0表示获取失败

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasFailed) return; // 失败时禁用自选股操作
    if (inWatchlist) {
      removeFromWatchlist(stock.code);
    } else {
      addToWatchlist(stock.code);
    }
  };

  return (
    <div
      onClick={() => !hasFailed && navigate(`/stock/${stock.code}`)}
      className={clsx(
        "bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-transform cursor-pointer",
        hasFailed ? "opacity-80" : "active:scale-[0.98]"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{stock.name}</h3>
            <span className="text-xs text-gray-500">{stock.code}</span>
          </div>
          {hasFailed ? (
            <div className="mt-3 flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">获取数据失败</span>
            </div>
          ) : (
            <div className="mt-2">
              <span className="text-2xl font-bold text-gray-900">
                ¥{stock.price.toFixed(2)}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={handleToggleWatchlist}
          className={clsx(
            'p-2 rounded-full transition-colors',
            hasFailed 
              ? 'text-gray-300 cursor-not-allowed'
              : inWatchlist
                ? 'text-yellow-500 hover:bg-yellow-50'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          )}
          disabled={hasFailed}
        >
          <Star className={clsx('w-5 h-5', inWatchlist && !hasFailed && 'fill-current')} />
        </button>
      </div>
      {!hasFailed && (
        <div className="mt-3 flex items-center justify-between">
          <div
            className={clsx(
              'text-sm font-medium px-2 py-1 rounded',
              isPositive
                ? 'bg-green-50 text-green-600'
                : 'bg-red-50 text-red-600'
            )}
          >
            {isPositive ? '+' : ''}{stock.change.toFixed(2)}
            <span className="ml-1">
              ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
            </span>
          </div>
          <div className="text-xs text-gray-500">
            成交量: {(stock.volume / 10000).toFixed(0)}万
          </div>
        </div>
      )}
    </div>
  );
}
