import React from 'react';
import styles from './AffairsWidget.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GdpAffairModel } from '../../../models/GestionDeProjets/GdpAffairModel';
import { ManageItemCard } from 'projex-ui';
import AffairCard from '../AffairCard/AffairCard';
import Grid from '../Grid/Grid';
import { Section } from 'projex-ui';

type Props = {
  affairs: Partial<GdpAffairModel>[];
  onNewAffairClick: React.MouseEventHandler<HTMLButtonElement>;
  allAffairsPageHref?: string;
  max?: number;
  displayCreateCard?: boolean;
};

const AffairsWidget = ({ affairs, onNewAffairClick, allAffairsPageHref, max = 6, displayCreateCard }: Props) => {
  const router = useRouter();

  return (
    <Section
      title="Les affaires"
      link={
        affairs.length > 0
          ? { label: 'Voir toutes les affaires', href: allAffairsPageHref || `${router.asPath}/affairs` }
          : undefined
      }
    >
      <Grid>
        {[...affairs].slice(0,max).map((affair: Partial<GdpAffairModel>) => (
          <Link key={affair.id} href={`${router.asPath}/affairs/${affair.id}`}>
            {/* TODO Handle onClick */}
            <AffairCard affair={affair} onKebabMenuClick={() => console.log('handle click ?')} />
          </Link>
        ))}
        {displayCreateCard && (
          <div className={styles.manageItemCardContainer}>
            <ManageItemCard label="Nouvelle affaire" onClick={onNewAffairClick} />
          </div>
        )}
      </Grid>
    </Section>
  );
};

export default AffairsWidget;
