export interface Formation {
  school: string;
  // Department and option, as on the diploma
  degree: {
    en: string;
    fr: string;
  };
  graduationYear: number;
  // Skills learned or used during the training, named like in the skills lists.
  technologies: string[];
}
