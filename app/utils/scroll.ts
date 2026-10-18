import { prefersReducedMotion } from './motion';

// Scrolls to a section without writing it to the URL hash: with a hash, the next
// language or theme switch (which rewrites the URL) would jump back to the section.
export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}
