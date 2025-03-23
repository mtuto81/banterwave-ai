
import React from 'react';
import { useChat } from '@/context/ChatContext';
import { RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Header: React.FC = () => {
  const { resetChat, selectedModel } = useChat();
  const { toast } = useToast();
  
  return (
    <header className="w-full glass-panel backdrop-blur-md sticky top-0 z-10 py-4 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        <h1 className="text-xl font-bold">Synai</h1>
        <span className="text-xs bg-primary/10 text-primary-foreground/80 px-2 py-0.5 rounded-full">
          {selectedModel.name}
        </span>
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={resetChat}
          className="p-2 rounded-full hover:bg-secondary/80 transition-colors duration-200"
          aria-label="Reset chat"
        >
          <RotateCcw size={18} className="text-foreground/80" />
        </button>
      </div>
    </header>
  );
};

export default Header;
