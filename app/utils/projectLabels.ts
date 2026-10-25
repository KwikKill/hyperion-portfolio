import type { ProjectCategory, ProjectStatus } from '../models/project';

// Words shown for a project's category and status (classic project list and page).
export const CATEGORY_LABELS: Record<ProjectCategory, { fr: string; en: string }> = {
  personal: { fr: 'Personnel', en: 'Personal' },
  client: { fr: 'Client', en: 'Client' },
  association: { fr: 'Associatif', en: 'Association' },
  school: { fr: 'École', en: 'School' },
  competition: { fr: 'Compétition', en: 'Competition' },
};

export const STATUS_LABELS: Record<ProjectStatus, { fr: string; en: string }> = {
  online: { fr: 'En ligne', en: 'Live' },
  finished: { fr: 'Archivé', en: 'Archived' },
  unfinished: { fr: 'Inachevé', en: 'Unfinished' },
};
