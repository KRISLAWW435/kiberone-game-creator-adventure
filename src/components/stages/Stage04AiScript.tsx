import { AlertTriangle, CheckCircle2, Circle, ExternalLink, RefreshCw, Sparkles } from 'lucide-react';
import type { LessonProgressState } from '../../types/lesson';
import { buildAiScriptPrompt } from '../../utils/promptBuilders';
import { validateFinalScenario } from '../../utils/scenarioValidator';
import { CopyButton } from '../common/CopyButton';

interface Stage04AiScriptProps {
  state: LessonProgressState;
  onUpdate: (patch: Partial<LessonProgressState>) => void;
}

const REFINEMENT_PROMPTS = [
  {
    label: 'Сделай реплики короче',
    text: 'Сократи каждую реплику до 1–2 коротких предложений (до 120 символов), чтобы текст красиво помещался в окно игры.',
  },
  {
    label: 'Сделай финалы ярче',
    text: 'Сделай разницу между Финалом 1 и Финалом 2 более неожиданной и эмоциональной, но оставь по 3 реплики в каждом.',
  },
  {
    label: 'Добавь интриги',
    text: 'Добавь чуть больше тайны в первые 3 реплики, чтобы игроку было интересно узнать развязку.',
  },
];

export function Stage04AiScript({ state, onUpdate }: Stage04AiScriptProps) {
  const autoPrompt = buildAiScriptPrompt(state.story, state.selectedArtStyle);
  const currentPrompt = state.scenarioPrompt || state.aiScriptPrompt || autoPrompt;
  const currentScenario = state.finalScenario || state.aiScriptResult || '';

  const validation = validateFinalScenario(currentScenario, currentPrompt);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Left: Step 1 — Scenario Prompt for AI */}
      <section className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#26313B]">1. Скопируй промпт и отправь в ИИ</h3>
            <p className="text-xs text-slate-500">
              Копирование промпта — первый шаг. Этап засчитается, когда ты вставишь готовый ответ справа!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://chat.deepseek.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-cyan-50 text-xs font-extrabold text-[#26313B] whitespace-nowrap"
            >
              <span>DeepSeek</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#06B8BE]" />
            </a>
            <a
              href="https://chat.qwen.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 text-xs font-extrabold text-[#26313B] whitespace-nowrap"
            >
              <span>Qwen</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
            </a>
          </div>
        </div>

        <textarea
          rows={10}
          value={currentPrompt}
          onChange={(e) => onUpdate({ scenarioPrompt: e.target.value })}
          className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 font-mono text-xs text-[#26313B] leading-relaxed focus:outline-none focus:border-[#06B8BE]"
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onUpdate({ scenarioPrompt: '' })}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-[#26313B] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#06B8BE]" />
            <span>Обновить из сюжета</span>
          </button>

          <CopyButton
            text={currentPrompt}
            label="Скопировать промпт"
            variant="primary"
            onCopied={() => onUpdate({ stage4PromptCopied: true })}
          />
        </div>

        <div className="pt-3 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F4C914]" />
            <span>Если ответ ИИ слишком длинный или сухой — отправь уточнение:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {REFINEMENT_PROMPTS.map((ref) => (
              <CopyButton
                key={ref.label}
                text={ref.text}
                label={ref.label}
                copiedLabel="Скопировано!"
                variant="secondary"
                className="text-xs py-1.5 px-3"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Right: Step 2 — Final Scenario + 6-Part Live Validator */}
      <section className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-3.5 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#26313B]">2. Вставь готовый сценарий от ИИ</h3>
            <p className="text-xs text-slate-500">
              Именно этот текст станет сценарием твоей будущей игры.
            </p>
          </div>
          <span
            className={`px-2.5 py-1 rounded-xl text-xs font-extrabold tabular-nums ${
              validation.isValid
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {validation.passedCount} / 6 частей
          </span>
        </div>

        {validation.isLikelyPromptPaste && (
          <div className="rounded-2xl bg-rose-50 border border-rose-300 p-3.5 flex items-start gap-2.5 text-xs font-bold text-rose-900">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>
              Похоже, ты вставил сюда текст самого промпта-инструкции. Отправь промпт в DeepSeek или Qwen и вставь сюда
              ответ нейросети!
            </span>
          </div>
        )}

        <textarea
          rows={11}
          value={currentScenario}
          onChange={(e) => onUpdate({ finalScenario: e.target.value })}
          placeholder="Вставь сюда готовый ответ от DeepSeek или Qwen: название, вступление, диалоги («Имя: текст»), Вариант 1 / Вариант 2, Финал 1 и Финал 2..."
          className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-[#26313B] placeholder:text-slate-400 leading-relaxed focus:outline-none focus:border-[#06B8BE]"
        />

        {/* Live 6-Part Structure Checklist */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 space-y-2">
          <p className="text-xs font-extrabold text-[#26313B]">Проверка структуры готового сценария:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {validation.checks.map((item) => (
              <div
                key={item.id}
                title={item.passed ? undefined : item.hint}
                className={`px-2.5 py-1.5 rounded-xl border text-xs flex items-center gap-2 ${
                  item.passed
                    ? 'bg-emerald-50/75 border-emerald-300 text-emerald-900 font-bold'
                    : 'bg-white border-slate-200 text-slate-500'
                }`}
              >
                {item.passed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                )}
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
