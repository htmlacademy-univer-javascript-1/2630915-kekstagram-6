import { sendData } from './api.js';
import { isEscapeKey } from './keyboard.js';


const COMMENT_MAX_LENGTH = 140;
const HASHTAG_MAX_COUNT = 5;
const HASHTAG_REGEXP = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;
const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const body = document.body;
const uploadForm = document.querySelector('.img-upload__form');
const fileField = uploadForm.querySelector('.img-upload__input');
const overlay = uploadForm.querySelector('.img-upload__overlay');
const cancelButton = uploadForm.querySelector('.img-upload__cancel');
const hashtagsField = uploadForm.querySelector('.text__hashtags');
const commentField = uploadForm.querySelector('.text__description');
const submitButton = uploadForm.querySelector('.img-upload__submit');
const submitButtonText = submitButton.textContent;

const imgPreview = uploadForm.querySelector('.img-upload__preview img');
const effectsPreview = uploadForm.querySelectorAll('.effects__preview');
const defaultPreviewSrc = imgPreview.src;

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--invalid',
  successClass: 'img-upload__field-wrapper--valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error',
});

const successTemplate = document
  .querySelector('#success')
  .content
  .querySelector('.success');

const errorTemplate = document
  .querySelector('#error')
  .content
  .querySelector('.error');

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Публикую...';
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = submitButtonText;
};

const resetUploadPreview = () => {
  imgPreview.src = defaultPreviewSrc;
  effectsPreview.forEach((preview) => {
    preview.style.backgroundImage = '';
  });
};

const closeUploadOverlay = () => {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);

  uploadForm.reset();
  pristine.reset();
  fileField.value = '';
  resetUploadPreview();
};

const openUploadOverlay = () => {
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
};

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt)) {
    if (document.querySelector('.error')) {
      return;
    }

    evt.preventDefault();
    closeUploadOverlay();
  }
}

const onFileFieldChange = () => {
  const file = fileField.files[0];

  if (file) {
    const fileName = file.name.toLowerCase();
    const matches = FILE_TYPES.some((ext) => fileName.endsWith(ext));

    if (matches) {
      const imageUrl = URL.createObjectURL(file);
      imgPreview.src = imageUrl;
      effectsPreview.forEach((preview) => {
        preview.style.backgroundImage = `url(${imageUrl})`;
      });
    }
  }

  openUploadOverlay();
};

const onCancelButtonClick = (evt) => {
  evt.preventDefault();
  closeUploadOverlay();
};

const onHashtagOrCommentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

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

const showSuccessMessage = () => {
  const successElement = successTemplate.cloneNode(true);
  document.body.append(successElement);

  const successButton = successElement.querySelector('.success__button');

  const closeSuccessMessage = () => {
    successElement.remove();
    document.removeEventListener('keydown', onSuccessMessageKeydown);
    successElement.removeEventListener('click', onSuccessMessageOutsideClick);
  };

  function onSuccessMessageKeydown(evt) {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      evt.stopImmediatePropagation();
      closeSuccessMessage();
    }
  }

  function onSuccessMessageOutsideClick(evt) {
    if (!evt.target.closest('.success__inner')) {
      closeSuccessMessage();
    }
  }

  successButton.addEventListener('click', closeSuccessMessage);
  document.addEventListener('keydown', onSuccessMessageKeydown);
  successElement.addEventListener('click', onSuccessMessageOutsideClick);
};

const showErrorMessage = () => {
  const errorElement = errorTemplate.cloneNode(true);

  overlay.classList.add('hidden');

  document.body.append(errorElement);

  const errorButton = errorElement.querySelector('.error__button');

  const closeErrorMessage = () => {
    errorElement.remove();
    document.removeEventListener('keydown', onErrorMessageKeydown);
    errorElement.removeEventListener('click', onErrorMessageOutsideClick);

    overlay.classList.remove('hidden');
  };

  function onErrorMessageKeydown(evt) {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      evt.stopImmediatePropagation();
      closeErrorMessage();
    }
  }

  function onErrorMessageOutsideClick(evt) {
    if (!evt.target.closest('.error__inner')) {
      closeErrorMessage();
    }
  }

  errorButton.addEventListener('click', closeErrorMessage);
  document.addEventListener('keydown', onErrorMessageKeydown);
  errorElement.addEventListener('click', onErrorMessageOutsideClick);
};

const onUploadFormSubmit = (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();
  if (!isValid) {
    return;
  }

  const formData = new FormData(uploadForm);

  blockSubmitButton();

  sendData(formData)
    .then(() => {
      unblockSubmitButton();
      closeUploadOverlay();
      showSuccessMessage();
    })
    .catch(() => {
      unblockSubmitButton();
      showErrorMessage();
    });
};

fileField.addEventListener('change', onFileFieldChange);
cancelButton.addEventListener('click', onCancelButtonClick);

hashtagsField.addEventListener('keydown', onHashtagOrCommentKeydown);
commentField.addEventListener('keydown', onHashtagOrCommentKeydown);

uploadForm.addEventListener('submit', onUploadFormSubmit);
