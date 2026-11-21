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
          hasTransparency: transparentRatio >= 0.03,
          transparentRatio,
          opaqueWhiteCorners: opaqueWhiteCount >= 3 && transparentRatio < 0.03,
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

/**
 * Готовит две честные растровые PNG-иллюстрации одного и того же персонажа:
 * 1) с настоящим прозрачным альфа-каналом (для демонстрации character.png);
 * 2) с непрозрачным белым прямоугольным фоном (для демонстрации ошибки .jpg).
 */
export async function createCharacterTransparencyDemos(
  imageUrl: string
): Promise<{ transparentPngUrl: string; whiteBoxUrl: string } | null> {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return null;
    const blob = await res.blob();
    const bitmap = await createImageBitmap(blob);

    const width = Math.min(320, bitmap.width);
    const height = Math.round((bitmap.height / bitmap.width) * width);

    // 1. White-box version (simulating non-transparent background)
    const whiteCanvas = document.createElement('canvas');
    whiteCanvas.width = width;
    whiteCanvas.height = height;
    const whiteCtx = whiteCanvas.getContext('2d');
    if (!whiteCtx) return null;
    whiteCtx.fillStyle = '#FFFFFF';
    whiteCtx.fillRect(0, 0, width, height);
    whiteCtx.drawImage(bitmap, 0, 0, width, height);
    const whiteBoxUrl = whiteCanvas.toDataURL('image/png');

    // 2. Transparent cutout version via edge flood-fill of light/neutral studio background
    const cutoutCanvas = document.createElement('canvas');
    cutoutCanvas.width = width;
    cutoutCanvas.height = height;
    const cutoutCtx = cutoutCanvas.getContext('2d');
    if (!cutoutCtx) return null;
    cutoutCtx.drawImage(bitmap, 0, 0, width, height);
    const imgData = cutoutCtx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // Sample corner color as background reference
    const cornerR = data[0];
    const cornerG = data[1];
    const cornerB = data[2];

    const isBackgroundPixel = (idx: number) => {
      const a = data[idx + 3];
      if (a < 30) return true;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const distCorner = Math.abs(r - cornerR) + Math.abs(g - cornerG) + Math.abs(b - cornerB);
      const isVeryLight = r > 228 && g > 228 && b > 228 && Math.max(r, g, b) - Math.min(r, g, b) < 26;
      return distCorner < 68 || isVeryLight;
    };

    const visited = new Uint8Array(width * height);
    const queue = new Int32Array(width * height);
    let head = 0;
    let tail = 0;

    const pushIfBg = (x: number, y: number) => {
      if (x < 0 || x >= width || y < 0 || y >= height) return;
      const pos = y * width + x;
      if (visited[pos]) return;
      if (isBackgroundPixel(pos * 4)) {
        visited[pos] = 1;
        queue[tail++] = pos;
      }
    };

    for (let x = 0; x < width; x++) {
      pushIfBg(x, 0);
      pushIfBg(x, height - 1);
    }
    for (let y = 0; y < height; y++) {
      pushIfBg(0, y);
      pushIfBg(width - 1, y);
    }

    while (head < tail) {
      const pos = queue[head++];
      data[pos * 4 + 3] = 0;
      const x = pos % width;
      const y = (pos - x) / width;
      pushIfBg(x + 1, y);
      pushIfBg(x - 1, y);
      pushIfBg(x, y + 1);
      pushIfBg(x, y - 1);
    }

    cutoutCtx.putImageData(imgData, 0, 0);
    const transparentPngUrl = cutoutCanvas.toDataURL('image/png');

    return { transparentPngUrl, whiteBoxUrl };
  } catch {
    return null;
  }
}
