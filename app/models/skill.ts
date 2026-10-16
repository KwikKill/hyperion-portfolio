export interface SkillCategory {
  name: string;
  // Compact label, for the htop meters and CAT column.
  short?: string;
  skills: string[];
}

export interface Skills {
  en: SkillCategory[];
  fr: SkillCategory[];
}
