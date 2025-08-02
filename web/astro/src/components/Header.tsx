// import { postsPath } from '#/endpoints.js';
import styles from './styles.module.scss';

export default ({ className }: { className?: string }) => 
	<header className={className}>
		<ul className={styles.navList}>
			<li className={styles.leftItem}><a href="/">Top Page</a></li>
			<li className={styles.rightItem}><a href="/about">About</a></li>
			<li className={styles.rightItem}><a href="/posts">Blog Posts</a></li>
		</ul>
	</header>
