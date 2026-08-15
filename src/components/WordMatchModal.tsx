import React, { useState } from 'react';
import type { Character } from '../types';
import { getWordPairsForQuiz, type WordPairItem } from '../data/words';
import {
  X,
  RotateCcw,
  Trophy,
  Volume2,
  Zap,
  ArrowRight,
  Flame,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import confetti from 'canvas-confetti';
import { speakChinese, playSound } from '../utils/audio';

interface WordMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceCards?: Character[];
  title?: string;
  onGoToLessons?: () => void;
}

interface ColumnCard {
  id: string;
  char: string;
  wordId: string;
  isMatched: boolean;
}

export const WordMatchModal: React.FC<WordMatchModalProps> = ({
  isOpen,
  onClose,
  sourceCards = [],
  title = '2-Character Word Match (Learned & In-Progress)',
  onGoToLessons,
}) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const [activePairs, setActivePairs] = useState<WordPairItem[]>([]);
  const [leftCards, setLeftCards] = useState<ColumnCard[]>([]);
  const [rightCards, setRightCards] = useState<ColumnCard[]>([]);

  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [selectedRightId, setSelectedRightId] = useState<string | null>(null);
  const [wrongMatch, setWrongMatch] = useState<{ leftId: string; rightId: string } | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<WordPairItem[]>([]);
  const [isRoundComplete, setIsRoundComplete] = useState(false);

  // Initialize a round
  const startNewRound = (roundNum: number = 1) => {
    const pairs = getWordPairsForQuiz(sourceCards, 6);
    setActivePairs(pairs);
    setMatchedPairs([]);
    setSelectedLeftId(null);
    setSelectedRightId(null);
    setWrongMatch(null);
    setIsRoundComplete(false);

    // Prepare left (1st char) and right (2nd char) columns shuffled
    const left: ColumnCard[] = pairs.map((p, idx) => ({
      id: `left-${p.id}-${idx}`,
      char: p.char1,
      wordId: p.id,
      isMatched: false,
    })).sort(() => Math.random() - 0.5);

    const right: ColumnCard[] = pairs.map((p, idx) => ({
      id: `right-${p.id}-${idx}`,
      char: p.char2,
      wordId: p.id,
      isMatched: false,
    })).sort(() => Math.random() - 0.5);

    setLeftCards(left);
    setRightCards(right);
    setRound(roundNum);
  };

  // Reset game state whenever modal opens
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  if (isOpen && !prevIsOpen) {
    setPrevIsOpen(true);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    startNewRound(1);
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  const handleSelectLeft = (card: ColumnCard) => {
    if (card.isMatched) return;
    playSound('click');
    setSelectedLeftId(card.id);

    // If a right card is already selected, evaluate match
    if (selectedRightId) {
      evaluateMatch(card.id, selectedRightId);
    }
  };

  const handleSelectRight = (card: ColumnCard) => {
    if (card.isMatched) return;
    playSound('click');
    setSelectedRightId(card.id);

    // If a left card is already selected, evaluate match
    if (selectedLeftId) {
      evaluateMatch(selectedLeftId, card.id);
    }
  };

  const evaluateMatch = (leftId: string, rightId: string) => {
    const leftCard = leftCards.find((c) => c.id === leftId);
    const rightCard = rightCards.find((c) => c.id === rightId);

    if (!leftCard || !rightCard) return;

    if (leftCard.wordId === rightCard.wordId) {
      // MATCH SUCCESS!
      const matched = activePairs.find((p) => p.id === leftCard.wordId);
      if (matched) {
        speakChinese(matched.word);
        playSound('learned');

        setMatchedPairs((prev) => [...prev, matched]);
        setLeftCards((prev) =>
          prev.map((c) => (c.id === leftId ? { ...c, isMatched: true } : c))
        );
        setRightCards((prev) =>
          prev.map((c) => (c.id === rightId ? { ...c, isMatched: true } : c))
        );

        const newStreak = streak + 1;
        setStreak(newStreak);
        setBestStreak((prev) => Math.max(prev, newStreak));
        setScore((prev) => prev + 100 * newStreak);

        setSelectedLeftId(null);
        setSelectedRightId(null);

        // Check if all pairs in round are matched
        if (matchedPairs.length + 1 >= activePairs.length) {
          setTimeout(() => {
            setIsRoundComplete(true);
            playSound('complete');
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
              });
            } catch {
              // Ignore confetti error
            }
          }, 350);
        }
      }
    } else {
      // WRONG MATCH
      setWrongMatch({ leftId, rightId });
      playSound('flip');
      setStreak(0);

      setTimeout(() => {
        setWrongMatch(null);
        setSelectedLeftId(null);
        setSelectedRightId(null);
      }, 400);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <Card className="relative w-full max-w-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh] flex flex-col border-slate-800 bg-slate-925">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-emerald-500/20 border border-sky-500/30 text-sky-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-100">
                  {title}
                </h2>
                {activePairs.length > 0 && (
                  <Badge variant="hsk" className="text-xs">
                    Round {round}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Match 1st and 2nd characters to form legitimate 2-character words from your studied vocabulary
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Score & Streak */}
            {activePairs.length > 0 && (
              <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
                <div className="flex items-center gap-1 text-amber-400">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>Streak: {streak} (Best: {bestStreak})</span>
                </div>
                <div className="h-3 w-px bg-slate-700" />
                <div className="text-emerald-400 font-bold">
                  {score} pts
                </div>
              </div>
            )}

            {activePairs.length > 0 && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => startNewRound(1)}
                title="Restart Game"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            )}

            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Game Area */}
        {activePairs.length === 0 ? (
          /* EMPTY STATE (NO LEARNED/IN-PROGRESS CHARACTERS WITH WORDS) */
          <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center gap-4 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-lg shadow-amber-500/5">
              <Zap className="w-8 h-8" />
            </div>

            <div>
              <CardTitle className="text-xl text-slate-100">
                No Studied Words Yet
              </CardTitle>
              <CardDescription className="text-sm mt-1.5 max-w-md mx-auto text-slate-400 leading-relaxed">
                Word Match tests 2-character compounds from characters you've marked as <strong className="text-emerald-400 font-medium">Learned</strong> or <strong className="text-amber-400 font-medium">In-Progress</strong>. Study cards in the Lessons tab to unlock word matching!
              </CardDescription>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <Button
                onClick={() => {
                  onClose();
                  onGoToLessons?.();
                }}
                className="gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Go to Lessons</span>
              </Button>
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        ) : isRoundComplete ? (
          /* ROUND COMPLETED SUMMARY */
          <div className="flex flex-col items-center justify-center p-6 text-center gap-5 animate-fade-in">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-8 ring-emerald-500/10 animate-bounce">
              <Trophy className="w-10 h-10" />
            </div>

            <div>
              <CardTitle className="text-2xl text-slate-100">
                Round {round} Completed!
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                You correctly formed all {activePairs.length} 2-character words.
              </CardDescription>
            </div>

            {/* Matched Words Recap */}
            <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-2 text-left">
              {matchedPairs.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => speakChinese(p.word)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-serif font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                        {p.word}
                      </span>
                      <span className="text-xs font-semibold text-sky-400 font-sans">
                        {p.pinyin}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 truncate max-w-[190px] mt-0.5">
                      {p.meaning}
                    </p>
                  </div>
                  <Volume2 className="w-4 h-4 text-slate-500 group-hover:text-sky-400 shrink-0" />
                </div>
              ))}
            </div>

            {/* Next Round Button */}
            <div className="flex items-center gap-3 mt-3">
              <Button
                size="lg"
                onClick={() => startNewRound(round + 1)}
                className="gap-2 shadow-lg shadow-sky-500/25 px-8"
              >
                <span>Next Round ({round + 1})</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={onClose}
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          /* ACTIVE MATCHING BOARD */
          <div className="flex flex-col gap-6">
            {/* Guide text */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Click a character from the Left, then its match on the Right</span>
              <span className="font-mono text-emerald-400 font-semibold">
                {matchedPairs.length} / {activePairs.length} matched
              </span>
            </div>

            {/* Two Column Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-8">
              {/* LEFT COLUMN: 1st Character */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold text-center pb-1 border-b border-slate-800">
                  1st Character (前字)
                </span>
                <div className="flex flex-col gap-2.5">
                  {leftCards.map((c) => {
                    const isSelected = selectedLeftId === c.id;
                    const isWrong = wrongMatch?.leftId === c.id;

                    return (
                      <button
                        key={c.id}
                        disabled={c.isMatched}
                        onClick={() => handleSelectLeft(c)}
                        className={`h-14 rounded-2xl border text-xl sm:text-2xl font-serif font-bold transition-all flex items-center justify-center cursor-pointer select-none relative ${
                          c.isMatched
                            ? 'bg-slate-900/30 border-slate-850 text-slate-600 opacity-40 cursor-default line-through'
                            : isWrong
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-shake scale-95'
                            : isSelected
                            ? 'bg-sky-500/20 border-sky-400 text-sky-300 ring-2 ring-sky-400/50 scale-102 shadow-lg shadow-sky-500/20'
                            : 'bg-slate-900/90 border-slate-800 text-slate-100 hover:border-sky-500/50 hover:bg-slate-850 hover:scale-101'
                        }`}
                      >
                        <span>{c.char}</span>
                        {c.isMatched && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: 2nd Character */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold text-center pb-1 border-b border-slate-800">
                  2nd Character (后字)
                </span>
                <div className="flex flex-col gap-2.5">
                  {rightCards.map((c) => {
                    const isSelected = selectedRightId === c.id;
                    const isWrong = wrongMatch?.rightId === c.id;

                    return (
                      <button
                        key={c.id}
                        disabled={c.isMatched}
                        onClick={() => handleSelectRight(c)}
                        className={`h-14 rounded-2xl border text-xl sm:text-2xl font-serif font-bold transition-all flex items-center justify-center cursor-pointer select-none relative ${
                          c.isMatched
                            ? 'bg-slate-900/30 border-slate-850 text-slate-600 opacity-40 cursor-default line-through'
                            : isWrong
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-shake scale-95'
                            : isSelected
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/50 scale-102 shadow-lg shadow-emerald-500/20'
                            : 'bg-slate-900/90 border-slate-800 text-slate-100 hover:border-emerald-500/50 hover:bg-slate-850 hover:scale-101'
                        }`}
                      >
                        <span>{c.char}</span>
                        {c.isMatched && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Matched Words Feed */}
            {matchedPairs.length > 0 && (
              <div className="mt-2 pt-4 border-t border-slate-800 flex flex-col gap-2">
                <span className="text-[11px] uppercase tracking-wider font-mono text-slate-400 font-semibold">
                  Matched Words in this round:
                </span>
                <div className="flex flex-wrap gap-2">
                  {matchedPairs.map((p, idx) => (
                    <div
                      key={idx}
                      onClick={() => speakChinese(p.word)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-slate-200 cursor-pointer hover:bg-emerald-500/20 transition-all"
                      title="Click to replay audio"
                    >
                      <span className="font-serif font-bold text-emerald-400 text-sm">
                        {p.word}
                      </span>
                      <span className="font-sans text-sky-400 font-semibold text-[11px]">
                        {p.pinyin}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        • {p.meaning}
                      </span>
                      <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
