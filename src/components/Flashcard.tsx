import { useState, useEffect } from 'react';
import type { Character, StudyStatus } from '../types';
import { Volume2, CheckCircle2, Clock, RotateCw, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { SentencePopover } from './SentencePopover';
import { getExampleSentence } from '../data/sentences';
import { playSound, speakChinese } from '../utils/audio';

interface FlashcardProps {
  card: Character;
  cardIndex: number;
  totalCards: number;
  onStatusChange: (characterId: number, status: StudyStatus) => void;
  onPrev: () => void;
  onNext: () => void;
  onJumpToCard?: (index: number) => void;
  showCardScrubber?: boolean;
  cardsList?: Character[];
}

export const Flashcard: React.FC<FlashcardProps> = ({
  card,
  cardIndex,
  totalCards,
  onStatusChange,
  onPrev,
  onNext,
  onJumpToCard,
  showCardScrubber = true,
  cardsList = [],
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isExampleOpen, setIsExampleOpen] = useState<boolean>(false);

  const exampleSentence = getExampleSentence(card.character, card.frequency_rank, card.definition);

  useEffect(() => {
    setIsFlipped(false);
    setIsExampleOpen(false);
  }, [card.frequency_rank]);

  const handleFlip = () => {
    playSound('flip');
    setIsFlipped((prev) => !prev);
  };

  const handleSetLearned = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playSound('learned');
    onStatusChange(card.frequency_rank, 'learned');
    if (cardIndex < totalCards - 1) {
      setTimeout(() => onNext(), 150);
    }
  };

  const handleSetInProgress = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playSound('inProgress');
    onStatusChange(card.frequency_rank, 'in-progress');
    if (cardIndex < totalCards - 1) {
      setTimeout(() => onNext(), 150);
    }
  };

  const handleResetToNew = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('click');
    onStatusChange(card.frequency_rank, 'new');
  };

  const handlePlayAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    speakChinese(card.character);
  };

  const handleOpenExample = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (exampleSentence) {
      playSound('click');
      setIsExampleOpen(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // If example popover is open, it has its own listener to close
      if (isExampleOpen) return;

      switch (e.key.toLowerCase()) {
        case 'h':
        case 'arrowleft':
          e.preventDefault();
          onPrev();
          break;
        case 'l':
        case 'arrowright':
          e.preventDefault();
          onNext();
          break;
        case 'j':
          e.preventDefault();
          handleSetLearned();
          break;
        case 'k':
          e.preventDefault();
          handleSetInProgress();
          break;
        case ' ':
          // Space opens the example popover if available, or flips card
          e.preventDefault();
          if (exampleSentence) {
            handleOpenExample();
          } else {
            handleFlip();
          }
          break;
        case 'enter':
        case 'f':
          e.preventDefault();
          handleFlip();
          break;
        case 'e':
        case 's':
          e.preventDefault();
          handleOpenExample();
          break;
        case 'a':
          e.preventDefault();
          handlePlayAudio();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cardIndex, totalCards, card, onPrev, onNext, isExampleOpen, exampleSentence]);

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto select-none">
      {/* Top Card Info Bar */}
      <div className="w-full flex items-center justify-between px-2 mb-3 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs text-slate-200">
            Rank #{card.frequency_rank}
          </Badge>
          {card.hsk_level && (
            <Badge variant="hsk">
              HSK {card.hsk_level}
            </Badge>
          )}
          <span className="text-xs text-slate-500">
            Lesson {card.lesson_number}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {exampleSentence && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleOpenExample}
              className="gap-1.5 text-xs text-sky-400 hover:text-sky-300 border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20"
              title="View Example Sentence (or press Space)"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Example</span>
              <kbd className="font-mono text-[10px] px-1 py-0.2 rounded bg-sky-500/20 text-sky-300">
                Space
              </kbd>
            </Button>
          )}

          {card.status === 'learned' ? (
            <Badge variant="learned">
              <CheckCircle2 className="w-3.5 h-3.5" /> Learned
            </Badge>
          ) : card.status === 'in-progress' ? (
            <Badge variant="inProgress">
              <Clock className="w-3.5 h-3.5" /> In-Progress
            </Badge>
          ) : (
            <Badge variant="outline" className="text-slate-500">
              New
            </Badge>
          )}

          {card.status !== 'new' && (
            <button
              onClick={handleResetToNew}
              title="Reset status to New"
              className="text-[11px] text-slate-500 hover:text-slate-300 px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 3D Flashcard Container */}
      <div
        className="flashcard-perspective w-full h-[360px] sm:h-[400px] cursor-pointer"
        onClick={handleFlip}
      >
        <div className={`flashcard-inner w-full h-full relative ${isFlipped ? 'flipped' : ''}`}>
          
          {/* FRONT SIDE */}
          <div className="flashcard-face flashcard-front absolute inset-0 rounded-3xl bg-slate-900 border-2 border-slate-800 hover:border-sky-500/50 shadow-2xl flex flex-col justify-between p-6 sm:p-8 transition-all">
            <div className="flex justify-between items-start w-full">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold">
                Front
              </span>
              <Button
                size="icon"
                variant="secondary"
                onClick={handlePlayAudio}
                className="rounded-full"
                title="Play pronunciation (or press 'a')"
              >
                <Volume2 className="w-5 h-5 text-slate-300 hover:text-sky-400" />
              </Button>
            </div>

            {/* Main Character */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-8xl sm:text-9xl font-serif text-slate-50 text-center leading-none tracking-normal transform transition-transform hover:scale-105">
                {card.character}
              </div>
            </div>

            <div className="flex items-center justify-between w-full pt-3 border-t border-slate-800/80 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5" /> Click or <kbd className="font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">Enter</kbd> to flip
              </span>
              <span className="font-mono text-slate-400">
                {cardIndex + 1} / {totalCards}
              </span>
            </div>
          </div>

          {/* BACK SIDE */}
          <div className="flashcard-face flashcard-back absolute inset-0 rounded-3xl bg-slate-900 border-2 border-sky-500/50 shadow-2xl flex flex-col justify-between p-6 sm:p-8">
            <div className="flex justify-between items-start w-full">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-serif font-bold text-slate-100">
                  {card.character}
                </span>
                <Button
                  size="iconSm"
                  variant="secondary"
                  onClick={handlePlayAudio}
                  className="rounded-full"
                  title="Play pronunciation (or press 'a')"
                >
                  <Volume2 className="w-4 h-4 text-slate-300 hover:text-sky-400" />
                </Button>
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-semibold">
                Back
              </span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center px-2 py-4 gap-4">
              <div className="text-3xl sm:text-4xl font-bold text-sky-400 tracking-wide">
                {card.pinyin}
              </div>

              <div className="text-lg sm:text-xl text-slate-100 font-medium max-w-md leading-relaxed">
                {card.definition || 'No definition available'}
              </div>

              <div className="flex flex-wrap justify-center gap-2 mt-2 pt-3 border-t border-slate-800 w-full max-w-sm">
                {card.radical && (
                  <Badge variant="secondary" className="font-normal text-xs text-slate-300">
                    Radical: <strong className="font-serif text-slate-100 ml-1">{card.radical}</strong> ({card.radical_code})
                  </Badge>
                )}
                {card.stroke_count && (
                  <Badge variant="secondary" className="font-normal text-xs text-slate-300">
                    Strokes: <strong className="text-slate-100 ml-1">{card.stroke_count}</strong>
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between w-full pt-3 border-t border-slate-800/80 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5" /> Click or <kbd className="font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">Enter</kbd> to flip
              </span>
              <span className="font-mono text-slate-400">
                {cardIndex + 1} / {totalCards}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full mt-5 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3 w-full">
          <Button
            variant={card.status === 'in-progress' ? 'inProgress' : 'inProgressOutline'}
            size="lg"
            onClick={handleSetInProgress}
            className="w-full justify-between px-5"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>In-Progress</span>
            </div>
            <kbd className="font-mono text-xs px-1.5 py-0.5 rounded bg-black/30 text-current border border-current/20">
              k
            </kbd>
          </Button>

          <Button
            variant={card.status === 'learned' ? 'learned' : 'learnedOutline'}
            size="lg"
            onClick={handleSetLearned}
            className="w-full justify-between px-5"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Learned</span>
            </div>
            <kbd className="font-mono text-xs px-1.5 py-0.5 rounded bg-black/30 text-current border border-current/20">
              j
            </kbd>
          </Button>
        </div>

        {/* Prev / Next & Flip */}
        <div className="flex items-center justify-between w-full pt-1">
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={cardIndex === 0}
            className="flex items-center gap-1.5"
            title="Previous Card (or press 'h')"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
            <kbd className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              h
            </kbd>
          </Button>

          <Button
            variant="secondary"
            onClick={handleFlip}
            className="flex items-center gap-1.5"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Flip</span>
            <kbd className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              Enter
            </kbd>
          </Button>

          <Button
            variant="outline"
            onClick={onNext}
            disabled={cardIndex === totalCards - 1}
            className="flex items-center gap-1.5"
            title="Next Card (or press 'l')"
          >
            <span>Next</span>
            <kbd className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              l
            </kbd>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Scrubber */}
      {showCardScrubber && cardsList.length > 0 && (
        <div className="w-full mt-4 pt-3 border-t border-slate-800 flex flex-col items-center gap-1.5">
          <div className="flex items-center justify-between w-full text-xs text-slate-400 px-1">
            <span>Lesson Progress ({cardsList.filter((c) => c.status === 'learned').length}/{cardsList.length} learned)</span>
            <span className="font-mono text-slate-300">Card {cardIndex + 1} of {cardsList.length}</span>
          </div>

          <div className="w-full flex items-center justify-between gap-1 overflow-x-auto py-1 px-0.5">
            {cardsList.map((item, idx) => {
              const isCurrent = idx === cardIndex;
              let dotColor = 'bg-slate-800 hover:bg-slate-700';
              if (item.status === 'learned') dotColor = 'bg-emerald-500';
              else if (item.status === 'in-progress') dotColor = 'bg-amber-500';

              return (
                <button
                  key={item.frequency_rank}
                  onClick={() => onJumpToCard?.(idx)}
                  title={`#${item.frequency_rank}: ${item.character} (${item.pinyin}) - ${item.status}`}
                  className={`h-2.5 rounded-full transition-all flex-1 min-w-[8px] cursor-pointer ${dotColor} ${
                    isCurrent ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-[#0b0f17] scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts reminder footer */}
      <div className="mt-4 text-center text-xs text-slate-500 flex items-center justify-center gap-3 flex-wrap font-mono">
        <span><kbd className="bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">h</kbd> Left</span>
        <span><kbd className="bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">l</kbd> Right</span>
        <span><kbd className="bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">j</kbd> Learned</span>
        <span><kbd className="bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">k</kbd> In-Progress</span>
        <span><kbd className="bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">Space</kbd> Example</span>
        <span><kbd className="bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">Enter</kbd> Flip</span>
        <span><kbd className="bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">a</kbd> Audio</span>
      </div>

      {/* Sentence Popover */}
      <SentencePopover
        isOpen={isExampleOpen}
        character={card.character}
        pinyin={card.pinyin}
        rank={card.frequency_rank}
        sentence={exampleSentence}
        onClose={() => setIsExampleOpen(false)}
      />
    </div>
  );
};
