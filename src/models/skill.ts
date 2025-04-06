export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface Skills {
  en: SkillCategory[];
  fr: SkillCategory[];
}
