import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, User as UserIcon, LogOut } from 'lucide-react';
import { auth, signOut } from '@/lib/firebase';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
import { useListStore } from '@/store/useListStore';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { myList } = useListStore();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) setIsScrolled(true);
      else setIsScrolled(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth!);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 px-4 md:px-12 h-16 md:h-20 flex items-center justify-between",
      isScrolled ? "bg-[#050505]/95 backdrop-blur-md border-b border-white/5 shadow-md" : "bg-gradient-to-b from-black/90 to-transparent"
    )}>
      <div className="flex items-center gap-8 md:gap-10">
        <Link to="/" className="text-[#E50914] font-black text-3xl md:text-4xl tracking-tighter hover:scale-105 transition-transform select-none">
          FLIX.
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
          <Link to="/" className="text-white hover:text-white transition-colors">Home</Link>
          <Link to="/" className="hover:text-white transition-colors">TV Shows</Link>
          <Link to="/" className="hover:text-white transition-colors">Movies</Link>
          <Link to="/my-list" className="hover:text-white transition-colors relative">
            My List
            {myList.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#E50914] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {myList.length}
              </span>
            )}
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className={cn("flex items-center transition-all duration-300", showSearch ? "bg-black/60 border border-white/30 rounded px-2 py-1" : "")}>
            <button type="button" onClick={() => setShowSearch(!showSearch)} className="p-1">
              <Search className="w-5 h-5 text-white" />
            </button>
            {showSearch && (
              <input
                type="text"
                placeholder="Titles, people, genres"
                className="bg-transparent text-sm text-white placeholder-gray-400 outline-none w-32 md:w-56 px-2 py-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            )}
          </form>
        </div>
        
        <Bell className="w-5 h-5 text-white hidden md:block cursor-pointer" />
        
        {user ? (
          <div className="relative" onMouseEnter={() => setShowProfileMenu(true)} onMouseLeave={() => setShowProfileMenu(false)}>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded bg-gradient-to-tr from-blue-600 to-purple-500 border border-white/20 flex items-center justify-center overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
            
            {showProfileMenu && (
              <div className="absolute top-8 right-0 pt-4 w-48 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="bg-black/90 border border-white/10 rounded overflow-hidden flex flex-col">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-medium truncate">{user.displayName || 'Guest'}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 text-sm hover:underline hover:bg-white/5 transition-colors text-left">
                    <LogOut className="w-4 h-4" /> Sign out of Netflix
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="bg-netflix hover:bg-netflix-hover text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
