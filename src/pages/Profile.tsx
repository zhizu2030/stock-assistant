
import { User, Bell, Settings, HelpCircle, Info, Trash2, Moon } from 'lucide-react';

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

