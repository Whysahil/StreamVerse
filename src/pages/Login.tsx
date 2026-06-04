import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  auth
} from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

export function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setError('Firebase is not configured. Add environment variables.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
      setError('Firebase is not configured. Add environment variables.');
      return;
    }
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="relative flex h-screen w-screen flex-col bg-[#050505] md:items-center md:justify-center md:bg-transparent overflow-hidden object-contain"
    >
      <div 
         className="absolute inset-0 bg-cover bg-center"
         style={{
           backgroundImage: "url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')",
         }}
      >
        <div className="absolute inset-0 bg-black/60 sm:bg-black/40 md:bg-black/60 custom-gradient-overlay mix-blend-overlay" />
      </div>
      
      <header className="absolute top-0 w-full px-6 py-6 md:px-12 z-20 flex justify-between items-center">
        <h1 className="text-[#E50914] font-black text-3xl md:text-5xl cursor-pointer tracking-tighter">FLIX.</h1>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-md rounded-xl glass px-6 py-12 md:px-16 md:py-16 mt-20 md:mt-0 shadow-2xl">
        <h2 className="text-3xl font-extrabold mb-8 text-white">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        
        {error && <p className="mb-4 text-[#E50914] text-sm bg-[#E50914]/10 p-3 rounded font-medium border border-[#E50914]/20">{error}</p>}
        
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3.5 text-white placeholder-gray-400 outline-none focus:bg-black/60 focus:ring-1 focus:ring-white transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3.5 text-white placeholder-gray-400 outline-none focus:bg-black/60 focus:ring-1 focus:ring-white transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#E50914] py-3.5 font-bold text-white mt-4 hover:bg-[#c10710] transition flex justify-center items-center shadow-lg hover:shadow-red-900/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
          <input type="checkbox" id="remember" className="rounded bg-gray-700 border-none accent-gray-500 w-4 h-4" />
          <label htmlFor="remember">Remember me</label>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full rounded-md glass font-bold text-white hover:bg-white/10 transition mt-8 flex justify-center items-center gap-3 py-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        <p className="mt-6 text-gray-400 font-medium text-sm">
          {isSignUp ? 'Already have an account?' : 'New to Netflix?'}
          <button 
            type="button"
             onClick={() => setIsSignUp(!isSignUp)}
             className="ml-2 text-white hover:underline font-bold"
          >
            {isSignUp ? 'Sign in now.' : 'Sign up now.'}
          </button>
        </p>
      </div>
    </div>
  );
}
