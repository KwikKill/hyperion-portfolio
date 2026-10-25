// The "corruption" self-destruct sequence: the text on screen turns into glyphs from a wave, the
// picture tears and wobbles, blocks become hex dumps. Everything here is undone at the end.
// Browser-only.

import type { Rect, Scan } from './collapse';

const GLYPHS = '█▓▒░<>/\\|{}[]#%&@$*+=?!01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ';

export const glyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? '#';

// One text node of the page, with what the scramble needs measured once
export interface TextPiece {
  node: Text;
  original: string;
  // Last value written by the sequence: if the page changed the text since, it is left alone
  written: string;
  chars: string[];
  solid: boolean[];
  noise: number[];
  bad: boolean[];
  current: string[];
  // Distance from where the corruption starts
  distance: number;
}

// The text nodes of everything on screen. noise: how ragged the edge of the wave is, in px.
export function collectText(scan: Scan, origin: { x: number; y: number }, noise: number): TextPiece[] {
  const pieces: TextPiece[] = [];
  for (const leaf of scan.leaves) {
    const walker = document.createTreeWalker(leaf, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.nodeValue ?? '';
      if (!text.trim() || !node.parentElement || !(node instanceof Text)) continue;
      const r = node.parentElement.getBoundingClientRect();
      const chars = [...text];
      pieces.push({
        node,
        original: text,
        written: text,
        chars,
        solid: chars.map((ch) => !!ch.trim()),
        noise: chars.map(() => Math.random() * noise),
        bad: chars.map(() => false),
        current: chars.slice(),
        distance: Math.hypot(r.left + r.width / 2 - origin.x, r.top + r.height / 2 - origin.y),
      });
    }
  }
  return pieces;
}

export function writePiece(piece: TextPiece) {
  const value = piece.current.join('');
  piece.node.nodeValue = value;
  piece.written = value;
}

export function restoreText(pieces: TextPiece[]) {
  for (const piece of pieces) {
    if (piece.node.nodeValue === piece.written) piece.node.nodeValue = piece.original;
  }
}

// Replaces a share of the characters of each text with glyphs, keeping the spaces
export function scramble(texts: string[], ratio: number): string[] {
  return texts.map((text) => [...text].map((ch) => (ch.trim() && Math.random() < ratio ? glyph() : ch)).join(''));
}

// Lines of a hex dump: an address, then bytes
export function hexRows(rows: number, cols: number): string {
  let dump = '';
  for (let r = 0; r < rows; r += 1) {
    let line = `${Math.floor(Math.random() * 0xfffff).toString(16).toUpperCase().padStart(5, '0')}  `;
    while (line.length < cols) line += `${Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0')} `;
    dump += `${line.slice(0, cols)}\n`;
  }
  return dump;
}

// Blocks of the screen that become hex dumps: mid-sized, fully in view, not overlapping
export function pickBlocks(scan: Scan, count: number): Rect[] {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const candidates = [...scan.frames, ...scan.leaves]
    .map((el) => el.getBoundingClientRect())
    .filter((r) => {
      const area = (r.width * r.height) / (W * H);
      return area > 0.008 && area < 0.2 && r.top >= 0 && r.bottom <= H && r.left >= 0 && r.right <= W;
    })
    .sort(() => Math.random() - 0.5);
  const chosen: DOMRect[] = [];
  for (const r of candidates) {
    if (chosen.length >= count) break;
    if (chosen.some((c) => r.left < c.right && r.right > c.left && r.top < c.bottom && r.bottom > c.top)) continue;
    chosen.push(r);
  }
  return chosen.map((r) => ({
    x: r.left, y: r.top, w: r.width, h: r.height,
  }));
}

// The blocks of the page visible on screen (header, sections in view). The page itself is many
// screens tall: styling it whole would cost far more than what is seen.
export function screenBlocks(page: HTMLElement): HTMLElement[] {
  const H = window.innerHeight;
  return [...page.children]
    .flatMap((child) => (child.getBoundingClientRect().height > H * 1.5 ? [...child.children] : [child]))
    .filter((el): el is HTMLElement => {
      if (!(el instanceof HTMLElement)) return false;
      const r = el.getBoundingClientRect();
      return r.height > 0 && r.bottom > 0 && r.top < H;
    });
}

// What gets the glitch filters: the content of each block, without its animated background, or
// the filter would be redone at every frame of the background
export function filterTargets(blocks: HTMLElement[]): HTMLElement[] {
  return blocks.flatMap((block) => {
    const children = [...block.children];
    if (!children.some((child) => child.matches('.section-background'))) return [block];
    return children.filter((child): child is HTMLElement => child instanceof HTMLElement && !child.matches('.section-background'));
  });
}
