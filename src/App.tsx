import { useState, useEffect, useCallback } from 'react';
import type { Character, ActiveTab } from './types';
import { useStudyData } from './hooks/useStudyData';
import { Stopwatch } from './components/Stopwatch';
import { LessonsView } from './components/LessonsView';
import { WordListTable } from './components/WordListTable';
import { QuizModal } from './components/QuizModal';
import { DatabaseModal } from './components/DatabaseModal';
import { VimHelpModal } from './components/VimHelpModal';
import { WordMatchModal } from './components/WordMatchModal';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Database,
  Keyboard,
  Layers,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playSound } from './utils/audio';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('lessons');
  const [soundOn, setSoundOn] = useState<boolean>(isSoundEnabled());

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
        else if (currentLessonNumber !== null) backToLessons();
      } else if (e.key === '?') {
        e.preventDefault();
        setIsVimModalOpen((prev) => !prev);
      } else if (isQuizOpen || isWordMatchOpen || isDbModalOpen || isVimModalOpen) {
        return;
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key === '1') {
          setActiveTab('lessons');
        } else if (e.key === '2') {
          setActiveTab('learned');
        } else if (e.key === '3') {
          setActiveTab('in-progress');
        } else if (e.key === '4') {
          setActiveTab('all');
        } else if (e.key.toLowerCase() === 'w') {
          e.preventDefault();
          setIsWordMatchOpen((prev) => !prev);
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
    currentLessonNumber,
    backToLessons,
    handlePrevLesson,
    handleNextLesson,
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

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f17] text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Top Header & Persistent Stopwatch */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0b0f17]/90 border-b border-slate-800/80 px-4 py-2.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo & App Title */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-slate-950 font-serif font-bold text-xl shadow-md shadow-sky-500/20 shrink-0">
                字
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base text-slate-100 tracking-tight">
                    HanziStudy
                  </span>
                  <Badge variant="hsk" className="text-[10px] px-1.5 py-0">
                    SQLite3
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  3,000 High-Frequency Chinese Characters
                </p>
              </div>
            </div>

            <div className="md:hidden">
              <Stopwatch />
            </div>
          </div>

          {/* Desktop Top Stopwatch */}
          <div className="hidden md:flex items-center justify-center">
            <Stopwatch />
          </div>

          {/* Top Right Utilities */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
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

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                playSound('click');
                setIsWordMatchOpen(true);
              }}
              className="gap-1.5 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 font-semibold h-8 text-xs"
              title="2-Character Word Match Game (or press 'w')"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Word Match</span>
            </Button>

            <Button
              variant="outline"
              size="iconSm"
              onClick={toggleSound}
              className="h-8 w-8 rounded-lg"
              title={soundOn ? 'Sound Effects Enabled (Click to Mute)' : 'Sound Muted (Click to Unmute)'}
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5 text-slate-300" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            </Button>

            <Button
              variant="outline"
              size="iconSm"
              onClick={() => setIsVimModalOpen(true)}
              className="h-8 w-8 rounded-lg"
              title="Keyboard & Vim Bindings (?)"
            >
              <Keyboard className="w-3.5 h-3.5 text-slate-300" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDbModalOpen(true)}
              className="gap-1.5 h-8 text-xs"
              title="SQLite Database Management & SQL Console"
            >
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">DB</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col gap-6">
        {/* Modern Tab Switcher Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Button
              variant={activeTab === 'lessons' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('lessons')}
              className="gap-2 h-9 text-xs sm:text-sm font-semibold"
            >
              <BookOpen className="w-4 h-4" />
              <span>Lessons (120)</span>
              <kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-black/20 text-current opacity-80">
                1
              </kbd>
            </Button>

            <Button
              variant={activeTab === 'learned' ? 'learned' : 'ghost'}
              onClick={() => setActiveTab('learned')}
              className="gap-2 h-9 text-xs sm:text-sm font-semibold"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Learned Words</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-black/20 font-bold">
                {stats.learned}
              </span>
              <kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-black/20 text-current opacity-80">
                2
              </kbd>
            </Button>

            <Button
              variant={activeTab === 'in-progress' ? 'inProgress' : 'ghost'}
              onClick={() => setActiveTab('in-progress')}
              className="gap-2 h-9 text-xs sm:text-sm font-semibold"
            >
              <Clock className="w-4 h-4" />
              <span>In-Progress Words</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-black/20 font-bold">
                {stats.in_progress}
              </span>
              <kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-black/20 text-current opacity-80">
                3
              </kbd>
            </Button>

            <Button
              variant={activeTab === 'all' ? 'secondary' : 'ghost'}
              onClick={() => setActiveTab('all')}
              className="gap-2 h-9 text-xs sm:text-sm font-semibold"
            >
              <Layers className="w-4 h-4" />
              <span>All 3,000 Hanzi</span>
              <kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-black/20 text-current opacity-80">
                4
              </kbd>
            </Button>
          </div>
        </div>

        {/* Tab Content Panels */}
        <main className="flex-1">
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
        sourceCards={
          activeTab === 'learned' && learnedList.length > 0
            ? learnedList
            : activeTab === 'in-progress' && inProgressList.length > 0
            ? inProgressList
            : allCharactersList
        }
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
