/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  GdpAffairModel,
  GdpAffairsUsersModel,
  GdpProjectsClientsModel,
  GdpProjectsCollaboratorsModel,
  GdpProjectsModel,
} from '../../../../../models/GdPModels';
import { getGdpProjectById } from '../../../../../services/gestionDeProjets/GdpProjects';
import { isRequestSuccessful } from '../../../../../utils/isRequestSuccessful';
import { getGdpAffair } from '../../../../../services/gestionDeProjets/GdpAffairs';
import PageHeaderBanner from '../../../../../src/components/PageHeaderBanner/PageHeaderBanner';
import styles from '../../../../../styles/Team.module.scss';
import { Breadcrumb, Grid, ManageItemCard, Section } from '@projex/ui';
import ClientTeamWidget from '../../../../../src/components/ClientTeamWidget/ClientTeamWidget';
import CollaboratorTeamWidget from '../../../../../src/components/CollaboratorTeamWidget/CollaboratorTeamWidget';
import { UsUserModel } from '../../../../../models/UsModels';
import UserCard from '../../../../../src/components/UserCard/UserCard';
import { getUsUsers } from '../../../../../services/userService/UsUsers';

const Team = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [project, setProject] = useState<Partial<GdpProjectsModel>>({});
  const [affair, setAffair] = useState<Partial<GdpAffairModel>>({});

  const [projectClients, setProjectClients] = useState<Partial<UsUserModel>[]>([]);
  const [projectManagers, setProjectManagers] = useState<Partial<UsUserModel>[]>([]);

  const [affairManagers, setAffairManagers] = useState<Partial<UsUserModel>[]>([]);
  const [affairCollaborators, setAffairCollaborators] = useState<Partial<UsUserModel>[]>([]);

  const { projectId, affairId } = router.query;

  useEffect(() => {
    if (!projectId || typeof projectId !== 'string' || !affairId || typeof affairId !== 'string') return;

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
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        setProject({});
      });

    getGdpAffair(+affairId)
      .then((res) => {
        if (isRequestSuccessful(res.status) && res.data) setAffair(res.data);
        else setAffair({});
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        setAffair({});
      })
      .finally(() => setIsLoading(false));
  }, [router, projectId, affairId]);

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

  const retrieveAffairManagers = async () => {
    const affairManagersIds: string[] = (affair.affairs_directus_users_ids as GdpAffairsUsersModel[])
      ?.filter((user) => user.project_manager)
      ?.map((user) => user.directus_users_id as string);

    const response = await getUsUsers({
      filter: {
        id: {
          _in: affairManagersIds,
        },
      },
    });

    if (isRequestSuccessful(response.status) && response.data) return setAffairManagers(response.data);
    setAffairManagers([]);
  };

  const retrieveAffairCollaborators = async () => {
    const affairCollaboratorsIds: string[] = (affair.affairs_directus_users_ids as GdpAffairsUsersModel[])
      ?.filter((user) => !user.project_manager)
      ?.map((user) => user.directus_users_id as string);

    const response = await getUsUsers({
      filter: {
        id: {
          _in: affairCollaboratorsIds,
        },
      },
    });

    if (isRequestSuccessful(response.status) && response.data) return setAffairCollaborators(response.data);
    setAffairCollaborators([]);
  };

  useEffect(() => {
    retrieveProjectClients();
    retrieveProjectManagers();
    retrieveAffairManagers();
    retrieveAffairCollaborators();
  }, [project, affair]);

  if (isLoading) return null;

  return (
    <div>
      <PageHeaderBanner data={project} />
      <div className={styles.teamPage}>
        <Breadcrumb dynamicRoutesLabel={[project.name || 'Projet', affair.name || 'Affaire']} />
        <h1 className={styles.title}>{affair.name} - L&apos;équipe</h1>
        <section>
          <Grid type="narrow">
            <ClientTeamWidget users={projectClients} clientCompany={{}} onAddClientClick={() => {}} />
            <CollaboratorTeamWidget
              users={projectManagers}
              companyEntity={'companyEntity'}
              onAddCollaboratorClick={() => {}}
            />
          </Grid>
        </section>
        <Section title="Responsables de l'affaire">
          <Grid>
            {affairManagers.map((manager) => (
              <React.Fragment key={manager.id}>
                <UserCard user={manager} onKebabMenuClick={() => {}} />
              </React.Fragment>
            ))}
            <ManageItemCard
              label="Ajouter un responsable d'affaire"
              onClick={() => {
                // TODO Handle click
              }}
            />
          </Grid>
        </Section>
        <Section title="Équipe">
          <Grid>
            {affairCollaborators.map((collaborator) => (
              <React.Fragment key={collaborator.id}>
                <UserCard user={collaborator} onKebabMenuClick={() => {}} />
              </React.Fragment>
            ))}
            <ManageItemCard
              label="Ajouter un collaborateur à l'affaire"
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
