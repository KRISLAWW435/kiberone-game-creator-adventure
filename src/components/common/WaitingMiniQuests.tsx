import { ArrowRight, CheckCircle2, Sparkles, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ART_STYLE_CARDS, CYBERBOT_EMOTION_IMAGES, GENRE_CARDS } from '../../config/mediaAssets';
import { SafeImage } from './SafeImage';

export interface MiniQuestItem {
  id: string;
  stageNumber: number;
  tag: string;
  title: string;
  codeSnippet?: string;
  imagePreview?: { src: string; caption: string };
  visualType?: 'transparency_compare' | 'aspect_ratio';
  question: string;
  options: Array<{ id: string; label: string; isCorrect: boolean }>;
  explanation: string;
  wrongHint: string;
  cyberBotCorrect: string;
  cyberBotWrong: string;
}

export const WAITING_MINI_QUESTS: MiniQuestItem[] = [
  // ЭТАП 1: Vibe Coding + Python разминка
  {
    id: 'q_s1_print',
    stageNumber: 1,
    tag: 'Этап 1 · Python',
    title: 'Что выведет эта команда?',
    codeSnippet: 'coins = 10\nprint("Монет:", coins + 5)',
    question: 'Какую строку напечатает Python при запуске?',
    options: [
      { id: 'a', label: 'Монет: 10 + 5', isCorrect: false },
      { id: 'b', label: 'Монет: 15', isCorrect: true },
      { id: 'c', label: 'Монет: 105', isCorrect: false },
    ],
    explanation: 'Python сначала вычислит выражение coins + 5 (получится 15), а затем напечатает: Монет: 15.',
    wrongHint: 'Обрати внимание: coins + 5 написано без кавычек, поэтому Python складывает числа, а не склеивает текст.',
    cyberBotCorrect: 'Точно в цель! С математикой и print() у тебя полный порядок.',
    cyberBotWrong: 'Подсказка от КиберБота: числа без кавычек Python сначала складывает!',
  },
  {
    id: 'q_s1_vibe',
    stageNumber: 1,
    tag: 'Этап 1 · Vibe Coding',
    title: 'Главное правило Vibe Coding',
    codeSnippet: '# Промпт: "Сделай игру про кота"',
    question: 'Что обязательно делает разработчик после того, как нейросеть выдала готовый код?',
    options: [
      { id: 'a', label: 'Запускает код, проверяет логику и сам понимает, как он работает', isCorrect: true },
      { id: 'b', label: 'Сразу закрывает редактор, не проверяя файл', isCorrect: false },
      { id: 'c', label: 'Переименовывает файл в random.txt', isCorrect: false },
    ],
    explanation: 'Вайб-кодинг работает в паре с проверкой: автор всегда тестирует и понимает код своей игры.',
    wrongHint: 'Вспомни: нейросеть пишет код быстро, но ответственность за запуск и проверку лежит на авторе игры.',
    cyberBotCorrect: 'Да! ИИ — помощник, а главный режиссёр игры — именно ты.',
    cyberBotWrong: 'Подумай: если не проверить код, игра может просто не запуститься или сделать не то!',
  },

  // ЭТАП 2: Жанр и стиль игры (исправлены контейнеры изображений object-contain!)
  {
    id: 'q_s2_guess_style',
    stageNumber: 2,
    tag: 'Этап 2 · Визуальный тест стиля',
    title: 'Угадай стиль по полному портрету героя',
    imagePreview: {
      src: ART_STYLE_CARDS.find((s) => s.id === 'handdrawn')?.imagePath || ART_STYLE_CARDS[0].imagePath,
      caption: 'Полный рост персонажа: посмотри на живой тушевый контур и тёплую акварельную покраску',
    },
    question: 'Какой художественный стиль изображён на этой карточке?',
    options: [
      { id: 'a', label: 'Пиксель-арт 16-bit', isCorrect: false },
      { id: 'b', label: 'Авторская рисованная иллюстрация', isCorrect: true },
      { id: 'c', label: 'Строгий 3D-рендер', isCorrect: false },
    ],
    explanation: 'Выразительный штрих пером и мягкие акварельные переходы — это Авторская рисованная иллюстрация.',
    wrongHint: 'Посмотри на контуры куртки и теней: здесь нет квадратных пикселей или пластикового 3D-объёма — это живой рисунок тушью и акварелью.',
    cyberBotCorrect: 'Глаз-алмаз! Сразу видно настоящего арт-директора.',
    cyberBotWrong: 'Присмотрись к текстуре краски на шарфе и штанах — это акварельные мазки!',
  },
  {
    id: 'q_s2_pixel_style',
    stageNumber: 2,
    tag: 'Этап 2 · Сравнение стилей',
    title: 'Определи стиль этого путешественника',
    imagePreview: {
      src: ART_STYLE_CARDS.find((s) => s.id === 'pixel')?.imagePath || ART_STYLE_CARDS[0].imagePath,
      caption: 'Обрати внимание на чёткую сетку цветных квадратиков по контуру героя',
    },
    question: 'Как называется такой стиль игровой графики?',
    options: [
      { id: 'a', label: 'Пиксель-арт', isCorrect: true },
      { id: 'b', label: 'Кинематографичная иллюстрация', isCorrect: false },
      { id: 'c', label: 'Акварельный комикс', isCorrect: false },
    ],
    explanation: 'Легендарный 16-bit Пиксель-арт строится из чётких пикселей и отлично подходит для ретро-приключений.',
    wrongHint: 'Присмотрись к краям рюкзака и карты в руках — изображение собрано из отдельных заметных пикселей-квадратиков.',
    cyberBotCorrect: 'Точно! 16-bit пиксели узнаются с первого взгляда.',
    cyberBotWrong: 'Ищи подсказку в квадратных «ступеньках» на контуре — так рисуют только в одном стиле.',
  },
  {
    id: 'q_s2_consistency',
    stageNumber: 2,
    tag: 'Этап 2 · Арт-дирекшн',
    title: 'Зачем единый стиль всей игре?',
    question: 'Что случится, если фон локации будет в Пиксель-арте, а герой — в 3D-мультфильме?',
    options: [
      { id: 'a', label: 'Персонаж и фон будут смотреться как детали из двух чужих игр', isCorrect: true },
      { id: 'b', label: 'Python откажется открывать окно Pygame', isCorrect: false },
      { id: 'c', label: 'Игра автоматически станет 3D-шутером', isCorrect: false },
    ],
    explanation: 'Единый стиль объединяет фон, героя и диалоги в цельный художественный мир.',
    wrongHint: 'Python спокойно загрузит любые две картинки, но визуально разные стили разрушат атмосферу игры.',
    cyberBotCorrect: 'В яблочко! Поэтому мы задаём стиль на Этапе 2 один раз для всей игры.',
    cyberBotWrong: 'Дело не в коде Python, а в том, как игрок воспринимает картинку глазами!',
  },

  // ЭТАП 3: Сюжет и развилки
  {
    id: 'q_s3_story_bug',
    stageNumber: 3,
    tag: 'Этап 3 · Логика сюжета',
    title: 'Найди нестыковку в сценарии',
    codeSnippet: 'Цель героя: починить школьный телескоп.\nВариант A: Пойти пить чай домой.\nВариант B: Посмотреть мемы в телефоне.',
    question: 'Что здесь не так со сценарием?',
    options: [
      { id: 'a', label: 'Оба выбора никак не ведут героя к его цели', isCorrect: true },
      { id: 'b', label: 'В новелле не бывает двух вариантов выбора', isCorrect: false },
      { id: 'c', label: 'Телескоп нельзя упоминать в тексте', isCorrect: false },
    ],
    explanation: 'Каждый выбор должен предлагать реальный способ приблизиться к цели героя и вести к своему последствию.',
    wrongHint: 'Проверь: оба варианта должны предлагать разные действия, которые могут привести героя к его цели.',
    cyberBotCorrect: 'Отлично замечено! Сюжетные кнопки должны реально двигать историю вперёд.',
    cyberBotWrong: 'Посмотри на цель героя и сравни её с тем, что делают варианты A и B!',
  },
  {
    id: 'q_s3_cliffhanger',
    stageNumber: 3,
    tag: 'Этап 3 · Драматургия',
    title: 'Выбери лучшую развилку',
    question: 'Какая пара кнопок даёт игроку самый интересный и осмысленный выбор?',
    options: [
      { id: 'a', label: '«Пойти направо» и «Пойти чуть правее»', isCorrect: false },
      { id: 'b', label: '«Рискнуть и открыть дверь» vs «Обойти через вентиляцию»', isCorrect: true },
      { id: 'c', label: '«Да» и «Хорошо»', isCorrect: false },
    ],
    explanation: 'Настоящая развилка — это разные стратегии поведения, которые логично ведут к разным финалам.',
    wrongHint: 'Если обе кнопки означают почти одно и то же («Да» и «Хорошо»), игроку неинтересно выбирать.',
    cyberBotCorrect: 'Супер! Разные действия = два запоминающихся финала.',
    cyberBotWrong: 'Хорошая развилка даёт игроку два действительно отличающихся пути!',
  },

  // ЭТАП 4: Промпт и готовый сценарий
  {
    id: 'q_s4_weak_prompt',
    stageNumber: 4,
    tag: 'Этап 4 · Промпт-инжиниринг',
    title: 'Почему нейросеть ответила скучно?',
    codeSnippet: 'Промпт ученика: "Напиши историю про космос"',
    question: 'Чего не хватает этому запросу, чтобы получился сценарий для нашей игры?',
    options: [
      { id: 'a', label: 'Не указаны герой, короткий формат реплик, развилка из 2 кнопок и 2 финала', isCorrect: true },
      { id: 'b', label: 'В промпте не написано слово "пожалуйста" 5 раз', isCorrect: false },
      { id: 'c', label: 'Нейросети не умеют писать про космос', isCorrect: false },
    ],
    explanation: 'Чёткие требования к структуре (вступление, реплики «Имя: текст», 2 выбора, 2 финала) дают сценарий, готовый для кода.',
    wrongHint: 'Без указания формата «Имя: текст» и двух концовок ИИ напишет обычный длинный рассказ без развилок.',
    cyberBotCorrect: 'Верно! Чем точнее структура промпта — тем легче перенести сценарий в Python.',
    cyberBotWrong: 'Подумай, что именно нужно программе на Этапе 8: диалоги, кнопки и 2 финала!',
  },
  {
    id: 'q_s4_final_vs_prompt',
    stageNumber: 4,
    tag: 'Этап 4 · Передача данных',
    title: 'Что пойдёт в Python на Этапе 8?',
    question: 'Какой текст нужно обязательно вставить в правое поле на Этапе 4?',
    options: [
      { id: 'a', label: 'Окончательный готовый сценарий с диалогами и 2 финалами от ИИ', isCorrect: true },
      { id: 'b', label: 'Свой же исходный промпт-инструкцию', isCorrect: false },
      { id: 'c', label: 'Только одно слово названия игры', isCorrect: false },
    ],
    explanation: 'На Этап 8 передаётся только finalScenario — готовый текст с репликами и концовками.',
    wrongHint: 'Если передать в Python саму инструкцию-промпт вместо готового сценария, в игре не будет реальных диалогов!',
    cyberBotCorrect: 'Именно так! Готовый сценарий — топливо для нашего main.py.',
    cyberBotWrong: 'Проверь: в игру попадают реальные реплики от DeepSeek или Qwen, а не задание-промпт.',
  },

  // ЭТАП 5: Локация и фон 16:9
  {
    id: 'q_s5_genre_match',
    stageNumber: 5,
    tag: 'Этап 5 · Визуальный тест',
    title: 'Подбери жанр к сцене',
    imagePreview: {
      src: GENRE_CARDS.find((g) => g.id === 'scifi')?.imagePath || GENRE_CARDS[0].imagePath,
      caption: 'Оцени детали окружения: иллюминаторы в космос, пульт управления и парящая станция',
    },
    question: 'Для какого жанра и стиля создана эта игровая локация?',
    options: [
      { id: 'a', label: 'Научная фантастика · Аниме', isCorrect: true },
      { id: 'b', label: 'Исторический детектив XIX века', isCorrect: false },
      { id: 'c', label: 'Средневековая деревня', isCorrect: false },
    ],
    explanation: 'Панели управления, иллюминаторы на орбиту и чистый контур идеально подходят для научной фантастики в стиле Аниме.',
    wrongHint: 'Посмотри в огромное окно за консолью: там планета и туманность космоса!',
    cyberBotCorrect: 'Точно! Сразу видно орбитальную станцию будущего.',
    cyberBotWrong: 'Посмотри за окно на этой картинке — там звёзды и планета!',
  },
  {
    id: 'q_s5_aspect',
    stageNumber: 5,
    tag: 'Этап 5 · Композиция 16:9',
    title: 'Какой формат нужен фону?',
    visualType: 'aspect_ratio',
    question: 'Почему для окна 1000×600 нельзя брать вертикальный фон 9:16 с телефона?',
    options: [
      { id: 'a', label: 'Он либо сильно растянется и исказится, либо оставит пустые полосы по краям', isCorrect: true },
      { id: 'b', label: 'На вертикальных картинках не работают цвета', isCorrect: false },
      { id: 'c', label: 'Pygame переворачивает их вверх ногами', isCorrect: false },
    ],
    explanation: 'Окно новеллы горизонтальное (16:9), поэтому фон тоже должен быть широким 16:9.',
    wrongHint: 'Сравни на схеме ширину зелёного и красного прямоугольников: узкая картинка не закроет широкое окно без искажений.',
    cyberBotCorrect: 'Да! Горизонтальный кадр 16:9 идеально ложится в окно игры.',
    cyberBotWrong: 'Сравни форму окна игры (горизонталь) и экрана телефона (вертикаль)!',
  },

  // ЭТАП 6: Создание персонажа
  {
    id: 'q_s6_prompt_bug',
    stageNumber: 6,
    tag: 'Этап 6 · Проверка промпта',
    title: 'Найди ошибку в запросе на героя',
    codeSnippet: '"Крутой хакер в тёмной комнате с мониторами, видны только плечи"',
    question: 'Что здесь помешает аккуратно вырезать персонажа для новеллы?',
    options: [
      { id: 'a', label: 'Тёмная комната вместо чистого белого фона (#FFFFFF) и обрезанный рост', isCorrect: true },
      { id: 'b', label: 'Слово "хакер" запрещено в генераторах', isCorrect: false },
      { id: 'c', label: 'Нужно добавить ещё 5 случайных людей рядом', isCorrect: false },
    ],
    explanation: 'Однотонный белый фон #FFFFFF и полный рост позволяют вырезать силуэт за 1 клик без лишних объектов.',
    wrongHint: 'Подумай об Этапе 7 (PhotoRoom): с тёмного фона со столами и мониторами вырезать героя чисто намного сложнее, чем с белого!',
    cyberBotCorrect: 'Супер! Чистый белый фон + полный рост = идеальный спрайт.',
    cyberBotWrong: 'Вспомни требования для вырезания фона: что должно быть позади героя?',
  },
  {
    id: 'q_s6_emotions',
    stageNumber: 6,
    tag: 'Этап 6 · Эмоции героя',
    title: 'Как сохранить одного и того же героя?',
    question: 'Что нужно передать нейросети при генерации второй эмоции персонажа?',
    options: [
      { id: 'a', label: 'Прикрепить первую картинку как референс и менять только мимику', isCorrect: true },
      { id: 'b', label: 'Каждый раз придумывать новую одежду и другой цвет волос', isCorrect: false },
      { id: 'c', label: 'Сделать картинку чёрно-белой', isCorrect: false },
    ],
    explanation: 'Референс удерживает лицо, одежду и стиль неизменными — меняется только эмоция.',
    wrongHint: 'Без картинки-образца нейросеть придумает совершенно другого человека с новой одеждой.',
    cyberBotCorrect: 'Верно! Референс держит образ героя единым во всех сценах.',
    cyberBotWrong: 'Если не дать образец, нейросеть нарисует незнакомца!',
  },

  // ЭТАП 7: Вырезание фона и прозрачность
  {
    id: 'q_s7_transparent',
    stageNumber: 7,
    tag: 'Этап 7 · Визуальный тест',
    title: 'Какой файл готов для игры?',
    visualType: 'transparency_compare',
    question: 'Посмотри на два варианта вырезанного героя. Какой из них правильно пойдёт в игру?',
    options: [
      { id: 'a', label: 'Вариант А (клеточки вокруг силуэта, файл .png)', isCorrect: true },
      { id: 'b', label: 'Вариант Б (белый прямоугольник вокруг героя, файл .jpg)', isCorrect: false },
    ],
    explanation: 'Клеточки означают прозрачный альфа-канал (PNG). В игре сквозь них будет видна твоя локация!',
    wrongHint: 'Присмотрись к Варианту Б: белая рамка закроет собой красивый фон сцены.',
    cyberBotCorrect: 'Точно! Никаких белых коробок — только прозрачный PNG!',
    cyberBotWrong: 'Сравни два окошка выше: на каком из них за спиной героя нет белого квадрата?',
  },
  {
    id: 'q_s7_format',
    stageNumber: 7,
    tag: 'Этап 7 · Формат файла',
    title: 'Почему character.jpg — ловушка?',
    codeSnippet: 'hero = pygame.image.load("images/character.jpg")',
    question: 'Что случится на сцене, если сохранить вырезанного героя в .jpg вместо .png?',
    options: [
      { id: 'a', label: 'JPEG не поддерживает прозрачность и вернёт белый квадрат', isCorrect: true },
      { id: 'b', label: 'Персонаж станет невидимым', isCorrect: false },
      { id: 'c', label: 'Герой начнёт двигаться сам', isCorrect: false },
    ],
    explanation: 'Прозрачный альфа-канал поддерживается в формате .png (character.png), а .jpg всегда заливает пустоту цветом.',
    wrongHint: 'В отличие от PNG, формат JPEG технически не умеет хранить прозрачные пиксели.',
    cyberBotCorrect: 'Молодец! Расширение .png для спрайтов обязательно.',
    cyberBotWrong: 'Вспомни правило PhotoRoom: какой именно формат нужно скачивать для спрайта?',
  },

  // ЭТАП 8: Код на Python + Pygame
  {
    id: 'q_s8_syntax',
    stageNumber: 8,
    tag: 'Этап 8 · Баг-хантинг',
    title: 'Найди ошибку в строке Python',
    codeSnippet: 'print("Привет, игрок!"',
    question: 'Почему Python остановится с ошибкой SyntaxError?',
    options: [
      { id: 'a', label: 'Забыли закрывающую круглую скобку ) в конце', isCorrect: true },
      { id: 'b', label: 'Внутри кавычек нельзя ставить запятую', isCorrect: false },
      { id: 'c', label: 'print пишется с заглавной буквы', isCorrect: false },
    ],
    explanation: 'Каждая открытая скобка ( в Python должна быть закрыта парной скобкой ).',
    wrongHint: 'Посчитай скобки в строке print("Привет, игрок!": открытая ( есть, а в самом конце её пара потерялась.',
    cyberBotCorrect: 'Супер! Синтаксис под полным контролем.',
    cyberBotWrong: 'Посмотри на самый конец строки после кавычки " — чего там не хватает?',
  },
  {
    id: 'q_s8_branch',
    stageNumber: 8,
    tag: 'Этап 8 · Развилка if',
    title: 'Что покажет условие выбора?',
    codeSnippet: 'if choice == "A":\n    scene = "Зал кристаллов"\nelif choice == "B":\n    scene = "Тайный выход"',
    question: 'Что окажется в переменной scene, если игрок нажал кнопку B?',
    options: [
      { id: 'a', label: 'Зал кристаллов', isCorrect: false },
      { id: 'b', label: 'Тайный выход', isCorrect: true },
      { id: 'c', label: 'Сразу обе строки', isCorrect: false },
    ],
    explanation: 'Условие if choice == "A" не выполнится, поэтому Python перейдёт в ветку elif choice == "B" и запишет "Тайный выход".',
    wrongHint: 'Так как choice равен "B", первая проверка choice == "A" ложна — программа спускается к elif choice == "B".',
    cyberBotCorrect: 'Отлично! Ветки if/elif работают у тебя без ошибок.',
    cyberBotWrong: 'Проследи шаг за шагом: если choice == "B", какая строчка сработает?',
  },

  // ЭТАП 9: Тестирование и исправление багов
  {
    id: 'q_s9_filenotfound',
    stageNumber: 9,
    tag: 'Этап 9 · Отладка Pygame',
    title: 'Расшифруй ошибку запуска',
    codeSnippet: "FileNotFoundError: No file 'images/character.png'",
    question: 'Что именно просит исправить это сообщение об ошибке?',
    options: [
      { id: 'a', label: 'Проверить папку images и точное имя файла character.png', isCorrect: true },
      { id: 'b', label: 'Удалить Python и установить заново', isCorrect: false },
      { id: 'c', label: 'Уменьшить яркость экрана монитора', isCorrect: false },
    ],
    explanation: 'FileNotFoundError означает, что файл лежит не в папке images или в его названии есть лишний символ или опечатка.',
    wrongHint: 'Переведи буквально: FileNotFoundError — «Файл не найден» по пути images/character.png.',
    cyberBotCorrect: 'Точно! 90% ошибок запуска лечатся проверкой имени папки и файла.',
    cyberBotWrong: 'В тексте ошибки прямо указан путь, который Python не смог найти на диске!',
  },
  {
    id: 'q_s9_flip',
    stageNumber: 9,
    tag: 'Этап 9 · Игровой цикл',
    title: 'Чёрный экран при запуске!',
    codeSnippet: 'screen.blit(bg, (0, 0))\n# забыли одну команду в конце цикла...',
    question: 'Какая команда обновляет кадр на экране Pygame в конце игрового цикла?',
    options: [
      { id: 'a', label: 'pygame.display.flip()', isCorrect: true },
      { id: 'b', label: 'pygame.quit()', isCorrect: false },
      { id: 'c', label: 'print("screen")', isCorrect: false },
    ],
    explanation: 'Без pygame.display.flip() (или update()) кадр рисуется только в памяти, а окно остаётся чёрным.',
    wrongHint: 'pygame.quit() закрывает игру, а нам нужно именно перерисовать («перелистнуть») экран дисплея!',
    cyberBotCorrect: 'Мощно! Знаешь секрет главного цикла Pygame.',
    cyberBotWrong: 'Ищи команду со словом display — именно она отвечает за вывод кадра на экран.',
  },
];

interface WaitingMiniQuestsProps {
  stageNumber?: number;
  completedQuestIds: string[];
  onCompleteQuest: (questId: string) => void;
}

export function WaitingMiniQuests({
  stageNumber = 1,
  completedQuestIds,
  onCompleteQuest,
}: WaitingMiniQuestsProps) {
  const stageQuests = WAITING_MINI_QUESTS.filter((q) => q.stageNumber === stageNumber);
  const unsolvedStageQuests = stageQuests.filter((q) => !completedQuestIds.includes(q.id));
  const otherUnsolvedQuests = WAITING_MINI_QUESTS.filter(
    (q) => q.stageNumber !== stageNumber && !completedQuestIds.includes(q.id)
  );

  // Pick one unsolved quest at a time for current stage; fallback to first quest if all solved
  const [activeQuestId, setActiveQuestId] = useState<string>(
    () => unsolvedStageQuests[0]?.id || stageQuests[0]?.id || WAITING_MINI_QUESTS[0].id
  );
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  useEffect(() => {
    const nextForStage = WAITING_MINI_QUESTS.filter(
      (q) => q.stageNumber === stageNumber && !completedQuestIds.includes(q.id)
    );
    const fallbackForStage = WAITING_MINI_QUESTS.filter((q) => q.stageNumber === stageNumber);
    setActiveQuestId(nextForStage[0]?.id || fallbackForStage[0]?.id || WAITING_MINI_QUESTS[0].id);
    setSelectedOptionId(null);
  }, [stageNumber]);

  const activeQuest =
    WAITING_MINI_QUESTS.find((q) => q.id === activeQuestId) ||
    stageQuests[0] ||
    WAITING_MINI_QUESTS[0];
  const selectedOpt = activeQuest.options.find((o) => o.id === selectedOptionId) || null;
  const isSolvedAlready = completedQuestIds.includes(activeQuest.id);

  // Determine the next unsolved quest (prioritize current stage, then other stages)
  const nextUnsolved =
    unsolvedStageQuests.find((q) => q.id !== activeQuest.id) ||
    otherUnsolvedQuests.find((q) => q.id !== activeQuest.id) ||
    null;

  const handleAnswer = (quest: MiniQuestItem, optionId: string, isCorrect: boolean) => {
    setSelectedOptionId(optionId);
    if (isCorrect) {
      onCompleteQuest(quest.id);
    }
  };

  const handleNextQuest = () => {
    setSelectedOptionId(null);
    if (nextUnsolved) {
      setActiveQuestId(nextUnsolved.id);
      return;
    }
    // If all unsolved are done, cycle to another quest of this stage
    const idx = stageQuests.findIndex((q) => q.id === activeQuest.id);
    const nextInStage = stageQuests[(idx + 1) % Math.max(1, stageQuests.length)];
    if (nextInStage) {
      setActiveQuestId(nextInStage.id);
    }
  };

  const stageSolvedCount = stageQuests.filter((q) => completedQuestIds.includes(q.id)).length;

  return (
    <div className="space-y-4">
      {/* Header strip */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#F4C914] text-[#26313B] flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#26313B]">
              Мини-квест к Этапу {stageNumber} (+5 XP без повторов)
            </h3>
            <p className="text-xs text-slate-500 tabular-nums">
              Этап {stageNumber}: решено {stageSolvedCount} из {stageQuests.length} · Всего квестов:{' '}
              {completedQuestIds.length}/{WAITING_MINI_QUESTS.length}
            </p>
          </div>
        </div>

        <span className="text-xs font-extrabold text-[#04959A]">{activeQuest.tag}</span>
      </div>

      {/* Single Active Mini-Quest Card */}
      <div className="animate-lab-enter rounded-2xl bg-white border-2 border-[#06B8BE]/45 p-5 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-base font-extrabold text-[#26313B]">{activeQuest.title}</h4>
          {isSolvedAlready ? (
            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              <span>+5 XP получено</span>
            </span>
          ) : (
            <span className="text-xs font-extrabold text-amber-700">+5 XP за верный ответ</span>
          )}
        </div>

        {activeQuest.codeSnippet && (
          <pre className="p-3.5 rounded-xl bg-[#26313B] font-mono text-xs sm:text-sm text-[#F4C914] overflow-x-auto">
            {activeQuest.codeSnippet}
          </pre>
        )}

        {/* Proper uncropped image container: object-contain, neutral surface, centered */}
        {activeQuest.imagePreview && (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center rounded-2xl bg-[#F4F8FB] border border-slate-200 p-3.5">
            <div className="sm:col-span-5 h-48 sm:h-52 w-full rounded-xl bg-white border border-slate-200 flex items-center justify-center p-2 overflow-hidden">
              <SafeImage
                src={activeQuest.imagePreview.src}
                alt={activeQuest.imagePreview.caption}
                fallbackTitle="Иллюстрация задания"
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain object-center"
              />
            </div>
            <p className="sm:col-span-7 text-xs sm:text-sm font-semibold text-[#26313B] leading-relaxed">
              {activeQuest.imagePreview.caption}
            </p>
          </div>
        )}

        {activeQuest.visualType === 'transparency_compare' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-200 p-3 bg-[#F4F8FB] text-center space-y-1.5">
              <div className="h-28 rounded-xl checkerboard-bg border border-slate-200 flex items-center justify-center">
                <svg viewBox="0 0 60 60" className="w-16 h-16">
                  <circle cx="30" cy="18" r="10" fill="#06B8BE" />
                  <path d="M16 52 C16 34 44 34 44 52" fill="#26313B" />
                </svg>
              </div>
              <p className="text-xs font-extrabold text-[#26313B]">Вариант А (character.png)</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-3 bg-[#F4F8FB] text-center space-y-1.5">
              <div className="h-28 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-700 border border-slate-200 flex items-center justify-center">
                <div className="w-20 h-20 bg-white rounded-md flex items-center justify-center shadow-xs">
                  <svg viewBox="0 0 60 60" className="w-14 h-14">
                    <circle cx="30" cy="18" r="10" fill="#06B8BE" />
                    <path d="M16 52 C16 34 44 34 44 52" fill="#26313B" />
                  </svg>
                </div>
              </div>
              <p className="text-xs font-extrabold text-[#26313B]">Вариант Б (character.jpg)</p>
            </div>
          </div>
        )}

        {activeQuest.visualType === 'aspect_ratio' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3 text-center space-y-1.5 flex flex-col items-center justify-center">
              <div className="w-32 aspect-video rounded-lg bg-[#06B8BE] text-white text-[11px] font-extrabold flex items-center justify-center">
                16:9 (1280×720)
              </div>
              <p className="text-xs font-bold text-emerald-800">Широкий экран игры</p>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-3 text-center space-y-1.5 flex flex-col items-center justify-center">
              <div className="w-11 h-20 rounded-lg bg-rose-400 text-white text-[10px] font-extrabold flex items-center justify-center">
                9:16
              </div>
              <p className="text-xs font-bold text-rose-800">Вертикаль телефона</p>
            </div>
          </div>
        )}

        <p className="text-sm font-extrabold text-[#26313B]">{activeQuest.question}</p>

        <div className="space-y-2">
          {activeQuest.options.map((opt) => {
            const isChosen = selectedOptionId === opt.id;
            const style = !isChosen
              ? 'bg-[#F4F8FB] border-slate-200 hover:border-[#06B8BE] text-[#26313B]'
              : opt.isCorrect
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-extrabold'
              : 'animate-lab-shake bg-rose-50 border-rose-400 text-rose-900';

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleAnswer(activeQuest, opt.id, opt.isCorrect)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${style}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Specific Explanation / Helpful Wrong Hint + Short CyberBot Reaction */}
        {selectedOpt && (
          <div
            className={`rounded-2xl p-4 border space-y-2.5 text-xs sm:text-sm leading-relaxed ${
              selectedOpt.isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-amber-50 border-[#F4C914] text-[#26313B]'
            }`}
          >
            <div className="flex items-start gap-3">
              <SafeImage
                src={selectedOpt.isCorrect ? CYBERBOT_EMOTION_IMAGES.joy : CYBERBOT_EMOTION_IMAGES.thinking}
                alt="Реакция КиберБота"
                fallbackTitle="КиберБот"
                className="w-11 h-11 rounded-xl bg-white border border-slate-200 object-contain shrink-0"
              />
              <div className="space-y-1">
                <p className="font-extrabold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 shrink-0 text-[#06B8BE]" />
                  <span>
                    {selectedOpt.isCorrect ? activeQuest.cyberBotCorrect : activeQuest.cyberBotWrong}
                  </span>
                </p>
                <p>{selectedOpt.isCorrect ? activeQuest.explanation : activeQuest.wrongHint}</p>
              </div>
            </div>
          </div>
        )}

        {/* Next Unsolved Quest Action */}
        <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            {unsolvedStageQuests.length === 0
              ? `Все задания Этапа ${stageNumber} уже решены!`
              : `Осталось новых заданий на этом этапе: ${unsolvedStageQuests.length}`}
          </span>

          {(nextUnsolved || stageQuests.length > 1) && (
            <button
              type="button"
              onClick={handleNextQuest}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#06B8BE] hover:bg-[#04959A] text-white text-xs sm:text-sm font-extrabold cursor-pointer transition-colors"
            >
              <span>Пройти ещё один мини-квест</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
