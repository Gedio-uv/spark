/**
 * Spark — Simple modal for coming-soon category taps
 */

const SparkModal = (() => {
  let modalEl = null;

  function ensureModal() {
    if (modalEl) return modalEl;

    modalEl = document.createElement('div');
    modalEl.className = 'modal hidden';
    modalEl.id = 'spark-modal';
    modalEl.setAttribute('role', 'dialog');
    modalEl.setAttribute('aria-modal', 'true');
    modalEl.innerHTML = `
      <div class="modal__backdrop" data-close></div>
      <div class="modal__panel">
        <p class="modal__label" id="modal-label"></p>
        <h2 class="modal__title" id="modal-title"></h2>
        <p class="modal__body" id="modal-body"></p>
        <button type="button" class="btn btn--primary" id="modal-close"></button>
      </div>
    `;
    document.body.appendChild(modalEl);

    modalEl.querySelector('[data-close]').addEventListener('click', hide);
    modalEl.querySelector('#modal-close').addEventListener('click', hide);

    return modalEl;
  }

  function showComingSoon(category) {
    const el = ensureModal();
    const lang = Spark.getPrefs().nativeLang;
    const name = Spark.localizedText(category.name, lang);

    el.querySelector('#modal-label').textContent = '✦ Spark';
    el.querySelector('#modal-title').textContent = Spark.t('comingSoonTitle');
    el.querySelector('#modal-body').textContent =
      Spark.t('comingSoonMessage').replace('{name}', name);
    el.querySelector('#modal-close').textContent = Spark.t('comingSoonClose');

    el.classList.remove('hidden');
    el.querySelector('#modal-close').focus();
  }

  function hide() {
    if (modalEl) modalEl.classList.add('hidden');
  }

  return { showComingSoon, hide };
})();
