import { useEffect, useState } from 'react';

// ── Daily countdown: resets to 24:00:00 every midnight ──
// The countdown always shows the time remaining until the next
// 12:00 AM, then automatically resets for a fresh 24 hours.
function getNextMidnight(from) {
  const d = new Date(from);
  d.setHours(24, 0, 0, 0);
  return d.getTime();
}

let sharedNow = Date.now();
const nowListeners = new Set();
let tickTimer = null;

function subscribeNow(fn) {
  nowListeners.add(fn);
  fn(sharedNow);
  if (!tickTimer) {
    tickTimer = setInterval(() => {
      sharedNow = Date.now();
      nowListeners.forEach((listener) => listener(sharedNow));
    }, 1000);
  }
  return () => {
    nowListeners.delete(fn);
    if (nowListeners.size === 0 && tickTimer) {
      clearInterval(tickTimer);
      tickTimer = null;
    }
  };
}

const pad2 = (n) => n.toString().padStart(2, '0');

export default function CountdownTimer({ variant = 'offers' }) {
  const [now, setNow] = useState(sharedNow);

  useEffect(() => subscribeNow(setNow), []);

  const diff = Math.max(0, getNextMidnight(now) - now);
  const totalSeconds = Math.floor(diff / 1000);

  // Next midnight is always ahead of `now`, so the timer never disappears —
  // it simply resets to a fresh 24:00:00 every day.
  if (totalSeconds <= 0) return null;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const time = `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;

  if (variant === 'floating') {
    return (
      <div className="floating-timer" role="timer" aria-live="polite">
        <span className="floating-timer-info">
          <span className="floating-timer-label">⏰ العرض ينتهي خلال</span>
          <span className="floating-timer-time">{time}</span>
        </span>
        <a className="floating-timer-cta" href="#shop">
          اطلب دلوقتي
        </a>
      </div>
    );
  }

  if (variant === 'bar') {
    return (
      <span className="countdown-bar" role="timer" aria-label="العروض تنتهي خلال" aria-live="polite">
        <span className="countdown-bar-label">⏰ العروض تنتهي خلال</span>
        <span className="countdown-bar-time">{time}</span>
      </span>
    );
  }

  return (
    <div className="countdown" role="timer" aria-live="polite">
      <span className="countdown-title">⏰ العروض تنتهي خلال</span>
      <span className="countdown-time">{time}</span>
    </div>
  );
}
