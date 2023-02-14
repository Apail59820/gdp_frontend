import React from 'react';
import styles from './AffairCard.module.scss';
import { GdpAffairModel } from '../../../models/GdPModels';
import { ProgressBar, ShadowCard } from '@projex/ui';
import KebabMenuForCards from '../KebabMenuForCards/KebabMenuForCards';
import { getImagesByCompany } from '../../../utils/getImagesByCompany';
import { capitalize } from '../../../utils/capitalize';
import Image from 'next/image';
import { UsCompanyEntityModel } from '../../../models/UsModels';

type Props = {
  affair: GdpAffairModel;
  onKebabMenuClick: React.MouseEventHandler<HTMLButtonElement>;
};

const AffairCard = ({ affair, onKebabMenuClick }: Props) => {
  const { name, company_entity } = affair;
  // TODO
  const STEPS = [{ status: 'DONE' }, { status: 'DONE' }, { status: 'IN_PROGRESS' }];
  const STEPS_COUNT = STEPS.length;
  const FINISHED_STEPS_COUNT = STEPS.filter((step) => step.status === 'DONE').length;
  const FINISHED_STEPS_COUNT_PERCENTAGE = Math.floor((FINISHED_STEPS_COUNT / STEPS_COUNT) * 100);

  return (
    <ShadowCard>
      <div className={styles.affairCard}>
        <div className={styles.body}>
          <h4 className={styles.title}>{name ? capitalize(name) : 'Affaire'}</h4>
          <span>Chef de projet</span>
          <div className={styles.imageContainer}>
            <Image
              src={getImagesByCompany(typeof company_entity === 'string' ? company_entity['name'] : '').logo}
              alt={`Logo de l'entité ${typeof company_entity === 'string' ? company_entity['name'] : ''}`}
            />
          </div>
        </div>
        <div className={styles.footer}>
          {/* TODO */}
          <span>
            Étapes terminées : {FINISHED_STEPS_COUNT}/{STEPS_COUNT}
          </span>
          <ProgressBar percentage={FINISHED_STEPS_COUNT_PERCENTAGE} tiny />
        </div>
        <KebabMenuForCards onClick={onKebabMenuClick} />
      </div>
    </ShadowCard>
  );
};

export default AffairCard;
