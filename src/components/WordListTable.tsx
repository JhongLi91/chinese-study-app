import { useState, useMemo } from 'react';
import type { Character, StudyStatus } from '../types';
import { Play, Volume2, Search, ArrowUpDown, CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Card, CardTitle, CardDescription } from './ui/card';
import { speakChinese, playSound } from '../utils/audio';

interface WordListTableProps {
  title: string;
  description: string;
  characters: Character[];
  activeStatusTab: 'learned' | 'in-progress' | 'all';
  onStartQuiz: () => void;
  onStatusChange: (characterId: number, status: StudyStatus) => void;
  onBatchStatusChange?: (characterIds: number[], status: StudyStatus) => void;
}

export const WordListTable: React.FC<WordListTableProps> = ({
  title,
  description,
  characters,
  activeStatusTab,
  onStartQuiz,
  onStatusChange,
  onBatchStatusChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHsk, setSelectedHsk] = useState<string>('all');
  const [sortField, setSortField] = useState<'rank' | 'pinyin' | 'strokes'>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const filteredCharacters = useMemo(() => {
    return characters.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesChar = c.character.toLowerCase().includes(q);
        const matchesPinyin = c.pinyin.toLowerCase().includes(q);
        const matchesDef = c.definition.toLowerCase().includes(q);
        if (!matchesChar && !matchesPinyin && !matchesDef) return false;
      }

      if (selectedHsk !== 'all') {
        if (selectedHsk === 'none') {
          if (c.hsk_level !== null) return false;
        } else {
          if (c.hsk_level?.toString() !== selectedHsk) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === 'rank') {
        comparison = a.frequency_rank - b.frequency_rank;
      } else if (sortField === 'pinyin') {
        comparison = a.pinyin.localeCompare(b.pinyin);
      } else if (sortField === 'strokes') {
        comparison = (a.stroke_count || 0) - (b.stroke_count || 0);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [characters, searchQuery, selectedHsk, sortField, sortDirection]);

  const toggleSort = (field: 'rank' | 'pinyin' | 'strokes') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredCharacters.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCharacters.map((c) => c.frequency_rank)));
    }
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleBatchAction = (status: StudyStatus) => {
    if (selectedIds.size === 0 || !onBatchStatusChange) return;
    playSound('learned');
    onBatchStatusChange(Array.from(selectedIds), status);
    setSelectedIds(new Set());
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      {/* Header Banner */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
                {title}
              </h1>
              <Badge variant="secondary" className="font-mono text-sm px-3 py-1 font-bold text-sky-400">
                {characters.length} words
              </Badge>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              {description}
            </p>
          </div>

          <div>
            <Button
              size="lg"
              onClick={onStartQuiz}
              disabled={characters.length === 0}
              className="w-full md:w-auto shadow-lg shadow-sky-500/25"
            >
              <Play className="w-5 h-5 fill-current" />
              <span className="text-base">Start Flashcard Quiz (Randomized)</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Search & Filter Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search character, pinyin, or definition..."
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedHsk}
              onChange={(e) => setSelectedHsk(e.target.value)}
              className="h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <option value="all">All HSK Levels</option>
              <option value="1">HSK 1</option>
              <option value="2">HSK 2</option>
              <option value="3">HSK 3</option>
              <option value="4">HSK 4</option>
              <option value="5">HSK 5</option>
              <option value="6">HSK 6</option>
              <option value="none">No HSK Level</option>
            </select>

            <Button
              variant={sortField === 'rank' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => toggleSort('rank')}
              className={sortField === 'rank' ? 'border-sky-500/40 text-sky-400 font-semibold' : ''}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Rank {sortField === 'rank' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</span>
            </Button>

            <Button
              variant={sortField === 'pinyin' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => toggleSort('pinyin')}
              className={sortField === 'pinyin' ? 'border-sky-500/40 text-sky-400 font-semibold' : ''}
            >
              <span>Pinyin {sortField === 'pinyin' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Batch selection toolbar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sm animate-fade-in">
          <span className="text-sky-400 font-semibold">
            {selectedIds.size} characters selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="learned"
              onClick={() => handleBatchAction('learned')}
            >
              Mark Learned
            </Button>
            <Button
              size="sm"
              variant="inProgress"
              onClick={() => handleBatchAction('in-progress')}
            >
              Mark In-Progress
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleBatchAction('new')}
            >
              Reset to New
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Table / List View */}
      {filteredCharacters.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mb-4">
            <Search className="w-8 h-8" />
          </div>
          <CardTitle className="text-lg">No characters found</CardTitle>
          <CardDescription className="text-sm mt-1 max-w-sm">
            {characters.length === 0
              ? activeStatusTab === 'learned'
                ? "You haven't marked any words as learned yet. Go to the Lessons tab and study flashcards to build your learned list!"
                : "You don't have any in-progress words right now. Start studying to track words in progress!"
              : "No characters match your current search and filter criteria."}
          </CardDescription>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.size > 0 && selectedIds.size === filteredCharacters.length}
                      onChange={handleSelectAll}
                      className="rounded border-slate-700 cursor-pointer accent-sky-500"
                    />
                  </th>
                  <th className="py-3 px-3 w-16">Rank</th>
                  <th className="py-3 px-4 w-28">Character</th>
                  <th className="py-3 px-4 w-36">Pinyin</th>
                  <th className="py-3 px-4">Definition</th>
                  <th className="py-3 px-3 w-20 text-center">HSK</th>
                  <th className="py-3 px-4 w-40 text-right">Status / Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-sm">
                {filteredCharacters.map((c) => {
                  const isSelected = selectedIds.has(c.frequency_rank);

                  return (
                    <tr
                      key={c.frequency_rank}
                      className={`hover:bg-slate-850/80 transition-colors ${
                        isSelected ? 'bg-sky-500/5' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(c.frequency_rank)}
                          className="rounded border-slate-700 cursor-pointer accent-sky-500"
                        />
                      </td>

                      <td className="py-3 px-3 font-mono text-xs text-slate-500">
                        #{c.frequency_rank}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-serif font-bold text-slate-100">
                            {c.character}
                          </span>
                          <button
                            onClick={() => speakChinese(c.character)}
                            className="p-1 rounded-md text-slate-500 hover:text-sky-400 hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Play pronunciation"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-semibold text-sky-400">
                        {c.pinyin}
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        {c.definition || <span className="text-slate-500 italic">None</span>}
                      </td>

                      <td className="py-3 px-3 text-center">
                        {c.hsk_level ? (
                          <Badge variant="hsk">
                            HSK {c.hsk_level}
                          </Badge>
                        ) : (
                          <span className="text-xs text-slate-600">-</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="iconSm"
                            variant={c.status === 'learned' ? 'learned' : 'ghost'}
                            onClick={() => {
                              playSound('learned');
                              onStatusChange(c.frequency_rank, 'learned');
                            }}
                            title="Mark Learned"
                            className={c.status !== 'learned' ? 'text-emerald-400 hover:bg-emerald-500/15' : ''}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>

                          <Button
                            size="iconSm"
                            variant={c.status === 'in-progress' ? 'inProgress' : 'ghost'}
                            onClick={() => {
                              playSound('inProgress');
                              onStatusChange(c.frequency_rank, 'in-progress');
                            }}
                            title="Mark In-Progress"
                            className={c.status !== 'in-progress' ? 'text-amber-400 hover:bg-amber-500/15' : ''}
                          >
                            <Clock className="w-4 h-4" />
                          </Button>

                          {c.status !== 'new' && (
                            <Button
                              size="iconSm"
                              variant="ghost"
                              onClick={() => {
                                playSound('click');
                                onStatusChange(c.frequency_rank, 'new');
                              }}
                              title="Reset to New"
                              className="text-slate-500 hover:text-slate-200"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
