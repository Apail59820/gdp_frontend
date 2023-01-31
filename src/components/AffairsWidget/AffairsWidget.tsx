import React from 'react';
import styles from './AffairsWidget.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AffairModel } from '../../../models/AffairModel';
import { ManageItemCard } from '@projex/ui';
import AffairCard from '../AffairCard/AffairCard';
import Grid from '../Grid/Grid';
import Section from '../Section/Section';

type Props = {
  affairs: AffairModel[];
  onNewAffairClick: React.MouseEventHandler<HTMLButtonElement>;
};

const AffairsWidget = ({ affairs, onNewAffairClick }: Props) => {
  const router = useRouter();

  return (
    <Section
      title="Les affaires"
      link={affairs.length > 0 ? { label: 'Voir toutes les affaires', href: `${router.asPath}/affairs` } : undefined}
    >
      <Grid>
        {affairs.map((affair: AffairModel) => (
          <Link key={affair.id} href={`${router.asPath}/affairs/${affair.id}`}>
            {/* TODO Handle onClick */}
            <AffairCard affair={affair} onKebabMenuClick={() => console.log('handle click ?')} />
          </Link>
        ))}
        <div className={styles.manageItemCardContainer}>
          <ManageItemCard label="Nouvelle affaire" onClick={onNewAffairClick} />
        </div>
      </Grid>
    </Section>
  );
};

export default AffairsWidget;
