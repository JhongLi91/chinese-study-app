import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { Character, StudyStatus } from '../types';
import { STORIES } from '../data/stories';
import type { Story, StoryParagraph, StorySentence } from '../data/stories';
import { getCharactersByChars } from '../db/sqlite';
import { speakChinese, playSound } from '../utils/audio';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import {
  Volume2,
  Play,
  Square,
  CheckCircle2,
  Clock,
  Sparkles,
  Eye,
  EyeOff,
  HelpCircle,
  Check,
  X,
  ListChecks,
  GraduationCap,
  Languages,
  RefreshCw,
  Search,
  BookMarked,
  ChevronRight,
  ChevronLeft,
  ScrollText,
  FileText,
  MessageSquareQuote,
  Headphones,
  BookOpen,
} from 'lucide-react';

interface StoryReaderViewProps {
  learnedList: Character[];
  inProgressList: Character[];
  selectedStoryId: string | null;
  onSelectStoryId: (storyId: string | null) => void;
  onStatusChange: (characterId: number, status: StudyStatus) => Promise<void>;
  onStartQuiz: (cards: Character[], title?: string) => void;
}

type PinyinMode = 'ruby' | 'line' | 'none';
type FontSize = 'md' | 'lg' | 'xl';

export const StoryReaderView: React.FC<StoryReaderViewProps> = ({
  learnedList,
  inProgressList,
  selectedStoryId,
  onSelectStoryId,
  onStatusChange,
  onStartQuiz,
}) => {
  // Catalog search & level filter
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'hsk3' | 'hsk4' | 'hsk5' | 'hsk6'>('all');

  const story: Story | null = useMemo(() => {
    if (!selectedStoryId) return null;
    return STORIES.find((s) => s.id === selectedStoryId) || null;
  }, [selectedStoryId]);

  // Display toggles
  const [pinyinMode, setPinyinMode] = useState<PinyinMode>('ruby');
  const [showTranslations, setShowTranslations] = useState<boolean>(true);
  const [highlightMode, setHighlightMode] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<FontSize>('lg');
  const [showVocabDrawer, setShowVocabDrawer] = useState<boolean>(false);
  const [vocabFilter, setVocabFilter] = useState<'all' | 'learned' | 'in-progress' | 'new'>('all');
  const [vocabSearch, setVocabSearch] = useState<string>('');

  // Audio Playback State
  const [isPlayingFullStory, setIsPlayingFullStory] = useState<boolean>(false);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number | null>(null);
  const [activeSentenceId, setActiveSentenceId] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const fullStoryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hanzi Popover / Inspector
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [isCharModalOpen, setIsCharModalOpen] = useState<boolean>(false);

  // Comprehension Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  // Character metadata loaded from SQLite
  const [storyCharDataMap, setStoryCharDataMap] = useState<Map<string, Character>>(new Map());

  // All sentences flat list for continuous narration & sentence navigation
  const allSentences = useMemo(() => {
    if (!story) return [];
    const list: { sentence: StorySentence; paragraphIndex: number }[] = [];
    story.paragraphs.forEach((p, pIdx) => {
      p.sentences.forEach((s) => {
        list.push({ sentence: s, paragraphIndex: pIdx });
      });
    });
    return list;
  }, [story]);

  // Extract all Chinese characters from the current story
  const uniqueStoryChars = useMemo(() => {
    if (!story) return [];
    const chars = new Set<string>();
    for (const para of story.paragraphs) {
      for (const ch of para.zh) {
        if (/[\u4e00-\u9fa5]/.test(ch)) {
          chars.add(ch);
        }
      }
    }
    return Array.from(chars);
  }, [story]);

  // Load character data from SQLite
  const loadStoryCharacters = useCallback(async () => {
    if (uniqueStoryChars.length === 0) return;
    try {
      const records = await getCharactersByChars(uniqueStoryChars);
      const map = new Map<string, Character>();
      for (const rec of records) {
        map.set(rec.character, rec);
      }
      setStoryCharDataMap(map);
    } catch (err) {
      console.error('Error loading story character data:', err);
    }
  }, [uniqueStoryChars]);

  useEffect(() => {
    if (selectedStoryId) {
      void loadStoryCharacters();
    }
  }, [selectedStoryId, loadStoryCharacters, learnedList, inProgressList]);

  // Derived metrics
  const learnedSet = useMemo(() => new Set(learnedList.map((c) => c.character)), [learnedList]);
  const inProgressSet = useMemo(() => new Set(inProgressList.map((c) => c.character)), [inProgressList]);

  const { storyLearnedCount, storyInProgressCount, storyNewCount, coveragePercent, storyCharactersList } = useMemo(() => {
    if (!story) {
      return {
        storyLearnedCount: 0,
        storyInProgressCount: 0,
        storyNewCount: 0,
        coveragePercent: '0',
        storyCharactersList: [],
      };
    }

    let learnedCount = 0;
    let inProgressCount = 0;
    let newCount = 0;
    const cardsList: Character[] = [];

    for (const ch of uniqueStoryChars) {
      const charData = storyCharDataMap.get(ch);
      if (charData) {
        cardsList.push(charData);
      }
      if (learnedSet.has(ch)) {
        learnedCount++;
      } else if (inProgressSet.has(ch)) {
        inProgressCount++;
      } else {
        newCount++;
      }
    }

    const total = uniqueStoryChars.length || 1;
    const coverage = ((learnedCount / total) * 100).toFixed(0);

    return {
      storyLearnedCount: learnedCount,
      storyInProgressCount: inProgressCount,
      storyNewCount: newCount,
      coveragePercent: coverage,
      storyCharactersList: cardsList,
    };
  }, [story, uniqueStoryChars, storyCharDataMap, learnedSet, inProgressSet]);

  // Stop full narration on unmount or story change
  useEffect(() => {
    return () => {
      if (fullStoryTimeoutRef.current) {
        clearTimeout(fullStoryTimeoutRef.current);
      }
    };
  }, [selectedStoryId]);

  // Handle Stop Audio
  const handleStopAudio = () => {
    if (fullStoryTimeoutRef.current) {
      clearTimeout(fullStoryTimeoutRef.current);
      fullStoryTimeoutRef.current = null;
    }
    setIsPlayingFullStory(false);
    setActiveParagraphIndex(null);
    setActiveSentenceId(null);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Handle Sentence Audio Playback
  const handlePlaySentence = (sentence: StorySentence, pIdx: number) => {
    handleStopAudio();
    setActiveParagraphIndex(pIdx);
    setActiveSentenceId(sentence.id);
    playSound('click');
    speakChinese(sentence.zh, playbackSpeed);
  };

  // Handle Paragraph Audio Playback
  const handlePlayParagraph = (pIdx: number, para: StoryParagraph) => {
    handleStopAudio();
    setActiveParagraphIndex(pIdx);
    setActiveSentenceId(null);
    playSound('click');
    speakChinese(para.zh, playbackSpeed);
  };

  // Handle Full Story Continuous Narration (Sentence by Sentence)
  const handlePlayFullStory = () => {
    handleStopAudio();
    setIsPlayingFullStory(true);
    playSound('click');

    const playNextSentence = (idx: number) => {
      if (idx >= allSentences.length) {
        setIsPlayingFullStory(false);
        setActiveParagraphIndex(null);
        setActiveSentenceId(null);
        playSound('complete');
        return;
      }

      const item = allSentences[idx];
      setActiveParagraphIndex(item.paragraphIndex);
      setActiveSentenceId(item.sentence.id);
      speakChinese(item.sentence.zh, playbackSpeed);

      // Estimate duration based on Chinese character count (~280ms per character at speed 1.0)
      const durationMs = Math.max(2200, ((item.sentence.zh.length * 280) / playbackSpeed) + 800);

      fullStoryTimeoutRef.current = setTimeout(() => {
        playNextSentence(idx + 1);
      }, durationMs);
    };

    playNextSentence(0);
  };

  // Hanzi click inspector
  const handleCharClick = (ch: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const charData = storyCharDataMap.get(ch);
    if (charData) {
      setSelectedChar(charData);
      setIsCharModalOpen(true);
      speakChinese(ch, 1.0);
    }
  };

  // Status Change inside reader
  const handleCharStatusUpdate = async (status: StudyStatus) => {
    if (!selectedChar) return;
    playSound('click');
    await onStatusChange(selectedChar.frequency_rank, status);
    setSelectedChar((prev) => (prev ? { ...prev, status } : null));
    setStoryCharDataMap((prev) => {
      const next = new Map(prev);
      const existing = next.get(selectedChar.character);
      if (existing) {
        next.set(selectedChar.character, { ...existing, status });
      }
      return next;
    });
  };

  // Filter stories in catalog
  const filteredStories = useMemo(() => {
    return STORIES.filter((s) => {
      if (levelFilter === 'hsk3' && !s.level.includes('HSK 3')) return false;
      if (levelFilter === 'hsk4' && !s.level.includes('HSK 4')) return false;
      if (levelFilter === 'hsk5' && !s.level.includes('HSK 5')) return false;
      if (levelFilter === 'hsk6' && !s.level.includes('HSK 6')) return false;
      if (catalogSearch.trim()) {
        const q = catalogSearch.toLowerCase().trim();
        const matchesTitle =
          s.titleZh.toLowerCase().includes(q) ||
          s.titlePy.toLowerCase().includes(q) ||
          s.titleEn.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q);
        if (!matchesTitle) return false;
      }
      return true;
    });
  }, [catalogSearch, levelFilter]);

  // Current Story Index & Navigation
  const currentStoryIndex = useMemo(() => {
    if (!selectedStoryId) return -1;
    return STORIES.findIndex((s) => s.id === selectedStoryId);
  }, [selectedStoryId]);

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      handleStopAudio();
      setUserAnswers({});
      onSelectStoryId(STORIES[currentStoryIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextStory = () => {
    if (currentStoryIndex < STORIES.length - 1) {
      handleStopAudio();
      setUserAnswers({});
      onSelectStoryId(STORIES[currentStoryIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Character Token Renderer for Interactive Reading
  const renderSentenceChars = (text: string) => {
    return Array.from(text).map((char, index) => {
      const isHanzi = /[\u4e00-\u9fa5]/.test(char);

      if (!isHanzi) {
        return (
          <span key={index} className="text-slate-400 select-none">
            {char}
          </span>
        );
      }

      const isLearned = learnedSet.has(char);
      const isInProgress = inProgressSet.has(char);
      const isNew = !isLearned && !isInProgress;

      let highlightClasses = 'hover:bg-sky-500/20 hover:text-sky-300';
      if (highlightMode) {
        if (isLearned) {
          highlightClasses = 'text-emerald-400 font-medium underline decoration-emerald-500/40 hover:bg-emerald-500/20';
        } else if (isInProgress) {
          highlightClasses = 'text-amber-300 font-medium underline decoration-amber-500/40 hover:bg-amber-500/20';
        } else if (isNew) {
          highlightClasses = 'text-slate-200 underline decoration-slate-600/60 decoration-dashed hover:bg-slate-800';
        }
      }

      return (
        <span
          key={index}
          onClick={(e) => handleCharClick(char, e)}
          className={`cursor-pointer px-[1px] py-[2px] rounded transition-colors ${highlightClasses}`}
          title={`Click to inspect '${char}'`}
        >
          {char}
        </span>
      );
    });
  };

  // Find Active Sentence Object
  const activeSentenceObj = useMemo(() => {
    if (!activeSentenceId || !story) return null;
    for (const para of story.paragraphs) {
      for (const sent of para.sentences) {
        if (sent.id === activeSentenceId) {
          return sent;
        }
      }
    }
    return null;
  }, [activeSentenceId, story]);

  // -------------------------------------------------------------
  // VIEW 1: STORY SELECTION CATALOG (When selectedStoryId is null)
  // -------------------------------------------------------------
  if (!story || selectedStoryId === null) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        {/* Catalog Banner & Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[slate-900] to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge variant="hsk" className="px-2.5 py-0.5 text-xs font-mono">
                  HSK Graded Reader
                </Badge>
                <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-mono">
                  {STORIES.length} Stories Available
                </Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 tracking-tight">
                Authentic Chinese Stories & Passages
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Choose a graded passage to practice reading in context. Click any sentence to hear native Mandarin audio narration, tap characters to view instant definitions, and check your comprehension with HSK quiz questions.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800/90 px-4 py-3 rounded-2xl shrink-0">
              <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400">
                <Headphones className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium">Sentence Audio</span>
                <span className="text-sm font-bold text-slate-100">Native Mandarin TTS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setLevelFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                levelFilter === 'all'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              All Stories ({STORIES.length})
            </button>
            <button
              type="button"
              onClick={() => setLevelFilter('hsk3')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                levelFilter === 'hsk3'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              HSK 3 ({STORIES.filter((s) => s.level.includes('HSK 3')).length})
            </button>
            <button
              type="button"
              onClick={() => setLevelFilter('hsk4')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                levelFilter === 'hsk4'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              HSK 4 ({STORIES.filter((s) => s.level.includes('HSK 4')).length})
            </button>
            <button
              type="button"
              onClick={() => setLevelFilter('hsk5')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                levelFilter === 'hsk5'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              HSK 5 ({STORIES.filter((s) => s.level.includes('HSK 5')).length})
            </button>
            <button
              type="button"
              onClick={() => setLevelFilter('hsk6')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                levelFilter === 'hsk6'
                  ? 'bg-purple-500 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              HSK 6 ({STORIES.filter((s) => s.level.includes('HSK 6')).length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search story by title or keyword..."
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
            />
            {catalogSearch && (
              <button
                type="button"
                onClick={() => setCatalogSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((item, idx) => {
            const totalSentences = item.paragraphs.reduce((sum, p) => sum + p.sentences.length, 0);

            // Compute unique characters in this story
            const uniqueChars = new Set<string>();
            for (const p of item.paragraphs) {
              for (const ch of p.zh) {
                if (/[\u4e00-\u9fa5]/.test(ch)) uniqueChars.add(ch);
              }
            }
            let learnedCount = 0;
            uniqueChars.forEach((ch) => {
              if (learnedSet.has(ch)) learnedCount++;
            });
            const coverage = Math.round((learnedCount / (uniqueChars.size || 1)) * 100);

            const isHSK3 = item.level.includes('HSK 3');
            const isHSK4 = item.level.includes('HSK 4');
            const isHSK5 = item.level.includes('HSK 5');
            const isHSK6 = item.level.includes('HSK 6');

            let badgeColor = 'border-slate-700 text-slate-300 bg-slate-800/40';
            if (isHSK3) badgeColor = 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10';
            else if (isHSK4) badgeColor = 'border-sky-500/40 text-sky-300 bg-sky-500/10';
            else if (isHSK5) badgeColor = 'border-amber-500/40 text-amber-300 bg-amber-500/10';
            else if (isHSK6) badgeColor = 'border-purple-500/40 text-purple-300 bg-purple-500/10';

            return (
              <Card
                key={item.id}
                onClick={() => {
                  playSound('click');
                  onSelectStoryId(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group relative flex flex-col justify-between p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 hover:border-sky-500/50 hover:bg-slate-900 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10 cursor-pointer overflow-hidden"
              >
                <div className="flex flex-col gap-4">
                  {/* Card Header Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant="outline"
                      className={`text-[11px] font-semibold px-2.5 py-0.5 border ${badgeColor}`}
                    >
                      {item.level}
                    </Badge>
                    <span className="text-[11px] font-mono text-slate-400">
                      Story #{idx + 1}
                    </span>
                  </div>

                  {/* Story Titles */}
                  <div className="flex flex-col gap-1">
                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-slate-100 group-hover:text-sky-300 transition-colors leading-snug tracking-tight">
                      {item.titleZh}
                    </h3>
                    <p className="text-xs font-mono text-slate-400 italic">
                      {item.titlePy}
                    </p>
                    <p className="text-xs text-slate-300 font-medium line-clamp-1 mt-0.5">
                      {item.titleEn}
                    </p>
                  </div>

                  {/* Description Excerpt */}
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Metrics Chips */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/70 text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-sky-400" />
                      {item.paragraphs.length} paragraphs
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MessageSquareQuote className="w-3.5 h-3.5 text-amber-400" />
                      {totalSentences} sentences
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                      {item.questions.length} questions
                    </span>
                  </div>

                  {/* Vocabulary Coverage Bar */}
                  <div className="flex flex-col gap-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">Vocabulary Coverage</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {coverage}% Learned ({learnedCount}/{uniqueChars.size})
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                      <div
                        className="bg-emerald-500 transition-all duration-300"
                        style={{ width: `${coverage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-6">
                  <Button
                    variant="secondary"
                    className="w-full justify-between group-hover:bg-sky-500 group-hover:text-slate-950 group-hover:font-bold transition-all duration-300 text-xs font-semibold h-10 rounded-2xl"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Read Story & Listen
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredStories.length === 0 && (
          <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-3">
            <ScrollText className="w-10 h-10 text-slate-500" />
            <h3 className="text-base font-bold text-slate-200">No stories found</h3>
            <p className="text-xs text-slate-400">
              No matching stories found for "{catalogSearch}". Try clearing your search or filter.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCatalogSearch('');
                setLevelFilter('all');
              }}
              className="mt-2 text-xs"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: INTERACTIVE STORY READER (When a story is selected)
  // -------------------------------------------------------------
  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-16">
      {/* Story Hero Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[slate-900] to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-3xl">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="hsk" className="px-2.5 py-0.5 text-xs font-mono">
                  {story.level}
                </Badge>
                <Badge variant="secondary" className="px-2.5 py-0.5 text-xs">
                  {story.source}
                </Badge>
                <Badge variant="outline" className="px-2.5 py-0.5 text-xs border-sky-400/40 text-sky-300">
                  {story.paragraphs.length} Paragraphs • {allSentences.length} Sentences
                </Badge>
              </div>

              {/* Story Prev/Next Switcher */}
              <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800/90 rounded-xl p-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handlePrevStory}
                  disabled={currentStoryIndex <= 0}
                  className="h-7 px-2 text-xs gap-1 disabled:opacity-30 text-slate-300 hover:text-white"
                  title="Previous Story"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Prev</span>
                </Button>
                <span className="text-[10px] text-slate-400 font-mono px-1">
                  {currentStoryIndex + 1}/{STORIES.length}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleNextStory}
                  disabled={currentStoryIndex >= STORIES.length - 1}
                  className="h-7 px-2 text-xs gap-1 disabled:opacity-30 text-slate-300 hover:text-white"
                  title="Next Story"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight mt-1">
              {story.titleZh}
            </h2>
            <p className="text-sm font-mono text-slate-400 italic">
              {story.titlePy}
            </p>
            <p className="text-sm text-slate-300 font-medium">
              {story.titleEn}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed mt-2 pt-2 border-t border-slate-800/80 max-w-2xl">
              {story.description}
            </p>
          </div>

          {/* Quick Audio Actions */}
          <div className="flex flex-col gap-2 shrink-0">
            {!isPlayingFullStory ? (
              <Button
                variant="default"
                onClick={handlePlayFullStory}
                className="gap-2 h-11 px-5 font-semibold text-sm rounded-2xl shadow-lg shadow-sky-500/25 bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-950 hover:opacity-95"
                title="Narrate entire story sentence by sentence"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Listen Full Story</span>
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={handleStopAudio}
                className="gap-2 h-11 px-5 font-semibold text-sm rounded-2xl animate-pulse"
                title="Stop audio playback"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Narration</span>
              </Button>
            )}

            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono text-slate-400">
              <span>Speed:</span>
              <div className="flex items-center gap-1">
                {[0.8, 1.0, 1.2].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-1.5 py-0.5 rounded ${
                      playbackSpeed === spd
                        ? 'bg-sky-500 text-slate-950 font-bold'
                        : 'hover:text-slate-200'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Summary & Vocabulary Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Coverage Card */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Story Coverage
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-bold font-mono text-emerald-400">
                {coveragePercent}%
              </span>
              <span className="text-xs text-slate-400">
                ({storyLearnedCount}/{uniqueStoryChars.length} chars)
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Character Breakdown */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Character Breakdown
            </span>
            <div className="flex items-center gap-2 mt-1 font-mono text-xs">
              <span className="text-emerald-400 font-bold flex items-center gap-1" title="Learned characters">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {storyLearnedCount}
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-amber-400 font-bold flex items-center gap-1" title="In-Progress characters">
                <Clock className="w-3.5 h-3.5" />
                {storyInProgressCount}
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400 font-bold flex items-center gap-1" title="New characters">
                <BookMarked className="w-3.5 h-3.5" />
                {storyNewCount}
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-mono text-sm font-bold">
            {uniqueStoryChars.length}
          </div>
        </div>

        {/* Quick Flashcard Quiz on Story Words */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Flashcard Practice
            </span>
            <span className="text-xs text-slate-300 mt-1">
              Practice all {storyCharactersList.length} Hanzi
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              playSound('click');
              onStartQuiz(storyCharactersList, `${story.titleZh} - Story Vocabulary Quiz`);
            }}
            className="h-8 text-xs font-semibold gap-1 border-sky-500/30 text-sky-400 hover:bg-sky-500/10"
            title="Start randomized flashcard quiz with characters from this story"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Quiz</span>
          </Button>
        </div>

        {/* Vocabulary Drawer Toggle */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Character Directory
            </span>
            <span className="text-xs text-slate-300 mt-1">
              Definitions, ranks & pinyin
            </span>
          </div>
          <Button
            size="sm"
            variant={showVocabDrawer ? 'default' : 'secondary'}
            onClick={() => setShowVocabDrawer((prev) => !prev)}
            className="h-8 text-xs font-semibold gap-1.5"
          >
            <ListChecks className="w-3.5 h-3.5" />
            <span>{showVocabDrawer ? 'Hide List' : 'View Vocab'}</span>
          </Button>
        </div>
      </div>

      {/* Reader Controls Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800/90 p-3 rounded-2xl backdrop-blur-sm flex flex-wrap items-center justify-between gap-3 shadow-md">
        {/* Audio controls banner */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Headphones className="w-4 h-4 text-sky-400" />
            <span>Click any sentence to play audio</span>
          </span>
        </div>

        {/* Display Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Pinyin Mode Selector */}
          <div className="flex items-center bg-slate-950/70 border border-slate-800 rounded-xl p-0.5 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 px-2 flex items-center gap-1">
              <Languages className="w-3 h-3" /> Pinyin
            </span>
            <button
              type="button"
              onClick={() => setPinyinMode('ruby')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                pinyinMode === 'ruby'
                  ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Show pinyin directly above each Hanzi"
            >
              Above
            </button>
            <button
              type="button"
              onClick={() => setPinyinMode('line')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                pinyinMode === 'line'
                  ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Show pinyin subtitle under sentence"
            >
              Line
            </button>
            <button
              type="button"
              onClick={() => setPinyinMode('none')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                pinyinMode === 'none'
                  ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Hide all pinyin for immersion"
            >
              Off
            </button>
          </div>

          {/* English Translation Toggle */}
          <Button
            size="sm"
            variant={showTranslations ? 'outline' : 'ghost'}
            onClick={() => setShowTranslations((prev) => !prev)}
            className="h-8 text-xs font-semibold gap-1.5 rounded-xl border-slate-800 text-slate-300"
            title="Toggle English sentence translations"
          >
            {showTranslations ? <Eye className="w-3.5 h-3.5 text-sky-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
            <span>English</span>
          </Button>

          {/* Vocabulary Highlight Toggle */}
          <Button
            size="sm"
            variant={highlightMode ? 'outline' : 'ghost'}
            onClick={() => setHighlightMode((prev) => !prev)}
            className="h-8 text-xs font-semibold gap-1.5 rounded-xl border-slate-800 text-slate-300"
            title="Toggle color highlights for learned/in-progress/new words"
          >
            <Sparkles className={`w-3.5 h-3.5 ${highlightMode ? 'text-amber-400' : 'text-slate-500'}`} />
            <span>Highlights</span>
          </Button>

          {/* Font Size Selector */}
          <div className="flex items-center bg-slate-950/70 border border-slate-800 rounded-xl p-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setFontSize('md')}
              className={`px-2 py-1 rounded-lg transition-colors ${
                fontSize === 'md' ? 'bg-slate-800 text-sky-400 font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Medium Chinese Font Size"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => setFontSize('lg')}
              className={`px-2 py-1 rounded-lg transition-colors ${
                fontSize === 'lg' ? 'bg-slate-800 text-sky-400 font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Large Chinese Font Size"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize('xl')}
              className={`px-2 py-1 rounded-lg transition-colors ${
                fontSize === 'xl' ? 'bg-slate-800 text-sky-400 font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Extra Large Chinese Font Size"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Active Sentence Subtitle & Audio Bar */}
      {activeSentenceObj && (
        <div className="sticky top-16 z-20 bg-slate-900/95 border-2 border-sky-500/50 p-4 rounded-2xl backdrop-blur-md shadow-2xl animate-fade-in flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                Active Sentence Audio
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  playSound('click');
                  speakChinese(activeSentenceObj.zh, playbackSpeed);
                }}
                className="h-7 text-xs font-semibold gap-1 text-sky-300 border-sky-500/40 hover:bg-sky-500/20"
                title="Replay this sentence"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Replay Sentence</span>
              </Button>

              <button
                type="button"
                onClick={() => {
                  handleStopAudio();
                  setActiveSentenceId(null);
                }}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg"
                title="Close active sentence banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="font-serif text-lg sm:text-xl font-semibold text-sky-100 tracking-wide">
              {activeSentenceObj.zh}
            </div>
            <div className="text-xs font-mono text-sky-400/90">
              {activeSentenceObj.py}
            </div>
            <div className="text-xs text-slate-300">
              {activeSentenceObj.en}
            </div>
          </div>
        </div>
      )}

      {/* Main Passage Reader Content */}
      <div className="flex flex-col gap-6 bg-[slate-950] border border-slate-800/80 p-6 sm:p-10 rounded-3xl shadow-xl">
        {story.paragraphs.map((para, pIdx) => {
          const isParagraphActive = activeParagraphIndex === pIdx;

          return (
            <div
              key={para.id}
              className={`relative flex flex-col gap-4 p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${
                isParagraphActive
                  ? 'bg-slate-900/90 border-sky-500/40 shadow-lg shadow-sky-500/5 ring-1 ring-sky-500/20'
                  : 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700/80 hover:bg-slate-900/60'
              }`}
            >
              {/* Paragraph Header Action Bar */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/60 text-xs font-mono text-slate-400">
                <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
                  Paragraph {pIdx + 1}
                </span>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handlePlayParagraph(pIdx, para)}
                  className="h-7 px-2.5 text-xs gap-1.5 text-slate-400 hover:text-sky-300 hover:bg-sky-500/10"
                  title="Listen to this entire paragraph"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Play Paragraph</span>
                </Button>
              </div>

              {/* Sentences Interactive Container */}
              <div className="flex flex-col gap-4">
                {para.sentences.map((sent) => {
                  const isSentenceActive = activeSentenceId === sent.id;

                  const fontSizeClass =
                    fontSize === 'xl'
                      ? 'text-2xl sm:text-3xl leading-[2.6rem]'
                      : fontSize === 'lg'
                      ? 'text-xl sm:text-2xl leading-[2.2rem]'
                      : 'text-lg sm:text-xl leading-[2rem]';

                  return (
                    <div
                      key={sent.id}
                      onClick={() => handlePlaySentence(sent, pIdx)}
                      className={`group/sent relative p-3 sm:p-4 rounded-xl transition-all duration-200 cursor-pointer ${
                        isSentenceActive
                          ? 'bg-sky-500/15 border border-sky-500/50 shadow-md shadow-sky-500/10'
                          : 'border border-transparent hover:border-slate-700/80 hover:bg-slate-800/50'
                      }`}
                    >
                      {/* Inline Speaker Play Indicator */}
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlaySentence(sent, pIdx);
                          }}
                          className={`mt-1.5 p-1.5 rounded-lg shrink-0 transition-colors ${
                            isSentenceActive
                              ? 'bg-sky-500 text-slate-950 font-bold animate-pulse'
                              : 'text-slate-500 group-hover/sent:text-sky-400 hover:bg-slate-800'
                          }`}
                          title="Click to play sentence audio"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>

                        <div className="flex-1 flex flex-col gap-1.5">
                          {/* Chinese Characters Line with Pinyin Mode */}
                          <div className={`font-serif font-normal text-slate-100 ${fontSizeClass} tracking-wide`}>
                            {pinyinMode === 'ruby' ? (
                              <div className="flex flex-wrap items-baseline gap-x-1 gap-y-2">
                                {renderSentenceChars(sent.zh)}
                              </div>
                            ) : (
                              renderSentenceChars(sent.zh)
                            )}
                          </div>

                          {/* Line Pinyin Mode */}
                          {pinyinMode === 'line' && (
                            <div className="text-xs sm:text-sm font-mono text-sky-400/90 select-all pt-0.5">
                              {sent.py}
                            </div>
                          )}

                          {/* English Translation */}
                          {showTranslations && (
                            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1 border-t border-slate-800/40">
                              {sent.en}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reading Comprehension Quiz Section */}
      {story.questions && story.questions.length > 0 && (
        <Card className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  Reading Comprehension Check (阅读理解)
                </h3>
                <p className="text-xs text-slate-400">
                  Test your understanding of the story with official HSK multiple-choice questions
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                playSound('click');
                setUserAnswers({});
              }}
              className="text-xs gap-1.5 text-slate-400 hover:text-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Quiz</span>
            </Button>
          </div>

          <div className="flex flex-col gap-6">
            {story.questions.map((q, qIdx) => {
              const selectedOpt = userAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className="flex flex-col gap-3 p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-lg shrink-0 mt-0.5">
                      Q{qIdx + 1}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-100 leading-snug">
                      {q.question}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 gap-2 mt-1">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      const isOptionCorrect = optIdx === q.correctAnswer;

                      let btnStyle = 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-slate-100';
                      if (isAnswered) {
                        if (isOptionCorrect) {
                          btnStyle = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-bold';
                        } else if (isOptionSelected && !isCorrect) {
                          btnStyle = 'bg-rose-500/20 border-rose-500/60 text-rose-300 font-medium';
                        } else {
                          btnStyle = 'bg-slate-950/40 border-slate-800/40 text-slate-500 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => {
                            if (!isAnswered) {
                              playSound(isOptionCorrect ? 'learned' : 'click');
                              setUserAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                            }
                          }}
                          disabled={isAnswered}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[11px] font-bold opacity-60">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            <span>{opt}</span>
                          </div>

                          {isAnswered && isOptionCorrect && (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {isAnswered && isOptionSelected && !isCorrect && (
                            <X className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div
                      className={`p-3 rounded-xl text-xs leading-relaxed mt-1 flex items-start gap-2 ${
                        isCorrect
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                          : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                      )}
                      <div>
                        <span className="font-bold">{isCorrect ? 'Correct! ' : 'Incorrect. '}</span>
                        <span>{q.explanation}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Vocabulary Drawer & Directory Modal */}
      {showVocabDrawer && (
        <Card className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl animate-fade-in flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-sky-400" />
              <h3 className="font-bold text-base text-slate-100">
                Story Vocabulary Directory ({uniqueStoryChars.length} Unique Hanzi)
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStartQuiz(storyCharactersList, `${story.titleZh} - Full Story Vocabulary`)}
                className="h-8 text-xs font-semibold gap-1.5 text-sky-400 border-sky-500/30"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Practice All in Quiz</span>
              </Button>

              <button
                type="button"
                onClick={() => setShowVocabDrawer(false)}
                className="p-1 text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setVocabFilter('all')}
                className={`px-2.5 py-1 rounded-lg ${
                  vocabFilter === 'all' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                All ({uniqueStoryChars.length})
              </button>
              <button
                type="button"
                onClick={() => setVocabFilter('learned')}
                className={`px-2.5 py-1 rounded-lg ${
                  vocabFilter === 'learned' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Learned ({storyLearnedCount})
              </button>
              <button
                type="button"
                onClick={() => setVocabFilter('in-progress')}
                className={`px-2.5 py-1 rounded-lg ${
                  vocabFilter === 'in-progress' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                In-Prog ({storyInProgressCount})
              </button>
              <button
                type="button"
                onClick={() => setVocabFilter('new')}
                className={`px-2.5 py-1 rounded-lg ${
                  vocabFilter === 'new' ? 'bg-slate-700 text-slate-100 font-bold' : 'text-slate-400'
                }`}
              >
                New ({storyNewCount})
              </button>
            </div>

            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter character..."
                value={vocabSearch}
                onChange={(e) => setVocabSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Hanzi Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-96 overflow-y-auto pr-1">
            {storyCharactersList
              .filter((c) => {
                if (vocabFilter === 'learned' && c.status !== 'learned') return false;
                if (vocabFilter === 'in-progress' && c.status !== 'in-progress') return false;
                if (vocabFilter === 'new' && c.status !== 'new') return false;
                if (vocabSearch) {
                  const q = vocabSearch.toLowerCase();
                  return (
                    c.character.includes(q) ||
                    c.pinyin.toLowerCase().includes(q) ||
                    c.definition.toLowerCase().includes(q)
                  );
                }
                return true;
              })
              .map((c) => {
                const isLearned = c.status === 'learned';
                const isInProg = c.status === 'in-progress';

                return (
                  <div
                    key={c.frequency_rank}
                    onClick={() => {
                      setSelectedChar(c);
                      setIsCharModalOpen(true);
                      speakChinese(c.character, 1.0);
                    }}
                    className={`flex flex-col p-3 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] ${
                      isLearned
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : isInProg
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-2xl font-bold text-slate-100">
                        {c.character}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        #{c.frequency_rank}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-sky-400 font-semibold mt-0.5">
                      {c.pinyin}
                    </span>
                    <span className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                      {c.definition}
                    </span>
                  </div>
                );
              })}
          </div>
        </Card>
      )}

      {/* Interactive Hanzi Inspector Modal / Popover */}
      {isCharModalOpen && selectedChar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsCharModalOpen(false)}
        >
          <Card
            className="relative w-full max-w-md p-6 sm:p-7 shadow-2xl flex flex-col gap-5 bg-slate-900 border-slate-800 rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Badge variant="hsk" className="text-xs font-mono">
                  {selectedChar.hsk_level ? `HSK ${selectedChar.hsk_level}` : 'General'}
                </Badge>
                <span className="text-xs font-mono text-slate-400">
                  Rank #{selectedChar.frequency_rank}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsCharModalOpen(false)}
                className="text-slate-400 hover:text-slate-100 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Character Callout & Audio */}
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-emerald-500/20 border border-sky-500/30 flex items-center justify-center font-serif text-5xl font-bold text-slate-100 shadow-lg shrink-0">
                {selectedChar.character}
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-mono font-bold text-sky-400">
                    {selectedChar.pinyin}
                  </span>
                  <button
                    type="button"
                    onClick={() => speakChinese(selectedChar.character, 1.0)}
                    className="p-1 text-slate-400 hover:text-sky-300 hover:bg-slate-800 rounded-lg"
                    title="Play character pronunciation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-slate-200 leading-snug">
                  {selectedChar.definition}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-1">
                  <span>Radical: <b className="text-slate-200">{selectedChar.radical || '—'}</b></span>
                  <span>Strokes: <b className="text-slate-200">{selectedChar.stroke_count || '—'}</b></span>
                </div>
              </div>
            </div>

            {/* Instant Status Update Buttons */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Update Study Progress:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  size="sm"
                  variant={selectedChar.status === 'learned' ? 'learned' : 'outline'}
                  onClick={() => handleCharStatusUpdate('learned')}
                  className="gap-1 text-xs h-9"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Learned</span>
                </Button>

                <Button
                  size="sm"
                  variant={selectedChar.status === 'in-progress' ? 'inProgress' : 'outline'}
                  onClick={() => handleCharStatusUpdate('in-progress')}
                  className="gap-1 text-xs h-9"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>In-Prog</span>
                </Button>

                <Button
                  size="sm"
                  variant={selectedChar.status === 'new' ? 'secondary' : 'outline'}
                  onClick={() => handleCharStatusUpdate('new')}
                  className="gap-1 text-xs h-9 text-slate-300"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
