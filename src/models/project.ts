export interface Project {
  name: {
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
  technologies: string[];
  images: string[];
  note?: {
    en: string;
    fr: string;
  };
  link?: string;
  github?: string;
}

export interface localizedProject {
  localizedName: string;
  localizedDescription: string;
  localizedFile: string;
  date: string;
  starred: boolean;
  technologies: string[];
  images: string[];
  localizedNote?: string;
  link?: string;
  github?: string;
}
