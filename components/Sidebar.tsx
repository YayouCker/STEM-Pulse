import React from 'react';
import { StemCategory } from '../types';
import { 
  Terminal, 
  Database, 
  Sigma, 
  Atom, 
  FlaskConical, 
  Dna, 
  Rocket, 
  Zap, 
  Newspaper,
  Cpu,
  Sparkles,
  Settings,
  Bookmark
} from 'lucide-react';

interface SidebarProps {
  activeCategory: StemCategory;
  onSelectCategory: (cat: StemCategory) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  onOpenPreferences: () => void;
}

const CATEGORY_CONFIG = [
  { id: StemCategory.MY_FEED, icon: Sparkles, label: 'My Feed', color: 'text-amber-400', glow: 'shadow-[0_0_10px_rgba(251,191,36,0.3)]' },
  { id: StemCategory.LATEST, icon: Newspaper, label: 'Latest News', color: 'text-blue-400', glow: 'shadow-[0_0_10px_rgba(96,165,250,0.3)]' },
  { id: StemCategory.SAVED, icon: Bookmark, label: 'Saved Articles', color: 'text-emerald-400', glow: 'shadow-[0_0_10px_rgba(52,211,153,0.3)]' },
  { type: 'divider' },
  { id: StemCategory.COMPUTER_SCIENCE, icon: Terminal, label: 'Computer Science', color: 'text-green-400' },
  { id: StemCategory.DATA_SCIENCE, icon: Database, label: 'Data Science', color: 'text-purple-400' },
  { id: StemCategory.MATHEMATICS, icon: Sigma, label: 'Mathematics', color: 'text-red-400' },
  { id: StemCategory.PHYSICS, icon: Atom, label: 'Physics', color: 'text-cyan-400' },
  { id: StemCategory.CHEMISTRY, icon: FlaskConical, label: 'Chemistry', color: 'text-yellow-400' },
  { id: StemCategory.BIOLOGY, icon: Dna, label: 'Biology', color: 'text-pink-400' },
  { id: StemCategory.ENGINEERING, icon: Zap, label: 'Engineering', color: 'text-orange-400' },
  { id: StemCategory.SPACE, icon: Rocket, label: 'Space', color: 'text-indigo-400' },
];

const Sidebar: React.FC<SidebarProps> = ({ 
  activeCategory, 
  onSelectCategory, 
  isOpen, 
  toggleSidebar,
  onOpenPreferences
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-30 lg:hidden transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Content */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-dark-950 border-r border-white/5 z-40 transform transition-transform duration-300 ease-out shadow-2xl
        lg:translate-x-0 lg:static flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Area */}
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-900/30">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
                STEM Pulse
              </h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Science Aggregator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
          {CATEGORY_CONFIG.map((item, idx) => {
            if (item.type === 'divider') {
              return <div key={idx} className="h-px bg-white/5 my-4 mx-2" />;
            }
            
            const Icon = item.icon!;
            const isActive = activeCategory === item.id;
            // @ts-ignore
            const glowClass = isActive && item.glow ? item.glow : '';

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectCategory(item.id as StemCategory);
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden
                  ${isActive 
                    ? 'bg-white/5 text-white shadow-inner border border-white/5' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'}
                `}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-full"></div>}
                
                <Icon className={`w-5 h-5 transition-colors relative z-10 ${isActive ? item.color : 'text-slate-600 group-hover:text-slate-400'} ${glowClass}`} />
                <span className="relative z-10">{item.label}</span>
                
                {isActive && (
                   <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-100" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/5 bg-dark-950 space-y-3">
          <button 
            onClick={onOpenPreferences}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-dark-900 hover:bg-dark-800 text-slate-300 rounded-xl text-sm font-medium transition-all border border-white/5 hover:border-white/10 shadow-sm"
          >
            <Settings className="w-4 h-4" />
            Feed Preferences
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;