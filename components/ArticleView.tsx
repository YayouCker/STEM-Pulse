import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { GroundingSource, NewsResponse, Article } from '../types';
import { 
  ExternalLink, 
  Calendar, 
  Search, 
  RefreshCw, 
  Bookmark, 
  Share2, 
  Clock, 
  Tag as TagIcon,
  Check,
  Maximize2,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';

interface ArticleViewProps {
  news: NewsResponse | null;
  loading: boolean;
  onRefresh: () => void;
  savedArticleIds: string[];
  onToggleBookmark: (article: Article) => void;
  onOpenReader: (article: Article) => void;
  onTagClick: (tag: string) => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ 
  news, 
  loading, 
  onRefresh,
  savedArticleIds,
  onToggleBookmark,
  onOpenReader,
  onTagClick
}) => {
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const handleShare = async (article: Article) => {
    const shareData = {
      title: article.title,
      text: `${article.title}\n\n${article.summary}`,
      url: article.sourceUrl || window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(`${article.title} - ${article.summary}`);
      // Toast notification could go here
    }
  };

  const toggleSpeech = (article: Article) => {
    if (speakingId === article.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${article.title}. Summary: ${article.summary}`);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onend = () => setSpeakingId(null);
      setSpeakingId(article.id);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse p-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-dark-900/50 rounded-2xl p-8 border border-white/5 space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-3 w-3/4">
                <div className="h-4 bg-dark-700/50 rounded w-1/4"></div>
                <div className="h-8 bg-dark-700/50 rounded w-3/4"></div>
              </div>
              <div className="h-8 w-8 bg-dark-700/50 rounded-full"></div>
            </div>
            <div className="h-24 bg-dark-800/50 rounded-xl w-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-dark-700/30 rounded w-full"></div>
              <div className="h-4 bg-dark-700/30 rounded w-full"></div>
              <div className="h-4 bg-dark-700/30 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!news || news.articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 p-4 text-center animate-fade-in">
        <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/5">
           <Search className="w-10 h-10 opacity-50 text-blue-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-200 mb-3">No Articles Found</h3>
        <p className="max-w-md text-slate-500 mb-8">
          We couldn't find any recent stories for this topic. Try checking your saved articles or refresh the feed.
        </p>
        <button 
              onClick={onRefresh}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Feed
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header Info */}
      <div className="mb-10 px-4 animate-slide-up">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 tracking-tight">
            {news.category}
          </h2>
          <div className="flex items-center gap-4 text-slate-400 text-sm font-mono bg-dark-800/50 px-4 py-2 rounded-full border border-white/5">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              {new Date(news.timestamp).toLocaleDateString()}
            </span>
            {news.category !== 'Saved Articles' && (
              <>
                <span className="w-px h-4 bg-white/10"></span>
                <button 
                  onClick={onRefresh}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Update
                </button>
              </>
            )}
          </div>
        </div>
        <div className="h-1 w-full max-w-[100px] bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full opacity-80"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-8">
          {news.articles.map((article, idx) => {
            const isBookmarked = savedArticleIds.includes(article.id);
            const isSpeaking = speakingId === article.id;
            
            return (
              <article 
                key={article.id} 
                className="group relative bg-dark-800/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] animate-slide-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Decorative sheen */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="p-6 md:p-8 relative">
                   {/* Top Meta */}
                   <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                     <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-slate-800 text-slate-300 border border-white/10 shadow-sm">
                       {article.category}
                     </span>
                     
                     <div className="flex items-center gap-1">
                        <button 
                          onClick={() => toggleSpeech(article)}
                          className={`p-2 rounded-full transition-all duration-300 ${
                            isSpeaking 
                              ? 'text-emerald-400 bg-emerald-500/10 animate-pulse-slow' 
                              : 'text-slate-400 hover:text-emerald-400 hover:bg-dark-700/50'
                          }`}
                          title="Read Summary Aloud"
                        >
                          {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>

                        <button 
                          onClick={() => onOpenReader(article)}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-dark-700/50 rounded-full transition-colors"
                          title="Focus Mode"
                        >
                          <Maximize2 className="w-5 h-5" />
                        </button>

                        <button 
                          onClick={() => handleShare(article)}
                          className="p-2 text-slate-400 hover:text-purple-400 hover:bg-dark-700/50 rounded-full transition-colors"
                          title="Share"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                        
                        <button 
                          onClick={() => onToggleBookmark(article)}
                          className={`p-2 rounded-full transition-colors ${
                            isBookmarked 
                              ? 'text-amber-400 bg-amber-400/10' 
                              : 'text-slate-400 hover:text-amber-400 hover:bg-dark-700/50'
                          }`}
                          title={isBookmarked ? "Remove from Saved" : "Save for Later"}
                        >
                          {isBookmarked ? <Check className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                        </button>
                     </div>
                   </div>

                   {/* Title */}
                   <h3 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4 leading-tight group-hover:text-blue-200 transition-colors cursor-pointer" onClick={() => onOpenReader(article)}>
                     {article.title}
                   </h3>
                   
                   {/* Tags & Time */}
                   <div className="flex flex-wrap gap-3 text-xs text-slate-400 mb-6 items-center font-mono">
                      <span className="flex items-center gap-1.5 bg-dark-900/80 px-2.5 py-1.5 rounded-md border border-white/5">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        {article.readTime}
                      </span>
                      {article.tags.map(tag => (
                        <button 
                          key={tag} 
                          onClick={(e) => { e.stopPropagation(); onTagClick(tag); }}
                          className="flex items-center gap-1 hover:text-blue-300 hover:bg-blue-500/10 px-2 py-1 rounded transition-colors"
                        >
                          <TagIcon className="w-3 h-3 opacity-70" />
                          {tag}
                        </button>
                      ))}
                   </div>
                   
                   {/* Summary Box */}
                   {article.summary && (
                     <div className="relative overflow-hidden bg-dark-900/40 p-5 rounded-xl border border-white/5 mb-6 group-hover:border-blue-500/20 transition-colors">
                       <div className="flex items-start gap-3">
                         <Sparkles className="w-5 h-5 text-blue-400 mt-1 shrink-0" />
                         <p className="text-slate-300 text-sm leading-relaxed italic">
                           {article.summary}
                         </p>
                       </div>
                     </div>
                   )}

                   {/* Preview Body */}
                   <div className="markdown-content text-slate-400 text-sm line-clamp-3 mb-4">
                      <ReactMarkdown 
                          components={{
                            p: ({node, ...props}) => <p {...props} className="mb-0" />
                          }}
                      >
                        {article.body}
                      </ReactMarkdown>
                   </div>
                    
                   <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <button 
                        onClick={() => onOpenReader(article)}
                        className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                      >
                        Continue Reading
                      </button>

                      {article.sourceUrl && (
                        <a 
                          href={article.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          Source <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                   </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Sidebar: Sources & Metadata */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24">
            
            {news.sources.length > 0 && (
              <div className="bg-dark-800/40 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden mb-6 animate-fade-in delay-100">
                <div className="bg-white/5 p-4 border-b border-white/5 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-emerald-400" />
                    References
                  </h3>
                  <span className="text-xs bg-dark-900 px-2 py-1 rounded-full text-slate-400 border border-white/5">{news.sources.length}</span>
                </div>
                <div className="p-3 max-h-[40vh] overflow-y-auto custom-scrollbar space-y-2">
                    {news.sources.map((source, index) => (
                      <a 
                        key={index}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 p-3 rounded-xl bg-dark-900/40 hover:bg-dark-700/50 border border-transparent hover:border-slate-600 transition-all group"
                      >
                         <div className="mt-1 min-w-[16px]">
                           <img 
                              src={`https://www.google.com/s2/favicons?domain=${new URL(source.uri).hostname}&sz=32`}
                              alt=""
                              className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                         </div>
                         <div>
                            <h4 className="text-xs font-medium text-slate-300 group-hover:text-blue-300 line-clamp-2 leading-relaxed">
                              {source.title || source.uri}
                            </h4>
                            <p className="text-[10px] text-slate-500 mt-1 font-mono">
                              {new URL(source.uri).hostname.replace('www.', '')}
                            </p>
                         </div>
                      </a>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleView;