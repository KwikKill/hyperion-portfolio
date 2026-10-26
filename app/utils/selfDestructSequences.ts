import type { Language } from './language';

export type SelfDestructSequenceId = 'grid' | 'collapse' | 'corruption' | 'fracture' | 'singularity' | 'overheat' | 'megapolis' | 'deluge' | 'disintegration';

export interface SelfDestructSequence {
  id: SelfDestructSequenceId;
  name: Record<Language, string>;
  // Measured from the confirmation to the reset screen, in seconds
  duration: number;
}

// The self-destruct sequences offered at the bottom of the cyberpunk page. Each one covers the
// whole run, from the confirmation to the reset screen. The first one is the default.
export const SELF_DESTRUCT_SEQUENCES: [SelfDestructSequence, ...SelfDestructSequence[]] = [
  {
    id: 'grid',
    name: { fr: 'Grille', en: 'Grid' },
    duration: 50,
  },
  {
    id: 'collapse',
    name: { fr: 'Effondrement', en: 'Collapse' },
    duration: 26,
  },
  {
    id: 'corruption',
    name: { fr: 'Corruption', en: 'Corruption' },
    duration: 26,
  },
  {
    id: 'fracture',
    name: { fr: 'Fracture', en: 'Fracture' },
    duration: 24,
  },
  {
    id: 'singularity',
    name: { fr: 'Singularité', en: 'Singularity' },
    duration: 27,
  },
  {
    id: 'overheat',
    name: { fr: 'Surchauffe', en: 'Overheat' },
    duration: 25,
  },
  {
    id: 'megapolis',
    name: { fr: 'Mégapole', en: 'Megalopolis' },
    duration: 26,
  },
  {
    id: 'deluge',
    name: { fr: 'Déluge', en: 'Deluge' },
    duration: 26,
  },
  {
    id: 'disintegration',
    name: { fr: 'Désintégration', en: 'Disintegration' },
    duration: 25,
  },
];
