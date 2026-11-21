export interface ScenarioCheckItem {
  id: 'title' | 'intro' | 'dialogues' | 'choices' | 'ending1' | 'ending2';
  label: string;
  passed: boolean;
  hint: string;
}

export interface ScenarioValidationResult {
  isValid: boolean;
  isLikelyPromptPaste: boolean;
  checks: ScenarioCheckItem[];
  passedCount: number;
  missingSummary: string;
}

/**
 * Проверяет, что ученик вставил именно ГОТОВЫЙ сценарий от ИИ (finalScenario),
 * а не пустой текст или исходный промпт-инструкцию (scenarioPrompt).
 */
export function validateFinalScenario(
  rawText: string,
  initialPrompt = ''
): ScenarioValidationResult {
  const text = rawText.trim();
  const normalized = text.toLowerCase();

  // Detect if user accidentally pasted the prompt instructions instead of AI output
  const promptMarkers = [
    'строгие требования к формату ответа',
    'исходные параметры от автора',
    'ты — сценарист коротких визуальных новелл',
  ];
  const looksLikePromptTemplate =
    promptMarkers.some((m) => normalized.includes(m)) ||
    (initialPrompt.trim().length > 60 &&
      normalized.slice(0, 120) === initialPrompt.trim().toLowerCase().slice(0, 120));

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // 1. Название
  const hasTitle =
    !looksLikePromptTemplate &&
    (/(назван|заголовок|^\s*(1\.|#|«))/im.test(text) || (lines[0]?.length >= 3 && lines[0]?.length <= 80));

  // 2. Вступление / сцена
  const hasIntro =
    !looksLikePromptTemplate &&
    (/(вступлен|описани|сцена|начало|предыстор)/i.test(text) || text.length >= 160);

  // 3. Диалоги (реплики вида "Имя: текст" или тире в начале строки)
  const dialogueLines = lines.filter(
    (line) =>
      /^[А-ЯЁA-Z][А-ЯЁа-яёA-Za-z0-9\s_-]{1,24}:\s+\S+/.test(line) ||
      /^[—-]\s+\S+/.test(line)
  );
  const hasDialogues =
    !looksLikePromptTemplate &&
    (dialogueLines.length >= 2 || /диалог/i.test(text) && lines.length >= 5);

  // 4. Два различных выбора
  const hasChoice1 = /(вариант\s*1|выбор\s*1|кнопка\s*1|вариант\s*[aа]\b|выбор\s*[aа]\b)/i.test(text);
  const hasChoice2 = /(вариант\s*2|выбор\s*2|кнопка\s*2|вариант\s*[bб]\b|выбор\s*[bб]\b)/i.test(text);
  const hasChoices =
    !looksLikePromptTemplate &&
    ((hasChoice1 && hasChoice2) || /развилк/i.test(text) && lines.length >= 8);

  // 5. Первый финал
  const hasEnding1 =
    !looksLikePromptTemplate &&
    (/(финал\s*1|концовк[аи]\s*1|первый финал|финал\s*[aа]\b)/i.test(text) ||
      (text.match(/финал/gi)?.length || 0) >= 2);

  // 6. Второй финал
  const hasEnding2 =
    !looksLikePromptTemplate &&
    (/(финал\s*2|концовк[аи]\s*2|второй финал|финал\s*[bб]\b)/i.test(text) ||
      (text.match(/финал/gi)?.length || 0) >= 2);

  const checks: ScenarioCheckItem[] = [
    {
      id: 'title',
      label: 'Название игры',
      passed: hasTitle,
      hint: 'Добавь первую строку с рабочим названием от ИИ',
    },
    {
      id: 'intro',
      label: 'Вступление',
      passed: hasIntro,
      hint: 'Нужно короткое вступление (2–3 предложения, задающие сцену)',
    },
    {
      id: 'dialogues',
      label: 'Диалоги',
      passed: hasDialogues,
      hint: 'Нужны реплики формата «Имя: текст» (минимум 2–3 реплики)',
    },
    {
      id: 'choices',
      label: 'Два различных выбора',
      passed: hasChoices,
      hint: 'Укажи оба варианта выбора (Вариант 1 и Вариант 2)',
    },
    {
      id: 'ending1',
      label: 'Первый финал',
      passed: hasEnding1,
      hint: 'Добавь раздел «Финал 1» для первого выбора',
    },
    {
      id: 'ending2',
      label: 'Второй финал',
      passed: hasEnding2,
      hint: 'Добавь раздел «Финал 2» для второго выбора',
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const missing = checks.filter((c) => !c.passed).map((c) => c.label.toLowerCase());

  let missingSummary = '';
  if (looksLikePromptTemplate) {
    missingSummary = 'Похоже, ты вставил текст промпта-задания вместо ответа нейросети. Вставь готовый сценарий от DeepSeek или Qwen!';
  } else if (text.length < 120) {
    missingSummary = 'Вставь полный готовый сценарий от нейросети (название, вступление, диалоги, 2 выбора и 2 финала)';
  } else if (missing.length > 0) {
    missingSummary = `В сценарии не хватает: ${missing.join(', ')}`;
  }

  return {
    isValid: !looksLikePromptTemplate && text.length >= 120 && passedCount === checks.length,
    isLikelyPromptPaste: looksLikePromptTemplate,
    checks,
    passedCount,
    missingSummary,
  };
}
