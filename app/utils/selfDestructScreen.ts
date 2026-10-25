// Common ground of the self-destruct sequences: the page they act on, its theme colour and the
// scroll lock. Browser-only.

// The header's parent holds the whole page: header, sections, footer
export function findPage(): HTMLElement | null {
  return document.querySelector<HTMLElement>('#cyberpunkroot header')?.parentElement
    ?? (document.getElementById('cyberpunkroot')?.firstElementChild as HTMLElement | null)
    ?? null;
}

// A colour of the theme (primary, secondary, accent…), as "r, g, b" for a canvas or an rgba() style
export function themeColor(name: string, fallback: string): string {
  const root = document.getElementById('cyberpunkroot');
  const value = root ? getComputedStyle(root).getPropertyValue(`--color-${name}`).trim() : '';
  return value ? value.split(/\s+/).join(', ') : fallback;
}

export function primaryColor(): string {
  return themeColor('primary', '254, 238, 59');
}

// The colour behind the page: its own background, or the first one set on an ancestor
export function pageBackdrop(page: HTMLElement): string {
  return [page, page.parentElement, document.body]
    .map((el) => (el ? getComputedStyle(el).backgroundColor : ''))
    .find((color) => color && color !== 'transparent' && !/^rgba\((?:[^,]*,){3}\s*0(?:\.0*)?\s*\)$/.test(color)) ?? '#000';
}

// The sequences play on the top of the page: back to the top, scroll locked. Returns the unlock.
export function lockScroll(): () => void {
  const overflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  window.scrollTo({ top: 0, behavior: 'instant' });
  return () => {
    document.body.style.overflow = overflow;
  };
}
