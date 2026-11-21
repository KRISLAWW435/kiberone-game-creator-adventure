import { AlertTriangle, CheckCircle2, ExternalLink, FileWarning, Layers, Upload } from 'lucide-react';
import { useRef } from 'react';
import { BACKGROUND_LIBRARY_CATALOG } from '../../config/backgroundLibrary';
import { ART_STYLE_CARDS } from '../../config/mediaAssets';
import type { LessonProgressState } from '../../types/lesson';
import { inspectImageTransparency } from '../../utils/proceduralArt';
import { LibraryPreviewCanvas } from '../common/LibraryPreviewCanvas';
import { MemeReactionCard } from '../common/MemeReactionCard';
import { SafeImage } from '../common/SafeImage';

interface Stage07AssetPrepProps {
  state: LessonProgressState;
  onUpdate: (patch: Partial<LessonProgressState>) => void;
}

const PHOTOROOM_STEPS = [
  '1. Открой PhotoRoom и нажми «Выбрать фото» — загрузи картинку героя.',
  '2. Подожди 2–3 секунды — нейросеть удалит белый фон и покажет клеточки прозрачности.',
  '3. Нажми «Скачать» и убедись, что файл сохранился в формате .PNG.',
  '4. Переименуй файл в character.png для папки images/.',
];

export function Stage07AssetPrep({ state, onUpdate }: Stage07AssetPrepProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedLibraryBg =
    BACKGROUND_LIBRARY_CATALOG.find((b) => b.id === state.selectedLibraryBgId) ||
    BACKGROUND_LIBRARY_CATALOG.find((b) => Boolean(b.previewAssetPath)) ||
    BACKGROUND_LIBRARY_CATALOG[0];

  const styleCard =
    ART_STYLE_CARDS.find((s) => s.id === state.selectedArtStyle) || ART_STYLE_CARDS[0];

  const handleUploadTransparent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        const resultUrl = reader.result;
        const inspection = await inspectImageTransparency(resultUrl);
        onUpdate({
          uploadedCharacterTransparentDataUrl: resultUrl,
          uploadedCharacterHasTransparency: inspection.hasTransparency,
          stage7ConfirmedPng: inspection.hasTransparency,
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const hasValidTransparentUpload =
    Boolean(state.uploadedCharacterTransparentDataUrl) &&
    state.uploadedCharacterHasTransparency !== false;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Left: PhotoRoom Steps & File Verification */}
      <section className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#26313B]">Удаление белого фона (PhotoRoom)</h3>
            <p className="text-xs text-slate-500">Превращаем картинку с белым фоном в прозрачный спрайт PNG.</p>
          </div>
          <a
            href="https://www.photoroom.com/ru/tools/background-remover"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#06B8BE] hover:bg-[#04959A] text-white text-xs sm:text-sm font-extrabold whitespace-nowrap shrink-0"
          >
            <span>Открыть PhotoRoom</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <ol className="space-y-2 text-xs sm:text-sm text-[#26313B]">
          {PHOTOROOM_STEPS.map((step) => (
            <li key={step} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-semibold">
              {step}
            </li>
          ))}
        </ol>

        <div className="rounded-2xl bg-amber-50 border border-[#F4C914] p-3.5 flex items-start gap-3">
          <FileWarning className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-950 leading-relaxed">
            <strong>Только .PNG!</strong> Формат <code className="font-mono font-bold">.jpg</code> не хранит прозрачность и
            оставит вокруг героя белый прямоугольник.
          </p>
        </div>

        {/* Fallback confirmation if student already saved character.png on disk */}
        <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:border-[#06B8BE]">
          <input
            type="checkbox"
            checked={state.stage7ConfirmedPng}
            onChange={(e) => onUpdate({ stage7ConfirmedPng: e.target.checked })}
            className="mt-1 accent-[#06B8BE] w-4 h-4 shrink-0"
          />
          <span className="text-xs sm:text-sm text-[#26313B] leading-snug">
            Я скачал прозрачный файл <code className="font-mono font-bold text-[#04959A]">character.png</code> из PhotoRoom на
            компьютер (или загрузил его для проверки справа).
          </span>
        </label>
      </section>

      {/* Right: Checkerboard + Real Transparency Check + Game Composite */}
      <section className="lg:col-span-6 space-y-4">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 space-y-3 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-extrabold text-[#26313B] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#06B8BE]" />
              <span>Проверка прозрачности PNG на твоём фоне</span>
            </h4>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/*"
              onChange={handleUploadTransparent}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F4C914] hover:bg-amber-400 text-[#26313B] text-xs font-extrabold cursor-pointer whitespace-nowrap"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Проверить свой PNG</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-2 text-center">
              <div className="aspect-[4/3] rounded-xl overflow-hidden flex items-center justify-center bg-white">
                <SafeImage
                  src={state.uploadedCharacterRawDataUrl || styleCard.imagePath}
                  alt="Исходник с белым фоном"
                  fallbackTitle="Исходник героя"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <p className="text-[11px] font-bold text-slate-600 mt-1.5">До: белый фон</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 text-center">
              <div className="aspect-[4/3] checkerboard-bg rounded-xl overflow-hidden flex items-center justify-center">
                {state.uploadedCharacterTransparentDataUrl ? (
                  <SafeImage
                    src={state.uploadedCharacterTransparentDataUrl}
                    alt="Проверенный PNG"
                    fallbackTitle="Прозрачный PNG"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="px-2 text-[11px] font-bold text-[#26313B] bg-white/80 rounded-lg py-1">
                    Клеточки = прозрачный фон
                  </span>
                )}
              </div>
              <p className="text-[11px] font-bold text-[#04959A] mt-1.5">После: прозрачный PNG</p>
            </div>
          </div>

          {state.uploadedCharacterTransparentDataUrl && state.uploadedCharacterHasTransparency === true && (
            <div className="space-y-3">
              <div className="animate-lab-celebrate rounded-xl bg-emerald-50 border border-emerald-300 p-3 flex items-center gap-2.5 text-xs text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Проверка пройдена! В файле действительно прозрачный альфа-канал без белого прямоугольника.</span>
              </div>
              <MemeReactionCard memeId="meme_png_magic" compact />
            </div>
          )}

          {state.uploadedCharacterTransparentDataUrl && state.uploadedCharacterHasTransparency === false && (
            <div className="space-y-3">
              <div className="animate-lab-shake rounded-xl bg-rose-50 border border-rose-300 p-3 flex items-start gap-2.5 text-xs text-rose-800 leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Внимание:</strong> в этом файле нет прозрачности — вокруг героя остался сплошной фон.
                  Прогони файл через PhotoRoom и скачай именно PNG!
                </span>
              </div>
              <MemeReactionCard memeId="meme_white_box" compact />
            </div>
          )}

          <div className="relative aspect-[10/6] rounded-2xl overflow-hidden border border-slate-200 bg-slate-900">
            {state.backgroundMode === 'generate' && state.uploadedBackgroundDataUrl ? (
              <SafeImage
                src={state.uploadedBackgroundDataUrl}
                alt="Фон игрока"
                fallbackTitle="Фон игрока"
                className="w-full h-full object-cover"
              />
            ) : (
              <LibraryPreviewCanvas item={selectedLibraryBg} />
            )}

            {hasValidTransparentUpload && (
              <SafeImage
                src={state.uploadedCharacterTransparentDataUrl}
                alt="Прозрачный персонаж"
                fallbackTitle="Персонаж"
                className="absolute bottom-[16%] left-1/2 -translate-x-1/2 h-[78%] w-auto object-contain pointer-events-none"
              />
            )}

            <div className="absolute bottom-2.5 left-2.5 right-2.5 rounded-xl bg-[#26313B]/92 border border-white/15 px-3 py-2 text-white">
              <p className="text-[11px] font-bold text-[#F4C914]">
                {state.character.name || 'Главный герой'}
              </p>
              <p className="text-xs text-slate-200 truncate">
                {hasValidTransparentUpload
                  ? 'Супер! Герой стоит прямо на локации без белого квадрата.'
                  : 'Загрузи готовый character.png выше, чтобы примерить героя на своём фоне.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
