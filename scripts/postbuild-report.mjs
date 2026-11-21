import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DIST_DIR = path.join(ROOT, 'dist');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');
const EXPECTED_BASE = process.env.GITHUB_ACTIONS === 'true' ? '/kiberone-game-creator-adventure/' : '/';

const errors = [];

function walkFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkFiles(full));
    } else {
      out.push(full);
    }
  }
  return out;
}

if (!fs.existsSync(DIST_DIR)) {
  errors.push('Папка dist/ не создана.');
}
if (!fs.existsSync(INDEX_HTML)) {
  errors.push('Главный файл dist/index.html отсутствует.');
}

const allDistFiles = walkFiles(DIST_DIR);
const totalBytes = allDistFiles.reduce((acc, f) => acc + fs.statSync(f).size, 0);
const imageFiles = allDistFiles.filter((f) => /\.(jpg|jpeg|png|webp|svg)$/i.test(f));
const jsFiles = allDistFiles.filter((f) => /\.js$/i.test(f));
const cssFiles = allDistFiles.filter((f) => /\.css$/i.test(f));

if (jsFiles.length === 0) errors.push('В dist/assets не найдено ни одного JS-бандла.');
if (cssFiles.length === 0) errors.push('В dist/assets не найдено ни одного CSS-файла.');
if (imageFiles.length < 17) {
  errors.push(`Ожидалось минимум 17 изображений в dist/, найдено: ${imageFiles.length}`);
}

let basePathStatus = 'OK';
if (fs.existsSync(INDEX_HTML)) {
  const html = fs.readFileSync(INDEX_HTML, 'utf8');
  const scriptMatch = html.match(/src="([^"]+\.js)"/);
  const cssMatch = html.match(/href="([^"]+\.css)"/);

  for (const assetUrl of [scriptMatch?.[1], cssMatch?.[1]].filter(Boolean)) {
    if (!assetUrl.startsWith(EXPECTED_BASE)) {
      basePathStatus = `MISMATCH (ожидался ${EXPECTED_BASE}, получено ${assetUrl})`;
      errors.push(`Неверный базовый путь в dist/index.html: ${assetUrl} (ожидался префикс ${EXPECTED_BASE})`);
    }
    const relFile = assetUrl.slice(EXPECTED_BASE.length);
    const resolvedDistFile = path.join(DIST_DIR, relFile);
    if (!fs.existsSync(resolvedDistFile)) {
      errors.push(`Ссылка из dist/index.html указывает на несуществующий файл: ${resolvedDistFile}`);
    }
  }
}

// Verify built assets (HTML/JS/CSS) contain zero leaked localhost, AI Studio URLs, or /src/assets/ paths
const textBundleFiles = [INDEX_HTML, ...jsFiles, ...cssFiles].filter((f) => fs.existsSync(f));
for (const file of textBundleFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const rel = path.relative(ROOT, file);
  if (/https?:\/\/(?:localhost|127\.0\.0\.1)/i.test(content)) {
    errors.push(`В собранном файле обнаружен localhost: ${rel}`);
  }
  if (/run\.app|aistudio\.google/i.test(content)) {
    errors.push(`В собранном файле обнаружена ссылка AI Studio / Cloud Run: ${rel}`);
  }
  if (/["'`]\/src\/assets\//i.test(content)) {
    errors.push(`В собранном файле остался несобранный путь /src/assets/: ${rel}`);
  }
}

// Verify Vite asset references inside JS bundles exist in dist/assets
if (fs.existsSync(ASSETS_DIR)) {
  const emittedAssetNames = new Set(fs.readdirSync(ASSETS_DIR));
  for (const jsFile of jsFiles) {
    const code = fs.readFileSync(jsFile, 'utf8');
    const referencedAssets = code.match(/[A-Za-z0-9_.-]+\.(?:jpg|jpeg|png|webp)/g) || [];
    for (const assetName of referencedAssets) {
      if (/^(?:background|character|hero)\.jpe?g$|^character\.png$/i.test(assetName)) continue;
      if (assetName.includes('-') && !emittedAssetNames.has(assetName)) {
        errors.push(`В JS-бандле найден отсутствующий файл из assets: ${assetName}`);
      }
    }
  }
}

console.log('=== POST-BUILD DIAGNOSTIC REPORT ===');
console.log(`Главный index.html: ${fs.existsSync(INDEX_HTML) ? 'OK (dist/index.html)' : 'MISSING'}`);
console.log(`JS-бандлов: ${jsFiles.length}, CSS-файлов: ${cssFiles.length}`);
console.log(`Найденных изображений в сборке (dist/): ${imageFiles.length}`);
console.log(`Всего файлов в dist/: ${allDistFiles.length}`);
console.log(`Размер итоговой сборки dist/: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB (${totalBytes} байт)`);
console.log(`Базовый путь сборки: "${EXPECTED_BASE}" — ${basePathStatus}`);
console.log(`Отсутствующие ресурсы / ошибки: ${errors.length}`);

if (errors.length > 0) {
  console.error('\nКРИТИЧЕСКИЕ ОШИБКИ СБОРКИ:');
  for (const e of errors) {
    console.error(` - ${e}`);
  }
  process.exit(1);
}

console.log('Статус: ПРОЕКТ ПРОШЁЛ ПОСТ-СБОРОЧНУЮ ПРОВЕРКУ.\n');
