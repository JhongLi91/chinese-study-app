import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Character, ActiveTab } from './types';
import { useStudyData } from './hooks/useStudyData';
import { SidebarNav } from './components/SidebarNav';
import { LessonsView } from './components/LessonsView';
import { WordListTable } from './components/WordListTable';
import { QuizModal } from './components/QuizModal';
import { DatabaseModal } from './components/DatabaseModal';
import { VimHelpModal } from './components/VimHelpModal';
import { WordMatchModal } from './components/WordMatchModal';
import { StoryReaderView } from './components/StoryReaderView';
import { Badge } from './components/ui/badge';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  ScrollText,
  Menu,
} from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playSound } from './utils/audio';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('lessons');
  const [soundOn, setSoundOn] = useState<boolean>(isSoundEnabled());
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hanzi_sidebar_collapsed') === 'true';
    }
    return false;
  });

  const toggleSidebarCollapse = useCallback(() => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('hanzi_sidebar_collapsed', String(next));
      }
      return next;
    });
  }, []);

  // Data layer via custom hook
  const {
    isInitializing,
    stats,
    lessons,
    learnedList,
    inProgressList,
    allCharactersList,
    currentLessonNumber,
    lessonCharacters,
    isLoadingLesson,
    selectLesson,
    backToLessons,
    handleStatusChange,
    handleBatchStatusChange,
    refreshData,
  } = useStudyData(activeTab);

  // Modals state
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizSourceCards, setQuizSourceCards] = useState<Character[]>([]);
  const [quizTitle, setQuizTitle] = useState('Randomized Flashcard Quiz');
  const [isWordMatchOpen, setIsWordMatchOpen] = useState(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isVimModalOpen, setIsVimModalOpen] = useState(false);

  const studiedCharacters = useMemo(() => {
    return [...learnedList, ...inProgressList];
  }, [learnedList, inProgressList]);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playSound('click');
  };

  const handleStartLearnedQuiz = () => {
    playSound('click');
    setQuizSourceCards(learnedList);
    setQuizTitle('Learned Words Quiz');
    setIsQuizOpen(true);
  };

  const handleStartInProgressQuiz = () => {
    playSound('click');
    setQuizSourceCards(inProgressList);
    setQuizTitle('In-Progress Words Quiz');
    setIsQuizOpen(true);
  };

  const handleStartAllQuiz = () => {
    playSound('click');
    setQuizSourceCards(allCharactersList);
    setQuizTitle('All Hanzi Randomized Quiz');
    setIsQuizOpen(true);
  };

  const handleStartCustomQuiz = (cards: Character[], title: string = 'Story Vocabulary Quiz') => {
    playSound('click');
    setQuizSourceCards(cards);
    setQuizTitle(title);
    setIsQuizOpen(true);
  };

  const handlePrevLesson = useCallback(() => {
    playSound('click');
    setActiveTab('lessons');
    if (currentLessonNumber !== null) {
      if (currentLessonNumber > 1) {
        void selectLesson(currentLessonNumber - 1);
      }
    } else {
      void selectLesson(1);
    }
  }, [currentLessonNumber, selectLesson]);

  const handleNextLesson = useCallback(() => {
    const maxLessons = lessons.length || 120;
    playSound('click');
    setActiveTab('lessons');
    if (currentLessonNumber !== null) {
      if (currentLessonNumber < maxLessons) {
        void selectLesson(currentLessonNumber + 1);
      }
    } else {
      void selectLesson(1);
    }
  }, [currentLessonNumber, lessons.length, selectLesson]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === 'Escape') {
        if (isQuizOpen) setIsQuizOpen(false);
        else if (isWordMatchOpen) setIsWordMatchOpen(false);
        else if (isDbModalOpen) setIsDbModalOpen(false);
        else if (isVimModalOpen) setIsVimModalOpen(false);
        else if (isMobileNavOpen) setIsMobileNavOpen(false);
        else if (currentLessonNumber !== null) backToLessons();
      } else if (e.key === '?') {
        e.preventDefault();
        setIsVimModalOpen((prev) => !prev);
      } else if (isQuizOpen || isWordMatchOpen || isDbModalOpen || isVimModalOpen) {
        return;
      } else if (e.key === '\\' || (e.ctrlKey && e.key.toLowerCase() === 'b')) {
        e.preventDefault();
        playSound('click');
        toggleSidebarCollapse();
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key === '1') {
          setActiveTab('lessons');
        } else if (e.key === '2') {
          setActiveTab('learned');
        } else if (e.key === '3') {
          setActiveTab('in-progress');
        } else if (e.key === '4') {
          setActiveTab('all');
        } else if (e.key === '[') {
          e.preventDefault();
          handlePrevLesson();
        } else if (e.key === ']') {
          e.preventDefault();
          handleNextLesson();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isQuizOpen,
    isWordMatchOpen,
    isDbModalOpen,
    isVimModalOpen,
    isMobileNavOpen,
    currentLessonNumber,
    backToLessons,
    handlePrevLesson,
    handleNextLesson,
    toggleSidebarCollapse,
  ]);

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0f17] text-slate-100 gap-4">
        <div className="w-16 h-16 rounded-3xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20 animate-pulse shadow-lg shadow-sky-500/10">
          <span className="font-serif text-3xl font-bold">字</span>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-100">
            Initializing SQLite Database...
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Loading 3,000 Chinese characters & study progress from WebAssembly SQLite
          </p>
        </div>
      </div>
    );
  }

  const masteryPercent = ((stats.learned / 3000) * 100).toFixed(1);

  // Page Header Details
  const pageMeta = {
    lessons: {
      title: 'Lessons Curriculum',
      subtitle: currentLessonNumber
        ? `Lesson ${currentLessonNumber} of 120 • 25 Hanzi`
        : '120 Curated Lessons • 25 High-Frequency Characters each',
      icon: BookOpen,
    },
    stories: {
      title: 'Story Reader',
      subtitle: 'Authentic HSK reading passages with sentence-by-sentence audio narration',
      icon: ScrollText,
    },
    learned: {
      title: 'Learned Words Directory',
      subtitle: `${stats.learned} characters mastered. Regular flashcard practice solidifies memory`,
      icon: CheckCircle2,
    },
    'in-progress': {
      title: 'In-Progress Queue',
      subtitle: `${stats.in_progress} characters currently being learned. Practice in quizzes to promote to Learned`,
      icon: Clock,
    },
    all: {
      title: '3,000 Hanzi Library',
      subtitle: 'Complete frequency rank database from #1 to #3,000 with definitions and stroke data',
      icon: Layers,
    },
  }[activeTab];

  const PageIcon = pageMeta.icon;

  return (
    <div className="min-h-screen flex bg-[#0b0f17] text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Side Navbar (Open / Closeable on desktop & mobile) */}
      <SidebarNav
        activePage={activeTab}
        onSelectPage={setActiveTab}
        stats={stats}
        masteryPercent={masteryPercent}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        onOpenWordMatch={() => setIsWordMatchOpen(true)}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        onOpenVimModal={() => setIsVimModalOpen(true)}
        soundOn={soundOn}
        onToggleSound={toggleSound}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area (Fluid padding based on sidebar collapsed state) */}
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'md:pl-[72px]' : 'md:pl-64'
        }`}
      >
        {/* Main Content Top Navigation Bar */}
        <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-[#0b0f17]/90 border-b border-slate-800/80 px-4 py-3 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Left: Mobile Menu Toggle & Page Title */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(true)}
                className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800"
                title="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20 shrink-0 hidden sm:flex">
                  <PageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h1 className="font-bold text-sm sm:text-base text-slate-100 leading-tight flex items-center gap-2">
                    <span>{pageMeta.title}</span>
                    {activeTab === 'stories' && (
                      <Badge variant="hsk" className="text-[10px] px-1.5 py-0">
                        HSK 3+
                      </Badge>
                    )}
                  </h1>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {pageMeta.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Mastery Stats Chip */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full text-xs font-mono shadow-sm">
                <span className="text-emerald-400 font-bold flex items-center gap-1" title="Learned characters">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{stats.learned}</span>
                </span>
                <span className="text-slate-600">/</span>
                <span className="text-amber-400 font-bold flex items-center gap-1" title="In-Progress characters">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{stats.in_progress}</span>
                </span>
                <span className="text-slate-600">/</span>
                <span className="text-sky-400 font-semibold" title="Mastery Percentage">
                  {masteryPercent}%
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 flex-1 flex flex-col gap-6">
          {activeTab === 'lessons' && (
            <LessonsView
              lessons={lessons}
              currentLessonNumber={currentLessonNumber}
              lessonCharacters={lessonCharacters}
              isLoadingLesson={isLoadingLesson}
              onSelectLesson={(num) => void selectLesson(num)}
              onBackToLessons={backToLessons}
              onStatusChange={(id, status) => void handleStatusChange(id, status)}
            />
          )}

          {activeTab === 'stories' && (
            <StoryReaderView
              learnedList={learnedList}
              inProgressList={inProgressList}
              onStatusChange={(id, status) => handleStatusChange(id, status)}
              onStartQuiz={handleStartCustomQuiz}
            />
          )}

          {activeTab === 'learned' && (
            <WordListTable
              title="Learned Words"
              description="All characters you have mastered. Review them regularly with randomized flashcard quizzes."
              characters={learnedList}
              activeStatusTab="learned"
              onStartQuiz={handleStartLearnedQuiz}
              onStatusChange={(id, status) => void handleStatusChange(id, status)}
              onBatchStatusChange={(ids, status) => void handleBatchStatusChange(ids, status)}
            />
          )}

          {activeTab === 'in-progress' && (
            <WordListTable
              title="In-Progress Words"
              description="Characters currently being studied. Run randomized quizzes to practice and promote them to Learned."
              characters={inProgressList}
              activeStatusTab="in-progress"
              onStartQuiz={handleStartInProgressQuiz}
              onStatusChange={(id, status) => void handleStatusChange(id, status)}
              onBatchStatusChange={(ids, status) => void handleBatchStatusChange(ids, status)}
            />
          )}

          {activeTab === 'all' && (
            <WordListTable
              title="3,000 Chinese Character Directory"
              description="Explore the complete 3,000 high-frequency characters dataset. Search by Hanzi, pinyin, or definition."
              characters={allCharactersList}
              activeStatusTab="all"
              onStartQuiz={handleStartAllQuiz}
              onStatusChange={(id, status) => void handleStatusChange(id, status)}
              onBatchStatusChange={(ids, status) => void handleBatchStatusChange(ids, status)}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <QuizModal
        isOpen={isQuizOpen}
        title={quizTitle}
        sourceCards={quizSourceCards}
        onClose={() => {
          setIsQuizOpen(false);
          void refreshData();
        }}
        onStatusChange={(id, status) => void handleStatusChange(id, status)}
      />

      <WordMatchModal
        isOpen={isWordMatchOpen}
        onClose={() => setIsWordMatchOpen(false)}
        sourceCards={studiedCharacters}
        onGoToLessons={() => {
          setIsWordMatchOpen(false);
          setActiveTab('lessons');
        }}
      />

      <DatabaseModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        onDatabaseMutated={() => void refreshData()}
      />

      <VimHelpModal
        isOpen={isVimModalOpen}
        onClose={() => setIsVimModalOpen(false)}
      />
    </div>
  );
}

export default App;
