import { BaseComponent } from '@components/base-component';
import { ButtonComponent } from '@components/button/button';
import type { LoaderComponent } from '@components/loader/loader';
import { Loader } from '@components/loader/loader';
import { ModalWindow } from '@components/modal/modal-window';
import { div, input } from '@components/tags';
import type { Movie } from '@interfaces/movie.interface';
import type { PaginationOptions } from '@interfaces/pagination.interface';
import type { MovieService } from '@services/movie.service';

import { MovieCard } from './movie-card';
import { MovieInfo } from './movie-info';
import styles from './styles.module.scss';

class MovieListPageComponent extends BaseComponent {
  private readonly loader: LoaderComponent;
  private readonly paginationOptions: PaginationOptions = {
    page: 1,
    limit: 12,
  };
  private readonly movieListContainer: BaseComponent;
  private readonly loadMoreButton: BaseComponent;
  private readonly favoriteOnlySwitch: BaseComponent<HTMLInputElement>;

  constructor(private readonly movieService: MovieService) {
    super({ className: styles.movieListPage });

    this.favoriteOnlySwitch = input({
      type: 'checkbox',
      onchange: () => {
        this.paginationOptions.page = 1;
        this.movieListContainer.removeChildren();
        this.loadMovies();
      },
    });
    this.movieListContainer = div({ className: styles.movieList });
    this.loader = Loader();
    this.loadMoreButton = ButtonComponent({
      txt: 'Load more',
      onClickHandler: () => {
        this.paginationOptions.page += 1;
        this.loadMovies();
      },
    });

    this.appendChildren([
      div(
        { className: styles.titleContainer },
        div({ className: styles.title, txt: 'Movies' }),
        div({ className: styles.favoriteSwitcher }, div({ txt: 'Favorite only' }), this.favoriteOnlySwitch),
      ),
      this.movieListContainer,
      this.loader,
    ]);

    this.loadMovies().then(() => {
      this.append(this.loadMoreButton);
    });
  }

  public async loadMovies() {
    this.loader.show();

    const isFavoriteOnly = this.favoriteOnlySwitch.getNode().checked;
    const { data: movies, hasMore } = await this.movieService.getMovies(this.paginationOptions, isFavoriteOnly);
    const movieList = movies.map((movie) =>
      MovieCard({
        movie,
        handleClick: () => {
          this.showMovieModal(movie);
        },
      }),
    );
    requestAnimationFrame(() => {
      this.loader.hide();
      this.movieListContainer.appendChildren(movieList);

      if (hasMore) {
        this.loadMoreButton.removeClass('hidden');
      } else {
        this.loadMoreButton.addClass('hidden');
      }
    });
  }

  public showMovieModal(movie: Movie) {
    const movieDescription = MovieInfo({
      movie,
      addFavorite: () => {
        this.movieService.updateFavoriteMovies(movie.kinopoiskId.toString());
        movie.isFavorite = !movie.isFavorite;
        movieDescription.updateFavoriteIcon();
      },
    });
    const modal = ModalWindow({
      title: movie.nameRu,
      description: movieDescription,
    });
    modal.open(this.node).then();
  }
}

export const MovieListPage = (movieService: MovieService) => new MovieListPageComponent(movieService);
