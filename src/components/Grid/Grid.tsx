import React, { PropsWithChildren } from 'react';
import styles from './Grid.module.scss';

type Props = PropsWithChildren<{
  type?: 'classic' | 'narrow';
}>;

const Grid = ({ type = 'classic', children }: Props) => {
  const getClassByType = () => {
    switch (type) {
      case 'narrow':
        return styles.narrow;
      default:
        return '';
    }
  };

  return <div className={`${styles.grid} ${getClassByType()}`}>{children}</div>;
};

export default Grid;
