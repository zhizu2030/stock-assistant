# 🚀 CodeSandbox 部署步骤详解

## 第一步：在 CodeSandbox 中配置项目

### 1. 添加依赖

在 CodeSandbox 左侧找到 "Dependencies"（依赖）区域，点击 "Add Dependency"，搜索并添加以下包：

```
react-router-dom
zustand
lucide-react
recharts
clsx
```

### 2. 删除默认文件

删除 CodeSandbox 自动生成的以下默认文件：
- `src/App.js`
- `src/index.js`
- `src/styles.css`
- `public/index.html` (如果存在)

### 3. 创建新文件结构

请按以下顺序创建文件并复制对应内容：

---

## 第二步：复制代码文件

### 文件 1: `package.json` (修改)

请找到 CodeSandbox 中的 `package.json` 文件，替换为：

```json
{
  "name": "stock-assistant",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.23.1",
    "zustand": "^4.5.2",
    "lucide-react": "^0.378.0",
    "recharts": "^2.12.7",
    "clsx": "^2.1.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "vite": "^5.4.8"
  }
}
```

---

### 文件 2: `vite.config.js` (新建)

点击左侧 "New File"，创建 `vite.config.js`：

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

---

### 文件 3: `tailwind.config.js` (新建)

创建 `tailwind.config.js`：

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

### 文件 4: `postcss.config.js` (新建)

创建 `postcss.config.js`：

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

### 文件 5: `index.html` (新建)

在项目根目录创建 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>智能炒股助手</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

### 文件 6: `src/main.jsx` (新建)

创建 `src/main.jsx`：

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

### 文件 7: `src/index.css` (新建)

创建 `src/index.css`：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

### 文件 8: `src/types/index.js` (新建)

创建目录 `src/types`，然后在其中创建 `index.js`：

```javascript
// Type definitions (using JSDoc comments)

/**
 * @typedef {Object} Stock
 * @property {string} code
 * @property {string} name
 * @property {number} price
 * @property {number} change
 * @property {number} changePercent
 * @property {number} volume
 * @property {number} high
 * @property {number} low
 * @property {number} open
 * @property {number} [marketCap]
 * @property {number} [pe]
 */

/**
 * @typedef {Object} KLineData
 * @property {string} date
 * @property {number} open
 * @property {number} high
 * @property {number} low
 * @property {number} close
 * @property {number} volume
 */

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {'user' | 'assistant'} role
 * @property {string} content
 * @property {Date} timestamp
 */

/**
 * @typedef {Object} WatchlistItem
 * @property {string} id
 * @property {string} stockCode
 * @property {Date} addedAt
 */
```

---

### 文件 9: `src/utils/mockData.js` (新建)

创建 `src/utils/mockData.js`：

```javascript
export const mockStocks = [
  { code: '600519', name: '贵州茅台', price: 1820.50, change: 25.80, changePercent: 1.44, volume: 2345000, high: 1850.00, low: 1790.00, open: 1800.00, marketCap: 22900, pe: 35.2 },
  { code: '000858', name: '五粮液', price: 156.80, change: -3.20, changePercent: -2.00, volume: 5678000, high: 162.00, low: 155.00, open: 160.00, marketCap: 6080, pe: 28.5 },
  { code: '601318', name: '中国平安', price: 48.50, change: 1.20, changePercent: 2.53, volume: 12340000, high: 49.00, low: 47.20, open: 47.50, marketCap: 8850, pe: 12.3 },
  { code: '000001', name: '平安银行', price: 12.35, change: 0.25, changePercent: 2.07, volume: 8900000, high: 12.50, low: 12.10, open: 12.15, marketCap: 2400, pe: 8.5 },
  { code: '600036', name: '招商银行', price: 35.80, change: -0.80, changePercent: -2.19, volume: 4560000, high: 37.00, low: 35.50, open: 36.80, marketCap: 8800, pe: 9.8 },
  { code: '002594', name: '比亚迪', price: 256.30, change: 8.50, changePercent: 3.44, volume: 3450000, high: 260.00, low: 248.00, open: 249.00, marketCap: 7500, pe: 45.2 },
  { code: '300750', name: '宁德时代', price: 185.60, change: -5.20, changePercent: -2.73, volume: 2890000, high: 192.00, low: 183.00, open: 191.00, marketCap: 8200, pe: 38.5 },
  { code: '600900', name: '长江电力', price: 28.90, change: 0.50, changePercent: 1.76, volume: 6780000, high: 29.20, low: 28.30, open: 28.50, marketCap: 5200, pe: 15.8 },
  { code: '000333', name: '美的集团', price: 62.50, change: 1.80, changePercent: 2.96, volume: 3240000, high: 63.50, low: 60.80, open: 60.90, marketCap: 4400, pe: 14.2 },
  { code: '601899', name: '紫金矿业', price: 15.60, change: 0.30, changePercent: 1.96, volume: 15600000, high: 15.80, low: 15.20, open: 15.30, marketCap: 3800, pe: 18.5 },
];

export function generateKLineData(stockCode, days = 60) {
  const data = [];
  const stock = mockStocks.find(s => s.code === stockCode) || mockStocks[0];
  let currentPrice = stock.price * 0.8;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const volatility = currentPrice * 0.03;
    const change = (Math.random() - 0.5) * volatility;
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * volatility;
    const low = Math.min(open, close) - Math.random() * volatility;
    const volume = Math.floor(Math.random() * 5000000) + 1000000;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    });
    
    currentPrice = close;
  }
  
  return data;
}

export function searchStocks(query) {
  const lowerQuery = query.toLowerCase();
  return mockStocks.filter(stock => 
    stock.code.toLowerCase().includes(lowerQuery) || 
    stock.name.toLowerCase().includes(lowerQuery)
  );
}

export function getStockByCode(code) {
  return mockStocks.find(s => s.code === code);
}

export const aiResponses = [
  "根据当前市场分析，建议关注消费和新能源板块的龙头企业。近期市场波动较大，注意控制仓位风险。",
  "从技术面来看，该股票当前处于震荡整理阶段，MACD指标有金叉迹象，可关注后续走势。",
  "基本面分析显示，公司营收稳定增长，市盈率处于合理区间，适合中长期持有。",
  "建议采用分散投资策略，不要把资金集中在单一股票上，以降低风险。",
  "近期市场情绪偏谨慎，建议等待更明确的信号再进行大额交易。",
  "该股票近期成交量有所放大，资金流入明显，可关注其突破机会。",
  "从行业周期来看，当前处于景气度上升阶段，相关龙头企业有望受益。",
  "投资有风险，入市需谨慎。以上建议仅供参考，不构成投资建议。"
];

export function getAIResponse() {
  return aiResponses[Math.floor(Math.random() * aiResponses.length)];
}
```

---

### 文件 10: `src/store/index.js` (新建)

创建 `src/store/index.js`：

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockStocks, getAIResponse } from '@/utils/mockData';

export const useAppStore = create()(
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

      addToWatchlist: (stockCode) => {
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

      removeFromWatchlist: (stockCode) => {
        set((state) => ({
          watchlist: state.watchlist.filter(item => item.stockCode !== stockCode),
        }));
      },

      isInWatchlist: (stockCode) => {
        return get().watchlist.some(item => item.stockCode === stockCode);
      },

      addMessage: (content, role) => {
        const newMessage = {
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

      selectStock: (stock) => {
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
```

---

### 文件 11: `src/components/BottomNav.jsx` (新建)

创建 `src/components/BottomNav.jsx`：

```jsx
import { Home, TrendingUp, Star, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/market', icon: TrendingUp, label: '行情' },
  { path: '/watchlist', icon: Star, label: '自选' },
  { path: '/profile', icon: User, label: '我的' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center justify-center gap-1 w-full h-full transition-all',
                isActive
                  ? 'text-blue-800'
                  : 'text-gray-500 hover:text-gray-700'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={clsx(
                    'w-6 h-6',
                    isActive ? 'fill-current' : ''
                  )}
                />
                <span className="text-xs font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
```

---

### 文件 12: `src/components/StockCard.jsx` (新建)

创建 `src/components/StockCard.jsx`：

```jsx
import { Star } from 'lucide-react';
import { useAppStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

export function StockCard({ stock }) {
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useAppStore();
  const inWatchlist = isInWatchlist(stock.code);
  const isPositive = stock.changePercent >= 0;

  const handleToggleWatchlist = (e) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(stock.code);
    } else {
      addToWatchlist(stock.code);
    }
  };

  return (
    <div
      onClick={() => navigate(`/stock/${stock.code}`)}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{stock.name}</h3>
            <span className="text-xs text-gray-500">{stock.code}</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900">
              ¥{stock.price.toFixed(2)}
            </span>
          </div>
        </div>
        <button
          onClick={handleToggleWatchlist}
          className={clsx(
            'p-2 rounded-full transition-colors',
            inWatchlist
              ? 'text-yellow-500 hover:bg-yellow-50'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          )}
        >
          <Star className={clsx('w-5 h-5', inWatchlist && 'fill-current')} />
        </button>
      </div>
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
    </div>
  );
}
```

---

### 文件 13: `src/pages/Home.jsx` (新建)

创建 `src/pages/Home.jsx`：

```jsx
import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { useAppStore } from '@/store';
import { StockCard } from '@/components/StockCard';
import { getAIResponse } from '@/utils/mockData';

export default function Home() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { stocks, messages, addMessage } = useAppStore();

  const sortedByGain = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
  const sortedByLoss = [...stocks].sort((a, b) => a.changePercent - b.changePercent);
  const hotStocks = sortedByGain.slice(0, 3);
  const downStocks = sortedByLoss.slice(0, 3);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    addMessage(userMessage, 'user');
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse();
      addMessage(response, 'assistant');
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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

        <div className="grid grid-cols-2 gap-3 mb-4">
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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">AI 智能对话</h2>
                <p className="text-xs text-gray-500">让 AI 帮你分析市场</p>
              </div>
            </div>
          </div>

          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString('zh-CN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="问我任何关于股票的问题..."
                className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### 文件 14: `src/pages/Market.jsx` (新建)

创建 `src/pages/Market.jsx`：

```jsx
import { useState, useMemo } from 'react';
import { Search, TrendingUp, Filter } from 'lucide-react';
import { useAppStore } from '@/store';
import { StockCard } from '@/components/StockCard';
import { searchStocks } from '@/utils/mockData';

export default function Market() {
  const [query, setQuery] = useState('');
  const [sortType, setSortType] = useState('change');
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
            { type: 'change', label: '涨跌幅' },
            { type: 'price', label: '价格' },
            { type: 'volume', label: '成交量' },
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
```

---

### 文件 15: `src/pages/Watchlist.jsx` (新建)

创建 `src/pages/Watchlist.jsx`：

```jsx
import { Star, Plus } from 'lucide-react';
import { useAppStore } from '@/store';
import { StockCard } from '@/components/StockCard';
import { useNavigate } from 'react-router-dom';

export default function Watchlist() {
  const navigate = useNavigate();
  const { stocks, watchlist } = useAppStore();

  const watchlistStocks = watchlist
    .map(item => stocks.find(s => s.code === item.stockCode))
    .filter(s => s !== undefined);

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
```

---

### 文件 16: `src/pages/Profile.jsx` (新建)

创建 `src/pages/Profile.jsx`：

```jsx
import { User, Bell, Settings, HelpCircle, Info, Moon } from 'lucide-react';

export default function Profile() {
  const menuItems = [
    { icon: Bell, label: '消息通知', description: '管理推送设置' },
    { icon: Settings, label: '通用设置', description: '偏好与显示' },
    { icon: HelpCircle, label: '帮助中心', description: '常见问题解答' },
    { icon: Info, label: '关于我们', description: '版本信息' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 px-4 pt-8 pb-16">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">投资者</h1>
            <p className="text-indigo-200 text-sm">智能炒股助手用户</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="divide-y divide-gray-100">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="w-full px-4 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Moon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">深色模式</p>
                <p className="text-xs text-gray-500">切换主题配色</p>
              </div>
            </div>
            <div className="w-12 h-6 bg-gray-200 rounded-full relative">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform" />
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">智能炒股助手 v1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">投资有风险，入市需谨慎</p>
        </div>
      </div>
    </div>
  );
}
```

---

### 文件 17: `src/pages/StockDetail.jsx` (新建)

创建 `src/pages/StockDetail.jsx`：

```jsx
import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, TrendingUp, TrendingDown, BarChart2, Activity } from 'lucide-react';
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

export default function StockDetail() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { stocks, addToWatchlist, removeFromWatchlist, isInWatchlist } = useAppStore();
  const [timeRange, setTimeRange] = useState('1M');

  const stock = useMemo(() => code ? getStockByCode(code) : undefined, [code]);
  const kLineData = useMemo(() => code ? generateKLineData(code, 60) : [], [code]);

  if (!stock) {
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

  const inWatchlist = isInWatchlist(stock.code);
  const isPositive = stock.changePercent >= 0;

  const timeRangeDays = {
    '1D': 1,
    '1W': 7,
    '1M': 30,
    '3M': 90,
    '1Y': 365,
  };

  const chartData = kLineData.slice(-timeRangeDays[timeRange]);

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
          <button
            onClick={() => inWatchlist ? removeFromWatchlist(stock.code) : addToWatchlist(stock.code)}
            className="p-2 -mr-2 hover:bg-gray-100 rounded-full"
          >
            <Star className={`w-6 h-6 ${inWatchlist ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
          </button>
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
              {['1D', '1W', '1M', '3M', '1Y'].map((range) => (
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
                  formatter={(value) => [`¥${value.toFixed(2)}`, '价格']}
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
                  formatter={(value) => [`${(value / 10000).toFixed(1)}万`, '成交量']}
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
```

---

### 文件 18: `src/App.jsx` (新建)

最后创建 `src/App.jsx`：

```jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from '@/pages/Home';
import Market from '@/pages/Market';
import Watchlist from '@/pages/Watchlist';
import Profile from '@/pages/Profile';
import StockDetail from '@/pages/StockDetail';
import { BottomNav } from '@/components/BottomNav';

function AppContent() {
  const location = useLocation();
  const showBottomNav = !location.pathname.startsWith('/stock/');

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/market" element={<Market />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/stock/:code" element={<StockDetail />} />
      </Routes>
      {showBottomNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
```

---

## 第三步：运行和部署

1. **保存所有文件**
2. **CodeSandbox 应该会自动刷新并运行**
3. **如果有错误，请检查所有文件是否正确复制**
4. **一旦运行成功，您可以在顶部看到预览链接**
5. **用手机浏览器打开这个链接就可以使用了！**

---

## 🎉 完成！

现在您的智能炒股助手已经成功部署到CodeSandbox了！用手机打开预览链接即可使用，还可以添加到主屏幕哦！
