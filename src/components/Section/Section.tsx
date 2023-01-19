import Link from 'next/link';
import React, { PropsWithChildren } from 'react';
import styles from './Section.module.scss';

type Props = PropsWithChildren<{
  // /!\ On doit passer soit link, soit button, pas les deux
  title: string;
  link?: {
    label: string;
    href: string;
  };
  button?: {
    label: string;
    onClick: () => void;
  };
}>;

const Section = ({ title, link, button, children }: Props) => {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <h2>{title}</h2>
        {link ? (
          <Link className={`text-small ${styles.link}`} href={link.href}>
            {link.label}
          </Link>
        ) : null}
        {button ? (
          <button className={`text-small ${styles.button}`} onClick={button.onClick}>
            {button.label}
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
};

export default Section;
