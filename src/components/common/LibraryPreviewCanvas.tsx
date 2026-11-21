import { ImageOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { BackgroundLibraryItem } from '../../config/backgroundLibrary';
import { recordDiagnosticError } from '../../utils/diagnostics';

interface LibraryPreviewCanvasProps {
  item: BackgroundLibraryItem;
  className?: string;
  onAvailabilityChange?: (available: boolean) => void;
}

/**
 * Честно отображает реальный файл из библиотеки фонов (previewAssetPath или filePath).
 * Если реального файла на диске ещё нет — показывает честный статус
 * «Изображение ещё не добавлено» без поддельной графики.
 */
export function LibraryPreviewCanvas({
  item,
  className = '',
  onAvailabilityChange,
}: LibraryPreviewCanvasProps) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing'>(
    item.previewAssetPath ? 'loading' : 'missing'
  );

  const imgSrc = item.previewAssetPath || item.filePath;

  useEffect(() => {
    if (item.previewAssetPath) {
      setStatus('loading');
      return;
    }

    let cancelled = false;
    setStatus('loading');

    fetch(item.filePath)
      .then((res) => {
        const ct = res.headers.get('content-type') || '';
        const ok = res.ok && ct.startsWith('image/');
        if (!cancelled) {
          if (!ok && item.assetExists) {
            recordDiagnosticError('image', `Отсутствует файл фона: ${item.title}`, item.filePath);
          }
          setStatus(ok ? 'ready' : 'missing');
          onAvailabilityChange?.(ok);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          if (item.assetExists) {
            recordDiagnosticError(
              'image',
              `Ошибка загрузки файла фона: ${item.title}`,
              `${item.filePath} (${err instanceof Error ? err.message : String(err)})`
            );
          }
          setStatus('missing');
          onAvailabilityChange?.(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [item.id, item.title, item.assetExists, item.previewAssetPath, item.filePath, onAvailabilityChange]);

  if (status === 'missing') {
    return (
      <div
        className={`w-full h-full bg-slate-100 border-b border-slate-200 flex flex-col items-center justify-center p-4 text-center ${className}`}
      >
        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-2 shadow-xs">
          <ImageOff className="w-5 h-5 text-slate-400" />
        </div>
        <p className="text-xs font-extrabold text-[#26313B]">Изображение ещё не добавлено</p>
        <p className="text-[11px] font-mono text-slate-500 mt-1 truncate max-w-full">{item.fileName}</p>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={item.title}
      referrerPolicy="no-referrer"
      onLoad={() => {
        setStatus('ready');
        onAvailabilityChange?.(true);
      }}
      onError={() => {
        recordDiagnosticError('image', `Не удалось отобразить фон: ${item.title}`, imgSrc);
        setStatus('missing');
        onAvailabilityChange?.(false);
      }}
      className={`w-full h-full object-cover ${className}`}
    />
  );
}
