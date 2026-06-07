/**
 * Spark — Question card component with swipe gestures
 */

const SparkCard = (() => {
  const SWIPE_THRESHOLD = 90;
  const ROTATION_FACTOR = 0.08;
  const MAX_ROTATION = 12;

  function render(container, question, categories, index, total) {
    const prefs = Spark.getPrefs();
    const lang = prefs.nativeLang;
    const display = Spark.getQuestionDisplay(question);
    const example = Spark.getExampleDisplay(question);
    const category = categories.find((c) => c.id === question.category);
    const categoryName = category
      ? Spark.localizedText(category.name, lang)
      : question.category;
    const showLevelTag = prefs.mode === 'learn' && prefs.level !== 'advanced';

    container.innerHTML = `
      <div class="card" id="question-card">
        <div class="card__glow-violet"></div>
        <div class="card__glow-pink"></div>
        <div class="card__meta">
          <span class="card__category">${categoryName}</span>
          ${showLevelTag ? `<span class="card__level">${question.level}</span>` : ''}
        </div>
        <div class="card__body">
          <p class="card__question">${display.primary}</p>
          ${display.translation ? `<p class="card__translation">${display.translation}</p>` : ''}
          ${example ? `
            <div class="card__example">
              <p class="card__example-label">${Spark.t('exampleLabel')}</p>
              <p class="card__example-text">${example.primary}</p>
              <p class="card__example-translation">${example.translation}</p>
            </div>
          ` : ''}
        </div>
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
    let currentX = 0;
    let currentY = 0;
    let tracking = false;
    let animating = false;

    function applyDrag(x, y, animate) {
      const rotate = Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, x * ROTATION_FACTOR));
      cardEl.style.transition = animate
        ? 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.35s ease'
        : 'none';
      cardEl.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
    }

    function resetCard() {
      cardEl.style.opacity = '';
      applyDrag(0, 0, true);
    }

    function flyOff(direction, callback) {
      animating = true;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const offsets = {
        up: [0, -h * 1.1],
        down: [0, h * 1.1],
        left: [-w * 1.1, 0],
        right: [w * 1.1, 0],
      };
      const [tx, ty] = offsets[direction];
      const rotate = direction === 'left' ? -18 : direction === 'right' ? 18 : direction === 'up' ? -8 : 8;

      cardEl.style.transition = 'transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.4s ease';
      cardEl.style.transform = `translate(${tx}px, ${ty}px) rotate(${rotate}deg)`;
      cardEl.style.opacity = '0';

      setTimeout(() => {
        animating = false;
        callback();
      }, 420);
    }

    function resolveSwipe() {
      const absX = Math.abs(currentX);
      const absY = Math.abs(currentY);

      if (absX < SWIPE_THRESHOLD && absY < SWIPE_THRESHOLD) {
        resetCard();
        return;
      }

      let direction;
      if (absY > absX) {
        direction = currentY > 0 ? 'down' : 'up';
      } else {
        direction = currentX > 0 ? 'right' : 'left';
      }

      flyOff(direction, () => {
        if (direction === 'down') {
          onDislike();
        } else {
          onNext();
        }
      });
    }

    function onStart(e) {
      if (animating) return;
      if (e.type === 'mousedown' && e.button !== 0) return;

      const touch = e.touches ? e.touches[0] : e;
      startX = touch.clientX;
      startY = touch.clientY;
      currentX = 0;
      currentY = 0;
      tracking = true;
      cardEl.style.transition = 'none';
    }

    function onMove(e) {
      if (!tracking || animating) return;

      const touch = e.touches ? e.touches[0] : e;
      currentX = touch.clientX - startX;
      currentY = touch.clientY - startY;
      applyDrag(currentX, currentY, false);

      if (e.cancelable && e.type === 'touchmove') {
        e.preventDefault();
      }
    }

    function onEnd() {
      if (!tracking || animating) return;
      tracking = false;
      resolveSwipe();
    }

    cardEl.addEventListener('touchstart', onStart, { passive: true });
    cardEl.addEventListener('touchmove', onMove, { passive: false });
    cardEl.addEventListener('touchend', onEnd, { passive: true });
    cardEl.addEventListener('touchcancel', onEnd, { passive: true });
    cardEl.addEventListener('mousedown', onStart);
    cardEl.addEventListener('mousemove', onMove);
    cardEl.addEventListener('mouseup', onEnd);
    cardEl.addEventListener('mouseleave', () => {
      if (tracking) onEnd();
    });
  }

  return { render, attachSwipeHandlers };
})();
