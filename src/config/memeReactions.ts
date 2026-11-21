export type MemeSceneKey =
  | 'first_run'
  | 'five_bugs'
  | 'white_box'
  | 'ai_code'
  | 'game_alive'
  | 'plot_twist'
  | 'prompt_pro'
  | 'pycharm_run'
  | 'png_magic'
  | 'chest_loot'
  | 'zero_errors'
  | 'game_creator';

export interface MemeReaction {
  id: string;
  sceneKey: MemeSceneKey;
  badge: string;
  title: string;
  caption: string;
  accentHex: string;
}

export const MEME_REACTIONS: MemeReaction[] = [
  {
    id: 'meme_first_run',
    sceneKey: 'first_run',
    badge: 'Реакция разработчика',
    title: 'Когда Python запустился с первого раза',
    caption: 'Ни одной красной строки в консоли — это точно магия или очень точный промпт!',
    accentHex: '#10B981',
  },
  {
    id: 'meme_five_bugs',
    sceneKey: 'five_bugs',
    badge: 'Будни программиста',
    title: 'Когда нашёл одну ошибку, а их оказалось пять',
    caption: 'Спокойно! Настоящий разработчик просто чинит их по одной в том же чате с ИИ.',
    accentHex: '#F59E0B',
  },
  {
    id: 'meme_white_box',
    sceneKey: 'white_box',
    badge: 'Анти-мем спрайта',
    title: 'Когда забыл удалить белый фон в PhotoRoom',
    caption: 'Герой путешествует по космосу внутри загадочного белого холодильника… срочно жмём PNG!',
    accentHex: '#06B8BE',
  },
  {
    id: 'meme_ai_code',
    sceneKey: 'ai_code',
    badge: 'Vibe Coding Level UP',
    title: 'Когда ИИ написал код, а ты понял, как он работает',
    caption: 'Теперь ты не просто нажимаешь Run — ты реально управляешь окном Pygame и ветками if!',
    accentHex: '#06B8BE',
  },
  {
    id: 'meme_game_alive',
    sceneKey: 'game_alive',
    badge: 'Эпик момент',
    title: 'Когда твоя игра реально заработала!',
    caption: 'Фон на месте, герой стоит чисто, кнопки кликаются — с нуля за 60 минут!',
    accentHex: '#F4C914',
  },
  {
    id: 'meme_plot_twist',
    sceneKey: 'plot_twist',
    badge: 'Сюжетный поворот',
    title: 'Когда игрок выбрал кнопку Б — и всё пошло не по плану',
    caption: 'Две разные концовки заставляют друзей перепроходить твою новеллу снова и снова.',
    accentHex: '#7C3AED',
  },
  {
    id: 'meme_prompt_pro',
    sceneKey: 'prompt_pro',
    badge: 'Сила промпта',
    title: 'Когда дописал «формат 16:9, без людей» и фон вышел идеально',
    caption: 'Точный запрос экономит три попытки генерации за один клик.',
    accentHex: '#06B8BE',
  },
  {
    id: 'meme_pycharm_run',
    sceneKey: 'pycharm_run',
    badge: 'Проверка путей',
    title: 'Когда вспомнил положить картинки именно в папку images/',
    caption: 'FileNotFoundError больше не пройдёт — порядок в папках спасает нервы.',
    accentHex: '#10B981',
  },
  {
    id: 'meme_png_magic',
    sceneKey: 'png_magic',
    badge: 'Альфа-канал ОК',
    title: 'Магия прозрачного PNG: герой как влитой на фоне!',
    caption: 'Клеточки прозрачности подтверждены — никаких белых прямоугольников на сцене.',
    accentHex: '#10B981',
  },
  {
    id: 'meme_chest_loot',
    sceneKey: 'chest_loot',
    badge: 'Награда открыта',
    title: 'Тот самый взгляд, когда открыл секретный сундук на уроке',
    caption: 'Новый стикер в коллекции и +1 шаг к званию создателя игры!',
    accentHex: '#F4C914',
  },
  {
    id: 'meme_zero_errors',
    sceneKey: 'zero_errors',
    badge: 'Финальный тест',
    title: 'Оба финала проверены, русский шрифт читается — можно на релиз!',
    caption: 'Официально: твоя визуальная новелла готова к показу всему классу.',
    accentHex: '#06B8BE',
  },
  {
    id: 'meme_game_creator',
    sceneKey: 'game_creator',
    badge: 'Режим геймдизайнера',
    title: 'До урока: «Сделать игру сложно». После урока: «А можно добавить 3-й финал?»',
    caption: 'Добро пожаловать в клуб создателей игр KIBERONE!',
    accentHex: '#F4C914',
  },
];

export function getMemeReaction(id: string): MemeReaction {
  return MEME_REACTIONS.find((m) => m.id === id) || MEME_REACTIONS[0];
}

export function getMemeForChest(chestId: string): MemeReaction {
  switch (chestId) {
    case 'chest_1':
      return getMemeReaction('meme_plot_twist');
    case 'chest_2':
      return getMemeReaction('meme_png_magic');
    case 'chest_3':
      return getMemeReaction('meme_first_run');
    case 'chest_final':
      return getMemeReaction('meme_game_alive');
    default:
      return getMemeReaction('meme_chest_loot');
  }
}
