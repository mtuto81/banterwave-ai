
import React from 'react';
import { X, FileText, Code, FileImage } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContextWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContextWindow: React.FC<ContextWindowProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = React.useState<'context' | 'code' | 'document'>('context');
  
  return (
    <div 
      className={cn(
        "fixed right-0 top-0 h-full w-80 bg-background border-l border-border shadow-lg transition-transform duration-300 z-20",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex space-x-2">
          <button 
            className={cn(
              "px-3 py-1 text-xs rounded-md transition-colors",
              activeTab === 'context' ? "bg-primary text-primary-foreground" : "hover:bg-secondary/50"
            )}
            onClick={() => setActiveTab('context')}
          >
            <span className="flex items-center">
              <FileText size={14} className="mr-1" />
              Context
            </span>
          </button>
          
          <button 
            className={cn(
              "px-3 py-1 text-xs rounded-md transition-colors",
              activeTab === 'code' ? "bg-primary text-primary-foreground" : "hover:bg-secondary/50"
            )}
            onClick={() => setActiveTab('code')}
          >
            <span className="flex items-center">
              <Code size={14} className="mr-1" />
              Code
            </span>
          </button>
          
          <button 
            className={cn(
              "px-3 py-1 text-xs rounded-md transition-colors",
              activeTab === 'document' ? "bg-primary text-primary-foreground" : "hover:bg-secondary/50"
            )}
            onClick={() => setActiveTab('document')}
          >
            <span className="flex items-center">
              <FileImage size={14} className="mr-1" />
              Document
            </span>
          </button>
        </div>
        
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-secondary/80 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="p-4 overflow-y-auto h-[calc(100%-4rem)]">
        {activeTab === 'context' && (
          <div className="prose prose-sm dark:prose-invert">
            <h3>Chat Context</h3>
            <p>This panel shows relevant context for the current conversation.</p>
            <p>You can use this area to display additional information that helps with the current chat.</p>
          </div>
        )}
        
        {activeTab === 'code' && (
          <div className="prose prose-sm dark:prose-invert">
            <h3>Code Preview</h3>
            <pre className="bg-secondary/30 p-3 rounded-md overflow-x-auto">
              <code>{`function example() {
  // This is a code preview area
  // Useful for showing code snippets
  console.log("Hello, world!");
}`}</code>
            </pre>
          </div>
        )}
        
        {activeTab === 'document' && (
          <div className="prose prose-sm dark:prose-invert">
            <h3>Document Preview</h3>
            <p>This area can display document previews, PDFs, or other reference materials.</p>
            <div className="bg-secondary/30 p-4 rounded-md italic text-muted-foreground text-center">
              Document preview placeholder
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContextWindow;
