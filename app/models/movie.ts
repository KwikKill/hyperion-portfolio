export interface Movie {
  title: string;
  year: string;
  genre: string;
  image: string;
  description: string;
  whyILoveIt: string;
}

export interface Movies {
  en: Movie[];
  fr: Movie[];
}
