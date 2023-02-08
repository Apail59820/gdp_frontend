import { ProgressBarRounded } from '@projex/ui';
import React from 'react';
import styles from './StatisticsCard.module.scss';

export type Statistic = {
  label: string;
  percentage: number;
};

export type StatisticsCardProps = {
  statistics: Statistic[];
  max?: number;
};

const StatisticsCard = ({ statistics, max = 2 }: StatisticsCardProps) => {
  return (
    <div className={styles.statisticsCard}>
      {statistics.slice(0, max).map((statistic: Statistic) => (
        <div key={statistic.label} className={styles.statistic}>
          <ProgressBarRounded percentage={statistic.percentage} />
          <span>{statistic.label}</span>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCard;
