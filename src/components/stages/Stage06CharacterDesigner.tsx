import {
  ArrowLeft,
  ArrowRight,
  Bot,
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
import type { CharacterDesign, CharacterTypeId, LessonProgressState } from '../../types/lesson';
import { buildCharacterEmotionRefPrompt, buildCharacterPrompt } from '../../utils/promptBuilders';
import { ChipSelector } from '../common/ChipSelector';
import { CopyButton } from '../common/CopyButton';
import { SafeImage } from '../common/SafeImage';

interface Stage06CharacterDesignerProps {
  state: LessonProgressState;
  onUpdate: (patch: Partial<LessonProgressState>) => void;
  onUpdateCharacter: (patch: Partial<CharacterDesign>) => void;
}

const CHARACTER_TYPES: Array<{ id: CharacterTypeId; label: string; genderLabel: string }> = [
  { id: 'girl', label: 'Девушка', genderLabel: 'Девушка' },
  { id: 'boy', label: 'Парень', genderLabel: 'Парень' },
  { id: 'robot', label: 'Робот', genderLabel: 'Робот' },
  { id: 'creature', label: 'Фантастическое существо', genderLabel: 'Фантастическое существо' },
  { id: 'custom', label: 'Свой вариант', genderLabel: 'Свой вариант' },
];

const ROLE_CHIPS = [
  'Исследователь',
  'Изобретатель',
  'Детектив',
  'Путешественник',
  'Хранитель тайны',
];

const AGE_CHIPS = ['12 лет', '13 лет', '14 лет', '15 лет', '16 лет'];

const GIRL_HAIRSTYLE_CHIPS = [
  'Каре',
  'Длинные волнистые',
  'Высокий хвост',
  'Две косы',
  'Кудрявые до плеч',
];

const BOY_HAIRSTYLE_CHIPS = [
  'Короткая растрёпанная',
  'Андеркат',
  'Классическая стрижка',
  'Кудрявые волосы',
  'Под капюшоном',
];

const CUSTOM_HAIRSTYLE_CHIPS = [
  'Короткая растрёпанная',
  'Каре',
  'Длинные волнистые',
  'Под капюшоном',
];

const HAIR_COLOR_CHIPS = ['Каштановые', 'Чёрные', 'Светлые', 'Рыжие', 'Синие'];
const EYE_COLOR_CHIPS = ['Бирюзовые', 'Карие', 'Зелёные', 'Голубые', 'Янтарные'];
const FEATURE_CHIPS = ['Дружелюбная улыбка', 'Пластырь на щеке', 'Веснушки', 'Светящийся значок', 'Без особых примет'];

const CLOTHING_CHIPS = [
  'Бирюзовая куртка-анорак, тёмные джинсы карго и белые кроссовки',
  'Толстовка с капюшоном, удобные брюки и кеды',
  'Космический комбинезон с нашивками и ботинками',
  'Школьный пиджак, свитер, брюки и кроссовки',
];
const ACCESSORY_CHIPS = ['Наушники на шее', 'Рюкзак', 'Очки', 'Умные часы', 'Карманный сканер'];

// Robot-specific chips
const ROBOT_HEAD_CHIPS = [
  'Округлый экран-визор',
  'Гладкий купольный шлем с камерой',
  'Геометрический корпус-шлем',
  'Дружелюбная кибер-маска',
];
const ROBOT_ANTENNA_CHIPS = [
  'Двойная антенна-приёмник',
  'Светящаяся радио-дуга',
  'Складной боковой датчик',
  'Без антенн',
];
const ROBOT_SENSOR_CHIPS = [
  'Светящийся LED-экран с эмоцией',
  'Голографический индикатор энергии',
  'Сенсорная полоса состояния',
];
const ROBOT_OPTICS_CHIPS = [
  'Бирюзовые круглые линзы',
  'Неоновая полоса-визор',
  'Два выразительных LED-глаза',
];
const ROBOT_LIGHTS_CHIPS = [
  'Мягкое бирюзовое свечение',
  'Золотые неоновые линии на корпусе',
  'Светящийся индикатор на груди',
];
const ROBOT_BODY_CHIPS = [
  'Белый и бирюзовый композитный корпус с шарнирами',
  'Графитовый корпус с жёлтыми защитными пластинами',
  'Лёгкий титановый экзо-корпус на антиграв-ботинках',
];
const ROBOT_GEAR_CHIPS = ['Встроенный сканер', 'Реактивный мини-ранец', 'Манипулятор-фонарик', 'Голо-проектор'];

// Creature-specific chips
const CREATURE_FEATURE_CHIPS = [
  'Пушистый хвост и длинные ушки',
  'Прозрачные крылья и светящиеся узоры',
  'Кристаллические пластины на плечах',
  'Милая мордочка и маленькие рожки',
];
const CREATURE_COAT_CHIPS = [
  'Мягкая бирюзово-серебристая шерсть',
  'Переливающаяся изумрудная чешуя',
  'Лунный мех со звёздным узором',
  'Гладкая пастельная кожа с сияющими знаками',
];
const CREATURE_GEAR_CHIPS = [
  'Походный плащ и кожаный ремень с сумкой',
  'Лёгкий шарф исследователя и амулет',
  'Только светящиеся руны и наплечники без лишней одежды',
];
const CREATURE_ACCESSORY_CHIPS = ['Светящийся амулет', 'Мини-рюкзак', 'Карманный компас', 'Волшебный фонарь'];

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
  const charType: CharacterTypeId = ch.characterType || 'boy';

  const activeStyleCard =
    ART_STYLE_CARDS.find((s) => s.id === state.selectedArtStyle) || ART_STYLE_CARDS[0];
  const autoPrompt = buildCharacterPrompt(ch, state.selectedArtStyle);
  const activePrompt = state.characterCustomPrompt || autoPrompt;
  const emotionPrompt = buildCharacterEmotionRefPrompt(ch, selectedEmotion, state.selectedArtStyle);

  const filterAccessoriesString = (acc: string, predicate: (item: string) => boolean) =>
    acc
      .split(',')
      .map((s) => s.trim())
      .filter((s) => Boolean(s) && predicate(s))
      .join(', ');

  const handleSelectCharacterType = (nextType: CharacterTypeId) => {
    const meta = CHARACTER_TYPES.find((t) => t.id === nextType);
    const patch: Partial<CharacterDesign> = {
      characterType: nextType,
      gender:
        nextType === 'custom'
          ? ch.gender && !CHARACTER_TYPES.some((t) => t.id !== 'custom' && t.genderLabel === ch.gender)
            ? ch.gender
            : 'Свой вариант'
          : meta?.genderLabel || 'Парень',
    };

    if (nextType === 'robot') {
      // Clear incompatible human & creature fields
      patch.hairstyle = '';
      patch.hairColor = '';
      patch.eyeColor = '';
      patch.creatureFeatures = '';
      patch.creatureCoat = '';
      if (CLOTHING_CHIPS.includes(ch.clothing) || CREATURE_GEAR_CHIPS.includes(ch.clothing)) {
        patch.clothing = '';
      }
      patch.accessories = filterAccessoriesString(ch.accessories, (a) => ROBOT_GEAR_CHIPS.includes(a));
    } else if (nextType === 'creature') {
      // Clear incompatible human & robot fields
      patch.hairstyle = '';
      patch.hairColor = '';
      patch.headShape = '';
      patch.antennas = '';
      patch.sensorPanel = '';
      patch.optics = '';
      patch.bodyLights = '';
      if (ROBOT_BODY_CHIPS.includes(ch.clothing)) {
        patch.clothing = '';
      }
      patch.accessories = filterAccessoriesString(
        ch.accessories,
        (a) => CREATURE_ACCESSORY_CHIPS.includes(a) || !ROBOT_GEAR_CHIPS.includes(a)
      );
    } else {
      // Switching to girl / boy / custom human
      patch.headShape = '';
      patch.antennas = '';
      patch.sensorPanel = '';
      patch.optics = '';
      patch.bodyLights = '';
      patch.creatureFeatures = '';
      patch.creatureCoat = '';
      if (ROBOT_BODY_CHIPS.includes(ch.clothing) || CREATURE_GEAR_CHIPS.includes(ch.clothing)) {
        patch.clothing = '';
      }
      // Remove gender-exclusive hairstyles when switching between girl and boy
      if (nextType === 'boy' && GIRL_HAIRSTYLE_CHIPS.includes(ch.hairstyle)) {
        patch.hairstyle = '';
      }
      if (nextType === 'girl' && BOY_HAIRSTYLE_CHIPS.includes(ch.hairstyle)) {
        patch.hairstyle = '';
      }
      patch.accessories = filterAccessoriesString(ch.accessories, (a) => !ROBOT_GEAR_CHIPS.includes(a));
    }

    onUpdateCharacter(patch);
    if (state.characterCustomPrompt) {
      onUpdate({ characterCustomPrompt: '' });
    }
  };

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

  const step1Done = Boolean(ch.name.trim() && (ch.role.trim() || ch.characterType));
  const step2Done =
    charType === 'robot'
      ? Boolean(ch.headShape?.trim() || ch.optics?.trim() || ch.antennas?.trim())
      : charType === 'creature'
      ? Boolean(ch.creatureFeatures?.trim() || ch.eyeColor.trim())
      : Boolean(ch.hairstyle.trim() || ch.hairColor.trim() || ch.eyeColor.trim());
  const step3Done =
    charType === 'creature'
      ? Boolean(ch.creatureCoat?.trim() || ch.clothing.trim())
      : Boolean(ch.clothing.trim());
  const step4Done = Boolean(state.stage6PromptCopied || state.uploadedCharacterRawDataUrl);

  const stepsMeta = [
    { id: 1 as const, label: '1. Кто герой?', icon: User, done: step1Done },
    {
      id: 2 as const,
      label: charType === 'robot' ? '2. Корпус и оптика' : '2. Внешность',
      icon: charType === 'robot' ? Bot : Eye,
      done: step2Done,
    },
    {
      id: 3 as const,
      label: charType === 'robot' ? '3. Броня и гаджеты' : charType === 'creature' ? '3. Покров и вещи' : '3. Одежда и вещи',
      icon: Shirt,
      done: step3Done,
    },
    { id: 4 as const, label: '4. Финальный образ', icon: Sparkles, done: step4Done },
  ];

  const typeDisplayLabel =
    charType === 'custom'
      ? ch.gender.trim() || 'Свой вариант'
      : CHARACTER_TYPES.find((t) => t.id === charType)?.label || ch.gender || 'Персонаж';

  const appearanceSummary =
    charType === 'robot'
      ? [ch.headShape, ch.optics, ch.antennas, ch.sensorPanel, ch.bodyLights].filter(Boolean).join(', ')
      : charType === 'creature'
      ? [ch.creatureFeatures, ch.eyeColor ? `${ch.eyeColor} глаза` : '', ch.specialFeature]
          .filter(Boolean)
          .join(', ')
      : [
          ch.hairstyle,
          ch.hairColor ? `${ch.hairColor} волосы` : '',
          ch.eyeColor ? `${ch.eyeColor} глаза` : '',
          ch.specialFeature,
        ]
          .filter(Boolean)
          .join(', ');

  const bodyAndGearSummary =
    charType === 'creature'
      ? [ch.creatureCoat, ch.clothing, ch.accessories].filter((s) => Boolean(s && s.trim())).join(' · ')
      : [ch.clothing, ch.accessories].filter((s) => Boolean(s && s.trim())).join(' · ');

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

      {/* Step 1: Имя, Тип (отдельно) и Роль (отдельно) */}
      {subStep === 1 && (
        <section className="animate-lab-enter bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xs">
          <div>
            <h3 className="text-lg font-extrabold text-[#26313B]">Шаг 1 из 4 · Кто твой персонаж?</h3>
            <p className="text-xs text-slate-500">
              Выбери имя, тип персонажа и его роль в истории — поля внешности подстроятся автоматически.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#26313B] mb-1.5">Имя персонажа *</label>
            <input
              type="text"
              value={ch.name}
              onChange={(e) => onUpdateCharacter({ name: e.target.value })}
              placeholder="Например: Артём, Лина, Кай или R-12"
              className="w-full sm:max-w-md px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-[#26313B] placeholder:text-slate-400 focus:outline-none focus:border-[#06B8BE]"
            />
          </div>

          {/* Separate Character Type selector */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#26313B]">Тип персонажа *</p>
            <div className="flex flex-wrap gap-2">
              {CHARACTER_TYPES.map((t) => {
                const selected = charType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectCharacterType(t.id)}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                      selected
                        ? 'bg-[#06B8BE] border-[#06B8BE] text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-[#26313B] hover:border-[#06B8BE]'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
            {charType === 'custom' && (
              <input
                type="text"
                value={ch.gender === 'Свой вариант' ? '' : ch.gender}
                onChange={(e) => onUpdateCharacter({ gender: e.target.value })}
                placeholder="Укажи свой тип персонажа (например: киборг, говорящий кот, дух леса)..."
                className="w-full sm:max-w-md mt-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-[#26313B] placeholder:text-slate-400 focus:outline-none focus:border-[#06B8BE]"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ChipSelector
              label="Роль в истории *"
              options={ROLE_CHIPS}
              value={ch.role}
              onChange={(val) => onUpdateCharacter({ role: val })}
              placeholder="Свой вариант роли..."
            />
            {charType !== 'robot' ? (
              <ChipSelector
                label="Возраст"
                options={AGE_CHIPS}
                value={ch.age}
                onChange={(val) => onUpdateCharacter({ age: val })}
                placeholder="Укажи возраст..."
              />
            ) : (
              <div>
                <label className="block text-xs font-bold text-[#26313B] mb-1.5">
                  Модель / серия робота (необязательно)
                </label>
                <input
                  type="text"
                  value={ch.age}
                  onChange={(e) => onUpdateCharacter({ age: e.target.value })}
                  placeholder="Например: версия 2.4 или компактный дрон"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-[#26313B] placeholder:text-slate-400 focus:outline-none focus:border-[#06B8BE]"
                />
              </div>
            )}
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

      {/* Step 2: Dynamic Appearance Fields by Character Type */}
      {subStep === 2 && (
        <section className="animate-lab-enter bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xs">
          <div>
            <h3 className="text-lg font-extrabold text-[#26313B]">
              Шаг 2 из 4 · {charType === 'robot' ? 'Внешность и модули робота' : 'Внешность героя'}
            </h3>
            <p className="text-xs text-slate-500">
              {charType === 'robot'
                ? 'Настрой форму головы, оптику, антенны и подсветку твоего робота.'
                : charType === 'creature'
                ? 'Опиши яркие особенности существа: ушки, крылья, глаза и особые приметы.'
                : 'Выбери причёску и черты лица, по которым нейросеть нарисует узнаваемый образ.'}
            </p>
          </div>

          {charType === 'robot' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ChipSelector
                label="Форма головы"
                options={ROBOT_HEAD_CHIPS}
                value={ch.headShape || ''}
                onChange={(val) => onUpdateCharacter({ headShape: val })}
              />
              <ChipSelector
                label="Оптика (глаза / визор)"
                options={ROBOT_OPTICS_CHIPS}
                value={ch.optics || ''}
                onChange={(val) => onUpdateCharacter({ optics: val })}
              />
              <ChipSelector
                label="Антенны и датчики"
                options={ROBOT_ANTENNA_CHIPS}
                value={ch.antennas || ''}
                onChange={(val) => onUpdateCharacter({ antennas: val })}
              />
              <ChipSelector
                label="Экран / панель на корпусе"
                options={ROBOT_SENSOR_CHIPS}
                value={ch.sensorPanel || ''}
                onChange={(val) => onUpdateCharacter({ sensorPanel: val })}
              />
              <div className="md:col-span-2">
                <ChipSelector
                  label="Подсветка корпуса"
                  options={ROBOT_LIGHTS_CHIPS}
                  value={ch.bodyLights || ''}
                  onChange={(val) => onUpdateCharacter({ bodyLights: val })}
                />
              </div>
            </div>
          ) : charType === 'creature' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <ChipSelector
                  label="Особенности тела (хвост, ушки, крылья, рожки)"
                  options={CREATURE_FEATURE_CHIPS}
                  value={ch.creatureFeatures || ''}
                  onChange={(val) => onUpdateCharacter({ creatureFeatures: val })}
                  placeholder="Опиши особенности твоего существа..."
                />
              </div>
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ChipSelector
                label="Причёска"
                options={
                  charType === 'girl'
                    ? GIRL_HAIRSTYLE_CHIPS
                    : charType === 'boy'
                    ? BOY_HAIRSTYLE_CHIPS
                    : CUSTOM_HAIRSTYLE_CHIPS
                }
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
          )}

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
              <span>Дальше: {charType === 'robot' ? 'корпус и гаджеты' : 'одежда и вещи'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* Step 3: Dynamic Body / Clothing / Gear */}
      {subStep === 3 && (
        <section className="animate-lab-enter bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xs">
          <div>
            <h3 className="text-lg font-extrabold text-[#26313B]">
              Шаг 3 из 4 ·{' '}
              {charType === 'robot'
                ? 'Корпус, броня и оснащение'
                : charType === 'creature'
                ? 'Покров тела и снаряжение'
                : 'Одежда и аксессуары'}
            </h3>
            <p className="text-xs text-slate-500">
              Персонаж должен быть описан в полный рост (с ног до головы), чтобы Google Flow нарисовал его целиком.
            </p>
          </div>

          {charType === 'robot' ? (
            <>
              <ChipSelector
                label="Корпус и броня в полный рост"
                options={ROBOT_BODY_CHIPS}
                value={ch.clothing}
                onChange={(val) => onUpdateCharacter({ clothing: val })}
                placeholder="Опиши материал, цвет корпуса и опоры/ноги..."
              />
              <ChipSelector
                label="Модули и оснащение"
                mode="multi"
                helperText="Можно выбрать несколько"
                options={ROBOT_GEAR_CHIPS}
                value={ch.accessories}
                onChange={(val) => onUpdateCharacter({ accessories: val })}
                placeholder="Добавь устройство к корпусу..."
              />
            </>
          ) : charType === 'creature' ? (
            <>
              <ChipSelector
                label="Шерсть, чешуя или покров тела"
                options={CREATURE_COAT_CHIPS}
                value={ch.creatureCoat || ''}
                onChange={(val) => onUpdateCharacter({ creatureCoat: val })}
                placeholder="Опиши окрас и текстуру покрова..."
              />
              <ChipSelector
                label="Снаряжение или одежда (если есть)"
                options={CREATURE_GEAR_CHIPS}
                value={ch.clothing}
                onChange={(val) => onUpdateCharacter({ clothing: val })}
                placeholder="Плащ, пояс, или без одежды..."
              />
              <ChipSelector
                label="Волшебные или походные вещи"
                mode="multi"
                helperText="Можно выбрать несколько"
                options={CREATURE_ACCESSORY_CHIPS}
                value={ch.accessories}
                onChange={(val) => onUpdateCharacter({ accessories: val })}
                placeholder="Добавь предмет к образу..."
              />
            </>
          ) : (
            <>
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
            </>
          )}

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

      {/* Step 4: Характер + Структурированная Итоговая карточка + Промпт и загрузка */}
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

            {/* Structured Summary Character Card — unambiguous fields */}
            <div className="rounded-2xl bg-gradient-to-br from-cyan-50/75 to-amber-50/55 border border-[#06B8BE]/40 p-4 space-y-3">
              <p className="text-xs font-extrabold text-[#04959A]">Итоговая карточка персонажа</p>
              <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs text-[#26313B]">
                <div className="bg-white/85 rounded-xl border border-slate-200/80 p-2.5">
                  <dt className="text-[11px] font-bold text-slate-400">Имя</dt>
                  <dd className="font-extrabold mt-0.5">{ch.name.trim() || 'Не задано'}</dd>
                </div>
                <div className="bg-white/85 rounded-xl border border-slate-200/80 p-2.5">
                  <dt className="text-[11px] font-bold text-slate-400">Тип</dt>
                  <dd className="font-extrabold mt-0.5">{typeDisplayLabel}</dd>
                </div>
                <div className="bg-white/85 rounded-xl border border-slate-200/80 p-2.5">
                  <dt className="text-[11px] font-bold text-slate-400">Роль</dt>
                  <dd className="font-extrabold mt-0.5">{ch.role.trim() || 'Не выбрана'}</dd>
                </div>
                <div className="bg-white/85 rounded-xl border border-slate-200/80 p-2.5">
                  <dt className="text-[11px] font-bold text-slate-400">
                    {charType === 'robot' ? 'Модель / серия' : 'Возраст'}
                  </dt>
                  <dd className="font-bold mt-0.5">
                    {ch.age.trim() || (charType === 'robot' ? 'Универсальная модель' : 'Не указан')}
                  </dd>
                </div>
                <div className="bg-white/85 rounded-xl border border-slate-200/80 p-2.5">
                  <dt className="text-[11px] font-bold text-slate-400">Внешность</dt>
                  <dd className="font-medium mt-0.5">{appearanceSummary || 'Не задана'}</dd>
                </div>
                <div className="bg-white/85 rounded-xl border border-slate-200/80 p-2.5">
                  <dt className="text-[11px] font-bold text-slate-400">Одежда или особенности тела</dt>
                  <dd className="font-medium mt-0.5">{bodyAndGearSummary || 'Не задано'}</dd>
                </div>
                <div className="sm:col-span-2 lg:col-span-3 bg-white/85 rounded-xl border border-slate-200/80 p-2.5 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <dt className="text-[11px] font-bold text-slate-400 inline">Характер: </dt>
                    <dd className="font-bold inline">{ch.personality.trim() || 'Дружелюбный'}</dd>
                  </div>
                  <span className="text-[11px] font-extrabold text-[#04959A]">
                    Стиль: {activeStyleCard.label}
                  </span>
                </div>
              </dl>
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
                    2. Попроси изменить только эмоцию, оставив детали и стиль «{activeStyleCard.label}» прежними.
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
