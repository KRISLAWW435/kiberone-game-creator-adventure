import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCopy,
  Download,
  ExternalLink,
  FolderPlus,
  Image as ImageIcon,
  Info,
  Layers,
  Maximize2,
  MousePointerClick,
  RefreshCw,
  Send,
  SlidersHorizontal,
  Sparkles,
  Upload,
  Wand2,
} from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  BACKGROUND_LIBRARY_CATALOG,
  type BackgroundLibraryItem,
} from '../../config/backgroundLibrary';
import { ART_STYLE_CARDS, getGenreLabel } from '../../config/mediaAssets';
import type { BackgroundPromptDesign, LessonProgressState } from '../../types/lesson';
import { downloadBackgroundAsset } from '../../utils/proceduralArt';
import { buildBackgroundPrompt } from '../../utils/promptBuilders';
import { ChipSelector } from '../common/ChipSelector';
import { CopyButton } from '../common/CopyButton';
import { LibraryPreviewCanvas } from '../common/LibraryPreviewCanvas';
import { SafeImage } from '../common/SafeImage';

interface Stage05BackgroundDesignerProps {
  state: LessonProgressState;
  onUpdate: (patch: Partial<LessonProgressState>) => void;
  onUpdatePromptDesign: (patch: Partial<BackgroundPromptDesign>) => void;
}

const LOCATION_CHIPS = [
  'Ночная обсерватория на крыше школы',
  'Секретная лаборатория кибернетики',
  'Мостик космического корабля',
  'Волшебный лес со светящимися деревьями',
  'Загадочный старинный особняк',
  'Уютный ИТ-клуб с мониторами',
];

const TIME_CHIPS = ['Солнечное утро', 'Ясный день', 'Вечер на закате', 'Таинственная ночь'];
const WEATHER_CHIPS = ['Ясно', 'Лёгкий туман', 'Тёплый дождь с бликами', 'Звёздное небо'];
const ATMOSPHERE_CHIPS = ['Спокойная и уютная', 'Загадочная и мистическая', 'Эпичная и яркая', 'Неоновая киберпанк'];
const OBJECT_CHIPS = [
  'Телескоп',
  'Светящиеся экраны',
  'Большое окно',
  'Древние колонны',
  'Книжные полки',
  'Неоновые лампы',
  'Письменный стол',
];
const PALETTE_CHIPS = [
  'Бирюзовый, тёмно-синий и золотой свет',
  'Тёплый закатный оранжевый и фиолетовый',
  'Изумрудно-зелёный и мягкий лунный свет',
  'Кибер-неон: циан, графит и жёлтый',
];

export function Stage05BackgroundDesigner({
  state,
  onUpdate,
  onUpdatePromptDesign,
}: Stage05BackgroundDesignerProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);
  const [availableMap, setAvailableMap] = useState<Record<string, boolean>>({});
  const [showFlowGuide, setShowFlowGuide] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const GOOGLE_FLOW_12_STEPS = [
    { icon: ClipboardCopy, text: 'Скопируй готовый промпт для фона слева.' },
    { icon: ExternalLink, text: 'Нажми на кнопку «Перейти в Google Flow» (откроется в новой вкладке).' },
    { icon: FolderPlus, text: 'Нажми кнопку «Новый проект» (+ New project).' },
    { icon: MousePointerClick, text: 'Нажми на поле для текста («Что нужно создать?») в нижней части экрана.' },
    { icon: ImageIcon, text: 'В правой части поля текста нажми на меню настроек и выбери «Изображение» (Image).' },
    { icon: Maximize2, text: 'Там же выбери соотношение сторон 16:9 (альбомная / горизонтальная ориентация).' },
    { icon: SlidersHorizontal, text: 'Количество генераций поставь 1 или 2.' },
    { icon: Layers, text: 'Нажми на поле ввода и вставь скопированный промпт (Ctrl+V).' },
    { icon: Send, text: 'Нажми стрелочку отправки (Generate) и подожди 5–10 секунд.' },
    { icon: Download, text: 'Открой понравившуюся картинку, нажми на иконку скачивания и сохрани её как background.jpg.' },
    { icon: Upload, text: 'Вернись в KIBERONE и загрузи файл background.jpg в окошко ниже.' },
    { icon: CheckCircle2, text: 'Проверь, что на фоне нет людей и лишнего текста, а кадр широкий (16:9).' },
  ];

  const activeStyle = state.selectedArtStyle || state.backgroundPromptDesign.artStyle || 'anime';
  const styleCard = ART_STYLE_CARDS.find((s) => s.id === activeStyle) || ART_STYLE_CARDS[0];
  const chosenGenre = state.story.genre;

  const handleAvailability = useCallback((id: string, ok: boolean) => {
    setAvailableMap((prev) => (prev[id] === ok ? prev : { ...prev, [id]: ok }));
  }, []);

  /**
   * ЖЁСТКАЯ ФИЛЬТРАЦИЯ (без подмены жанра/стиля и без фальшивых заглушек):
   * Показываем только реально существующие файлы, строго совпадающие с выбранным
   * на Этапе 2 жанром и художественным стилем (максимум 6 карточек).
   */
  const strictItems = useMemo(() => {
    if (!chosenGenre) return [];
    return BACKGROUND_LIBRARY_CATALOG.filter(
      (item) =>
        item.assetExists &&
        item.genre === chosenGenre &&
        item.style === activeStyle &&
        availableMap[item.id] !== false
    ).slice(0, 6);
  }, [chosenGenre, activeStyle, availableMap]);

  const syncedBgPromptDesign: BackgroundPromptDesign = {
    ...state.backgroundPromptDesign,
    artStyle: activeStyle,
  };
  const autoPrompt = buildBackgroundPrompt(syncedBgPromptDesign, chosenGenre);
  const activePrompt = state.backgroundCustomPrompt || autoPrompt;

  const handleDownloadLibraryItem = async (item: BackgroundLibraryItem) => {
    setDownloadingId(item.id);
    setDownloadMsg(null);
    const result = await downloadBackgroundAsset(item, 'background.jpg');
    if (result.ok) {
      onUpdate({ selectedLibraryBgId: item.id, backgroundMode: 'library' });
      setDownloadMsg(`Готово! Скачан файл background.jpg (${item.title}).`);
    } else {
      setDownloadMsg(result.reason || 'Файл ещё не добавлен на диск.');
    }
    setTimeout(() => setDownloadingId(null), 600);
  };

  const handleUploadCustomBackground = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdate({
          uploadedBackgroundDataUrl: reader.result,
          uploadedBackgroundName: file.name,
          backgroundMode: 'generate',
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Inherited Style + Prominent CTA Header */}
      <section className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SafeImage
              src={styleCard.imagePath}
              alt={styleCard.label}
              fallbackTitle={styleCard.label}
              className="w-12 h-12 rounded-2xl object-contain bg-white border border-slate-200 p-0.5 shrink-0"
            />
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#04959A]">
                Наследуется с Этапа 2
              </p>
              <p className="text-sm font-extrabold text-[#26313B]">
                Жанр: {getGenreLabel(chosenGenre)} · Стиль: {styleCard.label}
              </p>
              <p className="text-xs text-slate-500">
                Сохраняем готовый фон как <code className="font-mono font-bold text-[#04959A]">images/background.jpg</code> (16:9)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => onUpdate({ backgroundMode: 'library' })}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold border transition-all cursor-pointer whitespace-nowrap ${
                state.backgroundMode === 'library'
                  ? 'bg-[#06B8BE] text-white border-[#06B8BE] shadow-sm'
                  : 'bg-slate-50 text-[#26313B] border-slate-200 hover:bg-slate-100'
              }`}
            >
              Библиотека ({strictItems.length})
            </button>

            <button
              type="button"
              onClick={() => onUpdate({ backgroundMode: 'generate' })}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold border transition-all cursor-pointer whitespace-nowrap shadow-sm ${
                state.backgroundMode === 'generate'
                  ? 'bg-[#F4C914] text-[#26313B] border-amber-400 shadow-[#F4C914]/30'
                  : 'bg-gradient-to-r from-[#F4C914] to-amber-300 text-[#26313B] border-amber-300 hover:brightness-95'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span>СОЗДАТЬ СВОЙ ФОН В GOOGLE FLOW</span>
            </button>
          </div>
        </div>
      </section>

      {/* Way A: Strictly Filtered Background Library */}
      {state.backgroundMode === 'library' && (
        <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#26313B]">
              Подходящие фоны: {getGenreLabel(chosenGenre)} · {styleCard.label}
            </h3>
            <p className="text-xs text-slate-500">
              Показываются только проверенные изображения 16:9, которые точно совпадают с твоим жанром и стилем.
            </p>
          </div>

          {!chosenGenre ? (
            <div className="rounded-2xl bg-amber-50 border border-[#F4C914] p-5 flex items-start gap-3 text-sm text-[#26313B]">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold">Сначала выбери жанр игры на Этапе 2</p>
                <p className="text-xs text-slate-600 mt-1">
                  Как только жанр будет выбран, здесь появятся подходящие сцены или кнопка создания своего фона в Google Flow.
                </p>
              </div>
            </div>
          ) : strictItems.length === 0 ? (
            <div className="rounded-3xl bg-gradient-to-br from-amber-50 to-cyan-50/70 border-2 border-[#F4C914] p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#F4C914] text-amber-600 flex items-center justify-center mx-auto shadow-xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="max-w-lg mx-auto space-y-1.5">
                <h4 className="text-base sm:text-lg font-extrabold text-[#26313B]">
                  Для сочетания «{getGenreLabel(chosenGenre)}» + «{styleCard.label}» пока нет готового фона
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Мы специально не подменяем картинки другими стилями, чтобы твоя игра выглядела цельно. Собери
                  уникальный фон ровно под свой сюжет за 15 секунд в Google Flow!
                </p>
              </div>
              <button
                type="button"
                onClick={() => onUpdate({ backgroundMode: 'generate' })}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#F4C914] hover:bg-amber-400 text-[#26313B] text-sm font-extrabold shadow-sm cursor-pointer transition-all"
              >
                <Wand2 className="w-4 h-4" />
                <span>СОЗДАТЬ СВОЙ ФОН В GOOGLE FLOW</span>
              </button>
            </div>
          ) : (
            <>
              {downloadMsg && (
                <p className="text-xs font-bold text-[#04959A] bg-cyan-50 border border-[#06B8BE]/40 rounded-xl px-4 py-2.5">
                  {downloadMsg}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {strictItems.map((item) => {
                  const isSelected = state.selectedLibraryBgId === item.id;

                  return (
                    <article
                      key={item.id}
                      className={`rounded-2xl border-2 overflow-hidden flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-[#06B8BE] bg-cyan-50/40 shadow-md shadow-[#06B8BE]/15'
                          : 'border-slate-200 bg-[#F4F8FB]'
                      }`}
                    >
                      <div>
                        <div className="relative aspect-video bg-slate-100 overflow-hidden">
                          <LibraryPreviewCanvas
                            item={item}
                            onAvailabilityChange={(ok) => handleAvailability(item.id, ok)}
                          />
                          {isSelected && (
                            <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#06B8BE] text-white text-[11px] font-extrabold shadow">
                              <Check className="w-3.5 h-3.5" />
                              <span>Выбран</span>
                            </span>
                          )}
                        </div>

                        <div className="p-3.5">
                          <h4 className="font-extrabold text-sm text-[#26313B] leading-snug">{item.title}</h4>
                          <p className="text-xs font-medium text-slate-500 mt-1">
                            {getGenreLabel(item.genre)} · {styleCard.label} · 16:9
                          </p>
                        </div>
                      </div>

                      <div className="px-3.5 pb-3.5 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdate({ selectedLibraryBgId: item.id })}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#26313B] text-white'
                              : 'bg-white border border-slate-200 hover:border-[#06B8BE] text-[#26313B]'
                          }`}
                        >
                          {isSelected ? 'Выбрано' : 'Выбрать'}
                        </button>

                        <button
                          type="button"
                          disabled={downloadingId === item.id}
                          onClick={() => handleDownloadLibraryItem(item)}
                          className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-extrabold bg-[#06B8BE] hover:bg-[#04959A] text-white cursor-pointer transition-colors whitespace-nowrap shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{downloadingId === item.id ? 'Готово' : 'Скачать'}</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </section>
      )}

      {/* Way B: Chip-based Google Flow Background Prompt Builder */}
      {state.backgroundMode === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#26313B]">
                Собери промпт для своего фона в Google Flow
              </h3>
              <p className="text-xs text-slate-500">
                Стиль «{styleCard.label}», формат 16:9, запрет на людей и место внизу под диалоги подставятся сами!
              </p>
            </div>

            <div className="space-y-4">
              <ChipSelector
                label="Локация"
                options={LOCATION_CHIPS}
                value={state.backgroundPromptDesign.location}
                onChange={(val) => onUpdatePromptDesign({ location: val })}
                placeholder="Напиши свою локацию..."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ChipSelector
                  label="Время суток"
                  options={TIME_CHIPS}
                  value={state.backgroundPromptDesign.timeOfDay}
                  onChange={(val) => onUpdatePromptDesign({ timeOfDay: val })}
                />

                <ChipSelector
                  label="Погода"
                  options={WEATHER_CHIPS}
                  value={state.backgroundPromptDesign.weather}
                  onChange={(val) => onUpdatePromptDesign({ weather: val })}
                />
              </div>

              <ChipSelector
                label="Атмосфера"
                options={ATMOSPHERE_CHIPS}
                value={state.backgroundPromptDesign.atmosphere}
                onChange={(val) => onUpdatePromptDesign({ atmosphere: val })}
              />

              <ChipSelector
                label="Детали и объекты в кадре"
                helperText="Можно выбрать несколько"
                mode="multi"
                options={OBJECT_CHIPS}
                value={state.backgroundPromptDesign.keyObjects}
                onChange={(val) => onUpdatePromptDesign({ keyObjects: val })}
                placeholder="Допиши объекты через запятую..."
              />

              <ChipSelector
                label="Цветовая палитра"
                options={PALETTE_CHIPS}
                value={state.backgroundPromptDesign.colorPalette}
                onChange={(val) => onUpdatePromptDesign({ colorPalette: val })}
              />
            </div>

            <div className="pt-3 space-y-2 border-t border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-[#26313B]">Готовый промпт для Google Flow:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdate({ backgroundCustomPrompt: '' })}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-[#26313B] hover:bg-slate-100 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#06B8BE]" />
                    <span>Обновить</span>
                  </button>
                  <CopyButton text={activePrompt} label="Скопировать промпт" />
                </div>
              </div>

              <textarea
                rows={6}
                value={activePrompt}
                onChange={(e) => onUpdate({ backgroundCustomPrompt: e.target.value })}
                className="w-full p-3.5 rounded-2xl border border-slate-200 bg-[#F4F8FB] font-mono text-xs text-[#26313B] leading-relaxed focus:outline-none focus:border-[#06B8BE]"
              />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-gradient-to-br from-cyan-50 to-amber-50 border-2 border-[#06B8BE]/45 rounded-3xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-base font-extrabold text-[#26313B]">Google Flow</h4>
                <button
                  type="button"
                  onClick={() => setShowFlowGuide((v) => !v)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#06B8BE]/40 text-xs font-extrabold text-[#04959A] hover:bg-cyan-50 cursor-pointer"
                >
                  <span>Как создать свой фон в Google Flow</span>
                  {showFlowGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              <a
                href="https://labs.google/fx/tools/flow"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#F4C914] hover:bg-amber-400 text-[#26313B] text-xs sm:text-sm font-extrabold shadow-sm transition-colors"
              >
                <Wand2 className="w-4 h-4" />
                <span>Перейти в Google Flow</span>
                <ArrowRight className="w-4 h-4" />
                <ExternalLink className="w-4 h-4" />
              </a>

              {showFlowGuide && (
                <div className="animate-lab-enter space-y-2.5 pt-2 border-t border-[#06B8BE]/25">
                  <ol className="space-y-1.5">
                    {GOOGLE_FLOW_12_STEPS.map((step, idx) => {
                      const StepIcon = step.icon;
                      return (
                        <li
                          key={step.text}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/95 border border-slate-200 text-xs text-[#26313B]"
                        >
                          <span className="w-5 h-5 rounded-md bg-[#06B8BE] text-white text-[11px] font-extrabold flex items-center justify-center shrink-0 tabular-nums">
                            {idx + 1}
                          </span>
                          <StepIcon className="w-4 h-4 text-[#04959A] shrink-0 mt-0.5" />
                          <span className="leading-snug font-medium">{step.text}</span>
                        </li>
                      );
                    })}
                  </ol>
                  <div className="rounded-xl bg-amber-50 border border-[#F4C914]/70 p-2.5 flex items-start gap-2 text-[11px] text-amber-950 leading-snug">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Внешний вид Google Flow может немного меняться при обновлениях сервиса — ориентируйся на названия
                      пунктов (Изображение / Image, 16:9, Скачать).
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-extrabold text-[#26313B]">Загрузи свой фон 16:9</h4>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadCustomBackground}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#06B8BE] hover:bg-[#04959A] text-white text-xs font-extrabold cursor-pointer whitespace-nowrap"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Загрузить</span>
                </button>
              </div>

              {state.uploadedBackgroundDataUrl ? (
                <div className="space-y-2">
                  <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                    <SafeImage
                      src={state.uploadedBackgroundDataUrl}
                      alt="Загруженный фон"
                      fallbackTitle="Загруженный фон"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-emerald-700 font-bold">
                    Загружен: {state.uploadedBackgroundName || 'background.jpg'}
                  </p>
                </div>
              ) : (
                <div className="aspect-video rounded-2xl border-2 border-dashed border-slate-200 bg-[#F4F8FB] flex flex-col items-center justify-center p-4 text-center text-slate-400">
                  <ImageIcon className="w-7 h-7 text-slate-400 mb-1.5" />
                  <p className="text-xs font-semibold text-slate-500">Здесь появится твой фон 16:9</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
