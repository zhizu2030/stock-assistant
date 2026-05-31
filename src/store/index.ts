import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Stock, Message, WatchlistItem } from '@/types';
import { mockStocks, getStockByCode, getAIResponse } from '@/utils/mockData';

interface AppState {
  stocks: Stock[];
  watchlist: WatchlistItem[];
  messages: Message[];
  selectedStock: Stock | null;
  addToWatchlist: (stockCode: string) => void;
  removeFromWatchlist: (stockCode: string) => void;
  isInWatchlist: (stockCode: string) => boolean;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  clearMessages: () => void;
  selectStock: (stock: Stock) => void;
  updateStockPrices: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      stocks: mockStocks,
      watchlist: [],
      messages: [
        {
          id: '1',
          role: 'assistant',
          content: '你好！我是你的智能炒股助手。我可以帮你分析股票、提供投资建议、分析市场趋势。有什么可以帮助你的吗？',
          timestamp: new Date(),
        },
      ],
      selectedStock: null,

      addToWatchlist: (stockCode: string) => {
        set((state) => {
          if (state.watchlist.some(item => item.stockCode === stockCode)) {
            return state;
          }
          return {
            watchlist: [
              ...state.watchlist,
              {
                id: Date.now().toString(),
                stockCode,
                addedAt: new Date(),
              },
            ],
          };
        });
      },

      removeFromWatchlist: (stockCode: string) => {
        set((state) => ({
          watchlist: state.watchlist.filter(item => item.stockCode !== stockCode),
        }));
      },

      isInWatchlist: (stockCode: string) => {
        return get().watchlist.some(item => item.stockCode === stockCode);
      },

      addMessage: (content: string, role: 'user' | 'assistant') => {
        const newMessage: Message = {
          id: Date.now().toString(),
          role,
          content,
          timestamp: new Date(),
        };
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      },

      clearMessages: () => {
        set({
          messages: [
            {
              id: '1',
              role: 'assistant',
              content: '你好！我是你的智能炒股助手。有什么可以帮助你的吗？',
              timestamp: new Date(),
            },
          ],
        });
      },

      selectStock: (stock: Stock) => {
        set({ selectedStock: stock });
      },

      updateStockPrices: () => {
        set((state) => ({
          stocks: state.stocks.map(stock => {
            const change = (Math.random() - 0.5) * stock.price * 0.01;
            const newPrice = stock.price + change;
            const changePercent = (change / stock.price) * 100;
            return {
              ...stock,
              price: parseFloat(newPrice.toFixed(2)),
              change: parseFloat(change.toFixed(2)),
              changePercent: parseFloat(changePercent.toFixed(2)),
            };
          }),
        }));
      },
    }),
    {
      name: 'stock-assistant-storage',
      partialize: (state) => ({
        watchlist: state.watchlist,
      }),
    }
  )
);
