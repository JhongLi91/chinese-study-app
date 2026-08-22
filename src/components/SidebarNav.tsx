import React from 'react';
import type { ActiveTab, StudyStats } from '../types';
import { Badge } from './ui/badge';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Database,
  Keyboard,
  Layers,
  ScrollText,
  Volume2,
  VolumeX,
  Zap,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { playSound } from '../utils/audio';

interface SidebarNavProps {
  activePage: ActiveTab;
  onSelectPage: (page: ActiveTab) => void;
  stats: StudyStats;
  masteryPercent: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenDbModal: () => void;
  onOpenVimModal: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activePage,
  onSelectPage,
  stats,
  masteryPercent,
  isCollapsed,
  onToggleCollapse,
  onOpenDbModal,
  onOpenVimModal,
  soundOn,
  onToggleSound,
  isMobileOpen,
  onCloseMobile,
}) => {
  const handleNavClick = (page: ActiveTab) => {
    playSound('click');
    onSelectPage(page);
    onCloseMobile();
  };

  const studyPages: {
    id: ActiveTab;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeVariant?: 'default' | 'secondary' | 'learned' | 'inProgress' | 'hsk' | 'outline';
  }[] = [
      {
        id: 'lessons',
        label: 'Lessons Curriculum',
        icon: BookOpen,
        badge: '120',
        badgeVariant: 'secondary',
      },
      {
        id: 'learned',
        label: 'Learned Words',
        icon: CheckCircle2,
        badge: stats.learned,
        badgeVariant: 'learned',
      },
      {
        id: 'in-progress',
        label: 'In-Progress Words',
        icon: Clock,
        badge: stats.in_progress,
        badgeVariant: 'inProgress',
      },
      {
        id: 'all',
        label: 'All 3,000 Hanzi',
        icon: Layers,
        badge: '3,000',
        badgeVariant: 'secondary',
      },
    ];

  // Render Full Expanded Sidebar View
  const renderExpandedContent = () => (
    <div className="flex flex-col h-full bg-[slate-950] border-r border-slate-800/80 text-slate-200">
      {/* Brand & App Title Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-slate-950 font-serif font-bold text-2xl shadow-md shadow-sky-500/20 shrink-0">
            学
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-slate-100 tracking-tight">
                中文
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              3,000 Characters
            </span>
          </div>
        </div>

        {/* Desktop Collapse Toggle Button */}
        <button
          type="button"
          onClick={() => {
            playSound('click');
            onToggleCollapse();
          }}
          className="hidden md:flex p-1.5 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-800 transition-colors"
          title="Collapse Sidebar"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="md:hidden p-1.5 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-800"
          title="Close Menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-6">
        {/* Main Pages Navigation */}
        <div className="flex flex-col gap-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Study Pages
          </div>
          {studyPages.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all group ${isActive
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive
                      ? 'text-sky-400'
                      : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && (
                    <Badge
                      variant={item.badgeVariant ?? 'secondary'}
                      className="text-[10px] px-1.5 py-0 font-mono"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Practice & Games */}
        <div className="flex flex-col gap-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Practice & Games
          </div>

          {/* Story Reader Page Link */}
          <button
            type="button"
            onClick={() => handleNavClick('stories')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all group ${activePage === 'stories'
              ? 'bg-gradient-to-r from-sky-500/20 to-emerald-500/20 text-sky-300 border border-sky-500/40 shadow-sm font-bold'
              : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
              }`}
          >
            <div className="flex items-center gap-3">
              <ScrollText
                className={`w-4 h-4 transition-transform group-hover:scale-110 ${activePage === 'stories' ? 'text-sky-300' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
              />
              <span>Story Reader</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Badge variant="hsk" className="text-[10px] px-1.5 py-0 font-mono">
                HSK 3+
              </Badge>
            </div>
          </button>

          {/* Word Match Page Link */}
          <button
            type="button"
            onClick={() => handleNavClick('word-match')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all group mt-0.5 ${activePage === 'word-match'
              ? 'bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-300 border border-amber-500/40 shadow-sm font-bold'
              : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
              }`}
          >
            <div className="flex items-center gap-3">
              <Zap
                className={`w-4 h-4 transition-transform group-hover:scale-110 ${activePage === 'word-match' ? 'text-amber-300 fill-current' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
              />
              <span>Word Match (组词)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono border-amber-500/30 text-amber-300">
                Game
              </Badge>
            </div>
          </button>
        </div>

        {/* Overall Mastery Card */}
        <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-2xl flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Overall Mastery
            </span>
            <span className="text-xs font-mono font-bold text-sky-400">
              {masteryPercent}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
            <div
              className="bg-emerald-500 transition-all duration-500"
              style={{ width: `${(stats.learned / 3000) * 100}%` }}
              title={`Learned: ${stats.learned}`}
            />
            <div
              className="bg-amber-500 transition-all duration-500"
              style={{ width: `${(stats.in_progress / 3000) * 100}%` }}
              title={`In Progress: ${stats.in_progress}`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {stats.learned} Learned
            </span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {stats.in_progress} In-Prog
            </span>
          </div>
        </div>
      </div>

      {/* Sidebar Footer with Controls & Tools */}
      <div className="p-3 border-t border-slate-800/80 flex items-center justify-between gap-1 bg-slate-950/50">
        <button
          type="button"
          onClick={onToggleSound}
          className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
          title={soundOn ? 'Sound FX On (Click to mute)' : 'Sound Muted (Click to unmute)'}
        >
          {soundOn ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-[11px]">Audio</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[11px] text-slate-500">Muted</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            playSound('click');
            onOpenVimModal();
            onCloseMobile();
          }}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
          title="Keyboard Shortcuts (?)"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            playSound('click');
            onOpenDbModal();
            onCloseMobile();
          }}
          className="flex items-center gap-1 p-2 rounded-xl text-xs font-medium text-slate-400 hover:text-sky-400 hover:bg-slate-800/80 transition-colors"
          title="SQLite Database Management"
        >
          <Database className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[11px] font-mono">DB</span>
        </button>
      </div>
    </div>
  );

  // Render Compact Collapsed Sidebar View (Desktop only)
  const renderCollapsedContent = () => (
    <div className="flex flex-col h-full bg-[slate-950] border-r border-slate-800/80 text-slate-200 items-center justify-between py-3 px-2">
      {/* Top Logo & Expand Button */}
      <div className="flex flex-col items-center gap-4 w-full">
        <button
          type="button"
          onClick={() => {
            playSound('click');
            onToggleCollapse();
          }}
          className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-slate-950 font-serif font-bold text-xl shadow-md shadow-sky-500/20 hover:scale-105 transition-transform"
          title="Click to expand navigation sidebar"
        >
          字
        </button>

        <button
          type="button"
          onClick={() => {
            playSound('click');
            onToggleCollapse();
          }}
          className="p-2 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-800/80 transition-colors"
          title="Expand Sidebar"
        >
          <PanelLeftOpen className="w-4 h-4" />
        </button>

        <div className="w-8 h-[1px] bg-slate-800/80" />

        {/* Study Pages Icons */}
        <div className="flex flex-col items-center gap-2 w-full">
          {studyPages.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all group ${isActive
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                  }`}
                title={item.label}
              >
                <Icon className="w-4 h-4" />
                {isActive && (
                  <span className="absolute -right-1 top-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
                )}
              </button>
            );
          })}
        </div>

        <div className="w-8 h-[1px] bg-slate-800/80" />

        {/* Practice & Games Icons */}
        <div className="flex flex-col items-center gap-2 w-full">
          {/* Story Reader Icon */}
          <button
            type="button"
            onClick={() => handleNavClick('stories')}
            className={`relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all group ${activePage === 'stories'
              ? 'bg-gradient-to-tr from-sky-500 to-emerald-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
              }`}
            title="Story Reader"
          >
            <ScrollText className="w-4 h-4" />
            {activePage === 'stories' && (
              <span className="absolute -right-1 top-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
            )}
          </button>

          {/* Word Match Icon */}
          <button
            type="button"
            onClick={() => handleNavClick('word-match')}
            className={`relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all group ${activePage === 'word-match'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800/70 border border-amber-500/30'
              }`}
            title="Word Match (组词配对)"
          >
            <Zap className={`w-4 h-4 fill-current ${activePage === 'word-match' ? 'text-slate-950' : 'text-amber-400'}`} />
            {activePage === 'word-match' && (
              <span className="absolute -right-1 top-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
            )}
          </button>
        </div>
      </div>

      {/* Bottom Compact Mastery & Footer Tools */}
      <div className="flex flex-col items-center gap-2 w-full">
        {/* Compact Mastery Percentage */}
        <div
          className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] font-mono font-bold text-sky-400 cursor-pointer hover:border-sky-500/40"
          title={`Mastery: ${masteryPercent}% (${stats.learned}/3000)`}
        >
          {Math.round(Number(masteryPercent))}%
        </div>

        <div className="w-8 h-[1px] bg-slate-800/80" />

        <button
          type="button"
          onClick={onToggleSound}
          className="p-2 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-800/80 transition-colors"
          title={soundOn ? 'Audio On' : 'Audio Muted'}
        >
          {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        <button
          type="button"
          onClick={() => {
            playSound('click');
            onOpenVimModal();
          }}
          className="p-2 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-800/80 transition-colors"
          title="Keyboard Shortcuts (?)"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            playSound('click');
            onOpenDbModal();
          }}
          className="p-2 text-slate-400 hover:text-sky-400 rounded-xl hover:bg-slate-800/80 transition-colors"
          title="SQLite DB Console"
        >
          <Database className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Side Navigation (Collapsible w-64 / w-[72px]) */}
      <aside
        className={`hidden md:flex flex-col shrink-0 fixed inset-y-0 left-0 z-40 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[72px]' : 'w-64'
          }`}
      >
        {isCollapsed ? renderCollapsedContent() : renderExpandedContent()}
      </aside>

      {/* Mobile Slide-over Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={onCloseMobile}
        >
          <div
            className="w-72 max-w-[85vw] h-full shadow-2xl animate-slide-in-left"
            onClick={(e) => e.stopPropagation()}
          >
            {renderExpandedContent()}
          </div>
        </div>
      )}
    </>
  );
};
