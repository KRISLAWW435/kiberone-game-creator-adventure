import { useState } from 'react';
import { ModeSelector } from './components/ModeSelector';
import { StudentWorkspace } from './components/StudentWorkspace';
import { TeacherDashboard } from './components/TeacherDashboard';
import { TopBar } from './components/TopBar';
import { useLessonState } from './hooks/useLessonState';
import type { AppMode } from './types/lesson';
import { getMaxUnlockedStage } from './utils/gamification';

export default function App() {
  const [mode, setMode] = useState<AppMode>('select');
  const {
    state,
    hasSavedProgress,
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
  } = useLessonState();

  const maxUnlockedStage = getMaxUnlockedStage(state);

  return (
    <div className="min-h-screen flex flex-col bg-lab-grid text-[#26313B] overflow-x-hidden">
      <TopBar
        mode={mode}
        onSelectMode={setMode}
        onExportJson={exportProgressJson}
        hasSavedProgress={hasSavedProgress}
        currentStage={state.currentStage}
        completedCount={state.completedStages.length}
        xp={state.xp}
      />

      <div className="flex-1">
        {mode === 'select' && (
          <ModeSelector
            hasSavedProgress={hasSavedProgress}
            currentStage={state.currentStage}
            completedStages={state.completedStages}
            maxUnlockedStage={maxUnlockedStage}
            xp={state.xp}
            unlockedKeysCount={state.unlockedKeys.length}
            unlockedKeys={state.unlockedKeys}
            earnedAchievements={state.earnedAchievements}
            openedChests={state.openedChests}
            claimedStickers={state.claimedStickers}
            onSelectMode={setMode}
            onJumpToStage={setCurrentStage}
            onResetProgress={resetAllProgress}
          />
        )}

        {mode === 'student' && (
          <StudentWorkspace
            state={state}
            onUpdate={patchState}
            onSetStage={setCurrentStage}
            onSelectGlobalStyle={selectGlobalStyle}
            onCompleteStage={completeStage}
            onOpenChest={openChest}
            onTeacherClearedAdvance={markTeacherClearedAndAdvance}
            onCompleteBonusQuest={completeBonusQuest}
            onUpdateStory={updateStory}
            onUpdateBgPrompt={updateBackgroundPromptDesign}
            onUpdateCharacter={updateCharacter}
            onUpdateTestChecklist={updateTestChecklist}
            onUpdateShowcaseChecklist={updateShowcaseChecklist}
            onUpdateReflection={updateReflection}
          />
        )}

        {mode === 'teacher' && (
          <TeacherDashboard
            state={state}
            onUpdateTeacherNote={updateTeacherNote}
            onExportJson={exportProgressJson}
            onImportJson={importProgressJson}
          />
        )}
      </div>
    </div>
  );
}
