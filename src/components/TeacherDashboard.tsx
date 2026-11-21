import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  HardDrive,
  MessageSquare,
  NotebookPen,
  Pause,
  Play,
  RotateCcw,
  Upload,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ART_STYLE_CARDS, GENRE_CARDS, VN_DEMO_SCENE_PATH } from '../config/mediaAssets';
import { LESSON_STAGES, RESERVE_MINUTES, TOTAL_LESSON_MINUTES } from '../data/lessonStages';
import type { LessonProgressState, StageDefinition } from '../types/lesson';
import { SafeImage } from './common/SafeImage';

interface TeacherDashboardProps {
  state: LessonProgressState;
  onUpdateTeacherNote: (stageId: number, note: string) => void;
  onExportJson: () => void;
  onImportJson: (text: string) => { ok: boolean; error?: string };
}

const TOTAL_SECONDS = TOTAL_LESSON_MINUTES * 60;

export function TeacherDashboard({
  state,
  onUpdateTeacherNote,
  onExportJson,
  onImportJson,
}: TeacherDashboardProps) {
  const [activeStageId, setActiveStageId] = useState<number>(state.currentStage || 1);
  const [secondsLeft, setSecondsLeft] = useState<number>(TOTAL_SECONDS);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      const result = onImportJson(text);
      if (result.ok) {
        setImportStatus({ type: 'ok', msg: 'Резервная копия прогресса успешно загружена!' });
      } else {
        setImportStatus({ type: 'err', msg: result.error || 'Не удалось загрузить JSON-файл.' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  useEffect(() => {
    if (!timerRunning) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerRunning]);

  const activeStage = LESSON_STAGES.find((s) => s.id === activeStageId) || LESSON_STAGES[0];
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const elapsedMinutes = Math.floor((TOTAL_SECONDS - secondsLeft) / 60);

  return (
    <main className="max-w-[1380px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Teacher Control Bar: 60-min Timer + Stage Timeline */}
      <section className="bg-white border border-slate-200/90 text-[#26313B] rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-slate-100">
          <div>
            <p className="text-xs font-extrabold text-[#04959A] mb-1">
              Режим преподавателя · Экран для доски и проектора
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#26313B]">
              KIBERONE GAME CREATOR · План 60 минут
            </h1>
          </div>

          {/* 60-minute Lesson Timer */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 shrink-0">
            <div className="flex items-center gap-2.5 pr-2">
              <Clock className="w-5 h-5 text-[#06B8BE]" />
              <div>
                <p className="text-[11px] font-semibold text-slate-500 leading-none mb-1">Таймер урока</p>
                <p
                  className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums leading-none ${
                    secondsLeft === 0 ? 'text-rose-600' : 'text-[#26313B]'
                  }`}
                >
                  {formattedTime}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTimerRunning((r) => !r)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#06B8BE] hover:bg-[#04959A] text-white text-xs font-extrabold transition-colors cursor-pointer whitespace-nowrap"
              >
                {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{timerRunning ? 'Пауза' : 'Старт'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTimerRunning(false);
                  setSecondsLeft(TOTAL_SECONDS);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#26313B] text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Сброс</span>
              </button>
            </div>
          </div>
        </div>

        {/* Fast Stage Switcher Timeline */}
        <div className="pt-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2.5">
            <span>Быстрый переход по этапам (55 мин + {RESERVE_MINUTES} мин резерв)</span>
            <span className="tabular-nums">Прошло урока: {elapsedMinutes} мин</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
            {LESSON_STAGES.map((s) => {
              const isActive = s.id === activeStageId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveStageId(s.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#F4C914] text-[#26313B] border-[#F4C914] shadow-xs'
                      : 'bg-slate-50 hover:bg-cyan-50/70 text-[#26313B] border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold mb-0.5 tabular-nums">
                    <span>Этап {s.id}</span>
                    <span>{s.recommendedMinutes} м</span>
                  </div>
                  <p className="text-xs font-bold truncate">{s.shortTitle}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Projector Slide + Teacher Notes Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <p className="text-sm font-extrabold text-[#04959A]">
                Этап {activeStage.id} из 10 · {activeStage.code} · {activeStage.recommendedMinutes} минут
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#26313B] mt-1 text-balance">
                {activeStage.teacherSlide.headline}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveStageId((p) => Math.max(1, p - 1))}
                disabled={activeStageId === 1}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[#26313B] disabled:opacity-40 cursor-pointer"
                aria-label="Предыдущий этап"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveStageId((p) => Math.min(10, p + 1))}
                disabled={activeStageId === 10}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[#26313B] disabled:opacity-40 cursor-pointer"
                aria-label="Следующий этап"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <ul className="space-y-3">
            {activeStage.teacherSlide.keyPoints.map((point, idx) => (
              <li
                key={point}
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-base sm:text-lg text-[#26313B] leading-snug"
              >
                <span className="w-7 h-7 rounded-lg bg-[#06B8BE] text-white text-sm font-extrabold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                  {idx + 1}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <TeacherDemoVisual stage={activeStage} />
        </section>

        <aside className="lg:col-span-4 space-y-5">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-3 shadow-xs">
            <h3 className="text-base font-extrabold text-[#26313B] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#06B8BE]" />
              <span>Вопросы для обсуждения</span>
            </h3>
            <ul className="space-y-2.5">
              {activeStage.teacherSlide.discussionQuestions.map((q) => (
                <li
                  key={q}
                  className="p-3.5 rounded-2xl bg-cyan-50/70 border border-[#06B8BE]/25 text-sm font-medium text-[#26313B] leading-relaxed"
                >
                  {q}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-50 border border-[#F4C914]/70 rounded-3xl p-5 space-y-1.5">
            <p className="text-xs font-extrabold text-amber-800">Заметка методиста на этот этап</p>
            <p className="text-sm text-amber-950 leading-relaxed">{activeStage.teacherSlide.methodNote}</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 space-y-2.5 shadow-xs">
            <label className="flex items-center gap-2 text-sm font-extrabold text-[#26313B]">
              <NotebookPen className="w-4 h-4 text-[#06B8BE]" />
              <span>Мои заметки преподавателя (Этап {activeStage.id})</span>
            </label>
            <textarea
              rows={4}
              value={state.teacherCustomNotes[activeStage.id] || ''}
              onChange={(e) => onUpdateTeacherNote(activeStage.id, e.target.value)}
              placeholder="Запиши сюда пометки по классу, таймингу или идеям учеников..."
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-[#26313B] placeholder:text-slate-400 focus:outline-none focus:border-[#06B8BE]"
            />
          </div>

          {/* Teacher-Only JSON Progress Backup */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 space-y-3 shadow-xs">
            <h3 className="text-sm font-extrabold text-[#26313B] flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#04959A]" />
              <span>Резервная копия проекта (JSON)</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Служебный экспорт и импорт для переноса работы ученика между компьютерами.
            </p>
            {importStatus && (
              <p
                className={`text-xs font-bold ${
                  importStatus.type === 'ok' ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {importStatus.msg}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onExportJson}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-[#26313B] cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 text-[#04959A]" />
                <span>Экспорт JSON</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-[#26313B] cursor-pointer whitespace-nowrap"
              >
                <Upload className="w-3.5 h-3.5 text-amber-500" />
                <span>Импорт JSON</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function TeacherDemoVisual({ stage }: { stage: StageDefinition }) {
  const type = stage.teacherSlide.demoVisualType;

  if (type === 'vibe') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { cmd: 'print("Привет!")', desc: 'Вывод текста на экран' },
          { cmd: 'x = input("Имя: ")', desc: 'Получение ответа игрока' },
          { cmd: 'if x == "1": ...', desc: 'Ветвление сюжета по условию' },
        ].map((c) => (
          <div key={c.cmd} className="rounded-2xl bg-[#26313B] text-white p-4">
            <code className="font-mono text-sm font-bold text-[#F4C914] block mb-1">{c.cmd}</code>
            <p className="text-xs text-slate-300">{c.desc}</p>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'vn-anatomy' || type === 'background') {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-900">
        <SafeImage
          src={VN_DEMO_SCENE_PATH}
          alt="Демонстрационная сцена визуальной новеллы"
          fallbackTitle="Демо-сцена новеллы"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-[#26313B]/92 border border-white/20 p-4 text-white">
          <p className="text-xs font-bold text-[#F4C914] mb-0.5">Слой интерфейса: Диалоговое окно</p>
          <p className="text-sm sm:text-base">
            Фон 16:9 без людей и текста + свободная нижняя область под реплики и кнопки выбора.
          </p>
        </div>
      </div>
    );
  }

  if (type === 'story') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {GENRE_CARDS.map((g) => (
          <div key={g.id} className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
            <SafeImage src={g.imagePath} alt={g.label} fallbackTitle={g.label} className="aspect-[4/3] w-full object-cover" />
            <p className="p-2 text-xs font-bold text-[#26313B] text-center">{g.label}</p>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'character') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {ART_STYLE_CARDS.map((s) => (
          <div key={s.id} className="rounded-xl overflow-hidden border border-slate-200 bg-white">
            <SafeImage src={s.imagePath} alt={s.label} fallbackTitle={s.label} className="aspect-[4/3] w-full object-contain p-1" />
            <p className="p-2 text-[11px] font-bold text-[#26313B] text-center bg-slate-50 border-t border-slate-100">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'photoroom') {
    return (
      <div className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 border border-slate-200 p-4">
        <div className="rounded-xl bg-white border border-slate-200 p-3 text-center">
          <SafeImage
            src={ART_STYLE_CARDS[0].imagePath}
            alt="До PhotoRoom"
            fallbackTitle="До PhotoRoom"
            className="h-40 mx-auto object-contain"
          />
          <p className="text-xs font-bold text-slate-700 mt-2">1. Белый фон из Google Flow</p>
        </div>
        <div className="rounded-xl checkerboard-bg border border-slate-200 p-3 text-center">
          <SafeImage
            src={ART_STYLE_CARDS[0].imagePath}
            alt="После PhotoRoom"
            fallbackTitle="После PhotoRoom"
            className="h-40 mx-auto object-contain mix-blend-multiply"
          />
          <p className="text-xs font-bold text-emerald-700 mt-2 bg-white/85 rounded-lg py-0.5 px-2 inline-block">
            2. Прозрачный PNG (character.png)
          </p>
        </div>
      </div>
    );
  }

  if (type === 'pygame') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <pre className="rounded-2xl bg-[#26313B] text-[#F4C914] p-4 font-mono text-sm leading-relaxed">
{`VisualNovel/
    main.py
    images/
        background.jpg
        character.png`}
        </pre>
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex flex-col justify-center space-y-2 text-sm text-[#26313B]">
          <p className="font-extrabold">Требования к коду:</p>
          <p className="text-slate-600">
            Окно 1000×600 · Системный шрифт для русского текста · 2 кнопки выбора · 2 финала · Кнопка перезапуска.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 text-sm text-[#26313B] leading-relaxed">
      <p className="font-extrabold mb-1">На что обратить внимание прямо сейчас:</p>
      <p className="text-slate-600">{stage.exampleSummary}</p>
    </div>
  );
}
