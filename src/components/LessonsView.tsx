import React, { useState, useMemo } from 'react';
import type { Character, LessonInfo, StudyStatus } from '../types';
import { Flashcard } from './Flashcard';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Search,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Trophy,
  List,
  Sparkles,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/audio';
import hanziData from '../data/hanzi_3000.json';

interface LessonsViewProps {
  lessons: LessonInfo[];
  currentLessonNumber: number | null;
  lessonCharacters: Character[];
  isLoadingLesson: boolean;
  onSelectLesson: (lessonNumber: number) => void;
  onBackToLessons: () => void;
  onStatusChange: (characterId: number, status: StudyStatus) => void;
}

export const LessonsView: React.FC<LessonsViewProps> = ({
  lessons,
  currentLessonNumber,
  lessonCharacters,
  isLoadingLesson,
  onSelectLesson,
  onBackToLessons,
  onStatusChange,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in-progress' | 'unstarted'>('all');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<Character[]>([]);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [lessonViewMode, setLessonViewMode] = useState<'flashcard' | 'list'>('flashcard');

  // Reset lesson internal state on lesson switch
  const [prevLessonNumber, setPrevLessonNumber] = useState<number | null>(null);
  if (currentLessonNumber !== prevLessonNumber) {
    setPrevLessonNumber(currentLessonNumber);
    setCurrentCardIndex(0);
    setIsShuffled(false);
    setShuffledCards([]);
    setIsLessonCompleted(false);
    setLessonViewMode('flashcard');
  }

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase().trim();
        const matchesNum = `lesson ${lesson.lesson_number}`.includes(q) || lesson.lesson_number.toString() === q;
        const matchesRank = `${lesson.start_rank}-${lesson.end_rank}`.includes(q) ||
          q.includes(lesson.start_rank.toString()) ||
          q.includes(lesson.end_rank.toString());
        if (!matchesNum && !matchesRank) return false;
      }

      if (statusFilter === 'completed') {
        return lesson.learned_count === lesson.total_count;
      }
      if (statusFilter === 'in-progress') {
        return (lesson.learned_count > 0 && lesson.learned_count < lesson.total_count) || lesson.in_progress_count > 0;
      }
      if (statusFilter === 'unstarted') {
        return lesson.learned_count === 0 && lesson.in_progress_count === 0;
      }

      return true;
    });
  }, [lessons, searchFilter, statusFilter]);

  const activeDeck = useMemo(() => {
    return isShuffled ? shuffledCards : lessonCharacters;
  }, [isShuffled, shuffledCards, lessonCharacters]);

  const handleStartLesson = (lessonNum: number) => {
    playSound('click');
    setCurrentCardIndex(0);
    setIsShuffled(false);
    setIsLessonCompleted(false);
    setLessonViewMode('flashcard');
    onSelectLesson(lessonNum);
  };

  const handleToggleShuffle = () => {
    playSound('click');
    if (!isShuffled) {
      const shuffled = [...lessonCharacters].sort(() => Math.random() - 0.5);
      setShuffledCards(shuffled);
      setIsShuffled(true);
      setCurrentCardIndex(0);
    } else {
      setIsShuffled(false);
      setCurrentCardIndex(0);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < activeDeck.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      setIsLessonCompleted(true);
      playSound('complete');
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore confetti error
      }
    }
  };

  if (currentLessonNumber !== null) {
    const lessonInfo = lessons.find((l) => l.lesson_number === currentLessonNumber);
    const learnedInLesson = lessonCharacters.filter((c) => c.status === 'learned').length;
    const inProgressInLesson = lessonCharacters.filter((c) => c.status === 'in-progress').length;

    return (
      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto animate-fade-in">
        {/* Lesson Study Header */}
        <Card className="p-4 sm:p-5 bg-slate-900/90 border-slate-800 backdrop-blur-md shadow-lg">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={onBackToLessons}
                className="gap-1.5 shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Lessons</span>
              </Button>
              <div className="flex items-center gap-0.5 bg-slate-950 border border-slate-800 rounded-xl p-0.5">
                <Button
                  variant="ghost"
                  size="iconSm"
                  disabled={currentLessonNumber <= 1}
                  onClick={() => {
                    playSound('click');
                    onSelectLesson(currentLessonNumber - 1);
                  }}
                  title="Previous Lesson (or press '[')"
                  className="rounded-lg h-7 w-7 text-slate-400 hover:text-slate-100 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="iconSm"
                  disabled={currentLessonNumber >= (lessons.length || 120)}
                  onClick={() => {
                    playSound('click');
                    onSelectLesson(currentLessonNumber + 1);
                  }}
                  title="Next Lesson (or press ']')"
                  className="rounded-lg h-7 w-7 text-slate-400 hover:text-slate-100 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
                  <span>Lesson {currentLessonNumber}</span>
                  <Badge variant="outline" className="font-mono font-normal text-xs text-slate-300">
                    Ranks #{lessonInfo?.start_rank} - #{lessonInfo?.end_rank}
                  </Badge>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  <span className="text-emerald-400 font-medium">{learnedInLesson}</span> of 25 learned • <span className="text-amber-400 font-medium">{inProgressInLesson}</span> studying
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <Button
                variant={isShuffled ? 'default' : 'secondary'}
                size="sm"
                onClick={handleToggleShuffle}
                className="gap-1.5"
                title="Shuffle card order"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>{isShuffled ? 'Shuffled' : 'Shuffle'}</span>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  playSound('click');
                  setLessonViewMode((m) => (m === 'flashcard' ? 'list' : 'flashcard'));
                }}
                className="gap-1.5"
              >
                {lessonViewMode === 'flashcard' ? (
                  <>
                    <List className="w-3.5 h-3.5" />
                    <span>List View</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Flashcards</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Loading state */}
        {isLoadingLesson ? (
          <div className="flex justify-center items-center py-24 text-slate-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400"></div>
          </div>
        ) : isLessonCompleted ? (
          <Card className="flex flex-col items-center justify-center p-8 sm:p-12 text-center shadow-2xl gap-5 bg-slate-900/90 border-slate-800">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-8 ring-emerald-500/10 animate-bounce">
              <Trophy className="w-10 h-10" />
            </div>

            <div>
              <CardTitle className="text-2xl text-slate-100">
                Lesson {currentLessonNumber} Complete!
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                You've reviewed all 25 characters in this lesson.
              </CardDescription>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-sm my-2">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                  Learned
                </span>
                <span className="text-2xl font-bold text-emerald-400">
                  {learnedInLesson} / 25
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                  In-Progress
                </span>
                <span className="text-2xl font-bold text-amber-400">
                  {inProgressInLesson} / 25
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  playSound('click');
                  setIsLessonCompleted(false);
                  setCurrentCardIndex(0);
                }}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Review Again</span>
              </Button>

              {currentLessonNumber < 120 && (
                <Button
                  size="lg"
                  onClick={() => handleStartLesson(currentLessonNumber + 1)}
                  className="gap-2"
                >
                  <span>Next Lesson ({currentLessonNumber + 1})</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}

              <Button
                variant="ghost"
                onClick={onBackToLessons}
              >
                Back to All Lessons
              </Button>
            </div>
          </Card>
        ) : lessonViewMode === 'flashcard' && activeDeck.length > 0 ? (
          <div className="w-full">
            <Flashcard
              card={activeDeck[currentCardIndex]}
              cardIndex={currentCardIndex}
              totalCards={activeDeck.length}
              onStatusChange={onStatusChange}
              onPrev={handlePrevCard}
              onNext={handleNextCard}
              onJumpToCard={(idx) => setCurrentCardIndex(idx)}
              cardsList={activeDeck}
            />
          </div>
        ) : (
          <Card className="overflow-hidden border-slate-800 bg-slate-900/90">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                  <th className="py-3 px-4 w-16">Rank</th>
                  <th className="py-3 px-4 w-28">Character</th>
                  <th className="py-3 px-4 w-32">Pinyin</th>
                  <th className="py-3 px-4">Definition</th>
                  <th className="py-3 px-4 w-32 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-sm">
                {lessonCharacters.map((c, idx) => (
                  <tr
                    key={c.frequency_rank}
                    onClick={() => {
                      setCurrentCardIndex(idx);
                      setLessonViewMode('flashcard');
                    }}
                    className="hover:bg-slate-850/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-mono text-xs text-slate-500">
                      #{c.frequency_rank}
                    </td>
                    <td className="py-3 px-4 font-serif text-xl font-bold text-slate-100">
                      {c.character}
                    </td>
                    <td className="py-3 px-4 font-medium text-sky-400">
                      {c.pinyin}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {c.definition}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {c.status === 'learned' ? (
                        <Badge variant="learned">
                          <CheckCircle2 className="w-3 h-3" /> Learned
                        </Badge>
                      ) : c.status === 'in-progress' ? (
                        <Badge variant="inProgress">
                          <Clock className="w-3 h-3" /> In-Progress
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-slate-500">
                          New
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    );
  }

  const totalLearnedAll = lessons.reduce((acc, l) => acc + l.learned_count, 0);
  const totalInProgressAll = lessons.reduce((acc, l) => acc + l.in_progress_count, 0);
  const totalCompletedLessons = lessons.filter((l) => l.learned_count === l.total_count).length;

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto animate-fade-in">
      {/* Curriculum Summary Header Card */}
      <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 backdrop-blur-md shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
                Lessons Curriculum
              </h1>
              <Badge variant="secondary" className="font-mono text-xs px-3 py-1 font-bold text-sky-400 border-slate-700">
                120 Lessons • 3,000 Hanzi
              </Badge>
            </div>
            <p className="text-slate-400 text-sm mt-1.5 max-w-xl leading-relaxed">
              Organized strictly by real-world Chinese usage frequency. Master high-frequency characters in 25-card bite-sized modules for optimal recall.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shrink-0">
            <div className="text-center px-1">
              <span className="block text-2xl font-bold text-emerald-400">
                {totalCompletedLessons}
              </span>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Completed
              </span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center px-1">
              <span className="block text-2xl font-bold text-amber-400">
                {totalInProgressAll}
              </span>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                In-Progress
              </span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center px-1">
              <span className="block text-2xl font-bold text-sky-400">
                {((totalLearnedAll / 3000) * 100).toFixed(1)}%
              </span>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Mastery
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Filter and Search Bar */}
      <Card className="p-3.5 bg-slate-900/80 border-slate-800">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search lessons (e.g. 'Lesson 1' or '25')..."
              className="pl-10 h-9.5 text-xs sm:text-sm bg-slate-950"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(
              [
                { key: 'all', label: 'All Lessons' },
                { key: 'in-progress', label: 'In-Progress' },
                { key: 'completed', label: 'Completed' },
                { key: 'unstarted', label: 'Unstarted' },
              ] as const
            ).map((item) => (
              <Button
                key={item.key}
                size="sm"
                variant={statusFilter === item.key ? 'default' : 'secondary'}
                onClick={() => setStatusFilter(item.key)}
                className="whitespace-nowrap h-8 text-xs font-semibold"
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Grid of Lesson Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredLessons.map((lesson) => {
          const isComplete = lesson.learned_count === lesson.total_count;
          const isInProgress = !isComplete && (lesson.learned_count > 0 || lesson.in_progress_count > 0);
          const percentLearned = (lesson.learned_count / lesson.total_count) * 100;
          const percentInProgress = (lesson.in_progress_count / lesson.total_count) * 100;

          // Get preview characters for this lesson
          const startIndex = (lesson.lesson_number - 1) * 25;
          const previewChars = hanziData.slice(startIndex, startIndex + 4);

          return (
            <Card
              key={lesson.lesson_number}
              onClick={() => handleStartLesson(lesson.lesson_number)}
              className="group p-5 bg-slate-900/90 border-slate-800 hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 select-none hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="font-bold text-base sm:text-lg text-slate-100 group-hover:text-sky-400 transition-colors">
                    Lesson {lesson.lesson_number}
                  </span>
                  {isComplete ? (
                    <Badge variant="learned" className="text-[10px] px-2">
                      <CheckCircle2 className="w-3 h-3" /> Done
                    </Badge>
                  ) : isInProgress ? (
                    <Badge variant="inProgress" className="text-[10px] px-2">
                      In-Progress
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-slate-500 text-[10px] px-2">
                      New
                    </Badge>
                  )}
                </div>

                <div className="text-xs font-mono text-slate-500 mb-3">
                  Rank #{lesson.start_rank} – #{lesson.end_rank}
                </div>

                {/* Character preview chips */}
                <div className="flex items-center gap-1.5">
                  {previewChars.map((p) => (
                    <span
                      key={p.frequency_rank}
                      className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-serif text-sm font-bold text-slate-300 group-hover:border-sky-500/30 group-hover:text-slate-100 transition-colors"
                    >
                      {p.character}
                    </span>
                  ))}
                  <span className="text-[11px] text-slate-600 font-mono pl-0.5">...</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-850">
                  <div
                    style={{ width: `${percentLearned}%` }}
                    className="bg-emerald-500 h-full transition-all duration-300"
                  />
                  <div
                    style={{ width: `${percentInProgress}%` }}
                    className="bg-amber-500 h-full transition-all duration-300"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-medium">
                    {lesson.learned_count} learned
                  </span>
                  {lesson.in_progress_count > 0 ? (
                    <span className="text-amber-400 font-medium">
                      {lesson.in_progress_count} in-prog
                    </span>
                  ) : (
                    <span className="text-slate-500">25 total</span>
                  )}
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-sky-400 transition-colors">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-sky-400/70" />
                  <span>Study 25 Cards</span>
                </span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          );
        })}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-16 text-slate-500 text-sm">
          No lessons match the selected filter.
        </div>
      )}
    </div>
  );
};
