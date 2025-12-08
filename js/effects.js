const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const DEFAULT_SCALE = 100;

const Effects = {
  none: {
    name: 'none',
    style: null,
    min: 0,
    max: 100,
    step: 1,
    unit: '',
  },
  chrome: {
    name: 'chrome',
    style: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
  },
  sepia: {
    name: 'sepia',
    style: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
  },
  marvin: {
    name: 'marvin',
    style: 'invert',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
  },
  phobos: {
    name: 'phobos',
    style: 'blur',
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px',
  },
  heat: {
    name: 'heat',
    style: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    unit: '',
  },
};

const uploadForm = document.querySelector('.img-upload__form');
const imgPreview = uploadForm.querySelector('.img-upload__preview img');

const scaleSmallerButton = uploadForm.querySelector('.scale__control--smaller');
const scaleBiggerButton = uploadForm.querySelector('.scale__control--bigger');
const scaleValueField = uploadForm.querySelector('.scale__control--value');

const effectsList = uploadForm.querySelector('.effects__list');
const effectLevelContainer = uploadForm.querySelector('.img-upload__effect-level');
const effectLevelSlider = uploadForm.querySelector('.effect-level__slider');
const effectLevelValue = uploadForm.querySelector('.effect-level__value');

let currentEffect = Effects.none;

const setScale = (value) => {
  const clampedValue = Math.min(Math.max(value, SCALE_MIN), SCALE_MAX);
  scaleValueField.value = `${clampedValue}%`;
  imgPreview.style.transform = `scale(${clampedValue / 100})`;
};

const onScaleSmallerClick = () => {
  const currentValue = parseInt(scaleValueField.value, 10);
  setScale(currentValue - SCALE_STEP);
};

const onScaleBiggerClick = () => {
  const currentValue = parseInt(scaleValueField.value, 10);
  setScale(currentValue + SCALE_STEP);
};

const isDefaultEffect = () => currentEffect === Effects.none;

const updateSliderOptions = () => {
  if (isDefaultEffect()) {
    effectLevelContainer.classList.add('hidden');
    imgPreview.style.filter = 'none';
    effectLevelValue.value = '';
    return;
  }

  effectLevelContainer.classList.remove('hidden');

  effectLevelSlider.noUiSlider.updateOptions({
    range: {
      min: currentEffect.min,
      max: currentEffect.max,
    },
    step: currentEffect.step,
    start: currentEffect.max,
  });
};

noUiSlider.create(effectLevelSlider, {
  range: {
    min: Effects.none.min,
    max: Effects.none.max,
  },
  step: Effects.none.step,
  start: Effects.none.max,
  connect: 'lower',
});

effectLevelSlider.noUiSlider.on('update', (values, handle) => {
  const value = values[handle];
  effectLevelValue.value = value;

  if (isDefaultEffect()) {
    imgPreview.style.filter = 'none';
    return;
  }

  const { style, unit } = currentEffect;
  imgPreview.style.filter = `${style}(${value}${unit})`;
});

const onEffectsListChange = (evt) => {
  if (!evt.target.classList.contains('effects__radio')) {
    return;
  }

  const effectName = evt.target.value;
  currentEffect = Effects[effectName] || Effects.none;
  updateSliderOptions();
};

const resetEffects = () => {
  currentEffect = Effects.none;
  updateSliderOptions();
};

const resetScale = () => {
  setScale(DEFAULT_SCALE);
};

uploadForm.addEventListener('reset', () => {
  resetScale();
  resetEffects();
});

scaleSmallerButton.addEventListener('click', onScaleSmallerClick);
scaleBiggerButton.addEventListener('click', onScaleBiggerClick);
effectsList.addEventListener('change', onEffectsListChange);

resetScale();
resetEffects();

export { resetScale, resetEffects };
