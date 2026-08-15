import { useEffect } from 'react';
import type { SentenceExample } from '../data/sentences';
import { Volume2, MessageSquare, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { speakChinese } from '../utils/audio';

interface SentencePopoverProps {
  isOpen: boolean;
  character: string;
  pinyin: string;
  rank: number;
  sentence: SentenceExample | null;
  onClose: () => void;
}

export const SentencePopover: React.FC<SentencePopoverProps> = ({
  isOpen,
  character,
  pinyin,
  rank,
  sentence,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen || !sentence) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      // 'o' plays sentence audio without closing
      if (e.key.toLowerCase() === 'o') {
        e.preventDefault();
        e.stopPropagation();
        speakChinese(sentence.zh, 1.0);
        return;
      }

      // Any other key closes the popover
      e.preventDefault();
      e.stopPropagation();
      onClose();
    };

    // Small timeout so the triggering keypress (e.g. space) doesn't instantly close it in the same event tick
    const timer = setTimeout(() => {
      window.addEventListener('keydown', handleKeyDown, { capture: true });
    }, 50);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [isOpen, sentence, onClose]);

  if (!isOpen || !sentence) return null;

  const handlePlaySentenceAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    speakChinese(sentence.zh, 1.0);
  };

  // Highlight target character in Chinese sentence
  const parts = sentence.zh.split(character);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in cursor-pointer"
      onClick={onClose}
    >
      <Card
        className="relative w-full max-w-lg p-6 sm:p-8 shadow-2xl border-2 border-sky-500/40 bg-slate-900 cursor-default flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold text-slate-100">
                  {character}
                </span>
                <span className="text-sm font-semibold text-sky-400">
                  {pinyin}
                </span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  #{rank}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400">
                Example Sentence Context
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              size="icon"
              variant="secondary"
              onClick={handlePlaySentenceAudio}
              title="Play Sentence Audio (or press 'o')"
              className="rounded-full"
            >
              <Volume2 className="w-4 h-4 text-sky-400" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              title="Close (Press any key)"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Sentence Body */}
        <div className="flex flex-col gap-3 py-2">
          {/* Chinese Sentence */}
          <div className="text-xl sm:text-2xl font-serif text-slate-100 leading-relaxed">
            {parts.map((part, index) => (
              <span key={index}>
                {part}
                {index < parts.length - 1 && (
                  <span className="text-sky-400 font-bold underline decoration-sky-500/50 decoration-2 underline-offset-4">
                    {character}
                  </span>
                )}
              </span>
            ))}
          </div>

          {/* Pinyin */}
          <div className="text-sm sm:text-base font-semibold text-sky-400/90 leading-relaxed font-sans">
            {sentence.py}
          </div>

          {/* English Translation */}
          <div className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
            {sentence.en}
          </div>
        </div>

        {/* Footer Prompt */}
        <div className="pt-2 text-center border-t border-slate-800 text-xs text-slate-400 flex items-center justify-center gap-3 flex-wrap">
          <span className="flex items-center gap-1">
            Press <kbd className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-sky-400">o</kbd> to listen
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1">
            Press <kbd className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">any key</kbd> or click outside to close
          </span>
        </div>
      </Card>
    </div>
  );
};
