const COMMENTS_PER_PORTION = 5;

const body = document.body;
const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const commentsList = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');
const commentsCountBlock = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const closeButton = bigPicture.querySelector('.big-picture__cancel');

let allComments = [];
let shownCommentsCount = 0;

const clearComments = () => {
  commentsList.innerHTML = '';
};

const updateCommentsCounter = () => {
  commentsCountBlock.textContent = `${shownCommentsCount} из ${allComments.length} комментариев`;
};

const createCommentElement = (comment) => {
  const li = document.createElement('li');
  li.classList.add('social__comment');

  const img = document.createElement('img');
  img.classList.add('social__picture');
  img.src = comment.avatar;
  img.alt = comment.name;
  img.width = 35;
  img.height = 35;

  const text = document.createElement('p');
  text.classList.add('social__text');
  text.textContent = comment.message;

  li.append(img, text);
  return li;
};

const renderNextComments = () => {
  const fragment = document.createDocumentFragment();

  const nextComments = allComments.slice(
    shownCommentsCount,
    shownCommentsCount + COMMENTS_PER_PORTION,
  );

  nextComments.forEach((comment) => {
    fragment.append(createCommentElement(comment));
  });

  commentsList.append(fragment);
  shownCommentsCount += nextComments.length;

  updateCommentsCounter();

  if (shownCommentsCount >= allComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeBigPicture();
  }
};

function openBigPicture(photo) {
  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');

  bigPictureImg.src = photo.url;
  bigPictureImg.alt = photo.description || '';

  likesCount.textContent = photo.likes;
  commentsCount.textContent = photo.comments.length;
  socialCaption.textContent = photo.description || '';

  allComments = photo.comments;
  shownCommentsCount = 0;
  clearComments();

  commentsCountBlock.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  renderNextComments();

  document.addEventListener('keydown', onDocumentKeydown);
}

function closeBigPicture() {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
}

closeButton.addEventListener('click', () => {
  closeBigPicture();
});

commentsLoader.addEventListener('click', (evt) => {
  evt.preventDefault();
  renderNextComments();
});

export { openBigPicture };
