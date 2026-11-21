import { AlertTriangle, CheckSquare, Square, Wrench } from 'lucide-react';
import type { LessonProgressState, TestChecklistState } from '../../types/lesson';
import { buildBugFixPrompt } from '../../utils/promptBuilders';
import { CopyButton } from '../common/CopyButton';
import { MemeReactionCard } from '../common/MemeReactionCard';

interface Stage09TestLabProps {
  state: LessonProgressState;
  onUpdate: (patch: Partial<LessonProgressState>) => void;
  onUpdateChecklist: (patch: Partial<TestChecklistState>) => void;
}

const TEST_ITEMS: Array<{ key: keyof TestChecklistState; label: string; tip: string }> = [
  { key: 'projectRuns', label: 'Проект запускается', tip: 'Открывается окно игры размером 1000×600' },
  { key: 'backgroundVisible', label: 'Фон отображается', tip: 'Видна выбранная или созданная локация' },
  { key: 'characterVisible', label: 'Персонаж без белого квадрата', tip: 'Прозрачный PNG стоит поверх фона' },
  { key: 'russianTextReadable', label: 'Русский текст читается', tip: 'Нет квадратиков или знаков вопроса' },
  { key: 'dialoguesSwitch', label: 'Диалоги переключаются', tip: 'Реплики листаются кликом или пробелом' },
  { key: 'choiceOneWorks', label: 'Кнопка выбора 1 работает', tip: 'Открывает первую сюжетную ветку' },
  { key: 'choiceTwoWorks', label: 'Кнопка выбора 2 работает', tip: 'Открывает вторую сюжетную ветку' },
  { key: 'endingsDiffer', label: 'Финалы отличаются', tip: 'Выбор 1 и 2 ведут к разным концовкам' },
  { key: 'restartsCleanly', label: 'Игра перезапускается', tip: 'Кнопка «Начать заново» возвращает на старт' },
];

export function Stage09TestLab({ state, onUpdate, onUpdateChecklist }: Stage09TestLabProps) {
  const checkedCount = Object.values(state.testChecklist).filter(Boolean).length;
  const bugFixPrompt = buildBugFixPrompt(state.consoleErrorInput);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Left: 9-point Interactive Testing Checklist */}
      <section className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-5 space-y-3.5 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#26313B]">Чек-лист проверки игры</h3>
            <p className="text-xs text-slate-500">Отмечай пункты по мере тестирования в PyCharm (минимум 3).</p>
          </div>
          <span className="text-sm font-extrabold text-[#04959A] tabular-nums whitespace-nowrap">
            {checkedCount} / {TEST_ITEMS.length}
          </span>
        </div>

        <div className="space-y-2">
          {TEST_ITEMS.map((item) => {
            const isChecked = state.testChecklist[item.key];
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onUpdateChecklist({ [item.key]: !isChecked })}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isChecked
                    ? 'border-emerald-400 bg-emerald-50'
                    : 'border-slate-200 hover:border-[#06B8BE] bg-slate-50'
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`text-sm font-bold ${isChecked ? 'text-emerald-900' : 'text-[#26313B]'}`}>
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.tip}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Right: Bug Fixing Workshop */}
      <section className="lg:col-span-6 space-y-4">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-[#F4C914] text-amber-600 flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#26313B]">
                Не работает? Чиним ошибку в том же чате
              </h3>
              <p className="text-xs text-slate-500">Ошибки бывают у всех разработчиков — сейчас быстро поправим!</p>
            </div>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#26313B]">
            {[
              '1. Скопируй красные строки ошибки из консоли PyCharm.',
              '2. Вставь текст ошибки в поле ниже.',
              '3. Скопируй готовый запрос и отправь В ТОТ ЖЕ чат ИИ.',
              '4. Замени код main.py на исправленный и снова нажми Run ▶.',
            ].map((s) => (
              <li key={s} className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold">
                {s}
              </li>
            ))}
          </ol>

          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-[#26313B]">
              Вставь ошибку из консоли:
            </label>
            <textarea
              rows={4}
              value={state.consoleErrorInput}
              onChange={(e) => onUpdate({ consoleErrorInput: e.target.value })}
              placeholder="Например: FileNotFoundError: No file 'images/character.png' found..."
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs text-[#26313B] placeholder:text-slate-400 focus:outline-none focus:border-[#06B8BE]"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">Сохранит твой сюжет и пути к файлам</span>
              <CopyButton text={bugFixPrompt} label="Запрос на починку" variant="dark" />
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-[#F4C914] text-[#26313B] rounded-3xl p-5 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-extrabold text-amber-900">
              Почему не стоит переписывать игру заново при ошибке?
            </h4>
            <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
              Если открыть новый чат и попросить код с нуля, ИИ забудет прошлые договорённости и может сломать то,
              что уже работало. Всегда чини конкретную ошибку в том же диалоге!
            </p>
          </div>
        </div>

        <MemeReactionCard
          memeId={state.consoleErrorInput.trim() ? 'meme_five_bugs' : checkedCount >= 6 ? 'meme_zero_errors' : 'meme_first_run'}
          compact
        />
      </section>
    </div>
  );
}
