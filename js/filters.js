import { renderPhotos } from './render-pictures.js';

const RANDOM_PHOTOS_COUNT = 10;
const imgFilters = document.querySelector('.img-filters');
const filtersForm = imgFilters.querySelector('.img-filters__form');

function debounce(callback, timeoutDelay = 500) {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
}

const clearPictures = () => {
  const pictureElements = document.querySelectorAll('.picture');
  pictureElements.forEach((element) => element.remove());
};

const setActiveButton = (button) => {
  const currentActive = imgFilters.querySelector('.img-filters__button--active');
  if (currentActive) {
    currentActive.classList.remove('img-filters__button--active');
  }
  button.classList.add('img-filters__button--active');
};

const getRandomUniquePhotos = (photos) => {
  const photosCopy = photos.slice();
  const result = [];

  while (result.length < RANDOM_PHOTOS_COUNT && photosCopy.length > 0) {
    const index = Math.floor(Math.random() * photosCopy.length);
    const [photo] = photosCopy.splice(index, 1);
    result.push(photo);
  }

  return result;
};

const getDiscussedPhotos = (photos) =>
  photos
    .slice()
    .sort((a, b) => b.comments.length - a.comments.length);

const debouncedRender = debounce((photos) => {
  clearPictures();
  renderPhotos(photos);
});

const initFilters = (photos) => {
  imgFilters.classList.remove('img-filters--inactive');

  filtersForm.addEventListener('click', (evt) => {
    const button = evt.target;

    if (!button.classList.contains('img-filters__button')) {
      return;
    }

    setActiveButton(button);

    let filteredPhotos = photos.slice();

    switch (button.id) {
      case 'filter-random':
        filteredPhotos = getRandomUniquePhotos(photos);
        break;
      case 'filter-discussed':
        filteredPhotos = getDiscussedPhotos(photos);
        break;
      case 'filter-default':
      default:
        filteredPhotos = photos.slice();
        break;
    }

    debouncedRender(filteredPhotos);
  });
};

export { initFilters };
