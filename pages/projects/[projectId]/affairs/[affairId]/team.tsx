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
import { Breadcrumb, Grid, ManageItemCard, Section } from 'projex-ui';
import ClientTeamWidget from '../../../../../src/components/ClientTeamWidget/ClientTeamWidget';
import CollaboratorTeamWidget from '../../../../../src/components/CollaboratorTeamWidget/CollaboratorTeamWidget';
import { UsClientsCompanyEntitiesModel, UsCompanyEntityModel, UsUserModel } from '../../../../../models/UsModels';
import UserCard from '../../../../../src/components/UserCard/UserCard';
import { getUsUsers } from '../../../../../services/userService/UsUsers';
import ManageAffairUsersForm from '../../../../../src/components/ManageAffairUsersForm/ManageAffairUsersForm';
import ManageAffairManagerForm from '../../../../../src/components/ManageAffairManagerForm/ManageAffairManagerForm';
import { getUsCompanyEntity } from '../../../../../services/userService/UsCompanyEntities';
import {getGdpProjectsUsersClients} from "../../../../../services/gestionDeProjets/GdpProjectsUsersClients";

const Team = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [project, setProject] = useState<Partial<GdpProjectsModel>>({});
  const [affair, setAffair] = useState<Partial<GdpAffairModel>>({});

  const [projectClients, setProjectClients] = useState<Partial<UsUserModel>[]>([]);
  const [projectManagers, setProjectManagers] = useState<Partial<UsUserModel>[]>([]);

  const [affairManagers, setAffairManagers] = useState<Partial<UsUserModel>[]>([]);
  const [affairCollaborators, setAffairCollaborators] = useState<Partial<UsUserModel>[]>([]);
  const [affairClients, setAffairClients] = useState<Partial<UsUserModel>[]>([]);

  const [companyEntity, setCompanyEntity] = useState<Partial<UsCompanyEntityModel>>();

  const [userToAddType, setUserToAddType] = useState<'collaborator' | 'client'>('collaborator');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddManagerModalOpen, setIsAddManagerModalOpen] = useState(false);

  const [refreshProject, setRefreshProject] = useState<boolean>(true);
  const { projectId, affairId } = router.query;

  useEffect(() => {
    if(refreshProject) {
      setRefreshProject(false);
    }
    else { return ;}

    if (!projectId || typeof projectId !== 'string' || !affairId || typeof affairId !== 'string') return;

    setIsLoading(true);

    getGdpProjectById(
      +projectId,
      [
        'id',
        'name',
        'company_entity',
        'clients_company_entity',
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
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        setProject({});
        router.push('/404');
      });

    getGdpAffair(+affairId)
      .then((res) => {
        if (isRequestSuccessful(res.status) && res.data) setAffair(res.data);
        else {
          setAffair({});
          router.push('/404');
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        setAffair({});
        router.push('/404');
      })
      .finally(() => setIsLoading(false));
  }, [router, projectId, affairId, refreshProject]);

  const retrieveProjectCompanyEntity = async () => {
    if (!project.company_entity) return;

    const response = await getUsCompanyEntity(project.company_entity as number);

    if (isRequestSuccessful(response.status) && response.data) return setCompanyEntity(response.data);
    setCompanyEntity({});
  };

  useEffect(() => {
    retrieveProjectCompanyEntity();
  }, [project.company_entity]);

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
    const affairRes = await getGdpAffair(parseInt(affairId as string, 10));

    const affairCollaboratorsIds: string[] = (affairRes.data?.affairs_directus_users_ids as GdpAffairsUsersModel[])
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

  const retrieveAffairClients = async () => {
    const retrieveIds = await getGdpProjectsUsersClients({filter: {affairs_id: {_eq: affair.id}}});
    if(!isRequestSuccessful(retrieveIds.status) || !retrieveIds?.data.length) return;

    getUsUsers({filter: {id: {_in : retrieveIds.data.map((client) => client.directus_users_id)}}}).then((res) => {
      if(isRequestSuccessful(res.status) && res?.data.length){
        setAffairClients(res.data);
      }
    })
  }

  useEffect(() => {
    retrieveProjectClients();
    retrieveProjectManagers();
    retrieveAffairManagers();
    retrieveAffairCollaborators();
    retrieveAffairClients();
  }, [project, affair]);

  useEffect(() => {
    retrieveAffairCollaborators();
    setRefreshProject(true);
  }, [isModalOpen]);

  useEffect(() => {
    if (affair.id) {

      getGdpProjectsUsersClients({filter: {affairs_id: {_eq: affair.id}}}).then((response) => {
        if (response.status === 200 && response.data) {
          const clientsToRetrieve: string[] = [];
          const clients: Partial<UsUserModel>[] = [];
          response.data.forEach((relation) => {
            if (relation.directus_users_id) {
              if (typeof relation.directus_users_id === 'string') clientsToRetrieve.push(relation.directus_users_id);
              else clients.push(relation.directus_users_id);
            }
          });
          if (clientsToRetrieve.length > 0) {
            getUsUsers({filter: {id: {_in: clientsToRetrieve}}}).then((response) => {
              if (response.status === 200 && response.data) {
                setProjectClients([...clients, ...response.data]);
              }
            });
          } else {
            setProjectClients(clients);
          }
        }
      });
    }
  }, [isModalOpen]);

  if (isLoading) return null;

  return (
    <div className={'page'}>
      <PageHeaderBanner data={project} />
      <div className={styles.teamPage}>
        <Breadcrumb dynamicRoutesLabel={[project.name || 'Projet', affair.name || 'Affaire']} />
        <h1 className={styles.title}>{affair.name} - L&apos;équipe</h1>
        <section>
          <Grid type="narrow">
            <ClientTeamWidget
              users={projectClients}
              clientCompany={(project.clients_company_entity as Partial<UsClientsCompanyEntitiesModel> | null) || {}}
              onAddClientClick={() => {
                setUserToAddType('client');
                setIsModalOpen(true);
              }}
              displayConfigureButton
              projectType={'affair'}
            />
            <CollaboratorTeamWidget
              users={projectManagers}
              companyEntity={companyEntity?.name || ''}
              onAddCollaboratorClick={() => {
                setUserToAddType('collaborator');
                setIsModalOpen(true);
              }}
            />
          </Grid>
        </section>
        <Section title="Responsables de l'affaire">
          <Grid>
            {affairManagers.map((manager) => (
              <React.Fragment key={manager.id}>
                <UserCard user={manager} />
              </React.Fragment>
            ))}
            <ManageItemCard
              label="Ajouter un responsable d'affaire"
              onClick={() => {
                setIsAddManagerModalOpen(true);
              }}
            />
          </Grid>
        </Section>
        <Section title="Clients">
          <Grid>
            {affairClients.map((client) => (
                <React.Fragment key={client.id}>
                  <UserCard user={client} />
                </React.Fragment>
            ))}
            <ManageItemCard
                label="Ajouter un client à l'affaire"
                onClick={() => {
                  setUserToAddType('client');
                  setIsModalOpen(true);
                }}
            />
          </Grid>
        </Section>
        <Section title="Équipe">
          <Grid>
            {affairCollaborators.map((collaborator) => (
              <React.Fragment key={collaborator.id}>
                <UserCard user={collaborator} />
              </React.Fragment>
            ))}
            <ManageItemCard
              label="Ajouter un collaborateur à l'affaire"
              onClick={() => {
                setUserToAddType('collaborator');
                setIsModalOpen(true);
              }}
            />
          </Grid>
        </Section>
        <ManageAffairManagerForm isOpen={isAddManagerModalOpen} setIsOpen={setIsAddManagerModalOpen} affair={affair} />
        <ManageAffairUsersForm
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          affair={affair}
          userType={userToAddType}
        />
      </div>
    </div>
  );
};

export default Team;
