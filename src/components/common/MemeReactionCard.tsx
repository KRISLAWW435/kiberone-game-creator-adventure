import { RefreshCw, Smile } from 'lucide-react';
import { getMemeReaction, MEME_REACTIONS, type MemeSceneKey } from '../../config/memeReactions';

interface MemeReactionCardProps {
  memeId: string;
  compact?: boolean;
  onCycleMeme?: (nextMemeId: string) => void;
}

function MemeVectorScene({ sceneKey }: { sceneKey: MemeSceneKey }) {
  switch (sceneKey) {
    case 'white_box':
      return (
        <svg viewBox="0 0 120 88" className="w-full h-full" fill="none" aria-hidden="true">
          <rect width="120" height="88" rx="12" fill="#E0F2FE" />
          <circle cx="96" cy="20" r="10" fill="#F4C914" />
          <rect x="28" y="14" width="64" height="60" rx="4" fill="#FFFFFF" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="4 3" />
          <circle cx="60" cy="36" r="10" fill="#26313B" />
          <path d="M44 68 C44 50 76 50 76 68" fill="#06B8BE" />
          <text x="60" y="25" textAnchor="middle" fill="#EF4444" fontSize="8" fontWeight="800" fontFamily="monospace">
            .JPG :(
          </text>
        </svg>
      );
    case 'png_magic':
      return (
        <svg viewBox="0 0 120 88" className="w-full h-full" fill="none" aria-hidden="true">
          <rect width="120" height="88" rx="12" fill="#ECFDF5" />
          <rect x="10" y="10" width="100" height="68" rx="8" fill="#D1FAE5" />
          <circle cx="60" cy="34" r="12" fill="#06B8BE" />
          <rect x="44" y="48" width="32" height="24" rx="10" fill="#26313B" />
          <path d="M22 26 L26 18 L30 26 L38 30 L30 34 L26 42 L22 34 L14 30 Z" fill="#F4C914" />
          <text x="93" y="26" textAnchor="middle" fill="#059669" fontSize="9" fontWeight="800" fontFamily="monospace">
            .PNG!
          </text>
        </svg>
      );
    case 'five_bugs':
      return (
        <svg viewBox="0 0 120 88" className="w-full h-full" fill="none" aria-hidden="true">
          <rect width="120" height="88" rx="12" fill="#FFFBEB" />
          <rect x="14" y="16" width="92" height="56" rx="8" fill="#26313B" />
          <circle cx="32" cy="38" r="6" fill="#EF4444" />
          <circle cx="52" cy="48" r="6" fill="#F59E0B" />
          <circle cx="72" cy="34" r="6" fill="#EF4444" />
          <circle cx="88" cy="52" r="6" fill="#F4C914" />
          <text x="22" y="29" fill="#FB7185" fontSize="8" fontWeight="800" fontFamily="monospace">
            Bug x5 → Fix!
          </text>
        </svg>
      );
    case 'first_run':
    case 'zero_errors':
      return (
        <svg viewBox="0 0 120 88" className="w-full h-full" fill="none" aria-hidden="true">
          <rect width="120" height="88" rx="12" fill="#ECFDF5" />
          <rect x="14" y="14" width="92" height="60" rx="10" fill="#26313B" />
          <polygon points="36,30 56,44 36,58" fill="#10B981" />
          <text x="64" y="42" fill="#F4C914" fontSize="10" fontWeight="800" fontFamily="monospace">
            0 ERR
          </text>
          <text x="64" y="55" fill="#6EE7B7" fontSize="8" fontWeight="700" fontFamily="monospace">
            RUN OK!
          </text>
        </svg>
      );
    case 'ai_code':
      return (
        <svg viewBox="0 0 120 88" className="w-full h-full" fill="none" aria-hidden="true">
          <rect width="120" height="88" rx="12" fill="#ECFEFF" />
          <rect x="34" y="20" width="52" height="44" rx="14" fill="#FFFFFF" stroke="#06B8BE" strokeWidth="3" />
          <rect x="44" y="34" width="32" height="14" rx="6" fill="#26313B" />
          <circle cx="53" cy="41" r="2.8" fill="#F4C914" />
          <circle cx="67" cy="41" r="2.8" fill="#06B8BE" />
          <text x="60" y="77" textAnchor="middle" fill="#04959A" fontSize="8.5" fontWeight="800" fontFamily="monospace">
            if choice == "A":
          </text>
        </svg>
      );
    case 'plot_twist':
      return (
        <svg viewBox="0 0 120 88" className="w-full h-full" fill="none" aria-hidden="true">
          <rect width="120" height="88" rx="12" fill="#F5F3FF" />
          <path d="M60 72 V44 L34 22" stroke="#06B8BE" strokeWidth="5" strokeLinecap="round" />
          <path d="M60 44 L86 22" stroke="#F4C914" strokeWidth="5" strokeLinecap="round" />
          <circle cx="34" cy="22" r="7" fill="#06B8BE" />
          <circle cx="86" cy="22" r="7" fill="#F4C914" />
          <text x="34" y="25" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="800">A</text>
          <text x="86" y="25" textAnchor="middle" fill="#26313B" fontSize="8" fontWeight="800">B</text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 120 88" className="w-full h-full" fill="none" aria-hidden="true">
          <rect width="120" height="88" rx="12" fill="#FFFBEB" />
          <rect x="14" y="14" width="92" height="60" rx="10" fill="#FFFFFF" stroke="#F4C914" strokeWidth="2.5" />
          <circle cx="44" cy="42" r="14" fill="#06B8BE" />
          <path d="M38 42 L43 47 L52 37" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="66" y="30" width="30" height="8" rx="4" fill="#F4C914" />
          <rect x="66" y="44" width="24" height="6" rx="3" fill="#CBD5E1" />
          <rect x="66" y="54" width="18" height="6" rx="3" fill="#E2E8F0" />
        </svg>
      );
  }
}

export function MemeReactionCard({ memeId, compact = false, onCycleMeme }: MemeReactionCardProps) {
  const meme = getMemeReaction(memeId);

  const handleNext = () => {
    if (!onCycleMeme) return;
    const idx = MEME_REACTIONS.findIndex((m) => m.id === meme.id);
    const next = MEME_REACTIONS[(idx + 1) % MEME_REACTIONS.length];
    onCycleMeme(next.id);
  };

  return (
    <div
      className={`rounded-2xl bg-white border-2 border-slate-200 flex items-center gap-3.5 shadow-xs ${
        compact ? 'p-3' : 'p-4'
      }`}
    >
      <div className={`${compact ? 'w-20 h-16' : 'w-28 h-20'} rounded-xl overflow-hidden shrink-0 border border-slate-200`}>
        <MemeVectorScene sceneKey={meme.sceneKey} />
      </div>

      <div className="min-w-0 flex-1 space-y-1 text-left">
        <div className="flex items-center justify-between gap-2">
          <span
            className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-slate-100"
            style={{ color: meme.accentHex }}
          >
            <Smile className="w-3 h-3" />
            <span>{meme.badge}</span>
          </span>

          {onCycleMeme && (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#04959A] hover:underline cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Другой мем</span>
            </button>
          )}
        </div>

        <p className={`${compact ? 'text-xs sm:text-sm' : 'text-sm'} font-extrabold text-[#26313B] leading-snug`}>
          {meme.title}
        </p>
        <p className="text-xs text-slate-600 leading-snug">{meme.caption}</p>
      </div>
    </div>
  );
}
