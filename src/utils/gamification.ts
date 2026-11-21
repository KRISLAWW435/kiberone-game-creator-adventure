import { BACKGROUND_LIBRARY_CATALOG } from '../config/backgroundLibrary';
import { getEmotionForContext, pickCyberBotLine } from '../config/cyberbotLines';
import type { LessonProgressState, MascotEmotion } from '../types/lesson';
import { validateFinalScenario } from './scenarioValidator';

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  xpHint: string;
  stageId?: number;
  questRequiredCount?: number;
}

export interface StageKeyArtifact {
  id: string;
  stageId: number;
  name: string;
  subtitle: string;
  accentColor: string;
}

export interface MilestoneChest {
  id: string;
  afterStage: number;
  title: string;
  subtitle: string;
  stickerId: string;
  stickerTitle: string;
  stickerNote: string;
  cyberBotLine: string;
  isGrandFinal?: boolean;
}

export const STAGE_KEYS_CATALOG: StageKeyArtifact[] = [
  { id: 'key_stage_1', stageId: 1, name: 'Ключ Логики', subtitle: 'Python + Vibe Coding', accentColor: '#06B8BE' },
  { id: 'key_stage_2', stageId: 2, name: 'Ключ Стиля', subtitle: 'Жанр и графика', accentColor: '#7C3AED' },
  { id: 'key_stage_3', stageId: 3, name: 'Ключ Истории', subtitle: 'Сюжет и 2 финала', accentColor: '#F4C914' },
  { id: 'key_stage_4', stageId: 4, name: 'Ключ Сценария', subtitle: 'Промпт и диалоги', accentColor: '#0EA5E9' },
  { id: 'key_stage_5', stageId: 5, name: 'Ключ Миров', subtitle: 'Игровой фон 16:9', accentColor: '#10B981' },
  { id: 'key_stage_6', stageId: 6, name: 'Ключ Героя', subtitle: 'Образ персонажа', accentColor: '#F97316' },
  { id: 'key_stage_7', stageId: 7, name: 'Ключ Прозрачности', subtitle: 'Спрайт character.png', accentColor: '#06B8BE' },
  { id: 'key_stage_8', stageId: 8, name: 'Ключ Движка', subtitle: 'Код main.py + Pygame', accentColor: '#7C3AED' },
  { id: 'key_stage_9', stageId: 9, name: 'Ключ Отладки', subtitle: 'Чистый запуск игры', accentColor: '#10B981' },
  { id: 'key_stage_10', stageId: 10, name: 'Золотой ключ Творца', subtitle: 'Финал и релиз игры', accentColor: '#F4C914' },
];

export const CHESTS_CATALOG: MilestoneChest[] = [
  {
    id: 'chest_act_1',
    afterStage: 3,
    title: 'Сундук Идеи и Стиля',
    subtitle: 'Открывается после 3-го этапа приключения',
    stickerId: 'sticker_world_architect',
    stickerTitle: 'Архитектор игрового мира',
    stickerNote: 'Ты выбрал стиль графики, жанр и придумал историю с двумя финалами!',
    cyberBotLine: 'Ого! У твоей игры уже есть душа, стиль и два варианта сюжета. Открывай награду!',
  },
  {
    id: 'chest_act_2',
    afterStage: 6,
    title: 'Сундук Арта и Персонажа',
    subtitle: 'Открывается после 6-го этапа приключения',
    stickerId: 'sticker_art_director',
    stickerTitle: 'Арт-директор студии',
    stickerNote: 'Сценарий, локация 16:9 и главный герой готовы к сборке!',
    cyberBotLine: 'Красота! Теперь у тебя есть своя сцена и уникальный герой. Забирай стикер!',
  },
  {
    id: 'chest_act_3',
    afterStage: 9,
    title: 'Сундук Кода и Баг-хантинга',
    subtitle: 'Открывается после 9-го этапа приключения',
    stickerId: 'sticker_pygame_master',
    stickerTitle: 'Повелитель Pygame',
    stickerNote: 'Прозрачный спрайт, main.py и проверка багов позади — игра реально работает!',
    cyberBotLine: 'Вот это мощь! Код на Python ожил, а баги повержены. Остался финальный шаг!',
  },
  {
    id: 'chest_final',
    afterStage: 10,
    title: 'Главный сундук создателя игры',
    subtitle: 'Главная награда приключения KIBERONE',
    stickerId: 'sticker_game_creator',
    stickerTitle: 'Создатель игры KIBERONE',
    stickerNote: 'Все 10 ключей собраны! Ты прошёл путь от идеи до работающей новеллы на Python.',
    cyberBotLine: 'ЛЕГЕНДА! Все 10 ключей у тебя в руках. Это настоящая победа геймдизайнера!',
    isGrandFinal: true,
  },
];

export const ACHIEVEMENTS_CATALOG: AchievementDefinition[] = [
  {
    id: 'ach_stage_1',
    title: 'Первый шаг в Vibe Coding',
    description: 'Разобрался с логикой ИИ-разработки и базой Python',
    xpHint: '+10 XP за этап 1',
    stageId: 1,
  },
  {
    id: 'ach_stage_2',
    title: 'Мастер стиля и жанра',
    description: 'Выбрал жанр, художественный стиль и изучил слои сцены',
    xpHint: '+10 XP за этап 2',
    stageId: 2,
  },
  {
    id: 'ach_stage_3',
    title: 'Мастер сюжета',
    description: 'Придумал мир, героя, развилку и 2 финала',
    xpHint: '+10 XP за этап 3',
    stageId: 3,
  },
  {
    id: 'ach_stage_4',
    title: 'Промпт-сценарист',
    description: 'Превратил идею в готовый диалоговый сценарий',
    xpHint: '+10 XP за этап 4',
    stageId: 4,
  },
  {
    id: 'ach_stage_5',
    title: 'Создатель локации',
    description: 'Подготовил фон сцены 16:9 для своей игры',
    xpHint: '+10 XP за этап 5',
    stageId: 5,
  },
  {
    id: 'ach_stage_6',
    title: 'Художник героя',
    description: 'Собрал образ главного персонажа в едином стиле',
    xpHint: '+10 XP за этап 6',
    stageId: 6,
  },
  {
    id: 'ach_stage_7',
    title: 'Мастер прозрачности',
    description: 'Подготовил спрайт character.png без белого квадрата',
    xpHint: '+10 XP за этап 7',
    stageId: 7,
  },
  {
    id: 'ach_stage_8',
    title: 'Программист Pygame',
    description: 'Прошёл Python-квест и собрал код main.py',
    xpHint: '+10 XP за этап 8',
    stageId: 8,
  },
  {
    id: 'ach_stage_9',
    title: 'Охотник за багами',
    description: 'Проверил запуск и протестировал выборы игры',
    xpHint: '+10 XP за этап 9',
    stageId: 9,
  },
  {
    id: 'ach_stage_10',
    title: 'Создатель новеллы',
    description: 'Назвал игру, открыл главный сундук и получил сертификат',
    xpHint: '+10 XP за этап 10',
    stageId: 10,
  },
  {
    id: 'ach_bonus_1',
    title: 'Быстрый ум',
    description: 'Выполнил хотя бы один дополнительный мини-квест на экране ожидания',
    xpHint: '+5 XP за мини-квест',
    questRequiredCount: 1,
  },
  {
    id: 'ach_bonus_3',
    title: 'Спринтер приключения',
    description: 'Решил 3 и более дополнительных мини-квеста по игре и Python',
    xpHint: '+15 XP суммарно за квесты',
    questRequiredCount: 3,
  },
];

export const STAGE_XP_REWARD = 10;
export const QUEST_XP_REWARD = 5;

export function computeTotalXp(completedStages: number[], completedBonusQuests: string[]): number {
  const uniqueStages = Array.from(new Set(completedStages)).filter((id) => id >= 1 && id <= 10);
  const uniqueQuests = Array.from(new Set(completedBonusQuests));
  return uniqueStages.length * STAGE_XP_REWARD + uniqueQuests.length * QUEST_XP_REWARD;
}

export function computeEarnedAchievements(
  completedStages: number[],
  completedBonusQuests: string[]
): string[] {
  const uniqueStages = new Set(completedStages);
  const questCount = new Set(completedBonusQuests).size;

  return ACHIEVEMENTS_CATALOG.filter((ach) => {
    if (ach.stageId !== undefined) return uniqueStages.has(ach.stageId);
    if (ach.questRequiredCount !== undefined) return questCount >= ach.questRequiredCount;
    return false;
  }).map((a) => a.id);
}

export function computeUnlockedKeys(completedStages: number[]): string[] {
  const doneSet = new Set(completedStages);
  return STAGE_KEYS_CATALOG.filter((k) => doneSet.has(k.stageId)).map((k) => k.id);
}

export function getKeyForStage(stageId: number): StageKeyArtifact {
  return STAGE_KEYS_CATALOG.find((k) => k.stageId === stageId) || STAGE_KEYS_CATALOG[0];
}

export function getUnlockedChests(completedStages: number[]): MilestoneChest[] {
  const doneSet = new Set(completedStages);
  return CHESTS_CATALOG.filter((c) => doneSet.has(c.afterStage));
}

export function getReadyUnopenedChest(
  completedStages: number[],
  openedChests: string[]
): MilestoneChest | null {
  const openedSet = new Set(openedChests);
  return getUnlockedChests(completedStages).find((c) => !openedSet.has(c.id)) || null;
}

export interface StageRequirementResult {
  ready: boolean;
  missingReason: string;
}

export function getMaxUnlockedStage(state: LessonProgressState): number {
  const highestCompleted = state.completedStages.length > 0 ? Math.max(...state.completedStages) : 0;
  const highestCleared = state.teacherClearedStages.length > 0 ? Math.max(...state.teacherClearedStages) : 0;
  return Math.min(10, Math.max(state.currentStage, highestCompleted + 1, highestCleared + 1));
}

export function checkStageRequirements(
  stageId: number,
  state: LessonProgressState
): StageRequirementResult {
  switch (stageId) {
    case 1: {
      const checkedCount = state.stage1PythonChecked.length;
      if (checkedCount < 5) {
        return {
          ready: false,
          missingReason: `Ответь на мини-вопрос после каждого из 5 понятий (сейчас ${checkedCount} из 5)`,
        };
      }
      return { ready: true, missingReason: '' };
    }
    case 2: {
      if (!state.story.genre) {
        return { ready: false, missingReason: 'Выбери жанр своей будущей игры' };
      }
      if (!state.selectedArtStyle) {
        return { ready: false, missingReason: 'Выбери художественный стиль графики' };
      }
      return { ready: true, missingReason: '' };
    }
    case 3: {
      const s = state.story;
      if (!s.protagonist.trim() || !s.setting.trim()) {
        return { ready: false, missingReason: 'Задай место действия и главного героя' };
      }
      if (!s.choiceOne.trim() || !s.choiceTwo.trim() || !s.endingOne.trim() || !s.endingTwo.trim()) {
        return { ready: false, missingReason: 'Заполни оба выбора и оба финала на шаге развилки' };
      }
      if (s.choiceOne.trim().toLowerCase() === s.choiceTwo.trim().toLowerCase()) {
        return {
          ready: false,
          missingReason: 'Выбор 1 и Выбор 2 совпадают — сделай два разных решения для игрока',
        };
      }
      if (s.endingOne.trim().toLowerCase() === s.endingTwo.trim().toLowerCase()) {
        return {
          ready: false,
          missingReason: 'Финал 1 и Финал 2 совпадают — придумай две разные концовки',
        };
      }
      return { ready: true, missingReason: '' };
    }
    case 4: {
      const scenarioText = state.finalScenario || state.aiScriptResult;
      const promptText = state.scenarioPrompt || state.aiScriptPrompt;
      const validation = validateFinalScenario(scenarioText, promptText);
      if (!validation.isValid) {
        return {
          ready: false,
          missingReason: validation.missingSummary || 'Вставь готовый сценарий от ИИ со всеми 6 частями',
        };
      }
      return { ready: true, missingReason: '' };
    }
    case 5: {
      if (state.backgroundMode === 'generate') {
        if (!state.uploadedBackgroundDataUrl) {
          return {
            ready: false,
            missingReason: 'Загрузи свой фон 16:9 из Google Flow (или выбери подходящий в библиотеке)',
          };
        }
        return { ready: true, missingReason: '' };
      }

      const selectedBg = BACKGROUND_LIBRARY_CATALOG.find((b) => b.id === state.selectedLibraryBgId);
      const matchesSelected =
        selectedBg &&
        selectedBg.assetExists &&
        (!state.story.genre || selectedBg.genre === state.story.genre) &&
        selectedBg.style === state.selectedArtStyle;

      if (!matchesSelected && !state.uploadedBackgroundDataUrl) {
        return {
          ready: false,
          missingReason:
            'Выбери фон строго своего жанра и стиля или создай свой фон в Google Flow и загрузи его',
        };
      }
      return { ready: true, missingReason: '' };
    }
    case 6: {
      if (!state.character.name.trim()) {
        return { ready: false, missingReason: 'Укажи имя персонажа на шаге 1' };
      }
      if (!state.stage6PromptCopied && !state.uploadedCharacterRawDataUrl) {
        return {
          ready: false,
          missingReason: 'Скопируй промпт для Google Flow или загрузи картинку героя на шаге 4',
        };
      }
      return { ready: true, missingReason: '' };
    }
    case 7: {
      if (state.uploadedCharacterTransparentDataUrl) {
        if (state.uploadedCharacterHasTransparency === false) {
          return {
            ready: false,
            missingReason: 'В загруженном файле остался белый фон — удали его в PhotoRoom или подтверди подготовку',
          };
        }
        return { ready: true, missingReason: '' };
      }
      if (!state.stage7ConfirmedPng) {
        return {
          ready: false,
          missingReason: 'Проверь свой character.png или отметь, что файл уже сохранён в папку',
        };
      }
      return { ready: true, missingReason: '' };
    }
    case 8: {
      if (state.stage8QuizCorrectIds.length < 3) {
        return {
          ready: false,
          missingReason: `Пройди мини-тест Python на шаге 1 (нужно минимум 3 из 5, сейчас ${state.stage8QuizCorrectIds.length} из 5)`,
        };
      }
      if (!state.stage8PromptCopied) {
        return {
          ready: false,
          missingReason: 'Скопируй готовый промпт для main.py на шаге 2',
        };
      }
      return { ready: true, missingReason: '' };
    }
    case 9: {
      const checked = Object.values(state.testChecklist).filter(Boolean).length;
      if (checked < 3) {
        return {
          ready: false,
          missingReason: `Отметь минимум 3 пункта проверки игры (сейчас ${checked} из 3)`,
        };
      }
      return { ready: true, missingReason: '' };
    }
    case 10:
    default:
      return { ready: true, missingReason: '' };
  }
}

export function getMascotReactionForStage(
  stageId: number,
  isReady: boolean,
  isDone: boolean,
  options?: { hasStruggle?: boolean; hasError?: boolean; lastLine?: string }
): { emotion: MascotEmotion; line: string } {
  let context: 'enter' | 'action' | 'struggle' | 'success' | 'waiting' | 'error' = 'enter';
  if (options?.hasError) context = 'error';
  else if (isDone || isReady) context = 'success';
  else if (options?.hasStruggle) context = 'struggle';

  return {
    emotion: getEmotionForContext(context, stageId),
    line: pickCyberBotLine(stageId, context, options?.lastLine),
  };
}
