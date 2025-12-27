import './util.js';
import './form.js';
import './effects.js';
import { getData } from './api.js';
import { renderPhotos } from './render-pictures.js';
import { initFilters } from './filters.js';

getData()
  .then((photos) => {
    renderPhotos(photos);
    initFilters(photos);
  })
  .catch(() => {
    const errorBlock = document.createElement('div');
    errorBlock.textContent = 'Не удалось загрузить фотографии. Попробуйте обновить страницу.';
    errorBlock.style.position = 'fixed';
    errorBlock.style.left = '0';
    errorBlock.style.right = '0';
    errorBlock.style.top = '0';
    errorBlock.style.zIndex = '1000';
    errorBlock.style.padding = '10px 20px';
    errorBlock.style.textAlign = 'center';
    errorBlock.style.backgroundColor = '#ff4e4e';
    errorBlock.style.color = '#ffffff';
    document.body.append(errorBlock);

    setTimeout(() => {
      errorBlock.remove();
    }, 5000);
  });
