import { useState, useEffect, useCallback } from 'react';
import { Database, Download, Upload, Terminal, RotateCcw, X, Play, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { exportDatabaseBinary, importDatabaseBinary, executeSqlConsole, resetAllProgress } from '../db/sqlite';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDatabaseMutated: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  onDatabaseMutated,
}) => {
  const [sqlQuery, setSqlQuery] = useState<string>(
    'SELECT status, count(*) as count FROM progress GROUP BY status;'
  );
  const [queryResult, setQueryResult] = useState<
    { columns: string[]; values: (string | number | null)[][] }[] | null
  >(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleRunQuery = useCallback(
    async (queryToRun?: string) => {
      const q = queryToRun || sqlQuery;
      if (!q.trim()) return;

      setQueryError(null);
      setMessage(null);
      try {
        const results = await executeSqlConsole(q);
        setQueryResult(results);
        onDatabaseMutated();
      } catch (err: unknown) {
        console.error(err);
        const errMsg = err instanceof Error ? err.message : String(err);
        setQueryError(errMsg);
        setQueryResult(null);
      }
    },
    [sqlQuery, onDatabaseMutated]
  );

  useEffect(() => {
    let active = true;
    if (isOpen) {
      executeSqlConsole('SELECT status, count(*) as count FROM progress GROUP BY status;')
        .then((res) => {
          if (active) {
            setQueryResult(res);
            setQueryError(null);
          }
        })
        .catch((err: unknown) => {
          if (active) {
            const errMsg = err instanceof Error ? err.message : String(err);
            setQueryError(errMsg);
            setQueryResult(null);
          }
        });
    }
    return () => {
      active = false;
    };
  }, [isOpen]);

  const handleExportDb = async () => {
    try {
      const binary = await exportDatabaseBinary();
      const blob = new Blob([binary.buffer as ArrayBuffer], { type: 'application/x-sqlite3' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chinese_study_${new Date().toISOString().slice(0, 10)}.sqlite`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage('SQLite database successfully downloaded.');
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setQueryError(`Export failed: ${errMsg}`);
    }
  };

  const handleImportDb = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      await importDatabaseBinary(bytes);
      onDatabaseMutated();
      setMessage(`Successfully imported SQLite database from ${file.name}`);
      void handleRunQuery();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setQueryError(`Import failed: ${errMsg}`);
    }
  };

  const handleResetProgress = async () => {
    try {
      await resetAllProgress();
      setIsResetConfirmOpen(false);
      onDatabaseMutated();
      setMessage('All study progress reset to new.');
      void handleRunQuery();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setQueryError(`Reset failed: ${errMsg}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <Card className="relative w-full max-w-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                SQLite3 Database Management
              </h2>
              <p className="text-xs text-slate-400">
                Client-side WebAssembly SQLite3 with IndexedDB Persistence
              </p>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Message / Error */}
        {message && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}
        {queryError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{queryError}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            variant="secondary"
            onClick={handleExportDb}
            className="gap-2 justify-center"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Download .sqlite DB</span>
          </Button>

          <label className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-all cursor-pointer">
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Upload / Restore</span>
            <input
              type="file"
              accept=".sqlite,.db,.sqlite3"
              onChange={handleImportDb}
              className="hidden"
            />
          </label>

          <Button
            variant="destructive"
            onClick={() => setIsResetConfirmOpen(true)}
            className="gap-2 justify-center"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Progress</span>
          </Button>
        </div>

        {/* Reset Confirmation */}
        {isResetConfirmOpen && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col gap-3 animate-fade-in">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Are you sure you want to reset all study progress?</span>
            </div>
            <p className="text-xs text-slate-300">
              This will clear the progress table in the SQLite database and set all 3,000 characters back to 'new'.
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleResetProgress}
              >
                Yes, Reset Everything
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsResetConfirmOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Interactive SQL Console */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-sky-400" />
              <span>SQL Query Console</span>
            </label>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => {
                  setSqlQuery('SELECT status, count(*) as count FROM progress GROUP BY status;');
                  handleRunQuery('SELECT status, count(*) as count FROM progress GROUP BY status;');
                }}
                className="text-sky-400 hover:underline cursor-pointer"
              >
                Progress Stats
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  setSqlQuery('SELECT * FROM characters LIMIT 10;');
                  handleRunQuery('SELECT * FROM characters LIMIT 10;');
                }}
                className="text-sky-400 hover:underline cursor-pointer"
              >
                Sample Characters
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  setSqlQuery('SELECT * FROM progress ORDER BY updated_at DESC LIMIT 10;');
                  handleRunQuery('SELECT * FROM progress ORDER BY updated_at DESC LIMIT 10;');
                }}
                className="text-sky-400 hover:underline cursor-pointer"
              >
                Recent Progress
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              rows={3}
              placeholder="Enter custom SQL query (e.g. SELECT * FROM characters LIMIT 25;)"
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
            />
            <Button
              size="sm"
              onClick={() => handleRunQuery()}
              className="absolute right-3 bottom-4 gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Execute</span>
            </Button>
          </div>

          {/* Results Table */}
          {queryResult && queryResult.length > 0 && (
            <div className="overflow-x-auto max-h-60 rounded-xl bg-slate-950 border border-slate-800">
              {queryResult.map((res, i) => (
                <table key={i} className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900 text-slate-400">
                      {res.columns.map((col, idx) => (
                        <th key={idx} className="p-2 font-semibold">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {res.values.length === 0 ? (
                      <tr>
                        <td colSpan={res.columns.length} className="p-3 text-slate-500 text-center italic">
                          (0 rows returned)
                        </td>
                      </tr>
                    ) : (
                      res.values.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-900/60">
                          {row.map((val, cIdx) => (
                            <td key={cIdx} className="p-2 text-slate-200 whitespace-nowrap">
                              {val === null ? <span className="text-slate-500 italic">NULL</span> : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
