import rsSchoolLogo from '@assets/rs_school.svg';
import { BaseComponent } from '@components/base-component';

import styles from './header.module.scss';

const headerContent: string = `
<header class="${styles.header}">
  <a href="/movie-app/" class="${styles.link}">
    <h2 class="${styles.title}">Movie app</h2>
  </a>
  <div class="${styles.logo}">
    <a href="https://rs.school/js/" target="_blank">
      <img src="${rsSchoolLogo}" alt="rs-school-logo">
    </a>
  </div>
</header>`;

export const Header = () => {
  return new BaseComponent({
    tag: 'header',
    innerHTML: headerContent,
  });
};
