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

export {getRandomInteger, getRandomArrayElement, getCommentId};
