import {
  AlertTriangle,
  ArrowRight,
  Award,
  Clock,
  KeyRound,
  Map,
  Monitor,
  RotateCcw,
  Sparkles,
  Trophy,
  User,
} from 'lucide-react';
import { useState } from 'react';
import type { AppMode } from '../types/lesson';
import { GuideMascot } from './common/GuideMascot';
import { HeroLabIllustration } from './common/LabIllustrations';
import { LevelMapModal } from './common/ProgressModals';

interface ModeSelectorProps {
  hasSavedProgress: boolean;
  currentStage: number;
  completedStages: number[];
  maxUnlockedStage: number;
  xp: number;
  unlockedKeysCount: number;
  onSelectMode: (mode: AppMode) => void;
  onJumpToStage: (stageId: number) => void;
  onResetProgress: () => void;
}

export function ModeSelector({
  hasSavedProgress,
  currentStage,
  completedStages,
  maxUnlockedStage,
  xp,
  unlockedKeysCount,
  onSelectMode,
  onJumpToStage,
  onResetProgress,
}: ModeSelectorProps) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [showMap, setShowMap] = useState(false);

  return (
    <main className="max-w-[1260px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-[#04959A]">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F4C914]" />
                <span>Игровая цифровая мастерская</span>
              </span>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <span className="inline-flex items-center gap-1 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-[#06B8BE]" />
                <span>60 минут</span>
              </span>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <span className="inline-flex items-center gap-1 text-slate-600">
                <User className="w-3.5 h-3.5 text-[#06B8BE]" />
                <span>Личный проект</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#26313B] tracking-tight leading-[1.12] text-balance">
              KIBERONE <span className="text-[#06B8BE]">GAME CREATOR</span> ADVENTURE
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              {hasSavedProgress ? (
                <>
                  Твой проект уже ждёт! Возвращайся в студию, открой сундуки наград и доведи{' '}
                  <strong className="text-[#26313B]">собственную визуальную новеллу на Python и Pygame</strong> до
                  релиза.
                </>
              ) : (
                <>
                  Пройди путь из 10 игровых локаций, собери ключи и создай{' '}
                  <strong className="text-[#26313B]">свою собственную визуальную новеллу на Python и Pygame</strong> с
                  сюжетом, фоном и героем!
                </>
              )}
            </p>

            {/* Saved Progress Card — ONLY rendered in State B (Сохранённый проект) */}
            {hasSavedProgress && (
              <div className="rounded-2xl bg-gradient-to-r from-cyan-50/80 to-amber-50/70 border border-[#06B8BE]/40 p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#04959A]">
                    Сохранённое приключение
                  </p>
                  <p className="text-base font-extrabold text-[#26313B] mt-0.5 tabular-nums">
                    Текущий этап: {currentStage} из 10
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 flex items-center gap-2 text-xs font-extrabold text-[#26313B] tabular-nums">
                    <Award className="w-4 h-4 text-[#06B8BE]" />
                    <span>{xp} XP</span>
                  </div>
                  <div className="px-3.5 py-2 rounded-xl bg-white border border-[#F4C914]/70 flex items-center gap-2 text-xs font-extrabold text-amber-800 tabular-nums">
                    <KeyRound className="w-4 h-4 text-[#F4C914]" />
                    <span>Ключи: {unlockedKeysCount}/10</span>
                  </div>
                </div>
              </div>
            )}

            <GuideMascot
              emotion={hasSavedProgress ? 'joy' : 'support'}
              message={
                hasSavedProgress
                  ? `С возвращением! Ты остановился на этапе ${currentStage} из 10. У тебя уже ${xp} XP и ${unlockedKeysCount} ключей — продолжим создавать твою игру!`
                  : 'Привет! Я КиберБот. Мы вместе пройдём 10 этапов от идеи до настоящей игры на Python! Жми «Начать приключение», и погнали!'
              }
            />
          </div>

          {/* Primary Launch Actions */}
          <div className="pt-6 mt-6 border-t border-slate-100 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              {hasSavedProgress ? (
                <>
                  <button
                    type="button"
                    onClick={() => onSelectMode('student')}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#06B8BE] hover:bg-[#04959A] text-white font-extrabold text-sm sm:text-base shadow-md shadow-[#06B8BE]/25 transition-all cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06B8BE]"
                  >
                    <span>Продолжить приключение</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {!confirmReset && (
                    <button
                      type="button"
                      onClick={() => setConfirmReset(true)}
                      className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-300 text-[#26313B] font-bold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <RotateCcw className="w-4 h-4 text-rose-500" />
                      <span>Начать новое приключение</span>
                    </button>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelectMode('student')}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-[#06B8BE] hover:bg-[#04959A] text-white font-extrabold text-base shadow-md shadow-[#06B8BE]/25 transition-all cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06B8BE]"
                >
                  <span>Начать приключение</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowMap(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-[#F4C914] text-[#26313B] font-bold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Map className="w-4 h-4 text-amber-600" />
                <span>Карта приключения</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectMode('teacher')}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-[#26313B] font-bold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Monitor className="w-4 h-4 text-[#04959A]" />
                <span>Преподавателю</span>
              </button>
            </div>

            {confirmReset && (
              <div
                role="alertdialog"
                aria-label="Подтверждение сброса прогресса"
                className="animate-lab-enter rounded-2xl bg-rose-50 border-2 border-rose-300 p-4 flex flex-wrap items-center justify-between gap-3"
              >
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-rose-950">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold">Начать новое приключение с нуля?</p>
                    <p className="text-xs text-rose-800 mt-0.5">
                      Текущий сюжет, промпты, собранные ключи ({unlockedKeysCount}) и опыт ({xp} XP) будут очищены.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onResetProgress();
                      setConfirmReset(false);
                      onSelectMode('student');
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold cursor-pointer whitespace-nowrap"
                  >
                    Да, сбросить и начать
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-[#26313B] hover:bg-slate-50 cursor-pointer whitespace-nowrap"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Visual Game Preview & Outcome Trophy */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <HeroLabIllustration />

          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 flex items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-[#F4C914]/60 text-amber-600 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#26313B]">Твоя будущая игра</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                  Окно 1000×600 на Python + Pygame с фоном, персонажем, 2 финалами и именной грамотой
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              {hasSavedProgress && (
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#04959A] tabular-nums">
                  <KeyRound className="w-3.5 h-3.5 text-[#F4C914]" />
                  <span>{unlockedKeysCount}/10</span>
                </span>
              )}
              <span className="font-mono text-[11px] font-bold text-slate-500">main.py</span>
            </div>
          </div>
        </div>
      </section>

      <LevelMapModal
        open={showMap}
        onClose={() => setShowMap(false)}
        currentStage={currentStage}
        completedStages={completedStages}
        maxUnlockedStage={maxUnlockedStage}
        onSelectStage={(stageId) => {
          onJumpToStage(stageId);
          onSelectMode('student');
        }}
      />
    </main>
  );
}

