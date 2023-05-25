import React, { useEffect, useState } from 'react';
import styles from './HomeDashboard.module.scss';
import { PlusOutlined } from '@ant-design/icons';
import { GdpProjectsModel } from '../../models/GdPModels';
import { QuickActionCard } from '@projex/ui';
import Grid from '../components/Grid/Grid';
import QuickAccessWidget from '../components/QuickAccessWidget/QuickAccessWidget';
import ProjectsWidget from '../components/ProjectsWidget/ProjectsWidget';
import { getGdpProjectsUsersClients } from '../../services/gestionDeProjets/GdpProjectsUsersClients';
import { useSelector } from 'react-redux';
import type { AppState } from '../../store/store';
import { getGdpProjectsUsersCollaborators } from '../../services/gestionDeProjets/GdpProjectsUsersCollaborators';
import getConfig from 'next/config';
import { QueryParameters } from '../../models/DirectusModel';
import { isRequestSuccessful } from '../../utils/isRequestSuccessful';
import CreateProjectForm from '../components/CreateProjectForm/CreateProjectForm';

const { publicRuntimeConfig } = getConfig();

const HomeDashboard = () => {
  const userProfile = useSelector((state: AppState) => state.auth.userProfile);

  const [currentUsersProjects, setCurrentUsersProjects] = useState<Partial<GdpProjectsModel>[]>([]);
  const [areCurrentUsersProjectsLoading, setAreCurrentUsersProjectsLoading] = useState(true);

  const [isCreateNewProjectModalOpen, setIsCreateNewProjectModalOpen] = useState(false);

  useEffect(
    function retrieveCurrentUsersProjects() {
      if (!userProfile || !userProfile.role || !userProfile.id) return;

      const queryParameters: QueryParameters = {
        filter: {
          directus_users_id: {
            _eq: userProfile.id,
          },
        },
        fields: ['id', 'projects_id.*', 'directus_users_id'].join(','),
        limit: 6,
      };

      const isCurrentUsersRoleClient = userProfile.role === publicRuntimeConfig.ROLE_CLIENT_ID;

      setAreCurrentUsersProjectsLoading(true);
      if (isCurrentUsersRoleClient) {
        getGdpProjectsUsersClients(queryParameters).then((result) => {
          if (isRequestSuccessful(result.status) && result.data) {
            const projects = result.data.map(
              (projectClients) => projectClients.projects_id as Partial<GdpProjectsModel>
            );
            setCurrentUsersProjects(projects);
          }
        });
      } else {
        getGdpProjectsUsersCollaborators(queryParameters).then((result) => {
          if (isRequestSuccessful(result.status) && result.data) {
            const projects = result.data.map(
              (projectCollaborators) => projectCollaborators.projects_id as Partial<GdpProjectsModel>
            );
            setCurrentUsersProjects(projects);
          }
        });
      }
      setAreCurrentUsersProjectsLoading(false);
    },
    [userProfile]
  );

  const getProfileCompletionPercentage = (): number => {
    if (!userProfile) return 0;
    const { id, role, status, ...ownDataThatTheUserCanEdit } = userProfile;

    const ownDataThatTheUserCanEditCount = Object.keys(ownDataThatTheUserCanEdit).length;
    const ownDataThatTheUserHasCompletedCount = Object.values(ownDataThatTheUserCanEdit).filter((data) => {
      if (typeof data === 'object') return data?.length;
      return data !== null;
    }).length;

    const percentageOfCompletion = (
      (ownDataThatTheUserHasCompletedCount / ownDataThatTheUserCanEditCount) *
      100
    ).toFixed(1);

    return +percentageOfCompletion;
  };

  return (
    <div className={styles.homeDashboard}>
      <QuickAccessWidget>
        <Grid>
          <QuickActionCard
            title="Créez un nouveau projet"
            button={{
              label: 'Ajouter un projet',
              onClick: () => setIsCreateNewProjectModalOpen(true),
              icon: <PlusOutlined />,
            }}
          >
            Créer un nouveau projet dés maintenant
          </QuickActionCard>
          <CreateProjectForm isOpen={isCreateNewProjectModalOpen} setIsOpen={setIsCreateNewProjectModalOpen} />
          <QuickActionCard
            title="Complétez votre profil"
            progress={getProfileCompletionPercentage()}
            button={{
              label: 'Ajouter des informations',
              href: publicRuntimeConfig.USER_SERVICE_URL + `/users/${userProfile?.id}`,
              icon: <PlusOutlined />,
            }}
          >
            Remplissez votre profil pour profiter pleinement de toutes les fonctionnalités
          </QuickActionCard>
        </Grid>
      </QuickAccessWidget>
      <ProjectsWidget
        projects={currentUsersProjects}
        isLoading={areCurrentUsersProjectsLoading}
        handleNewProjectClick={() => setIsCreateNewProjectModalOpen(true)}
      />
    </div>
  );
};

export default HomeDashboard;
