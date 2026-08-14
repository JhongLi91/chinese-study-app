import initSqlJs from 'sql.js';
import type { Database, SqlJsStatic } from 'sql.js';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import hanziData from '../data/hanzi_3000.json';
import type { Character, LessonInfo, StudyStats, StudyStatus } from '../types';
import { loadDatabaseBytes, saveDatabaseBytes, clearSavedDatabase } from './sqliteStorage';

let SQL: SqlJsStatic | null = null;
let dbInstance: Database | null = null;
let initPromise: Promise<Database> | null = null;

const CREATE_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS characters (
  frequency_rank INTEGER PRIMARY KEY,
  character TEXT NOT NULL,
  pinyin TEXT NOT NULL,
  definition TEXT,
  radical TEXT,
  radical_code TEXT,
  stroke_count INTEGER,
  hsk_level INTEGER,
  lesson_number INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS progress (
  character_id INTEGER PRIMARY KEY,
  status TEXT NOT NULL CHECK(status IN ('new', 'in-progress', 'learned')),
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (character_id) REFERENCES characters(frequency_rank)
);

CREATE TABLE IF NOT EXISTS study_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_type TEXT NOT NULL,
  start_time INTEGER NOT NULL,
  duration_seconds INTEGER NOT NULL,
  cards_reviewed INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_characters_lesson ON characters(lesson_number);
CREATE INDEX IF NOT EXISTS idx_progress_status ON progress(status);
`;

function seedCharacters(db: Database) {
  console.log(`Seeding SQLite characters table with ${hanziData.length} records...`);
  db.run("BEGIN TRANSACTION;");
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO characters (
      frequency_rank, character, pinyin, definition, radical, radical_code, stroke_count, hsk_level, lesson_number
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
  `);

  for (const item of hanziData) {
    stmt.run([
      item.frequency_rank,
      item.character,
      item.pinyin,
      item.definition,
      item.radical,
      item.radical_code,
      item.stroke_count,
      item.hsk_level,
      item.lesson_number,
    ]);
  }
  stmt.free();
  db.run("COMMIT;");
}

export async function getDatabase(): Promise<Database> {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      if (!SQL) {
        SQL = await initSqlJs({
          locateFile: (file: string) => {
            if (file.endsWith('.wasm')) return sqlWasmUrl;
            return `/${file}`;
          },
        });
      }

      const savedBytes = await loadDatabaseBytes();
      let db: Database;

      if (savedBytes && savedBytes.length > 0) {
        try {
          db = new SQL.Database(savedBytes);
        } catch (e) {
          console.warn('Corrupt SQLite data in storage, creating fresh database', e);
          db = new SQL.Database();
        }
      } else {
        db = new SQL.Database();
      }

      db.run(CREATE_SCHEMA_SQL);

      // Check if characters table is already populated
      let count = 0;
      try {
        const checkStmt = db.exec("SELECT count(*) as count FROM characters;");
        count = (checkStmt[0]?.values[0]?.[0] as number) || 0;
      } catch (e) {
        console.warn('Checking characters count failed:', e);
      }

      if (count < 3000) {
        seedCharacters(db);
        try {
          const bin = db.export();
          await saveDatabaseBytes(bin);
        } catch (e) {
          console.warn('Failed to save initial seeded db:', e);
        }
      }

      dbInstance = db;
      return db;
    } catch (err) {
      console.error('Fatal error initializing SQLite wasm:', err);
      // Fallback database creation
      if (SQL) {
        const db = new SQL.Database();
        db.run(CREATE_SCHEMA_SQL);
        seedCharacters(db);
        dbInstance = db;
        return db;
      }
      throw err;
    }
  })();

  return initPromise;
}

let saveTimeout: any = null;
export async function persistDatabase(db?: Database): Promise<void> {
  const targetDb = db || dbInstance;
  if (!targetDb) return;

  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    try {
      const binary = targetDb.export();
      await saveDatabaseBytes(binary);
    } catch (e) {
      console.error('Error persisting SQLite database:', e);
    }
  }, 100);
}

export async function getStudyStats(): Promise<StudyStats> {
  try {
    const db = await getDatabase();
    const res = db.exec(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN COALESCE(p.status, 'new') = 'learned' THEN 1 ELSE 0 END) as learned,
        SUM(CASE WHEN COALESCE(p.status, 'new') = 'in-progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN COALESCE(p.status, 'new') = 'new' THEN 1 ELSE 0 END) as new_count
      FROM characters c
      LEFT JOIN progress p ON c.frequency_rank = p.character_id
    `);

    if (res.length > 0 && res[0].values.length > 0) {
      const row = res[0].values[0];
      const total = (row[0] as number) || 3000;
      const learned = (row[1] as number) || 0;
      const in_progress = (row[2] as number) || 0;
      const new_count = (row[3] as number) || 0;

      const lessonRes = db.exec(`
        SELECT 
          c.lesson_number,
          COUNT(*) as total_in_lesson,
          SUM(CASE WHEN p.status = 'learned' THEN 1 ELSE 0 END) as learned_in_lesson
        FROM characters c
        LEFT JOIN progress p ON c.frequency_rank = p.character_id
        GROUP BY c.lesson_number
        HAVING total_in_lesson = learned_in_lesson
      `);

      const completed_lessons = lessonRes.length > 0 ? lessonRes[0].values.length : 0;

      return {
        total,
        learned,
        in_progress,
        new_count,
        completed_lessons,
        total_lessons: 120,
      };
    }
  } catch (err) {
    console.error('getStudyStats error:', err);
  }

  return {
    total: 3000,
    learned: 0,
    in_progress: 0,
    new_count: 3000,
    completed_lessons: 0,
    total_lessons: 120,
  };
}

export async function getLessonsSummary(): Promise<LessonInfo[]> {
  try {
    const db = await getDatabase();
    const res = db.exec(`
      SELECT 
        c.lesson_number,
        MIN(c.frequency_rank) as start_rank,
        MAX(c.frequency_rank) as end_rank,
        COUNT(*) as total_count,
        SUM(CASE WHEN COALESCE(p.status, 'new') = 'learned' THEN 1 ELSE 0 END) as learned_count,
        SUM(CASE WHEN COALESCE(p.status, 'new') = 'in-progress' THEN 1 ELSE 0 END) as in_progress_count,
        SUM(CASE WHEN COALESCE(p.status, 'new') = 'new' THEN 1 ELSE 0 END) as new_count
      FROM characters c
      LEFT JOIN progress p ON c.frequency_rank = p.character_id
      GROUP BY c.lesson_number
      ORDER BY c.lesson_number ASC
    `);

    if (res.length > 0 && res[0].values && res[0].values.length > 0) {
      return res[0].values.map((row) => ({
        lesson_number: row[0] as number,
        start_rank: row[1] as number,
        end_rank: row[2] as number,
        total_count: row[3] as number,
        learned_count: (row[4] as number) || 0,
        in_progress_count: (row[5] as number) || 0,
        new_count: (row[6] as number) || 0,
      }));
    }
  } catch (err) {
    console.error('getLessonsSummary error:', err);
  }

  // Fallback generation for 120 lessons
  const fallbackLessons: LessonInfo[] = [];
  for (let i = 1; i <= 120; i++) {
    fallbackLessons.push({
      lesson_number: i,
      start_rank: (i - 1) * 25 + 1,
      end_rank: i * 25,
      total_count: 25,
      learned_count: 0,
      in_progress_count: 0,
      new_count: 25,
    });
  }
  return fallbackLessons;
}

function mapRowToCharacter(row: any[]): Character {
  return {
    frequency_rank: row[0] as number,
    character: row[1] as string,
    pinyin: row[2] as string,
    definition: row[3] as string,
    radical: (row[4] as string) || undefined,
    radical_code: (row[5] as string) || undefined,
    stroke_count: row[6] !== null ? (row[6] as number) : null,
    hsk_level: row[7] !== null ? (row[7] as number) : null,
    lesson_number: row[8] as number,
    status: (row[9] as StudyStatus) || 'new',
    updated_at: row[10] !== null ? (row[10] as number) : null,
  };
}

export async function getLessonCharacters(lessonNumber: number): Promise<Character[]> {
  try {
    const db = await getDatabase();
    const stmt = db.prepare(`
      SELECT 
        c.frequency_rank, c.character, c.pinyin, c.definition,
        c.radical, c.radical_code, c.stroke_count, c.hsk_level,
        c.lesson_number,
        COALESCE(p.status, 'new') as status,
        p.updated_at
      FROM characters c
      LEFT JOIN progress p ON c.frequency_rank = p.character_id
      WHERE c.lesson_number = ?
      ORDER BY c.frequency_rank ASC
    `);
    stmt.bind([lessonNumber]);

    const results: Character[] = [];
    while (stmt.step()) {
      results.push(mapRowToCharacter(stmt.get()));
    }
    stmt.free();
    if (results.length > 0) return results;
  } catch (err) {
    console.error(`getLessonCharacters error for lesson ${lessonNumber}:`, err);
  }

  // Fallback from raw JSON dataset
  return hanziData
    .filter((c) => c.lesson_number === lessonNumber)
    .map((c) => ({
      ...c,
      status: 'new' as StudyStatus,
    }));
}

export async function getLearnedCharacters(): Promise<Character[]> {
  try {
    const db = await getDatabase();
    const res = db.exec(`
      SELECT 
        c.frequency_rank, c.character, c.pinyin, c.definition,
        c.radical, c.radical_code, c.stroke_count, c.hsk_level,
        c.lesson_number,
        p.status,
        p.updated_at
      FROM characters c
      JOIN progress p ON c.frequency_rank = p.character_id
      WHERE p.status = 'learned'
      ORDER BY c.frequency_rank ASC
    `);

    if (!res.length || !res[0].values) return [];
    return res[0].values.map(mapRowToCharacter);
  } catch (err) {
    console.error('getLearnedCharacters error:', err);
    return [];
  }
}

export async function getInProgressCharacters(): Promise<Character[]> {
  try {
    const db = await getDatabase();
    const res = db.exec(`
      SELECT 
        c.frequency_rank, c.character, c.pinyin, c.definition,
        c.radical, c.radical_code, c.stroke_count, c.hsk_level,
        c.lesson_number,
        p.status,
        p.updated_at
      FROM characters c
      JOIN progress p ON c.frequency_rank = p.character_id
      WHERE p.status = 'in-progress'
      ORDER BY c.frequency_rank ASC
    `);

    if (!res.length || !res[0].values) return [];
    return res[0].values.map(mapRowToCharacter);
  } catch (err) {
    console.error('getInProgressCharacters error:', err);
    return [];
  }
}

export async function getAllCharacters(filter?: {
  status?: StudyStatus;
  search?: string;
  hsk?: number | null;
  lesson?: number | null;
}): Promise<Character[]> {
  try {
    const db = await getDatabase();
    let query = `
      SELECT 
        c.frequency_rank, c.character, c.pinyin, c.definition,
        c.radical, c.radical_code, c.stroke_count, c.hsk_level,
        c.lesson_number,
        COALESCE(p.status, 'new') as status,
        p.updated_at
      FROM characters c
      LEFT JOIN progress p ON c.frequency_rank = p.character_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filter?.status) {
      query += ` AND COALESCE(p.status, 'new') = ?`;
      params.push(filter.status);
    }

    if (filter?.hsk !== undefined && filter?.hsk !== null) {
      query += ` AND c.hsk_level = ?`;
      params.push(filter.hsk);
    }

    if (filter?.lesson) {
      query += ` AND c.lesson_number = ?`;
      params.push(filter.lesson);
    }

    if (filter?.search && filter.search.trim()) {
      const s = `%${filter.search.trim()}%`;
      query += ` AND (c.character LIKE ? OR c.pinyin LIKE ? OR c.definition LIKE ?)`;
      params.push(s, s, s);
    }

    query += ` ORDER BY c.frequency_rank ASC`;

    const stmt = db.prepare(query);
    stmt.bind(params);

    const results: Character[] = [];
    while (stmt.step()) {
      results.push(mapRowToCharacter(stmt.get()));
    }
    stmt.free();
    return results;
  } catch (err) {
    console.error('getAllCharacters error:', err);
    return hanziData.map((c) => ({ ...c, status: 'new' as StudyStatus }));
  }
}

export async function updateCharacterStatus(
  characterId: number,
  status: StudyStatus
): Promise<void> {
  const db = await getDatabase();
  const now = Date.now();

  if (status === 'new') {
    db.run(`DELETE FROM progress WHERE character_id = ?`, [characterId]);
  } else {
    db.run(
      `
      INSERT INTO progress (character_id, status, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(character_id) DO UPDATE SET
        status = excluded.status,
        updated_at = excluded.updated_at;
    `,
      [characterId, status, now]
    );
  }

  await persistDatabase(db);
}

export async function batchUpdateStatus(
  characterIds: number[],
  status: StudyStatus
): Promise<void> {
  if (characterIds.length === 0) return;
  const db = await getDatabase();
  const now = Date.now();

  db.run("BEGIN TRANSACTION;");
  if (status === 'new') {
    const placeholders = characterIds.map(() => '?').join(',');
    db.run(`DELETE FROM progress WHERE character_id IN (${placeholders})`, characterIds);
  } else {
    const stmt = db.prepare(`
      INSERT INTO progress (character_id, status, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(character_id) DO UPDATE SET
        status = excluded.status,
        updated_at = excluded.updated_at;
    `);
    for (const id of characterIds) {
      stmt.run([id, status, now]);
    }
    stmt.free();
  }
  db.run("COMMIT;");

  await persistDatabase(db);
}

export async function resetAllProgress(): Promise<void> {
  const db = await getDatabase();
  db.run(`DELETE FROM progress;`);
  db.run(`DELETE FROM study_sessions;`);
  await clearSavedDatabase();
  await persistDatabase(db);
}

export async function exportDatabaseBinary(): Promise<Uint8Array> {
  const db = await getDatabase();
  return db.export();
}

export async function importDatabaseBinary(bytes: Uint8Array): Promise<void> {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: (file: string) => {
        if (file.endsWith('.wasm')) return sqlWasmUrl;
        return `/${file}`;
      },
    });
  }

  const db = new SQL.Database(bytes);
  dbInstance = db;
  await saveDatabaseBytes(bytes);
}

export async function executeSqlConsole(sql: string): Promise<{ columns: string[]; values: any[][] }[]> {
  const db = await getDatabase();
  const results = db.exec(sql);
  await persistDatabase(db);
  return results;
}
