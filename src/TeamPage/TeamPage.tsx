import React from 'react';
import styles from '../../styles/Team.module.scss';
import { Breadcrumb } from '@projex/ui';
import {
  GdpProjectsModel,
  GdpAffairModel,
  GdpProjectsClientsModel,
  GdpProjectsCollaboratorsModel,
  GdpAffairsUsersModel,
} from '../../models/GdPModels';
import { UsUserModel } from '../../models/UsModels';
import ClientTeamWidget from '../components/ClientTeamWidget/ClientTeamWidget';
import CollaboratorTeamWidget from '../components/CollaboratorTeamWidget/CollaboratorTeamWidget';
import Grid from '../components/Grid/Grid';
import PageHeaderBanner from '../components/PageHeaderBanner/PageHeaderBanner';
import UsersWidget from '../components/UsersWidget/UsersWidget';

type Props = {
  project: Partial<GdpProjectsModel>;
};

const TeamPage = ({ project }: Props) => {
  const projectClients = project.projects_directus_users_clients_ids?.map(
    (client) => (client as GdpProjectsClientsModel).directus_users_id as UsUserModel
  );

  const projectCollaborators = project.projects_directus_users_collaborators_ids?.map(
    (collaborator) => (collaborator as GdpProjectsCollaboratorsModel).directus_users_id as UsUserModel
  );

  const projectManagers = project
    .projects_directus_users_collaborators_ids!.map((collaborator) => {
      if ((collaborator as GdpProjectsCollaboratorsModel).project_manager)
        return (collaborator as GdpProjectsCollaboratorsModel).directus_users_id as UsUserModel;
    })
    .filter((manager) => manager) as UsUserModel[];

  const affairsCollaborators = project.affairs
    ?.map((affair) =>
      (affair as GdpAffairModel).affairs_directus_users_ids?.map(
        (user) => (user as GdpAffairsUsersModel).directus_users_id as UsUserModel
      )
    )
    .flat();

  const allProjectCollaboratorIncludingAffairs = [...(projectCollaborators || []), ...(affairsCollaborators || [])];

  return (
    <div className="page">
      <PageHeaderBanner data={project} />
      <div className={styles.teamPage}>
        <Breadcrumb dynamicRoutesLabel={[project.name!]} />
        <h1 className={styles.title}>L&apos;équipe du projet</h1>
        <section>
          <Grid type="narrow">
            <ClientTeamWidget
              users={projectClients || []}
              clientCompany={project}
              clientTeamPageHref="/client?"
              onAddClientClick={() => console.log('open modal ?')}
            />
            <CollaboratorTeamWidget
              users={projectManagers || []}
              companyEntity={typeof project.company_entity === 'string' ? project.company_entity['name'] : ''}
              onAddCollaboratorClick={() => console.log('open modal ?')}
            />
          </Grid>
        </section>
        <UsersWidget
          users={allProjectCollaboratorIncludingAffairs || []}
          label="Tous les collaborateurs  du projet"
          addUserLabel="Ajouter un collaborateur"
          onNewUserClick={() => console.log('open modal ?')}
        />
      </div>
    </div>
  );
};

export default TeamPage;
