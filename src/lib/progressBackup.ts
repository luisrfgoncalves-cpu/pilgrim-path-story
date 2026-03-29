/**
 * Progress backup: export/import as JSON file
 * Works 100% offline — no server needed
 */

const STORAGE_KEY = 'peregrino-progress';
const HISTORY_KEY = 'peregrino-history';

export interface BackupData {
  version: 2;
  exportedAt: string;
  progress: any;
  history: any;
}

export function exportProgress(): BackupData {
  const progress = localStorage.getItem(STORAGE_KEY);
  const history = localStorage.getItem(HISTORY_KEY);
  return {
    version: 2,
    exportedAt: new Date().toISOString(),
    progress: progress ? JSON.parse(progress) : null,
    history: history ? JSON.parse(history) : null,
  };
}

export function downloadBackup() {
  const data = exportProgress();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `peregrino-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importBackup(file: File): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text) as BackupData;

        if (!data.version || !data.progress) {
          resolve({ success: false, error: 'Arquivo inválido. Não é um backup do Peregrino.' });
          return;
        }

        // Validate structure
        if (!data.progress.currentChapterId || !data.progress.attributes) {
          resolve({ success: false, error: 'Dados de progresso corrompidos.' });
          return;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.progress));
        if (data.history) {
          localStorage.setItem(HISTORY_KEY, JSON.stringify(data.history));
        }

        resolve({ success: true });
      } catch {
        resolve({ success: false, error: 'Erro ao ler o arquivo. Verifique se é um JSON válido.' });
      }
    };
    reader.onerror = () => resolve({ success: false, error: 'Erro ao ler o arquivo.' });
    reader.readAsText(file);
  });
}

/** Auto-backup to localStorage with timestamp */
export function getLastBackupInfo(): { date: string; size: string } | null {
  const progress = localStorage.getItem(STORAGE_KEY);
  if (!progress) return null;
  try {
    const data = JSON.parse(progress);
    const size = new Blob([progress]).size;
    return {
      date: data.lastSaved || new Date().toISOString(),
      size: size < 1024 ? `${size}B` : `${(size / 1024).toFixed(1)}KB`,
    };
  } catch {
    return null;
  }
}
