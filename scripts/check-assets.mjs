import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src');
const PUBLIC_DIR = path.join(ROOT, 'public');
const MEDIA_ASSETS_FILE = path.join(SRC_DIR, 'config', 'mediaAssets.ts');
const BG_LIBRARY_FILE = path.join(SRC_DIR, 'config', 'backgroundLibrary.ts');

const errors = [];
let checkedImports = 0;
let checkedImages = 0;

function readFileSafe(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function hasExactCasePath(absTarget) {
  const rel = path.relative(ROOT, absTarget);
  const parts = rel.split(path.sep).filter(Boolean);
  let cur = ROOT;
  for (const part of parts) {
    if (!fs.existsSync(cur)) return false;
    const entries = fs.readdirSync(cur);
    if (!entries.includes(part)) return false;
    cur = path.join(cur, part);
  }
  return fs.existsSync(cur) && fs.statSync(cur).isFile();
}

function isValidImageFile(absTarget) {
  const ext = path.extname(absTarget).toLowerCase();
  const buf = fs.readFileSync(absTarget);
  if (buf.length < 12) return false;
  if (ext === '.jpg' || ext === '.jpeg') {
    return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  }
  if (ext === '.png') {
    return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  }
  if (ext === '.webp') {
    return buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP';
  }
  if (ext === '.svg') {
    return buf.toString('utf8').includes('<svg');
  }
  return false;
}

function collectSourceFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectSourceFiles(full));
    } else if (/\.(ts|tsx|js|jsx|html|css)$/i.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

// 1. Check all asset imports in mediaAssets.ts
const mediaSource = readFileSafe(MEDIA_ASSETS_FILE);
const importRegex = /^import\s+\w+\s+from\s+['"]([^'"]+\.(?:jpg|jpeg|png|webp|svg))['"];/gm;
let match;
while ((match = importRegex.exec(mediaSource)) !== null) {
  checkedImports += 1;
  const relImport = match[1];
  const resolved = path.resolve(path.dirname(MEDIA_ASSETS_FILE), relImport);
  const displayRel = path.relative(ROOT, resolved);
  if (!hasExactCasePath(resolved)) {
    errors.push(`Отсутствует или не совпадает регистр файла: ${displayRel} (импорт "${relImport}" в src/config/mediaAssets.ts)`);
    continue;
  }
  if (!isValidImageFile(resolved)) {
    errors.push(`Повреждённый формат изображения: ${displayRel}`);
    continue;
  }
  checkedImages += 1;
}

if (checkedImports === 0) {
  errors.push('В src/config/mediaAssets.ts не найдено ни одного ES-импорта изображений.');
}

// 2. Check all public assets if any exist and verify backgroundLibrary.ts
const bgSource = readFileSafe(BG_LIBRARY_FILE);
const itemBlocks = bgSource.split(/\{\s*id:\s*'/).slice(1);
for (const block of itemBlocks) {
  const idMatch = block.match(/^([^']+)'/);
  const existsMatch = block.match(/assetExists:\s*(true|false)/);
  const filePathMatch = block.match(/fileName:\s*'([^']+)'/);
  const genreMatch = block.match(/genre:\s*'([^']+)'/);
  const hasPreview = /previewAssetPath:\s*[^,\n]+/.test(block);
  if (!idMatch || !existsMatch) continue;

  const id = idMatch[1];
  const assetExists = existsMatch[1] === 'true';
  if (assetExists && !hasPreview && genreMatch && filePathMatch) {
    const expectedPublicFile = path.join(PUBLIC_DIR, 'library', 'backgrounds', genreMatch[1], filePathMatch[1]);
    checkedImports += 1;
    if (!hasExactCasePath(expectedPublicFile)) {
      errors.push(
        `Для карточки фона "${id}" указано assetExists: true, но отсутствует файл ${path.relative(ROOT, expectedPublicFile)}`
      );
    } else if (!isValidImageFile(expectedPublicFile)) {
      errors.push(`Повреждённый файл фона: ${path.relative(ROOT, expectedPublicFile)}`);
    } else {
      checkedImages += 1;
    }
  }
}

// 3. Scan src/ and index.html for forbidden paths/URLs/secrets
const scanFiles = [...collectSourceFiles(SRC_DIR), path.join(ROOT, 'index.html')];
const forbiddenPatterns = [
  { name: 'Абсолютный путь /src/assets/', regex: /['"`]\/src\/assets\//g },
  { name: 'Жёсткий путь /library/ без BASE_URL', regex: /['"`]\/library\//g },
  { name: 'Временный домен Google AI Studio / Cloud Run', regex: /run\.app|aistudio\.google/gi },
  { name: 'Ссылка на localhost в исходном коде', regex: /https?:\/\/(?:localhost|127\.0\.0\.1)/gi },
  { name: 'Возможный захардкоженный API-ключ', regex: /(?:AIza[0-9A-Za-z_-]{20,}|sk-[0-9A-Za-z]{20,}|ghp_[0-9A-Za-z]{20,})/g },
];

for (const file of scanFiles) {
  const text = readFileSafe(file);
  const rel = path.relative(ROOT, file);
  for (const rule of forbiddenPatterns) {
    if (rule.regex.test(text)) {
      errors.push(`${rule.name} обнаружен в файле: ${rel}`);
    }
  }
}

console.log('=== PRE-BUILD ASSET & PATH CHECK ===');
console.log(`Проверено импортов ресурсов: ${checkedImports}`);
console.log(`Проверено локальных изображений: ${checkedImages}`);
console.log(`Проверено исходных файлов: ${scanFiles.length}`);

if (errors.length > 0) {
  console.error('\nОШИБКИ ПРОВЕРКИ РЕСУРСОВ:');
  for (const err of errors) {
    console.error(` - ${err}`);
  }
  process.exit(1);
}

console.log('Статус: ВСЕ РЕСУРСЫ И ПУТИ ВАЛИДНЫ.\n');
