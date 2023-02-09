import React from 'react';
import styles from '../../styles/Team.module.scss';
import { Breadcrumb } from '@projex/ui';
import ClientTeamWidget from '../components/ClientTeamWidget/ClientTeamWidget';
import CollaboratorTeamWidget from '../components/CollaboratorTeamWidget/CollaboratorTeamWidget';
import Grid from '../components/Grid/Grid';
import PageHeaderBanner from '../components/PageHeaderBanner/PageHeaderBanner';
import UsersWidget from '../components/UsersWidget/UsersWidget';
import { GdpProjectsModel } from '../../models/GestionDeProjets/GdpProjectsModel';
import { GdpAffairModel } from '../../models/GestionDeProjets/GdpAffairModel';
import { UsUserModel } from '../../models/UserService/UsUserModel';

type Props = {
  project: GdpProjectsModel;
  affair?: GdpAffairModel;
  clientTeam: UsUserModel[];
  collaboratorTeam: UsUserModel[];
};

const TeamPage = ({ project, affair, clientTeam, collaboratorTeam }: Props) => {
  // TODO
  const MANAGERS: UsUserModel[] = [...collaboratorTeam].slice(0, 1);

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
              companyEntity={project.company_entity! as any}
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
