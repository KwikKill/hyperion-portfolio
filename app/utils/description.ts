export interface DescriptionBlock {
  type: 'paragraph' | 'list';
  lines: string[];
}

export interface ParsedDescription {
  lead: string;
  blocks: DescriptionBlock[];
}

// Project descriptions use a light plain-text format, so search and the terminal keep
// working on the raw text: a lead sentence first, then "- " bullet lines (or paragraphs).
export function parseDescription(text: string): ParsedDescription {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const hasLead = lines.length > 0 && !lines[0].startsWith('- ');
  const blocks: DescriptionBlock[] = [];

  lines.slice(hasLead ? 1 : 0).forEach((line) => {
    const isItem = line.startsWith('- ');
    const last = blocks[blocks.length - 1];
    if (isItem && last?.type === 'list') {
      last.lines.push(line.slice(2));
    } else {
      blocks.push({ type: isItem ? 'list' : 'paragraph', lines: [isItem ? line.slice(2) : line] });
    }
  });

  return { lead: hasLead ? lines[0] : '', blocks };
}
