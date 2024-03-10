interface Country {
  country: string;
}

interface Genres {
  genre: string;
}

export interface Movie {
  kinopoiskId: number;
  nameRu: string;
  nameEn: string | null;
  year: number;
  countries: Country[];
  genres: Genres[];
  posterUrl: string;
  posterUrlPreview: string;
  duration: number;
  premiereRu: string;
  isFavorite?: boolean;
}
