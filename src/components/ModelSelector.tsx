
import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { useChat, ModelType } from '@/context/ChatContext';
import { cn } from '@/lib/utils';

const ModelSelector: React.FC = () => {
  const { selectedModel, setSelectedModel, availableModels } = useChat();
  const [isOpen, setIsOpen] = useState(false);

  const handleModelSelect = (model: ModelType) => {
    setSelectedModel(model);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="flex items-center space-x-1 text-xs px-2 py-1 rounded-lg hover:bg-secondary/50 transition-colors"
        aria-label="Select model"
      >
        <span className="max-w-[80px] truncate">{selectedModel.name}</span>
        <ChevronDown size={14} className={cn("transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 w-48 bg-background/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden z-50 border border-border">
          <div className="py-1">
            {availableModels.map((model) => (
              <button
                key={model.id}
                className={cn(
                  "w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-secondary/20 transition-colors",
                  selectedModel.id === model.id && "bg-secondary/30"
                )}
                onClick={() => handleModelSelect(model)}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{model.name}</span>
                  <span className="text-muted-foreground text-[10px] mt-0.5 line-clamp-1">
                    {model.description}
                  </span>
                </div>
                {selectedModel.id === model.id && <Check size={14} className="text-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
