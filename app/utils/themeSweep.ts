import { prefersReducedMotion } from './motion';

const DURATION = 420;

// "Channel change" when the theme switches: a scan band sweeps down the screen and the
// colours flip as it crosses the middle. The band lives in #cyberpunkroot, so it takes the
// theme colours too. Browser-only.
export function sweepTheme(apply: () => void) {
  const root = document.getElementById('cyberpunkroot');
  if (!root || prefersReducedMotion()) {
    apply();
    return;
  }

  const band = document.createElement('div');
  band.className = 'theme-sweep';
  band.setAttribute('aria-hidden', 'true');
  root.appendChild(band);

  const animation = band.animate(
    [{ transform: 'translateY(-100%)' }, { transform: `translateY(${window.innerHeight}px)` }],
    { duration: DURATION, easing: 'cubic-bezier(0.6, 0, 0.3, 1)' },
  );
  animation.onfinish = () => band.remove();
  animation.oncancel = () => band.remove();
  setTimeout(apply, DURATION / 2);
}
