import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Compass,
  GitBranch,
  Lightbulb,
  MapPin,
  Palette,
  Sparkles,
  UserCheck,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { getGenreLabel, getStyleLabel } from '../../config/mediaAssets';
import type { ArtStyleId, StoryDesign } from '../../types/lesson';
import { ChipSelector } from '../common/ChipSelector';

interface Stage03StoryDesignerProps {
  story: StoryDesign;
  selectedStyle: ArtStyleId;
  onUpdateStory: (patch: Partial<StoryDesign>) => void;
}

const SETTING_CHIPS = [
  'Ночная обсерватория на крыше школы',
  'Секретная подземная лаборатория',
  'Орбитальная космическая станция',
  'Заброшенный маяк на острове',
  'Древняя библиотека кристаллов',
  'ИТ-клуб во время грозы',
];

const ATMOSPHERE_CHIPS = [
  'Загадочная и таинственная',
  'Напряжённая и приключенческая',
  'Тёплая, дружеская и уютная',
  'Фантастическая, с неоновым светом',
];

const PROTAGONIST_CHIPS = [
  'Подросток-изобретатель с рюкзаком гаджетов',
  'Любознательный школьник-детектив',
  'Юный пилот космического челнока',
  'Ученик-маг, ищущий потерянный артефакт',
  'Начинающий программист на ночном квесте',
];

const PROBLEM_CHIPS = [
  'Внезапно погас свет и заблокировались двери',
  'Пропал важный артефакт или флешка с кодом',
  'Сработал таинственный сигнал бедствия',
  'Появился неизвестный портал в другое измерение',
];

const GOAL_CHIPS = [
  'Расшифровать сигнал и найти выход',
  'Вернуть пропавший предмет до рассвета',
  'Запустить резервный реактор и спасти станцию',
  'Разгадать секрет создателя этого места',
];

const EVENT_CHIPS = [
  'На экране загорается сообщение, адресованное лично герою',
  'Герой находит старую карту со скрытой подсказкой',
  'Голос из рации предупреждает, что осталась 1 минута',
  'Стена неожиданно открывает потайную панель',
];

const CHOICE_1_CHIPS = [
  'Взломать панель управления напрямую',
  'Смело открыть таинственную дверь',
  'Включить маяк и подать сигнал',
  'Довериться незнакомому голосу в рации',
];

const CHOICE_2_CHIPS = [
  'Осмотреть комнату и поискать дневник с подсказкой',
  'Сначала проверить провода и систему безопасности',
  'Попробовать обойти зал через вентиляцию',
  'Сравнить найденные символы со старой картой',
];

const ENDING_1_CHIPS = [
  'Система перезагрузилась с сюрпризом, но путь к свободе открылся!',
  'Смелый шаг сработал — герой стал первым открывателем тайны!',
  'Сигнал перехватили союзники, и миссия завершилась победой!',
];

const ENDING_2_CHIPS = [
  'Внимательность помогла найти секретный код и тайный бонус-уровень!',
  'Герой раскрыл настоящую историю создателя и получил ключ-артефакт!',
  'Осторожный план спас всю команду без единой поломки!',
];

export function Stage03StoryDesigner({
  story,
  selectedStyle,
  onUpdateStory,
}: Stage03StoryDesignerProps) {
  const [subStep, setSubStep] = useState<1 | 2 | 3 | 4>(1);

  const step1Done = Boolean(story.setting.trim());
  const step2Done = Boolean(story.protagonist.trim() && (story.problem.trim() || story.goal.trim()));
  const step3Done = Boolean(story.unusualEvent.trim() || story.customIdea.trim());

  const duplicateChoice =
    Boolean(story.choiceOne.trim() && story.choiceTwo.trim()) &&
    story.choiceOne.trim().toLowerCase() === story.choiceTwo.trim().toLowerCase();
  const duplicateEnding =
    Boolean(story.endingOne.trim() && story.endingTwo.trim()) &&
    story.endingOne.trim().toLowerCase() === story.endingTwo.trim().toLowerCase();

  const step4Done =
    Boolean(
      story.choiceOne.trim() && story.choiceTwo.trim() && story.endingOne.trim() && story.endingTwo.trim()
    ) &&
    !duplicateChoice &&
    !duplicateEnding;

  const stepsMeta = [
    { id: 1 as const, label: '1. Мир и атмосфера', icon: MapPin, done: step1Done },
    { id: 2 as const, label: '2. Герой, проблема и цель', icon: UserCheck, done: step2Done },
    { id: 3 as const, label: '3. Событие и фишка', icon: Zap, done: step3Done },
    { id: 4 as const, label: '4. Развилка: 2 финала', icon: GitBranch, done: step4Done },
  ];

  return (
    <div className="space-y-4">
      {/* Stage 2 Summary Strip */}
      <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <Palette className="w-4 h-4 text-[#06B8BE]" />
          <span className="font-bold text-slate-600">Основа с Этапа 2:</span>
          <span className="px-2.5 py-0.5 rounded-lg bg-cyan-50 text-[#04959A] font-extrabold">
            Жанр: {getGenreLabel(story.genre)}
          </span>
          <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-800 font-extrabold">
            Стиль: {getStyleLabel(selectedStyle)}
          </span>
        </div>
        <span className="text-xs text-slate-500">Название игры придумаешь в финале на 10-м этапе</span>
      </div>

      {/* 4 Sequential Story Sub-steps */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 grid grid-cols-2 lg:grid-cols-4 gap-2 shadow-xs">
        {stepsMeta.map((tab) => {
          const Icon = tab.icon;
          const active = subStep === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubStep(tab.id)}
              className={`px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                active
                  ? 'bg-[#06B8BE] text-white shadow-xs'
                  : tab.done
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  : 'bg-slate-50 text-[#26313B] hover:bg-slate-100'
              }`}
            >
              {tab.done && !active ? <Check className="w-3.5 h-3.5 shrink-0" /> : <Icon className="w-3.5 h-3.5 shrink-0" />}
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Split: Active Step Block + Persistent Live Story Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-8">
          {subStep === 1 && (
            <section className="animate-lab-enter bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-[#06B8BE]/40 text-[#04959A] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#26313B]">Шаг 1. Где начинается твоя новелла?</h3>
                  <p className="text-xs text-slate-500">
                    Выбери локацию и настроение сцены — они зададут атмосферу всего сценария.
                  </p>
                </div>
              </div>

              <ChipSelector
                label="Место действия *"
                options={SETTING_CHIPS}
                value={story.setting}
                onChange={(val) => onUpdateStory({ setting: val })}
                placeholder="Напиши свою локацию..."
              />

              <ChipSelector
                label="Атмосфера сцены"
                options={ATMOSPHERE_CHIPS}
                value={story.atmosphere}
                onChange={(val) => onUpdateStory({ atmosphere: val })}
                placeholder="Какое настроение чувствует игрок?"
              />

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSubStep(2)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F4C914] hover:bg-amber-400 text-[#26313B] text-sm font-extrabold cursor-pointer"
                >
                  <span>Дальше: герой и задача</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          )}

          {subStep === 2 && (
            <section className="animate-lab-enter bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-[#F4C914]/70 text-amber-700 flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#26313B]">Шаг 2. Кто герой и что пошло не так?</h3>
                  <p className="text-xs text-slate-500">
                    Хорошая история начинается, когда у героя есть понятная проблема и важная цель.
                  </p>
                </div>
              </div>

              <ChipSelector
                label="Главный герой *"
                options={PROTAGONIST_CHIPS}
                value={story.protagonist}
                onChange={(val) => onUpdateStory({ protagonist: val })}
                placeholder="Опиши главного героя..."
              />

              <ChipSelector
                label="Проблема в начале игры"
                options={PROBLEM_CHIPS}
                value={story.problem}
                onChange={(val) => onUpdateStory({ problem: val })}
                placeholder="Что внезапно сломалось или пропало?"
              />

              <ChipSelector
                label="Цель героя"
                options={GOAL_CHIPS}
                value={story.goal}
                onChange={(val) => onUpdateStory({ goal: val })}
                placeholder="Чего герой хочет добиться?"
              />

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSubStep(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-[#26313B] cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Назад</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubStep(3)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F4C914] hover:bg-amber-400 text-[#26313B] text-sm font-extrabold cursor-pointer"
                >
                  <span>Дальше: событие</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          )}

          {subStep === 3 && (
            <section className="animate-lab-enter bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-[#06B8BE]/40 text-[#04959A] flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#26313B]">Шаг 3. Неожиданное событие</h3>
                  <p className="text-xs text-slate-500">
                    Добавь неожиданный поворот перед тем, как игрок примет главное решение.
                  </p>
                </div>
              </div>

              <ChipSelector
                label="Что неожиданно происходит в сцене?"
                options={EVENT_CHIPS}
                value={story.unusualEvent}
                onChange={(val) => onUpdateStory({ unusualEvent: val })}
                placeholder="Напиши неожиданный поворот сюжета..."
              />

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#26313B] mb-1.5">
                  <Lightbulb className="w-4 h-4 text-[#F4C914]" />
                  <span>Особая фишка или юмор (необязательно)</span>
                </label>
                <input
                  type="text"
                  value={story.customIdea}
                  onChange={(e) => onUpdateStory({ customIdea: e.target.value })}
                  placeholder="Например: рядом летает ворчливый мини-дрон или на стене светится шифр"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-[#26313B] placeholder:text-slate-400 focus:outline-none focus:border-[#06B8BE]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSubStep(2)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-[#26313B] cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Назад</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubStep(4)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F4C914] hover:bg-amber-400 text-[#26313B] text-sm font-extrabold cursor-pointer"
                >
                  <span>Дальше: 2 выбора и 2 финала</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          )}

          {subStep === 4 && (
            <section className="animate-lab-enter bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-[#F4C914]/70 text-amber-700 flex items-center justify-center shrink-0">
                  <GitBranch className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#26313B]">Шаг 4. Главная развилка: 2 разных финала</h3>
                  <p className="text-xs text-slate-500">
                    Убедись, что оба выбора и обе концовки по-настоящему отличаются друг от друга.
                  </p>
                </div>
              </div>

              {(duplicateChoice || duplicateEnding) && (
                <div className="rounded-2xl bg-rose-50 border border-rose-300 p-3.5 flex items-center gap-2 text-xs font-bold text-rose-900">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    {duplicateChoice
                      ? 'Выбор 1 и Выбор 2 сейчас одинаковые — сделай два разных действия!'
                      : 'Финал 1 и Финал 2 сейчас одинаковые — сделай две разные концовки!'}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-cyan-50/55 border border-[#06B8BE]/45 p-4 space-y-4">
                  <p className="text-xs font-extrabold text-[#04959A]">Ветка А</p>
                  <ChipSelector
                    label="Кнопка выбора 1 *"
                    options={CHOICE_1_CHIPS}
                    value={story.choiceOne}
                    onChange={(val) => onUpdateStory({ choiceOne: val })}
                    placeholder="Действие 1..."
                  />
                  <ChipSelector
                    label="Финал 1 *"
                    options={ENDING_1_CHIPS}
                    value={story.endingOne}
                    onChange={(val) => onUpdateStory({ endingOne: val })}
                    placeholder="Итог первого пути..."
                  />
                </div>

                <div className="rounded-2xl bg-amber-50/60 border border-[#F4C914]/70 p-4 space-y-4">
                  <p className="text-xs font-extrabold text-amber-800">Ветка Б</p>
                  <ChipSelector
                    label="Кнопка выбора 2 *"
                    options={CHOICE_2_CHIPS}
                    value={story.choiceTwo}
                    onChange={(val) => onUpdateStory({ choiceTwo: val })}
                    placeholder="Действие 2..."
                  />
                  <ChipSelector
                    label="Финал 2 *"
                    options={ENDING_2_CHIPS}
                    value={story.endingTwo}
                    onChange={(val) => onUpdateStory({ endingTwo: val })}
                    placeholder="Итог второго пути..."
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSubStep(3)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-[#26313B] cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Назад</span>
                </button>
                <span className="text-xs font-bold text-slate-500">
                  {step4Done ? 'Сюжет собран! Жми кнопку завершения внизу экрана.' : 'Заполни оба выбора и оба финала'}
                </span>
              </div>
            </section>
          )}
        </div>

        {/* Right: Persistent Live Visual Story Card */}
        <aside className="lg:col-span-4 bg-white border-2 border-[#06B8BE]/45 rounded-3xl p-5 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
            <h4 className="text-sm font-extrabold text-[#26313B] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#06B8BE]" />
              <span>Карточка твоей истории</span>
            </h4>
            <Sparkles className="w-4 h-4 text-[#F4C914]" />
          </div>

          <dl className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <dt className="font-bold text-slate-400">Локация и атмосфера</dt>
              <dd className="font-bold text-[#26313B] mt-0.5">
                {story.setting || 'Пока не выбрано'}
                {story.atmosphere ? ` · ${story.atmosphere}` : ''}
              </dd>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <dt className="font-bold text-slate-400">Главный герой</dt>
              <dd className="font-bold text-[#26313B] mt-0.5">{story.protagonist || 'Пока не выбран'}</dd>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <dt className="font-bold text-slate-400">Завязка и цель</dt>
              <dd className="text-[#26313B] mt-0.5">
                {story.problem || 'Проблема не задана'} {story.goal ? `→ Цель: ${story.goal}` : ''}
              </dd>
            </div>

            {story.unusualEvent && (
              <div className="p-2.5 rounded-xl bg-cyan-50/70 border border-[#06B8BE]/30">
                <dt className="font-bold text-[#04959A]">Неожиданное событие</dt>
                <dd className="text-[#26313B] mt-0.5">{story.unusualEvent}</dd>
              </div>
            )}

            <div className="grid grid-cols-1 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-cyan-50/60 border border-[#06B8BE]/35">
                <dt className="font-extrabold text-[#04959A]">Выбор 1 → Финал 1</dt>
                <dd className="text-[#26313B] mt-0.5 line-clamp-2">
                  {story.choiceOne || '—'} → {story.endingOne || '—'}
                </dd>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-[#F4C914]/60">
                <dt className="font-extrabold text-amber-800">Выбор 2 → Финал 2</dt>
                <dd className="text-[#26313B] mt-0.5 line-clamp-2">
                  {story.choiceTwo || '—'} → {story.endingTwo || '—'}
                </dd>
              </div>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
