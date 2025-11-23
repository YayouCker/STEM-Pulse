import React from 'react';
import { StemCategory, SUBTOPICS } from '../types';
import { X, Check } from 'lucide-react';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedInterests: string[];
  onToggleInterest: (interest: string) => void;
}

const PreferencesModal: React.FC<PreferencesModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedInterests, 
  onToggleInterest 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-dark-900 border border-dark-700 w-full max-w-2xl rounded-2xl shadow-2xl max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-dark-700 flex justify-between items-center bg-dark-800/50 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-white">Personalize Your Feed</h2>
            <p className="text-sm text-slate-400 mt-1">Select topics to prioritize in "My Feed"</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-dark-700 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="space-y-8">
            {Object.entries(SUBTOPICS).map(([category, topics]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3 px-1">
                  {category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {topics.map((topic) => {
                    const isSelected = selectedInterests.includes(topic);
                    return (
                      <button
                        key={topic}
                        onClick={() => onToggleInterest(topic)}
                        className={`
                          flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all border
                          ${isSelected 
                            ? 'bg-blue-600/20 border-blue-500/50 text-blue-200' 
                            : 'bg-dark-800 border-dark-700 text-slate-400 hover:border-dark-600 hover:bg-dark-700'}
                        `}
                      >
                        <span>{topic}</span>
                        {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-dark-700 bg-dark-800/50 rounded-b-2xl flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesModal;
