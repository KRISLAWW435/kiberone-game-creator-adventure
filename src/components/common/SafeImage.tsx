import { ImageOff } from 'lucide-react';
import { useEffect, useState, type ImgHTMLAttributes } from 'react';
import { recordDiagnosticError } from '../../utils/diagnostics';

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackTitle?: string;
  fallbackClassName?: string;
}

/**
 * Безопасный компонент изображения:
 * - при ошибке загрузки не показывает сломанную иконку браузера и не роняет экран;
 * - выводит аккуратный визуальный fallback с понятной подписью;
 * - записывает ошибку в диагностический журнал и console.error.
 */
export function SafeImage({
  src,
  alt,
  fallbackTitle,
  fallbackClassName = '',
  className = '',
  onError,
  ...rest
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-slate-100 text-slate-500 p-3 text-center rounded-xl border border-slate-200 ${fallbackClassName || className}`}
      >
        <ImageOff className="w-6 h-6 text-slate-400 shrink-0 mb-1" />
        <span className="text-[11px] font-bold text-[#26313B] leading-tight line-clamp-2">
          {fallbackTitle || alt || 'Изображение недоступно'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        setHasError(true);
        recordDiagnosticError('image', `Не удалось загрузить изображение: ${alt}`, src);
        onError?.(e);
      }}
      {...rest}
    />
  );
}
