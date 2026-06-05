import { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center max-w-lg text-center"
          >
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 relative">
              <span className="text-4xl absolute">🎬</span>
              <div className="absolute inset-0 border-2 border-dashed border-[#E50914] rounded-full animate-[spin_10s_linear_infinite] opacity-50" />
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tighter drop-shadow-lg">
              Looks like this movie is taking an intermission.
            </h1>
            
            <p className="text-gray-400 text-lg mb-10 max-w-md">
              We've encountered an unexpected error. Don't worry, our crew is already working on getting the screen back up.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 bg-[#E50914] text-white px-8 py-3.5 rounded-full font-bold hover:bg-white hover:text-black transition-all hover:scale-105 shadow-[0_0_20px_rgba(229,9,20,0.4)]"
              >
                <RefreshCw className="w-5 h-5" /> Retry Connection
              </button>
              
              <button 
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center gap-2 bg-black/40 backdrop-blur-md text-white px-8 py-3.5 rounded-full font-bold border border-white/20 hover:bg-white/10 transition-all hover:scale-105"
              >
                <Home className="w-5 h-5" /> Back to Home
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

