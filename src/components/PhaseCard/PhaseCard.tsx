import React from 'react';
import styles from './PhaseCard.module.scss';
import { ShadowCard } from 'projex-ui';
import { GdpPhaseModel } from '../../../models/GestionDeProjets/GdpPhaseModel';
import { capitalize } from '../../../utils/capitalize';
import ProgressStatusMessage from '../ProgressStatusMessage/ProgressStatusMessage';
import KebabMenuForCards from '../KebabMenuForCards/KebabMenuForCards';
import { GdpFilesModel } from '../../../models/GdPModels';

type Props = {
  phase: Partial<GdpPhaseModel>;
  onKebabMenuClick: React.MouseEventHandler<HTMLButtonElement>;
  files: Partial<GdpFilesModel>[];
};

const PhaseCard = ({ phase, onKebabMenuClick, files }: Props) => {
  const { name, description, status } = phase;

  return (
    <ShadowCard>
      <div className={styles.phaseCard}>
        <div className={styles.content}>
          <h4 className={styles.title}>{name ? capitalize(name) : '/'}</h4>
          <p className={styles.description}>{description ? capitalize(description) : '/'}</p>
          {/* TODO Handle files display */}
          <span>
            {files.length} fichier{files.length > 1 ? 's' : ''} associé{files.length > 1 ? 's' : ''}
          </span>
        </div>
        {status ? <ProgressStatusMessage status={status} /> : null}
        <KebabMenuForCards onClick={onKebabMenuClick} />
      </div>
    </ShadowCard>
  );
};

export default PhaseCard;
