import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="relative min-h-screen max-w-[100vw] overflow-x-hidden bg-[#050505] text-white selection:bg-[#E50914]/30 pb-20 md:pb-0">
      <Navbar />
      <main className="w-full">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
