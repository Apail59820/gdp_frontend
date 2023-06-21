import React from 'react';
import styles from './InvoiceCard.module.scss';
import { GdpPythagoreFactureModel } from '../../../models/GestionDeProjets/GdpPythagoreFactureModel';

type Props = {
  invoice: Partial<GdpPythagoreFactureModel>;
};

const InvoiceCard = ({ invoice }: Props) => {
  const { num_facture, etatreglt_facture, statut_facture, date_echeance_facture } = invoice;

  // TODO Add ENV variable
  const MAX_DAYS_BEFORE_SOON_TO_EXPIRE_STATUS = 3;

  const getDaysCountUntilDueDate = (): number => {
    const difference = new Date(date_echeance_facture!).getTime() - new Date().getTime();
    return Math.ceil(difference / (1000 * 3600 * 24));
  };

  const isTheDueDateComingSoon: boolean = getDaysCountUntilDueDate() <= MAX_DAYS_BEFORE_SOON_TO_EXPIRE_STATUS;

  const getInformationsByBillingStatus = (): { style: string; bannerText: string; statusText: string } => {
    const daysRemaining = getDaysCountUntilDueDate();
    const daysOverdue = Math.abs(daysRemaining);

    if (etatreglt_facture === 'Reglee')
      return {
        style: styles.ok,
        bannerText: 'réglée',
        statusText: 'réglée',
      };
    else if (etatreglt_facture === 'NonReglee' && statut_facture === 'Echue')
      return {
        style: styles.alert,
        bannerText: `+${daysOverdue} jour${daysOverdue > 1 ? 's' : ''}`,
        statusText: 'impayée',
      };
    else
      return {
        style: isTheDueDateComingSoon ? styles.warning : '',
        bannerText: `échéance ${
          daysRemaining === 0 ? "aujourd'hui" : `dans ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''}`
        }`,
        statusText: 'en attente',
      };
  };

  return (
    <article className={`${styles.invoiceCard} ${getInformationsByBillingStatus().style}`}>
      <div className={styles.banner}>{getInformationsByBillingStatus().bannerText}</div>
      <section className={styles.body}>
        <h3 className={styles.title}>Facture n° {num_facture}</h3>
        <ul className={`small ${styles.informations}`}>
          <li className={styles.information}>
            <span className={styles.label}>État</span>
            <span className={styles.value}>{getInformationsByBillingStatus().statusText}</span>
          </li>
          <li className={styles.information}>
            <span className={styles.label}>Date d&apos;échéance</span>
            <span className={styles.value}>
              <time dateTime={new Date(date_echeance_facture!).toLocaleDateString('fr')}>
                {new Date(date_echeance_facture!).toLocaleDateString('fr')}
              </time>
            </span>
          </li>
        </ul>
      </section>
    </article>
  );
};

export default InvoiceCard;
