export interface Game {
  title: string;
  year: string;
  image: string;
  description: string;
  whyILoveIt: string;
}

export interface Games {
  en: Game[];
  fr: Game[];
}
