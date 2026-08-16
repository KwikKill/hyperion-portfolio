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
  internship?: boolean;
}

export interface LocalizedExperience {
  localizedTitle: string;
  company: string;
  localizedLocation: string;
  localizedPeriod: string;
  localizedDescription: string;
  technologies: string[];
  localizedAchievements: string[];
  internship?: boolean;
}
