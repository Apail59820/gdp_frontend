/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { GdpProjectsClientsModel, GdpProjectsCollaboratorsModel, GdpProjectsModel } from '../../../models/GdPModels';
import { getGdpProjectById } from '../../../services/gestionDeProjets/GdpProjects';
import styles from '../../../styles/Team.module.scss';
import { isRequestSuccessful } from '../../../utils/isRequestSuccessful';
import PageHeaderBanner from '../../../src/components/PageHeaderBanner/PageHeaderBanner';
import { Breadcrumb, Grid, ManageItemCard, Section } from '@projex/ui';
import ClientTeamWidget from '../../../src/components/ClientTeamWidget/ClientTeamWidget';
import CollaboratorTeamWidget from '../../../src/components/CollaboratorTeamWidget/CollaboratorTeamWidget';
import UserCard from '../../../src/components/UserCard/UserCard';
import { UsUserModel } from '../../../models/UsModels';
import { getUsUsers } from '../../../services/userService/UsUsers';

const Team = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [project, setProject] = useState<Partial<GdpProjectsModel>>({});

  const [projectManagers, setProjectManagers] = useState<Partial<UsUserModel>[]>([]);
  const [projectClients, setProjectClients] = useState<Partial<UsUserModel>[]>([]);
  const [projectCollaborators, setProjectCollaborators] = useState<Partial<UsUserModel>[]>([]);

  const { projectId } = router.query;

  useEffect(() => {
    if (!projectId || typeof projectId !== 'string') return;

    setIsLoading(true);

    getGdpProjectById(
      +projectId,
      [
        'id',
        'name',
        'company_entity.*',
        'projects_directus_users_clients_ids.*',
        'projects_directus_users_collaborators_ids.*',
        'status',
        'affairs.affairs_directus_users_ids.directus_users_id',
      ].join(',')
    )
      .then((res) => {
        if (isRequestSuccessful(res.status) && res.data) setProject(res.data);
        else setProject({});
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
        setProject({});
      })
      .finally(() => setIsLoading(false));
  }, [router, projectId]);

  const retrieveProjectManagers = async () => {
    const projectManagersIds: string[] = (
      project.projects_directus_users_collaborators_ids as GdpProjectsCollaboratorsModel[]
    )
      ?.filter((user) => user.project_manager)
      .map((user) => user.directus_users_id as string);

    const response = await getUsUsers({
      filter: {
        id: {
          _in: projectManagersIds,
        },
      },
    });

    if (response.status === 200 && response.data) return setProjectManagers(response.data);
    setProjectManagers([]);
  };

  const retrieveProjectClients = async () => {
    const projectClientsIds: string[] = (project.projects_directus_users_clients_ids as GdpProjectsClientsModel[]).map(
      (user) => user.directus_users_id as string
    );

    const response = await getUsUsers({
      filter: {
        id: {
          _in: projectClientsIds,
        },
      },
    });

    if (response.status === 200 && response.data) return setProjectClients(response.data);
    setProjectClients([]);
  };

  const retrieveProjectCollaborators = async () => {
    const projectCollaboratorsIds: string[] = (
      project.projects_directus_users_collaborators_ids as GdpProjectsCollaboratorsModel[]
    ).map((user) => user.directus_users_id as string);

    const response = await getUsUsers({
      filter: {
        id: {
          _in: projectCollaboratorsIds,
        },
      },
    });

    if (response.status === 200 && response.data) return setProjectCollaborators(response.data);
    setProjectCollaborators([]);
  };

  useEffect(() => {
    retrieveProjectManagers();
    retrieveProjectClients();
    retrieveProjectCollaborators();
  }, [project]);

  if (isLoading) return null;

  return (
    <div className="page">
      <PageHeaderBanner data={project} />
      <div className={styles.teamPage}>
        <Breadcrumb dynamicRoutesLabel={[project.name!]} />
        <h1 className={styles.title}>L&apos;équipe du projet</h1>
        <section>
          <Grid type="narrow">
            <ClientTeamWidget users={projectClients} clientCompany={{}} onAddClientClick={() => {}} />
            <CollaboratorTeamWidget
              users={projectCollaborators}
              companyEntity={'companyEntity'}
              onAddCollaboratorClick={() => {}}
            />
          </Grid>
        </section>
        <Section title="Chefs de projet">
          <Grid>
            {projectManagers.map((manager) => (
              <React.Fragment key={manager.id}>
                <UserCard user={manager} onKebabMenuClick={() => {}} />
              </React.Fragment>
            ))}
            <ManageItemCard
              label="Ajouter un chef de projet"
              onClick={() => {
                // TODO Handle click
              }}
            />
          </Grid>
        </Section>
        <Section title="Clients">
          <Grid>
            {projectClients.map((client) => (
              <React.Fragment key={client.id}>
                <UserCard user={client} onKebabMenuClick={() => {}} />
              </React.Fragment>
            ))}
            <ManageItemCard
              label="Ajouter un client"
              onClick={() => {
                // TODO Handle click
              }}
            />
          </Grid>
        </Section>
        <Section title="Équipe">
          <Grid>
            {projectCollaborators.map((collaborator) => (
              <React.Fragment key={collaborator.id}>
                <UserCard user={collaborator} onKebabMenuClick={() => {}} />
              </React.Fragment>
            ))}
            <ManageItemCard
              label="Ajouter un collaborateur"
              onClick={() => {
                // TODO Handle click
              }}
            />
          </Grid>
        </Section>
      </div>
    </div>
  );
};

export default Team;
