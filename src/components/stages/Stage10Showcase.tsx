import { Award, CheckSquare, Gift, MessageCircle, Sparkles, Square, Trophy } from 'lucide-react';
import { useState } from 'react';
import { BACKGROUND_LIBRARY_CATALOG } from '../../config/backgroundLibrary';
import { getStyleLabel } from '../../config/mediaAssets';
import type {
  LessonProgressState,
  ReflectionAnswers,
  ShowcaseChecklistState,
  StoryDesign,
} from '../../types/lesson';
import { CertificatePreview } from '../common/CertificatePreview';
import { ChipSelector } from '../common/ChipSelector';
import { GuideMascot } from '../common/GuideMascot';
import { LibraryPreviewCanvas } from '../common/LibraryPreviewCanvas';
import { MemeReactionCard } from '../common/MemeReactionCard';
import { SafeImage } from '../common/SafeImage';

interface Stage10ShowcaseProps {
  state: LessonProgressState;
  onUpdate: (patch: Partial<LessonProgressState>) => void;
  onUpdateStory: (patch: Partial<StoryDesign>) => void;
  onUpdateChecklist: (patch: Partial<ShowcaseChecklistState>) => void;
  onUpdateReflection: (patch: Partial<ReflectionAnswers>) => void;
  onOpenFinalChest: () => void;
}

const ACHIEVEMENTS: Array<{ key: keyof ShowcaseChecklistState; label: string }> = [
  { key: 'createdStory', label: 'Выбрал стиль, жанр и придумал историю с 2 финалами' },
  { key: 'pickedBackground', label: 'Подготовил игровой фон 16:9' },
  { key: 'createdCharacter', label: 'Создал главного персонажа' },
  { key: 'preparedTransparentPng', label: 'Вырезал фон (character.png)' },
  { key: 'generatedPythonCode', label: 'Собрал код main.py на Pygame' },
  { key: 'launchedGame', label: 'Запустил игру в окне 1000×600' },
  { key: 'testedChoices', label: 'Проверил оба выбора и концовки' },
];

const TITLE_SUGGESTION_CHIPS = [
  'Сигнал с четвёртой крыши',
  'Тайна звёздного архива',
  'Код перезагрузки',
  'Хранители нового мира',
  'Прыжок за горизонт',
];

export function Stage10Showcase({
  state,
  onUpdate,
  onUpdateStory,
  onUpdateChecklist,
  onUpdateReflection,
  onOpenFinalChest,
}: Stage10ShowcaseProps) {
  const [activeMemeId, setActiveMemeId] = useState('meme_game_alive');
  const completedCount = Object.values(state.showcaseChecklist).filter(Boolean).length;

  const strictMatchedBg = BACKGROUND_LIBRARY_CATALOG.find(
    (b) =>
      b.id === state.selectedLibraryBgId &&
      b.assetExists &&
      (!state.story.genre || b.genre === state.story.genre) &&
      b.style === state.selectedArtStyle
  );

  const todayFormatted = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const gameDisplayTitle = state.story.gameTitle.trim() || 'Авторская визуальная новелла';
  const isFinalChestOpened = state.openedChests.includes('chest_final');

  return (
    <div className="space-y-6">
      <GuideMascot
        compact
        emotion="victory"
        message={`Поздравляю! Ты собрал свою игру в стиле «${getStyleLabel(state.selectedArtStyle)}» и набрал ${state.xp} XP! Придумай ей финальное название, впиши своё имя и скачай грамоту PNG или PDF!`}
      />

      {/* Final Game Naming + Student Name + Grand Final Chest */}
      <section className="bg-white border-2 border-[#06B8BE]/45 rounded-3xl p-5 sm:p-6 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#04959A]">
            <Sparkles className="w-4 h-4 text-[#F4C914]" />
            <span>Финальный штрих: заполни данные для своей именной грамоты</span>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#26313B] mb-1.5">
              Имя и фамилия разработчика *
            </label>
            <input
              type="text"
              value={state.studentName}
              onChange={(e) => onUpdate({ studentName: e.target.value })}
              placeholder="Например: Артём Соколов"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-[#26313B] placeholder:text-slate-400 focus:outline-none focus:border-[#06B8BE]"
            />
          </div>

          <ChipSelector
            label="Финальное название твоей игры * (выбери идею или впиши своё)"
            options={TITLE_SUGGESTION_CHIPS}
            value={state.story.gameTitle}
            onChange={(val) => onUpdateStory({ gameTitle: val })}
            placeholder="Например: Сигнал с четвёртой крыши"
          />
        </div>

        <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-amber-50 to-cyan-50 border-2 border-[#F4C914] p-5 flex flex-col justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#F4C914] flex items-center justify-center shrink-0">
              {isFinalChestOpened ? (
                <Trophy className="w-6 h-6 text-amber-500" />
              ) : (
                <Gift className="w-6 h-6 text-[#06B8BE] animate-lab-float" />
              )}
            </div>
            <div>
              <p className="text-xs font-extrabold text-[#04959A]">Финальная награда</p>
              <p className="text-sm font-extrabold text-[#26313B]">Главный сундук создателя игры</p>
              <p className="text-xs text-slate-600 mt-0.5">Стикер «Создатель игры KIBERONE» ждёт тебя внутри!</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenFinalChest}
            className={`w-full py-3 px-4 rounded-xl text-sm font-extrabold cursor-pointer transition-all inline-flex items-center justify-center gap-2 ${
              isFinalChestOpened
                ? 'bg-white border border-amber-300 text-amber-800 hover:bg-amber-50'
                : 'bg-[#F4C914] hover:bg-amber-400 text-[#26313B] shadow-sm'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>{isFinalChestOpened ? 'Посмотреть награду сундука' : 'Открыть Главный сундук!'}</span>
          </button>
        </div>
      </section>

      {/* A4 LANDSCAPE CERTIFICATE (PNG + PDF ONLY — NO PRINT DIALOG, NO JSON EXPORT) */}
      <section className="bg-white border-2 border-[#06B8BE] rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#26313B]">Твоя именная грамота (A4 альбомный)</h2>
          <p className="text-xs text-slate-500">
            Проверь имя, название игры, XP и ключи прямо на макете и скачай грамоту в PNG или PDF.
          </p>
        </div>

        <CertificatePreview
          studentName={state.studentName}
          gameTitle={state.story.gameTitle}
          genre={state.story.genre}
          artStyle={state.selectedArtStyle}
          xp={state.xp}
          unlockedKeysCount={state.unlockedKeys.length}
          earnedAchievementIds={state.earnedAchievements}
          dateFormatted={todayFormatted}
        />
      </section>

      {/* Interactive Showcase Preview + Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-5 flex flex-col justify-between gap-4 shadow-xs">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-[#1b2b38] to-cyan-950 border border-slate-200">
            {state.backgroundMode === 'generate' && state.uploadedBackgroundDataUrl ? (
              <SafeImage
                src={state.uploadedBackgroundDataUrl}
                alt="Фон проекта"
                fallbackTitle="Фон проекта"
                className="w-full h-full object-cover"
              />
            ) : strictMatchedBg ? (
              <LibraryPreviewCanvas item={strictMatchedBg} />
            ) : null}

            {(state.uploadedCharacterTransparentDataUrl || state.uploadedCharacterRawDataUrl) && (
              <SafeImage
                src={state.uploadedCharacterTransparentDataUrl || state.uploadedCharacterRawDataUrl}
                alt="Персонаж проекта"
                fallbackTitle="Персонаж проекта"
                className="absolute bottom-[16%] left-1/2 -translate-x-1/2 h-[75%] w-auto object-contain"
              />
            )}

            <div className="absolute bottom-2.5 left-2.5 right-2.5 rounded-xl bg-[#26313B]/92 border border-white/15 px-3.5 py-2 text-white">
              <p className="text-[11px] font-bold text-[#F4C914]">
                {state.character.name.trim() || 'Главный герой'} · «{gameDisplayTitle}»
              </p>
              <p className="text-xs text-slate-200 truncate">
                {state.story.problem.trim() || 'Моя первая визуальная новелла на Python и Pygame!'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-cyan-50 border border-[#06B8BE]/40">
              <p className="text-[#04959A] font-extrabold mb-1">Выбор 1</p>
              <p className="text-[#26313B] line-clamp-2">{state.story.choiceOne || 'Первая ветка сюжета'}</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-[#F4C914]/70">
              <p className="text-amber-800 font-extrabold mb-1">Выбор 2</p>
              <p className="text-[#26313B] line-clamp-2">{state.story.choiceTwo || 'Вторая ветка сюжета'}</p>
            </div>
          </div>
        </div>

        <section className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#26313B] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#F4C914]" />
              <span>Что я сегодня сделал</span>
            </h3>
            <span className="text-xs font-extrabold text-[#04959A] tabular-nums">
              {completedCount} / {ACHIEVEMENTS.length}
            </span>
          </div>

          <div className="space-y-1.5">
            {ACHIEVEMENTS.map((item) => {
              const checked = state.showcaseChecklist[item.key];
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onUpdateChecklist({ [item.key]: !checked })}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                    checked
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-slate-200 hover:border-[#06B8BE] bg-slate-50 text-[#26313B]'
                  }`}
                >
                  {checked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Reflection */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#06B8BE]" />
          <h3 className="text-base sm:text-lg font-extrabold text-[#26313B]">Короткая рефлексия</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#26313B] mb-1.5">
              1. Что понравилось больше всего?
            </label>
            <textarea
              rows={2}
              value={state.reflection.likedMost}
              onChange={(e) => onUpdateReflection({ likedMost: e.target.value })}
              placeholder="Придумывать героя, делать код..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-[#26313B] placeholder:text-slate-400 focus:outline-none focus:border-[#06B8BE]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#26313B] mb-1.5">
              2. Какой этап был самым сложным?
            </label>
            <textarea
              rows={2}
              value={state.reflection.hardestPart}
              onChange={(e) => onUpdateReflection({ hardestPart: e.target.value })}
              placeholder="Что удалось преодолеть..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-[#26313B] placeholder:text-slate-400 focus:outline-none focus:border-[#06B8BE]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#26313B] mb-1.5">
              3. Что бы ты добавил ещё?
            </label>
            <textarea
              rows={2}
              value={state.reflection.nextFeature}
              onChange={(e) => onUpdateReflection({ nextFeature: e.target.value })}
              placeholder="Музыку, новую сцену, 3-й финал..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-[#26313B] placeholder:text-slate-400 focus:outline-none focus:border-[#06B8BE]"
            />
          </div>
        </div>
      </section>

      <MemeReactionCard memeId={activeMemeId} onCycleMeme={setActiveMemeId} />
    </div>
  );
}
