import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  Gift,
  HelpCircle,
  KeyRound,
  LifeBuoy,
  Map,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { LESSON_STAGES } from '../data/lessonStages';
import type {
  ArtStyleId,
  BackgroundPromptDesign,
  CharacterDesign,
  LessonProgressState,
  ReflectionAnswers,
  ShowcaseChecklistState,
  StoryDesign,
  TestChecklistState,
} from '../types/lesson';
import {
  CHESTS_CATALOG,
  checkStageRequirements,
  getKeyForStage,
  getMascotReactionForStage,
  getMaxUnlockedStage,
  getReadyUnopenedChest,
  type MilestoneChest,
} from '../utils/gamification';
import { ChestRewardModal } from './common/ChestRewardModal';
import { GuideMascot } from './common/GuideMascot';
import { AchievementsModal, LevelMapModal } from './common/ProgressModals';
import { WaitingScreen } from './common/WaitingScreen';
import { Stage01Start } from './stages/Stage01Start';
import { Stage02VisualNovel } from './stages/Stage02VisualNovel';
import { Stage03StoryDesigner } from './stages/Stage03StoryDesigner';
import { Stage04AiScript } from './stages/Stage04AiScript';
import { Stage05BackgroundDesigner } from './stages/Stage05BackgroundDesigner';
import { Stage06CharacterDesigner } from './stages/Stage06CharacterDesigner';
import { Stage07AssetPrep } from './stages/Stage07AssetPrep';
import { Stage08PythonBuilder } from './stages/Stage08PythonBuilder';
import { Stage09TestLab } from './stages/Stage09TestLab';
import { Stage10Showcase } from './stages/Stage10Showcase';

interface StudentWorkspaceProps {
  state: LessonProgressState;
  onUpdate: (patch: Partial<LessonProgressState>) => void;
  onSetStage: (stageId: number) => void;
  onSelectGlobalStyle: (styleId: ArtStyleId) => void;
  onCompleteStage: (stageId: number) => { newlyCompleted: boolean };
  onOpenChest: (chestId: string) => void;
  onTeacherClearedAdvance: (stageId: number) => void;
  onCompleteBonusQuest: (questId: string) => void;
  onUpdateStory: (patch: Partial<StoryDesign>) => void;
  onUpdateBgPrompt: (patch: Partial<BackgroundPromptDesign>) => void;
  onUpdateCharacter: (patch: Partial<CharacterDesign>) => void;
  onUpdateTestChecklist: (patch: Partial<TestChecklistState>) => void;
  onUpdateShowcaseChecklist: (patch: Partial<ShowcaseChecklistState>) => void;
  onUpdateReflection: (patch: Partial<ReflectionAnswers>) => void;
}

export function StudentWorkspace({
  state,
  onUpdate,
  onSetStage,
  onSelectGlobalStyle,
  onCompleteStage,
  onOpenChest,
  onTeacherClearedAdvance,
  onCompleteBonusQuest,
  onUpdateStory,
  onUpdateBgPrompt,
  onUpdateCharacter,
  onUpdateTestChecklist,
  onUpdateShowcaseChecklist,
  onUpdateReflection,
}: StudentWorkspaceProps) {
  const [openHelpLevel, setOpenHelpLevel] = useState<0 | 1 | 2 | 3>(0);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [waitingStageId, setWaitingStageId] = useState<number | null>(null);
  const [celebratedKey, setCelebratedKey] = useState<string | null>(null);
  const [activeChest, setActiveChest] = useState<MilestoneChest | null>(null);

  const stage = LESSON_STAGES.find((s) => s.id === state.currentStage) || LESSON_STAGES[0];
  const isCurrentDone = state.completedStages.includes(stage.id);
  const requirement = checkStageRequirements(stage.id, state);
  const maxUnlockedStage = getMaxUnlockedStage(state);
  const hasValidationError =
    (stage.id === 4 && Boolean((state.finalScenario || state.aiScriptResult).trim()) && !requirement.ready) ||
    (stage.id === 7 && state.uploadedCharacterHasTransparency === false);
  const mascot = getMascotReactionForStage(stage.id, requirement.ready, isCurrentDone, {
    hasStruggle: openHelpLevel !== 0,
    hasError: hasValidationError,
  });
  const progressPercent = Math.round((state.completedStages.length / LESSON_STAGES.length) * 100);
  const readyChest = getReadyUnopenedChest(state.completedStages, state.openedChests);

  useEffect(() => {
    setOpenHelpLevel(0);
    setWaitingStageId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [state.currentStage]);

  const toggleHelp = (level: 1 | 2 | 3) => {
    setOpenHelpLevel((prev) => (prev === level ? 0 : level));
  };

  const handlePrimaryComplete = () => {
    if (!requirement.ready) return;

    const { newlyCompleted } = onCompleteStage(stage.id);
    if (newlyCompleted) {
      const key = getKeyForStage(stage.id);
      setCelebratedKey(`${key.name} (+10 XP)`);
      window.setTimeout(() => setCelebratedKey(null), 4500);

      // Automatically surface unlocked milestone chest if this stage completes a milestone
      const nextCompleted = [...state.completedStages, stage.id];
      const unlockedMilestone = getReadyUnopenedChest(nextCompleted, state.openedChests);
      if (unlockedMilestone) {
        setActiveChest(unlockedMilestone);
      }
    }

    if (stage.id === 10) {
      return;
    }

    // If teacher hasn't yet cleared this stage in this session, open the Waiting Screen
    if (!state.teacherClearedStages.includes(stage.id)) {
      setWaitingStageId(stage.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onSetStage(stage.id + 1);
    }
  };

  const isWaiting = waitingStageId === stage.id;

  return (
    <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4 sm:py-5 space-y-4">
      {/* Compact Light Top Student HUD */}
      <section className="no-print bg-white border border-slate-200/90 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <span className="px-2.5 py-1 rounded-xl bg-[#06B8BE] text-white text-xs font-extrabold tabular-nums shrink-0">
            Этап {stage.id} / 10
          </span>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-extrabold text-[#26313B] truncate">{stage.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-28 sm:w-40 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#06B8BE] to-[#F4C914] transition-all duration-300"
                  style={{ width: `${Math.max(8, progressPercent)}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-500 tabular-nums">{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* HUD Quick Actions: Map, Keys/Trophies, Unopened Chest, Help */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {readyChest && (
            <button
              type="button"
              onClick={() => setActiveChest(readyChest)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F4C914] hover:bg-amber-400 text-[#26313B] text-xs font-extrabold cursor-pointer whitespace-nowrap shadow-xs animate-lab-float"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Открыть сундук!</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowMapModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-cyan-50 border border-slate-200 text-xs font-bold text-[#26313B] cursor-pointer whitespace-nowrap"
          >
            <Map className="w-3.5 h-3.5 text-[#06B8BE]" />
            <span>Карта</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAchievementsModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-[#F4C914]/60 text-xs font-bold text-[#26313B] cursor-pointer whitespace-nowrap tabular-nums"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-600" />
            <span>
              Ключи {state.unlockedKeys.length}/10 · <Award className="w-3 h-3 inline text-[#06B8BE]" />{' '}
              {state.earnedAchievements.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => toggleHelp(1)}
            className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer whitespace-nowrap ${
              openHelpLevel === 1
                ? 'bg-[#F4C914] text-[#26313B] border-[#F4C914]'
                : 'bg-slate-50 border-slate-200 text-[#26313B] hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#04959A]" />
            <span>Подсказка</span>
            {openHelpLevel === 1 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            type="button"
            onClick={() => toggleHelp(2)}
            className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer whitespace-nowrap ${
              openHelpLevel === 2
                ? 'bg-[#06B8BE] text-white border-[#06B8BE]'
                : 'bg-slate-50 border-slate-200 text-[#26313B] hover:bg-slate-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Пример</span>
          </button>

          <button
            type="button"
            onClick={() => toggleHelp(3)}
            className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer whitespace-nowrap ${
              openHelpLevel === 3
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Помощь</span>
          </button>
        </div>
      </section>

      {/* Key Awarded Celebration Banner */}
      {celebratedKey && (
        <div
          role="status"
          className="no-print animate-lab-celebrate rounded-2xl bg-gradient-to-r from-amber-50 to-cyan-50 text-[#26313B] px-5 py-3 border-2 border-[#F4C914] flex items-center justify-between gap-3 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="animate-lab-key w-9 h-9 rounded-xl bg-[#F4C914] text-[#26313B] flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <p className="text-sm font-extrabold">
              Ключ получен! <span className="text-[#04959A]">{celebratedKey}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCelebratedKey(null)}
            className="text-xs font-bold text-slate-500 hover:text-[#26313B] cursor-pointer"
          >
            Скрыть
          </button>
        </div>
      )}

      {/* Expandable On-Demand Help Panel */}
      {openHelpLevel !== 0 && !isWaiting && (
        <section className="no-print animate-lab-enter space-y-2">
          {openHelpLevel === 1 && (
            <div className="rounded-2xl bg-amber-50 border border-[#F4C914] p-4 text-sm text-[#26313B] space-y-1.5">
              <p className="font-extrabold text-amber-800">Подсказка · Где сделать: {stage.whereToDo}</p>
              <p className="leading-relaxed">{stage.hint}</p>
              <p className="text-xs font-semibold text-amber-900">Критерий готовности: {stage.howToKnowDone}</p>
            </div>
          )}

          {openHelpLevel === 2 && (
            <div className="rounded-2xl bg-cyan-50 border border-[#06B8BE] p-4 text-sm text-[#26313B] space-y-1">
              <p className="font-extrabold text-[#04959A]">Пример · {stage.exampleTitle}</p>
              <p className="leading-relaxed">{stage.exampleSummary}</p>
            </div>
          )}

          {openHelpLevel === 3 && (
            <div className="rounded-2xl bg-rose-50 border border-rose-300 p-4 text-sm text-rose-950 space-y-2">
              <p className="font-extrabold text-rose-700">Помощь: {stage.troubleshooting.symptom}</p>
              <ol className="space-y-1 list-decimal pl-5 text-xs sm:text-sm">
                {stage.troubleshooting.steps.map((step) => (
                  <li key={step} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>
      )}

      {/* Waiting Screen OR Active Single-Task Stage */}
      {isWaiting ? (
        <WaitingScreen
          stageNumber={stage.id}
          stageTitle={stage.shortTitle}
          rewardBadge={stage.rewardBadge}
          xp={state.xp}
          completedStages={state.completedStages}
          completedBonusQuests={state.completedBonusQuests}
          onCompleteBonusQuest={onCompleteBonusQuest}
          onReturnToStage={() => setWaitingStageId(null)}
          onTeacherApproveAdvance={() => {
            setWaitingStageId(null);
            onTeacherClearedAdvance(stage.id);
          }}
        />
      ) : (
        <>
          {/* Compact CyberBot + Single Clear Task Prompt */}
          {stage.id < 10 && (
            <div className="no-print space-y-3">
              <GuideMascot compact emotion={mascot.emotion} message={mascot.line} />
              <div className="rounded-2xl bg-white border border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm shadow-xs">
                <p className="text-[#26313B]">
                  <strong className="text-[#04959A]">Задача этапа:</strong> {stage.whatToDo}
                </p>
                <span className="text-xs font-semibold text-slate-500">Где: {stage.whereToDo}</span>
              </div>
            </div>
          )}

          {/* Active Stage Interactive Content */}
          <section key={`content-${stage.id}`} className="animate-lab-enter">
            {stage.id === 1 && <Stage01Start state={state} onUpdate={onUpdate} />}
            {stage.id === 2 && (
              <Stage02VisualNovel
                state={state}
                onUpdate={onUpdate}
                onUpdateStory={onUpdateStory}
                onSelectGlobalStyle={onSelectGlobalStyle}
              />
            )}
            {stage.id === 3 && (
              <Stage03StoryDesigner
                story={state.story}
                selectedStyle={state.selectedArtStyle}
                onUpdateStory={onUpdateStory}
              />
            )}
            {stage.id === 4 && <Stage04AiScript state={state} onUpdate={onUpdate} />}
            {stage.id === 5 && (
              <Stage05BackgroundDesigner
                state={state}
                onUpdate={onUpdate}
                onUpdatePromptDesign={onUpdateBgPrompt}
              />
            )}
            {stage.id === 6 && (
              <Stage06CharacterDesigner
                state={state}
                onUpdate={onUpdate}
                onUpdateCharacter={onUpdateCharacter}
              />
            )}
            {stage.id === 7 && <Stage07AssetPrep state={state} onUpdate={onUpdate} />}
            {stage.id === 8 && <Stage08PythonBuilder state={state} onUpdate={onUpdate} />}
            {stage.id === 9 && (
              <Stage09TestLab
                state={state}
                onUpdate={onUpdate}
                onUpdateChecklist={onUpdateTestChecklist}
              />
            )}
            {stage.id === 10 && (
              <Stage10Showcase
                state={state}
                onUpdate={onUpdate}
                onUpdateStory={onUpdateStory}
                onUpdateChecklist={onUpdateShowcaseChecklist}
                onUpdateReflection={onUpdateReflection}
                onOpenFinalChest={() => {
                  const finalChest = CHESTS_CATALOG.find((c) => c.id === 'chest_final') || null;
                  if (finalChest) setActiveChest(finalChest);
                }}
              />
            )}
          </section>

          {/* Bottom Stage Primary Action Bar */}
          <footer className="no-print bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <button
              type="button"
              onClick={() => onSetStage(stage.id - 1)}
              disabled={stage.id === 1}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-colors whitespace-nowrap ${
                stage.id === 1
                  ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                  : 'border-slate-200 bg-slate-50 text-[#26313B] hover:bg-slate-100 cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Назад</span>
            </button>

            <div className="flex flex-wrap items-center gap-3 ml-auto">
              {!requirement.ready && (
                <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 border border-[#F4C914]/70 text-xs font-bold text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{requirement.missingReason}</span>
                </div>
              )}

              {stage.id < 10 ? (
                <button
                  type="button"
                  onClick={handlePrimaryComplete}
                  disabled={!requirement.ready}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-extrabold text-sm shadow-sm transition-all whitespace-nowrap ${
                    requirement.ready
                      ? 'bg-[#06B8BE] hover:bg-[#04959A] text-white cursor-pointer shadow-[#06B8BE]/25'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  }`}
                >
                  <span>
                    {state.teacherClearedStages.includes(stage.id)
                      ? `Перейти к этапу ${stage.id + 1}`
                      : 'Этап выполнен! Получить ключ (+10 XP)'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePrimaryComplete}
                  disabled={!requirement.ready}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-extrabold text-sm shadow-sm transition-colors whitespace-nowrap ${
                    requirement.ready
                      ? 'bg-[#F4C914] hover:bg-amber-400 text-[#26313B] cursor-pointer'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{isCurrentDone ? 'Все 10 ключей собраны!' : 'Завершить приключение (+10 XP)'}</span>
                </button>
              )}
            </div>
          </footer>
        </>
      )}

      {/* Separate Adventure Map, Collection & Chest Modals */}
      <LevelMapModal
        open={showMapModal}
        onClose={() => setShowMapModal(false)}
        currentStage={stage.id}
        completedStages={state.completedStages}
        maxUnlockedStage={maxUnlockedStage}
        openedChests={state.openedChests}
        onSelectStage={onSetStage}
        onOpenChest={(chest) => setActiveChest(chest)}
      />

      <AchievementsModal
        open={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        xp={state.xp}
        earnedIds={state.earnedAchievements}
        unlockedKeys={state.unlockedKeys}
        openedChests={state.openedChests}
        claimedStickers={state.claimedStickers}
      />

      <ChestRewardModal
        chest={activeChest}
        onClose={() => setActiveChest(null)}
        onClaimChest={onOpenChest}
      />
    </main>
  );
}
