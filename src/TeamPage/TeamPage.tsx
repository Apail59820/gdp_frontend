import React from 'react';
import styles from '../../styles/Team.module.scss';
import { Breadcrumb } from '@projex/ui';
import { AffairModel } from '../../models/AffairModel';
import { ProjectModel } from '../../models/ProjectModel';
import { UserModel } from '../../models/UserModels';
import ClientTeamWidget from '../components/ClientTeamWidget/ClientTeamWidget';
import CollaboratorTeamWidget from '../components/CollaboratorTeamWidget/CollaboratorTeamWidget';
import Grid from '../components/Grid/Grid';
import PageHeaderBanner from '../components/PageHeaderBanner/PageHeaderBanner';
import UsersWidget from '../components/UsersWidget/UsersWidget';

type Props = {
  project: ProjectModel;
  affair?: AffairModel;
  clientTeam: UserModel[];
  collaboratorTeam: UserModel[];
};

const TeamPage = ({ project, affair, clientTeam, collaboratorTeam }: Props) => {
  // TODO
  const MANAGERS: UserModel[] = [...collaboratorTeam].slice(0, 1);

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
              users={clientTeam || []}
              clientCompany={project}
              clientTeamPageHref="/client?"
              onAddClientClick={() => console.log('open modal ?')}
            />
            <CollaboratorTeamWidget
              users={collaboratorTeam || []}
              companyEntity={project.company_entity!}
              onAddCollaboratorClick={() => console.log('open modal ?')}
            />
          </Grid>
        </section>
        <UsersWidget
          users={MANAGERS}
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
