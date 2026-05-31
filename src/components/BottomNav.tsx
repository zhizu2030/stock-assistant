
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

