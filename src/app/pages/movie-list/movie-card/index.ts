import { ImageComponent } from '@components/img/img';
import { div } from '@components/tags';
import type { Movie } from '@interfaces/movie.interface';

import styles from './styles.module.scss';

interface Props {
  movie: Movie;
  handleClick: () => void;
}

export const MovieCard = ({ movie, handleClick }: Props) =>
  div(
    {
      className: styles.card,
      onclick: () => {
        handleClick.call(movie);
      },
    },
    ImageComponent({
      src: movie.posterUrlPreview,
      className: styles.poster,
    }),
    div({
      className: styles.title,
      txt: movie.nameRu,
    }),
    div({
      className: styles.year,
      txt: movie.year.toString(),
    }),
    div({
      className: styles.genres,
      txt: movie.genres.map(({ genre }) => genre).join(', '),
    }),
  );
