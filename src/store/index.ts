import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Stock, Message, WatchlistItem } from '@/types';
import { mockStocks, getStockByCode, getAIResponse, generateKLineData } from '@/utils/mockData';
import { getBatchRealTimeQuotes, getRealTimeQuote, getRealKLineData, baseStocks } from '@/utils/realData';

interface AppState {
  stocks: Stock[];
  watchlist: WatchlistItem[];
  messages: Message[];
  selectedStock: Stock | null;
  isRealData: boolean;
  isLoading: boolean;
  lastFetchTime: number;
  // 核心功能
  addToWatchlist: (stockCode: string) => void;
  removeFromWatchlist: (stockCode: string) => void;
  isInWatchlist: (stockCode: string) => boolean;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  clearMessages: () => void;
  selectStock: (stock: Stock) => void;
  // 数据获取
  fetchRealTimeData: (force?: boolean) => Promise<void>;
  fetchSingleStock: (stockCode: string) => Promise<Stock | null>;
  fetchKLineData: (stockCode: string, days?: number) => Promise<any[]>;
  toggleRealData: () => void;
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
      isRealData: false,
      isLoading: false,
      lastFetchTime: 0,

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

      toggleRealData: () => {
        set((state) => {
          const newMode = !state.isRealData;
          return {
            isRealData: newMode,
            stocks: newMode ? baseStocks : mockStocks,
          };
        });
      },

      fetchRealTimeData: async (force = false) => {
        const { isRealData, lastFetchTime, stocks } = get();
        
        if (!isRealData) return;
        
        const now = Date.now();
        if (!force && now - lastFetchTime < 30000) return; // 30秒内不重复请求
        
        set({ isLoading: true });
        
        try {
          const stockCodes = stocks.map(s => s.code);
          const realQuotes = await getBatchRealTimeQuotes(stockCodes);
          
          if (realQuotes.length > 0) {
            // 合并数据，保留没有获取到的原始数据
            const updatedStocks = stocks.map(stock => {
              const realQuote = realQuotes.find(q => q.code === stock.code);
              return realQuote || stock;
            });
            set({ stocks: updatedStocks, lastFetchTime: now });
          }
        } catch (error) {
          console.error('获取真实行情失败:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      fetchSingleStock: async (stockCode: string): Promise<Stock | null> => {
        const { isRealData, stocks } = get();
        
        if (!isRealData) {
          return getStockByCode(stockCode) || null;
        }
        
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
          return getStockByCode(stockCode) || null;
        }
      },

      fetchKLineData: async (stockCode: string, days: number = 60) => {
        const { isRealData } = get();
        
        if (!isRealData) {
          return generateKLineData(stockCode, days);
        }
        
        try {
          const klineData = await getRealKLineData(stockCode, days);
          if (klineData.length > 0) {
            return klineData;
          }
          return generateKLineData(stockCode, days); // 失败时回退
        } catch (error) {
          console.error('获取K线失败:', error);
          return generateKLineData(stockCode, days);
        }
      },
    }),
    {
      name: 'stock-assistant-storage',
      partialize: (state) => ({
        watchlist: state.watchlist,
        isRealData: state.isRealData,
      }),
    }
  )
);
