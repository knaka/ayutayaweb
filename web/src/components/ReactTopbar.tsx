import { postsPath } from '#src_astro/endpoints.js';
import styles from './styles.module.scss';

export const Topbar = () => {
  return (
		<aside className={styles.topbar}>
			<nav>
					<ul className={styles.navList}>
						<li className={styles.leftItem}><a href="/">Top Page</a></li>
						<li className={styles.rightItem}><a href="/about">About</a></li>
						<li className={styles.rightItem}><a href={postsPath}>Blog Posts</a></li>
					</ul>
			</nav>
		</aside>
  );
}
