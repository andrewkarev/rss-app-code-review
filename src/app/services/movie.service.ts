import { movies } from '@data/movies';
import type { Movie } from '@interfaces/movie.interface.ts';
import type { PaginationOptions, PaginationResponse } from '@interfaces/pagination.interface.ts';
import { wait } from '@utils/wait.ts';

import { localStorageService, type LocalStorageState, type StorageService } from './local-storage.service.ts';

export class MovieService {
  constructor(private readonly localStorageService: StorageService<LocalStorageState>) {}

  public async getMovies(
    { page, limit }: PaginationOptions,
    isFavoriteOnly: boolean,
  ): Promise<PaginationResponse<Movie>> {
    const delay = 500;

    await wait(delay); // emulate server response delay

    const favoriteMovies = this.getPersistentFavoriteMovies();

    const filteredMovies = isFavoriteOnly
      ? movies.filter((movie) => favoriteMovies.includes(movie.kinopoiskId.toString()))
      : movies;

    const slicedMovies = movies.slice(0, page * limit);

    return {
      data: slicedMovies.map((movie) => ({
        ...movie,
        isFavorite: favoriteMovies.includes(movie.kinopoiskId.toString()),
      })),
      total: filteredMovies.length,
      hasMore: page * limit < filteredMovies.length,
    };
  }

  private getPersistentFavoriteMovies() {
    return this.localStorageService.getData('' || 'favoriteMovies') || [];
  }

  public updateFavoriteMovies(id: string) {
    const favoriteMovies = this.getPersistentFavoriteMovies();
    const index = favoriteMovies.indexOf(id);

    if (index !== -1) {
      favoriteMovies.splice(index, 1);
    } else {
      favoriteMovies.push(id);
    }

    this.localStorageService.saveData('favoriteMovies', favoriteMovies);
  }
}

export const movieService = new MovieService(localStorageService);
