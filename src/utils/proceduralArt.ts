import type { BackgroundLibraryItem } from '../config/backgroundLibrary';

/**
 * Проверяет, существует ли реальный файл изображения по URL
 * (используется для честной проверки каталога фонов без заглушек-подделок).
 */
export async function checkImageAssetExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.startsWith('image/')) {
      return true;
    }
    // Some static servers don't handle HEAD reliably; fallback to GET check
    const getRes = await fetch(url);
    const getType = getRes.headers.get('content-type') || '';
    return getRes.ok && getType.startsWith('image/');
  } catch {
    return false;
  }
}

/**
 * Скачивает ТОЛЬКО реальное существующее изображение фона в формате 1280×720 JPEG.
 * Если файл ещё не добавлен на диск — возвращает { ok: false }.
 */
export async function downloadBackgroundAsset(
  item: BackgroundLibraryItem,
  downloadAsFilename = 'background.jpg'
): Promise<{ ok: boolean; reason?: string }> {
  const candidates = [item.previewAssetPath, item.filePath].filter(Boolean) as string[];

  for (const candidateUrl of candidates) {
    try {
      const res = await fetch(candidateUrl);
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.startsWith('image/')) {
        continue;
      }
      const blob = await res.blob();
      const bitmap = await createImageBitmap(blob);
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      const scale = Math.max(1280 / bitmap.width, 720 / bitmap.height);
      const dw = bitmap.width * scale;
      const dh = bitmap.height * scale;
      ctx.drawImage(bitmap, (1280 - dw) / 2, (720 - dh) / 2, dw, dh);
      await triggerCanvasDownload(canvas, downloadAsFilename);
      return { ok: true };
    } catch {
      // Try next candidate
    }
  }

  return {
    ok: false,
    reason: 'Изображение для этого слота ещё не добавлено на диск.',
  };
}

function triggerCanvasDownload(canvas: HTMLCanvasElement, filename: string): Promise<void> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve();
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => {
          URL.revokeObjectURL(url);
          resolve();
        }, 1500);
      },
      'image/jpeg',
      0.92
    );
  });
}

export interface TransparencyInspection {
  hasTransparency: boolean;
  transparentRatio: number;
  opaqueWhiteCorners: boolean;
}

/**
 * Проверяет реальный альфа-канал загруженного PNG-файла персонажа.
 * Позволяет по-настоящему отличить прозрачный PNG из PhotoRoom от картинки с белым фоном.
 */
export async function inspectImageTransparency(dataUrl: string): Promise<TransparencyInspection> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const size = 96;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ hasTransparency: false, transparentRatio: 0, opaqueWhiteCorners: true });
          return;
        }
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;

        let transparentPixels = 0;
        const totalPixels = size * size;
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] < 245) {
            transparentPixels++;
          }
        }

        // Check 4 corners for opaque white background
        const cornerCoords = [
          [2, 2],
          [size - 3, 2],
          [2, size - 3],
          [size - 3, size - 3],
        ];
        let opaqueWhiteCount = 0;
        for (const [cx, cy] of cornerCoords) {
          const idx = (cy * size + cx) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];
          if (a >= 245 && r > 235 && g > 235 && b > 235) {
            opaqueWhiteCount++;
          }
        }

        const transparentRatio = transparentPixels / totalPixels;
        resolve({
          hasTransparency: transparentRatio >= 0.05,
          transparentRatio,
          opaqueWhiteCorners: opaqueWhiteCount >= 3 && transparentRatio < 0.05,
        });
      } catch {
        resolve({ hasTransparency: false, transparentRatio: 0, opaqueWhiteCorners: true });
      }
    };
    img.onerror = () => {
      resolve({ hasTransparency: false, transparentRatio: 0, opaqueWhiteCorners: true });
    };
    img.src = dataUrl;
  });
}
