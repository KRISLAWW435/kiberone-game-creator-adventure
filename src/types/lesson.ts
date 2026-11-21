export type AppMode = 'select' | 'student' | 'teacher';

export type GenreId = 'fantasy' | 'mystery' | 'scifi' | 'adventure' | 'modern';

export type ArtStyleId = 'anime' | 'stylized3d' | 'pixel' | 'comic' | 'cinematic' | 'handdrawn';

export type MascotEmotion = 'joy' | 'surprise' | 'thinking' | 'support' | 'victory';

export interface StoryDesign {
  gameTitle: string;
  genre: GenreId | '';
  setting: string;
  atmosphere: string;
  protagonist: string;
  problem: string;
  goal: string;
  unusualEvent: string;
  choiceOne: string;
  choiceTwo: string;
  endingOne: string;
  endingTwo: string;
  customIdea: string;
}

export interface BackgroundPromptDesign {
  location: string;
  timeOfDay: string;
  weather: string;
  atmosphere: string;
  keyObjects: string;
  artStyle: ArtStyleId;
  colorPalette: string;
  extraDetails: string;
}

export interface CharacterDesign {
  name: string;
  role: string;
  gender: string;
  age: string;
  hairstyle: string;
  hairColor: string;
  eyeColor: string;
  clothing: string;
  accessories: string;
  specialFeature: string;
  personality: string;
  artStyle: ArtStyleId;
}

export interface TestChecklistState {
  projectRuns: boolean;
  backgroundVisible: boolean;
  characterVisible: boolean;
  russianTextReadable: boolean;
  dialoguesSwitch: boolean;
  choiceOneWorks: boolean;
  choiceTwoWorks: boolean;
  endingsDiffer: boolean;
  restartsCleanly: boolean;
}

export interface ShowcaseChecklistState {
  createdStory: boolean;
  pickedBackground: boolean;
  createdCharacter: boolean;
  preparedTransparentPng: boolean;
  generatedPythonCode: boolean;
  launchedGame: boolean;
  testedChoices: boolean;
}

export interface ReflectionAnswers {
  likedMost: string;
  hardestPart: string;
  nextFeature: string;
}

export interface LessonProgressState {
  version: number;
  studentName: string;
  currentStage: number; // 1..10
  completedStages: number[];
  teacherClearedStages: number[];
  xp: number;
  selectedArtStyle: ArtStyleId;
  unlockedKeys: string[];
  openedChests: string[];
  claimedStickers: string[];
  seenMemes: string[];
  completedBonusQuests: string[];
  earnedAchievements: string[];
  stage1QuestionAnswer: string;
  stage1PythonChecked: string[];
  stage1ConceptAnswers: Record<string, string>;
  stage2InspectedIds: string[];
  story: StoryDesign;
  scenarioPrompt: string;
  finalScenario: string;
  aiScriptPrompt: string;
  aiScriptResult: string;
  stage4PromptCopied: boolean;
  backgroundMode: 'library' | 'generate';
  selectedLibraryBgId: string;
  backgroundPromptDesign: BackgroundPromptDesign;
  backgroundCustomPrompt: string;
  uploadedBackgroundDataUrl: string;
  uploadedBackgroundName: string;
  character: CharacterDesign;
  characterCustomPrompt: string;
  stage6PromptCopied: boolean;
  uploadedCharacterRawDataUrl: string;
  uploadedCharacterTransparentDataUrl: string;
  uploadedCharacterHasTransparency: boolean | null;
  stage7ConfirmedPng: boolean;
  stage8QuizCorrectIds: string[];
  stage8PromptCopied: boolean;
  pythonCodePrompt: string;
  testChecklist: TestChecklistState;
  consoleErrorInput: string;
  showcaseChecklist: ShowcaseChecklistState;
  reflection: ReflectionAnswers;
  teacherCustomNotes: Record<number, string>;
  updatedAt: string;
}

export interface StageDefinition {
  id: number;
  code: string;
  shortTitle: string;
  locationName: string;
  title: string;
  recommendedMinutes: number;
  guideMessage: string;
  rewardBadge: string;
  whatToDo: string;
  whereToDo: string;
  howToKnowDone: string;
  hint: string;
  troubleshooting: {
    symptom: string;
    steps: string[];
  };
  exampleTitle: string;
  exampleSummary: string;
  teacherSlide: {
    headline: string;
    keyPoints: string[];
    discussionQuestions: string[];
    methodNote: string;
    demoVisualType:
      | 'vibe'
      | 'vn-anatomy'
      | 'story'
      | 'prompt'
      | 'background'
      | 'character'
      | 'photoroom'
      | 'pygame'
      | 'debug'
      | 'showcase';
  };
}
