export type ProjectCategory = 'personal' | 'client' | 'association' | 'school' | 'competition';

export type ProjectStatus = 'online' | 'finished' | 'unfinished';

export interface Project {
  name: {
    en: string;
    fr: string;
  };
  // Short descriptor shown under the name in the project page ("Generative GitHub City").
  subtitle?: {
    en: string;
    fr: string;
  };
  description: {
    en: string;
    fr: string;
  };
  file: {
    en: string;
    fr: string;
  };
  date: string;
  starred: boolean;
  category: ProjectCategory;
  status: ProjectStatus;
  technologies: string[];
  images: string[];
  note?: {
    en: string;
    fr: string;
  };
  link?: string;
  github?: string;
  completed?: boolean;
}

export interface localizedProject {
  localizedName: string;
  localizedSubtitle?: string;
  // Name and subtitle together, as listed in the projects explorer ("Polis - Generative GitHub City").
  localizedTitle: string;
  localizedDescription: string;
  localizedFile: string;
  file: {
    en: string;
    fr: string;
  };
  date: string;
  starred: boolean;
  category: ProjectCategory;
  status: ProjectStatus;
  technologies: string[];
  images: string[];
  localizedNote?: string;
  link?: string;
  github?: string;
  completed?: boolean;
}
