
import React from 'react';
import { cn } from '@/lib/utils';

const LoadingDots: React.FC = () => {
  return (
    <div className="flex items-center justify-start space-x-1.5 px-4 py-3 glass-panel rounded-2xl rounded-tl-sm my-4 shadow-sm max-w-min">
      <div className="w-2 h-2 rounded-full bg-foreground/80 animate-loading-dot-1"></div>
      <div className="w-2 h-2 rounded-full bg-foreground/80 animate-loading-dot-2"></div>
      <div className="w-2 h-2 rounded-full bg-foreground/80 animate-loading-dot-3"></div>
    </div>
  );
};

export default LoadingDots;
