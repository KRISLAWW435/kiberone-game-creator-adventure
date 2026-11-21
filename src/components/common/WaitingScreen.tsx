import { ArrowLeft, ArrowRight, Award, Clock, ShieldCheck } from 'lucide-react';
import { pickCyberBotLine } from '../../config/cyberbotLines';
import { GuideMascot } from './GuideMascot';
import { WaitingMiniQuests } from './WaitingMiniQuests';

interface WaitingScreenProps {
  stageNumber: number;
  stageTitle: string;
  rewardBadge: string;
  xp: number;
  completedBonusQuests: string[];
  onCompleteBonusQuest: (questId: string) => void;
  onReturnToStage: () => void;
  onTeacherApproveAdvance: () => void;
}

/**
 * Экран ожидания после выполнения обязательной задачи этапа (Этапы 1–9).
 * Исключает автопереход и синхронизирует темп класса по ручному сигналу преподавателя.
 */
export function WaitingScreen({
  stageNumber,
  stageTitle,
  rewardBadge,
  xp,
  completedBonusQuests,
  onCompleteBonusQuest,
  onReturnToStage,
  onTeacherApproveAdvance,
}: WaitingScreenProps) {
  const waitingLine = pickCyberBotLine(stageNumber, 'waiting');

  return (
    <section className="animate-lab-enter bg-white border-2 border-[#06B8BE]/45 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-50 border border-[#F4C914]/70 text-xs font-extrabold text-amber-800">
            <Clock className="w-3.5 h-3.5" />
            <span>Ожидаем сигнал преподавателя</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#26313B] tracking-tight">
            Отличная работа! Ключ получен — ждём класс
          </h2>
          <p className="text-sm text-slate-600">
            Этап {stageNumber} («{stageTitle}») выполнен! Награда: +10 XP и{' '}
            <span className="text-[#04959A] font-extrabold">«{rewardBadge}»</span>.
          </p>
        </div>

        <div className="shrink-0 rounded-2xl bg-amber-50 border border-[#F4C914]/60 px-5 py-3.5 text-center">
          <p className="text-[11px] font-bold text-slate-500">Твой опыт</p>
          <p className="text-2xl font-extrabold text-[#26313B] tabular-nums flex items-center justify-center gap-1.5 mt-0.5">
            <Award className="w-5 h-5 text-[#06B8BE]" />
            <span>{xp} XP</span>
          </p>
        </div>
      </div>

      {/* CyberBot Praise */}
      <GuideMascot compact emotion="joy" message={waitingLine} />

      {/* Stage-specific Mini Quests */}
      <div className="rounded-2xl bg-[#F4F8FB] border border-slate-200 p-5">
        <WaitingMiniQuests
          stageNumber={stageNumber}
          completedQuestIds={completedBonusQuests}
          onCompleteQuest={onCompleteBonusQuest}
        />
      </div>

      {/* Manual Navigation Actions (no auto-advance) */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onReturnToStage}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[#26313B] text-sm font-bold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться к этапу</span>
        </button>

        <button
          type="button"
          onClick={onTeacherApproveAdvance}
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#06B8BE] hover:bg-[#04959A] text-white text-sm sm:text-base font-extrabold shadow-md shadow-[#06B8BE]/25 transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-5 h-5" />
          <span>Преподаватель разрешил продолжить (Этап {stageNumber + 1})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
