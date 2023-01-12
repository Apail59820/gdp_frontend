import React from 'react';
import styles from './AffairCard.module.scss';
import { AffairModel } from '../../../models/AffairModel';
import { ProgressBar, ShadowCard } from '@projex/ui';
import kebabMenu from '../../../public/ellipsis-vertical.svg';
import logoGroupeProjex from '../../../public/logo-groupe-projex.svg';
import logoAmexia from '../../../public/logo-amexia.svg';
import logoDiagobat from '../../../public/logo-diagobat.svg';
import logoImperium from '../../../public/logo-imperium.svg';
import logoProbim from '../../../public/logo-probim.svg';
import logoProjex from '../../../public/logo-projex.svg';
import KebabMenuForCards from '../KebabMenuForCards/KebabMenuForCards';

type Props = {
  affair: AffairModel;
  onKebabMenuClick: React.MouseEventHandler<HTMLButtonElement>;
};

const AffairCard = ({ affair, onKebabMenuClick }: Props) => {
  // TODO
  const STEPS = [{ status: 'DONE' }, { status: 'DONE' }, { status: 'IN_PROGRESS' }];
  const STEPS_COUNT = STEPS.length;
  const FINISHED_STEPS_COUNT = STEPS.filter((step) => step.status === 'DONE').length;
  const FINISHED_STEPS_COUNT_PERCENTAGE = Math.floor((FINISHED_STEPS_COUNT / STEPS_COUNT) * 100);

  const getImageSrc = () => {
    switch (affair.internal_company) {
      case 'amexia':
        return logoAmexia.src;
      case 'diagobat':
        return logoDiagobat.src;
      case 'imperium':
        return logoImperium.src;
      case 'probim':
        return logoProbim.src;
      case 'projex':
        return logoProjex.src;
      default:
        return logoGroupeProjex.src;
    }
  };

  return (
    <ShadowCard>
      <div className={styles.affairCard}>
        <div className={styles.body}>
          <h4 className={styles.title}>{affair.name}</h4>
          <span>Chef de projet</span>
          <div className={styles.imageContainer}>
            <img src={getImageSrc()} alt={`Logo de l'entité ${affair.internal_company}`} />
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
