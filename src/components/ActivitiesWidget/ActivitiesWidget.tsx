import React from 'react';
import { Section } from '@projex/ui';
import ConfigureWidget from '../ConfigureWidget/ConfigureWidget';
import { RecentActivitiesProps } from '../RecentActivities/RecentActivities';
import RecentActivitiesCard from '../RecentActivitiesCard/RecentActivitiesCard';
import { GdpActivitiesModel } from '../../../models/GdPModels';

const ActivitiesWidget = ({ activities }: { activities: GdpActivitiesModel[] }) => {
  console.log(activities);

  return (
    <Section title="Activités récentes">
      {activities?.length ? (
        <RecentActivitiesCard activities={activities} />
      ) : (
        <ConfigureWidget descriptionText="Aucune activité récente" />
      )}
    </Section>
  );
};

export default ActivitiesWidget;
