import { Award, Compass, Download, Home, Monitor } from 'lucide-react';
import type { AppMode } from '../types/lesson';

interface TopBarProps {
  mode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  onExportJson: () => void;
  hasSavedProgress: boolean;
  currentStage: number;
  completedCount: number;
  xp: number;
}

export function TopBar({
  mode,
  onSelectMode,
  onExportJson,
  hasSavedProgress,
  currentStage,
  completedCount,
  xp,
}: TopBarProps) {
  return (
    <header className="no-print sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_1px_12px_rgba(38,49,59,0.04)]">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectMode('select')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06B8BE]"
        >
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#06B8BE] to-[#04959A] text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
            K
          </span>
          <span className="text-sm sm:text-base font-extrabold tracking-tight text-[#26313B] group-hover:text-[#04959A] transition-colors">
            KIBERONE <span className="text-[#06B8BE]">GAME CREATOR</span>
          </span>
        </button>

        {/* Zone 2: Clean Single-Line Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-500">
          <button
            type="button"
            onClick={() => onSelectMode('select')}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer py-1 border-b-2 transition-colors ${
              mode === 'select'
                ? 'text-[#26313B] border-[#06B8BE] font-bold'
                : 'border-transparent hover:text-[#26313B]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Главная</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectMode('student')}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer py-1 border-b-2 transition-colors ${
              mode === 'student'
                ? 'text-[#26313B] border-[#06B8BE] font-bold'
                : 'border-transparent hover:text-[#26313B]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Приключение</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectMode('teacher')}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer py-1 border-b-2 transition-colors ${
              mode === 'teacher'
                ? 'text-[#26313B] border-[#F4C914] font-bold'
                : 'border-transparent hover:text-[#26313B]'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Экран преподавателя</span>
          </button>

          {mode === 'student' && (
            <span className="text-xs font-bold text-[#04959A] tabular-nums whitespace-nowrap shrink-0">
              Этап {currentStage}/10 · Ключи {completedCount}
            </span>
          )}
        </nav>

        {/* Zone 3: Student XP (when started) or Teacher Backup JSON */}
        <div className="flex items-center gap-2.5 shrink-0">
          {(mode === 'student' || hasSavedProgress) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-[#F4C914]/60 text-xs font-extrabold text-[#26313B] tabular-nums">
              <Award className="w-3.5 h-3.5 text-[#06B8BE]" />
              <span>{xp} XP</span>
            </span>
          )}

          {mode === 'teacher' && (
            <button
              type="button"
              onClick={onExportJson}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-[#26313B] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06B8BE]"
            >
              <Download className="w-4 h-4 text-[#04959A]" />
              <span className="hidden sm:inline">Сохранить JSON</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
