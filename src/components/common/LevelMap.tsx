import {
  Check,
  Code2,
  Cpu,
  Image as ImageIcon,
  KeyRound,
  Lock,
  Palette,
  Play,
  Scissors,
  Sparkles,
  Trophy,
  User,
  Wand2,
} from 'lucide-react';
import { LESSON_STAGES } from '../../data/lessonStages';
import { CHESTS_CATALOG, getKeyForStage, type MilestoneChest } from '../../utils/gamification';
import { ChestArtwork } from './ChestIllustrations';

interface LevelMapProps {
  currentStage: number;
  completedStages: number[];
  maxUnlockedStage?: number;
  openedChests?: string[];
  onSelectStage: (stageId: number) => void;
  onOpenChest?: (chest: MilestoneChest) => void;
}

const STAGE_ICONS = [
  Sparkles,
  Palette,
  Wand2,
  Cpu,
  ImageIcon,
  User,
  Scissors,
  Code2,
  Play,
  Trophy,
];

/**
 * Игровая карта приключения из 10 локаций с анимированным маршрутом,
 * коллекционными ключами, уникальными сундуками и честной блокировкой будущих этапов.
 */
export function LevelMap({
  currentStage,
  completedStages,
  maxUnlockedStage,
  openedChests = [],
  onSelectStage,
  onOpenChest,
}: LevelMapProps) {
  const progressPercent = Math.round((completedStages.length / LESSON_STAGES.length) * 100);
  const doneSet = new Set(completedStages);
  const highestCompleted = completedStages.length > 0 ? Math.max(...completedStages) : 0;
  const effectiveMaxStage =
    maxUnlockedStage ?? Math.min(10, Math.max(currentStage, highestCompleted + 1));

  return (
    <section className="space-y-5">
      {/* Header Progress Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
          <span className="font-extrabold text-[#26313B]">Маршрут приключения</span>
          <span className="text-slate-300" aria-hidden="true">
            ·
          </span>
          <span className="font-extrabold text-[#04959A] tabular-nums">
            Локация {currentStage} из {LESSON_STAGES.length}
          </span>
          <span className="text-slate-300" aria-hidden="true">
            ·
          </span>
          <span className="inline-flex items-center gap-1 font-bold text-amber-700 tabular-nums">
            <KeyRound className="w-3.5 h-3.5 text-[#F4C914]" />
            <span>Ключи: {completedStages.length} / 10</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-36 sm:w-48 h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#06B8BE] to-[#F4C914] transition-all duration-300"
              style={{ width: `${Math.max(8, progressPercent)}%` }}
            />
          </div>
          <span className="text-xs font-extrabold text-[#04959A] tabular-nums whitespace-nowrap">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Connected SVG Adventure Path with 10 Location Nodes */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#F4F8FB] via-white to-cyan-50/40 border border-slate-200 p-4 sm:p-6 overflow-hidden">
        {/* Decorative animated dashed SVG road behind desktop grid */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1000 180"
          preserveAspectRatio="none"
          className="hidden lg:block pointer-events-none absolute inset-x-10 top-1/2 -translate-y-1/2 w-[calc(100%-5rem)] h-36 opacity-55"
        >
          <path
            d="M 30 45 C 150 45, 160 135, 270 135 C 380 135, 400 45, 510 45 C 620 45, 640 135, 750 135 C 860 135, 880 45, 970 45"
            fill="none"
            stroke="#06B8BE"
            strokeWidth="4"
            strokeLinecap="round"
            className="animate-lab-flow"
          />
        </svg>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {LESSON_STAGES.map((s) => {
            const Icon = STAGE_ICONS[s.id - 1] || Sparkles;
            const isCurrent = s.id === currentStage;
            const isDone = doneSet.has(s.id);
            const isAccessible = isDone || isCurrent || s.id <= effectiveMaxStage;
            const keyArtifact = getKeyForStage(s.id);
            const milestoneChest = CHESTS_CATALOG.find((c) => c.afterStage === s.id);
            const isChestUnlocked = milestoneChest ? doneSet.has(milestoneChest.afterStage) : false;
            const isChestOpened = milestoneChest ? openedChests.includes(milestoneChest.id) : false;

            return (
              <div key={s.id} className="flex flex-col gap-2">
                <button
                  type="button"
                  disabled={!isAccessible}
                  onClick={() => isAccessible && onSelectStage(s.id)}
                  title={
                    isAccessible
                      ? `Перейти к этапу ${s.id}: ${s.shortTitle}`
                      : 'Этап закрыт: сначала выполни предыдущие этапы'
                  }
                  className={`group relative rounded-2xl p-3.5 text-left border-2 transition-all flex flex-col justify-between gap-2.5 min-w-0 shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06B8BE] ${
                    !isAccessible
                      ? 'bg-slate-50/90 border-slate-200/80 opacity-65 cursor-not-allowed'
                      : isCurrent
                      ? 'bg-white border-[#06B8BE] ring-4 ring-[#06B8BE]/15 cursor-pointer'
                      : isDone
                      ? 'bg-emerald-50/70 border-emerald-400/70 hover:border-emerald-500 cursor-pointer'
                      : 'bg-white border-slate-200 hover:border-[#06B8BE] cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`w-7 h-7 rounded-xl text-xs font-extrabold flex items-center justify-center shrink-0 tabular-nums ${
                        isCurrent
                          ? 'bg-[#06B8BE] text-white'
                          : isDone
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isDone && !isCurrent ? <Check className="w-4 h-4" /> : s.id}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {!isAccessible ? (
                        <span className="w-6 h-6 rounded-lg bg-slate-200/80 text-slate-500 flex items-center justify-center">
                          <Lock className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span
                          title={keyArtifact.name}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                            isDone ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-300'
                          }`}
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </span>
                      )}
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          !isAccessible
                            ? 'text-slate-400'
                            : isCurrent
                            ? 'text-[#06B8BE]'
                            : isDone
                            ? 'text-emerald-600'
                            : 'text-slate-400 group-hover:text-[#06B8BE]'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-[#04959A] truncate">
                      {s.locationName || s.shortTitle}
                    </p>
                    <p className="text-xs font-extrabold text-[#26313B] truncate mt-0.5">
                      {s.shortTitle}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 tabular-nums">
                      {!isAccessible
                        ? 'Закрыто — пройди раньше'
                        : isDone
                        ? `${keyArtifact.name} · открыть`
                        : isCurrent
                        ? 'Сейчас здесь'
                        : `Открыто · ~${s.recommendedMinutes} мин`}
                    </p>
                  </div>
                </button>

                {/* Milestone Treasure Chest Badge with unique custom illustration */}
                {milestoneChest && (
                  <button
                    type="button"
                    disabled={!isChestUnlocked || !onOpenChest}
                    onClick={() => milestoneChest && onOpenChest?.(milestoneChest)}
                    className={`rounded-xl px-2.5 py-1.5 border text-[11px] font-extrabold flex items-center gap-2 transition-all ${
                      isChestOpened
                        ? 'bg-amber-50 border-amber-200 text-amber-800 cursor-pointer'
                        : isChestUnlocked
                        ? 'bg-[#F4C914] hover:bg-amber-400 border-amber-500 text-[#26313B] shadow-xs cursor-pointer animate-lab-float'
                        : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <ChestArtwork chestId={milestoneChest.id} opened={isChestOpened} className="w-6 h-6 rounded-md shrink-0" />
                    <span className="truncate">
                      {isChestOpened
                        ? 'Сундук открыт'
                        : isChestUnlocked
                        ? 'Открыть сундук!'
                        : milestoneChest.title}
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
