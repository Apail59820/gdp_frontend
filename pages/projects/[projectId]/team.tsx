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
import ManageProjectsCollaboratorForm from '../../../src/components/ManageProjectsCollaboratorForm/ManageProjectsCollaboratorForm';
import ManageProjectManagers from '../../../src/components/ManageProjectManagers/ManageProjectManagers';

const Team = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [project, setProject] = useState<Partial<GdpProjectsModel>>({});

  const [projectManagers, setProjectManagers] = useState<Partial<UsUserModel>[]>([]);
  const [projectClients, setProjectClients] = useState<Partial<UsUserModel>[]>([]);
  const [projectCollaborators, setProjectCollaborators] = useState<Partial<UsUserModel>[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddManagerModalOpen, setIsAddManagerModalOpen] = useState(false);

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
        else {
          setProject({});
          router.push('/404');
        }
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
        setProject({});
        router.push('/404');
      })
      .finally(() => setIsLoading(false));
  }, [router, projectId]);

  const retrieveProjectClients = async () => {
    const projectClientsIds: string[] = (project.projects_directus_users_clients_ids as GdpProjectsClientsModel[])?.map(
      (user) => user.directus_users_id as string
    );

    const response = await getUsUsers({
      filter: {
        id: {
          _in: projectClientsIds,
        },
      },
    });

    if (isRequestSuccessful(response.status) && response.data) return setProjectClients(response.data);
    setProjectClients([]);
  };

  const retrieveProjectManagers = async () => {
    const projectManagersIds: string[] = (
      project.projects_directus_users_collaborators_ids as GdpProjectsCollaboratorsModel[]
    )
      ?.filter((user) => user.project_manager)
      ?.map((user) => user.directus_users_id as string);

    const response = await getUsUsers({
      filter: {
        id: {
          _in: projectManagersIds,
        },
      },
    });

    if (isRequestSuccessful(response.status) && response.data) return setProjectManagers(response.data);
    setProjectManagers([]);
  };

  const retrieveProjectCollaborators = async () => {
    const projectCollaboratorsIds: string[] = (
      project.projects_directus_users_collaborators_ids as GdpProjectsCollaboratorsModel[]
    )
      ?.filter((user) => !user.project_manager)
      ?.map((user) => user.directus_users_id as string);

    const response = await getUsUsers({
      filter: {
        id: {
          _in: projectCollaboratorsIds,
        },
      },
    });

    if (isRequestSuccessful(response.status) && response.data) return setProjectCollaborators(response.data);
    setProjectCollaborators([]);
  };

  useEffect(() => {
    retrieveProjectClients();
    retrieveProjectManagers();
    retrieveProjectCollaborators();
  }, [project]);

  if (isLoading) return null;

  return (
    <div className="page">
      <PageHeaderBanner data={project} />
      <div className={styles.teamPage}>
        <Breadcrumb dynamicRoutesLabel={[project.name || 'Projet']} />
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
                setIsAddManagerModalOpen(true);
              }}
            />
          </Grid>
        </Section>
        <Section title="Clients">
          {projectClients.length ? (
            <Grid>
              {projectClients.map((client) => (
                <React.Fragment key={client.id}>
                  <UserCard user={client} onKebabMenuClick={() => {}} />
                </React.Fragment>
              ))}
            </Grid>
          ) : (
            <p>Aucun client n&apos;est lié à ce projet.</p>
          )}
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
                setIsModalOpen(true);
              }}
            />
          </Grid>
        </Section>
        {project.id ? (
          <ManageProjectsCollaboratorForm isOpen={isModalOpen} setIsOpen={setIsModalOpen} projectId={project.id} />
        ) : null}
        <ManageProjectManagers
          open={isAddManagerModalOpen}
          onClose={() => setIsAddManagerModalOpen(false)}
          project={project}
        />
      </div>
    </div>
  );
};

export default Team;
