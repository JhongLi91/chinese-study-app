import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Character, StudyStatus } from '../types';
import { Volume2, CheckCircle2, Clock, RotateCw, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { SentencePopover } from './SentencePopover';
import { getExampleSentence } from '../data/sentences';
import { getWordAssociations } from '../data/words';
import { playSound, speakChinese, preloadChineseAudio } from '../utils/audio';

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

  // Reset flip and example states when card changes
  const [prevCardRank, setPrevCardRank] = useState<number>(card.frequency_rank);
  if (card.frequency_rank !== prevCardRank) {
    setPrevCardRank(card.frequency_rank);
    setIsFlipped(false);
    setIsExampleOpen(false);
  }

  const exampleSentence = useMemo(() => {
    return getExampleSentence(card.character, card.frequency_rank, card.definition);
  }, [card.character, card.frequency_rank, card.definition]);

  const wordAssociations = useMemo(() => {
    return getWordAssociations(card.character, card.frequency_rank);
  }, [card.character, card.frequency_rank]);

  // Preload audio when card changes
  useEffect(() => {
    if (card?.character) {
      preloadChineseAudio(card.character);
    }
    if (cardsList && cardsList[cardIndex + 1]?.character) {
      preloadChineseAudio(cardsList[cardIndex + 1].character);
    }
  }, [card, cardIndex, cardsList]);

  const handleFlip = useCallback(() => {
    playSound('flip');
    setIsFlipped((prev) => !prev);
  }, []);

  const handleSetLearned = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playSound('learned');
    onStatusChange(card.frequency_rank, 'learned');
    onNext();
  }, [card.frequency_rank, onStatusChange, onNext]);

  const handleSetInProgress = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playSound('inProgress');
    onStatusChange(card.frequency_rank, 'in-progress');
    onNext();
  }, [card.frequency_rank, onStatusChange, onNext]);

  const handleResetToNew = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('click');
    onStatusChange(card.frequency_rank, 'new');
  };

  const handlePlayAudio = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    speakChinese(card.character);
  }, [card.character]);

  const handleOpenExample = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (exampleSentence) {
      playSound('click');
      setIsExampleOpen(true);
    }
  }, [exampleSentence]);

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
        case ';':
        case 'f':
          e.preventDefault();
          handleFlip();
          break;
        case 'e':
        case 's':
          e.preventDefault();
          handleOpenExample();
          break;
        case 'o':
          e.preventDefault();
          handlePlayAudio();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onPrev,
    onNext,
    handleSetLearned,
    handleSetInProgress,
    handleFlip,
    handleOpenExample,
    handlePlayAudio,
    isExampleOpen,
    exampleSentence,
  ]);

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
                title="Play pronunciation (or press 'o')"
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
                <RotateCw className="w-3.5 h-3.5" /> Click or <kbd className="font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">;</kbd> to flip
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
                  title="Play pronunciation (or press 'o')"
                >
                  <Volume2 className="w-4 h-4 text-slate-300 hover:text-sky-400" />
                </Button>
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-semibold">
                Back
              </span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center px-2 py-3 gap-3">
              <div className="text-3xl sm:text-4xl font-bold text-sky-400 tracking-wide">
                {card.pinyin}
              </div>

              <div className="text-base sm:text-lg text-slate-100 font-medium max-w-md leading-relaxed">
                {card.definition || 'No definition available'}
              </div>

              {/* 2-Character Word Associations (常用组词) */}
              {wordAssociations.length > 0 && (
                <div className="w-full max-w-md my-0.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block mb-1.5 font-semibold text-center">
                    Common 2-Character Words (常用组词)
                  </span>
                  <div className="flex flex-col gap-1.5 w-full">
                    {wordAssociations.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          speakChinese(item.word);
                        }}
                        className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-750 border border-slate-700/50 transition-all hover:scale-[1.01] hover:border-sky-500/40 cursor-pointer group/word shadow-sm"
                        title={`Click to listen: ${item.word} (${item.pinyin})`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base font-serif font-bold text-slate-100 group-hover/word:text-sky-300 transition-colors">
                            {item.word}
                          </span>
                          <span className="text-xs font-semibold text-sky-400 font-sans">
                            {item.pinyin}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-300 font-normal truncate max-w-[170px] text-right">
                            {item.meaning}
                          </span>
                          <Volume2 className="w-3.5 h-3.5 text-slate-500 group-hover/word:text-sky-400 shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-2 mt-1 pt-2 border-t border-slate-800/70 w-full max-w-sm">
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
                <RotateCw className="w-3.5 h-3.5" /> Click or <kbd className="font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">;</kbd> to flip
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
              ;
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
        <span><kbd className="bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">[</kbd> Prev Lesson</span>
        <span><kbd className="bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">]</kbd> Next Lesson</span>
        <span><kbd className="bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">j</kbd> Learned</span>
        <span><kbd className="bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">k</kbd> In-Progress</span>
        <span><kbd className="bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">;</kbd> Flip</span>
        <span><kbd className="bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">Space</kbd> Example</span>
        <span><kbd className="bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">o</kbd> Audio</span>
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
