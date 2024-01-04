import React from 'react';
import styles from './PhasesWidget.module.scss';
import { useRouter } from 'next/router';
import { ManageItemCard } from 'projex-ui-dev';
import Grid from '../Grid/Grid';
import { Section } from 'projex-ui-dev';
import PhaseCard from '../PhaseCard/PhaseCard';
import type { GdpPhaseModel } from '../../../models/GestionDeProjets/GdpPhaseModel';
import ConfigureWidget from '../ConfigureWidget/ConfigureWidget';
import { GdpFilesModel } from '../../../models/GdPModels';
import Files from '../../../pages/files';

type Props = {
  phases: Partial<GdpPhaseModel>[];
  onNewPhaseClick: React.MouseEventHandler<HTMLButtonElement>;
  allPhasesPageHref?: string;
  displayCreateCard?: boolean;
  files: Partial<GdpFilesModel>[];
};

const PhasesWidget = ({ phases, onNewPhaseClick, allPhasesPageHref, displayCreateCard, files }: Props) => {
  const router = useRouter();

  return (
    <Section
      title="Avancement de l'affaire"
      link={
        phases.length > 0
          ? { label: 'Voir toutes les phases', href: allPhasesPageHref || `${router.asPath}/advancement` }
          : undefined
      }
    >
      <Grid>
        {phases.length > 0 ? (
          phases.map((phase: Partial<GdpPhaseModel>) => (
            <PhaseCard key={phase.id} phase={phase} onKebabMenuClick={() => console.log('handle click ?')} files={files.filter((file) => file.phase_id == phase.id)}/>
          ))
        ) : (
          <ConfigureWidget descriptionText={"Aucune phase n'a été créée pour cette affaire."} />
        )}
        {displayCreateCard && (
          <div className={styles.manageItemCardContainer}>
            <ManageItemCard label="Nouvelle phase" onClick={onNewPhaseClick} />
          </div>
        )}
      </Grid>
    </Section>
  );
};

export default PhasesWidget;
