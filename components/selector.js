/**
 * Spark — Language and level selector component
 */

const SparkSelector = (() => {
  const LANG_FLAGS = { en: '🇬🇧', es: '🇪🇸', de: '🇩🇪', ru: '🇷🇺' };
  const LANG_NAMES = {
    en: { en: 'English', es: 'Inglés', de: 'Englisch', ru: 'Английский' },
    es: { en: 'Spanish', es: 'Español', de: 'Spanisch', ru: 'Испанский' },
    de: { en: 'German', es: 'Alemán', de: 'Deutsch', ru: 'Немецкий' },
    ru: { en: 'Russian', es: 'Ruso', de: 'Russisch', ru: 'Русский' },
  };
  const LEVELS = ['basic', 'intermediate', 'advanced'];
  const LEVEL_KEYS = {
    basic: 'levelBasic',
    intermediate: 'levelIntermediate',
    advanced: 'levelAdvanced',
  };
  const LEVEL_DESC_KEYS = {
    basic: 'levelDescBasic',
    intermediate: 'levelDescIntermediate',
    advanced: 'levelDescAdvanced',
  };

  function chipClass(selected, extra) {
    let cls = 'chip' + (extra ? ` ${extra}` : '');
    if (selected) cls += ' chip--selected';
    return cls;
  }

  function renderLanguageSelector(container, selected, onChange) {
    container.innerHTML = '';
    container.className = 'chip-scroll';
    const uiLang = Spark.getPrefs().nativeLang;

    Spark.SUPPORTED_LANGS.forEach((lang) => {
      if (lang === Spark.getPrefs().nativeLang) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = chipClass(selected === lang, 'chip--lang');
      btn.dataset.lang = lang;
      const name = LANG_NAMES[lang][uiLang] || LANG_NAMES[lang].en;
      btn.innerHTML = `<span class="chip__flag" aria-hidden="true">${LANG_FLAGS[lang]}</span><span class="chip__name">${name}</span>`;
      btn.addEventListener('click', () => onChange(lang));
      container.appendChild(btn);
    });
  }

  function renderLevelSelector(container, selected, onChange, descContainer) {
    container.innerHTML = '';
    container.className = 'chip-row chip-row--3';

    LEVELS.forEach((level) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = chipClass(selected === level, 'chip--level');
      btn.textContent = Spark.t(LEVEL_KEYS[level]);
      btn.dataset.level = level;
      btn.addEventListener('click', () => onChange(level));
      container.appendChild(btn);
    });

    if (descContainer) {
      descContainer.textContent = Spark.t(LEVEL_DESC_KEYS[selected]);
      descContainer.classList.remove('hidden');
    }
  }

  function renderTimerSelector(container, selected, onChange) {
    container.innerHTML = '';
    container.className = 'chip-scroll chip-scroll--timer';

    Spark.TIMER_OPTIONS.forEach((minutes) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = chipClass(selected === minutes, 'chip--timer');
      btn.textContent = minutes === 0 ? Spark.t('timerNone') : `${minutes} ${Spark.t('timerMin')}`;
      btn.dataset.minutes = minutes;
      btn.addEventListener('click', () => onChange(minutes));
      container.appendChild(btn);
    });
  }

  function renderCategoryChips(container, categories, selected, onChange, onLockedClick) {
    container.innerHTML = '';
    container.className = 'chips chips--categories';
    const disabled = Spark.applyCategoryExclusion(selected);
    const lang = Spark.getPrefs().nativeLang;

    categories.forEach((cat) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isSelected = selected.includes(cat.id);
      const isDisabled = disabled.has(cat.id);
      const isLocked = cat.premium;
      const name = Spark.localizedText(cat.name, lang);

      let className = 'chip chip--category';
      if (isSelected) className += ' chip--selected';
      if (isDisabled) className += ' chip--disabled';
      if (isLocked) className += ' chip--locked';

      btn.className = className;
      btn.title = Spark.localizedText(cat.description, lang);
      btn.dataset.category = cat.id;

      if (isLocked) {
        btn.innerHTML = `
          <span class="chip__stack">
            <span class="chip__label">${name}</span>
            <span class="chip__premium">${Spark.t('premiumLabel')}</span>
          </span>`;
        btn.addEventListener('click', () => onLockedClick(cat));
      } else {
        btn.innerHTML = `<span class="chip__label">${name}</span>`;
        if (!isDisabled) {
          btn.addEventListener('click', () => {
            const next = isSelected
              ? selected.filter((id) => id !== cat.id)
              : [...selected, cat.id];
            onChange(next);
          });
        }
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
