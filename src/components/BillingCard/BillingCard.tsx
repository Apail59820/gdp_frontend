import React from 'react';
import styles from './BillingCard.module.scss';
import { PythagoreFactureModel } from '../../../models/PythagoreFactureModel';

type Props = {
  billing: PythagoreFactureModel;
};

const BillingCard = ({ billing }: Props) => {
  const { num_facture, etatreglt_facture, statut_facture, date_echeance_facture } = billing;

  const getStyle = () => {
    return '';
  };

  const getDaysCountUntilDueDate = (): number => {
    const difference = new Date().getTime() - Date.parse(date_echeance_facture);
    console.log(new Date(date_echeance_facture).getTime());

    const totalDays = Math.floor(difference / (1000 * 3600 * 24));
    return totalDays;
  };

  const getBannerText = (): string => {
    if (etatreglt_facture === 'Reglee') return 'réglée';
    else if (etatreglt_facture === 'NonReglee' && statut_facture === 'Echue')
      return `+${getDaysCountUntilDueDate()} jours`;
    else return `échéance dans ${Math.abs(getDaysCountUntilDueDate())} jours`;
  };

  return (
    <article className={`${styles.billingCard} ${getStyle()}`}>
      <div className={styles.banner}>{getBannerText()}</div>
    </article>
  );
};

export default BillingCard;
