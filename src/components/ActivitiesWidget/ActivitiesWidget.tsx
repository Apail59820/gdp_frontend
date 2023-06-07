import { RecentActivitiesCard, Section } from '@projex/ui';
import React, { useMemo } from 'react';
import type { Activity } from '@projex/ui/dist/components/molecules/RecentActivities/RecentActivities';
import ConfigureWidget from '../ConfigureWidget/ConfigureWidget';
import {
  ActivitiesActionEnum,
  ActivitiesCollectionEnum,
  GdpActivitiesModel,
} from '../../../models/GestionDeProjets/GdpActivitiesModel';
import { DateTime } from 'luxon';

/*export type Activity = {
  creationDate: string;
  label: string;
  author: string;
};*/

type ActivitiesWidgetProps = {
  activities: Partial<GdpActivitiesModel>[];
};

const ActivitiesWidget = ({ activities }: ActivitiesWidgetProps) => {
  const renderLabel = (activity: Partial<GdpActivitiesModel>): string => {
    if (activity.collection === ActivitiesCollectionEnum.Project) {
      switch (activity.action) {
        case ActivitiesActionEnum.Create:
          return `Le projet a été créé`;
        case ActivitiesActionEnum.Update:
          return `Le projet a été mis à jour`;
      }
    }
    if (activity.collection === ActivitiesCollectionEnum.ProjectDirectusUsersCollaborator) {
      switch (activity.action) {
        case ActivitiesActionEnum.Create:
          return `Un collaborateur a été ajouté au projet`;
        case ActivitiesActionEnum.Delete:
          return `Un collaborateur a été retiré du projet`;
      }
    }
    if (activity.collection === ActivitiesCollectionEnum.ProjectDirectusUsersClient) {
      switch (activity.action) {
        case ActivitiesActionEnum.Create:
          return `Un client a été ajouté au projet`;
        case ActivitiesActionEnum.Delete:
          return `Un client a été retiré du projet`;
      }
    }
    return '';
  };

  const formattedActivities: Activity[] = useMemo(
    () =>
      activities.map((activity) => {
        return {
          creationDate: DateTime.fromISO(activity.date_created as string)
            .setLocale('fr')
            .toLocaleString(),
          label: renderLabel(activity),
          author: 'Test Author',
        };
      }),
    [activities]
  );

  return (
    <Section title="Activités récentes">
      {formattedActivities.length > 0 ? (
        <RecentActivitiesCard activities={formattedActivities} />
      ) : (
        <ConfigureWidget descriptionText="Aucune activité récente" />
      )}
    </Section>
  );
};

export default ActivitiesWidget;
