
import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, TrendingUp, TrendingDown, Zap, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store';
import { StockCard } from '@/components/StockCard';
import { getAIResponse } from '@/utils/mockData';

export default function Home() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    stocks,
    messages,
    addMessage,
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
