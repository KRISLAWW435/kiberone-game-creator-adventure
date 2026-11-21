import { Award, CheckCircle2, Gift, KeyRound, Lock, Map, X } from 'lucide-react';
import {
  ACHIEVEMENTS_CATALOG,
  CHESTS_CATALOG,
  STAGE_KEYS_CATALOG,
  type MilestoneChest,
} from '../../utils/gamification';
import { ChestStickerArtwork } from './ChestIllustrations';
import { LevelMap } from './LevelMap';

interface LevelMapModalProps {
  open: boolean;
  onClose: () => void;
  currentStage: number;
  completedStages: number[];
  maxUnlockedStage?: number;
  openedChests?: string[];
  onSelectStage: (stageId: number) => void;
  onOpenChest?: (chest: MilestoneChest) => void;
}

export function LevelMapModal({
  open,
  onClose,
  currentStage,
  completedStages,
  maxUnlockedStage,
  openedChests = [],
  onSelectStage,
  onOpenChest,
}: LevelMapModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Карта приключения"
    >
      <div className="animate-lab-enter w-full max-w-5xl bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-[#06B8BE]/40 flex items-center justify-center">
              <Map className="w-5 h-5 text-[#06B8BE]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#26313B]">
                Карта приключения Game Creator
              </h2>
              <p className="text-xs text-slate-500">
                Открывай пройденные и текущий этапы в любой момент — прогресс и XP сохраняются
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            aria-label="Закрыть карту"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <LevelMap
          currentStage={currentStage}
          completedStages={completedStages}
          maxUnlockedStage={maxUnlockedStage}
          openedChests={openedChests}
          onSelectStage={(id) => {
            onSelectStage(id);
            onClose();
          }}
          onOpenChest={(chest) => {
            onClose();
            onOpenChest?.(chest);
          }}
        />
      </div>
    </div>
  );
}

interface AchievementsModalProps {
  open: boolean;
  onClose: () => void;
  xp: number;
  earnedIds: string[];
  unlockedKeys?: string[];
  openedChests?: string[];
  claimedStickers?: string[];
}

export function AchievementsModal({
  open,
  onClose,
  xp,
  earnedIds,
  unlockedKeys = [],
  openedChests = [],
  claimedStickers = [],
}: AchievementsModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Трофеи, ключи и достижения"
    >
      <div className="animate-lab-enter w-full max-w-4xl bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-[#F4C914] flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#26313B]">
                Коллекция ключей, сундуков и достижений
              </h2>
              <p className="text-xs text-slate-500 tabular-nums">
                Опыт: <strong className="text-[#04959A]">{xp} XP</strong> · Ключи:{' '}
                <strong className="text-amber-700">{unlockedKeys.length}/10</strong> · Сундуки:{' '}
                <strong className="text-[#26313B]">{openedChests.length}/{CHESTS_CATALOG.length}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            aria-label="Закрыть коллекцию"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collected Keys Row */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-[#F4C914]" />
            <span>Ключи этапов ({unlockedKeys.length} / 10)</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {STAGE_KEYS_CATALOG.map((k) => {
              const hasKey = unlockedKeys.includes(k.id);
              return (
                <div
                  key={k.id}
                  className={`rounded-xl p-2.5 border text-left transition-all ${
                    hasKey
                      ? 'bg-amber-50/70 border-[#F4C914]/70 text-[#26313B]'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <KeyRound
                      className="w-4 h-4"
                      style={{ color: hasKey ? k.accentColor : '#CBD5E1' }}
                    />
                    <span className="text-[10px] font-bold tabular-nums">#{k.stageId}</span>
                  </div>
                  <p className="text-xs font-extrabold leading-tight truncate">{k.name}</p>
                  <p className="text-[10px] opacity-80 truncate">{k.subtitle}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stickers from Chests with unique artworks */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-[#06B8BE]" />
            <span>Стикеры из сундуков ({claimedStickers.length} / {CHESTS_CATALOG.length})</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {CHESTS_CATALOG.map((chest) => {
              const hasSticker = claimedStickers.includes(chest.stickerId);
              return (
                <div
                  key={chest.id}
                  className={`rounded-xl p-3 border flex items-center gap-3 ${
                    hasSticker
                      ? 'bg-cyan-50/70 border-[#06B8BE]/60 text-[#26313B]'
                      : 'bg-slate-50 border-slate-200 text-slate-400 opacity-75'
                  }`}
                >
                  <div className={hasSticker ? '' : 'grayscale opacity-45'}>
                    <ChestStickerArtwork chestId={chest.id} className="w-11 h-11 shrink-0" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold">Этап {chest.afterStage}</p>
                    <p className="text-xs font-extrabold truncate">{chest.stickerTitle}</p>
                    <p className="text-[11px] leading-snug opacity-80 truncate">{chest.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements Catalog */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Достижения разработчика ({earnedIds.length} / {ACHIEVEMENTS_CATALOG.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ACHIEVEMENTS_CATALOG.map((ach) => {
              const unlocked = earnedIds.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`rounded-2xl p-3.5 border space-y-1 transition-all ${
                    unlocked
                      ? 'bg-emerald-50/60 border-emerald-300 text-[#26313B]'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold text-[#04959A]">{ach.xpHint}</span>
                    {unlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                  </div>
                  <p className="text-sm font-extrabold leading-snug">{ach.title}</p>
                  <p className="text-xs opacity-85 leading-relaxed">{ach.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
