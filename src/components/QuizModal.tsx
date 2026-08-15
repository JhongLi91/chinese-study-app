import React, { useState } from 'react';
import type { Character, StudyStatus } from '../types';
import { Flashcard } from './Flashcard';
import { X, Shuffle, Trophy, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/audio';

interface QuizModalProps {
  title: string;
  sourceCards: Character[];
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (characterId: number, status: StudyStatus) => void;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  title,
  sourceCards,
  isOpen,
  onClose,
  onStatusChange,
}) => {
  const [deck, setDeck] = useState<Character[]>(() => shuffleArray(sourceCards));
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [learnedCountInSession, setLearnedCountInSession] = useState<number>(0);
  const [inProgressCountInSession, setInProgressCountInSession] = useState<number>(0);

  // Re-initialize whenever modal transitions to open
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  if (isOpen && !prevIsOpen) {
    setPrevIsOpen(true);
    setDeck(shuffleArray(sourceCards));
    setCurrentIndex(0);
    setIsCompleted(false);
    setLearnedCountInSession(0);
    setInProgressCountInSession(0);
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  const handleRestart = () => {
    playSound('click');
    setDeck(shuffleArray(sourceCards));
    setCurrentIndex(0);
    setIsCompleted(false);
    setLearnedCountInSession(0);
    setInProgressCountInSession(0);
  };

  const handleCardStatusChange = (characterId: number, status: StudyStatus) => {
    if (status === 'learned') {
      setLearnedCountInSession((c) => c + 1);
    } else if (status === 'in-progress') {
      setInProgressCountInSession((c) => c + 1);
    }

    setDeck((prevDeck) =>
      prevDeck.map((card) =>
        card.frequency_rank === characterId ? { ...card, status } : card
      )
    );

    onStatusChange(characterId, status);

    if (currentIndex === deck.length - 1) {
      setTimeout(() => {
        setIsCompleted(true);
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
      }, 300);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      playSound('complete');
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore confetti error
      }
    }
  };

  if (!isOpen) return null;

  const currentCard = deck[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <Card className="relative w-full max-w-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[95vh] flex flex-col border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Shuffle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-100">
                {title}
              </h2>
              <p className="text-xs text-slate-400">
                Randomized Flashcard Quiz ({deck.length} cards)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleRestart}
              title="Reshuffle and Restart"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              title="Exit Quiz (Escape)"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Body */}
        {isCompleted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center ring-8 ring-amber-500/10 animate-bounce">
              <Trophy className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-100">
                Quiz Complete!
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                You went through all {deck.length} characters in this session.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-sm my-2">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                  Marked Learned
                </span>
                <span className="text-2xl font-bold text-emerald-400">
                  {learnedCountInSession}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                  Marked In-Progress
                </span>
                <span className="text-2xl font-bold text-amber-400">
                  {inProgressCountInSession}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <Button
                size="lg"
                onClick={handleRestart}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Shuffle & Repeat</span>
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={onClose}
              >
                <span>Back to List</span>
              </Button>
            </div>
          </div>
        ) : currentCard ? (
          <div className="w-full">
            <Flashcard
              card={currentCard}
              cardIndex={currentIndex}
              totalCards={deck.length}
              onStatusChange={handleCardStatusChange}
              onPrev={handlePrev}
              onNext={handleNext}
              onJumpToCard={(idx) => setCurrentIndex(idx)}
              cardsList={deck}
            />
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            No characters found for this quiz.
          </div>
        )}
      </Card>
    </div>
  );
};
