/**
 * Spark — Session border timer
 * Visual: glowing violet outline that dissolves over session duration
 */

const SparkTimer = (() => {
  let intervalId = null;
  let endTime = null;

  function create(container, durationMinutes) {
    if (!durationMinutes || durationMinutes <= 0) return null;

    container.innerHTML = `
      <div class="timer-border" id="session-timer" aria-hidden="true">
        <svg class="timer-border__svg" xmlns="http://www.w3.org/2000/svg">
          <rect class="timer-border__rect" id="timer-rect"
            x="2" y="2" width="calc(100% - 4)" height="calc(100% - 4)"
            rx="0" ry="0"
            pathLength="100"
            stroke-dasharray="100"
            stroke-dashoffset="0"
          />
        </svg>
      </div>
    `;

    const rect = container.querySelector('#timer-rect');
    const totalMs = durationMinutes * 60 * 1000;
    endTime = Date.now() + totalMs;

    function updateRect() {
      const remaining = Math.max(0, endTime - Date.now());
      const progress = 1 - remaining / totalMs;
      rect.style.strokeDashoffset = progress * 100;

      if (remaining <= 0) {
        stop();
        window.location.href = 'end.html?reason=timer';
      }
    }

    updateRect();
    intervalId = setInterval(updateRect, 1000);

    return { stop };
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  return { create, stop };
})();
