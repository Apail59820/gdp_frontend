import React from 'react';
import styles from './KebabMenuForCards.module.scss';
import kebabMenu from '../../../public/ellipsis-vertical.svg';

type Props = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const KebabMenuForCards = ({ onClick }: Props) => {
  return (
    <button className={styles.kebabMenuForCards} onClick={onClick}>
      <img src={kebabMenu.src} alt="Kebab menu icon" />
    </button>
  );
};

export default KebabMenuForCards;
