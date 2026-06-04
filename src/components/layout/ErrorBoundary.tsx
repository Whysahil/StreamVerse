import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white p-4 text-center">
          <AlertCircle className="w-16 h-16 text-[#E50914] mb-4" />
          <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
          <p className="text-gray-400 max-w-md mb-8">
            An unexpected error occurred in the application. Our team has been notified.
          </p>
          <button 
            className="px-6 py-2 bg-[#E50914] rounded-md font-medium hover:bg-[#E50914]/90 transition"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
