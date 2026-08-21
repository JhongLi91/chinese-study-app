import { useState, useEffect, useCallback } from 'react';
import type { Character, LessonInfo, StudyStats, StudyStatus, ActiveTab } from '../types';
import {
  getStudyStats,
  getLessonsSummary,
  getLessonCharacters,
  getLearnedCharacters,
  getInProgressCharacters,
  getAllCharacters,
  updateCharacterStatus,
  batchUpdateStatus,
} from '../db/sqlite';

export interface UseStudyDataReturn {
  isInitializing: boolean;
  stats: StudyStats;
  lessons: LessonInfo[];
  learnedList: Character[];
  inProgressList: Character[];
  allCharactersList: Character[];
  currentLessonNumber: number | null;
  lessonCharacters: Character[];
  isLoadingLesson: boolean;
  selectLesson: (lessonNum: number) => Promise<void>;
  backToLessons: () => void;
  handleStatusChange: (characterId: number, status: StudyStatus) => Promise<void>;
  handleBatchStatusChange: (characterIds: number[], status: StudyStatus) => Promise<void>;
  refreshData: () => Promise<void>;
}

export function useStudyData(activeTab: ActiveTab): UseStudyDataReturn {
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [stats, setStats] = useState<StudyStats>({
    total: 3000,
    learned: 0,
    in_progress: 0,
    new_count: 3000,
    completed_lessons: 0,
    total_lessons: 120,
  });
  const [lessons, setLessons] = useState<LessonInfo[]>([]);
  const [learnedList, setLearnedList] = useState<Character[]>([]);
  const [inProgressList, setInProgressList] = useState<Character[]>([]);
  const [allCharactersList, setAllCharactersList] = useState<Character[]>([]);

  // Current lesson state
  const [currentLessonNumber, setCurrentLessonNumber] = useState<number | null>(null);
  const [lessonCharacters, setLessonCharacters] = useState<Character[]>([]);
  const [isLoadingLesson, setIsLoadingLesson] = useState<boolean>(false);

  const refreshData = useCallback(async () => {
    try {
      const [newStats, newLessons, learned, inProgress] = await Promise.all([
        getStudyStats(),
        getLessonsSummary(),
        getLearnedCharacters(),
        getInProgressCharacters(),
      ]);

      setStats(newStats);
      setLessons(newLessons);
      setLearnedList(learned);
      setInProgressList(inProgress);

      if (currentLessonNumber !== null) {
        const chars = await getLessonCharacters(currentLessonNumber);
        setLessonCharacters(chars);
      }

      if (activeTab === 'all' || activeTab === 'word-match') {
        const allChars = await getAllCharacters();
        setAllCharactersList(allChars);
      }
    } catch (err: unknown) {
      console.error('Error refreshing SQLite study data:', err);
    }
  }, [currentLessonNumber, activeTab]);

  // Initial load
  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        setIsInitializing(true);
        const [newStats, newLessons, learned, inProgress] = await Promise.all([
          getStudyStats(),
          getLessonsSummary(),
          getLearnedCharacters(),
          getInProgressCharacters(),
        ]);
        if (mounted) {
          setStats(newStats);
          setLessons(newLessons);
          setLearnedList(learned);
          setInProgressList(inProgress);
        }
      } catch (err: unknown) {
        console.error('Initialization error:', err);
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Fetch all characters when switching to 'all' or 'word-match' tab if not yet loaded
  useEffect(() => {
    if ((activeTab === 'all' || activeTab === 'word-match') && allCharactersList.length === 0) {
      void getAllCharacters().then((chars) => {
        setAllCharactersList(chars);
      });
    }
  }, [activeTab, allCharactersList.length]);

  const selectLesson = useCallback(async (lessonNum: number) => {
    setCurrentLessonNumber(lessonNum);
    setIsLoadingLesson(true);
    try {
      const chars = await getLessonCharacters(lessonNum);
      setLessonCharacters(chars);
    } finally {
      setIsLoadingLesson(false);
    }
  }, []);

  const backToLessons = useCallback(() => {
    setCurrentLessonNumber(null);
    setLessonCharacters([]);
    void refreshData();
  }, [refreshData]);

  const handleStatusChange = useCallback(
    async (characterId: number, status: StudyStatus) => {
      // Optimistic update for current lesson list
      setLessonCharacters((prev) =>
        prev.map((c) => (c.frequency_rank === characterId ? { ...c, status } : c))
      );

      // Optimistic update for all characters list
      setAllCharactersList((prev) =>
        prev.map((c) => (c.frequency_rank === characterId ? { ...c, status } : c))
      );

      await updateCharacterStatus(characterId, status);
      await refreshData();
    },
    [refreshData]
  );

  const handleBatchStatusChange = useCallback(
    async (characterIds: number[], status: StudyStatus) => {
      const idSet = new Set(characterIds);

      // Optimistic updates
      setLessonCharacters((prev) =>
        prev.map((c) => (idSet.has(c.frequency_rank) ? { ...c, status } : c))
      );
      setAllCharactersList((prev) =>
        prev.map((c) => (idSet.has(c.frequency_rank) ? { ...c, status } : c))
      );

      await batchUpdateStatus(characterIds, status);
      await refreshData();
    },
    [refreshData]
  );

  return {
    isInitializing,
    stats,
    lessons,
    learnedList,
    inProgressList,
    allCharactersList,
    currentLessonNumber,
    lessonCharacters,
    isLoadingLesson,
    selectLesson,
    backToLessons,
    handleStatusChange,
    handleBatchStatusChange,
    refreshData,
  };
}
