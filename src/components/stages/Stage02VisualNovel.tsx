import { Check, CheckCircle2, Layers, Palette, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { ART_STYLE_CARDS, GENRE_CARDS, VN_DEMO_SCENE_PATH } from '../../config/mediaAssets';
import type { ArtStyleId, GenreId, LessonProgressState, StoryDesign } from '../../types/lesson';
import { SafeImage } from '../common/SafeImage';

type AnatomyElementId = 'background' | 'character' | 'ui' | 'dialogue' | 'choice' | 'ending';

interface AnatomyElement {
  id: AnatomyElementId;
  title: string;
  tag: string;
  description: string;
}

const ANATOMY_ELEMENTS: AnatomyElement[] = [
  {
    id: 'background',
    title: '1. Фон локации',
    tag: 'Слой 1 · 16:9',
    description: 'Горизонтальная картинка 16:9 без персонажей и надписей. Задаёт место и атмосферу сцены.',
  },
  {
    id: 'character',
    title: '2. Персонаж (PNG)',
    tag: 'Слой 2 · Спрайт',
    description: 'Изображение одного героя с прозрачным фоном поверх локации.',
  },
  {
    id: 'ui',
    title: '3. Окно диалога',
    tag: 'Слой 3 · Интерфейс',
    description: 'Полупрозрачная панель внизу экрана с именем говорящего и текстом.',
  },
  {
    id: 'dialogue',
    title: '4. Диалоги',
    tag: 'Текст истории',
    description: 'Короткие реплики по 1–2 предложения, которые листаются кликом или пробелом.',
  },
  {
    id: 'choice',
    title: '5. Выбор игрока',
    tag: 'Развилка',
    description: 'Две кнопки решений. От нажатой кнопки зависит дальнейшая ветка кода if/else.',
  },
  {
    id: 'ending',
    title: '6. Финалы',
    tag: '2 концовки',
    description: 'Два разных завершения истории: смелое или осторожное.',
  },
];

interface Stage02VisualNovelProps {
  state: LessonProgressState;
  onUpdate: (patch: Partial<LessonProgressState>) => void;
  onUpdateStory?: (patch: Partial<StoryDesign>) => void;
  onSelectGlobalStyle?: (styleId: ArtStyleId) => void;
}

export function Stage02VisualNovel({
  state,
  onUpdate,
  onUpdateStory,
  onSelectGlobalStyle,
}: Stage02VisualNovelProps) {
  const [subTab, setSubTab] = useState<'style' | 'anatomy'>('style');
  const [selectedId, setSelectedId] = useState<AnatomyElementId>('background');
  const [previewBranch, setPreviewBranch] = useState<'intro' | 'c1' | 'c2'>('intro');

  const selectedElement = ANATOMY_ELEMENTS.find((e) => e.id === selectedId) || ANATOMY_ELEMENTS[0];
  const currentStyleCard =
    ART_STYLE_CARDS.find((s) => s.id === state.selectedArtStyle) || ART_STYLE_CARDS[0];

  const handleSelectGenre = (genreId: GenreId) => {
    const card = GENRE_CARDS.find((g) => g.id === genreId);
    const nextStory: StoryDesign = {
      ...state.story,
      genre: genreId,
      setting: state.story.setting.trim() ? state.story.setting : card?.defaultSetting || '',
      atmosphere: state.story.atmosphere.trim() ? state.story.atmosphere : card?.defaultAtmosphere || '',
    };
    if (onUpdateStory) {
      onUpdateStory({
        genre: nextStory.genre,
        setting: nextStory.setting,
        atmosphere: nextStory.atmosphere,
      });
    } else {
      onUpdate({ story: nextStory });
    }
  };

  const handleSelectStyle = (styleId: ArtStyleId) => {
    if (onSelectGlobalStyle) {
      onSelectGlobalStyle(styleId);
    } else {
      onUpdate({
        selectedArtStyle: styleId,
        backgroundPromptDesign: { ...state.backgroundPromptDesign, artStyle: styleId },
        character: { ...state.character, artStyle: styleId },
      });
    }
  };

  const handleSelectElement = (id: AnatomyElementId) => {
    setSelectedId(id);
    if (!state.stage2InspectedIds.includes(id)) {
      onUpdate({ stage2InspectedIds: [...state.stage2InspectedIds, id] });
    }
  };

  return (
    <div className="space-y-4">
      {/* Clean 2-tab switcher: Main Choice (Genre & 6 Styles) + Interactive Scene Layers */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-wrap items-center gap-2 shadow-xs">
        <button
          type="button"
          onClick={() => setSubTab('style')}
          className={`flex-1 min-w-[200px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            subTab === 'style'
              ? 'bg-[#06B8BE] text-white'
              : 'bg-slate-50 text-[#26313B] hover:bg-slate-100'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>1. Жанр и 6 стилей графики</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('anatomy')}
          className={`flex-1 min-w-[200px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            subTab === 'anatomy'
              ? 'bg-[#F4C914] text-[#26313B]'
              : 'bg-slate-50 text-[#26313B] hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>2. Как устроена сцена игры (слои)</span>
        </button>
      </div>

      {subTab === 'style' && (
        <div className="animate-lab-enter space-y-5">
          {/* 5 Genre Cards */}
          <section className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-extrabold text-[#26313B]">Выбери жанр своей игры</h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Жанр задаст атмосферу локации и подсказки для сюжета и фонов.
                </p>
              </div>
              {state.story.genre && (
                <span className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-extrabold text-emerald-700">
                  Жанр выбран!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {GENRE_CARDS.map((card) => {
                const isSelected = state.story.genre === card.id;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => handleSelectGenre(card.id)}
                    className={`group text-left rounded-2xl overflow-hidden border-2 transition-all cursor-pointer flex flex-col ${
                      isSelected
                        ? 'border-[#06B8BE] ring-4 ring-[#06B8BE]/15 bg-cyan-50/40'
                        : 'border-slate-200 hover:border-[#06B8BE]/60 bg-white'
                    }`}
                  >
                    <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                      <SafeImage
                        src={card.imagePath}
                        alt={card.label}
                        fallbackTitle={card.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                      />
                      {isSelected && (
                        <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#06B8BE] text-white flex items-center justify-center shadow">
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                    <div className="p-3 flex-1">
                      <p className="font-extrabold text-sm text-[#26313B]">{card.label}</p>
                      <p className="text-xs text-slate-500 mt-1 leading-snug">{card.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 6 Illustrated Art Style Cards (including new Hand-Drawn style) */}
          <section className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-extrabold text-[#26313B] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#F4C914]" />
                  <span>Выбери художественный стиль всей игры (6 стилей)</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Выбранный стиль автоматически попадёт в промпты сценария, фона и персонажа — менять его повторно не придётся.
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-[#F4C914] text-xs font-extrabold text-[#26313B]">
                Активный стиль: {currentStyleCard.label}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ART_STYLE_CARDS.map((styleCard) => {
                const isSelected = state.selectedArtStyle === styleCard.id;
                return (
                  <button
                    key={styleCard.id}
                    type="button"
                    onClick={() => handleSelectStyle(styleCard.id)}
                    className={`group text-left rounded-2xl overflow-hidden border-2 transition-all cursor-pointer flex flex-col ${
                      isSelected
                        ? 'border-[#06B8BE] ring-4 ring-[#06B8BE]/15 bg-cyan-50/40'
                        : 'border-slate-200 hover:border-[#06B8BE]/60 bg-white'
                    }`}
                  >
                    <div className="relative aspect-[4/3] bg-white border-b border-slate-100 overflow-hidden">
                      <SafeImage
                        src={styleCard.imagePath}
                        alt={styleCard.label}
                        fallbackTitle={styleCard.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain p-2 group-hover:scale-[1.03] transition-transform duration-200"
                      />
                      {isSelected && (
                        <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-[#06B8BE] text-white text-[11px] font-extrabold inline-flex items-center gap-1 shadow">
                          <Check className="w-3.5 h-3.5" />
                          <span>Выбран</span>
                        </span>
                      )}
                    </div>
                    <div className="p-3.5 flex-1">
                      <p className="font-extrabold text-sm text-[#26313B]">{styleCard.label}</p>
                      <p className="text-xs text-slate-500 mt-1 leading-snug">{styleCard.shortDescription}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {subTab === 'anatomy' && (
        <div className="animate-lab-enter grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Interactive Visual Novel Stage Preview */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-sm font-extrabold text-[#26313B]">
                Нажимай на слои прямо внутри сцены (стиль: {currentStyleCard.label})
              </p>
              <span className="text-xs font-mono font-bold text-[#04959A]">1000 × 600 px</span>
            </div>

            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 select-none">
              <SafeImage
                src={VN_DEMO_SCENE_PATH}
                alt="Пример фона визуальной новеллы"
                fallbackTitle="Демо-сцена"
                referrerPolicy="no-referrer"
                onClick={() => handleSelectElement('background')}
                className={`w-full h-full object-cover cursor-pointer transition-all ${
                  selectedId === 'background' ? 'brightness-105' : 'brightness-90'
                }`}
              />

              {selectedId === 'background' && (
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-[#06B8BE] text-white text-xs font-extrabold shadow">
                  Фон: локация 16:9 без текста
                </div>
              )}

              <button
                type="button"
                onClick={() => handleSelectElement('character')}
                className={`absolute bottom-[25%] right-[10%] w-[24%] h-[62%] rounded-xl overflow-hidden transition-all cursor-pointer border-2 bg-white/95 ${
                  selectedId === 'character'
                    ? 'border-[#F4C914] scale-[1.03] shadow-lg'
                    : 'border-white/70 hover:border-[#F4C914]'
                }`}
                title="Персонаж на сцене"
              >
                <SafeImage
                  src={currentStyleCard.imagePath}
                  alt="Один персонаж на сцене"
                  fallbackTitle={currentStyleCard.label}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain object-top p-1"
                />
                <span className="absolute bottom-1 left-1 right-1 bg-[#26313B]/90 text-white text-[10px] font-bold py-0.5 px-1.5 rounded text-center">
                  Персонаж PNG
                </span>
              </button>

              <div className="absolute top-[22%] left-4 sm:left-6 flex flex-col gap-2 max-w-[54%]">
                <button
                  type="button"
                  onClick={() => {
                    handleSelectElement('choice');
                    setPreviewBranch('c1');
                  }}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    previewBranch === 'c1'
                      ? 'bg-[#06B8BE] text-white border-white shadow'
                      : 'bg-[#26313B]/90 hover:bg-[#06B8BE] text-white border-white/25'
                  }`}
                >
                  Выбор 1: Включить телескоп
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSelectElement('choice');
                    setPreviewBranch('c2');
                  }}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    previewBranch === 'c2'
                      ? 'bg-[#F4C914] text-[#26313B] border-white shadow'
                      : 'bg-[#26313B]/90 hover:bg-[#F4C914] hover:text-[#26313B] text-white border-white/25'
                  }`}
                >
                  Выбор 2: Проверить сигнал на планшете
                </button>
              </div>

              <div
                onClick={() => handleSelectElement(previewBranch === 'intro' ? 'dialogue' : 'ending')}
                className={`absolute bottom-3 left-3 right-3 rounded-xl bg-[#26313B]/92 backdrop-blur-sm p-3.5 text-white border-2 transition-all cursor-pointer ${
                  selectedId === 'ui' || selectedId === 'dialogue' || selectedId === 'ending'
                    ? 'border-[#06B8BE]'
                    : 'border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="inline-block bg-[#F4C914] text-[#26313B] text-[11px] font-extrabold px-2.5 py-0.5 rounded">
                    Алекс · Главный герой
                  </span>
                  {previewBranch !== 'intro' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewBranch('intro');
                      }}
                      className="text-[11px] text-[#06B8BE] underline cursor-pointer"
                    >
                      Сбросить выбор
                    </button>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-100 leading-snug">
                  {previewBranch === 'intro' &&
                    'На крыше обсерватории сработал неизвестный маяк. Что сделаем прямо сейчас?'}
                  {previewBranch === 'c1' &&
                    'Финал 1: Через линзу телескопа ты видишь координаты спрятанного спутника!'}
                  {previewBranch === 'c2' &&
                    'Финал 2: Планшет расшифровал радиокод — это приглашение в секретный клуб!'}
                </p>
              </div>
            </div>
          </div>

          {/* Element Inspector */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 space-y-2.5 shadow-xs">
              <h3 className="text-sm font-extrabold text-[#26313B]">Из чего состоит кадр игры:</h3>
              <div className="space-y-1.5">
                {ANATOMY_ELEMENTS.map((el) => {
                  const isSelected = el.id === selectedId;
                  const isVisited = state.stage2InspectedIds.includes(el.id);
                  return (
                    <button
                      key={el.id}
                      type="button"
                      onClick={() => handleSelectElement(el.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'border-[#06B8BE] bg-cyan-50 text-[#26313B]'
                          : 'border-slate-200 hover:border-[#06B8BE]/60 bg-slate-50 text-[#26313B]'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-bold flex items-center gap-2">
                        {isVisited && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                        <span>{el.title}</span>
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 shrink-0">{el.tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-white border border-[#06B8BE]/45 text-[#26313B] rounded-3xl p-5 shadow-xs">
              <p className="text-xs font-extrabold text-[#04959A] mb-1">{selectedElement.tag}</p>
              <h4 className="text-base font-extrabold mb-1">{selectedElement.title}</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{selectedElement.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
