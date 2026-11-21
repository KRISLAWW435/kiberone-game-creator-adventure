import { useCallback, useEffect, useState } from 'react';
import type {
  ArtStyleId,
  BackgroundPromptDesign,
  CharacterDesign,
  CharacterTypeId,
  LessonProgressState,
  ReflectionAnswers,
  ShowcaseChecklistState,
  StoryDesign,
  TestChecklistState,
} from '../types/lesson';
import {
  CHESTS_CATALOG,
  computeEarnedAchievements,
  computeTotalXp,
  computeUnlockedKeys,
} from '../utils/gamification';
import { recordDiagnosticError } from '../utils/diagnostics';

const STORAGE_KEY = 'kiberone_vibe_coding_lab_v1';
const VALID_ART_STYLES: ArtStyleId[] = ['anime', 'pixel', 'stylized3d', 'comic', 'cinematic', 'handdrawn'];

export function createInitialLessonState(): LessonProgressState {
  return {
    version: 3,
    studentName: '',
    currentStage: 1,
    completedStages: [],
    teacherClearedStages: [],
    xp: 0,
    selectedArtStyle: 'anime',
    unlockedKeys: [],
    openedChests: [],
    claimedStickers: [],
    seenMemes: [],
    completedBonusQuests: [],
    earnedAchievements: [],
    stage1QuestionAnswer: '',
    stage1PythonChecked: [],
    stage1ConceptAnswers: {},
    stage2InspectedIds: [],
    story: {
      gameTitle: '',
      genre: '',
      setting: '',
      atmosphere: '',
      protagonist: '',
      protagonistType: '',
      protagonistRole: '',
      problem: '',
      goal: '',
      unusualEvent: '',
      choiceOne: '',
      choiceTwo: '',
      endingOne: '',
      endingTwo: '',
      customIdea: '',
    },
    scenarioPrompt: '',
    finalScenario: '',
    aiScriptPrompt: '',
    aiScriptResult: '',
    stage4PromptCopied: false,
    backgroundMode: 'library',
    selectedLibraryBgId: '',
    backgroundPromptDesign: {
      location: '',
      timeOfDay: 'Вечер на закате',
      weather: 'Ясно',
      atmosphere: '',
      keyObjects: '',
      artStyle: 'anime',
      colorPalette: 'Бирюзовый, тёмно-синий и тёплый золотой свет',
      extraDetails: '',
    },
    backgroundCustomPrompt: '',
    uploadedBackgroundDataUrl: '',
    uploadedBackgroundName: '',
    character: {
      name: '',
      characterType: undefined,
      role: '',
      gender: '',
      age: '14 лет',
      hairstyle: '',
      hairColor: '',
      eyeColor: '',
      headShape: '',
      antennas: '',
      sensorPanel: '',
      optics: '',
      bodyLights: '',
      creatureFeatures: '',
      creatureCoat: '',
      clothing: '',
      accessories: '',
      specialFeature: '',
      personality: '',
      artStyle: 'anime',
    },
    characterCustomPrompt: '',
    stage6PromptCopied: false,
    uploadedCharacterRawDataUrl: '',
    uploadedCharacterTransparentDataUrl: '',
    uploadedCharacterHasTransparency: null,
    stage7ConfirmedPng: false,
    stage8QuizCorrectIds: [],
    stage8PromptCopied: false,
    pythonCodePrompt: '',
    testChecklist: {
      projectRuns: false,
      backgroundVisible: false,
      characterVisible: false,
      russianTextReadable: false,
      dialoguesSwitch: false,
      choiceOneWorks: false,
      choiceTwoWorks: false,
      endingsDiffer: false,
      restartsCleanly: false,
    },
    consoleErrorInput: '',
    showcaseChecklist: {
      createdStory: false,
      pickedBackground: false,
      createdCharacter: false,
      preparedTransparentPng: false,
      generatedPythonCode: false,
      launchedGame: false,
      testedChoices: false,
    },
    reflection: {
      likedMost: '',
      hardestPart: '',
      nextFeature: '',
    },
    teacherCustomNotes: {},
    updatedAt: new Date().toISOString(),
  };
}

function hydrateState(parsed: Partial<LessonProgressState>): LessonProgressState {
  const fallback = createInitialLessonState();
  const safeParsed =
    parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};

  const rawStage = typeof safeParsed.currentStage === 'number' && Number.isFinite(safeParsed.currentStage)
    ? Math.round(safeParsed.currentStage)
    : 1;
  const currentStage = Math.max(1, Math.min(10, rawStage));

  const completedStages = Array.isArray(safeParsed.completedStages)
    ? Array.from(new Set(safeParsed.completedStages)).filter(
        (n): n is number => typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= 10
      )
    : [];
  const completedBonusQuests = Array.isArray(safeParsed.completedBonusQuests)
    ? Array.from(new Set(safeParsed.completedBonusQuests)).filter((q): q is string => typeof q === 'string')
    : [];

  const candidateStyle =
    safeParsed.selectedArtStyle ||
    safeParsed.character?.artStyle ||
    safeParsed.backgroundPromptDesign?.artStyle;
  const selectedArtStyle: ArtStyleId =
    candidateStyle && VALID_ART_STYLES.includes(candidateStyle)
      ? candidateStyle
      : fallback.selectedArtStyle;

  const unlockedKeys = computeUnlockedKeys(completedStages);
  const completedSet = new Set(completedStages);
  const validChestById = new Map(CHESTS_CATALOG.map((c) => [c.id, c]));
  const openedChests = Array.isArray(safeParsed.openedChests)
    ? Array.from(new Set(safeParsed.openedChests)).filter((c): c is string => {
        if (typeof c !== 'string') return false;
        const chest = validChestById.get(c);
        return Boolean(chest && completedSet.has(chest.afterStage));
      })
    : [];
  const allowedStickers = new Set(
    openedChests.map((id) => validChestById.get(id)?.stickerId).filter(Boolean)
  );
  const claimedStickers = Array.isArray(safeParsed.claimedStickers)
    ? Array.from(new Set(safeParsed.claimedStickers)).filter(
        (s): s is string => typeof s === 'string' && allowedStickers.has(s)
      )
    : [];

  const safeStory =
    safeParsed.story && typeof safeParsed.story === 'object' ? safeParsed.story : {};
  const safeBgDesign =
    safeParsed.backgroundPromptDesign && typeof safeParsed.backgroundPromptDesign === 'object'
      ? safeParsed.backgroundPromptDesign
      : {};
  const safeCharacter =
    safeParsed.character && typeof safeParsed.character === 'object' ? safeParsed.character : {};

  const inferCharacterType = (charObj: Partial<CharacterDesign>): CharacterTypeId | undefined => {
    if (
      charObj.characterType &&
      ['girl', 'boy', 'robot', 'creature', 'custom'].includes(charObj.characterType)
    ) {
      return charObj.characterType;
    }
    const rawGender = (charObj.gender || '').toLowerCase();
    if (rawGender.includes('девушк')) return 'girl';
    if (rawGender.includes('парен')) return 'boy';
    if (rawGender.includes('робот')) return 'robot';
    if (rawGender.includes('существ')) return 'creature';
    if (rawGender.trim()) return 'custom';
    return undefined;
  };

  return {
    ...fallback,
    ...safeParsed,
    currentStage,
    selectedArtStyle,
    backgroundMode: safeParsed.backgroundMode === 'generate' ? 'generate' : 'library',
    completedStages,
    teacherClearedStages: Array.isArray(safeParsed.teacherClearedStages)
      ? Array.from(new Set(safeParsed.teacherClearedStages)).filter(
          (n): n is number => typeof n === 'number' && n >= 1 && n <= 10
        )
      : [],
    completedBonusQuests,
    unlockedKeys,
    openedChests,
    claimedStickers,
    seenMemes: Array.isArray(safeParsed.seenMemes)
      ? Array.from(new Set(safeParsed.seenMemes)).filter((m): m is string => typeof m === 'string')
      : [],
    xp: computeTotalXp(completedStages, completedBonusQuests),
    earnedAchievements: computeEarnedAchievements(completedStages, completedBonusQuests),
    stage1PythonChecked: Array.isArray(safeParsed.stage1PythonChecked)
      ? safeParsed.stage1PythonChecked.filter((x): x is string => typeof x === 'string')
      : [],
    stage1ConceptAnswers:
      safeParsed.stage1ConceptAnswers &&
      typeof safeParsed.stage1ConceptAnswers === 'object' &&
      !Array.isArray(safeParsed.stage1ConceptAnswers)
        ? safeParsed.stage1ConceptAnswers
        : {},
    scenarioPrompt:
      typeof (safeParsed.scenarioPrompt ?? safeParsed.aiScriptPrompt) === 'string'
        ? (safeParsed.scenarioPrompt ?? safeParsed.aiScriptPrompt ?? '')
        : '',
    finalScenario:
      typeof (safeParsed.finalScenario ?? safeParsed.aiScriptResult) === 'string'
        ? (safeParsed.finalScenario ?? safeParsed.aiScriptResult ?? '')
        : '',
    aiScriptPrompt:
      typeof (safeParsed.scenarioPrompt ?? safeParsed.aiScriptPrompt) === 'string'
        ? (safeParsed.scenarioPrompt ?? safeParsed.aiScriptPrompt ?? '')
        : '',
    aiScriptResult:
      typeof (safeParsed.finalScenario ?? safeParsed.aiScriptResult) === 'string'
        ? (safeParsed.finalScenario ?? safeParsed.aiScriptResult ?? '')
        : '',
    stage2InspectedIds: Array.isArray(safeParsed.stage2InspectedIds)
      ? safeParsed.stage2InspectedIds.filter((x): x is string => typeof x === 'string')
      : [],
    stage8QuizCorrectIds: Array.isArray(safeParsed.stage8QuizCorrectIds)
      ? safeParsed.stage8QuizCorrectIds.filter((x): x is string => typeof x === 'string')
      : [],
    story: { ...fallback.story, ...safeStory },
    backgroundPromptDesign: {
      ...fallback.backgroundPromptDesign,
      ...safeBgDesign,
      artStyle: selectedArtStyle,
    },
    character: {
      ...fallback.character,
      ...safeCharacter,
      characterType: inferCharacterType(safeCharacter),
      artStyle: selectedArtStyle,
    },
    testChecklist: {
      ...fallback.testChecklist,
      ...(safeParsed.testChecklist && typeof safeParsed.testChecklist === 'object' ? safeParsed.testChecklist : {}),
    },
    showcaseChecklist: {
      ...fallback.showcaseChecklist,
      ...(safeParsed.showcaseChecklist && typeof safeParsed.showcaseChecklist === 'object'
        ? safeParsed.showcaseChecklist
        : {}),
    },
    reflection: {
      ...fallback.reflection,
      ...(safeParsed.reflection && typeof safeParsed.reflection === 'object' ? safeParsed.reflection : {}),
    },
    teacherCustomNotes:
      safeParsed.teacherCustomNotes &&
      typeof safeParsed.teacherCustomNotes === 'object' &&
      !Array.isArray(safeParsed.teacherCustomNotes)
        ? safeParsed.teacherCustomNotes
        : {},
  };
}

function safeLoadFromStorage(): LessonProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialLessonState();
    const parsed = JSON.parse(raw) as Partial<LessonProgressState>;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      recordDiagnosticError('storage', 'Повреждённый формат сохранения в localStorage; использовано начальное состояние.');
      return createInitialLessonState();
    }
    return hydrateState(parsed);
  } catch (err) {
    recordDiagnosticError(
      'storage',
      'Не удалось прочитать сохранение в localStorage; приложение запущено с чистого состояния.',
      err instanceof Error ? err.message : String(err)
    );
    return createInitialLessonState();
  }
}

export function useLessonState() {
  const [state, setState] = useState<LessonProgressState>(() => safeLoadFromStorage());

  useEffect(() => {
    const hasMeaningfulState =
      state.completedStages.length > 0 ||
      state.xp > 0 ||
      state.currentStage > 1 ||
      state.stage1PythonChecked.length > 0 ||
      Object.keys(state.stage1ConceptAnswers || {}).length > 0 ||
      Boolean(
        state.studentName.trim() ||
          state.story.gameTitle.trim() ||
          state.story.genre ||
          state.story.setting.trim() ||
          state.story.protagonist.trim() ||
          state.finalScenario.trim() ||
          state.character.name.trim()
      );

    try {
      if (!hasMeaningfulState) {
        if (!localStorage.getItem(STORAGE_KEY)) return;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      recordDiagnosticError(
        'storage',
        'Не удалось сохранить прогресс в localStorage (возможно, превышена квота).',
        err instanceof Error ? err.message : String(err)
      );
    }
  }, [state]);

  const updateState = useCallback((updater: (prev: LessonProgressState) => LessonProgressState) => {
    setState((prev) => {
      const next = updater(prev);
      return {
        ...next,
        xp: computeTotalXp(next.completedStages, next.completedBonusQuests),
        earnedAchievements: computeEarnedAchievements(next.completedStages, next.completedBonusQuests),
        unlockedKeys: computeUnlockedKeys(next.completedStages),
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const patchState = useCallback(
    (patch: Partial<LessonProgressState>) => {
      updateState((prev) => {
        const merged = { ...prev, ...patch };
        if (patch.scenarioPrompt !== undefined && patch.aiScriptPrompt === undefined) {
          merged.aiScriptPrompt = patch.scenarioPrompt;
        } else if (patch.aiScriptPrompt !== undefined && patch.scenarioPrompt === undefined) {
          merged.scenarioPrompt = patch.aiScriptPrompt;
        }
        if (patch.finalScenario !== undefined && patch.aiScriptResult === undefined) {
          merged.aiScriptResult = patch.finalScenario;
        } else if (patch.aiScriptResult !== undefined && patch.finalScenario === undefined) {
          merged.finalScenario = patch.aiScriptResult;
        }
        return merged;
      });
    },
    [updateState]
  );

  const setCurrentStage = useCallback(
    (stageId: number) => {
      const clamped = Math.max(1, Math.min(10, stageId));
      updateState((prev) => ({ ...prev, currentStage: clamped }));
    },
    [updateState]
  );

  /** Глобальная смена стиля графики на этапе 2 — обновляет промпты, сохраняя загруженные изображения */
  const selectGlobalStyle = useCallback(
    (styleId: ArtStyleId) => {
      updateState((prev) => ({
        ...prev,
        selectedArtStyle: styleId,
        backgroundPromptDesign: {
          ...prev.backgroundPromptDesign,
          artStyle: styleId,
        },
        character: {
          ...prev.character,
          artStyle: styleId,
        },
      }));
    },
    [updateState]
  );

  /** Помечает этап завершённым и начисляет +10 XP и Ключ строго один раз */
  const completeStage = useCallback(
    (stageId: number): { newlyCompleted: boolean } => {
      let newlyCompleted = false;
      updateState((prev) => {
        if (prev.completedStages.includes(stageId)) {
          return prev;
        }
        newlyCompleted = true;
        return {
          ...prev,
          completedStages: [...prev.completedStages, stageId],
        };
      });
      return { newlyCompleted };
    },
    [updateState]
  );

  /** Открывает сундук награды строго один раз и только после завершения нужного этапа */
  const openChest = useCallback(
    (chestId: string) => {
      const chest = CHESTS_CATALOG.find((c) => c.id === chestId);
      if (!chest) return;
      updateState((prev) => {
        if (!prev.completedStages.includes(chest.afterStage)) {
          return prev;
        }
        const nextChests = prev.openedChests.includes(chestId)
          ? prev.openedChests
          : [...prev.openedChests, chestId];
        const nextStickers = prev.claimedStickers.includes(chest.stickerId)
          ? prev.claimedStickers
          : [...prev.claimedStickers, chest.stickerId];
        return {
          ...prev,
          openedChests: nextChests,
          claimedStickers: nextStickers,
        };
      });
    },
    [updateState]
  );

  /** Подтверждение преподавателя и переход к следующему уровню */
  const markTeacherClearedAndAdvance = useCallback(
    (stageId: number) => {
      updateState((prev) => {
        const nextCompleted = prev.completedStages.includes(stageId)
          ? prev.completedStages
          : [...prev.completedStages, stageId];
        const nextCleared = prev.teacherClearedStages.includes(stageId)
          ? prev.teacherClearedStages
          : [...prev.teacherClearedStages, stageId];
        const nextStage = stageId < 10 ? stageId + 1 : 10;
        return {
          ...prev,
          completedStages: nextCompleted,
          teacherClearedStages: nextCleared,
          currentStage: nextStage,
        };
      });
    },
    [updateState]
  );

  /** Бонусный квест: +5 XP начисляется строго один раз */
  const completeBonusQuest = useCallback(
    (questId: string) => {
      updateState((prev) => {
        if (prev.completedBonusQuests.includes(questId)) return prev;
        return {
          ...prev,
          completedBonusQuests: [...prev.completedBonusQuests, questId],
        };
      });
    },
    [updateState]
  );

  const updateStory = useCallback(
    (patch: Partial<StoryDesign>) => {
      updateState((prev) => ({
        ...prev,
        story: { ...prev.story, ...patch },
      }));
    },
    [updateState]
  );

  const updateBackgroundPromptDesign = useCallback(
    (patch: Partial<BackgroundPromptDesign>) => {
      updateState((prev) => ({
        ...prev,
        backgroundPromptDesign: { ...prev.backgroundPromptDesign, ...patch },
      }));
    },
    [updateState]
  );

  const updateCharacter = useCallback(
    (patch: Partial<CharacterDesign>) => {
      updateState((prev) => ({
        ...prev,
        character: { ...prev.character, ...patch },
      }));
    },
    [updateState]
  );

  const updateTestChecklist = useCallback(
    (patch: Partial<TestChecklistState>) => {
      updateState((prev) => ({
        ...prev,
        testChecklist: { ...prev.testChecklist, ...patch },
      }));
    },
    [updateState]
  );

  const updateShowcaseChecklist = useCallback(
    (patch: Partial<ShowcaseChecklistState>) => {
      updateState((prev) => ({
        ...prev,
        showcaseChecklist: { ...prev.showcaseChecklist, ...patch },
      }));
    },
    [updateState]
  );

  const updateReflection = useCallback(
    (patch: Partial<ReflectionAnswers>) => {
      updateState((prev) => ({
        ...prev,
        reflection: { ...prev.reflection, ...patch },
      }));
    },
    [updateState]
  );

  const updateTeacherNote = useCallback(
    (stageId: number, note: string) => {
      updateState((prev) => ({
        ...prev,
        teacherCustomNotes: { ...prev.teacherCustomNotes, [stageId]: note },
      }));
    },
    [updateState]
  );

  const resetAllProgress = useCallback(() => {
    const fresh = createInitialLessonState();
    setState(fresh);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const exportProgressJson = useCallback(() => {
    const payload = JSON.stringify(state, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = (state.story.gameTitle || 'vibe_novel_progress')
      .toLowerCase()
      .replace(/[^a-zа-яё0-9_-]+/gi, '_')
      .slice(0, 32);
    link.href = url;
    link.download = `${safeName || 'kiberone_progress'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }, [state]);

  const importProgressJson = useCallback((jsonText: string): { ok: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonText) as Partial<LessonProgressState>;
      if (!parsed || typeof parsed !== 'object' || typeof parsed.currentStage !== 'number') {
        return { ok: false, error: 'Файл не похож на сохранение KIBERONE GAME CREATOR.' };
      }
      setState({
        ...hydrateState(parsed),
        updatedAt: new Date().toISOString(),
      });
      return { ok: true };
    } catch {
      return { ok: false, error: 'Не удалось прочитать JSON-файл. Проверь, что файл не повреждён.' };
    }
  }, []);

  const hasSavedProgress =
    state.xp > 0 || state.unlockedKeys.length > 0 || state.completedStages.length > 0;

  return {
    state,
    hasSavedProgress,
    updateState,
    patchState,
    setCurrentStage,
    selectGlobalStyle,
    completeStage,
    openChest,
    markTeacherClearedAndAdvance,
    completeBonusQuest,
    updateStory,
    updateBackgroundPromptDesign,
    updateCharacter,
    updateTestChecklist,
    updateShowcaseChecklist,
    updateReflection,
    updateTeacherNote,
    resetAllProgress,
    exportProgressJson,
    importProgressJson,
  };
}
