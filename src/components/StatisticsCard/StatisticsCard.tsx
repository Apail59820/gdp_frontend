import { ProgressBarRounded } from '@projex/ui';
import React from 'react';
import styles from './StatisticsCard.module.scss';

type Statistic = {
  label: string;
  percentage: number;
};

type Props = {
  statistics: Statistic[];
  max?: number;
};

const StatisticsCard = ({ statistics, max = 2 }: Props) => {
  return (
    <div className={styles.statisticsCard}>
      {statistics.slice(0, max).map((statistic: Statistic) => (
        <div className={styles.statistic}>
          <ProgressBarRounded percentage={statistic.percentage} />
          <span>{statistic.label}</span>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCard;
