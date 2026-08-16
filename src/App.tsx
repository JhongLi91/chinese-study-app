import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  useParams,
} from 'react-router-dom';
import type { Character, ActiveTab, LessonInfo, StudyStatus } from './types';
import { useStudyData } from './hooks/useStudyData';
import { SidebarNav } from './components/SidebarNav';
import { LessonsView } from './components/LessonsView';
import { WordListTable } from './components/WordListTable';
import { QuizModal } from './components/QuizModal';
import { DatabaseModal } from './components/DatabaseModal';
import { VimHelpModal } from './components/VimHelpModal';
import { WordMatchView } from './components/WordMatchView';
import { StoryReaderView } from './components/StoryReaderView';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  ScrollText,
  Menu,
  ArrowLeft,
  Zap,
} from 'lucide-react';
import { STORIES } from './data/stories';
import { isSoundEnabled, setSoundEnabled, playSound } from './utils/audio';

// -------------------------------------------------------------
// Route Sub-Components
// -------------------------------------------------------------

function LessonsGridRoute({
  lessons,
  lessonCharacters,
  isLoadingLesson,
  onStatusChange,
}: {
  lessons: LessonInfo[];
  lessonCharacters: Character[];
  isLoadingLesson: boolean;
  onStatusChange: (id: number, status: StudyStatus) => Promise<void>;
}) {
  const navigate = useNavigate();

  return (
    <LessonsView
      lessons={lessons}
      currentLessonNumber={null}
      lessonCharacters={lessonCharacters}
      isLoadingLesson={isLoadingLesson}
      onSelectLesson={(num) => navigate(`/lessons/${num}`)}
      onBackToLessons={() => navigate('/lessons')}
      onStatusChange={onStatusChange}
    />
  );
}

function LessonDetailRoute({
  lessons,
  lessonCharacters,
  isLoadingLesson,
  selectLesson,
  onStatusChange,
}: {
  lessons: LessonInfo[];
  lessonCharacters: Character[];
  isLoadingLesson: boolean;
  selectLesson: (num: number) => Promise<void>;
  onStatusChange: (id: number, status: StudyStatus) => Promise<void>;
}) {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const lessonNum = parseInt(lessonId || '1', 10);

  useEffect(() => {
    if (!isNaN(lessonNum) && lessonNum >= 1 && lessonNum <= 120) {
      void selectLesson(lessonNum);
    }
  }, [lessonNum, selectLesson]);

  return (
    <LessonsView
      lessons={lessons}
      currentLessonNumber={isNaN(lessonNum) ? 1 : lessonNum}
      lessonCharacters={lessonCharacters}
      isLoadingLesson={isLoadingLesson}
      onSelectLesson={(num) => navigate(`/lessons/${num}`)}
      onBackToLessons={() => navigate('/lessons')}
      onStatusChange={onStatusChange}
    />
  );
}

function StoryRoute({
  learnedList,
  inProgressList,
  onStatusChange,
  onStartQuiz,
}: {
  learnedList: Character[];
  inProgressList: Character[];
  onStatusChange: (id: number, status: StudyStatus) => Promise<void>;
  onStartQuiz: (cards: Character[], title?: string) => void;
}) {
  const { storyId } = useParams<{ storyId?: string }>();
  const navigate = useNavigate();

  return (
    <StoryReaderView
      learnedList={learnedList}
      inProgressList={inProgressList}
      selectedStoryId={storyId || null}
      onSelectStoryId={(id) => {
        if (id) {
          navigate(`/stories/${id}`);
        } else {
          navigate('/stories');
        }
      }}
      onStatusChange={onStatusChange}
      onStartQuiz={onStartQuiz}
    />
  );
}

// -------------------------------------------------------------
// Main App Component
// -------------------------------------------------------------

export function App() {
  const location = useLocation();
  const navigate = useNavigate();

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

  // Compute Active Tab based on URL Path
  const activeTab: ActiveTab = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith('/learned')) return 'learned';
    if (path.startsWith('/in-progress')) return 'in-progress';
    if (path.startsWith('/all')) return 'all';
    if (path.startsWith('/stories')) return 'stories';
    if (path.startsWith('/word-match')) return 'word-match';
    return 'lessons';
  }, [location.pathname]);

  // Check if currently viewing a specific story or lesson
  const storyMatch = location.pathname.match(/^\/stories\/([^/]+)/);
  const activeStoryId = storyMatch ? storyMatch[1] : null;
  const activeStory = activeStoryId ? STORIES.find((s) => s.id === activeStoryId) : null;

  const lessonMatch = location.pathname.match(/^\/lessons\/(\d+)/);
  const activeLessonNum = lessonMatch ? parseInt(lessonMatch[1], 10) : null;

  // Data layer via custom hook
  const {
    isInitializing,
    stats,
    lessons,
    learnedList,
    inProgressList,
    allCharactersList,
    lessonCharacters,
    isLoadingLesson,
    selectLesson,
    handleStatusChange,
    handleBatchStatusChange,
    refreshData,
  } = useStudyData(activeTab);

  // Modals state
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [quizSourceCards, setQuizSourceCards] = useState<Character[]>([]);
  const [quizTitle, setQuizTitle] = useState<string>('Flashcard Quiz');
  const [isDbModalOpen, setIsDbModalOpen] = useState<boolean>(false);
  const [isVimModalOpen, setIsVimModalOpen] = useState<boolean>(false);

  // Sound toggle
  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playSound('click');
  };

  // Switch page route
  const handleSelectPage = useCallback(
    (page: ActiveTab) => {
      playSound('click');
      if (page === 'lessons') navigate('/lessons');
      else if (page === 'learned') navigate('/learned');
      else if (page === 'in-progress') navigate('/in-progress');
      else if (page === 'all') navigate('/all');
      else if (page === 'stories') navigate('/stories');
      else if (page === 'word-match') navigate('/word-match');
    },
    [navigate]
  );

  // Studied characters (Learned + In Progress) for Word Match game
  const studiedCharacters = useMemo(() => {
    return [...learnedList, ...inProgressList];
  }, [learnedList, inProgressList]);

  // Quiz launcher
  const handleStartLearnedQuiz = () => {
    if (learnedList.length === 0) return;
    playSound('click');
    setQuizSourceCards(learnedList);
    setQuizTitle('Learned Words Quiz');
    setIsQuizOpen(true);
  };

  const handleStartInProgressQuiz = () => {
    if (inProgressList.length === 0) return;
    playSound('click');
    setQuizSourceCards(inProgressList);
    setQuizTitle('In-Progress Words Quiz');
    setIsQuizOpen(true);
  };

  const handleStartAllQuiz = () => {
    if (allCharactersList.length === 0) return;
    playSound('click');
    setQuizSourceCards(allCharactersList);
    setQuizTitle('Randomized 3,000 Character Quiz');
    setIsQuizOpen(true);
  };

  const handleStartCustomQuiz = (cards: Character[], title?: string) => {
    if (cards.length === 0) return;
    playSound('click');
    setQuizSourceCards(cards);
    setQuizTitle(title || 'Flashcard Quiz');
    setIsQuizOpen(true);
  };

  // Global Keyboard Shortcuts
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
        else if (isMobileNavOpen) setIsMobileNavOpen(false);
        else if (activeLessonNum !== null) {
          navigate('/lessons');
        } else if (activeStoryId !== null) {
          navigate('/stories');
        }
      } else if (e.key === '?') {
        e.preventDefault();
        setIsVimModalOpen((prev) => !prev);
      } else if (isQuizOpen || isDbModalOpen || isVimModalOpen) {
        return;
      } else if (e.key === '\\' || (e.ctrlKey && e.key.toLowerCase() === 'b')) {
        e.preventDefault();
        playSound('click');
        toggleSidebarCollapse();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isQuizOpen,
    isDbModalOpen,
    isVimModalOpen,
    isMobileNavOpen,
    activeLessonNum,
    activeStoryId,
    navigate,
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

  const masteryPercent = ((stats.learned / stats.total) * 100).toFixed(1);

  // Page Header Metadata
  const pageMeta = {
    lessons: {
      title: activeLessonNum ? `Lesson ${activeLessonNum}` : 'Lessons Curriculum',
      subtitle: activeLessonNum
        ? `Studying 25 characters in Lesson ${activeLessonNum}`
        : '120 Structured lessons (25 characters each) sorted by frequency rank',
      icon: BookOpen,
    },
    stories: {
      title: activeStory ? activeStory.titleZh : 'Story Reader',
      subtitle: activeStory
        ? `${activeStory.level} • ${activeStory.paragraphs.length} Paragraphs`
        : 'Authentic graded passages with sentence audio, vocabulary highlights, and reading checks',
      icon: ScrollText,
    },
    'word-match': {
      title: 'Word Match (组词配对)',
      subtitle: 'Match 1st and 2nd characters to discover authentic 2-character Chinese vocabulary',
      icon: Zap,
    },
    learned: {
      title: 'Learned Words',
      subtitle: `${stats.learned} characters mastered. Regular flashcard review strengthens retention`,
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
        onSelectPage={handleSelectPage}
        stats={stats}
        masteryPercent={masteryPercent}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
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

              {activeStory ? (
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      playSound('click');
                      navigate('/stories');
                    }}
                    className="h-8 gap-1.5 text-xs font-semibold border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 shadow-sm"
                    title="Return to Stories Catalog"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>All Stories</span>
                  </Button>
                  <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />
                  <div className="hidden sm:flex flex-col">
                    <span className="font-bold text-xs sm:text-sm text-slate-200 line-clamp-1 font-serif">
                      {activeStory.titleZh}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {activeStory.level}
                    </span>
                  </div>
                </div>
              ) : activeLessonNum ? (
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      playSound('click');
                      navigate('/lessons');
                    }}
                    className="h-8 gap-1.5 text-xs font-semibold border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 shadow-sm"
                    title="Return to Lessons Curriculum"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>All Lessons</span>
                  </Button>
                  <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />
                  <div className="hidden sm:flex flex-col">
                    <span className="font-bold text-xs sm:text-sm text-slate-200 line-clamp-1">
                      Lesson {activeLessonNum}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      25 Characters Flashcards
                    </span>
                  </div>
                </div>
              ) : (
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
                      {activeTab === 'word-match' && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-amber-500/40 text-amber-300">
                          Game
                        </Badge>
                      )}
                    </h1>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {pageMeta.subtitle}
                    </p>
                  </div>
                </div>
              )}
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

        {/* Page Content View via React Router */}
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 flex-1 flex flex-col gap-6">
          <Routes>
            <Route path="/" element={<Navigate to="/lessons" replace />} />

            <Route
              path="/lessons"
              element={
                <LessonsGridRoute
                  lessons={lessons}
                  lessonCharacters={lessonCharacters}
                  isLoadingLesson={isLoadingLesson}
                  onStatusChange={(id, status) => handleStatusChange(id, status)}
                />
              }
            />

            <Route
              path="/lessons/:lessonId"
              element={
                <LessonDetailRoute
                  lessons={lessons}
                  lessonCharacters={lessonCharacters}
                  isLoadingLesson={isLoadingLesson}
                  selectLesson={selectLesson}
                  onStatusChange={(id, status) => handleStatusChange(id, status)}
                />
              }
            />

            <Route
              path="/stories"
              element={
                <StoryRoute
                  learnedList={learnedList}
                  inProgressList={inProgressList}
                  onStatusChange={(id, status) => handleStatusChange(id, status)}
                  onStartQuiz={handleStartCustomQuiz}
                />
              }
            />

            <Route
              path="/stories/:storyId"
              element={
                <StoryRoute
                  learnedList={learnedList}
                  inProgressList={inProgressList}
                  onStatusChange={(id, status) => handleStatusChange(id, status)}
                  onStartQuiz={handleStartCustomQuiz}
                />
              }
            />

            <Route
              path="/word-match"
              element={
                <WordMatchView
                  sourceCards={studiedCharacters}
                  allCharacters={allCharactersList}
                  onGoToLessons={() => navigate('/lessons')}
                />
              }
            />

            <Route
              path="/learned"
              element={
                <WordListTable
                  title="Learned Words"
                  description="All characters you have mastered. Review them regularly with randomized flashcard quizzes."
                  characters={learnedList}
                  activeStatusTab="learned"
                  onStartQuiz={handleStartLearnedQuiz}
                  onStatusChange={(id, status) => void handleStatusChange(id, status)}
                  onBatchStatusChange={(ids, status) => void handleBatchStatusChange(ids, status)}
                />
              }
            />

            <Route
              path="/in-progress"
              element={
                <WordListTable
                  title="In-Progress Words"
                  description="Characters currently being studied. Run randomized quizzes to practice and promote them to Learned."
                  characters={inProgressList}
                  activeStatusTab="in-progress"
                  onStartQuiz={handleStartInProgressQuiz}
                  onStatusChange={(id, status) => void handleStatusChange(id, status)}
                  onBatchStatusChange={(ids, status) => void handleBatchStatusChange(ids, status)}
                />
              }
            />

            <Route
              path="/all"
              element={
                <WordListTable
                  title="3,000 Chinese Character Directory"
                  description="Explore the complete 3,000 high-frequency characters dataset. Search by Hanzi, pinyin, or definition."
                  characters={allCharactersList}
                  activeStatusTab="all"
                  onStartQuiz={handleStartAllQuiz}
                  onStatusChange={(id, status) => void handleStatusChange(id, status)}
                  onBatchStatusChange={(ids, status) => void handleBatchStatusChange(ids, status)}
                />
              }
            />

            <Route path="*" element={<Navigate to="/lessons" replace />} />
          </Routes>
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
