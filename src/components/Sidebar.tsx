import React from 'react';
import {
  LayoutDashboard,
  KeyRound,
  Compass,
  Users2,
  Sparkles,
  GitCompare,
  BookmarkCheck,
  History,
  CreditCard,
  UserCheck,
  HelpCircle,
  ShieldCheck,
  FileText,
  X,
  BookOpenCheck
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: User;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  savedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  isOpenMobile,
  onCloseMobile,
  savedCount
}) => {
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'keywords', label: 'Keyword Research', icon: KeyRound },
    { id: 'niches', label: 'Niche Research', icon: Compass },
    { id: 'competitors', label: 'Competitor Research', icon: Users2 },
    { id: 'opportunity-finder', label: 'Opportunity Finder', icon: Sparkles, highlight: true },
    { id: 'compare-opportunities', label: 'Compare Opportunities', icon: GitCompare },
    { id: 'compare-competitors', label: 'Compare Competitors', icon: BookOpenCheck },
    { id: 'opportunity-report', label: 'Opportunity Report', icon: FileText },
  ];

  const secondaryNavItems = [
    { id: 'saved-research', label: 'Saved Research', icon: BookmarkCheck, count: savedCount },
    { id: 'history', label: 'Research History', icon: History },
    { id: 'pricing', label: 'Pricing & Plans', icon: CreditCard },
    { id: 'account', label: 'Account & Usage', icon: UserCheck },
    { id: 'help', label: 'Help & Principles', icon: HelpCircle },
  ];

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          id="mobile-sidebar-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-desktop-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <button
            id="brand-logo-btn"
            onClick={() => handleItemClick('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black text-base shadow-sm group-hover:bg-amber-400 transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight text-sm block leading-none">
                KDP Digger
              </span>
              <span className="text-[10px] text-amber-400 font-semibold tracking-wide uppercase mt-0.5 block">
                Dig Deeper &middot; Validate
              </span>
            </div>
          </button>

          <button
            onClick={onCloseMobile}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Research Tools */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Research & Validation
            </div>
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                        : item.highlight
                        ? 'text-amber-300 hover:bg-slate-800/80 hover:text-amber-200'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                    {item.highlight && !isActive && (
                      <span className="ml-auto text-[9px] uppercase tracking-wide bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                        Hot
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Library & Settings */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Workspace & Plans
            </div>
            <nav className="space-y-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.count !== undefined && item.count > 0 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-slate-900 text-amber-400' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Admin Panel Link */}
              {currentUser.role === 'admin' && (
                <button
                  id="nav-item-admin"
                  onClick={() => handleItemClick('admin')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors mt-2 ${
                    activeTab === 'admin'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-indigo-300 hover:bg-indigo-950/50 hover:text-indigo-200'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-indigo-400" />
                    <span>Admin Panel</span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider bg-indigo-500/30 text-indigo-200 px-1.5 py-0.5 rounded font-bold">
                    Staff
                  </span>
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Footer Credits Banner */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/60">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-300">Research Credits</span>
              <span className="text-xs font-extrabold text-amber-400">{currentUser.credits} left</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight mb-2">
              Plan: <strong className="text-slate-200">{currentUser.plan}</strong>
            </p>
            <button
              id="sidebar-upgrade-btn"
              onClick={() => handleItemClick('pricing')}
              className="w-full py-1.5 px-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-xs font-bold text-center transition-colors block shadow-xs"
            >
              Get More Credits ($1-$3)
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
