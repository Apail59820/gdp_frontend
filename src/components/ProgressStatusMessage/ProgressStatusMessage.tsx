import React from 'react';
import { PhaseStatusEnum } from '../../../models/PhaseModel';
import styles from './ProgressStatusMessage.module.scss';
import completedIcon from '../../../public/completed.svg';
import ongoingIcon from '../../../public/ongoing.svg';
import pendingIcon from '../../../public/pending.svg';

type Props = {
  status: PhaseStatusEnum;
};

const ProgressStatusMessage = ({ status }: Props) => {
  const getInformationsByStatus = (): { text: string; icon: string } => {
    switch (status) {
      case PhaseStatusEnum.COMPLETED:
        return {
          text: 'Terminée',
          icon: completedIcon.src,
        };
      case PhaseStatusEnum.ONGOING:
        return {
          text: 'En cours',
          icon: ongoingIcon.src,
        };
      case PhaseStatusEnum.PENDING:
        return {
          text: 'En attente',
          icon: pendingIcon.src,
        };
    }
  };

  return (
    <span className={`text-small ${styles.progressStatusMessage}`}>
      État d'avancement :{' '}
      <span className={styles.status}>
        {getInformationsByStatus().text}
        <img src={getInformationsByStatus().icon} alt="Icon" />
      </span>
    </span>
  );
};

export default ProgressStatusMessage;
