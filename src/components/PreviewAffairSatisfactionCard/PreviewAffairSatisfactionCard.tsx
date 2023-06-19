import { ProgressBar, ShadowCard } from '@projex/ui';
import { GdpAffairModel } from '../../../models/GestionDeProjets/GdpAffairModel';
import styles from '../AffairCard/AffairCard.module.scss';
import { capitalize } from '../../../utils/capitalize';
import Image from 'next/image';
import { getImagesByCompany } from '../../../utils/getImagesByCompany';
import KebabMenuForCards from '../KebabMenuForCards/KebabMenuForCards';
import React from 'react';

interface PreviewAffairSatisfactionCardProps {
  affair: Partial<GdpAffairModel>;
}

const PreviewAffairSatisfactionCard = ({ affair }: PreviewAffairSatisfactionCardProps) => {
  return (
    <ShadowCard>
      <div className={styles.affairCard}>
        <div className={styles.body}>
          <h4 className={styles.title}>{affair.name ? capitalize(affair.name) : 'Affaire'}</h4>
          <span>Chef de projet</span>
          <div className={styles.imageContainer}>
            {/*<Image
              src={getImagesByCompany(typeof company_entity === 'string' ? company_entity['name'] : '').logo}
              alt={`Logo de l'entité ${typeof company_entity === 'string' ? company_entity['name'] : ''}`}
            />*/}
          </div>
        </div>
        <div className={styles.footer}>
          <span>Étapes terminées :</span>
          <ProgressBar percentage={0} tiny />
        </div>
      </div>
    </ShadowCard>
  );
};

export default PreviewAffairSatisfactionCard;
