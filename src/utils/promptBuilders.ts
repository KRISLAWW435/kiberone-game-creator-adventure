import { getGenreLabel, getStyleLabel, getStylePromptPhrase } from '../config/mediaAssets';
import type { ArtStyleId, BackgroundPromptDesign, CharacterDesign, GenreId, StoryDesign } from '../types/lesson';

export function buildAiScriptPrompt(story: StoryDesign, styleId: ArtStyleId = 'anime'): string {
  const genreName = story.genre ? getGenreLabel(story.genre) : 'Приключения';
  const styleName = getStyleLabel(styleId);
  const titleHint = story.gameTitle.trim()
    ? `Рабочее название: «${story.gameTitle.trim()}»`
    : 'Предложи 1 короткое рабочее название (финальное название автор выберет после сборки игры)';
  const setting = story.setting.trim() || 'Необычная локация (укажи атмосферу)';
  const atmosphere = story.atmosphere.trim() || 'Загадочная и увлекательная';
  const protagonist = story.protagonist.trim() || 'Подросток-исследователь';
  const problem = story.problem.trim() || 'Произошло странное событие, которое нужно срочно распутать';
  const goal = story.goal.trim() || 'Найти разгадку и выбраться из ситуации';
  const unusualEvent = story.unusualEvent.trim() || 'Неожиданная находка меняет привычный ход дел';
  const choiceOne = story.choiceOne.trim() || 'Действовать смело и напрямую';
  const choiceTwo = story.choiceTwo.trim() || 'Действовать осторожно и изучить детали';
  const endingOne = story.endingOne.trim() || 'Успешный, но неожиданный финал после смелого решения';
  const endingTwo = story.endingTwo.trim() || 'Альтернативный финал после осторожного расследования';
  const customIdea = story.customIdea.trim() ? `\n- Дополнительная идея автора: ${story.customIdea.trim()}` : '';

  return `Ты — сценарист коротких визуальных новелл для подростков 12–15 лет.
Напиши короткий, динамичный сценарий игры на русском языке, который можно реализовать на одном 60-минутном уроке.

Исходные параметры от автора:
- Жанр: ${genreName}
- Визуальный стиль игры: ${styleName}
- ${titleHint}
- Место действия: ${setting}
- Атмосфера: ${atmosphere}
- Главный герой: ${protagonist}
- Проблема: ${problem}
- Цель героя: ${goal}
- Необычное событие: ${unusualEvent}
- Первый вариант выбора игрока: ${choiceOne}
- Второй вариант выбора игрока: ${choiceTwo}
- Идея для Финала 1: ${endingOne}
- Идея для Финала 2: ${endingTwo}${customIdea}

Строгие требования к формату ответа:
1. Рабочее название игры.
2. Краткое описание (2–3 предложения).
3. Вступление (2–3 коротких предложения, задающих сцену).
4. Основной диалог до развилки: ровно 5–7 коротких реплик (каждая реплика — 1–2 предложения, чтобы текст легко помещался в диалоговом окне игры).
5. Развилка с двумя чёткими кнопками выбора (Вариант 1 и Вариант 2).
6. Два логичных, заметно отличающихся друг от друга финала:
   - Финал 1 (если выбран Вариант 1): 3–4 коротких реплики.
   - Финал 2 (если выбран Вариант 2): 3–4 коротких реплики.

Пиши живо, понятно и без лишней воды. Каждая реплика должна быть в формате «Имя: текст».`;
}

export function buildBackgroundPrompt(bg: BackgroundPromptDesign, genre?: GenreId | ''): string {
  const stylePhrase = getStylePromptPhrase(bg.artStyle);
  const genreLine = genre ? `\nЖанр игры: ${getGenreLabel(genre)}.` : '';
  const location = bg.location.trim() || 'уютная современная комната или необычная локация';
  const timeOfDay = bg.timeOfDay.trim() || 'вечер на закате';
  const weather = bg.weather.trim() || 'ясная спокойная погода';
  const atmosphere = bg.atmosphere.trim() || 'загадочная и вдохновляющая атмосфера';
  const keyObjects = bg.keyObjects.trim() || 'несколько характерных деталей окружения на среднем плане';
  const palette = bg.colorPalette.trim() || 'глубокие синие, бирюзовые и тёплые золотистые акценты';
  const extra = bg.extraDetails.trim() ? ` Дополнительные детали: ${bg.extraDetails.trim()}.` : '';

  return `Фон для визуальной новеллы ${stylePhrase}.${genreLine}
Локация: ${location}.
Время суток: ${timeOfDay}. Погода: ${weather}.
Атмосфера сцены: ${atmosphere}.
Ключевые объекты в кадре: ${keyObjects}.
Цветовая палитра: ${palette}.${extra}

Обязательные технические требования к изображению:
- Строго горизонтальный формат 16:9 (1280×720).
- Полное отсутствие людей, животных и любых персонажей в кадре.
- Никакого текста, букв, надписей, водяных знаков и логотипов.
- Нижняя треть кадра должна быть относительно спокойной и свободной для размещения диалогового окна интерфейса.
- Чистая, выразительная композиция с хорошим освещением.`;
}

export function buildCharacterPrompt(ch: CharacterDesign, styleOverride?: ArtStyleId): string {
  const stylePhrase = getStylePromptPhrase(styleOverride || ch.artStyle);
  const nameAndRole = [ch.name.trim(), ch.role.trim()].filter(Boolean).join(', ') || 'главный герой визуальной новеллы';
  const gender = ch.gender.trim() || 'подросток';
  const age = ch.age.trim() || '14 лет';
  const hairstyle = ch.hairstyle.trim() || 'аккуратная современная стрижка';
  const hairColor = ch.hairColor.trim() || 'тёмно-каштановые';
  const eyeColor = ch.eyeColor.trim() || 'яркие выразительные';
  const clothing = ch.clothing.trim() || 'стильная повседневная куртка, удобные брюки и кроссовки';
  const accessories = ch.accessories.trim() || 'небольшой рюкзак или наушники';
  const specialFeature = ch.specialFeature.trim() || 'дружелюбный уверенный взгляд';
  const personality = ch.personality.trim() || 'любознательный и смелый';

  return `Один игровой персонаж для визуальной новеллы (${nameAndRole}) ${stylePhrase}.
Параметры персонажа:
- Пол и возраст: ${gender}, ${age}.
- Внешность: причёска — ${hairstyle}, цвет волос — ${hairColor}, глаза — ${eyeColor}.
- Одежда: ${clothing}.
- Аксессуары: ${accessories}.
- Особая деталь внешности: ${specialFeature}.
- Характер и настроение: ${personality}, дружелюбная естественная поза.

Обязательные требования к генерации:
- Персонаж строго на ЧИСТОМ ОДНОТОННОМ БЕЛОМ ФОНЕ (#FFFFFF), без теней на полу и без фона окружения.
- Персонаж изображён В ПОЛНЫЙ РОСТ с головы до обуви.
- Руки, кисти, ноги и обувь видны полностью и не обрезаны краями кадра.
- Чёткий, понятный силуэт, удобный для вырезания фона.
- В кадре только ОДИН персонаж, без других людей, рамок, текста и лишних предметов вокруг.
- Сохраняй единый выбранный художественный стиль по всему рисунку.`;
}

export function buildCharacterEmotionRefPrompt(
  ch: CharacterDesign,
  emotion: string,
  styleOverride?: ArtStyleId
): string {
  const stylePhrase = getStylePromptPhrase(styleOverride || ch.artStyle);
  return `Используй прикреплённое изображение как строгий образец (референс) этого же персонажа.
Сохрани без изменений его лицо, причёску, цвет волос и глаз, одежду, аксессуары, пропорции и стиль (${stylePhrase}).
Измени ТОЛЬКО выражение лица и лёгкий жест рук на эмоцию: «${emotion}».
Обязательно оставь персонажа в полный рост на чистом белом фоне без лишних деталей и текста.`;
}

export function buildPythonGamePrompt(
  story: StoryDesign,
  character: CharacterDesign,
  finalScenario: string,
  allowFinalTitle = false
): string {
  const gameTitle =
    allowFinalTitle && story.gameTitle.trim()
      ? story.gameTitle.trim()
      : 'Визуальная новелла (рабочий прототип)';
  const charName = character.name.trim() || 'Герой';
  const trimmedScenario = finalScenario.trim();
  const scriptBlock = trimmedScenario
    ? `Вот готовый утверждённый сценарий игры (finalScenario), который нужно точно перенести в код:\n"""\n${trimmedScenario}\n"""`
    : `[ВНИМАНИЕ: Готовый сценарий на Этапе 4 ещё не вставлен! Вернись на Этап 4, получи сценарий у ИИ и вставь его в поле готового сценария.]`;

  return `Ты — опытный разработчик игр на Python и преподаватель для подростков.
Напиши ПОЛНЫЙ, полностью готовый к запуску код визуальной новеллы в ОДНОМ файле main.py на Python 3 с использованием библиотеки Pygame.

Данные игры:
- Рабочий заголовок окна игры: «${gameTitle}» (автор заменит на финальное название на последнем этапе)
- Имя главного персонажа: ${charName}
- Файл фона: images/background.jpg
- Файл персонажа (PNG с прозрачностью): images/character.png

${scriptBlock}

Строгие технические требования к коду main.py:
1. Используй только стандартные модули Python (os, sys) и библиотеку pygame. Никаких других сторонних библиотек!
2. Не добавляй музыку, звуковые файлы или сложную анимацию — всё должно работать надёжно и просто.
3. Размер окна: ровно 1000 × 600 пикселей. Заголовок окна — рабочий заголовок игры.
4. Загрузка картинок из папки images/ (images/background.jpg и images/character.png) с масштабированием:
   - фон растягивается под размер окна 1000 × 600;
   - персонаж аккуратно масштабируется по высоте (например, ~440–480 px) с сохранением пропорций и рисуется по центру или чуть правее/левее, чтобы не закрываться полностью диалоговым окном.
5. Обязательная обработка ошибок (try / except) при загрузке изображений: если файл не найден, игра НЕ должна падать — рисуй аккуратную цветную заглушку и выводи понятное сообщение в консоль.
6. Корректный русский текст: используй системный шрифт с поддержкой кириллицы (например, pygame.font.SysFont("arial", ...) или DejaVu Sans) и реализуй простой перенос длинных строк текста по словам внутри диалогового окна, чтобы текст не вылезал за края.
7. Игровые экраны и логика:
   - Стартовый экран с заголовком и кнопкой «Начать игру».
   - Игровой экран: фон + персонаж + полупрозрачное диалоговое окно внизу + рамка с именем персонажа + текст реплики + подсказка «Нажми пробел или кликни, чтобы продолжить».
   - Переключение реплик по клику мыши или клавише SPACE / ENTER.
   - На моменте развилки появляются две большие понятные кнопки выбора (Выбор 1 и Выбор 2).
   - После выбора показывается соответствующий финал (Финал 1 или Финал 2), отличающийся текстом.
   - На экране финала обязательно есть кнопка «Начать заново», которая возвращает игру на старт.
8. Добавь понятные комментарии на русском языке к основным частям кода (настройки, загрузка ресурсов, перенос текста, игровой цикл, экраны).

Выведи ПОЛНЫЙ готовый код файла main.py целиком без сокращений и без «...продолжите сами...», чтобы его можно было сразу скопировать в PyCharm и запустить.`;
}

export function buildBugFixPrompt(consoleError: string): string {
  const err = consoleError.trim() || '[Вставь сюда текст ошибки из красной консоли PyCharm]';
  return `При запуске моего файла main.py на Python + Pygame возникла ошибка.
Вот точный текст ошибки из консоли:

\`\`\`
${err}
\`\`\`

Пожалуйста:
1. Объясни простыми словами в 1–2 предложениях, почему возникла эта ошибка.
2. Исправь код и выведи ПОЛНЫЙ обновлённый файл main.py целиком, сохранив все мои диалоги, выборы, финалы и пути к файлам images/background.jpg и images/character.png.`;
}
