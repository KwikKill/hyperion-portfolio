// True when the visitor asked their system to reduce motion: new animations are skipped.
// Browser-only.
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
