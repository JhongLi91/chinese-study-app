import type { WordAssociation, Character } from '../types';
import wordAssociationsData from './word_associations.json';

interface WordAssociationsData {
  by_char?: Record<string, WordAssociation[]>;
  by_rank?: Record<string, WordAssociation[]>;
}

const associationsData = wordAssociationsData as unknown as WordAssociationsData;
const byChar: Record<string, WordAssociation[]> = associationsData.by_char ?? {};
const byRank: Record<string, WordAssociation[]> = associationsData.by_rank ?? {};

/**
 * Get 2-3 common 2-character word associations for a given character or rank
 */
export function getWordAssociations(
  character: string,
  rank?: number
): WordAssociation[] {
  if (byChar[character] && byChar[character].length > 0) {
    return byChar[character];
  }
  if (rank && byRank[String(rank)] && byRank[String(rank)].length > 0) {
    return byRank[String(rank)];
  }
  return [];
}

export interface WordPairItem {
  id: string;
  word: string;
  char1: string;
  char2: string;
  pinyin: string;
  meaning: string;
}

/**
 * Generates a set of unique 2-character words for the Word Matching Quiz
 */
export function getWordPairsForQuiz(
  sourceCards?: Character[],
  count: number = 6
): WordPairItem[] {
  const pool: WordPairItem[] = [];
  const seenWords = new Set<string>();

  // If source cards are provided, prioritize words from those characters
  if (sourceCards && sourceCards.length > 0) {
    for (const card of sourceCards) {
      const words = getWordAssociations(card.character, card.frequency_rank);
      for (const w of words) {
        if (w.word.length === 2 && !seenWords.has(w.word)) {
          seenWords.add(w.word);
          pool.push({
            id: `${w.word}-${card.frequency_rank}`,
            word: w.word,
            char1: w.word[0],
            char2: w.word[1],
            pinyin: w.pinyin,
            meaning: w.meaning,
          });
        }
      }
    }
  }

  // If pool is too small, pull from general words
  if (pool.length < count) {
    for (const [char, words] of Object.entries(byChar)) {
      for (const w of words) {
        if (w.word.length === 2 && !seenWords.has(w.word)) {
          seenWords.add(w.word);
          pool.push({
            id: `${w.word}-${char}`,
            word: w.word,
            char1: w.word[0],
            char2: w.word[1],
            pinyin: w.pinyin,
            meaning: w.meaning,
          });
          if (pool.length >= count * 4) break;
        }
      }
      if (pool.length >= count * 4) break;
    }
  }

  // Shuffle pool and select `count` items with unique char1 and unique char2
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected: WordPairItem[] = [];
  const usedLeft = new Set<string>();
  const usedRight = new Set<string>();

  for (const item of shuffled) {
    if (selected.length >= count) break;
    if (!usedLeft.has(item.char1) && !usedRight.has(item.char2)) {
      usedLeft.add(item.char1);
      usedRight.add(item.char2);
      selected.push(item);
    }
  }

  // If we couldn't get strictly unique left/right, just take first `count`
  if (selected.length < count) {
    for (const item of shuffled) {
      if (selected.length >= count) break;
      if (!selected.some((s) => s.word === item.word)) {
        selected.push(item);
      }
    }
  }

  return selected;
}
