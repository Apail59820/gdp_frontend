import { GdpPhaseModel } from '../../../models/GestionDeProjets/GdpPhaseModel';
import { GdpSatisfactionModel } from '../../../models/GestionDeProjets/GdpSatisfactionModel';

import styles from './PhaseSatisfaction.module.scss';
import { ProgressBar } from '@projex/ui';
import DisplaySatisfaction from '../DisplaySatisfaction/DisplaySatisfaction';
import React from 'react';

interface PhaseSatisfactionProps {
  phase: Partial<GdpPhaseModel>;
  satisfactions: Partial<GdpSatisfactionModel>[];
}

const PhaseSatisfaction = ({ phase, satisfactions }: PhaseSatisfactionProps) => {
  const total = 4;

  const score =
    satisfactions.reduce(
      (acc, satisfaction) => acc + (satisfaction.score_hard_skills ? satisfaction.score_hard_skills : 0),
      0
    ) / satisfactions.length;

  const getColor = () => {
    if (score <= total / 3) return 'alert';
    if (score >= total / 3 && score <= (total / 3) * 2) return 'warning';
    if (score >= (total / 3) * 2) return 'ok';
  };

  const displayStatus = () => {
    switch (phase.status) {
      case 'pending':
        return <span className={styles.pending}>En attente</span>;
      case 'ongoing':
        return <span className={styles.ongoing}>En cours</span>;
      case 'completed':
        return <span className={styles.completed}>Terminée</span>;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.phase}>
        <div className={styles.phaseStatus}>
          <span className={styles.phaseOrder}>{phase.order}</span>
          <>{displayStatus()}</>
        </div>
        <div className={styles.displaySatisfaction}>
          <span>satisfaction</span>
          <ProgressBar tiny percentage={isNaN((score / total) * 100) ? 0 : (score / total) * 100} color={getColor()} />
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.phaseName}>{phase.name}</div>
        <div>
          {satisfactions.map((satisfaction, index) => (
            <>
              <DisplaySatisfaction satisfaction={satisfaction} />
              {index !== satisfactions.length - 1 && <hr className={styles.separator} />}
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhaseSatisfaction;
