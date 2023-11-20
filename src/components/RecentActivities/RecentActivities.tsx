import React from 'react';
import styles from './RecentActivities.module.scss';
import { GdpActivitiesModel } from '../../../models/GdPModels';
import { UsUserModel } from '../../../models/UsModels';

export type RecentActivitiesProps = {
  activities: Partial<GdpActivitiesModel>[];
};

const RecentActivities = ({ activities }: RecentActivitiesProps) => {
  return (
    <ul className={styles.recentActivities}>
      {activities.map((activity, index) => {
        const author =
          (activity.user_created as UsUserModel)?.first_name &&
          (activity.user_created as UsUserModel)?.last_name &&
          (activity.user_created as UsUserModel).first_name + ' ' + (activity.user_created as UsUserModel).last_name;

        return (
          <li key={index} className={styles.activity}>
            {activity.date_created ? (
              <time className={`text-small ${styles.creationDate}`}>
                {new Date(activity.date_created)?.toLocaleDateString('fr')}
              </time>
            ) : null}
            <p className={`text-small ${styles.label}`}>{activity.action}</p>
            {author ? <span className={`text-tiny ${styles.author}`}>{author}</span> : null}
          </li>
        );
      })}
    </ul>
  );
};

export default RecentActivities;
