
import React from 'react';
import { useChat } from '@/context/ChatContext';
import { RotateCcw } from 'lucide-react';

const Header: React.FC = () => {
  const { resetChat } = useChat();
  
  return (
    <header className="w-full glass-panel backdrop-blur-md sticky top-0 z-10 py-4 px-6 mb-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        <h1 className="text-xl font-medium">AI Chat</h1>
      </div>
      
      <button
        onClick={resetChat}
        className="p-2 rounded-full hover:bg-secondary/80 transition-colors duration-200"
        aria-label="Reset chat"
      >
        <RotateCcw size={18} className="text-foreground/80" />
      </button>
    </header>
  );
};

export default Header;
