import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ArticleView from './components/ArticleView';
import PreferencesModal from './components/PreferencesModal';
import ReaderModal from './components/ReaderModal';
import { StemCategory, NewsResponse, Article } from './types';
import { fetchStemNews } from './services/gemini';
import { Menu, Search, AlertCircle, Cpu } from 'lucide-react';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<StemCategory>(StemCategory.LATEST);
  const [newsData, setNewsData] = useState<NewsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Personalization & Bookmarks
  const [isPrefsOpen, setIsPrefsOpen] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  
  // Reader Mode
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);

  // Load Saved Articles from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('stem_pulse_bookmarks');
    if (saved) {
      try {
        setSavedArticles(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved articles", e);
      }
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadNews(StemCategory.LATEST);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNews = async (category: StemCategory, query?: string) => {
    setLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Handle Saved Articles View
    if (category === StemCategory.SAVED) {
      setNewsData({
        articles: savedArticles,
        sources: [], 
        timestamp: new Date(),
        category: 'Saved Articles'
      });
      setLoading(false);
      return;
    }

    try {
      const data = await fetchStemNews(category, query, selectedInterests);
      setNewsData(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: StemCategory) => {
    setActiveCategory(category);
    setSearchQuery(''); 
    loadNews(category);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      loadNews(activeCategory === StemCategory.SAVED ? StemCategory.LATEST : activeCategory, searchQuery);
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    loadNews(activeCategory === StemCategory.SAVED ? StemCategory.LATEST : activeCategory, tag);
  };
  
  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleBookmark = (article: Article) => {
    setSavedArticles(prev => {
      const exists = prev.find(a => a.title === article.title); 
      let newSaved;
      if (exists) {
        newSaved = prev.filter(a => a.title !== article.title);
      } else {
        newSaved = [article, ...prev];
      }
      localStorage.setItem('stem_pulse_bookmarks', JSON.stringify(newSaved));
      
      if (activeCategory === StemCategory.SAVED) {
        setNewsData(prevData => prevData ? ({
           ...prevData,
           articles: newSaved
        }) : null);
      }
      return newSaved;
    });
  };

  return (
    <div className="min-h-screen font-sans selection:bg-blue-500/30 text-slate-200">
      
      <div className="flex h-screen overflow-hidden">
        <Sidebar 
          activeCategory={activeCategory} 
          onSelectCategory={handleCategoryChange} 
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenPreferences={() => setIsPrefsOpen(true)}
        />

        <main className="flex-1 flex flex-col h-full relative overflow-hidden">
          
          <header className="h-20 bg-dark-900/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 lg:px-8 z-20 sticky top-0 shadow-sm">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 lg:hidden transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="lg:hidden flex items-center gap-2">
                 <div className="p-1.5 bg-blue-600 rounded-lg">
                    <Cpu className="w-4 h-4 text-white" />
                 </div>
                 <h2 className="font-bold text-slate-100 truncate text-sm">STEM Pulse</h2>
              </div>
            </div>

            <form onSubmit={handleSearch} className="flex-1 max-w-lg ml-4 lg:ml-0 relative group">
              <input
                type="text"
                placeholder="Search quantum physics, CRISPR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-950/50 text-sm text-white border border-white/10 rounded-full pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-400 transition-colors" />
            </form>
          </header>

          <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
            <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
              
              {error && (
                <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-950/30 border border-red-500/30 rounded-xl flex items-start gap-4 text-red-200 animate-fade-in">
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-400" />
                  <div>
                    <h3 className="font-semibold text-red-100">Connection Error</h3>
                    <p className="text-sm opacity-80 mt-1">{error}</p>
                    <button 
                      onClick={() => loadNews(activeCategory, searchQuery)}
                      className="mt-4 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all"
                    >
                      Retry Connection
                    </button>
                  </div>
                </div>
              )}

              <ArticleView 
                news={newsData} 
                loading={loading} 
                onRefresh={() => loadNews(activeCategory, searchQuery)}
                savedArticleIds={savedArticles.map(a => a.id)}
                onToggleBookmark={toggleBookmark}
                onOpenReader={setReadingArticle}
                onTagClick={handleTagClick}
              />

            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <PreferencesModal 
        isOpen={isPrefsOpen}
        onClose={() => setIsPrefsOpen(false)}
        selectedInterests={selectedInterests}
        onToggleInterest={toggleInterest}
      />

      {readingArticle && (
        <ReaderModal 
          article={readingArticle} 
          onClose={() => setReadingArticle(null)} 
        />
      )}
    </div>
  );
};

export default App;