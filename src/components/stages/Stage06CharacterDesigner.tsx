import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  Palette,
  RefreshCw,
  Shirt,
  Sparkles,
  Star,
  Upload,
  User,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { ART_STYLE_CARDS } from '../../config/mediaAssets';
import type { CharacterDesign, LessonProgressState } from '../../types/lesson';
import { buildCharacterEmotionRefPrompt, buildCharacterPrompt } from '../../utils/promptBuilders';
import { SafeImage } from '../common/SafeImage';
import { ChipSelector } from '../common/ChipSelector';
import { CopyButton } from '../common/CopyButton';

interface Stage06CharacterDesignerProps {
  state: LessonProgressState;
  onUpdate: (patch: Partial<LessonProgressState>) => void;
  onUpdateCharacter: (patch: Partial<CharacterDesign>) => void;
}

const ROLE_CHIPS = ['Главный герой', 'Детектив-школьник', 'Юный изобретатель', 'Космонавт-стажёр', 'Хранитель тайны'];
const GENDER_CHIPS = ['Парень', 'Девушка', 'Робот-помощник'];
const AGE_CHIPS = ['12 лет', '13 лет', '14 лет', '15 лет', '16 лет'];
const HAIRSTYLE_CHIPS = ['Короткая растрёпанная', 'Каре', 'Высокий хвост', 'Волнистые до плеч', 'Под капюшоном'];
const HAIR_COLOR_CHIPS = ['Каштановые', 'Чёрные', 'Светлые', 'Рыжие', 'Синие'];
const EYE_COLOR_CHIPS = ['Бирюзовые', 'Карие', 'Зелёные', 'Голубые', 'Янтарные'];
const CLOTHING_CHIPS = [
  'Бирюзовая куртка-анорак, тёмные джинсы карго и белые кроссовки',
  'Толстовка с капюшоном, удобные брюки и кеды',
  'Космический комбинезон с нашивками и ботинками',
  'Школьный пиджак, свитер, брюки и кроссовки',
];
const ACCESSORY_CHIPS = ['Наушники на шее', 'Рюкзак', 'Очки', 'Умные часы', 'Карманный сканер'];
const FEATURE_CHIPS = ['Дружелюбная улыбка', 'Пластырь на щеке', 'Веснушки', 'Светящийся значок', 'Без особых примет'];
const PERSONALITY_CHIPS = ['Смелый и любознательный', 'Спокойный и умный', 'Весёлый и находчивый', 'Осторожный аналитик'];

export function Stage06CharacterDesigner({
  state,
  onUpdate,
  onUpdateCharacter,
}: Stage06CharacterDesignerProps) {
  const [subStep, setSubStep] = useState<1 | 2 | 3 | 4>(1);
  const [showAdvancedEmotions, setShowAdvancedEmotions] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState('удивлённая, глаза широко открыты');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const ch = state.character;
  const activeStyleCard =
    ART_STYLE_CARDS.find((s) => s.id === state.selectedArtStyle) || ART_STYLE_CARDS[0];
  const autoPrompt = buildCharacterPrompt(ch, state.selectedArtStyle);
  const activePrompt = state.characterCustomPrompt || autoPrompt;
  const emotionPrompt = buildCharacterEmotionRefPrompt(ch, selectedEmotion, state.selectedArtStyle);

  const handleUploadCharacter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdate({ uploadedCharacterRawDataUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const step1Done = Boolean(ch.name.trim());
  const step2Done = Boolean(ch.hairstyle.trim() || ch.hairColor.trim() || ch.eyeColor.trim());
  const step3Done = Boolean(ch.clothing.trim());
  const step4Done = Boolean(state.stage6PromptCopied || state.uploadedCharacterRawDataUrl);

  const stepsMeta = [
    { id: 1 as const, label: '1. Кто герой?', icon: User, done: step1Done },
    { id: 2 as const, label: '2. Внешность', icon: Eye, done: step2Done },
    { id: 3 as const, label: '3. Одежда и вещи', icon: Shirt, done: step3Done },
    { id: 4 as const, label: '4. Финальный образ', icon: Sparkles, done: step4Done },
  ];

  return (
    <div className="space-y-4">
      {/* Inherited Global Art Style Banner (from Stage 2) */}
      <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <SafeImage
            src={activeStyleCard.imagePath}
            alt={activeStyleCard.label}
            fallbackTitle={activeStyleCard.label}
            className="w-11 h-11 rounded-xl border border-slate-200 bg-white object-contain p-0.5 shrink-0"
          />
          <div>
            <p className="text-[11px] font-extrabold text-[#04959A] flex items-center gap-1">
              <Palette className="w-3.5 h-3.5" />
              <span>Стиль игры задан на Этапе 2</span>
            </p>
            <p className="text-sm font-extrabold text-[#26313B]">{activeStyleCard.label}</p>
          </div>
        </div>
        <span className="text-xs font-bold text-[#04959A] tabular-nums">Шаг {subStep} из 4</span>
      </div>

      {/* 4 Focused Sequential Sub-steps */}
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

      {/* Step 1: Кто твой персонаж? */}
      {subStep === 1 && (
        <section className="animate-lab-enter bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xs">
          <div>
            <h3 className="text-lg font-extrabold text-[#26313B]">Шаг 1 из 4 · Кто твой персонаж?</h3>
            <p className="text-xs text-slate-500">Задай имя, роль в сюжете и базовую информацию о герое.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#26313B] mb-1.5">Имя персонажа *</label>
            <input
              type="text"
              value={ch.name}
              onChange={(e) => onUpdateCharacter({ name: e.target.value })}
              placeholder="Например: Артём, Лина или Кай"
              className="w-full sm:max-w-md px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-[#26313B] placeholder:text-slate-400 focus:outline-none focus:border-[#06B8BE]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ChipSelector
              label="Роль в истории"
              options={ROLE_CHIPS}
              value={ch.role}
              onChange={(val) => onUpdateCharacter({ role: val })}
            />
            <ChipSelector
              label="Кто персонаж"
              options={GENDER_CHIPS}
              value={ch.gender}
              onChange={(val) => onUpdateCharacter({ gender: val })}
            />
            <ChipSelector
              label="Возраст"
              options={AGE_CHIPS}
              value={ch.age}
              onChange={(val) => onUpdateCharacter({ age: val })}
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => setSubStep(2)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F4C914] hover:bg-amber-400 text-[#26313B] text-sm font-extrabold cursor-pointer"
            >
              <span>Дальше: внешность</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* Step 2: Внешность */}
      {subStep === 2 && (
        <section className="animate-lab-enter bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xs">
          <div>
            <h3 className="text-lg font-extrabold text-[#26313B]">Шаг 2 из 4 · Внешность героя</h3>
            <p className="text-xs text-slate-500">Выбери черты, по которым нейросеть нарисует узнаваемый образ.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ChipSelector
              label="Причёска"
              options={HAIRSTYLE_CHIPS}
              value={ch.hairstyle}
              onChange={(val) => onUpdateCharacter({ hairstyle: val })}
            />
            <ChipSelector
              label="Цвет волос"
              options={HAIR_COLOR_CHIPS}
              value={ch.hairColor}
              onChange={(val) => onUpdateCharacter({ hairColor: val })}
            />
            <ChipSelector
              label="Цвет глаз"
              options={EYE_COLOR_CHIPS}
              value={ch.eyeColor}
              onChange={(val) => onUpdateCharacter({ eyeColor: val })}
            />
            <ChipSelector
              label="Особая черта"
              options={FEATURE_CHIPS}
              value={ch.specialFeature}
              onChange={(val) => onUpdateCharacter({ specialFeature: val })}
            />
          </div>

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
              <span>Дальше: одежда и аксессуары</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* Step 3: Одежда и аксессуары */}
      {subStep === 3 && (
        <section className="animate-lab-enter bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xs">
          <div>
            <h3 className="text-lg font-extrabold text-[#26313B]">Шаг 3 из 4 · Одежда и аксессуары</h3>
            <p className="text-xs text-slate-500">
              Персонаж должен быть описан в полный рост (верх, низ и обувь), чтобы Google Flow не обрезал ноги.
            </p>
          </div>

          <ChipSelector
            label="Одежда (верх, низ и обувь в полный рост)"
            options={CLOTHING_CHIPS}
            value={ch.clothing}
            onChange={(val) => onUpdateCharacter({ clothing: val })}
            placeholder="Опиши куртку, брюки и обувь..."
          />

          <ChipSelector
            label="Аксессуары"
            mode="multi"
            helperText="Можно выбрать несколько"
            options={ACCESSORY_CHIPS}
            value={ch.accessories}
            onChange={(val) => onUpdateCharacter({ accessories: val })}
            placeholder="Добавь деталь к образу..."
          />

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
              <span>Дальше: характер и финал</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* Step 4: Характер + Итоговая карточка + Промпт и загрузка */}
      {subStep === 4 && (
        <div className="animate-lab-enter space-y-4">
          <section className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-extrabold text-[#26313B]">Шаг 4 из 4 · Характер и финальный образ</h3>
              <button
                type="button"
                onClick={() => setSubStep(1)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#26313B] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Редактировать шаги 1–3</span>
              </button>
            </div>

            <ChipSelector
              label="Характер и поза"
              options={PERSONALITY_CHIPS}
              value={ch.personality}
              onChange={(val) => onUpdateCharacter({ personality: val })}
            />

            {/* Summary Character Card */}
            <div className="rounded-2xl bg-gradient-to-br from-cyan-50/75 to-amber-50/55 border border-[#06B8BE]/40 p-4 space-y-2">
              <p className="text-xs font-extrabold text-[#04959A]">Итоговая карточка персонажа</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#26313B]">
                <div>
                  <span className="text-slate-500">Имя и роль:</span>{' '}
                  <strong>{ch.name || 'Не задано'}</strong> ({ch.role || 'Герой'}, {ch.age || '14 лет'})
                </div>
                <div>
                  <span className="text-slate-500">Внешность:</span>{' '}
                  {[ch.hairstyle, ch.hairColor, ch.eyeColor, ch.specialFeature].filter(Boolean).join(', ') || 'Базовая'}
                </div>
                <div>
                  <span className="text-slate-500">Стиль и одежда:</span> {activeStyleCard.label} ·{' '}
                  {ch.clothing || 'повседневный образ'}
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <section className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-5 space-y-3 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-extrabold text-[#26313B]">Промпт персонажа для Google Flow</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdate({ characterCustomPrompt: '' })}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-[#26313B] hover:bg-slate-100 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#06B8BE]" />
                    <span>Обновить</span>
                  </button>
                  <CopyButton
                    text={activePrompt}
                    label="Скопировать"
                    onCopied={() => onUpdate({ stage6PromptCopied: true })}
                  />
                </div>
              </div>

              <textarea
                rows={10}
                value={activePrompt}
                onChange={(e) => onUpdate({ characterCustomPrompt: e.target.value })}
                className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 font-mono text-xs text-[#26313B] leading-relaxed focus:outline-none focus:border-[#06B8BE]"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-slate-500">Проверь: 1 герой, полный рост, чистый белый фон #FFFFFF</span>
                <a
                  href="https://labs.google/fx/tools/flow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-extrabold text-[#04959A] hover:underline"
                >
                  <span>Открыть Google Flow</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </section>

            <section className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-extrabold text-[#26313B]">Загрузи картинку героя</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadCharacter}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#06B8BE] hover:bg-[#04959A] text-white text-xs font-extrabold cursor-pointer whitespace-nowrap"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Загрузить фото</span>
                </button>
              </div>

              {state.uploadedCharacterRawDataUrl ? (
                <div className="h-52 rounded-2xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden p-2">
                  <SafeImage
                    src={state.uploadedCharacterRawDataUrl}
                    alt="Сгенерированный персонаж"
                    fallbackTitle="Персонаж"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="h-44 rounded-2xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-500 text-xs text-center p-4">
                  <User className="w-7 h-7 text-slate-400 mb-1.5" />
                  <span>Сохрани сгенерированного героя на белом фоне, чтобы вырезать фон на следующем этапе!</span>
                </div>
              )}
            </section>
          </div>

          <section className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => setShowAdvancedEmotions((v) => !v)}
              className="w-full px-5 py-3.5 flex items-center justify-between gap-4 text-left hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-[#F4C914] shrink-0" />
                <p className="text-xs sm:text-sm font-extrabold text-[#26313B]">
                  Дополнительно (для тех, кто быстрее всех): другие эмоции через референс
                </p>
              </div>
              {showAdvancedEmotions ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {showAdvancedEmotions && (
              <div className="px-5 pb-5 pt-3 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-4">
                <ol className="lg:col-span-6 space-y-1.5 text-xs sm:text-sm text-slate-600">
                  <li>1. Загрузи сохранённого героя обратно в Google Flow как референс.</li>
                  <li>
                    2. Попроси изменить только эмоцию, оставив одежду, лицо и стиль «{activeStyleCard.label}» прежними.
                  </li>
                </ol>
                <div className="lg:col-span-6 space-y-2">
                  <select
                    value={selectedEmotion}
                    onChange={(e) => setSelectedEmotion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-[#26313B]"
                  >
                    <option value="удивлённая, глаза широко открыты">Удивление</option>
                    <option value="радостная улыбка, воодушевление">Радость</option>
                    <option value="серьёзная задумчивость, лёгкая тревога">Задумчивость</option>
                  </select>
                  <pre className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-[#26313B] whitespace-pre-wrap">
                    {emotionPrompt}
                  </pre>
                  <CopyButton text={emotionPrompt} label="Скопировать промпт эмоции" variant="secondary" />
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
