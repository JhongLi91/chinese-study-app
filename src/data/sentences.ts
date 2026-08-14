import sentences1000 from './examples_1000.json';

export interface SentenceExample {
  zh: string;
  py: string;
  en: string;
}

const sentenceMap = sentences1000 as Record<string, SentenceExample>;

export function getExampleSentence(
  character: string,
  rank: number,
  definition?: string
): SentenceExample | null {
  // Only available for the top 1,000 characters
  if (rank > 1000) return null;

  const found = sentenceMap[String(rank)];
  if (found) {
    return found;
  }

  // Fallback for safety
  const cleanDef = definition ? definition.split(';')[0].split(',')[0].trim() : 'concept';
  return {
    zh: `掌握“${character}”对提高中文阅读能力很有帮助。`,
    py: `Zhǎngwò "${character}" duì tígāo zhōngwén yuèdú nénglì hěn yǒu bāngzhù.`,
    en: `Mastering "${character}" (${cleanDef}) is very helpful for improving Chinese reading ability.`,
  };
}

export function getTotalExampleCount(): number {
  return Object.keys(sentenceMap).length;
}
