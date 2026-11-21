import type { ArtStyleId, GenreId } from '../types/lesson';
import { GENRE_CARDS, VN_DEMO_SCENE_PATH } from './mediaAssets';

/**
 * Безопасно формирует URL для файлов из папки public/ с учётом Vite BASE_URL
 * (работает и на корневом '/', и на GitHub Pages '/kiberone-game-creator-adventure/').
 */
export function resolvePublicAssetPath(relativePath: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedRel = relativePath.replace(/^\/+/, '');
  return `${normalizedBase}${normalizedRel}`;
}

function getGenreAssetUrl(genreId: GenreId): string {
  return GENRE_CARDS.find((g) => g.id === genreId)?.imagePath || '';
}

/**
 * Единая конфигурация каталога фонов для Этапа 5.
 *
 * КАК ДОБАВИТЬ РЕАЛЬНЫЕ ИЗОБРАЖЕНИЯ В БИБЛИОТЕКУ:
 * 1. Поместите реальные файлы 1280x720 (.jpg или .png) в папку:
 *    public/library/backgrounds/<genre>/<filename>
 * 2. Добавьте объекты в массив BACKGROUND_LIBRARY_CATALOG ниже и укажите assetExists: true.
 * 3. Если файл для карточки ещё не добавлен на диск, приложение честно
 *    помечает ресурс как отсутствующий и НИКОГДА не подставляет картинку другого жанра или стиля.
 */

export const BACKGROUND_LIBRARY_FOLDERS: Record<GenreId, string> = {
  fantasy: resolvePublicAssetPath('library/backgrounds/fantasy'),
  mystery: resolvePublicAssetPath('library/backgrounds/mystery'),
  scifi: resolvePublicAssetPath('library/backgrounds/scifi'),
  adventure: resolvePublicAssetPath('library/backgrounds/adventure'),
  modern: resolvePublicAssetPath('library/backgrounds/modern'),
};

export interface BackgroundLibraryItem {
  id: string;
  title: string;
  genre: GenreId;
  style: ArtStyleId;
  aspectRatio: '16:9';
  fileName: string;
  filePath: string;
  /** Реально проверенный встроенный ассет из src/assets/images для этого точного жанра и стиля */
  previewAssetPath?: string;
  /** Статус наличия реального ресурса на диске */
  assetExists: boolean;
  palette: [string, string, string];
  sceneHint: 'city' | 'forest' | 'space' | 'interior' | 'ruins';
}

export const BACKGROUND_LIBRARY_CATALOG: BackgroundLibraryItem[] = [
  // ФЭНТЕЗИ
  {
    id: 'bg_fan_01',
    title: 'Парящая цитадель кристаллов',
    genre: 'fantasy',
    style: 'anime',
    aspectRatio: '16:9',
    fileName: 'fantasy_citadel_anime.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.fantasy}/fantasy_citadel_anime.jpg`,
    previewAssetPath: getGenreAssetUrl('fantasy'),
    assetExists: true,
    palette: ['#0f293a', '#06b8be', '#f4c914'],
    sceneHint: 'ruins',
  },
  {
    id: 'bg_fan_02',
    title: 'Волшебный лес светлячков',
    genre: 'fantasy',
    style: 'cinematic',
    aspectRatio: '16:9',
    fileName: 'fantasy_firefly_forest.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.fantasy}/fantasy_firefly_forest.jpg`,
    assetExists: false,
    palette: ['#0d2824', '#10b981', '#fde047'],
    sceneHint: 'forest',
  },
  {
    id: 'bg_fan_03',
    title: 'Зал древнего алхимика',
    genre: 'fantasy',
    style: 'stylized3d',
    aspectRatio: '16:9',
    fileName: 'fantasy_alchemy_hall.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.fantasy}/fantasy_alchemy_hall.jpg`,
    assetExists: false,
    palette: ['#231b2e', '#06b8be', '#f59e0b'],
    sceneHint: 'interior',
  },
  {
    id: 'bg_fan_04',
    title: 'Таверна у каменного моста',
    genre: 'fantasy',
    style: 'pixel',
    aspectRatio: '16:9',
    fileName: 'fantasy_bridge_pixel.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.fantasy}/fantasy_bridge_pixel.jpg`,
    assetExists: false,
    palette: ['#1e1b4b', '#38bdf8', '#fbbf24'],
    sceneHint: 'city',
  },
  {
    id: 'bg_fan_05',
    title: 'Врата небесного храма',
    genre: 'fantasy',
    style: 'comic',
    aspectRatio: '16:9',
    fileName: 'fantasy_sky_gate_comic.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.fantasy}/fantasy_sky_gate_comic.jpg`,
    assetExists: false,
    palette: ['#1e293b', '#06b8be', '#f4c914'],
    sceneHint: 'ruins',
  },
  {
    id: 'bg_fan_06',
    title: 'Лесная поляна с древними рунами',
    genre: 'fantasy',
    style: 'handdrawn',
    aspectRatio: '16:9',
    fileName: 'fantasy_runes_handdrawn.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.fantasy}/fantasy_runes_handdrawn.jpg`,
    assetExists: false,
    palette: ['#1e3a2f', '#10b981', '#fcd34d'],
    sceneHint: 'forest',
  },

  // МИСТИКА И ДЕТЕКТИВ
  {
    id: 'bg_mys_01',
    title: 'Туманная улица старого города',
    genre: 'mystery',
    style: 'cinematic',
    aspectRatio: '16:9',
    fileName: 'mystery_foggy_street.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.mystery}/mystery_foggy_street.jpg`,
    previewAssetPath: getGenreAssetUrl('mystery'),
    assetExists: true,
    palette: ['#111827', '#334155', '#f59e0b'],
    sceneHint: 'city',
  },
  {
    id: 'bg_mys_02',
    title: 'Ночной кабинет детектива',
    genre: 'mystery',
    style: 'comic',
    aspectRatio: '16:9',
    fileName: 'mystery_detective_office.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.mystery}/mystery_detective_office.jpg`,
    assetExists: false,
    palette: ['#18181b', '#06b8be', '#f4c914'],
    sceneHint: 'interior',
  },
  {
    id: 'bg_mys_03',
    title: 'Заброшенная станция метро',
    genre: 'mystery',
    style: 'anime',
    aspectRatio: '16:9',
    fileName: 'mystery_old_subway.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.mystery}/mystery_old_subway.jpg`,
    assetExists: false,
    palette: ['#0f172a', '#0ea5e9', '#eab308'],
    sceneHint: 'interior',
  },
  {
    id: 'bg_mys_04',
    title: 'Особняк на вершине холма',
    genre: 'mystery',
    style: 'stylized3d',
    aspectRatio: '16:9',
    fileName: 'mystery_hill_mansion.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.mystery}/mystery_hill_mansion.jpg`,
    assetExists: false,
    palette: ['#1e1b2e', '#475569', '#fbbf24'],
    sceneHint: 'ruins',
  },
  {
    id: 'bg_mys_05',
    title: 'Секретный архив с часами',
    genre: 'mystery',
    style: 'pixel',
    aspectRatio: '16:9',
    fileName: 'mystery_clock_archive.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.mystery}/mystery_clock_archive.jpg`,
    assetExists: false,
    palette: ['#1f2937', '#14b8a6', '#fde047'],
    sceneHint: 'interior',
  },
  {
    id: 'bg_mys_06',
    title: 'Старая библиотека при свете фонаря',
    genre: 'mystery',
    style: 'handdrawn',
    aspectRatio: '16:9',
    fileName: 'mystery_library_handdrawn.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.mystery}/mystery_library_handdrawn.jpg`,
    assetExists: false,
    palette: ['#1c1917', '#78716c', '#fbbf24'],
    sceneHint: 'interior',
  },

  // НАУЧНАЯ ФАНТАСТИКА
  {
    id: 'bg_sci_01',
    title: 'Мостик орбитальной станции',
    genre: 'scifi',
    style: 'anime',
    aspectRatio: '16:9',
    fileName: 'scifi_orbital_deck.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.scifi}/scifi_orbital_deck.jpg`,
    previewAssetPath: getGenreAssetUrl('scifi'),
    assetExists: true,
    palette: ['#0b132b', '#06b8be', '#67e8f9'],
    sceneHint: 'space',
  },
  {
    id: 'bg_sci_02',
    title: 'Лаборатория кибернетики',
    genre: 'scifi',
    style: 'stylized3d',
    aspectRatio: '16:9',
    fileName: 'scifi_cyber_lab.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.scifi}/scifi_cyber_lab.jpg`,
    assetExists: false,
    palette: ['#111827', '#06b8be', '#38bdf8'],
    sceneHint: 'interior',
  },
  {
    id: 'bg_sci_03',
    title: 'Неоновый мегаполис 2099',
    genre: 'scifi',
    style: 'pixel',
    aspectRatio: '16:9',
    fileName: 'scifi_neon_city_pixel.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.scifi}/scifi_neon_city_pixel.jpg`,
    assetExists: false,
    palette: ['#161426', '#06b8be', '#f4c914'],
    sceneHint: 'city',
  },
  {
    id: 'bg_sci_04',
    title: 'Купол марсианской базы',
    genre: 'scifi',
    style: 'cinematic',
    aspectRatio: '16:9',
    fileName: 'scifi_mars_dome.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.scifi}/scifi_mars_dome.jpg`,
    assetExists: false,
    palette: ['#2c1614', '#ea580c', '#38bdf8'],
    sceneHint: 'space',
  },
  {
    id: 'bg_sci_05',
    title: 'Серверная квантового ядра',
    genre: 'scifi',
    style: 'comic',
    aspectRatio: '16:9',
    fileName: 'scifi_quantum_core.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.scifi}/scifi_quantum_core.jpg`,
    assetExists: false,
    palette: ['#0f172a', '#22d3ee', '#facc15'],
    sceneHint: 'interior',
  },
  {
    id: 'bg_sci_06',
    title: 'Мастерская звездолётов наброском',
    genre: 'scifi',
    style: 'handdrawn',
    aspectRatio: '16:9',
    fileName: 'scifi_dock_handdrawn.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.scifi}/scifi_dock_handdrawn.jpg`,
    assetExists: false,
    palette: ['#0f172a', '#06b8be', '#fde047'],
    sceneHint: 'space',
  },

  // ПРИКЛЮЧЕНИЯ
  {
    id: 'bg_adv_01',
    title: 'Руины горной долины',
    genre: 'adventure',
    style: 'cinematic',
    aspectRatio: '16:9',
    fileName: 'adventure_valley_ruins.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.adventure}/adventure_valley_ruins.jpg`,
    previewAssetPath: getGenreAssetUrl('adventure'),
    assetExists: true,
    palette: ['#14362a', '#10b981', '#f4c914'],
    sceneHint: 'ruins',
  },
  {
    id: 'bg_adv_02',
    title: 'Лагерь исследователей у водопада',
    genre: 'adventure',
    style: 'anime',
    aspectRatio: '16:9',
    fileName: 'adventure_waterfall_camp.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.adventure}/adventure_waterfall_camp.jpg`,
    assetExists: false,
    palette: ['#0f3433', '#06b8be', '#fde047'],
    sceneHint: 'forest',
  },
  {
    id: 'bg_adv_03',
    title: 'Палуба парусного дирижабля',
    genre: 'adventure',
    style: 'stylized3d',
    aspectRatio: '16:9',
    fileName: 'adventure_airship_deck.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.adventure}/adventure_airship_deck.jpg`,
    assetExists: false,
    palette: ['#1e3a5f', '#38bdf8', '#fbbf24'],
    sceneHint: 'space',
  },
  {
    id: 'bg_adv_04',
    title: 'Хрустальная пещера с рекой',
    genre: 'adventure',
    style: 'pixel',
    aspectRatio: '16:9',
    fileName: 'adventure_crystal_cave.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.adventure}/adventure_crystal_cave.jpg`,
    assetExists: false,
    palette: ['#0f172a', '#06b8be', '#34d399'],
    sceneHint: 'ruins',
  },
  {
    id: 'bg_adv_05',
    title: 'Остров потерянных маяков',
    genre: 'adventure',
    style: 'comic',
    aspectRatio: '16:9',
    fileName: 'adventure_lighthouse_island.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.adventure}/adventure_lighthouse_island.jpg`,
    assetExists: false,
    palette: ['#0c4a6e', '#0ea5e9', '#facc15'],
    sceneHint: 'city',
  },
  {
    id: 'bg_adv_06',
    title: 'Тропа путешественника в горах',
    genre: 'adventure',
    style: 'handdrawn',
    aspectRatio: '16:9',
    fileName: 'adventure_trail_handdrawn.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.adventure}/adventure_trail_handdrawn.jpg`,
    assetExists: false,
    palette: ['#064e3b', '#10b981', '#facc15'],
    sceneHint: 'forest',
  },

  // СОВРЕМЕННАЯ ИСТОРИЯ
  {
    id: 'bg_mod_01',
    title: 'Школьный двор и терраса на закате',
    genre: 'modern',
    style: 'anime',
    aspectRatio: '16:9',
    fileName: 'modern_school_terrace.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.modern}/modern_school_terrace.jpg`,
    previewAssetPath: getGenreAssetUrl('modern'),
    assetExists: true,
    palette: ['#1e3a5f', '#10b981', '#f4c914'],
    sceneHint: 'city',
  },
  {
    id: 'bg_mod_02',
    title: 'Ночная обсерватория на крыше',
    genre: 'modern',
    style: 'anime',
    aspectRatio: '16:9',
    fileName: 'modern_rooftop_observatory.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.modern}/modern_rooftop_observatory.jpg`,
    previewAssetPath: VN_DEMO_SCENE_PATH,
    assetExists: true,
    palette: ['#161b33', '#06b8be', '#f4c914'],
    sceneHint: 'city',
  },
  {
    id: 'bg_mod_03',
    title: 'ИТ-коворкинг для хакатона',
    genre: 'modern',
    style: 'stylized3d',
    aspectRatio: '16:9',
    fileName: 'modern_it_coworking.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.modern}/modern_it_coworking.jpg`,
    assetExists: false,
    palette: ['#1e293b', '#06b8be', '#facc15'],
    sceneHint: 'interior',
  },
  {
    id: 'bg_mod_04',
    title: 'Уютная кофейня у метро',
    genre: 'modern',
    style: 'comic',
    aspectRatio: '16:9',
    fileName: 'modern_cozy_cafe.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.modern}/modern_cozy_cafe.jpg`,
    assetExists: false,
    palette: ['#292524', '#0ea5e9', '#f59e0b'],
    sceneHint: 'interior',
  },
  {
    id: 'bg_mod_05',
    title: 'Станция электрички летом',
    genre: 'modern',
    style: 'pixel',
    aspectRatio: '16:9',
    fileName: 'modern_train_station.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.modern}/modern_train_station.jpg`,
    assetExists: false,
    palette: ['#0f172a', '#10b981', '#fbbf24'],
    sceneHint: 'city',
  },
  {
    id: 'bg_mod_06',
    title: 'Школьный парк акварелью',
    genre: 'modern',
    style: 'handdrawn',
    aspectRatio: '16:9',
    fileName: 'modern_park_handdrawn.jpg',
    filePath: `${BACKGROUND_LIBRARY_FOLDERS.modern}/modern_park_handdrawn.jpg`,
    assetExists: false,
    palette: ['#1e293b', '#06b8be', '#f4c914'],
    sceneHint: 'city',
  },
];
