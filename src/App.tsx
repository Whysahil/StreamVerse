import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useFirebaseAuth } from '@/store/useAuthStore';
import { PrivateRoute } from '@/components/layout/PrivateRoute';
import { Layout } from '@/components/layout/Layout';

const Home = lazy(() => import('@/pages/Home').then(module => ({ default: module.Home })));
const Login = lazy(() => import('@/pages/Login').then(module => ({ default: module.Login })));
const MyList = lazy(() => import('@/pages/MyList').then(module => ({ default: module.MyList })));
const MovieDetails = lazy(() => import('@/pages/MovieDetails').then(module => ({ default: module.MovieDetails })));
const Search = lazy(() => import('@/pages/Search').then(module => ({ default: module.Search })));
const Player = lazy(() => import('@/pages/Player').then(module => ({ default: module.Player })));

// A simple loading fallback for Suspense
function PageLoader() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#141414]">
      <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[#E50914] animate-spin" />
    </div>
  );
}

export default function App() {
  // Initialize Firebase Auth listener
  useFirebaseAuth();

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<PrivateRoute />}>
            <Route path="/play/:type/:id" element={<Player />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/my-list" element={<MyList />} />
              <Route path="/movie/:type/:id" element={<MovieDetails />} />
              <Route path="/search" element={<Search />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

