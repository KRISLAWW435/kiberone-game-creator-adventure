import { CYBERBOT_EMOTION_IMAGES } from '../../config/mediaAssets';
import type { MascotEmotion } from '../../types/lesson';
import { SafeImage } from './SafeImage';

interface GuideMascotProps {
  message: string;
  emotion?: MascotEmotion;
  label?: string;
  compact?: boolean;
}

const EMOTION_LABELS: Record<MascotEmotion, string> = {
  support: 'Поддержка',
  joy: 'Радость',
  surprise: 'Вау-момент',
  thinking: 'Думаем',
  victory: 'Победа',
};

/**
 * Полноценный персонаж КиберБот — 5 согласованных эмоций в едином стиле
 * с ярким речевым пузырём для светлой игровой мастерской.
 */
export function GuideMascot({
  message,
  emotion = 'support',
  label = 'КиберБот',
  compact = false,
}: GuideMascotProps) {
  const imageSrc = CYBERBOT_EMOTION_IMAGES[emotion] || CYBERBOT_EMOTION_IMAGES.support;

  const ringClass =
    emotion === 'victory' || emotion === 'joy'
      ? 'border-[#F4C914] ring-[#F4C914]/25'
      : emotion === 'surprise'
      ? 'border-[#7C3AED] ring-[#7C3AED]/20'
      : 'border-[#06B8BE] ring-[#06B8BE]/20';

  const badgeClass =
    emotion === 'victory' || emotion === 'joy'
      ? 'bg-amber-100 text-amber-900'
      : emotion === 'surprise'
      ? 'bg-violet-100 text-violet-900'
      : 'bg-cyan-50 text-[#04959A]';

  return (
    <div className="flex items-start gap-3 sm:gap-4">
      <div
        className={`shrink-0 rounded-2xl bg-white border-2 ring-4 overflow-hidden shadow-sm animate-lab-float ${ringClass} ${
          compact ? 'w-16 h-16 sm:w-18 sm:h-18' : 'w-20 h-20 sm:w-24 sm:h-24'
        }`}
      >
        <img
          src={imageSrc}
          alt={`КиберБот (${EMOTION_LABELS[emotion]})`}
          className="w-full h-full object-contain p-0.5"
        />
      </div>

      {/* Speech Bubble */}
      <div className="animate-lab-bubble relative flex-1 bg-white border border-slate-200/90 rounded-2xl px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-extrabold text-[#04959A]">{label}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${badgeClass}`}>
            {EMOTION_LABELS[emotion]}
          </span>
        </div>
        <p className="text-sm text-[#26313B] leading-relaxed font-medium">{message}</p>
      </div>
    </div>
  );
}
