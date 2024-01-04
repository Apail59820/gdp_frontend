import React from 'react';
import styles from './RecentActivitiesCard.module.scss';
import RecentActivities, { RecentActivitiesProps } from '../RecentActivities/RecentActivities';
import { ShadowCard } from 'projex-ui-dev';

const RecentActivitiesCard = (props: RecentActivitiesProps) => {
  return (
    <ShadowCard>
      <div className={styles.recentActivitiesContainer}>
        <RecentActivities {...props} />
      </div>
    </ShadowCard>
  );
};

export default RecentActivitiesCard;
