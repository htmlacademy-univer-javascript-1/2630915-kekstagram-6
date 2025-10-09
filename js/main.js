const NAMES = ['Артём', 'Мария', 'Дмитрий', 'Анна', 'Сергей', 'Елена', 'Алексей', 'Ольга', 'Иван', 'Наталья'];
const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
const DESCRIPTIONS = [
  'Красивый закат на море',
  'Горный пейзаж в утреннем тумане',
  'Улочки старого города',
  'Кофе и книга в уютном кафе',
  'Прогулка по осеннему парку',
  'Архитектура современного мегаполиса',
  'Морской берег с белым песком',
  'Зимний лес после снегопада',
  'Уличные музыканты в центре города',
  'Вид с высоты птичьего полёта'
];
const PHOTOS_COUNT = 25;

const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

let lastCommentId = 0;
const getCommentId = () => {
  lastCommentId += 1;
  return lastCommentId;
};

const createComment = () => ({
  id: getCommentId(),
  avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
  message: getRandomArrayElement(MESSAGES),
  name: getRandomArrayElement(NAMES)
});

const createPhoto = (index) => ({
  id: index + 1,
  url: `photos/${index + 1}.jpg`,
  description: getRandomArrayElement(DESCRIPTIONS),
  likes: getRandomInteger(15, 200),
  comments: Array.from({length: getRandomInteger(0, 30)}, createComment)
});

const photos = Array.from({length: PHOTOS_COUNT}, (_, index) => createPhoto(index));

export { photos };
