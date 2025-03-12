
import React from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { RotateCcw, LogOut, LogIn } from 'lucide-react';
import ModelSelector from './ModelSelector';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Header: React.FC = () => {
  const { resetChat, selectedModel } = useChat();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully"
    });
    navigate('/auth');
  };

  const handleSignIn = () => {
    navigate('/auth');
  };
  
  return (
    <header className="w-full glass-panel backdrop-blur-md sticky top-0 z-10 py-4 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        <h1 className="text-xl font-bold">Synai</h1>
        <span className="text-xs bg-primary/10 text-primary-foreground/80 px-2 py-0.5 rounded-full">
          {selectedModel.name}
        </span>
      </div>
      
      <div className="flex items-center space-x-3">
        {user && (
          <span className="text-sm text-foreground/70">
            {user.email}
          </span>
        )}
        
        <button
          onClick={resetChat}
          className="p-2 rounded-full hover:bg-secondary/80 transition-colors duration-200"
          aria-label="Reset chat"
        >
          <RotateCcw size={18} className="text-foreground/80" />
        </button>
        
        {user ? (
          <button
            onClick={handleSignOut}
            className="p-2 rounded-full hover:bg-secondary/80 transition-colors duration-200"
            aria-label="Sign out"
          >
            <LogOut size={18} className="text-foreground/80" />
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            className="p-2 rounded-full hover:bg-secondary/80 transition-colors duration-200"
            aria-label="Sign in"
          >
            <LogIn size={18} className="text-foreground/80" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
