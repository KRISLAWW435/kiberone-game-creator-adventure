import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  FolderTree,
  HelpCircle,
  Lock,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import { useState } from 'react';
import type { LessonProgressState } from '../../types/lesson';
import { buildPythonGamePrompt } from '../../utils/promptBuilders';
import { CopyButton } from '../common/CopyButton';
import { MemeReactionCard } from '../common/MemeReactionCard';

interface Stage08PythonBuilderProps {
  state: LessonProgressState;
  onUpdate: (patch: Partial<LessonProgressState>) => void;
}

interface QuizQuestion {
  id: string;
  tag: string;
  question: string;
  code: string;
  options: Array<{ id: string; label: string; isCorrect: boolean }>;
  explanation: string;
}

const PYTHON_MINI_QUEST: QuizQuestion[] = [
  {
    id: 'q1_print',
    tag: 'Вопрос 1 · print()',
    question: 'Что сделает эта команда при запуске программы?',
    code: 'print("Игра запущена!")',
    options: [
      { id: 'a', label: 'Нарисует картинку на весь экран', isCorrect: false },
      { id: 'b', label: 'Выведет текст «Игра запущена!» в консоль', isCorrect: true },
      { id: 'c', label: 'Закроет окно игры', isCorrect: false },
    ],
    explanation: 'print() выводит текст в консоль — очень удобно, чтобы проверить, что программа работает.',
  },
  {
    id: 'q2_input',
    tag: 'Вопрос 2 · input()',
    question: 'Для чего используется команда input()?',
    code: 'name = input("Как зовут героя? ")',
    options: [
      { id: 'a', label: 'Ждёт, пока игрок введёт ответ с клавиатуры', isCorrect: true },
      { id: 'b', label: 'Удаляет белый фон у картинки', isCorrect: false },
      { id: 'c', label: 'Создаёт папку images', isCorrect: false },
    ],
    explanation: 'input() просит пользователя ввести данные и сохраняет их в переменную.',
  },
  {
    id: 'q3_ifelse',
    tag: 'Вопрос 3 · if / elif / else',
    question: 'Что выведет код, если игрок нажал кнопку A (choice = "A")?',
    code: 'if choice == "A":\n    print("Открыта тайная дверь!")\nelif choice == "B":\n    print("Включена сигнализация!")',
    options: [
      { id: 'a', label: 'Включена сигнализация!', isCorrect: false },
      { id: 'b', label: 'Открыта тайная дверь!', isCorrect: true },
      { id: 'c', label: 'Ничего не выведет', isCorrect: false },
    ],
    explanation: 'Условие choice == "A" истинно, поэтому выполнится именно первая ветка if.',
  },
  {
    id: 'q4_image',
    tag: 'Вопрос 4 · Pygame картинки',
    question: 'В какую папку и под каким именем Pygame ищет твоего персонажа?',
    code: 'hero = pygame.image.load("images/character.png")',
    options: [
      { id: 'a', label: 'В папку images с точным именем character.png', isCorrect: true },
      { id: 'b', label: 'На рабочий стол с любым именем', isCorrect: false },
      { id: 'c', label: 'В папку images с именем hero.jpg', isCorrect: false },
    ],
    explanation: 'Путь в кавычках должен совпадать буква в букву: папка images и файл character.png.',
  },
  {
    id: 'q5_window',
    tag: 'Вопрос 5 · Окно игры',
    question: 'Какого размера окно создаст эта строка Pygame?',
    code: 'screen = pygame.display.set_mode((1000, 600))',
    options: [
      { id: 'a', label: 'Ширина 600 px, высота 1000 px', isCorrect: false },
      { id: 'b', label: 'Ширина 1000 px, высота 600 px', isCorrect: true },
      { id: 'c', label: 'Окно откроется без картинки', isCorrect: false },
    ],
    explanation: 'Первое число — ширина (1000), второе — высота (600). Это стандартное горизонтальное окно нашей новеллы.',
  },
];

interface CodeMapRegion {
  id: 'window' | 'bg' | 'hero' | 'dialogue' | 'choices';
  codeLine: string;
  title: string;
  desc: string;
}

const CODE_TO_WINDOW_MAP: CodeMapRegion[] = [
  {
    id: 'window',
    codeLine: 'screen = pygame.display.set_mode((1000, 600))',
    title: 'Окно 1000×600',
    desc: 'Создаёт прямоугольное окно игры шириной 1000 и высотой 600 пикселей.',
  },
  {
    id: 'bg',
    codeLine: 'bg = pygame.image.load("images/background.jpg")',
    title: 'Фон сцены',
    desc: 'Загружает картинку локации из папки images и рисует её на заднем плане.',
  },
  {
    id: 'hero',
    codeLine: 'hero = pygame.image.load("images/character.png")',
    title: 'Прозрачный герой',
    desc: 'Ставит вырезанный PNG поверх фона без белого квадрата.',
  },
  {
    id: 'dialogue',
    codeLine: 'pygame.draw.rect(screen, (24,22,25), (40, 430, 920, 140))',
    title: 'Окно диалога',
    desc: 'Рисует нижнюю панель, где отображается имя героя и текст реплики.',
  },
  {
    id: 'choices',
    codeLine: 'if choice == "A": show_ending_1() else: show_ending_2()',
    title: '2 кнопки и ветвление',
    desc: 'В момент выбора проверяет клик игрока и включает Финал 1 или Финал 2.',
  },
];

const PYCHARM_VISUAL_STEPS = [
  {
    num: '1',
    title: 'Создай проект VisualNovel',
    desc: 'В PyCharm нажми New Project и назови папку проекта VisualNovel.',
    badge: 'VisualNovel',
  },
  {
    num: '2',
    title: 'Создай папку images',
    desc: 'Правый клик по VisualNovel → New → Directory → images.',
    badge: 'VisualNovel/images',
  },
  {
    num: '3',
    title: 'Положи обе картинки',
    desc: 'Перетащи в images файлы background.jpg и character.png.',
    badge: 'background.jpg + character.png',
  },
  {
    num: '4',
    title: 'Вставь код в main.py',
    desc: 'Открой main.py, выдели всё (Ctrl+A) и вставь код ИИ (Ctrl+V).',
    badge: 'Ctrl+A → Ctrl+V',
  },
  {
    num: '5',
    title: 'Установи Pygame (1 раз)',
    desc: 'Если библиотека не установлена, введи в Terminal: pip install pygame.',
    badge: 'pip install pygame',
  },
  {
    num: '6',
    title: 'Нажми Run ▶',
    desc: 'Запусти игру! Если внизу появятся красные строки — скопируй их на 9-й этап.',
    badge: 'Run ▶',
  },
];

export function Stage08PythonBuilder({ state, onUpdate }: Stage08PythonBuilderProps) {
  const [subStep, setSubStep] = useState<1 | 2 | 3>(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [activeRegion, setActiveRegion] = useState<CodeMapRegion['id']>('window');
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  const finalScenarioText = state.finalScenario || state.aiScriptResult;
  const autoPrompt = buildPythonGamePrompt(state.story, state.character, finalScenarioText, false);
  const currentPrompt = state.pythonCodePrompt || autoPrompt;
  const activeRegionData =
    CODE_TO_WINDOW_MAP.find((r) => r.id === activeRegion) || CODE_TO_WINDOW_MAP[0];

  const handleSelectQuizOption = (q: QuizQuestion, optId: string, isCorrect: boolean) => {
    setSelectedAnswers((prev) => ({ ...prev, [q.id]: optId }));
    if (isCorrect && !state.stage8QuizCorrectIds.includes(q.id)) {
      onUpdate({ stage8QuizCorrectIds: [...state.stage8QuizCorrectIds, q.id] });
    }
  };

  const correctCount = state.stage8QuizCorrectIds.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const questPassed = correctCount >= 3;

  return (
    <div className="space-y-4">
      {/* 3 Sequential Sub-steps */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-wrap items-center gap-2 shadow-xs">
        {[
          {
            id: 1 as const,
            label: `1. Мини-квест Python (${correctCount}/5)`,
            done: questPassed,
            locked: false,
          },
          {
            id: 2 as const,
            label: '2. Промпт для main.py',
            done: state.stage8PromptCopied,
            locked: !questPassed,
          },
          {
            id: 3 as const,
            label: '3. Запуск в PyCharm',
            done: false,
            locked: !questPassed,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            disabled={tab.locked}
            onClick={() => !tab.locked && setSubStep(tab.id)}
            className={`flex-1 min-w-[170px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
              tab.locked
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-75'
                : subStep === tab.id
                ? 'bg-[#06B8BE] text-white cursor-pointer'
                : tab.done
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-pointer'
                : 'bg-slate-50 text-[#26313B] hover:bg-slate-100 cursor-pointer'
            }`}
          >
            {tab.locked ? (
              <Lock className="w-3.5 h-3.5 shrink-0" />
            ) : (
              tab.done && subStep !== tab.id && <Check className="w-4 h-4 shrink-0" />
            )}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Sub-step 1: Python Mini Quest + Visual Code-to-Window Mapping */}
      {subStep === 1 && (
        <div className="animate-lab-enter space-y-5">
          <section className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#26313B] flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#F4C914]" />
                  <span>Мини-квест: проверь, как работает код перед генерацией</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Чтобы открыть шаг 2, набери минимум 3 правильных ответа из 5 (можно ошибаться и выбирать снова).
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-extrabold tabular-nums ${
                  questPassed
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border border-[#F4C914]'
                }`}
              >
                Счёт: {correctCount} из 5
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {PYTHON_MINI_QUEST.map((q) => {
                const chosenId = selectedAnswers[q.id];
                const chosenOpt = q.options.find((o) => o.id === chosenId);
                const alreadySolved = state.stage8QuizCorrectIds.includes(q.id);

                return (
                  <article
                    key={q.id}
                    className={`rounded-2xl p-4 border space-y-3 ${
                      alreadySolved
                        ? 'bg-emerald-50/50 border-emerald-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold text-[#04959A]">{q.tag}</span>
                      {alreadySolved && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                    </div>

                    <p className="text-sm font-extrabold text-[#26313B] leading-snug">{q.question}</p>

                    <pre className="p-2.5 rounded-xl bg-[#26313B] font-mono text-xs text-[#F4C914] overflow-x-auto">
                      {q.code}
                    </pre>

                    <div className="space-y-1.5">
                      {q.options.map((opt) => {
                        const isPicked = chosenId === opt.id;
                        const style = !isPicked
                          ? 'bg-white border-slate-200 hover:border-[#06B8BE] text-[#26313B]'
                          : opt.isCorrect
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold'
                          : 'animate-lab-shake bg-rose-50 border-rose-400 text-rose-900';
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectQuizOption(q, opt.id, opt.isCorrect)}
                            className={`w-full text-left px-3 py-2 rounded-xl border text-xs transition-all cursor-pointer ${style}`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>

                    {(chosenOpt || alreadySolved) && (
                      <p
                        className={`text-xs leading-relaxed p-2.5 rounded-xl font-medium ${
                          chosenOpt?.isCorrect || alreadySolved
                            ? 'bg-emerald-100/70 text-emerald-900'
                            : 'bg-rose-100/70 text-rose-900'
                        }`}
                      >
                        {chosenOpt && !chosenOpt.isCorrect
                          ? 'Не совсем так — попробуй выбрать другой вариант!'
                          : q.explanation}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>

            {(answeredCount >= 5 || questPassed) && (
              <div
                className={`rounded-2xl p-4 border text-xs sm:text-sm font-bold flex flex-wrap items-center justify-between gap-2 ${
                  questPassed
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-amber-50 border-[#F4C914] text-amber-900'
                }`}
              >
                <span>
                  {questPassed
                    ? `Отличный результат: ${correctCount} из 5! Шаг 2 «Промпт для main.py» разблокирован.`
                    : `Сейчас верно ${correctCount} из 5. Исправь неверные ответы, чтобы набрать минимум 3 из 5 и открыть шаг 2.`}
                </span>
              </div>
            )}

            {questPassed && (
              <div className="pt-1 animate-lab-celebrate">
                <MemeReactionCard memeId="meme_ai_code" compact />
              </div>
            )}
          </section>

          {/* Visual Code -> Game Window Mapping */}
          <section className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-extrabold text-[#26313B] flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#06B8BE]" />
              <span>Наглядная связь: строка кода → деталь в окне Pygame</span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              <div className="lg:col-span-6 space-y-2">
                {CODE_TO_WINDOW_MAP.map((reg) => (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => setActiveRegion(reg.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      activeRegion === reg.id
                        ? 'bg-cyan-50 border-[#06B8BE] text-[#26313B]'
                        : 'bg-slate-50 border-slate-200 text-[#26313B] hover:border-[#06B8BE]/60'
                    }`}
                  >
                    <p className="text-xs font-extrabold text-[#04959A] mb-0.5">{reg.title}</p>
                    <code className="font-mono text-[11px] text-slate-600 block truncate">{reg.codeLine}</code>
                  </button>
                ))}
              </div>

              <div className="lg:col-span-6 space-y-3">
                <div className="relative aspect-[10/6] rounded-2xl bg-slate-900 border-2 p-3 overflow-hidden transition-all border-[#06B8BE]">
                  <div
                    className={`absolute inset-0 transition-all ${
                      activeRegion === 'bg' ? 'bg-[#06B8BE]/25 ring-2 ring-inset ring-[#06B8BE]' : 'bg-[#111827]'
                    }`}
                  />
                  <div
                    className={`relative z-10 flex flex-col gap-1.5 max-w-[48%] p-1.5 rounded-lg ${
                      activeRegion === 'choices' ? 'ring-2 ring-[#F4C914] bg-[#F4C914]/15' : ''
                    }`}
                  >
                    <span className="px-2.5 py-1 rounded bg-[#06B8BE] text-white text-[11px] font-bold">
                      Выбор 1
                    </span>
                    <span className="px-2.5 py-1 rounded bg-[#F4C914] text-[#26313B] text-[11px] font-bold">
                      Выбор 2
                    </span>
                  </div>
                  <div
                    className={`absolute right-6 bottom-[24%] w-20 h-32 rounded-xl flex items-center justify-center border ${
                      activeRegion === 'hero'
                        ? 'border-[#F4C914] bg-[#06B8BE]/35 scale-105'
                        : 'border-white/25 bg-white/10'
                    }`}
                  >
                    <span className="text-[11px] font-bold text-white text-center px-1">Герой PNG</span>
                  </div>
                  <div
                    className={`absolute bottom-2.5 left-2.5 right-2.5 rounded-lg bg-[#26313B]/95 p-2.5 border ${
                      activeRegion === 'dialogue' ? 'border-[#06B8BE] ring-2 ring-[#06B8BE]/40' : 'border-white/15'
                    }`}
                  >
                    <p className="text-[11px] font-bold text-[#F4C914]">Имя персонажа</p>
                    <p className="text-xs text-slate-200">Окно диалога для реплик...</p>
                  </div>
                </div>
                <p className="text-xs text-[#26313B] bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <strong className="text-[#04959A]">{activeRegionData.title}:</strong> {activeRegionData.desc}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              {!questPassed && (
                <span className="text-xs font-bold text-amber-700">
                  Набери минимум 3 из 5 в мини-квесте, чтобы открыть промпт для main.py (сейчас {correctCount} из 5)
                </span>
              )}
              <button
                type="button"
                disabled={!questPassed}
                onClick={() => questPassed && setSubStep(2)}
                className={`ml-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold transition-colors ${
                  questPassed
                    ? 'bg-[#F4C914] hover:bg-amber-400 text-[#26313B] cursor-pointer'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                }`}
              >
                {!questPassed && <Lock className="w-4 h-4" />}
                <span>Дальше: получить промпт main.py</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Sub-step 2: Auto-assembled Pygame Prompt (Strictly uses finalScenario) */}
      {subStep === 2 && (
        <section className="animate-lab-enter bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-[#26313B]">
                Промпт для генерации файла <code className="font-mono text-[#04959A]">main.py</code>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Сюда автоматически подставлен именно твой готовый сценарий с Этапа 4. Скопируй и отправь в DeepSeek или Qwen!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onUpdate({ pythonCodePrompt: '' })}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-[#26313B] cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#06B8BE]" />
                <span>Обновить данные</span>
              </button>
              <CopyButton
                text={currentPrompt}
                label="Скопировать промпт"
                variant="primary"
                onCopied={() => onUpdate({ stage8PromptCopied: true })}
              />
            </div>
          </div>

          <textarea
            rows={12}
            value={currentPrompt}
            onChange={(e) => onUpdate({ pythonCodePrompt: e.target.value })}
            className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 font-mono text-xs text-[#26313B] leading-relaxed focus:outline-none focus:border-[#06B8BE]"
          />

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setSubStep(1)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-bold text-[#26313B] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>К мини-квесту</span>
            </button>

            <button
              type="button"
              onClick={() => setSubStep(3)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F4C914] hover:bg-amber-400 text-[#26313B] text-sm font-extrabold cursor-pointer"
            >
              <span>Дальше: запуск в PyCharm</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* Sub-step 3: PyCharm Visual Guide & pip install pygame */}
      {subStep === 3 && (
        <section className="animate-lab-enter bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xs">
          <div>
            <h3 className="text-lg font-extrabold text-[#26313B]">Запуск игры в PyCharm</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Проверь точную структуру папок и выполни 6 шагов ниже.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div className="lg:col-span-7 bg-[#26313B] rounded-2xl p-4 text-white">
              <p className="text-xs font-bold text-[#F4C914] mb-2">Схема окна PyCharm: куда нажимать</p>
              <svg viewBox="0 0 600 260" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="600" height="260" rx="10" fill="#182028" stroke="#334155" />
                <rect width="600" height="32" rx="10" fill="#26313B" />
                <text x="16" y="20" fill="#E2E8F0" fontSize="11" fontWeight="700" fontFamily="sans-serif">
                  PyCharm · VisualNovel
                </text>
                <rect x="490" y="6" width="94" height="20" rx="5" fill="#10B981" />
                <polygon points="502,11 510,16 502,21" fill="#FFFFFF" />
                <text x="515" y="19" fill="#FFFFFF" fontSize="10" fontWeight="700" fontFamily="sans-serif">
                  Run main.py
                </text>
                <rect x="8" y="40" width="174" height="156" rx="6" fill="#1E293B" stroke="#334155" />
                <text x="18" y="58" fill="#06B8BE" fontSize="10" fontWeight="700" fontFamily="sans-serif">
                  Project (Папки)
                </text>
                <text x="18" y="78" fill="#FFFFFF" fontSize="11" fontWeight="700" fontFamily="monospace">
                  VisualNovel/
                </text>
                <text x="28" y="98" fill="#F4C914" fontSize="10.5" fontFamily="monospace">
                  ├── images/
                </text>
                <text x="38" y="116" fill="#CBD5E1" fontSize="10" fontFamily="monospace">
                  │  ├ background.jpg
                </text>
                <text x="38" y="132" fill="#CBD5E1" fontSize="10" fontFamily="monospace">
                  │  └ character.png
                </text>
                <rect x="24" y="142" width="144" height="20" rx="4" fill="#06B8BE" fillOpacity="0.22" stroke="#06B8BE" />
                <text x="30" y="156" fill="#FFFFFF" fontSize="10.5" fontWeight="700" fontFamily="monospace">
                  └── main.py
                </text>
                <rect x="190" y="40" width="402" height="156" rx="6" fill="#182028" stroke="#334155" />
                <text x="204" y="58" fill="#06B8BE" fontSize="10" fontWeight="700" fontFamily="sans-serif">
                  Редактор (вставляй Ctrl+V, сохраняй Ctrl+S)
                </text>
                <text x="204" y="82" fill="#F4C914" fontSize="11" fontFamily="monospace">
                  import pygame
                </text>
                <text x="204" y="100" fill="#E2E8F0" fontSize="11" fontFamily="monospace">
                  pygame.init()
                </text>
                <text x="204" y="118" fill="#94A3B8" fontSize="11" fontFamily="monospace">
                  screen = pygame.display.set_mode((1000, 600))
                </text>
                <rect x="8" y="204" width="584" height="48" rx="6" fill="#1E293B" stroke="#475569" />
                <text x="18" y="222" fill="#F4C914" fontSize="10" fontWeight="700" fontFamily="sans-serif">
                  Terminal (pip install pygame) и Run / Console (ошибки видны здесь)
                </text>
                <text x="18" y="240" fill="#FB7185" fontSize="10" fontFamily="monospace">
                  Если появилась красная ошибка — скопируй её на 9-й этап!
                </text>
              </svg>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                <p className="text-sm font-extrabold text-[#26313B] flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-[#06B8BE]" />
                  <span>Точная структура файлов</span>
                </p>
                <pre className="p-3 rounded-xl bg-[#26313B] text-[#F4C914] font-mono text-xs leading-relaxed">
{`VisualNovel/
    main.py
    images/
        background.jpg
        character.png`}
                </pre>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500">Установка Pygame:</p>
                    <code className="font-mono text-sm font-extrabold text-[#04959A]">pip install pygame</code>
                  </div>
                  <CopyButton text="pip install pygame" label="Копировать" variant="primary" />
                </div>

                <button
                  type="button"
                  onClick={() => setShowInstallHelp((v) => !v)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#04959A] hover:underline cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Как установить в Terminal</span>
                  {showInstallHelp ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showInstallHelp && (
                  <ol className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-[#26313B] space-y-1">
                    <li>
                      1. Открой вкладку <strong>Terminal</strong> внизу PyCharm.
                    </li>
                    <li>
                      2. Вставь <code className="font-mono font-bold text-[#04959A]">pip install pygame</code> и нажми Enter.
                    </li>
                    <li>
                      3. Дождись надписи <em>Successfully installed pygame</em>.
                    </li>
                  </ol>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PYCHARM_VISUAL_STEPS.map((step) => (
              <div key={step.num} className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#06B8BE] text-white text-xs font-extrabold flex items-center justify-center tabular-nums">
                    {step.num}
                  </span>
                  <code className="font-mono text-[11px] font-bold text-[#04959A]">{step.badge}</code>
                </div>
                <h4 className="text-sm font-extrabold text-[#26313B]">{step.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => setSubStep(2)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-[#26313B] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Назад к промпту</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
