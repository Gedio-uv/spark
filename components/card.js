/**
 * Spark — Question card component with swipe gestures
 */

const SparkCard = (() => {
  const SWIPE_THRESHOLD = 60;

  function render(container, question, categories, index, total) {
    const prefs = Spark.getPrefs();
    const lang = prefs.nativeLang;
    const display = Spark.getQuestionDisplay(question);
    const category = categories.find((c) => c.id === question.category);
    const categoryName = category
      ? Spark.localizedText(category.name, lang)
      : question.category;

    container.innerHTML = `
      <div class="card" id="question-card">
        <div class="card__glow-violet"></div>
        <div class="card__glow-pink"></div>
        <div class="card__meta">
          <span class="card__category">${categoryName}</span>
          ${prefs.mode === 'learn' ? `<span class="card__level">${question.level}</span>` : ''}
        </div>
        <p class="card__question">${display.primary}</p>
        ${display.translation ? `<p class="card__translation">${display.translation}</p>` : ''}
        <div class="card__footer">
          <span>${Spark.t('swipeHint')}</span>
          <span>${index} / ${total}</span>
        </div>
      </div>
    `;

    return container.querySelector('#question-card');
  }

  function attachSwipeHandlers(cardEl, onNext, onDislike) {
    let startX = 0;
    let startY = 0;
    let tracking = false;

    function onStart(e) {
      const touch = e.touches ? e.touches[0] : e;
      startX = touch.clientX;
      startY = touch.clientY;
      tracking = true;
    }

    function onEnd(e) {
      if (!tracking) return;
      tracking = false;

      const touch = e.changedTouches ? e.changedTouches[0] : e;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (absX < SWIPE_THRESHOLD && absY < SWIPE_THRESHOLD) return;

      let direction;
      if (absY > absX) {
        direction = dy > 0 ? 'down' : 'up';
      } else {
        direction = dx > 0 ? 'right' : 'left';
      }

      cardEl.classList.add(`card--swipe-${direction}`);

      setTimeout(() => {
        if (direction === 'down') {
          onDislike();
        } else {
          onNext();
        }
      }, 250);
    }

    cardEl.addEventListener('touchstart', onStart, { passive: true });
    cardEl.addEventListener('touchend', onEnd, { passive: true });
    cardEl.addEventListener('mousedown', onStart);
    cardEl.addEventListener('mouseup', onEnd);
  }

  return { render, attachSwipeHandlers };
})();
