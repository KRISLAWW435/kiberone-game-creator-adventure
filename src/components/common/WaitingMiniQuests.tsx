import { ArrowRight, CheckCircle2, Lock, Sparkles, Zap, ZoomIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ART_STYLE_CARDS, CYBERBOT_EMOTION_IMAGES, GENRE_CARDS } from '../../config/mediaAssets';
import { createCharacterTransparencyDemos } from '../../utils/proceduralArt';
import { ImageZoomModal } from './ImageZoomModal';
import { SafeImage } from './SafeImage';

export interface MiniQuestOption {
  id: string;
  value: string;
  label: string;
  isCorrect: boolean;
  feedback: string;
  hint?: string;
}

export interface MiniQuestItem {
  id: string;
  stageId: number;
  tag: string;
  title: string;
  codeSnippet?: string;
  imagePreview?: { src: string; caption: string };
  visualType?: 'transparency_compare' | 'aspect_ratio';
  question: string;
  options: MiniQuestOption[];
  cyberBotCorrect: string;
  cyberBotWrong: string;
}

export const WAITING_MINI_QUESTS: MiniQuestItem[] = [
  // ЭТАП 1: Vibe Coding + Python разминка
  {
    id: 'q_s1_print',
    stageId: 1,
    tag: 'Этап 1 · Python',
    title: 'Что выведет эта команда?',
    codeSnippet: 'coins = 10\nprint("Монет:", coins + 5)',
    question: 'Какую строку напечатает Python при запуске?',
    options: [
      {
        id: 'a',
        value: 'literal_expr',
        label: 'Монет: 10 + 5',
        isCorrect: false,
        feedback: 'Выражение coins + 5 написано без кавычек, поэтому Python не печатает его как текст, а сначала вычисляет сумму.',
        hint: 'Посчитай, сколько будет 10 + 5, и подставь результат после слова «Монет:».',
      },
      {
        id: 'b',
        value: 'sum_15',
        label: 'Монет: 15',
        isCorrect: true,
        feedback: 'Python сначала вычислит выражение coins + 5 (получится 15), а затем напечатает: Монет: 15.',
      },
      {
        id: 'c',
        value: 'concat_105',
        label: 'Монет: 105',
        isCorrect: false,
        feedback: '105 получилось бы только при склейке строк "10" + "5". Здесь coins — это число 10, поэтому происходит обычное сложение.',
        hint: 'Обрати внимание: у числа 10 нет кавычек, значит оно складывается с 5 математически.',
      },
    ],
    cyberBotCorrect: '🎯 Точно в цель! С математикой и print() у тебя полный порядок.',
    cyberBotWrong: '💡 Подсказка от КиберБота: числа без кавычек Python сначала складывает!',
  },
  {
    id: 'q_s1_vibe',
    stageId: 1,
    tag: 'Этап 1 · Vibe Coding',
    title: 'Главное правило Vibe Coding',
    codeSnippet: '# Промпт: "Сделай игру про кота"',
    question: 'Что обязательно делает разработчик после того, как нейросеть выдала готовый код?',
    options: [
      {
        id: 'a',
        value: 'test_and_understand',
        label: 'Запускает код, проверяет логику и сам понимает, как он работает',
        isCorrect: true,
        feedback: 'Вайб-кодинг работает в паре с проверкой: автор всегда тестирует и понимает код своей игры.',
      },
      {
        id: 'b',
        value: 'close_untested',
        label: 'Сразу закрывает редактор, не проверяя файл',
        isCorrect: false,
        feedback: 'Если не запустить код и не проверить его, ошибка может спрятаться до самой защиты проекта.',
        hint: 'Настоящий разработчик обязательно запускает программу и проверяет каждый шаг.',
      },
      {
        id: 'c',
        value: 'rename_txt',
        label: 'Переименовывает файл в random.txt',
        isCorrect: false,
        feedback: 'Файл .txt — это обычный текст, Python не сможет запустить его как программу (.py).',
        hint: 'Подумай, как проверить, что предложенный нейросетью код действительно работает.',
      },
    ],
    cyberBotCorrect: '🚀 Да! ИИ — помощник, а главный режиссёр игры — именно ты.',
    cyberBotWrong: '🧐 Почти! Подумай: если не проверить код, игра может просто не запуститься.',
  },

  // ЭТАП 2: Жанр и стиль игры
  {
    id: 'q_s2_guess_style',
    stageId: 2,
    tag: 'Этап 2 · Визуальный тест стиля',
    title: 'Угадай стиль по полному портрету героя',
    imagePreview: {
      src: ART_STYLE_CARDS.find((s) => s.id === 'handdrawn')?.imagePath || ART_STYLE_CARDS[0].imagePath,
      caption: 'Полный рост персонажа: посмотри на живой тушевый контур и тёплую акварельную покраску',
    },
    question: 'Какой художественный стиль изображён на этой карточке?',
    options: [
      {
        id: 'a',
        value: 'pixel',
        label: 'Пиксель-арт 16-bit',
        isCorrect: false,
        feedback: 'На этой иллюстрации плавные линии и живые мазки кистью, а не сетка квадратных пикселей.',
        hint: 'Присмотрись к мягким переходам цвета и контурам одежды.',
      },
      {
        id: 'b',
        value: 'handdrawn',
        label: 'Авторская рисованная иллюстрация',
        isCorrect: true,
        feedback: 'Выразительный штрих пером и мягкие акварельные переходы — это Авторская рисованная иллюстрация.',
      },
      {
        id: 'c',
        value: 'render3d',
        label: 'Строгий 3D-рендер',
        isCorrect: false,
        feedback: 'Здесь виден ручной рисунок тушью и акварелью, а не объёмная 3D-модель с полигонами.',
        hint: 'Посмотри на текстуру бумаги и рисованный контур — это 2D-иллюстрация.',
      },
    ],
    cyberBotCorrect: '🎨 Глаз-алмаз! Сразу видно настоящего арт-директора.',
    cyberBotWrong: '🔍 Присмотрись к текстуре краски на одежде — это живые мазки кисти!',
  },
  {
    id: 'q_s2_pixel_style',
    stageId: 2,
    tag: 'Этап 2 · Сравнение стилей',
    title: 'Определи стиль этого путешественника',
    imagePreview: {
      src: ART_STYLE_CARDS.find((s) => s.id === 'pixel')?.imagePath || ART_STYLE_CARDS[0].imagePath,
      caption: 'Обрати внимание на чёткую сетку цветных квадратиков по контуру героя',
    },
    question: 'Как называется такой стиль игровой графики?',
    options: [
      {
        id: 'a',
        value: 'pixel',
        label: 'Пиксель-арт',
        isCorrect: true,
        feedback: 'Легендарный 16-bit Пиксель-арт строится из чётких пикселей и отлично подходит для ретро-приключений.',
      },
      {
        id: 'b',
        value: 'cinema',
        label: 'Кинематографичная иллюстрация',
        isCorrect: false,
        feedback: 'В кинематографичном стиле линии гладкие и реалистичные, а здесь весь силуэт сложен из крупных пикселей.',
        hint: 'Ищи на контуре героя характерные квадратные «ступеньки».',
      },
      {
        id: 'c',
        value: 'watercolor',
        label: 'Акварельный комикс',
        isCorrect: false,
        feedback: 'У акварели мягкие размытые края, а на этой картинке каждый цвет лежит на чёткой пиксельной сетке.',
        hint: 'Этот ретро-стиль назван в честь самых маленьких точек экрана — пикселей.',
      },
    ],
    cyberBotCorrect: '👾 Точно! 16-bit пиксели узнаются с первого взгляда.',
    cyberBotWrong: '🧐 Ищи подсказку в квадратных «ступеньках» на контуре — так рисуют только в одном стиле.',
  },
  {
    id: 'q_s2_consistency',
    stageId: 2,
    tag: 'Этап 2 · Арт-дирекшн',
    title: 'Зачем единый стиль всей игре?',
    question: 'Что случится, если фон локации будет в Пиксель-арте, а герой — в 3D-мультфильме?',
    options: [
      {
        id: 'a',
        value: 'mismatch_worlds',
        label: 'Персонаж и фон будут смотреться как детали из двух чужих игр',
        isCorrect: true,
        feedback: 'Единый стиль объединяет фон, героя и диалоги в цельный художественный мир.',
      },
      {
        id: 'b',
        value: 'pygame_crash',
        label: 'Python откажется открывать окно Pygame',
        isCorrect: false,
        feedback: 'Python технически откроет любые две картинки, но визуально разные стили разрушат атмосферу игры.',
        hint: 'Подумай не про ошибки кода, а про то, как картинку увидит игрок.',
      },
      {
        id: 'c',
        value: 'becomes_3d',
        label: 'Игра автоматически станет 3D-шутером',
        isCorrect: false,
        feedback: 'Смена стиля картинки не меняет жанр программы: новелла останется новеллой, просто неаккуратной.',
        hint: 'Главная проблема смешения стилей — дисгармония внешнего вида сцены.',
      },
    ],
    cyberBotCorrect: '✨ В яблочко! Поэтому мы задаём стиль на Этапе 2 один раз для всей игры.',
    cyberBotWrong: '💡 Дело не в коде Python, а в том, как игрок воспринимает картинку глазами!',
  },

  // ЭТАП 3: Сюжет и развилки
  {
    id: 'q_s3_story_bug',
    stageId: 3,
    tag: 'Этап 3 · Логика сюжета',
    title: 'Найди нестыковку в сценарии',
    codeSnippet: 'Цель героя: починить школьный телескоп.\nВариант A: Пойти пить чай домой.\nВариант B: Посмотреть мемы в телефоне.',
    question: 'Что здесь не так со сценарием?',
    options: [
      {
        id: 'a',
        value: 'no_goal_progress',
        label: 'Оба выбора никак не ведут героя к его цели',
        isCorrect: true,
        feedback: 'Каждый выбор должен предлагать реальный способ приблизиться к цели героя и вести к своему последствию.',
      },
      {
        id: 'b',
        value: 'no_two_choices',
        label: 'В новелле не бывает двух вариантов выбора',
        isCorrect: false,
        feedback: 'Как раз наоборот: два варианта выбора — классическая основа нашей развилки!',
        hint: 'Сравни цель героя (починить телескоп) с действиями в вариантах A и B.',
      },
      {
        id: 'c',
        value: 'telescope_banned',
        label: 'Телескоп нельзя упоминать в тексте',
        isCorrect: false,
        feedback: 'Телескоп — отличный предмет для детективного или научно-фантастического квеста. Проблема именно в вариантах действий.',
        hint: 'Помогают ли «чай дома» и «мемы» починить школьный телескоп?',
      },
    ],
    cyberBotCorrect: '📖 Отлично замечено! Сюжетные кнопки должны реально двигать историю вперёд.',
    cyberBotWrong: '🧐 Посмотри на цель героя и сравни её с тем, что делают варианты A и B!',
  },
  {
    id: 'q_s3_cliffhanger',
    stageId: 3,
    tag: 'Этап 3 · Драматургия',
    title: 'Выбери лучшую развилку',
    question: 'Какая пара кнопок даёт игроку самый интересный и осмысленный выбор?',
    options: [
      {
        id: 'a',
        value: 'right_variants',
        label: '«Пойти направо» и «Пойти чуть правее»',
        isCorrect: false,
        feedback:
          'Оба варианта почти одинаковые — игроку всё равно, куда нажимать. Хорошая развилка должна вести к разным событиям и разным последствиям.',
        hint: 'Сравни два по-настоящему разных действия для игрока, а не почти одинаковые направления.',
      },
      {
        id: 'b',
        value: 'door_vs_vent',
        label: '«Рискнуть и открыть дверь» vs «Обойти через вентиляцию»',
        isCorrect: true,
        feedback:
          'Отлично! Это две разные стратегии поведения: смелый риск и скрытный обход, которые логично ведут к разным сценам и финалам.',
      },
      {
        id: 'c',
        value: 'yes_vs_ok',
        label: '«Да» и «Хорошо»',
        isCorrect: false,
        feedback:
          'Слова «Да» и «Хорошо» означают согласие. Это не развилка, а две одинаковые кнопки.',
        hint: 'Выбирай пару кнопок, где каждая ведёт героя своим собственным путём.',
      },
    ],
    cyberBotCorrect: '🎭 Супер! Разные действия = два запоминающихся финала.',
    cyberBotWrong: '💡 Хорошая развилка даёт игроку два действительно отличающихся пути!',
  },

  // ЭТАП 4: Промпт и готовый сценарий (без упоминания будущих этапов)
  {
    id: 'q_s4_weak_prompt',
    stageId: 4,
    tag: 'Этап 4 · Промпт-инжиниринг',
    title: 'Почему нейросеть ответила скучно?',
    codeSnippet: 'Промпт ученика: "Напиши историю про космос"',
    question: 'Чего не хватает этому запросу, чтобы получился сценарий для нашей игры?',
    options: [
      {
        id: 'a',
        value: 'missing_structure',
        label: 'Не указаны герой, короткий формат реплик, развилка из 2 кнопок и 2 финала',
        isCorrect: true,
        feedback: 'Чёткие требования к структуре (вступление, реплики «Имя: текст», 2 выбора, 2 финала) дают сценарий, готовый для игры.',
      },
      {
        id: 'b',
        value: 'polite_words',
        label: 'В промпте не написано слово "пожалуйста" 5 раз',
        isCorrect: false,
        feedback: 'Вежливость — это хорошо, но нейросеть понимает задачу благодаря конкретным правилам формата, а не количеству повторений слова «пожалуйста».',
        hint: 'Что должно быть внутри сценария визуальной новеллы: диалоги, кнопки выбора, концовки?',
      },
      {
        id: 'c',
        value: 'no_space_knowledge',
        label: 'Нейросети не умеют писать про космос',
        isCorrect: false,
        feedback: 'Нейросети отлично пишут о космосе, просто без ограничений они выдают длинный обычный рассказ без развилки.',
        hint: 'Подумай, каких игровых элементов не хватает в короткой фразе «Напиши историю про космос».',
      },
    ],
    cyberBotCorrect: '⚡ Верно! Чем точнее структура промпта — тем качественнее диалоги игры.',
    cyberBotWrong: '🧩 Подумай, из каких частей состоит сценарий визуальной новеллы: герой, реплики, выбор и 2 финала!',
  },
  {
    id: 'q_s4_final_vs_prompt',
    stageId: 4,
    tag: 'Этап 4 · Готовый сценарий',
    title: 'Что нужно вставить в поле готового сценария?',
    question: 'Что нужно вставить в поле готового сценария на Этапе 4?',
    options: [
      {
        id: 'a',
        value: 'ai_generated_script',
        label: 'Готовый текст сценария от нейросети (сценки, диалоги, 2 выбора и 2 финала)',
        isCorrect: true,
        feedback: 'Именно так! В это поле сохраняется готовый игровой сценарий с репликами, развилкой и двумя финалами.',
      },
      {
        id: 'b',
        value: 'prompt_instruction',
        label: 'Сам промпт-инструкцию, который ты писал для нейросети',
        isCorrect: false,
        feedback: 'Промпт — это задание для нейросети, а не сама история. В поле готового сценария должен лежать именно ответ нейросети с диалогами.',
        hint: 'Промпт ты отправляешь в чат ИИ, а обратно получаешь готовый сценарий — его и вставляй!',
      },
      {
        id: 'c',
        value: 'single_title_word',
        label: 'Только название игры одним словом',
        isCorrect: false,
        feedback: 'Из одного слова нельзя показать ни диалоги персонажей, ни варианты выбора, ни два финала.',
        hint: 'Вспомни, какой результат тебе выдала нейросеть после отправки промпта.',
      },
    ],
    cyberBotCorrect: '📜 В точку! Готовый сценарий сохранён и готов к дальнейшей сборке проекта.',
    cyberBotWrong: '💡 Проверь разницу: промпт — это запрос к нейросети, а в поле сценария вставляют её готовый ответ!',
  },

  // ЭТАП 5: Локация и фон 16:9
  {
    id: 'q_s5_genre_match',
    stageId: 5,
    tag: 'Этап 5 · Визуальный тест',
    title: 'Подбери жанр к сцене',
    imagePreview: {
      src: GENRE_CARDS.find((g) => g.id === 'scifi')?.imagePath || GENRE_CARDS[0].imagePath,
      caption: 'Оцени детали окружения: иллюминаторы в космос, пульт управления и парящая станция',
    },
    question: 'Для какого жанра и стиля создана эта игровая локация?',
    options: [
      {
        id: 'a',
        value: 'scifi_anime',
        label: 'Научная фантастика · Аниме',
        isCorrect: true,
        feedback: 'Панели управления, иллюминаторы на орбиту и чистый контур идеально подходят для научной фантастики в стиле Аниме.',
      },
      {
        id: 'b',
        value: 'victorian_detective',
        label: 'Исторический детектив XIX века',
        isCorrect: false,
        feedback: 'В XIX веке не было голографических пультов и космических иллюминаторов — это явно футуристический мир.',
        hint: 'Посмотри в окно и на панель управления на переднем плане.',
      },
      {
        id: 'c',
        value: 'medieval_village',
        label: 'Средневековая деревня',
        isCorrect: false,
        feedback: 'Перед нами высокотехнологичная орбитальная база, а не деревянные домики средневековья.',
        hint: 'Загляни в огромное панорамное окно на иллюстрации: там видна планета!',
      },
    ],
    cyberBotCorrect: '🛸 Точно! Сразу видно орбитальную станцию будущего.',
    cyberBotWrong: '🔭 Посмотри за окно на этой картинке — там звёзды и планета!',
  },
  {
    id: 'q_s5_aspect',
    stageId: 5,
    tag: 'Этап 5 · Композиция 16:9',
    title: 'Какой формат нужен фону?',
    visualType: 'aspect_ratio',
    question: 'Почему для окна 1000×600 нельзя брать вертикальный фон 9:16 с телефона?',
    options: [
      {
        id: 'a',
        value: 'distort_or_bars',
        label: 'Он либо сильно растянется и исказится, либо оставит пустые полосы по краям',
        isCorrect: true,
        feedback: 'Окно новеллы горизонтальное (16:9), поэтому фон тоже должен быть широким 16:9.',
      },
      {
        id: 'b',
        value: 'no_colors',
        label: 'На вертикальных картинках не работают цвета',
        isCorrect: false,
        feedback: 'Цвета работают на любых картинках, проблема именно в несовпадении ширины и высоты кадра.',
        hint: 'Сравни форму широкого окна игры и узкого экрана смартфона.',
      },
      {
        id: 'c',
        value: 'pygame_upside_down',
        label: 'Pygame переворачивает их вверх ногами',
        isCorrect: false,
        feedback: 'Pygame ничего не переворачивает, но при растягивании вертикальной картинки на широкий экран всё станет сплющенным.',
        hint: 'Посмотри на зелёный и красный прямоугольники на схеме выше.',
      },
    ],
    cyberBotCorrect: '🖼️ Да! Горизонтальный кадр 16:9 идеально ложится в окно игры.',
    cyberBotWrong: '📐 Сравни форму окна игры (горизонталь) и экрана телефона (вертикаль)!',
  },

  // ЭТАП 6: Создание персонажа
  {
    id: 'q_s6_prompt_bug',
    stageId: 6,
    tag: 'Этап 6 · Проверка промпта',
    title: 'Найди ошибку в запросе на героя',
    codeSnippet: '"Крутой хакер в тёмной комнате с мониторами, видны только плечи"',
    question: 'Что здесь помешает аккуратно вырезать персонажа для новеллы?',
    options: [
      {
        id: 'a',
        value: 'dark_bg_and_crop',
        label: 'Тёмная комната вместо чистого белого фона (#FFFFFF) и обрезанный рост',
        isCorrect: true,
        feedback: 'Однотонный белый фон #FFFFFF и полный рост позволяют вырезать силуэт за 1 клик без лишних объектов.',
      },
      {
        id: 'b',
        value: 'hacker_word',
        label: 'Слово "хакер" запрещено в генераторах',
        isCorrect: false,
        feedback: 'Дело не в слове «хакер» — нейросети спокойно рисуют персонажей-программистов, если задать правильный фон и позу.',
        hint: 'Вспомни, какой фон нужен позади героя, чтобы его легко было вырезать в PhotoRoom.',
      },
      {
        id: 'c',
        value: 'need_crowd',
        label: 'Нужно добавить ещё 5 случайных людей рядом',
        isCorrect: false,
        feedback: 'Толпа на одной картинке только помешает: для спрайта в новелле на изображении должен быть ровно один герой!',
        hint: 'Подумай о фоне и о том, виден ли герой в полный рост.',
      },
    ],
    cyberBotCorrect: '🌟 Супер! Чистый белый фон + полный рост = идеальный спрайт.',
    cyberBotWrong: '🎨 Вспомни требования для вырезания фона: что должно быть позади героя?',
  },
  {
    id: 'q_s6_emotions',
    stageId: 6,
    tag: 'Этап 6 · Эмоции героя',
    title: 'Как сохранить одного и того же героя?',
    question: 'Что нужно передать нейросети при генерации второй эмоции персонажа?',
    options: [
      {
        id: 'a',
        value: 'attach_reference',
        label: 'Прикрепить первую картинку как референс и менять только мимику',
        isCorrect: true,
        feedback: 'Референс удерживает лицо, одежду и стиль неизменными — меняется только эмоция.',
      },
      {
        id: 'b',
        value: 'new_clothes',
        label: 'Каждый раз придумывать новую одежду и другой цвет волос',
        isCorrect: false,
        feedback: 'Если сменить одежду и причёску, игрок решит, что на экране появился совершенно другой персонаж.',
        hint: 'Как нейросеть узнает, как именно выглядит твой первый герой?',
      },
      {
        id: 'c',
        value: 'make_bw',
        label: 'Сделать картинку чёрно-белой',
        isCorrect: false,
        feedback: 'Чёрно-белый фильтр не помогает сохранить черты лица и стиль одежды одного героя.',
        hint: 'Для сохранения внешности нейросети передают исходное изображение как образец (референс).',
      },
    ],
    cyberBotCorrect: '📸 Верно! Референс держит образ героя единым во всех сценах.',
    cyberBotWrong: '💡 Если не дать образец-референс, нейросеть нарисует незнакомца!',
  },

  // ЭТАП 7: Вырезание фона и прозрачность
  {
    id: 'q_s7_transparent',
    stageId: 7,
    tag: 'Этап 7 · Визуальный тест',
    title: 'Какой файл готов для игры?',
    visualType: 'transparency_compare',
    question: 'Посмотри на два варианта вырезанного героя. Какой из них правильно пойдёт в игру?',
    options: [
      {
        id: 'a',
        value: 'png_alpha',
        label: 'Вариант А (прозрачный фон с клеточками вокруг силуэта, файл .png)',
        isCorrect: true,
        feedback: 'Клеточки означают прозрачный альфа-канал (PNG). В игре сквозь них будет видна твоя локация!',
      },
      {
        id: 'b',
        value: 'jpg_white_box',
        label: 'Вариант Б (белый прямоугольник вокруг героя, файл .jpg)',
        isCorrect: false,
        feedback: 'В Варианте Б остался непрозрачный белый прямоугольник — на сцене он закроет собой красивый фон локации.',
        hint: 'Выбирай вариант, у которого нет белой рамки позади персонажа.',
      },
    ],
    cyberBotCorrect: '✂️ Точно! Никаких белых коробок — только прозрачный PNG!',
    cyberBotWrong: '🔍 Сравни две картинки выше: на какой из них за спиной героя нет белого квадрата?',
  },
  {
    id: 'q_s7_format',
    stageId: 7,
    tag: 'Этап 7 · Формат файла',
    title: 'Почему character.jpg — ловушка?',
    codeSnippet: 'hero = pygame.image.load("images/character.jpg")',
    question: 'Что случится на сцене, если сохранить вырезанного героя в .jpg вместо .png?',
    options: [
      {
        id: 'a',
        value: 'jpg_no_alpha',
        label: 'JPEG не поддерживает прозрачность и вернёт белый квадрат',
        isCorrect: true,
        feedback: 'Прозрачный альфа-канал поддерживается в формате .png (character.png), а .jpg всегда заливает пустоту цветом.',
      },
      {
        id: 'b',
        value: 'invisible_hero',
        label: 'Персонаж станет невидимым',
        isCorrect: false,
        feedback: 'Персонаж останется видимым, просто вместо прозрачности вокруг него снова появится сплошной белый фон.',
        hint: 'Подумай, умеет ли формат .jpg хранить прозрачные пиксели.',
      },
      {
        id: 'c',
        value: 'auto_move',
        label: 'Герой начнёт двигаться сам',
        isCorrect: false,
        feedback: 'Формат файла никак не управляет анимацией — он отвечает только за сохранение изображения и прозрачности.',
        hint: 'Вспомни, зачем мы скачивали именно .png с прозрачным фоном в PhotoRoom.',
      },
    ],
    cyberBotCorrect: '💎 Молодец! Расширение .png для спрайтов обязательно.',
    cyberBotWrong: '🧐 Вспомни правило PhotoRoom: какой формат сохраняет прозрачный фон без белого квадрата?',
  },

  // ЭТАП 8: Код на Python + Pygame
  {
    id: 'q_s8_syntax',
    stageId: 8,
    tag: 'Этап 8 · Баг-хантинг',
    title: 'Найди ошибку в строке Python',
    codeSnippet: 'print("Привет, игрок!"',
    question: 'Почему Python остановится с ошибкой SyntaxError?',
    options: [
      {
        id: 'a',
        value: 'missing_paren',
        label: 'Забыли закрывающую круглую скобку ) в конце',
        isCorrect: true,
        feedback: 'Каждая открытая скобка ( в Python должна быть закрыта парной скобкой ).',
      },
      {
        id: 'b',
        value: 'comma_in_string',
        label: 'Внутри кавычек нельзя ставить запятую',
        isCorrect: false,
        feedback: 'Внутри текстовых кавычек можно писать любые знаки препинания, включая запятые и восклицательные знаки.',
        hint: 'Посмотри на самый конец строки после кавычек — чего там не хватает?',
      },
      {
        id: 'c',
        value: 'print_uppercase',
        label: 'print пишется с заглавной буквы',
        isCorrect: false,
        feedback: 'В Python команда print всегда пишется только маленькими буквами.',
        hint: 'Пересчитай открытые и закрытые круглые скобки в этой строке.',
      },
    ],
    cyberBotCorrect: '🐞 Супер! Синтаксис под полным контролем.',
    cyberBotWrong: '🔎 Посмотри на самый конец строки после кавычки " — чего там не хватает?',
  },
  {
    id: 'q_s8_branch',
    stageId: 8,
    tag: 'Этап 8 · Развилка if',
    title: 'Что покажет условие выбора?',
    codeSnippet: 'if choice == "A":\n    scene = "Зал кристаллов"\nelif choice == "B":\n    scene = "Тайный выход"',
    question: 'Что окажется в переменной scene, если игрок нажал кнопку B?',
    options: [
      {
        id: 'a',
        value: 'crystal_hall',
        label: 'Зал кристаллов',
        isCorrect: false,
        feedback: '«Зал кристаллов» записывается только при choice == "A". Так как нажата кнопка B, эта ветка пропускается.',
        hint: 'Проверь условие во второй ветке elif choice == "B".',
      },
      {
        id: 'b',
        value: 'secret_exit',
        label: 'Тайный выход',
        isCorrect: true,
        feedback: 'Условие if choice == "A" не выполнится, поэтому Python перейдёт в ветку elif choice == "B" и запишет "Тайный выход".',
      },
      {
        id: 'c',
        value: 'both_strings',
        label: 'Сразу обе строки',
        isCorrect: false,
        feedback: 'В конструкции if / elif срабатывает только одна подходящая ветка сверху вниз.',
        hint: 'Проследи по шагам: первая проверка ложна, значит срабатывает elif.',
      },
    ],
    cyberBotCorrect: '⚙️ Отлично! Ветки if/elif работают у тебя без ошибок.',
    cyberBotWrong: '🧭 Проследи шаг за шагом: если choice == "B", какая строчка сработает?',
  },

  // ЭТАП 9: Тестирование и исправление багов (дружелюбные реакции)
  {
    id: 'q_s9_filenotfound',
    stageId: 9,
    tag: 'Этап 9 · Отладка Pygame',
    title: 'Расшифруй ошибку запуска',
    codeSnippet: "FileNotFoundError: No file 'images/character.png'",
    question: 'Что именно просит исправить это сообщение об ошибке?',
    options: [
      {
        id: 'a',
        value: 'check_folder_name',
        label: 'Проверить папку images и точное имя файла character.png',
        isCorrect: true,
        feedback: 'FileNotFoundError означает, что файл лежит не в папке images или в его названии есть лишний символ или опечатка.',
      },
      {
        id: 'b',
        value: 'reinstall_python',
        label: 'Удалить Python и установить заново',
        isCorrect: false,
        feedback: 'Сам Python работает отлично! Он просто честно сообщил, что не нашёл картинку по указанному пути.',
        hint: 'Переведи сообщение буквально: FileNotFoundError — «Файл не найден».',
      },
      {
        id: 'c',
        value: 'monitor_brightness',
        label: 'Уменьшить яркость экрана монитора',
        isCorrect: false,
        feedback: 'Яркость экрана не влияет на поиск файлов. Проверь папку images рядом с файлом main.py.',
        hint: 'В тексте ошибки указан конкретный путь к картинке, которую не удалось найти.',
      },
    ],
    cyberBotCorrect: '🎉 Отлично! Ты нашёл баг как настоящий разработчик — 90% ошибок запуска лечатся проверкой имени файла.',
    cyberBotWrong: '🧐 Почти! Посмотри на ошибку чуть внимательнее — ты совсем рядом. В ней указан путь к картинке!',
  },
  {
    id: 'q_s9_flip',
    stageId: 9,
    tag: 'Этап 9 · Игровой цикл',
    title: 'Чёрный экран при запуске!',
    codeSnippet: 'screen.blit(bg, (0, 0))\n# забыли одну команду в конце цикла...',
    question: 'Какая команда обновляет кадр на экране Pygame в конце игрового цикла?',
    options: [
      {
        id: 'a',
        value: 'display_flip',
        label: 'pygame.display.flip()',
        isCorrect: true,
        feedback: 'Без pygame.display.flip() (или update()) кадр рисуется только в памяти, а окно остаётся чёрным.',
      },
      {
        id: 'b',
        value: 'pygame_quit',
        label: 'pygame.quit()',
        isCorrect: false,
        feedback: 'pygame.quit() закрывает окно игры при выходе, а не обновляет нарисованный кадр.',
        hint: 'Ищи команду со словом display — именно она отвечает за вывод кадра на экран.',
      },
      {
        id: 'c',
        value: 'print_screen',
        label: 'print("screen")',
        isCorrect: false,
        feedback: 'print() выводит текст в консоль, но ничего не рисует в окне Pygame.',
        hint: 'Какая команда из модуля pygame.display «переворачивает» новый кадр на экран?',
      },
    ],
    cyberBotCorrect: '🚀 Супер! Код чистый, можно запускать игру и показывать экран!',
    cyberBotWrong: '💡 Хорошая попытка! Давай проверим команду, которая отвечает за display (экран) в Pygame.',
  },
];

interface WaitingMiniQuestsProps {
  stageId: number;
  completedStages: number[];
  completedQuestIds: string[];
  onCompleteQuest: (questId: string) => void;
}

export function WaitingMiniQuests({
  stageId,
  completedStages,
  completedQuestIds,
  onCompleteQuest,
}: WaitingMiniQuestsProps) {
  const stageQuests = WAITING_MINI_QUESTS.filter((q) => q.stageId === stageId);
  const isStageCompleted = completedStages.includes(stageId);
  const unsolvedStageQuests = stageQuests.filter((q) => !completedQuestIds.includes(q.id));

  const [activeQuestId, setActiveQuestId] = useState<string>(
    () => unsolvedStageQuests[0]?.id || stageQuests[0]?.id || ''
  );
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string; caption?: string } | null>(null);
  const [transparencyDemos, setTransparencyDemos] = useState<{
    transparentPngUrl: string;
    whiteBoxUrl: string;
  } | null>(null);

  useEffect(() => {
    const nextForStage = WAITING_MINI_QUESTS.filter(
      (q) => q.stageId === stageId && !completedQuestIds.includes(q.id)
    );
    const fallbackForStage = WAITING_MINI_QUESTS.filter((q) => q.stageId === stageId);
    setActiveQuestId(nextForStage[0]?.id || fallbackForStage[0]?.id || '');
    setSelectedOptionId(null);
  }, [stageId]);

  const activeQuest =
    stageQuests.find((q) => q.id === activeQuestId) || stageQuests[0] || null;

  useEffect(() => {
    if (activeQuest?.visualType !== 'transparency_compare' || transparencyDemos) return;
    let active = true;
    const sampleCharUrl = ART_STYLE_CARDS[0]?.imagePath;
    if (!sampleCharUrl) return;
    createCharacterTransparencyDemos(sampleCharUrl).then((res) => {
      if (active && res) {
        setTransparencyDemos(res);
      }
    });
    return () => {
      active = false;
    };
  }, [activeQuest?.visualType, transparencyDemos]);

  if (!activeQuest) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 p-5 text-sm text-slate-600">
        Для этого этапа нет дополнительных мини-квестов.
      </div>
    );
  }

  if (!isStageCompleted) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 p-5 flex items-center gap-3 text-sm text-slate-600">
        <Lock className="w-5 h-5 text-slate-400 shrink-0" />
        <span>
          Дополнительные испытания Этапа {stageId} откроются сразу после завершения обязательной задачи этого этапа.
        </span>
      </div>
    );
  }

  const selectedOpt = activeQuest.options.find((o) => o.id === selectedOptionId) || null;
  const isSolvedAlready = completedQuestIds.includes(activeQuest.id);
  const nextUnsolvedInStage = unsolvedStageQuests.find((q) => q.id !== activeQuest.id) || null;
  const stageSolvedCount = stageQuests.filter((q) => completedQuestIds.includes(q.id)).length;
  const allStageQuestsSolved = unsolvedStageQuests.length === 0;

  const handleAnswer = (quest: MiniQuestItem, option: MiniQuestOption) => {
    setSelectedOptionId(option.id);
    if (option.isCorrect && isStageCompleted && !completedQuestIds.includes(quest.id)) {
      onCompleteQuest(quest.id);
    }
  };

  const handleNextQuest = () => {
    if (!nextUnsolvedInStage) return;
    setSelectedOptionId(null);
    setActiveQuestId(nextUnsolvedInStage.id);
  };

  return (
    <div className="space-y-4">
      {/* Header strip — strict stage-scoped counter only */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#F4C914] text-[#26313B] flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#26313B]">
              Мини-квест к Этапу {stageId} (+5 XP без повторов)
            </h3>
            <p className="text-xs text-slate-500 tabular-nums">
              Этап {stageId}: решено {stageSolvedCount} из {stageQuests.length}
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

        {/* Proper uncropped image container with zoom button */}
        {activeQuest.imagePreview && (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center rounded-2xl bg-[#F4F8FB] border border-slate-200 p-3.5">
            <div className="relative sm:col-span-5 h-52 sm:h-56 w-full rounded-xl bg-white border border-slate-200 flex items-center justify-center p-2 overflow-hidden">
              <SafeImage
                src={activeQuest.imagePreview.src}
                alt={activeQuest.imagePreview.caption}
                fallbackTitle="Иллюстрация задания"
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full w-auto h-auto object-contain object-center"
              />
              <button
                type="button"
                onClick={() =>
                  setZoomImage({
                    src: activeQuest.imagePreview!.src,
                    alt: activeQuest.title,
                    caption: activeQuest.imagePreview!.caption,
                  })
                }
                aria-label="Увеличить изображение"
                title="Увеличить изображение"
                className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-white/95 hover:bg-[#06B8BE] text-[#26313B] hover:text-white border border-slate-200 shadow-xs flex items-center justify-center cursor-pointer transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
            <p className="sm:col-span-7 text-xs sm:text-sm font-semibold text-[#26313B] leading-relaxed">
              {activeQuest.imagePreview.caption}
            </p>
          </div>
        )}

        {/* Real character PNG vs white-box JPG comparison (NO SVG placeholders) */}
        {activeQuest.visualType === 'transparency_compare' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-200 p-3 bg-[#F4F8FB] text-center space-y-2">
              <div className="h-44 rounded-xl checkerboard-bg border border-slate-200 flex items-center justify-center p-2 overflow-hidden">
                <SafeImage
                  src={transparencyDemos?.transparentPngUrl || ART_STYLE_CARDS[0].imagePath}
                  alt="Вариант А: персонаж с прозрачным фоном в формате PNG"
                  fallbackTitle="Вариант А (character.png)"
                  className="max-h-full max-w-full w-auto h-auto object-contain object-center"
                />
              </div>
              <p className="text-xs font-extrabold text-[#26313B]">Вариант А (character.png)</p>
              <p className="text-[11px] text-emerald-700 font-semibold">
                Клеточки за героем = прозрачный альфа-канал
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-3 bg-[#F4F8FB] text-center space-y-2">
              <div className="h-44 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-700 border border-slate-200 flex items-center justify-center p-3 overflow-hidden">
                <div className="h-36 px-3 py-1 bg-white rounded-md shadow-sm flex items-center justify-center">
                  <SafeImage
                    src={transparencyDemos?.whiteBoxUrl || ART_STYLE_CARDS[0].imagePath}
                    alt="Вариант Б: персонаж в белом прямоугольнике формата JPG"
                    fallbackTitle="Вариант Б (character.jpg)"
                    className="max-h-full max-w-full w-auto h-auto object-contain object-center"
                  />
                </div>
              </div>
              <p className="text-xs font-extrabold text-[#26313B]">Вариант Б (character.jpg)</p>
              <p className="text-[11px] text-rose-700 font-semibold">
                Белый прямоугольник перекрывает фон локации
              </p>
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
                onClick={() => handleAnswer(activeQuest, opt)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${style}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Specific Option Feedback & Hint + Friendly CyberBot Reaction */}
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
                <p>{selectedOpt.feedback}</p>
                {!selectedOpt.isCorrect && selectedOpt.hint && (
                  <p className="text-xs font-bold text-amber-800">Подсказка: {selectedOpt.hint}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Next Unsolved Quest of THIS Stage Only OR Completion Notice */}
        <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
          {allStageQuestsSolved ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-xs sm:text-sm font-extrabold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Ты прошёл все дополнительные испытания этой локации!</span>
            </div>
          ) : (
            <span className="text-xs text-slate-500">
              Осталось новых заданий на этом этапе: {unsolvedStageQuests.length}
            </span>
          )}

          {nextUnsolvedInStage && (
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

      <ImageZoomModal
        open={Boolean(zoomImage)}
        src={zoomImage?.src || ''}
        alt={zoomImage?.alt || ''}
        caption={zoomImage?.caption}
        onClose={() => setZoomImage(null)}
      />
    </div>
  );
}
