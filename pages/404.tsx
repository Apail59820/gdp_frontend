import React from 'react';
import styles from '../styles/404.module.scss';
import Link from 'next/link';

const FourOhFour = () => {
  return (
    <div id={styles.fourOhFour}>
      <section className={styles.textContainer}>
        <h1 className={styles.title}>404 - Page Not Found</h1>
        <Link href="/">Go back home</Link>
      </section>
    </div>
  );
};

export default FourOhFour;
