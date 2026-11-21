import {
  Box,
  CheckCircle2,
  Code2,
  GitBranch,
  HelpCircle,
  MessageSquare,
  Play,
  Sparkles,
  Terminal,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import type { LessonProgressState } from '../../types/lesson';

interface Stage01StartProps {
  state: LessonProgressState;
  onUpdate: (patch: Partial<LessonProgressState>) => void;
}

interface ConceptOption {
  id: string;
  label: string;
  isCorrect: boolean;
  feedback: string;
}

interface ConceptStep {
  id: string;
  order: number;
  title: string;
  badge: string;
  icon: typeof Sparkles;
  shortRule: string;
  codeExample: string;
  outputPreview: string;
  question: string;
  options: ConceptOption[];
}

const CONCEPT_STEPS: ConceptStep[] = [
  {
    id: 'vibe_coding',
    order: 1,
    title: '1. Vibe Coding',
    badge: 'Метод работы с ИИ',
    icon: Sparkles,
    shortRule:
      'Vibe Coding — это создание игры вместе с нейросетью: ты придумываешь идею, логику и проверяешь результат, а ИИ помогает писать код и тексты.',
    codeExample: '# Твоя идея + точный промпт = игра на Python + Pygame (1000×600)',
    outputPreview: 'Готовая основа для твоей новеллы!',
    question: 'Кто главный в процессе Vibe Coding?',
    options: [
      {
        id: 'a',
        label: 'Нейросеть сама придумывает всё с нуля без участия человека',
        isCorrect: false,
        feedback: 'Нейросеть — лишь инструмент. Без твоего сюжета и проверок игра не получится!',
      },
      {
        id: 'b',
        label: 'Ты задаёшь идею, промпты и проверяешь игру, а ИИ пишет рутинный код',
        isCorrect: true,
        feedback: 'Верно! Ты — главный геймдизайнер и режиссёр проекта, а ИИ — твой быстрый помощник.',
      },
      {
        id: 'c',
        label: 'Только опытные сеньор-программисты с 10-летним стажем',
        isCorrect: false,
        feedback: 'Сегодня даже начинающий может собрать свою игру на Python, если понимает логику.',
      },
    ],
  },
  {
    id: 'variable',
    order: 2,
    title: '2. Переменная',
    badge: 'Именованный контейнер',
    icon: Box,
    shortRule:
      'Переменная — это подписанный контейнер (ящик) в памяти компьютера, в который мы кладём имя героя, энергию или выбор игрока, чтобы использовать дальше.',
    codeExample: 'hero = "Алина"\nenergy = 100\nprint(hero)',
    outputPreview: 'Алина',
    question: 'Что выведет компьютер после выполнения кода: hero = "Алина" и print(hero)?',
    options: [
      {
        id: 'a',
        label: 'Напечатает слово hero',
        isCorrect: false,
        feedback: 'Без кавычек print(hero) заглядывает внутрь контейнера с именем hero и берёт его содержимое.',
      },
      {
        id: 'b',
        label: 'Напечатает значение из контейнера: Алина',
        isCorrect: true,
        feedback: 'Точно! Переменная hero хранит текст "Алина", поэтому print(hero) выведет Алина.',
      },
      {
        id: 'c',
        label: 'Выдаст ошибку, потому что числа не складываются со строками',
        isCorrect: false,
        feedback: 'Ошибки здесь нет — мы просто сохранили текст в переменную и вывели его на экран.',
      },
    ],
  },
  {
    id: 'print',
    order: 3,
    title: '3. Команда print()',
    badge: 'Вывод текста',
    icon: Terminal,
    shortRule:
      'Функция print() печатает текст или значение переменной на экран — так мы проверяем работу программы и выводим сообщения.',
    codeExample: 'print("Привет! Добро пожаловать в игру.")',
    outputPreview: 'Привет! Добро пожаловать в игру.',
    question: 'Зачем в Python используют команду print("...")?',
    options: [
      {
        id: 'a',
        label: 'Чтобы вывести текст или значение переменной на экран',
        isCorrect: true,
        feedback: 'Верно! print() показывает текст на экране или в консоли.',
      },
      {
        id: 'b',
        label: 'Чтобы распечатать игру на бумажном принтере',
        isCorrect: false,
        feedback: 'Слово print исторически осталось с первых компьютеров, но выводит текст прямо на экран!',
      },
      {
        id: 'c',
        label: 'Чтобы удалить персонажа с экрана',
        isCorrect: false,
        feedback: 'Нет, print() ничего не удаляет — он показывает сообщения.',
      },
    ],
  },
  {
    id: 'input',
    order: 4,
    title: '4. Команда input()',
    badge: 'Ввод от игрока',
    icon: MessageSquare,
    shortRule:
      'Команда input() задаёт игроку вопрос, ждёт ответа с клавиатуры и сохраняет введённый текст в переменную.',
    codeExample: 'choice = input("Выбери 1 или 2: ")',
    outputPreview: 'Выбери 1 или 2: 1  → сохранится в choice',
    question: 'Что делает программа, когда доходит до строки choice = input("Выбери 1 или 2: ")?',
    options: [
      {
        id: 'a',
        label: 'Мгновенно закрывает окно игры',
        isCorrect: false,
        feedback: 'Нет, программа останавливается и ждёт ответа от игрока.',
      },
      {
        id: 'b',
        label: 'Ждёт ответ игрока с клавиатуры и сохраняет его в переменную choice',
        isCorrect: true,
        feedback: 'Отлично! Введённое значение сохраняется в choice, и дальше мы проверим его условием.',
      },
      {
        id: 'c',
        label: 'Рисует фон ночного города',
        isCorrect: false,
        feedback: 'input() работает только с текстом и вводом данных.',
      },
    ],
  },
  {
    id: 'if_else',
    order: 5,
    title: '5. if / elif / else',
    badge: 'Развилка сюжета',
    icon: GitBranch,
    shortRule:
      'Условия if / elif / else проверяют, что выбрал игрок, и направляют сюжет либо к Финалу 1, либо к Финалу 2.',
    codeExample:
      'if choice == "1":\n    print("Финал 1: Тайная дверь открыта!")\nelif choice == "2":\n    print("Финал 2: Включён скрытый лифт!")\nelse:\n    print("Попробуй выбрать 1 или 2")',
    outputPreview: 'Финал 1: Тайная дверь открыта!',
    question: 'Что случится, если игрок введёт "2" (choice = "2")?',
    options: [
      {
        id: 'a',
        label: 'Сработает ветка if и выведется Финал 1',
        isCorrect: false,
        feedback: 'Условие choice == "1" неверно, поэтому Python проверит следующую ветку elif.',
      },
      {
        id: 'b',
        label: 'Сработает ветка elif и запустится Финал 2',
        isCorrect: true,
        feedback: 'Точно! Именно так в визуальной новелле работают две разные концовки.',
      },
      {
        id: 'c',
        label: 'Сработают сразу оба финала одновременно',
        isCorrect: false,
        feedback: 'В конструкции if / elif / else всегда выполняется только одна подходящая ветка!',
      },
    ],
  },
];

export function Stage01Start({ state, onUpdate }: Stage01StartProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [simChoice, setSimChoice] = useState<'1' | '2' | 'other'>('1');

  const activeStep = CONCEPT_STEPS[activeIndex] || CONCEPT_STEPS[0];
  const checkedSet = new Set(state.stage1PythonChecked);
  const selectedOptId = state.stage1ConceptAnswers?.[activeStep.id] || '';
  const selectedOption = activeStep.options.find((o) => o.id === selectedOptId);
  const isCurrentSolved = checkedSet.has(activeStep.id);

  const handleSelectAnswer = (step: ConceptStep, opt: ConceptOption) => {
    const nextAnswers = {
      ...(state.stage1ConceptAnswers || {}),
      [step.id]: opt.id,
    };
    const nextChecked =
      opt.isCorrect && !checkedSet.has(step.id)
        ? [...state.stage1PythonChecked, step.id]
        : state.stage1PythonChecked;

    onUpdate({
      stage1ConceptAnswers: nextAnswers,
      stage1PythonChecked: nextChecked,
      ...(step.id === 'vibe_coding' ? { stage1QuestionAnswer: opt.id } : {}),
    });
  };

  return (
    <div className="space-y-4">
      {/* 5-Concept Step Navigation Bar */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <p className="text-xs font-extrabold text-[#26313B] flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-[#06B8BE]" />
            <span>Быстрая разминка (3–4 мин): изучи 5 понятий и ответь на мини-вопрос после каждого</span>
          </p>
          <span className="px-2.5 py-1 rounded-xl bg-cyan-50 border border-[#06B8BE]/40 text-xs font-extrabold text-[#04959A] tabular-nums">
            Пройдено: {state.stage1PythonChecked.length} из {CONCEPT_STEPS.length}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {CONCEPT_STEPS.map((step, idx) => {
            const isActive = idx === activeIndex;
            const isSolved = checkedSet.has(step.id);
            const Icon = step.icon;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isActive
                    ? 'bg-[#06B8BE] border-[#06B8BE] text-white shadow-xs'
                    : isSolved
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-[#26313B] hover:border-[#06B8BE]'
                }`}
              >
                <div className="min-w-0 flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs font-extrabold truncate">{step.title}</span>
                </div>
                {isSolved && (
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-600'}`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Concept + Visual Example + Single Question */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Clear Explanation & Visual Metaphor */}
        <section className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-[#04959A]">{activeStep.badge}</span>
              <span className="text-xs font-bold text-slate-400 tabular-nums">
                Шаг {activeStep.order} из {CONCEPT_STEPS.length}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#26313B]">{activeStep.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{activeStep.shortRule}</p>

            {/* Visual Variable Container Diagram when on step 2 (variable) */}
            {activeStep.id === 'variable' && (
              <div className="rounded-2xl bg-gradient-to-br from-cyan-50/70 to-amber-50/60 border border-[#06B8BE]/35 p-4 space-y-3">
                <p className="text-xs font-extrabold text-[#04959A]">
                  Наглядно: переменная — это подписанный контейнер с данными
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white border-2 border-[#06B8BE] p-3 shadow-xs">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-[#06B8BE] text-white font-mono text-[11px] font-bold mb-2">
                      hero
                    </span>
                    <div className="rounded-xl bg-cyan-50/70 border border-dashed border-[#06B8BE] p-2.5 text-center">
                      <code className="font-mono text-base font-extrabold text-[#26313B]">&quot;Алина&quot;</code>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white border-2 border-[#F4C914] p-3 shadow-xs">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-[#F4C914] text-[#26313B] font-mono text-[11px] font-bold mb-2">
                      energy
                    </span>
                    <div className="rounded-xl bg-amber-50/70 border border-dashed border-amber-400 p-2.5 text-center">
                      <code className="font-mono text-base font-extrabold text-[#26313B]">100</code>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl bg-[#26313B] text-white px-3.5 py-2 font-mono text-xs flex items-center justify-between gap-2">
                  <span className="text-[#F4C914]">print(hero)</span>
                  <span className="text-emerald-300 font-bold">→ Алина</span>
                </div>
              </div>
            )}

            {/* Interactive Python Code Sandbox */}
            <div className="rounded-2xl bg-[#26313B] p-4 text-white space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-300">Пример кода на Python:</span>
                {activeStep.id === 'if_else' && (
                  <div className="flex items-center gap-1.5">
                    {(
                      [
                        { id: '1', label: 'choice = "1"' },
                        { id: '2', label: 'choice = "2"' },
                        { id: 'other', label: 'choice = "9"' },
                      ] as const
                    ).map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => setSimChoice(btn.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                          simChoice === btn.id
                            ? 'bg-[#F4C914] text-[#26313B]'
                            : 'bg-white/10 text-slate-200 hover:bg-white/20'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <pre className="font-mono text-xs sm:text-sm text-[#F4C914] bg-slate-900/75 rounded-xl p-3 overflow-x-auto leading-relaxed">
                {activeStep.codeExample}
              </pre>

              <div className="font-mono text-xs bg-slate-900/80 border border-white/10 rounded-xl p-3 flex items-center gap-2 text-emerald-300">
                <Play className="w-3.5 h-3.5 text-[#06B8BE] shrink-0" />
                <span>
                  {activeStep.id === 'if_else'
                    ? simChoice === '1'
                      ? 'Финал 1: Тайная дверь открыта!'
                      : simChoice === '2'
                      ? 'Финал 2: Включён скрытый лифт!'
                      : 'Попробуй выбрать 1 или 2'
                    : activeStep.outputPreview}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Single Quick Concept Question (max 3 options) */}
        <section className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-xs">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-700">
              <HelpCircle className="w-4 h-4 text-[#F4C914]" />
              <span>Проверь себя ({activeStep.order}/5)</span>
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-[#26313B] leading-snug">
              {activeStep.question}
            </h3>

            <div className="space-y-2.5">
              {activeStep.options.map((opt) => {
                const isSelected = selectedOptId === opt.id;
                const style = !isSelected
                  ? 'border-slate-200 bg-slate-50 hover:border-[#06B8BE] text-[#26313B]'
                  : opt.isCorrect
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-950 font-bold'
                  : 'animate-lab-shake border-rose-400 bg-rose-50 text-rose-950';

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectAnswer(activeStep, opt)}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 text-xs sm:text-sm transition-all cursor-pointer flex items-start justify-between gap-2 ${style}`}
                  >
                    <span>{opt.label}</span>
                    {isSelected &&
                      (opt.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      ))}
                  </button>
                );
              })}
            </div>

            {selectedOption && (
              <div
                className={`animate-lab-enter rounded-2xl p-3.5 border text-xs leading-relaxed font-medium ${
                  selectedOption.isCorrect
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                {selectedOption.feedback}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={activeIndex === 0}
              onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-[#26313B] disabled:opacity-40 cursor-pointer"
            >
              Назад
            </button>

            {activeIndex < CONCEPT_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setActiveIndex((i) => Math.min(CONCEPT_STEPS.length - 1, i + 1))}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold cursor-pointer transition-colors ${
                  isCurrentSolved
                    ? 'bg-[#06B8BE] hover:bg-[#04959A] text-white'
                    : 'bg-[#F4C914] hover:bg-amber-400 text-[#26313B]'
                }`}
              >
                Следующее понятие →
              </button>
            ) : (
              <span className="text-xs font-extrabold text-emerald-700">
                {state.stage1PythonChecked.length >= 5
                  ? 'Все 5 понятий пройдены! Жми кнопку внизу.'
                  : 'Ответь верно на все 5 мини-вопросов'}
              </span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
