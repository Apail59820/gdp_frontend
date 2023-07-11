import React from 'react';
import styles from './PhasesWidget.module.scss';
import { useRouter } from 'next/router';
import { ManageItemCard } from '@projex/ui';
import Grid from '../Grid/Grid';
import { Section } from '@projex/ui';
import PhaseCard from '../PhaseCard/PhaseCard';
import type { GdpPhaseModel } from '../../../models/GestionDeProjets/GdpPhaseModel';

type Props = {
  phases: Partial<GdpPhaseModel>[];
  onNewPhaseClick: React.MouseEventHandler<HTMLButtonElement>;
  allPhasesPageHref?: string;
};

const PhasesWidget = ({ phases, onNewPhaseClick, allPhasesPageHref }: Props) => {
  const router = useRouter();

  return (
    <Section
      title="Avancement de l'affaire"
      link={
        phases.length > 0
          ? { label: 'Voir toutes les phases', href: allPhasesPageHref || `${router.asPath}/phases` }
          : undefined
      }
    >
      <Grid>
        {phases.map((phase: Partial<GdpPhaseModel>) => (
          <PhaseCard key={phase.id} phase={phase} onKebabMenuClick={() => console.log('handle click ?')} />
        ))}
        <div className={styles.manageItemCardContainer}>
          <ManageItemCard label="Nouvelle phase" onClick={onNewPhaseClick} />
        </div>
      </Grid>
    </Section>
  );
};

export default PhasesWidget;
