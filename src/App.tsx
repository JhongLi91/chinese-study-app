import { useState, useEffect, useCallback } from 'react';
import type {
  Character,
  LessonInfo,
  StudyStats,
  StudyStatus,
  ActiveTab,
} from './types';
import {
  getStudyStats,
  getLessonsSummary,
  getLessonCharacters,
  getLearnedCharacters,
  getInProgressCharacters,
  getAllCharacters,
  updateCharacterStatus,
  batchUpdateStatus,
} from './db/sqlite';
import { Stopwatch } from './components/Stopwatch';
import { LessonsView } from './components/LessonsView';
import { WordListTable } from './components/WordListTable';
import { QuizModal } from './components/QuizModal';
import { DatabaseModal } from './components/DatabaseModal';
import { VimHelpModal } from './components/VimHelpModal';
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
} from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playSound } from './utils/audio';

export function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [stats, setStats] = useState<StudyStats>({
    total: 3000,
    learned: 0,
    in_progress: 0,
    new_count: 3000,
    completed_lessons: 0,
    total_lessons: 120,
  });
  const [lessons, setLessons] = useState<LessonInfo[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('lessons');

  // Lesson view state
  const [currentLessonNumber, setCurrentLessonNumber] = useState<number | null>(null);
  const [lessonCharacters, setLessonCharacters] = useState<Character[]>([]);
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);

  // Tab lists
  const [learnedList, setLearnedList] = useState<Character[]>([]);
  const [inProgressList, setInProgressList] = useState<Character[]>([]);
  const [allCharactersList, setAllCharactersList] = useState<Character[]>([]);

  // Modals
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizSourceCards, setQuizSourceCards] = useState<Character[]>([]);
  const [quizTitle, setQuizTitle] = useState('Randomized Flashcard Quiz');
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isVimModalOpen, setIsVimModalOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const refreshData = useCallback(async () => {
    try {
      const [newStats, newLessons, learned, inProgress] = await Promise.all([
        getStudyStats(),
        getLessonsSummary(),
        getLearnedCharacters(),
        getInProgressCharacters(),
      ]);

      setStats(newStats);
      setLessons(newLessons);
      setLearnedList(learned);
      setInProgressList(inProgress);

      if (currentLessonNumber !== null) {
        const chars = await getLessonCharacters(currentLessonNumber);
        setLessonCharacters(chars);
      }

      if (activeTab === 'all') {
        const allChars = await getAllCharacters();
        setAllCharactersList(allChars);
      }
    } catch (e) {
      console.error('Error loading data from SQLite DB:', e);
    }
  }, [currentLessonNumber, activeTab]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsInitializing(true);
        await refreshData();
      } finally {
        if (mounted) setIsInitializing(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'all') {
      getAllCharacters().then((chars) => setAllCharactersList(chars));
    } else if (activeTab === 'learned') {
      getLearnedCharacters().then((chars) => setLearnedList(chars));
    } else if (activeTab === 'in-progress') {
      getInProgressCharacters().then((chars) => setInProgressList(chars));
    }
  }, [activeTab]);

  const handleSelectLesson = async (lessonNum: number) => {
    setCurrentLessonNumber(lessonNum);
    setIsLoadingLesson(true);
    try {
      const chars = await getLessonCharacters(lessonNum);
      setLessonCharacters(chars);
    } finally {
      setIsLoadingLesson(false);
    }
  };

  const handleBackToLessons = () => {
    setCurrentLessonNumber(null);
    setLessonCharacters([]);
    refreshData();
  };

  const handleStatusChange = async (characterId: number, status: StudyStatus) => {
    await updateCharacterStatus(characterId, status);
    await refreshData();
  };

  const handleBatchStatusChange = async (characterIds: number[], status: StudyStatus) => {
    await batchUpdateStatus(characterIds, status);
    await refreshData();
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

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playSound('click');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === 'Escape') {
        if (isQuizOpen) setIsQuizOpen(false);
        else if (isDbModalOpen) setIsDbModalOpen(false);
        else if (isVimModalOpen) setIsVimModalOpen(false);
        else if (currentLessonNumber !== null) handleBackToLessons();
      } else if (e.key === '?') {
        e.preventDefault();
        setIsVimModalOpen((prev) => !prev);
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key === '1') {
          setActiveTab('lessons');
        } else if (e.key === '2') {
          setActiveTab('learned');
          setCurrentLessonNumber(null);
        } else if (e.key === '3') {
          setActiveTab('in-progress');
          setCurrentLessonNumber(null);
        } else if (e.key === '4') {
          setActiveTab('all');
          setCurrentLessonNumber(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQuizOpen, isDbModalOpen, isVimModalOpen, currentLessonNumber]);

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0f17] text-slate-100 gap-4">
        <div className="w-16 h-16 rounded-3xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20 animate-pulse">
          <span className="font-serif text-3xl font-bold">字</span>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-100">
            Initializing SQLite Database...
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Loading 3,000 Chinese characters & progress from WebAssembly SQLite
          </p>
        </div>
      </div>
    );
  }

  const masteryPercent = ((stats.learned / 3000) * 100).toFixed(1);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f17] text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Top Header & Persistent Stopwatch */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0b0f17]/90 border-b border-slate-800/80 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo & App Title */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-slate-950 font-serif font-bold text-xl shadow-md shadow-sky-500/20">
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
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-xs font-mono">
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
              size="icon"
              onClick={toggleSound}
              title={soundOn ? 'Sound Effects Enabled (Click to Mute)' : 'Sound Muted (Click to Unmute)'}
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-slate-300" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsVimModalOpen(true)}
              title="Keyboard & Vim Bindings (?)"
            >
              <Keyboard className="w-4 h-4 text-slate-300" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDbModalOpen(true)}
              className="gap-1.5"
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
        {/* Tab Switcher Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto">
            <Button
              variant={activeTab === 'lessons' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('lessons')}
              className="gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Lessons (120)</span>
              <kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-black/20 text-current opacity-80">
                1
              </kbd>
            </Button>

            <Button
              variant={activeTab === 'learned' ? 'learned' : 'ghost'}
              onClick={() => {
                setActiveTab('learned');
                setCurrentLessonNumber(null);
              }}
              className="gap-2"
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
              onClick={() => {
                setActiveTab('in-progress');
                setCurrentLessonNumber(null);
              }}
              className="gap-2"
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
              onClick={() => {
                setActiveTab('all');
                setCurrentLessonNumber(null);
              }}
              className="gap-2"
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
              onSelectLesson={handleSelectLesson}
              onBackToLessons={handleBackToLessons}
              onStatusChange={handleStatusChange}
            />
          )}

          {activeTab === 'learned' && (
            <WordListTable
              title="Learned Words"
              description="All characters you have mastered. Review them regularly with randomized flashcard quizzes."
              characters={learnedList}
              activeStatusTab="learned"
              onStartQuiz={handleStartLearnedQuiz}
              onStatusChange={handleStatusChange}
              onBatchStatusChange={handleBatchStatusChange}
            />
          )}

          {activeTab === 'in-progress' && (
            <WordListTable
              title="In-Progress Words"
              description="Characters currently being studied. Run randomized quizzes to practice and promote them to Learned."
              characters={inProgressList}
              activeStatusTab="in-progress"
              onStartQuiz={handleStartInProgressQuiz}
              onStatusChange={handleStatusChange}
              onBatchStatusChange={handleBatchStatusChange}
            />
          )}

          {activeTab === 'all' && (
            <WordListTable
              title="3,000 Chinese Character Directory"
              description="Explore the complete 3,000 high-frequency characters dataset. Search by Hanzi, pinyin, or definition."
              characters={allCharactersList}
              activeStatusTab="all"
              onStartQuiz={handleStartAllQuiz}
              onStatusChange={handleStatusChange}
              onBatchStatusChange={handleBatchStatusChange}
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
          refreshData();
        }}
        onStatusChange={handleStatusChange}
      />

      <DatabaseModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        onDatabaseMutated={refreshData}
      />

      <VimHelpModal
        isOpen={isVimModalOpen}
        onClose={() => setIsVimModalOpen(false)}
      />
    </div>
  );
}

export default App;
