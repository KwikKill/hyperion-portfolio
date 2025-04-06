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
  image: string;
  link?: string;
  github?: string;
}

export interface localizedProject {
  localizedName: string;
  localizedDescription: string;
  file: {
    en: string;
    fr: string;
  };
  date: string;
  starred: boolean;
  technologies: string[];
  image: string;
  link?: string;
  github?: string;
}
