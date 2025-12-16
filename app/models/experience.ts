export interface Experience {
  title: {
    en: string;
    fr: string;
  };
  company: string;
  location: {
    en: string;
    fr: string;
  };
  period: {
    en: string;
    fr: string;
  };
  description: {
    en: string;
    fr: string;
  };
  technologies: string[];
  achievements: {
    en: string[];
    fr: string[];
  };
}
