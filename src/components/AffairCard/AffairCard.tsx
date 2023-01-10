import React from 'react';
import styles from './AffairCard.module.scss';
import { AffairModel } from '../../../models/AffairModel';

type Props = {
  affair: AffairModel;
};

const AffairCard = ({ affair }: Props) => {
  return <div className={styles.affairCard}>AffairCard</div>;
};

export default AffairCard;
