import React from 'react';
import styles from '../../styles/Team.module.scss';
import { Breadcrumb } from '@projex/ui';
import {
  GdpProjectsModel,
  GdpAffairModel,
  GdpProjectsClientsModel,
  GdpProjectsCollaboratorsModel,
} from '../../models/GdPModels';
import { UsUserModel } from '../../models/UsModels';
import ClientTeamWidget from '../components/ClientTeamWidget/ClientTeamWidget';
import CollaboratorTeamWidget from '../components/CollaboratorTeamWidget/CollaboratorTeamWidget';
import Grid from '../components/Grid/Grid';
import PageHeaderBanner from '../components/PageHeaderBanner/PageHeaderBanner';
import UsersWidget from '../components/UsersWidget/UsersWidget';

type Props = {
  project: Partial<GdpProjectsModel>;
  affair?: Partial<GdpAffairModel>;
};

const TeamPage = ({ project, affair }: Props) => {
  const clientTeam = (project.projects_directus_users_clients_ids as GdpProjectsClientsModel[])?.map(
    (client) => client.directus_users_id as UsUserModel
  );
  const collaboratorTeam = (project.projects_directus_users_collaborators_ids as GdpProjectsCollaboratorsModel[])?.map(
    (collaborator) => collaborator.directus_users_id as UsUserModel
  );
  const managerTeam = (project.projects_directus_users_collaborators_ids as GdpProjectsCollaboratorsModel[])?.map(
    (collaborator) => {
      if (collaborator.project_manager) return collaborator.directus_users_id;
    }
  ) as UsUserModel[];

  console.log('clientTeam ' + clientTeam);
  console.log('collaboratorTeam ' + collaboratorTeam);
  console.log('managerTeam ' + managerTeam);
  console.log(project);

  return (
    <div className="page">
      <PageHeaderBanner data={project} />
      <div className={styles.teamPage}>
        <Breadcrumb dynamicRoutesLabel={affair ? [project.name!, affair.name!] : [project.name!]} />
        <h1 className={styles.title}>
          {affair ? `${affair.name} - ` : ''}L&apos;équipe{!affair ? ' du projet' : ''}
        </h1>
        <section>
          <Grid type="narrow">
            <ClientTeamWidget
              users={clientTeam}
              clientCompany={project}
              clientTeamPageHref="/client?"
              onAddClientClick={() => console.log('open modal ?')}
            />
            <CollaboratorTeamWidget
              users={collaboratorTeam || []}
              companyEntity={typeof project.company_entity === 'string' ? project.company_entity['name'] : ''}
              onAddCollaboratorClick={() => console.log('open modal ?')}
            />
          </Grid>
        </section>
        <UsersWidget
          users={managerTeam || []}
          label={`Responsables ${affair ? "de l'affaire" : 'du projet'}`}
          addUserLabel="Ajouter un responsable"
          onNewUserClick={() => console.log('open modal ?')}
        />
        <UsersWidget
          users={clientTeam}
          label="Équipe client"
          addUserLabel="Nouveau client"
          onNewUserClick={() => console.log('open modal ?')}
        />
        <UsersWidget
          users={collaboratorTeam}
          label="Équipe"
          addUserLabel="Nouvel équipier"
          onNewUserClick={() => console.log('open modal ?')}
        />
      </div>
    </div>
  );
};

export default TeamPage;
