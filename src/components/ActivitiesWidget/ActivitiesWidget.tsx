import { RecentActivitiesCard, Section } from 'projex-ui-dev';
import React, { useMemo } from 'react';
import ConfigureWidget from '../ConfigureWidget/ConfigureWidget';
import {
  ActivitiesActionEnum,
  ActivitiesCollectionEnum,
  GdpActivitiesModel,
} from '../../../models/GestionDeProjets/GdpActivitiesModel';
import { DateTime } from 'luxon';
import { useDispatch, useSelector } from 'react-redux';
import { selectUsers, setUsers } from '../../../store/reducers/usersReducer';
import { get } from 'js-cookie';
import { getUsUser, getUsUsers } from '../../../services/userService/UsUsers';
import {Activity} from "projex-ui/dist/types/components/molecules/RecentActivities/RecentActivities";

/*export type Activity = {
  creationDate: string;
  label: string;
  author: string;
};*/

type ActivitiesWidgetProps = {
  activities: Partial<GdpActivitiesModel>[];
};

const ActivitiesWidget = ({ activities }: ActivitiesWidgetProps) => {
  const users = useSelector(selectUsers);
  const dispatch = useDispatch();
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
      activities?.map((activity) => {
        let author = 'Inconnu';
        if (activity.user_created) {
          if (typeof activity.user_created === 'string') {
            const user = users.find((user) => user.id === activity.user_created);
            if (user) {
              author = `${user.first_name} ${user.last_name}`;
            } else {
              getUsUser(activity.user_created).then((user) => {
                if (user && user.data) {
                  author = `${user.data.first_name} ${user.data.last_name}`;
                  dispatch(setUsers([...users, user.data]));
                }
              });
            }
          } else {
            author = `${activity.user_created.first_name} ${activity.user_created.last_name}`;
          }
        }
        return {
          creationDate: DateTime.fromISO(activity.date_created as string)
            .setLocale('fr')
            .toLocaleString(),
          label: renderLabel(activity),
          author: author,
        };
      }),
    [activities, dispatch, users]
  );

  return (
    <Section title="Activités récentes">
      {formattedActivities?.length > 0 ? (
        <RecentActivitiesCard activities={formattedActivities} />
      ) : (
        <ConfigureWidget descriptionText="Aucune activité récente" />
      )}
    </Section>
  );
};

export default ActivitiesWidget;
