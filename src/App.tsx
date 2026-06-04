import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useFirebaseAuth } from '@/store/useAuthStore';
import { PrivateRoute } from '@/components/layout/PrivateRoute';
import { ProfileRoute } from '@/components/layout/ProfileRoute';
import { Layout } from '@/components/layout/Layout';

const Home = lazy(() => import('@/pages/Home').then(module => ({ default: module.Home })));
const Series = lazy(() => import('@/pages/Series').then(module => ({ default: module.Series })));
const Films = lazy(() => import('@/pages/Films').then(module => ({ default: module.Films })));
const Login = lazy(() => import('@/pages/Login').then(module => ({ default: module.Login })));
const MyList = lazy(() => import('@/pages/MyList').then(module => ({ default: module.MyList })));
const MovieDetails = lazy(() => import('@/pages/MovieDetails').then(module => ({ default: module.MovieDetails })));
const Search = lazy(() => import('@/pages/Search').then(module => ({ default: module.Search })));
const Player = lazy(() => import('@/pages/Player').then(module => ({ default: module.Player })));
const Profiles = lazy(() => import('@/pages/Profiles').then(module => ({ default: module.Profiles })));

// A simple loading fallback for Suspense
function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#141414] overflow-hidden">
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
            <Route path="/profiles" element={<Profiles />} />
            <Route element={<ProfileRoute />}>
              <Route path="/play/:type/:id" element={<Player />} />
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/series" element={<Series />} />
                <Route path="/films" element={<Films />} />
                <Route path="/my-list" element={<MyList />} />
                <Route path="/movie/:type/:id" element={<MovieDetails />} />
                <Route path="/search" element={<Search />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

