const COMMENT_MAX_LENGTH = 140;
const HASHTAG_MAX_COUNT = 5;
const HASHTAG_REGEXP = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;

const body = document.body;
const uploadForm = document.querySelector('.img-upload__form');
const fileField = uploadForm.querySelector('.img-upload__input');
const overlay = uploadForm.querySelector('.img-upload__overlay');
const cancelButton = uploadForm.querySelector('.img-upload__cancel');
const hashtagsField = uploadForm.querySelector('.text__hashtags');
const commentField = uploadForm.querySelector('.text__description');

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--invalid',
  successClass: 'img-upload__field-wrapper--valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error',
});

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeUploadOverlay();
  }
};

const openUploadOverlay = () => {
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
};

function closeUploadOverlay() {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);

  uploadForm.reset();
  pristine.reset();
  fileField.value = '';
}

fileField.addEventListener('change', () => {
  openUploadOverlay();
});

cancelButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeUploadOverlay();
});

const stopEscPropagation = (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
};

hashtagsField.addEventListener('keydown', stopEscPropagation);
commentField.addEventListener('keydown', stopEscPropagation);

const getHashtagsArray = (value) =>
  value
    .trim()
    .split(/\s+/)
    .filter((tag) => tag.length > 0);

const validateHashtagsCount = (value) => {
  const tags = getHashtagsArray(value);
  return tags.length <= HASHTAG_MAX_COUNT;
};

const validateHashtagsSymbols = (value) => {
  const tags = getHashtagsArray(value);
  if (tags.length === 0) {
    return true;
  }
  return tags.every((tag) => HASHTAG_REGEXP.test(tag));
};

const validateHashtagsUnique = (value) => {
  const tags = getHashtagsArray(value).map((tag) => tag.toLowerCase());
  const uniqueTags = new Set(tags);
  return tags.length === uniqueTags.size;
};

pristine.addValidator(
  hashtagsField,
  validateHashtagsCount,
  'Нельзя указать больше пяти хэш-тегов'
);

pristine.addValidator(
  hashtagsField,
  validateHashtagsSymbols,
  'Хэш-тег должен начинаться с # и содержать только буквы и цифры, максимум 20 символов'
);

pristine.addValidator(
  hashtagsField,
  validateHashtagsUnique,
  'Хэш-теги не должны повторяться'
);

const validateCommentLength = (value) => value.length <= COMMENT_MAX_LENGTH;

pristine.addValidator(
  commentField,
  validateCommentLength,
  `Длина комментария не может быть больше ${COMMENT_MAX_LENGTH} символов`
);

uploadForm.addEventListener('submit', (evt) => {
  const isValid = pristine.validate();

  if (!isValid) {
    evt.preventDefault();
  }
});

export { };
