import { RecentActivitiesCard } from '@projex/ui';
import React from 'react';
import Section from '../Section/Section';
import type { RecentActivitiesProps } from '@projex/ui/dist/components/molecules/RecentActivities/RecentActivities';
import ConfigureWidget from '../ConfigureWidget/ConfigureWidget';

const ActivitiesWidget = ({ activities }: RecentActivitiesProps) => {
  return (
    <Section title="Activités récentes">
      {activities.length ? (
        <RecentActivitiesCard activities={activities} />
      ) : (
        <ConfigureWidget descriptionText="Aucune activité récente" />
      )}
    </Section>
  );
};

export default ActivitiesWidget;
