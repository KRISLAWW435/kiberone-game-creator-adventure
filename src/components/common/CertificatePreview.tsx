import { jsPDF } from 'jspdf';
import { AlertCircle, CheckCircle2, Download, FileDown, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CYBERBOT_EMOTION_IMAGES, getGenreLabel, getStyleLabel } from '../../config/mediaAssets';
import type { ArtStyleId, GenreId } from '../../types/lesson';
import { ACHIEVEMENTS_CATALOG } from '../../utils/gamification';
import { recordDiagnosticError } from '../../utils/diagnostics';

interface CertificatePreviewProps {
  studentName: string;
  gameTitle: string;
  genre: GenreId | '';
  artStyle: ArtStyleId;
  xp: number;
  unlockedKeysCount: number;
  earnedAchievementIds: string[];
  dateFormatted: string;
  mandatoryStagesCompleted?: boolean;
}

function wrapTextLines(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word.length > maxChars ? `${word.slice(0, maxChars - 1)}…` : word;
      if (lines.length === maxLines) {
        current = '';
        break;
      }
    }
  }
  if (current && lines.length < maxLines) {
    lines.push(current);
  }
  if (lines.length === maxLines && words.join(' ').length > lines.join(' ').length) {
    const last = lines[maxLines - 1];
    if (!last.endsWith('…')) {
      lines[maxLines - 1] = `${last.slice(0, Math.max(1, maxChars - 1))}…`;
    }
  }
  return lines;
}

function sanitizeFilename(input: string): string {
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/[^a-zа-яё0-9_-]+/gi, '_')
    .replace(/^_+|_+$/g, '');
  return cleaned.slice(0, 36) || 'kiberone_certificate';
}

export function CertificatePreview({
  studentName,
  gameTitle,
  genre,
  artStyle,
  xp,
  unlockedKeysCount,
  earnedAchievementIds,
  dateFormatted,
  mandatoryStagesCompleted = true,
}: CertificatePreviewProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [cyberBotDataUri, setCyberBotDataUri] = useState<string>('');
  const [exportState, setExportState] = useState<'idle' | 'png' | 'pdf'>('idle');
  const [statusMessage, setStatusMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const trimmedStudent = studentName.trim();
  const trimmedGame = gameTitle.trim();
  const isReadyToDownload = mandatoryStagesCompleted && Boolean(trimmedStudent && trimmedGame);

  // Preload local CyberBot victory image as base64 data URI so SVG->Canvas never taints
  useEffect(() => {
    let active = true;
    fetch(CYBERBOT_EMOTION_IMAGES.victory)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.blob();
      })
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (active && typeof reader.result === 'string') {
            setCyberBotDataUri(reader.result);
          }
        };
        reader.readAsDataURL(blob);
      })
      .catch((err) => {
        recordDiagnosticError(
          'image',
          'Не удалось предзагрузить эмблему КиберБота для грамоты',
          `${CYBERBOT_EMOTION_IMAGES.victory} (${err instanceof Error ? err.message : String(err)})`
        );
      });
    return () => {
      active = false;
    };
  }, []);

  const confirmedAchievements = ACHIEVEMENTS_CATALOG.filter((a) =>
    earnedAchievementIds.includes(a.id)
  );
  const displayedAchievements = confirmedAchievements.slice(0, 6);
  const extraAchievementsCount = Math.max(0, confirmedAchievements.length - displayedAchievements.length);

  const studentLines = wrapTextLines(trimmedStudent || 'Впиши своё имя и фамилию выше', 32, 2);
  const gameTitleLines = wrapTextLines(
    trimmedGame ? `«${trimmedGame}»` : '«Впиши финальное название игры выше»',
    40,
    2
  );

  const renderSvgToCanvas = async (): Promise<HTMLCanvasElement> => {
    const svgEl = svgRef.current;
    if (!svgEl) {
      throw new Error('Шаблон грамоты не найден.');
    }
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgEl);
    if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
      svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!svgString.includes('xmlns:xlink=')) {
      svgString = svgString.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Не удалось подготовить изображение грамоты.'));
      image.src = svgDataUrl;
    });

    // High-resolution A4 landscape canvas (297:210 exact aspect ratio)
    const canvas = document.createElement('canvas');
    canvas.width = 2970;
    canvas.height = 2100;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Браузер не смог создать холст для экспорта.');
    }
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  };

  const handleDownloadPng = async () => {
    if (!isReadyToDownload || exportState !== 'idle') return;
    setExportState('png');
    setStatusMessage(null);
    try {
      const canvas = await renderSvgToCanvas();
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/png')
      );
      if (!blob) throw new Error('Не удалось сформировать PNG.');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gramota_${sanitizeFilename(trimmedStudent)}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      setStatusMessage({ type: 'ok', text: 'Грамота в формате PNG скачана!' });
    } catch (err) {
      setStatusMessage({
        type: 'err',
        text: err instanceof Error ? err.message : 'Ошибка скачивания PNG.',
      });
    } finally {
      setExportState('idle');
    }
  };

  const handleDownloadPdf = async () => {
    if (!isReadyToDownload || exportState !== 'idle') return;
    setExportState('pdf');
    setStatusMessage(null);
    try {
      const canvas = await renderSvgToCanvas();
      const pngDataUrl = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });
      pdf.addImage(pngDataUrl, 'PNG', 0, 0, 297, 210);
      pdf.save(`gramota_${sanitizeFilename(trimmedStudent)}.pdf`);
      setStatusMessage({ type: 'ok', text: 'Грамота в формате A4 PDF скачана!' });
    } catch (err) {
      setStatusMessage({
        type: 'err',
        text: err instanceof Error ? err.message : 'Ошибка формирования PDF.',
      });
    } finally {
      setExportState('idle');
    }
  };

  return (
    <div className="space-y-4">
      {/* Validation Notice OR Download Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {!mandatoryStagesCompleted ? (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-300 text-xs sm:text-sm font-bold text-rose-900">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              Грамота заблокирована: сначала заверши обязательные этапы 1–9 и собери ключи!
            </span>
          </div>
        ) : !isReadyToDownload ? (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-[#F4C914] text-xs sm:text-sm font-bold text-amber-950">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Чтобы скачать грамоту, обязательно укажи{' '}
              {!trimmedStudent && !trimmedGame
                ? 'своё имя и финальное название игры'
                : !trimmedStudent
                ? 'своё имя и фамилию'
                : 'финальное название своей игры'}
              .
            </span>
          </div>
        ) : statusMessage ? (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold ${
              statusMessage.type === 'ok'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            {statusMessage.type === 'ok' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        ) : (
          <span className="text-xs font-bold text-emerald-700">
            Грамота готова к скачиванию в альбомном формате A4 (PNG и PDF).
          </span>
        )}

        <div className="flex flex-wrap items-center gap-2.5 ml-auto">
          <button
            type="button"
            disabled={!isReadyToDownload || exportState !== 'idle'}
            onClick={handleDownloadPng}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all whitespace-nowrap ${
              isReadyToDownload
                ? 'bg-[#06B8BE] hover:bg-[#04959A] text-white cursor-pointer shadow-xs'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            {exportState === 'png' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Скачать грамоту PNG</span>
          </button>

          <button
            type="button"
            disabled={!isReadyToDownload || exportState !== 'idle'}
            onClick={handleDownloadPdf}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all whitespace-nowrap ${
              isReadyToDownload
                ? 'bg-[#F4C914] hover:bg-amber-400 text-[#26313B] cursor-pointer shadow-xs'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            {exportState === 'pdf' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4" />
            )}
            <span>Скачать грамоту PDF</span>
          </button>
        </div>
      </div>

      {/* Single Shared Vector A4 Landscape Certificate (297:210) */}
      <div className="rounded-2xl border border-slate-200 bg-slate-100/70 p-2 sm:p-4 overflow-hidden">
        <svg
          ref={svgRef}
          viewBox="0 0 1485 1050"
          className="w-full h-auto rounded-xl shadow-md bg-white"
          role="img"
          aria-label="Именная грамота KIBERONE Game Creator Adventure"
        >
          <defs>
            <linearGradient id="certBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F4F8FB" />
              <stop offset="55%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FEFCE8" />
            </linearGradient>
            <linearGradient id="certRibbon" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06B8BE" />
              <stop offset="65%" stopColor="#04959A" />
              <stop offset="100%" stopColor="#F4C914" />
            </linearGradient>
            <clipPath id="cyberbotClip">
              <circle cx="1265" cy="365" r="102" />
            </clipPath>
          </defs>

          {/* Outer A4 Canvas */}
          <rect width="1485" height="1050" fill="url(#certBg)" />

          {/* Geometric Corner Accents */}
          <circle cx="1410" cy="110" r="170" fill="#06B8BE" fillOpacity="0.08" />
          <circle cx="95" cy="960" r="190" fill="#F4C914" fillOpacity="0.12" />

          {/* Double Decorative Border */}
          <rect
            x="28"
            y="28"
            width="1429"
            height="994"
            rx="28"
            fill="none"
            stroke="#06B8BE"
            strokeWidth="4"
          />
          <rect
            x="44"
            y="44"
            width="1397"
            height="962"
            rx="20"
            fill="none"
            stroke="#F4C914"
            strokeWidth="2.5"
          />

          {/* Top Brand Ribbon */}
          <rect x="76" y="72" width="1333" height="92" rx="18" fill="url(#certRibbon)" />
          <text
            x="108"
            y="112"
            fill="#FFFFFF"
            fontSize="20"
            fontWeight="800"
            fontFamily="Inter, Arial, sans-serif"
            letterSpacing="2"
          >
            KIBERONE GAME CREATOR ADVENTURE · VIBE CODING LAB
          </text>
          <text
            x="108"
            y="144"
            fill="#E0F7FA"
            fontSize="21"
            fontWeight="700"
            fontFamily="Inter, Arial, sans-serif"
          >
            Тема занятия: «Создание визуальной новеллы с помощью нейросети»
          </text>

          {/* Technology Pill in Header */}
          <rect x="1115" y="92" width="262" height="52" rx="12" fill="#26313B" />
          <text
            x="1246"
            y="125"
            textAnchor="middle"
            fill="#F4C914"
            fontSize="22"
            fontWeight="800"
            fontFamily="monospace"
          >
            Python 3 + Pygame
          </text>

          {/* Certificate Headline */}
          <text
            x="84"
            y="236"
            fill="#26313B"
            fontSize="50"
            fontWeight="800"
            fontFamily="Inter, Arial, sans-serif"
          >
            ПАМЯТНАЯ ГРАМОТА
          </text>
          <text
            x="84"
            y="278"
            fill="#04959A"
            fontSize="25"
            fontWeight="700"
            fontFamily="Inter, Arial, sans-serif"
          >
            Создатель собственной интерактивной визуальной новеллы
          </text>

          {/* Awarded To */}
          <text
            x="84"
            y="344"
            fill="#64748B"
            fontSize="18"
            fontWeight="700"
            fontFamily="Inter, Arial, sans-serif"
            letterSpacing="1.5"
          >
            ПОДТВЕРЖДАЕТ, ЧТО УЧАСТНИК ПРОЕКТНОГО ЗАНЯТИЯ
          </text>

          <rect x="84" y="362" width="1010" height="122" rx="20" fill="#FFFFFF" stroke="#06B8BE" strokeWidth="2.5" />
          <text
            x="114"
            y={studentLines.length > 1 ? 412 : 434}
            fill={trimmedStudent ? '#04959A' : '#94A3B8'}
            fontSize={studentLines.length > 1 ? '38' : '44'}
            fontWeight="800"
            fontFamily="Inter, Arial, sans-serif"
          >
            {studentLines.map((line, i) => (
              <tspan key={line + i} x="114" dy={i === 0 ? 0 : 46}>
                {line}
              </tspan>
            ))}
          </text>

          {/* CyberBot Emblem on Right */}
          <circle cx="1265" cy="365" r="112" fill="#FFFFFF" stroke="#F4C914" strokeWidth="6" />
          {cyberBotDataUri ? (
            <image
              href={cyberBotDataUri}
              x="1163"
              y="263"
              width="204"
              height="204"
              clipPath="url(#cyberbotClip)"
              preserveAspectRatio="xMidYMid slice"
            />
          ) : (
            <circle cx="1265" cy="365" r="96" fill="#E0F7FA" />
          )}
          <rect x="1128" y="466" width="274" height="38" rx="14" fill="#F4C914" />
          <text
            x="1265"
            y="491"
            textAnchor="middle"
            fill="#26313B"
            fontSize="16"
            fontWeight="800"
            fontFamily="Inter, Arial, sans-serif"
            letterSpacing="0.6"
          >
            ОДОБРЕНО КИБЕРБОТОМ
          </text>

          {/* Created Game Card */}
          <rect x="84" y="514" width="1010" height="156" rx="20" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <text
            x="114"
            y="548"
            fill="#64748B"
            fontSize="18"
            fontWeight="700"
            fontFamily="Inter, Arial, sans-serif"
          >
            СОЗДАЛ АВТОРСКУЮ ИГРУ С ФОНОМ 16:9, ПЕРСОНАЖЕМ И ДВУМЯ ФИНАЛАМИ:
          </text>
          <text
            x="114"
            y={gameTitleLines.length > 1 ? 590 : 602}
            fill={trimmedGame ? '#26313B' : '#94A3B8'}
            fontSize={gameTitleLines.length > 1 ? '31' : '36'}
            fontWeight="800"
            fontFamily="Inter, Arial, sans-serif"
          >
            {gameTitleLines.map((line, i) => (
              <tspan key={line + i} x="114" dy={i === 0 ? 0 : 38}>
                {line}
              </tspan>
            ))}
          </text>
          <text
            x="114"
            y="650"
            fill="#04959A"
            fontSize="20"
            fontWeight="700"
            fontFamily="Inter, Arial, sans-serif"
          >
            Жанр: {getGenreLabel(genre)}   ·   Стиль графики: {getStyleLabel(artStyle)}   ·   Окно 1000×600
          </text>

          {/* Metrics Column on Right: 3 separate non-overlapping cards (XP, Keys, Date) */}
          <rect x="1125" y="514" width="278" height="46" rx="14" fill="#26313B" />
          <text x="1146" y="543" fill="#CBD5E1" fontSize="16" fontWeight="700" fontFamily="Inter, Arial, sans-serif">
            Набрано опыта:
          </text>
          <text x="1382" y="544" textAnchor="end" fill="#F4C914" fontSize="20" fontWeight="800" fontFamily="Inter, Arial, sans-serif">
            {xp} XP
          </text>

          <rect x="1125" y="569" width="278" height="46" rx="14" fill="#26313B" />
          <text x="1146" y="598" fill="#CBD5E1" fontSize="16" fontWeight="700" fontFamily="Inter, Arial, sans-serif">
            Ключей этапа:
          </text>
          <text x="1382" y="599" textAnchor="end" fill="#06B8BE" fontSize="20" fontWeight="800" fontFamily="Inter, Arial, sans-serif">
            {unlockedKeysCount} / 10
          </text>

          <rect x="1125" y="624" width="278" height="46" rx="14" fill="#26313B" />
          <text x="1146" y="653" fill="#CBD5E1" fontSize="16" fontWeight="700" fontFamily="Inter, Arial, sans-serif">
            Дата:
          </text>
          <text x="1382" y="653" textAnchor="end" fill="#FFFFFF" fontSize="17" fontWeight="700" fontFamily="Inter, Arial, sans-serif">
            {dateFormatted}
          </text>

          {/* Confirmed Achievements Section */}
          <rect x="84" y="694" width="1319" height="232" rx="20" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
          <text
            x="114"
            y="732"
            fill="#26313B"
            fontSize="21"
            fontWeight="800"
            fontFamily="Inter, Arial, sans-serif"
          >
            ПОДТВЕРЖДЁННЫЕ ДОСТИЖЕНИЯ РАЗРАБОТЧИКА ({confirmedAchievements.length})
          </text>

          {displayedAchievements.length === 0 ? (
            <text
              x="114"
              y="784"
              fill="#64748B"
              fontSize="20"
              fontWeight="600"
              fontFamily="Inter, Arial, sans-serif"
            >
              Завершай этапы 1–10, чтобы твои подтверждённые достижения появились прямо на грамоте!
            </text>
          ) : (
            displayedAchievements.map((ach, idx) => {
              const col = idx % 3;
              const row = Math.floor(idx / 3);
              const boxX = 114 + col * 424;
              const boxY = 754 + row * 70;
              return (
                <g key={ach.id}>
                  <rect x={boxX} y={boxY} width="406" height="56" rx="12" fill="#FFFFFF" stroke="#06B8BE" strokeWidth="1.8" />
                  <circle cx={boxX + 24} cy={boxY + 28} r="10" fill="#10B981" />
                  <path
                    d={`M ${boxX + 19} ${boxY + 28} l 3.5 3.5 l 6.5 -7`}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <text
                    x={boxX + 44}
                    y={boxY + 34}
                    fill="#26313B"
                    fontSize="17"
                    fontWeight="700"
                    fontFamily="Inter, Arial, sans-serif"
                  >
                    {ach.title.length > 31 ? `${ach.title.slice(0, 30)}…` : ach.title}
                  </text>
                </g>
              );
            })
          )}

          {extraAchievementsCount > 0 && (
            <text
              x="1372"
              y="906"
              textAnchor="end"
              fill="#04959A"
              fontSize="17"
              fontWeight="800"
              fontFamily="Inter, Arial, sans-serif"
            >
              + ещё {extraAchievementsCount} достижений в коллекции
            </text>
          )}

          {/* Footer Note */}
          <text
            x="84"
            y="968"
            fill="#64748B"
            fontSize="16"
            fontWeight="600"
            fontFamily="Inter, Arial, sans-serif"
          >
            * Памятная именная грамота участника практического занятия KIBERONE Game Creator Adventure.
          </text>
        </svg>
      </div>
    </div>
  );
}
