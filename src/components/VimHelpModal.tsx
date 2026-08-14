import { Keyboard, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface VimHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VimHelpModal: React.FC<VimHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'h / ←', desc: 'Previous card (navigate left)' },
    { key: 'l / →', desc: 'Next card (navigate right)' },
    { key: 'j', desc: 'Mark current card as Learned' },
    { key: 'k', desc: 'Mark current card as In-Progress' },
    { key: 'Space', desc: 'Show example sentence popover (Press any key to close)' },
    { key: 'Enter / f', desc: 'Flip flashcard (Front ↔ Back)' },
    { key: 'a', desc: 'Pronounce Mandarin audio (TTS)' },
    { key: 't', desc: 'Start / Pause top stopwatch' },
    { key: '1', desc: 'Switch to Lessons curriculum tab' },
    { key: '2', desc: 'Switch to Learned Words tab' },
    { key: '3', desc: 'Switch to In-Progress Words tab' },
    { key: '4', desc: 'Switch to All 3,000 Hanzi tab' },
    { key: '?', desc: 'Toggle keyboard shortcuts cheat sheet' },
    { key: 'Esc', desc: 'Close open modal or exit quiz' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <Card className="relative w-full max-w-lg p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-100">
              Keyboard & Vim Bindings
            </h2>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <p className="text-xs text-slate-400">
          Navigate cards, mark progress, and study at full speed without taking your hands off the keyboard.
        </p>

        <div className="grid grid-cols-1 gap-2">
          {shortcuts.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-sm"
            >
              <span className="text-xs text-slate-300">{item.desc}</span>
              <kbd className="font-mono text-xs font-bold px-2 py-1 rounded bg-slate-900 border border-slate-700 text-sky-400">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <Button
            onClick={onClose}
            className="w-full sm:w-auto px-8"
          >
            Got it
          </Button>
        </div>
      </Card>
    </div>
  );
};
