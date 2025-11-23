import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Article } from '../types';
import { X, Calendar, Clock, ExternalLink } from 'lucide-react';

interface ReaderModalProps {
  article: Article | null;
  onClose: () => void;
}

const ReaderModal: React.FC<ReaderModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 overflow-hidden">
      <div 
        className="absolute inset-0 bg-dark-950/90 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl h-full md:h-[90vh] bg-dark-900 md:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/5 animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/5 bg-dark-900/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
              {article.category}
            </span>
            <span className="text-slate-500 text-sm hidden sm:inline">Focus Mode</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-3xl mx-auto px-6 py-10 md:py-14">
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-slate-400 mb-10 pb-10 border-b border-white/5 font-mono text-sm">
              {article.readTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  {article.readTime}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                {new Date(article.timestamp).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>

            {article.summary && (
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 rounded-2xl border border-white/5 mb-12">
                <h3 className="text-blue-300 font-semibold mb-2 text-sm uppercase tracking-widest">Abstract</h3>
                <p className="text-lg text-slate-200 leading-relaxed italic font-serif">
                  {article.summary}
                </p>
              </div>
            )}

            <div className="markdown-content text-lg text-slate-300">
              <ReactMarkdown>{article.body}</ReactMarkdown>
            </div>

            {article.sourceUrl && (
              <div className="mt-16 pt-8 border-t border-white/5 text-center">
                <a 
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-full text-white font-medium transition-all border border-white/10 hover:border-white/20"
                >
                  Read original source <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReaderModal;