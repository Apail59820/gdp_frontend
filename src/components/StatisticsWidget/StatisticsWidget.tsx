import { ManageItemCard } from '@projex/ui';
import styles from './StatisticsWidget.module.scss';
import { useRouter } from 'next/router';
import React from 'react';
import Section from '../Section/Section';
import StatisticsCard, { StatisticsCardProps } from '../StatisticsCard/StatisticsCard';
import ConfigureWidget from '../ConfigureWidget/ConfigureWidget';

type Props = StatisticsCardProps & {
  onNewStatisticClick: React.MouseEventHandler<HTMLButtonElement>;
  allStatisticsPageHref?: string;
};

const StatisticsWidget = ({ statistics, max, onNewStatisticClick, allStatisticsPageHref }: Props) => {
  const router = useRouter();

  return (
    <Section
      title="Statistiques du projet"
      link={
        statistics.length > 0
          ? { label: 'Voir toutes les statistiques', href: allStatisticsPageHref || `${router.asPath}/statistics` }
          : undefined
      }
    >
      {statistics.length > 0 ? (
        <div className={styles.statisticsContainer}>
          <div className={styles.statisticsCardContainer}>
            <StatisticsCard statistics={statistics} max={max} />
          </div>
          <div className={styles.newStatisticCardContainer}>
            <ManageItemCard direction="vertical" label="Nouvelle statistique" onClick={onNewStatisticClick} />
          </div>
        </div>
      ) : (
        <ConfigureWidget
          descriptionText="Vous n'avez aucune statistique"
          button={{
            label: 'Ajouter une statistique',
            onClick: onNewStatisticClick,
          }}
        />
      )}
    </Section>
  );
};

export default StatisticsWidget;
