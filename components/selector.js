/**
 * Spark — Language and level selector component
 */

const SparkSelector = (() => {
  const LANG_LABELS = { en: 'EN', es: 'ES', de: 'DE', ru: 'RU' };
  const LEVELS = ['basic', 'intermediate', 'advanced'];
  const LEVEL_KEYS = {
    basic: 'levelBasic',
    intermediate: 'levelIntermediate',
    advanced: 'levelAdvanced',
  };

  function renderLanguageSelector(container, selected, onChange) {
    container.innerHTML = '';
    const prefs = Spark.getPrefs();

    Spark.SUPPORTED_LANGS.forEach((lang) => {
      if (lang === prefs.nativeLang) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'selector-option' + (selected === lang ? ' selector-option--selected' : '');
      btn.textContent = LANG_LABELS[lang];
      btn.dataset.lang = lang;
      btn.addEventListener('click', () => onChange(lang));
      container.appendChild(btn);
    });
  }

  function renderLevelSelector(container, selected, onChange) {
    container.innerHTML = '';

    LEVELS.forEach((level) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'selector-option' + (selected === level ? ' selector-option--selected' : '');
      btn.textContent = Spark.t(LEVEL_KEYS[level]);
      btn.dataset.level = level;
      btn.addEventListener('click', () => onChange(level));
      container.appendChild(btn);
    });
  }

  function renderTimerSelector(container, selected, onChange) {
    container.innerHTML = '';

    Spark.TIMER_OPTIONS.forEach((minutes) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'selector-option' + (selected === minutes ? ' selector-option--selected' : '');
      btn.textContent = minutes === 0
        ? Spark.t('timerNone')
        : `${minutes} ${Spark.t('timerMin')}`;
      btn.dataset.minutes = minutes;
      btn.addEventListener('click', () => onChange(minutes));
      container.appendChild(btn);
    });
  }

  function renderCategoryChips(container, categories, selected, onChange) {
    container.innerHTML = '';
    const disabled = Spark.applyCategoryExclusion(selected);
    const lang = Spark.getPrefs().nativeLang;

    categories.forEach((cat) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isSelected = selected.includes(cat.id);
      const isDisabled = disabled.has(cat.id);
      const isLocked = cat.premium;

      let className = 'chip';
      if (isSelected) className += ' chip--selected';
      if (isDisabled) className += ' chip--disabled';
      if (isLocked) className += ' chip--locked';

      btn.className = className;
      btn.textContent = Spark.localizedText(cat.name, lang);
      btn.title = Spark.localizedText(cat.description, lang);
      btn.dataset.category = cat.id;

      if (!isDisabled && !isLocked) {
        btn.addEventListener('click', () => {
          const next = isSelected
            ? selected.filter((id) => id !== cat.id)
            : [...selected, cat.id];
          onChange(next);
        });
      }

      container.appendChild(btn);
    });
  }

  return {
    renderLanguageSelector,
    renderLevelSelector,
    renderTimerSelector,
    renderCategoryChips,
  };
})();
