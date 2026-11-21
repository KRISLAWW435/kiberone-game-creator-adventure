export interface DiagnosticEntry {
  timestamp: string;
  source: 'image' | 'storage' | 'runtime';
  message: string;
  detail?: string;
}

const MAX_DIAGNOSTICS = 30;
const diagnosticEntries: DiagnosticEntry[] = [];

export function recordDiagnosticError(
  source: DiagnosticEntry['source'],
  message: string,
  detail?: string
): void {
  const entry: DiagnosticEntry = {
    timestamp: new Date().toISOString(),
    source,
    message,
    detail,
  };
  diagnosticEntries.push(entry);
  if (diagnosticEntries.length > MAX_DIAGNOSTICS) {
    diagnosticEntries.shift();
  }
  console.error(`[KIBERONE:${source}] ${message}`, detail || '');
}

export function getDiagnosticLog(): DiagnosticEntry[] {
  return [...diagnosticEntries];
}
