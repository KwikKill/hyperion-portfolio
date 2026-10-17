import type { Directive } from 'vue';

import { prefersReducedMotion } from '../utils/motion';

// v-reveal="delayInMs": the block rises into place the first time it scrolls into view.
// Blocks already on screen when the page loads are left alone, so nothing flashes, and
// the server-rendered page never hides anything. Styles live in assets/css/tailwind.css.
let observer: IntersectionObserver | null = null;

function revealObserver() {
  if (!observer) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.replace('reveal-pending', 'reveal-in');
        observer?.unobserve(entry.target);
      });
    }, { threshold: 0.1 });
  }
  return observer;
}

export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    if (!('IntersectionObserver' in window) || prefersReducedMotion()) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.style.setProperty('--reveal-delay', `${binding.value ?? 0}ms`);
    el.classList.add('reveal-pending');
    revealObserver().observe(el);
  },
  beforeUnmount(el) {
    observer?.unobserve(el);
  },
};
