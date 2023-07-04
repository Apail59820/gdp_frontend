import React from 'react';
import styles from './PhaseCard.module.scss';
import { ShadowCard } from '@projex/ui';
import { GdpPhaseModel } from '../../../models/GestionDeProjets/GdpPhaseModel';
import { capitalize } from '../../../utils/capitalize';
import ProgressStatusMessage from '../ProgressStatusMessage/ProgressStatusMessage';
import KebabMenuForCards from '../KebabMenuForCards/KebabMenuForCards';

type Props = {
  phase: Partial<GdpPhaseModel>;
  onKebabMenuClick: React.MouseEventHandler<HTMLButtonElement>;
};

const PhaseCard = ({ phase, onKebabMenuClick }: Props) => {
  const { name, description, status } = phase;

  // TODO Handle files display
  const NUMBER_OF_FILES = 3;

  return (
    <ShadowCard>
      <div className={styles.phaseCard}>
        <div className={styles.content}>
          <h4 className={styles.title}>{name ? capitalize(name) : '/'}</h4>
          <p className={styles.description}>{description ? capitalize(description) : '/'}</p>
          {/* TODO Handle files display */}
          <span>
            {NUMBER_OF_FILES} fichier{NUMBER_OF_FILES > 1 ? 's' : ''} associé{NUMBER_OF_FILES > 1 ? 's' : ''}
          </span>
        </div>
        {status ? <ProgressStatusMessage status={status} /> : null}
        <KebabMenuForCards onClick={onKebabMenuClick} />
      </div>
    </ShadowCard>
  );
};

export default PhaseCard;
