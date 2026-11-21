import { Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CYBERBOT_EMOTION_IMAGES } from '../../config/mediaAssets';
import { getMemeForChest } from '../../config/memeReactions';
import type { MilestoneChest } from '../../utils/gamification';
import { ChestArtwork, ChestStickerArtwork } from './ChestIllustrations';
import { MemeReactionCard } from './MemeReactionCard';
import { SafeImage } from './SafeImage';

interface ChestRewardModalProps {
  chest: MilestoneChest | null;
  onClose: () => void;
  onClaimChest: (chestId: string) => void;
}

const CONFETTI_PIECES = [
  { left: '8%', color: '#06B8BE', delay: '0ms' },
  { left: '18%', color: '#F4C914', delay: '90ms' },
  { left: '30%', color: '#7C3AED', delay: '140ms' },
  { left: '42%', color: '#10B981', delay: '40ms' },
  { left: '54%', color: '#F97316', delay: '110ms' },
  { left: '66%', color: '#06B8BE', delay: '170ms' },
  { left: '78%', color: '#F4C914', delay: '60ms' },
  { left: '90%', color: '#7C3AED', delay: '130ms' },
];

export function ChestRewardModal({ chest, onClose, onClaimChest }: ChestRewardModalProps) {
  const [openedNow, setOpenedNow] = useState(false);

  useEffect(() => {
    if (chest) {
      setOpenedNow(false);
    }
  }, [chest]);

  if (!chest) return null;

  const chestMeme = getMemeForChest(chest.id);

  const handleOpen = () => {
    setOpenedNow(true);
    onClaimChest(chest.id);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={chest.title}
    >
      <div className="animate-lab-celebrate relative w-full max-w-lg bg-white border-2 border-[#F4C914] rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden text-center space-y-4">
        {/* Confetti burst when chest opens */}
        {openedNow && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-28 overflow-hidden">
            {CONFETTI_PIECES.map((c, idx) => (
              <span
                key={idx}
                className="animate-lab-confetti absolute top-2 w-2.5 h-4 rounded-sm"
                style={{ left: c.left, backgroundColor: c.color, animationDelay: c.delay }}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
          aria-label="Закрыть сундук"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Unique Illustrated Chest */}
        <div className="pt-2 flex flex-col items-center gap-3">
          <div className={openedNow ? 'animate-lab-chest' : 'animate-lab-float'}>
            <ChestArtwork chestId={chest.id} opened={openedNow} className="w-24 h-24 rounded-3xl shadow-sm" />
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#04959A]">
              {openedNow ? 'Сундук открыт!' : 'Награда приключения'}
            </p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#26313B] mt-0.5">{chest.title}</h3>
            <p className="text-xs text-slate-500 mt-1">{chest.subtitle}</p>
          </div>
        </div>

        {!openedNow ? (
          <button
            type="button"
            onClick={handleOpen}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#F4C914] to-amber-400 hover:brightness-95 text-[#26313B] font-extrabold text-base shadow-md cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>ОТКРЫТЬ СУНДУК!</span>
          </button>
        ) : (
          <div className="animate-lab-enter space-y-3 text-left">
            <div className="rounded-2xl bg-gradient-to-r from-cyan-50 to-amber-50 border border-[#06B8BE]/35 p-3.5 flex items-center gap-3.5">
              <ChestStickerArtwork chestId={chest.id} className="w-14 h-14 shrink-0" />
              <div>
                <p className="text-[11px] font-extrabold text-[#04959A]">Новый коллекционный стикер</p>
                <p className="text-sm font-extrabold text-[#26313B]">{chest.stickerTitle}</p>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">{chest.stickerNote}</p>
              </div>
            </div>

            <MemeReactionCard memeId={chestMeme.id} compact />

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 flex items-center gap-3">
              <SafeImage
                src={
                  chest.isGrandFinal
                    ? CYBERBOT_EMOTION_IMAGES.victory
                    : CYBERBOT_EMOTION_IMAGES.joy
                }
                alt="КиберБот радуется награде"
                fallbackTitle="КиберБот"
                className="w-12 h-12 rounded-xl bg-white border border-slate-200 object-contain shrink-0"
              />
              <p className="text-xs sm:text-sm font-medium text-[#26313B] leading-snug">
                {chest.cyberBotLine}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-[#06B8BE] hover:bg-[#04959A] text-white font-extrabold text-sm cursor-pointer"
            >
              Забрать награду и продолжить
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
