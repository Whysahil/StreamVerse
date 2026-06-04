import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Film, Tv, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useListStore } from '@/store/useListStore';

export function BottomNav() {
  const location = useLocation();
  const { myList } = useListStore();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Tv, label: 'Series', path: '/series' },
    { icon: Film, label: 'Films', path: '/films' },
    { icon: Plus, label: 'My List', path: '/my-list', count: myList.length },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#050505]/95 backdrop-blur-md border-t border-white/10 z-50 pb-4 pt-1">
      <div className="flex justify-around items-center h-14">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.label}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative",
                isActive ? "text-white" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "fill-current")} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.count ? (
                <span className="absolute top-0 right-[20%] bg-[#E50914] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {item.count > 99 ? '99+' : item.count}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
