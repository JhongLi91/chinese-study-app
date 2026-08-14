import { useState, useMemo } from 'react';
import type { Character, LessonInfo, StudyStatus } from '../types';
import { Flashcard } from './Flashcard';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Search,
  Shuffle,
  ChevronRight,
  RotateCcw,
  Trophy,
  List,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/audio';

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
      } catch (e) {}
    }
  };

  if (currentLessonNumber !== null) {
    const lessonInfo = lessons.find((l) => l.lesson_number === currentLessonNumber);
    const learnedInLesson = lessonCharacters.filter((c) => c.status === 'learned').length;
    const inProgressInLesson = lessonCharacters.filter((c) => c.status === 'in-progress').length;

    return (
      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto animate-fade-in">
        {/* Lesson Study Header */}
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={onBackToLessons}
                className="gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Lessons</span>
              </Button>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                  <span>Lesson {currentLessonNumber}</span>
                  <Badge variant="outline" className="font-mono font-normal text-xs text-slate-300">
                    Ranks #{lessonInfo?.start_rank} - #{lessonInfo?.end_rank}
                  </Badge>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {learnedInLesson} of 25 learned • {inProgressInLesson} in-progress
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
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
          <Card className="flex flex-col items-center justify-center p-8 sm:p-12 text-center shadow-2xl gap-5">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-8 ring-emerald-500/10 animate-bounce">
              <Trophy className="w-10 h-10" />
            </div>

            <div>
              <CardTitle className="text-2xl">
                Lesson {currentLessonNumber} Complete!
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                You've reviewed all 25 characters in this lesson.
              </CardDescription>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-sm my-2">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                  Learned
                </span>
                <span className="text-2xl font-bold text-emerald-400">
                  {learnedInLesson} / 25
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
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
          <Card className="overflow-hidden">
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
  const totalCompletedLessons = lessons.filter((l) => l.learned_count === l.total_count).length;

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      {/* Header Banner */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
                Lessons Curriculum
              </h1>
              <Badge variant="secondary" className="font-mono text-xs px-3 py-1 font-bold text-sky-400">
                120 Lessons • 3,000 Hanzi
              </Badge>
            </div>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Characters are organized by frequency into 120 lessons of 25 characters each. Master high-frequency characters first for maximum reading comprehension.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700 shrink-0">
            <div className="text-center">
              <span className="block text-2xl font-bold text-emerald-400">
                {totalCompletedLessons}
              </span>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Completed
              </span>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center">
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
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search lessons (e.g. 'Lesson 1' or '25')..."
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
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
                className="whitespace-nowrap"
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

          return (
            <Card
              key={lesson.lesson_number}
              onClick={() => handleStartLesson(lesson.lesson_number)}
              className="group p-5 hover:border-sky-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-bold text-lg text-slate-100 group-hover:text-sky-400 transition-colors">
                    Lesson {lesson.lesson_number}
                  </span>
                  {isComplete ? (
                    <Badge variant="learned">
                      <CheckCircle2 className="w-3 h-3" />
                    </Badge>
                  ) : isInProgress ? (
                    <Badge variant="inProgress">
                      In-Progress
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-slate-500">
                      New
                    </Badge>
                  )}
                </div>

                <div className="text-xs font-mono text-slate-500">
                  Rank #{lesson.start_rank} – #{lesson.end_rank}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${percentLearned}%` }}
                    className="bg-emerald-500 h-full transition-all"
                  />
                  <div
                    style={{ width: `${percentInProgress}%` }}
                    className="bg-amber-500 h-full transition-all"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-semibold">
                    {lesson.learned_count} learned
                  </span>
                  {lesson.in_progress_count > 0 && (
                    <span className="text-amber-400 font-semibold">
                      {lesson.in_progress_count} studying
                    </span>
                  )}
                  <span className="text-slate-500">25 total</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-sky-400 transition-colors">
                <span>Study 25 Cards</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          );
        })}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No lessons match the selected filter.
        </div>
      )}
    </div>
  );
};
