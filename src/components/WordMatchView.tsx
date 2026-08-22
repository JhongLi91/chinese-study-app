import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Character } from '../types';
import { getWordPairsForQuiz, type WordPairItem } from '../data/words';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import {
  RotateCcw,
  Volume2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BookOpen,
  HelpCircle,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakChinese, playSound } from '../utils/audio';

interface WordMatchViewProps {
  learnedCharacters?: Character[];
  inProgressCharacters?: Character[];
  allCharacters: Character[];
  onGoToLessons: () => void;
}

interface ColumnCard {
  id: string;
  char: string;
  wordId: string;
  isMatched: boolean;
}

type DifficultyLevel = 4 | 6 | 8;
type PoolFilter = 'studied' | 'custom';

export const WordMatchView: React.FC<WordMatchViewProps> = ({
  learnedCharacters = [],
  inProgressCharacters = [],
  allCharacters = [],
  onGoToLessons,
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(6);
  const [poolFilter, setPoolFilter] = useState<PoolFilter>('studied');
  const [customRangeStart, setCustomRangeStart] = useState<number | ''>(400);
  const [customRangeEnd, setCustomRangeEnd] = useState<number | ''>(800);
  const [includeInProgress, setIncludeInProgress] = useState<boolean>(true);
  const [includeLearned, setIncludeLearned] = useState<boolean>(true);

  const [round, setRound] = useState(1);

  const [activePairs, setActivePairs] = useState<WordPairItem[]>([]);
  const [leftCards, setLeftCards] = useState<ColumnCard[]>([]);
  const [rightCards, setRightCards] = useState<ColumnCard[]>([]);

  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [selectedRightId, setSelectedRightId] = useState<string | null>(null);
  const [wrongMatch, setWrongMatch] = useState<{ leftId: string; rightId: string } | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<WordPairItem[]>([]);
  const [isRoundComplete, setIsRoundComplete] = useState(false);

  // Selected Character Pool
  const effectivePool = useMemo(() => {
    if (poolFilter === 'studied') {
      const studied = [];
      if (includeLearned) {
        studied.push(...learnedCharacters);
      }
      if (includeInProgress) {
        studied.push(...inProgressCharacters);
      }
      if (studied.length >= 4) return studied;
      // Fallback to core if studied pool is too small
      return allCharacters.slice(0, 300);
    }
    if (poolFilter === 'custom') {
      const start = customRangeStart === '' ? 1 : customRangeStart;
      const end = customRangeEnd === '' ? 1 : customRangeEnd;
      return allCharacters.slice(
        Math.max(0, start - 1),
        Math.min(allCharacters.length, end)
      );
    }
    return allCharacters;
  }, [poolFilter, learnedCharacters, inProgressCharacters, allCharacters, includeInProgress, includeLearned, customRangeStart, customRangeEnd]);

  // Start / Reset Round
  const startNewRound = useCallback(
    (roundNum: number = 1) => {
      const pairs = getWordPairsForQuiz(effectivePool, difficulty);
      setActivePairs(pairs);
      setMatchedPairs([]);
      setSelectedLeftId(null);
      setSelectedRightId(null);
      setWrongMatch(null);
      setIsRoundComplete(false);

      const left: ColumnCard[] = pairs
        .map((p, idx) => ({
          id: `left-${p.id}-${idx}`,
          char: p.char1,
          wordId: p.id,
          isMatched: false,
        }))
        .sort(() => Math.random() - 0.5);

      const right: ColumnCard[] = pairs
        .map((p, idx) => ({
          id: `right-${p.id}-${idx}`,
          char: p.char2,
          wordId: p.id,
          isMatched: false,
        }))
        .sort(() => Math.random() - 0.5);

      setLeftCards(left);
      setRightCards(right);
      setRound(roundNum);
    },
    [effectivePool, difficulty]
  );

  // Trigger round start on mount or filter / difficulty change
  useEffect(() => {
    startNewRound(1);
  }, [startNewRound]);

  // Evaluate Match
  const evaluateMatch = (leftId: string, rightId: string) => {
    const leftCard = leftCards.find((c) => c.id === leftId);
    const rightCard = rightCards.find((c) => c.id === rightId);

    if (!leftCard || !rightCard) return;

    if (leftCard.wordId === rightCard.wordId) {
      // SUCCESSFUL MATCH
      const matchedPair = activePairs.find((p) => p.id === leftCard.wordId);
      if (matchedPair) {
        speakChinese(matchedPair.word, 1.0);
        playSound('learned');

        setLeftCards((prev) =>
          prev.map((c) => (c.id === leftId ? { ...c, isMatched: true } : c))
        );
        setRightCards((prev) =>
          prev.map((c) => (c.id === rightId ? { ...c, isMatched: true } : c))
        );

        setMatchedPairs((prev) => {
          const next = [...prev, matchedPair];
          if (next.length === activePairs.length && activePairs.length > 0) {
            setIsRoundComplete(true);
            playSound('complete');
            try {
              void confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
              });
            } catch {
              // ignore
            }
          }
          return next;
        });
      }

      setSelectedLeftId(null);
      setSelectedRightId(null);
    } else {
      // INCORRECT MATCH
      playSound('flip');
      setWrongMatch({ leftId, rightId });

      setTimeout(() => {
        setWrongMatch(null);
        setSelectedLeftId(null);
        setSelectedRightId(null);
      }, 700);
    }
  };

  const handleSelectLeft = (card: ColumnCard) => {
    if (card.isMatched) return;
    playSound('click');
    setSelectedLeftId(card.id);

    if (selectedRightId) {
      evaluateMatch(card.id, selectedRightId);
    }
  };

  const handleSelectRight = (card: ColumnCard) => {
    if (card.isMatched) return;
    playSound('click');
    setSelectedRightId(card.id);

    if (selectedLeftId) {
      evaluateMatch(selectedLeftId, card.id);
    }
  };

  const selectedLeftCard = leftCards.find((c) => c.id === selectedLeftId);
  const selectedRightCard = rightCards.find((c) => c.id === selectedRightId);

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-16">
      {/* Hero Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[slate-900] to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-2.5 py-0.5 text-xs border-amber-500/40 text-amber-300 bg-amber-500/10">
                Mini Game • 组词配对
              </Badge>
              <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-mono">
                Round {round}
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 tracking-tight">
              2-Character Word Match (组词配对)
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Match the first character (字头) on the left with the second character (字尾) on the right to construct real 2-character Chinese words. Test your character combinations and reinforce associative memory.
            </p>
          </div>
        </div>
      </div>

      {/* Control Strip & Pool Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl backdrop-blur-sm">
        {/* Pool Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-400 px-2 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-sky-400" /> Pool:
          </span>
          <button
            type="button"
            onClick={() => setPoolFilter('studied')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              poolFilter === 'studied'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            My Studied Words ({(includeLearned ? learnedCharacters.length : 0) + (includeInProgress ? inProgressCharacters.length : 0)})
          </button>

          <button
            type="button"
            onClick={() => setPoolFilter('custom')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              poolFilter === 'custom'
                ? 'bg-fuchsia-500 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Custom Range
          </button>
        </div>

        {/* Difficulty & New Game Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setDifficulty(4)}
              className={`px-2 py-1 rounded-lg ${
                difficulty === 4 ? 'bg-slate-800 text-sky-400 font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="4 Pairs (Casual)"
            >
              4 Pairs
            </button>
            <button
              type="button"
              onClick={() => setDifficulty(6)}
              className={`px-2 py-1 rounded-lg ${
                difficulty === 6 ? 'bg-slate-800 text-sky-400 font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="6 Pairs (Standard)"
            >
              6 Pairs
            </button>
            <button
              type="button"
              onClick={() => setDifficulty(8)}
              className={`px-2 py-1 rounded-lg ${
                difficulty === 8 ? 'bg-slate-800 text-sky-400 font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="8 Pairs (Expert Challenge)"
            >
              8 Pairs
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => startNewRound(round)}
            className="h-8 text-xs font-semibold gap-1.5 border-slate-700 text-slate-300 hover:text-white"
            title="Reshuffle current pairs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reshuffle</span>
          </Button>
        </div>
      </div>

      {/* Extra Options Strip */}
      {(poolFilter === 'custom' || poolFilter === 'studied') && (
        <div className="flex flex-wrap items-center gap-4 bg-slate-900/40 border border-slate-800/60 p-3 rounded-xl backdrop-blur-sm -mt-2">
          {poolFilter === 'custom' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Rank Range:</span>
              <input
                type="number"
                min={1}
                max={3000}
                value={customRangeStart}
                onChange={(e) => setCustomRangeStart(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 outline-none focus:border-fuchsia-500"
              />
              <span className="text-slate-500">to</span>
              <input
                type="number"
                min={1}
                max={3000}
                value={customRangeEnd}
                onChange={(e) => setCustomRangeEnd(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 outline-none focus:border-fuchsia-500"
              />
            </div>
          )}
          {poolFilter === 'studied' && (
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeLearned}
                  onChange={(e) => setIncludeLearned(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500/30 w-4 h-4"
                />
                <span className="text-slate-300 font-medium">Include Learned Words ({learnedCharacters.length})</span>
              </label>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeInProgress}
                  onChange={(e) => setIncludeInProgress(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-sky-500 focus:ring-sky-500/30 w-4 h-4"
                />
                <span className="text-slate-300 font-medium">Include In-Progress Words ({inProgressCharacters.length})</span>
              </label>
            </div>
          )}
        </div>
      )}

      {/* Main Matching Arena */}
      {activePairs.length === 0 ? (
        <Card className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-4">
          <BookOpen className="w-12 h-12 text-slate-500" />
          <h3 className="text-lg font-bold text-slate-200">No Word Associations Available Yet</h3>
          <p className="text-xs text-slate-400 max-w-md">
            You don't have enough learned or in-progress characters yet to generate custom pairs. Try complete your first lessons or using a Custom Range.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <Button size="sm" variant="default" onClick={() => setPoolFilter('custom')}>
              Play with Custom Range
            </Button>
            <Button size="sm" variant="outline" onClick={onGoToLessons}>
              Go to Lessons
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Pairing Columns Grid (Left + Center Preview + Right) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Live Forming Word Preview Bar */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Selected Pair:</span>
                <div className="flex items-center gap-1.5 font-serif text-2xl font-bold">
                  <span
                    className={`px-3 py-1 rounded-xl border transition-all ${
                      selectedLeftCard
                        ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                        : 'bg-slate-950 border-slate-800 text-slate-600'
                    }`}
                  >
                    {selectedLeftCard ? selectedLeftCard.char : '?'}
                  </span>
                  <span className="text-slate-600">+</span>
                  <span
                    className={`px-3 py-1 rounded-xl border transition-all ${
                      selectedRightCard
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-600'
                    }`}
                  >
                    {selectedRightCard ? selectedRightCard.char : '?'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">
                  {matchedPairs.length} / {activePairs.length} Matched
                </span>
                <div className="w-24 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{
                      width: `${(matchedPairs.length / (activePairs.length || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Two Character Columns */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 bg-[slate-950] border border-slate-800/80 p-5 sm:p-7 rounded-3xl shadow-xl">
              {/* Column 1: First Character (字头) */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/70">
                  <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                    First Character (字头)
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {leftCards.map((card) => {
                    const isSelected = selectedLeftId === card.id;
                    const isWrong = wrongMatch && wrongMatch.leftId === card.id;

                    let btnClass = 'bg-slate-900 border-slate-800 text-slate-100 hover:border-sky-500/50 hover:bg-slate-850 hover:scale-[1.01]';
                    if (card.isMatched) {
                      btnClass = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400/40 opacity-40 cursor-default line-through';
                    } else if (isWrong) {
                      btnClass = 'bg-rose-500/20 border-rose-500/80 text-rose-300 animate-shake';
                    } else if (isSelected) {
                      btnClass = 'bg-sky-500/25 border-sky-400 text-sky-200 shadow-lg shadow-sky-500/20 ring-2 ring-sky-400/30';
                    }

                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => handleSelectLeft(card)}
                        disabled={card.isMatched}
                        className={`w-full flex items-center justify-center py-4 sm:py-5 rounded-2xl border font-serif text-3xl sm:text-4xl font-bold transition-all select-none ${btnClass}`}
                      >
                        {card.char}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Column 2: Second Character (字尾) */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/70">
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    Second Character (字尾)
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {rightCards.map((card) => {
                    const isSelected = selectedRightId === card.id;
                    const isWrong = wrongMatch && wrongMatch.rightId === card.id;

                    let btnClass = 'bg-slate-900 border-slate-800 text-slate-100 hover:border-amber-500/50 hover:bg-slate-850 hover:scale-[1.01]';
                    if (card.isMatched) {
                      btnClass = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400/40 opacity-40 cursor-default line-through';
                    } else if (isWrong) {
                      btnClass = 'bg-rose-500/20 border-rose-500/80 text-rose-300 animate-shake';
                    } else if (isSelected) {
                      btnClass = 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/30';
                    }

                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => handleSelectRight(card)}
                        disabled={card.isMatched}
                        className={`w-full flex items-center justify-center py-4 sm:py-5 rounded-2xl border font-serif text-3xl sm:text-4xl font-bold transition-all select-none ${btnClass}`}
                      >
                        {card.char}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Round Completion Banner */}
            {isRoundComplete && (
              <Card className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border-2 border-emerald-500/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-slate-100">
                      Round {round} Completed! 🏆
                    </h4>
                    <p className="text-xs text-emerald-300">
                      All {activePairs.length} word combinations matched successfully!
                    </p>
                  </div>
                </div>

                <Button
                  variant="default"
                  onClick={() => startNewRound(round + 1)}
                  className="w-full sm:w-auto h-11 px-6 font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl shadow-lg shadow-emerald-500/20 gap-2"
                >
                  <span>Next Round {round + 1}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Card>
            )}
          </div>

          {/* Right Side: Matched Words Vocabulary Log */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Card className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-sm text-slate-100">
                    Discovered Words ({matchedPairs.length}/{activePairs.length})
                  </h3>
                </div>
              </div>

              {matchedPairs.length === 0 ? (
                <div className="py-8 text-center flex flex-col items-center justify-center gap-2 text-slate-500">
                  <HelpCircle className="w-8 h-8 stroke-1" />
                  <p className="text-xs">Match words to view their pinyin & definitions here</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 max-h-[500px] overflow-y-auto pr-1">
                  {matchedPairs.map((pair) => (
                    <div
                      key={pair.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all"
                    >
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif text-lg font-bold text-slate-100">
                            {pair.word}
                          </span>
                          <span className="font-mono text-xs text-sky-400 font-semibold">
                            {pair.pinyin}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {pair.meaning}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => speakChinese(pair.word, 1.0)}
                        className="p-2 text-slate-400 hover:text-sky-300 hover:bg-slate-800 rounded-xl transition-colors shrink-0"
                        title="Pronounce word"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
