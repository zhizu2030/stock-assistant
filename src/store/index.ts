import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Stock, Message, WatchlistItem } from '../types';
import { getAIResponse } from '../utils/mockData';
import { getBatchRealTimeQuotes, getRealTimeQuote, getRealKLineData, baseStocks } from '../utils/realData';

interface AppState {
  stocks: Stock[];
  watchlist: WatchlistItem[];
  messages: Message[];
  selectedStock: Stock | null;
  isLoading: boolean;
  lastFetchTime: number;
  loadProgress: number; // 加载进度百分比 0-100
  loadStatus: string; // 加载状态文字

  addToWatchlist: (stockCode: string) => void;
  removeFromWatchlist: (stockCode: string) => void;
  isInWatchlist: (stockCode: string) => boolean;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  clearMessages: () => void;
  selectStock: (stock: Stock) => void;

  fetchRealTimeData: (force?: boolean) => Promise<void>;
  fetchSingleStock: (stockCode: string) => Promise<Stock | null>;
  fetchKLineData: (stockCode: string, days?: number) => Promise<any[]>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      stocks: baseStocks,
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
      isLoading: false,
      lastFetchTime: 0,
      loadProgress: 0,
      loadStatus: '',

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

      fetchRealTimeData: async (force = false) => {
        const { stocks } = get();
        const now = Date.now();

        set({ isLoading: true, loadProgress: 0, loadStatus: '准备刷新...' });

        try {
          const stockCodes = stocks.map(s => s.code);
          const totalStocks = stockCodes.length;
          const realQuotes: Stock[] = [];

          set({ loadProgress: 10, loadStatus: `正在获取数据 (0/${totalStocks})...` });

          for (let i = 0; i < stockCodes.length; i++) {
            try {
              const quote = await getRealTimeQuote(stockCodes[i]);
              if (quote) {
                realQuotes.push(quote);
              }
              
              const progress = Math.min(100, Math.round((i + 1) / totalStocks * 90) + 10);
              set({ 
                loadProgress: progress, 
                loadStatus: `正在获取数据 (${i + 1}/${totalStocks})...` 
              });
              
              // 稍微延迟，让用户能看到进度变化
              await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
              console.error(`获取 ${stockCodes[i]} 失败:`, error);
            }
          }

          // 不管有没有获取到真实数据，都显示完成状态
          set({ loadProgress: 95, loadStatus: '更新数据...' });
          
          // 合并数据，保留没有获取到的原始数据
          const updatedStocks = stocks.map(stock => {
            const realQuote = realQuotes.find(q => q.code === stock.code);
            return realQuote || stock;
          });
          
          set({ stocks: updatedStocks, lastFetchTime: now, loadProgress: 100, loadStatus: '刷新完成！' });
          
          // 保持isLoading为false，让按钮显示"刷新完成！"5秒
          setTimeout(() => {
            set({ loadProgress: 0, loadStatus: '' });
          }, 5000);
        } catch (error) {
          console.error('获取真实行情失败:', error);
          set({ loadStatus: '刷新失败，请稍后重试' });
          // 3秒后重置
          setTimeout(() => {
            set({ loadProgress: 0, loadStatus: '' });
          }, 3000);
        } finally {
          set({ isLoading: false });
        }
      },

      fetchSingleStock: async (stockCode: string): Promise<Stock | null> => {
        try {
          const realQuote = await getRealTimeQuote(stockCode);
          if (realQuote) {
            // 更新本地数据
            set((state) => ({
              stocks: state.stocks.map(s => s.code === stockCode ? realQuote : s),
            }));
          }
          return realQuote;
        } catch (error) {
          console.error('获取单只股票失败:', error);
          return get().stocks.find(s => s.code === stockCode) || null;
        }
      },

      fetchKLineData: async (stockCode: string, days: number = 60) => {
        try {
          const klineData = await getRealKLineData(stockCode, days);
          if (klineData.length > 0) {
            return klineData;
          }
          return [];
        } catch (error) {
          console.error('获取K线失败:', error);
          return [];
        }
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
