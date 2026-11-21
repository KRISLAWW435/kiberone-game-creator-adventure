import { X } from 'lucide-react';
import { useEffect } from 'react';
import { SafeImage } from './SafeImage';

interface ImageZoomModalProps {
  open: boolean;
  src: string;
  alt: string;
  caption?: string;
  onClose: () => void;
}

export function ImageZoomModal({ open, src, alt, caption, onClose }: ImageZoomModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt || 'Увеличенный просмотр изображения'}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-lab-enter relative w-full max-w-4xl max-h-[92vh] bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col gap-3"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-extrabold text-[#26313B] truncate">{alt}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть просмотр"
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#26313B] flex items-center justify-center cursor-pointer shrink-0 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 min-h-0 rounded-2xl bg-[#F4F8FB] border border-slate-200 p-3 flex items-center justify-center overflow-hidden">
          <SafeImage
            src={src}
            alt={alt}
            fallbackTitle={alt}
            referrerPolicy="no-referrer"
            className="max-h-[72vh] max-w-full w-auto h-auto object-contain object-center rounded-xl"
          />
        </div>

        {caption && (
          <p className="text-xs sm:text-sm text-slate-600 font-medium text-center leading-relaxed">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
