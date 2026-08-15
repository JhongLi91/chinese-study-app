export type StudyStatus = 'new' | 'in-progress' | 'learned';

export interface WordAssociation {
  word: string;
  pinyin: string;
  meaning: string;
}

export interface Character {
  frequency_rank: number;
  character: string;
  pinyin: string;
  definition: string;
  radical?: string;
  radical_code?: string;
  stroke_count?: number | null;
  hsk_level?: number | null;
  lesson_number: number;
  status: StudyStatus;
  updated_at?: number | null;
}

export interface LessonInfo {
  lesson_number: number;
  start_rank: number;
  end_rank: number;
  total_count: number;
  learned_count: number;
  in_progress_count: number;
  new_count: number;
}

export interface StudyStats {
  total: number;
  learned: number;
  in_progress: number;
  new_count: number;
  completed_lessons: number;
  total_lessons: number;
}

export type ActiveTab = 'lessons' | 'learned' | 'in-progress' | 'all';
