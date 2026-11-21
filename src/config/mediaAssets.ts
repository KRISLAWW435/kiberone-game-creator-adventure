import cyberbotJoyImg from '../assets/images/cyberbot_joy_1795280418655.jpg';
import cyberbotSupportImg from '../assets/images/cyberbot_support_1795280388333.jpg';
import cyberbotSurpriseImg from '../assets/images/cyberbot_surprise_1795280418467.jpg';
import cyberbotThinkingImg from '../assets/images/cyberbot_thinking_1795280419261.jpg';
import cyberbotVictoryImg from '../assets/images/cyberbot_victory_1795280417846.jpg';
import genreAdventureImg from '../assets/images/genre_adventure_1795271854603.jpg';
import genreFantasyImg from '../assets/images/genre_fantasy_1795271854276.jpg';
import genreModernImg from '../assets/images/genre_modern_1795271854234.jpg';
import genreMysteryImg from '../assets/images/genre_mystery_1795271854439.jpg';
import genreScifiImg from '../assets/images/genre_scifi_1795271855516.jpg';
import styleAnimeImg from '../assets/images/style_anime_single_1795276846004.jpg';
import styleCinematicImg from '../assets/images/style_cinematic_white_1795276845643.jpg';
import styleComicImg from '../assets/images/style_comic_1795271854534.jpg';
import styleHanddrawnImg from '../assets/images/style_handdrawn_single_1795280389185.jpg';
import stylePixelImg from '../assets/images/style_pixel_1795271854222.jpg';
import styleStylized3dImg from '../assets/images/style_stylized3d_1795271854276.jpg';
import vnDemoSceneImg from '../assets/images/vn_demo_scene_1795271854245.jpg';
import type { ArtStyleId, GenreId, MascotEmotion } from '../types/lesson';

export interface GenreMediaConfig {
  id: GenreId;
  label: string;
  subtitle: string;
  imagePath: string;
  accentHex: string;
  defaultSetting: string;
  defaultAtmosphere: string;
}

export interface StyleMediaConfig {
  id: ArtStyleId;
  label: string;
  shortDescription: string;
  promptPhrase: string;
  imagePath: string;
}

export const VN_DEMO_SCENE_PATH = vnDemoSceneImg;

export const CYBERBOT_EMOTION_IMAGES: Record<MascotEmotion, string> = {
  support: cyberbotSupportImg,
  joy: cyberbotJoyImg,
  surprise: cyberbotSurpriseImg,
  thinking: cyberbotThinkingImg,
  victory: cyberbotVictoryImg,
};

export const GENRE_CARDS: GenreMediaConfig[] = [
  {
    id: 'fantasy',
    label: 'Фэнтези',
    subtitle: 'Магия, древние руины, артефакты и параллельные миры',
    imagePath: genreFantasyImg,
    accentHex: '#06B8BE',
    defaultSetting: 'Парящий остров с древней башней',
    defaultAtmosphere: 'Волшебная, таинственная, на закате',
  },
  {
    id: 'mystery',
    label: 'Мистика и детектив',
    subtitle: 'Тайны, расследования, странные улики и ночной город',
    imagePath: genreMysteryImg,
    accentHex: '#F4C914',
    defaultSetting: 'Старая городская библиотека ночью',
    defaultAtmosphere: 'Напряжённая, загадочная, туманный вечер',
  },
  {
    id: 'scifi',
    label: 'Научная фантастика',
    subtitle: 'Космос, нейросети, роботы и станции будущего',
    imagePath: genreScifiImg,
    accentHex: '#0EA5E9',
    defaultSetting: 'Орбитальная научная станция',
    defaultAtmosphere: 'Технологичная, прохладная, неоновая',
  },
  {
    id: 'adventure',
    label: 'Приключения',
    subtitle: 'Экспедиции, поиски кладов, испытания и открытия',
    imagePath: genreAdventureImg,
    accentHex: '#10B981',
    defaultSetting: 'Затерянный храм в горной долине',
    defaultAtmosphere: 'Яркая, динамичная, солнечное утро',
  },
  {
    id: 'modern',
    label: 'Современная история',
    subtitle: 'Школа, друзья, хакатоны, городские приключения',
    imagePath: genreModernImg,
    accentHex: '#3B82F6',
    defaultSetting: 'Крыша современной школы после уроков',
    defaultAtmosphere: 'Уютная, дружеская, тёплый вечер',
  },
];

export const ART_STYLE_CARDS: StyleMediaConfig[] = [
  {
    id: 'anime',
    label: 'Аниме',
    shortDescription: 'Чёткий контур, выразительные глаза, стиль современных аниме-новелл',
    promptPhrase: 'в стиле современной 2D аниме-иллюстрации с чётким контуром и мягкой цел-шейдинг покраской',
    imagePath: styleAnimeImg,
  },
  {
    id: 'pixel',
    label: 'Пиксель-арт',
    shortDescription: 'Атмосферная пиксельная графика 16-bit с чистыми деталями',
    promptPhrase: 'в стиле детализированного 16-bit Pixel Art с чёткими пикселями и насыщенной игровой палитрой',
    imagePath: stylePixelImg,
  },
  {
    id: 'stylized3d',
    label: '3D-мультфильм',
    shortDescription: 'Объёмная графика как в современных 3D-мультфильмах и играх',
    promptPhrase: 'в стиле современного стилизованного 3D-рендера как в анимационных фильмах, мягкий студийный свет',
    imagePath: styleStylized3dImg,
  },
  {
    id: 'comic',
    label: 'Комикс',
    shortDescription: 'Смелые чёрные контуры, динамичные тени и графический стиль',
    promptPhrase: 'в стиле современного графического комикса с выразительным тушевым контуром и контрастными тенями',
    imagePath: styleComicImg,
  },
  {
    id: 'cinematic',
    label: 'Кинематографичная иллюстрация',
    shortDescription: 'Живописная концепт-арт графика с глубоким светом и фактурой',
    promptPhrase: 'в стиле кинематографичной концепт-иллюстрации с реалистичными пропорциями и глубоким освещением',
    imagePath: styleCinematicImg,
  },
  {
    id: 'handdrawn',
    label: 'Авторская рисованная иллюстрация',
    shortDescription: 'Тёплая инди-графика с тушью, акварельными мазками и живым штрихом',
    promptPhrase: 'в стиле авторской рисованной инди-иллюстрации тушью и акварелью с выразительными живыми штрихами',
    imagePath: styleHanddrawnImg,
  },
];

export function getGenreLabel(id: GenreId | ''): string {
  return GENRE_CARDS.find((g) => g.id === id)?.label || 'Не выбран';
}

export function getStyleLabel(id: ArtStyleId): string {
  return ART_STYLE_CARDS.find((s) => s.id === id)?.label || 'Аниме';
}

export function getStylePromptPhrase(id: ArtStyleId): string {
  return ART_STYLE_CARDS.find((s) => s.id === id)?.promptPhrase || ART_STYLE_CARDS[0].promptPhrase;
}
