import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from '../../../../../styles/Affair.module.scss';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  GdpActivitiesModel,
  GdpFilesModel,
  GdpProjectsModel,
  GdpPythagoreFactureModel,
  GdpSatisfactionModel,
} from '../../../../../models/GdPModels';
import { GdpAffairModel } from '../../../../../models/GdPModels';
import { Breadcrumb, Button, QuickActionCard } from '@projex/ui';
import Grid from '../../../../../src/components/Grid/Grid';
import PageHeaderBanner from '../../../../../src/components/PageHeaderBanner/PageHeaderBanner';
import QuickAccessWidget from '../../../../../src/components/QuickAccessWidget/QuickAccessWidget';
import ClientTeamWidget from '../../../../../src/components/ClientTeamWidget/ClientTeamWidget';
import CollaboratorTeamWidget from '../../../../../src/components/CollaboratorTeamWidget/CollaboratorTeamWidget';
import BillingWidget from '../../../../../src/components/BillingWidget/BillingWidget';
import FilesWidget from '../../../../../src/components/FilesWidget/FilesWidget';
import { capitalize } from '../../../../../utils/capitalize';
import PhasesWidget from '../../../../../src/components/PhasesWidget/PhasesWidget';
import { getGdpAffair } from '../../../../../services/gestionDeProjets/GdpAffairs';
import { useRouter } from 'next/router';
import { isRequestSuccessful } from '../../../../../utils/isRequestSuccessful';
import ActivitiesWidget from '../../../../../src/components/ActivitiesWidget/ActivitiesWidget';
import { getGdpAffairsPhases } from '../../../../../services/gestionDeProjets/GdpPhases';
import { UsUserModel } from '../../../../../models/UserService/UsUserModel';
import { getGdpAffairsUsers } from '../../../../../services/gestionDeProjets/GdpAffairsUsers';
import { getUsUsers } from '../../../../../services/userService/UsUsers';
import { getGdpActivities } from '../../../../../services/gestionDeProjets/GdpActivities';
import { getGdpAffairsPythagoreAffairs } from '../../../../../services/gestionDeProjets/GdpAffairsPythagoreAffairs';
import { getGdpPythagoreFactures } from '../../../../../services/gestionDeProjets/GdpPythagoreFactures';
import { getGdpFiles } from '../../../../../services/gestionDeProjets/GdpFiles';
import SatisfactionWidget from '../../../../../src/components/SatisfactionWidget/SatisfactionWidget';
import { getGdpSatisfactions } from '../../../../../services/gestionDeProjets/GdpAffairsSatisfaction';
import { useSelector } from 'react-redux';
import { selectUserProfile } from '../../../../../store/reducers/authReducer';
import CreateAffairForm from '../../../../../src/components/CreateAffairForm/CreateAffairForm';
import { selectProjects } from '../../../../../store/reducers/projectsReducer';
import CreatePhaseForm from '../../../../../src/components/CreatePhaseForm/CreatePhaseForm';
import ConfigureFacturationForm from '../../../../../src/components/ConfigureFacturationForm/ConfigureFacturationForm';
import ManageAffairUsersForm from '../../../../../src/components/ManageAffairUsersForm/ManageAffairUsersForm';
import { getGdpProjectsUsersClients } from '../../../../../services/gestionDeProjets/GdpProjectsUsersClients';
import UploadFilesFormUploadFilesForm from '../../../../../src/components/filesForms/UploadFilesForm/UploadFilesForm';
import { selectAffairs } from '../../../../../store/reducers/affairsReducer';

const Affair = () => {
  const { query } = useRouter();
  const me = useSelector(selectUserProfile);
  const projects = useSelector(selectProjects);
  const affairs = useSelector(selectAffairs);

  const [affair, setAffair] = useState<Partial<GdpAffairModel>>({});
  const [affairPhases, setAffairPhases] = useState<Partial<GdpAffairModel>[]>([]);
  const [affairManagers, setAffairManagers] = useState<Partial<UsUserModel>[]>([]);
  const [affairClients, setAffairClients] = useState<Partial<UsUserModel>[]>([]);
  const [affairActivities, setAffairActivities] = useState<Partial<GdpActivitiesModel>[]>([]);
  const [affairInvoices, setAffairInvoices] = useState<Partial<GdpPythagoreFactureModel>[]>([]);
  const [files, setFiles] = useState<Partial<GdpFilesModel>[]>([]);
  const [affairSatisfactions, setAffairSatisfactions] = useState<Partial<GdpSatisfactionModel>[]>([]);
  const [affairProject, setAffairProject] = useState<Partial<GdpProjectsModel>>({});

  const [isUserAffairManager, setIsUserAffairManager] = useState<boolean>(false);
  const [isUserClassicCollaborator, setIsUserClassicCollaborator] = useState<boolean>(false);
  const [isUserClient, setIsUserClient] = useState<boolean>(false);

  const [isCreateAffairFormVisible, setIsCreateAffairFormVisible] = useState<boolean>(false);
  const [isCreatePhaseFormVisible, setIsCreatePhaseFormVisible] = useState<boolean>(false);
  const [isConfigureFacturationFormVisible, setIsConfigureFacturationFormVisible] = useState<boolean>(false);
  const [isManageAffairUsersFormVisible, setIsManageAffairUsersFormVisible] = useState<boolean>(false);
  const [isUploadFilesFormVisible, setIsUploadFilesFormVisible] = useState<boolean>(false);

  const [affairUsersFormType, setAffairUsersFormType] = useState<'collaborator' | 'client'>('client');

  const progressPercentage = useMemo(() => {
    const requiredProps = ['name', 'company_entity', 'projects_id'];
    let propsDefined = requiredProps.reduce(
      (count, prop) => count + (affair && affair[prop as keyof Partial<GdpAffairModel>] ? 1 : 0),
      0
    );

    if (affair.affairs_phases_ids && affair.affairs_phases_ids.length > 0) propsDefined++;
    // On divise par requiredProps.length + 1 car on ajoute 1 pour les phases
    return Math.round((propsDefined / (requiredProps.length + 1)) * 100);
  }, [affair]);

  const handleManageUsersFormType = useCallback((type: 'collaborator' | 'client') => {
    setAffairUsersFormType(type);
    setIsManageAffairUsersFormVisible(true);
  }, []);

  useEffect(() => {
    if (!query.affairId || typeof query.affairId !== 'string') return;

    const affairId = parseInt(query.affairId);

    const retrievedAffair = affairs.find((affair) => affair.id === affairId);

    if (retrievedAffair) {
      setAffair(retrievedAffair);
      return;
    }

    getGdpAffair(
      +query.affairId,
      [
        '*',
        'phases.*',
        'company_entity.*',
        'pythagore_ids.*',
        'affairs_directus_users_ids.*',
        'projects_id.name',
        'projects_id.id',
        'projects_id.company_entity',
        'projects_id.projects_directus_users_clients_ids.*',
        'projects_id.projects_directus_users_collaborators_ids.*',
        'affairs_phases.*',
        'activities_id.*',
      ].join(',')
    )
      .then((response) => {
        if (isRequestSuccessful(response.status) && response.data) {
          setAffair(response.data);
        } else setAffair({});
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.error(error));
  }, [affairs, query.affairId]);

  // Retrieve phases
  useEffect(() => {
    if (affair.affairs_phases_ids && affair.affairs_phases_ids.length > 0) {
      const phasesToRetrieve: number[] = [];
      const phases: Partial<GdpAffairModel>[] = [];
      affair.affairs_phases_ids.forEach((phase) => {
        if (typeof phase === 'number') phasesToRetrieve.push(phase);
        else phases.push(phase);
      });

      if (phasesToRetrieve.length > 0) {
        getGdpAffairsPhases({ filter: { id: { in: phasesToRetrieve } } }).then((response) => {
          if (response.status === 200 && response.data) {
            phases.push(...response.data);
          }
        });
      }
      setAffairPhases(phases);
    }
  }, [affair]);

  // Retrieve managers
  useEffect(() => {
    if (affair && affair.affairs_directus_users_ids && me && me.id) {
      const relationsToRetrieve: number[] = [];
      const managersToRetrieve: string[] = [];
      const managers: Partial<UsUserModel>[] = [];
      const collaborators: Partial<UsUserModel>[] = [];
      const collaboratorsToRetrieve: string[] = [];
      affair.affairs_directus_users_ids.forEach((relation) => {
        if (typeof relation === 'number') relationsToRetrieve.push(relation);
        else {
          if (relation.project_manager) {
            if (typeof relation.directus_users_id === 'string') managersToRetrieve.push(relation.directus_users_id);
            else managers.push(relation.directus_users_id);
          } else {
            if (typeof relation.directus_users_id === 'string')
              collaboratorsToRetrieve.push(relation.directus_users_id);
            else collaborators.push(relation.directus_users_id);
          }
        }
      });
      if (relationsToRetrieve.length > 0) {
        getGdpAffairsUsers({ filter: { id: { _in: relationsToRetrieve } } }).then((response) => {
          if (response.status === 200 && response.data) {
            response.data.forEach((relation) => {
              if (relation.directus_users_id) {
                if (typeof relation.directus_users_id === 'string') {
                  if (relation.project_manager) managersToRetrieve.push(relation.directus_users_id);
                  else collaboratorsToRetrieve.push(relation.directus_users_id);
                } else {
                  if (relation.project_manager) managers.push(relation.directus_users_id);
                  else collaborators.push(relation.directus_users_id);
                }
              }
            });
          }
          if (managersToRetrieve.length > 0) {
            getUsUsers({ filter: { id: { _in: [...managersToRetrieve, ...collaboratorsToRetrieve] } } }).then(
              (response) => {
                if (response.status === 200 && response.data) {
                  const managersFromRes = response.data.filter((user) =>
                    managersToRetrieve.includes(user.id as string)
                  );
                  const collaboratorsFromRes = response.data.filter((user) =>
                    collaboratorsToRetrieve.includes(user.id as string)
                  );
                  collaborators.push(...collaboratorsFromRes);
                  const iAmCollaborator = collaborators.find((collaborator) => collaborator.id === me.id);
                  setIsUserClassicCollaborator(!!iAmCollaborator);
                  setAffairManagers([...managers, ...managersFromRes]);
                }
              }
            );
          } else {
            setAffairManagers(managers);
            const iAmCollaborator = collaborators.find((collaborator) => collaborator.id === me.id);
            setIsUserClassicCollaborator(!!iAmCollaborator);
          }
        });
      } else {
        if (managersToRetrieve.length > 0) {
          getUsUsers({ filter: { id: { _in: [...managersToRetrieve, ...collaboratorsToRetrieve] } } }).then(
            (response) => {
              if (response.status === 200 && response.data) {
                const managersFromRes = response.data.filter((user) => managersToRetrieve.includes(user.id as string));
                const collaboratorsFromRes = response.data.filter((user) =>
                  collaboratorsToRetrieve.includes(user.id as string)
                );
                collaborators.push(...collaboratorsFromRes);
                const iAmCollaborator = collaborators.find((collaborator) => collaborator.id === me.id);
                setIsUserClassicCollaborator(!!iAmCollaborator);
                setAffairManagers([...managers, ...managersFromRes]);
              }
            }
          );
        } else {
          setAffairManagers(managers);
          const iAmCollaborator = collaborators.find((collaborator) => collaborator.id === me.id);
          setIsUserClassicCollaborator(!!iAmCollaborator);
        }
      }
    }
  }, [affair, me]);

  // Retrieve clients
  useEffect(() => {
    setIsUserClient(false);
    if (affair.id && me && me.id) {
      getGdpProjectsUsersClients({ filter: { projects_id: { _eq: affair.id } } }).then((response) => {
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
            getUsUsers({ filter: { id: { _in: clientsToRetrieve } } }).then((response) => {
              if (response.status === 200 && response.data) {
                setAffairClients([...clients, ...response.data]);
                const iAmClient = [...clients, ...response.data].find((client) => client.id === me.id);
                setIsUserClient(!!iAmClient);
              }
            });
          } else {
            setAffairClients(clients);
            const iAmClient = clients.find((client) => client.id === me.id);
            setIsUserClient(!!iAmClient);
          }
        }
      });
    }
  }, [affair, me]);

  // Retrieve activities
  useEffect(() => {
    getGdpActivities({
      filter: {
        _and: [
          { projects_id: { _eq: affair.id } },
          {
            collection: {
              _in: ['projects', 'projects_directus_users_clients', 'projects_directus_users_collaborators'],
            },
          },
        ],
      },
    }).then((res) => {
      if (res.status === 200 && res.data) {
        setAffairActivities(res.data);
      } else {
        setAffairActivities([]);
      }
    });
  }, [affair.id]);

  useEffect(() => {
    if (affair.pythagore_ids && affair.pythagore_ids.length > 0) {
      const affairPythagoreAffairIds: number[] = [];
      const pythagoreAffairIds: string[] = [];
      affair.pythagore_ids.forEach((affairPythagoreAffairRelation) => {
        if (typeof affairPythagoreAffairRelation === 'number')
          affairPythagoreAffairIds.push(affairPythagoreAffairRelation);
        else if (affairPythagoreAffairRelation.pythagore_affaires_id)
          if (typeof affairPythagoreAffairRelation.pythagore_affaires_id === 'string')
            pythagoreAffairIds.push(affairPythagoreAffairRelation.pythagore_affaires_id);
          else if (affairPythagoreAffairRelation.pythagore_affaires_id.numero_affaire) {
            pythagoreAffairIds.push(affairPythagoreAffairRelation.pythagore_affaires_id.numero_affaire);
          }
      });
      if (affairPythagoreAffairIds.length > 0 && pythagoreAffairIds.length < 3) {
        getGdpAffairsPythagoreAffairs({
          filter: {
            id: { _in: affairPythagoreAffairIds },
          },
          limit: 3,
        }).then((res) => {
          if (res.status === 200 && res.data) {
            res.data.forEach((affairPythagoreAffairRelation) => {
              if (affairPythagoreAffairRelation.pythagore_affaires_id)
                if (typeof affairPythagoreAffairRelation.pythagore_affaires_id === 'string')
                  pythagoreAffairIds.push(affairPythagoreAffairRelation.pythagore_affaires_id);
                else if (affairPythagoreAffairRelation.pythagore_affaires_id.numero_affaire) {
                  pythagoreAffairIds.push(affairPythagoreAffairRelation.pythagore_affaires_id.numero_affaire);
                }
            });
          }
          if (pythagoreAffairIds.length > 0) {
            getGdpPythagoreFactures({
              filter: {
                num_affaire: { _in: pythagoreAffairIds },
              },
              limit: 3,
            }).then((res) => {
              if (res.status === 200 && res.data) {
                setAffairInvoices(res.data);
              } else setAffairInvoices([]);
            });
          } else setAffairInvoices([]);
        });
      } else {
        if (pythagoreAffairIds.length > 0) {
          getGdpPythagoreFactures({
            filter: {
              num_affaire: { _in: pythagoreAffairIds },
            },
            limit: 3,
          }).then((res) => {
            if (res.status === 200 && res.data) {
              setAffairInvoices(res.data);
            } else setAffairInvoices([]);
          });
        }
      }
    } else {
      setAffairInvoices([]);
    }
  }, [affair.pythagore_ids]);

  useEffect(() => {
    getGdpFiles({
      filter: {
        projects_id: { _eq: affair.id },
      },
    }).then((res) => {
      if (res.status === 200 && res.data) {
        setFiles(res.data);
      } else setFiles([]);
    });
  }, [affair.id]);

  useEffect(() => {
    if (affair) {
      getGdpSatisfactions({
        filter: {
          affairs_id: { _eq: affair.id },
        },
      }).then((res) => {
        if (res.status === 200 && res.data) setAffairSatisfactions(res.data);
        else setAffairSatisfactions([]);
      });
    } else {
      setAffairSatisfactions([]);
    }
  }, [affair]);

  useEffect(() => {
    if (affair.projects_id) {
      if (typeof affair.projects_id === 'number') {
        const project = projects.find((project) => project.id === affair.projects_id);
        if (project) setAffairProject(project);
        else setAffairProject({});
      } else {
        setAffairProject(affair.projects_id);
      }
    } else {
      setAffairProject({});
    }
  }, [affair, projects]);

  useEffect(() => {
    if (me && affairManagers.filter((manager) => manager.id === me.id).length > 0) {
      setIsUserAffairManager(true);
    } else {
      setIsUserAffairManager(false);
    }
  }, [affairManagers, me]);

  return (
    <div className="page">
      <PageHeaderBanner data={affairProject ? affairProject : { name: 'Projet' }} />
      <div className={styles.affairPage}>
        <Breadcrumb
          dynamicRoutesLabel={[
            affair.projects_id ? (affair.projects_id as GdpProjectsModel).name : 'Projet',
            affair.name || 'Affaire',
          ]}
        />
        <div className={styles.titleContainer}>
          {/* start ---------------- EVERY FORM GOES HERE ---------------- start */}
          <CreateAffairForm
            project={affairProject}
            affair={affair}
            isOpen={isCreateAffairFormVisible}
            setIsOpen={setIsCreateAffairFormVisible}
          />
          <CreatePhaseForm
            project={affairProject}
            affair={affair}
            isOpen={isCreatePhaseFormVisible}
            setIsOpen={setIsCreatePhaseFormVisible}
          />
          <ConfigureFacturationForm
            isOpen={isConfigureFacturationFormVisible}
            setIsOpen={setIsConfigureFacturationFormVisible}
            initProject={affairProject}
            initAffair={affair}
          />
          <ManageAffairUsersForm
            isOpen={isManageAffairUsersFormVisible}
            setIsOpen={setIsManageAffairUsersFormVisible}
            affair={affair}
            userType={affairUsersFormType}
          />
          <UploadFilesFormUploadFilesForm
            isOpen={isUploadFilesFormVisible}
            mode={'files'}
            setIsOpen={setIsUploadFilesFormVisible}
            project={affairProject}
            affair={affair}
          />
          {/* end ---------------- EVERY FORM GOES HERE ---------------- end */}
          <h1 className={styles.title}>{affair.name ? capitalize(affair.name) : `Affaire ${affair.id}`}</h1>
          {isUserAffairManager && (
            <Button icon={<EditOutlined />} onClick={() => setIsCreateAffairFormVisible(true)}>
              Modifier l&apos;affaire
            </Button>
          )}
        </div>
        {isUserAffairManager && (
          <QuickAccessWidget>
            <Grid>
              <QuickActionCard
                title="Facturation"
                button={{
                  label: 'Configurer la facturation',
                  icon: <EditOutlined />,
                  onClick: () => setIsConfigureFacturationFormVisible(true),
                }}
              >
                Vous pouvez associer les numéros Pythagore aux affaires correspondantes
              </QuickActionCard>
              <QuickActionCard
                title="Étapes du projet"
                button={{
                  label: 'Ajouter une étape',
                  icon: <PlusOutlined />,
                  onClick: () => setIsCreatePhaseFormVisible(true),
                }}
              >
                Vous pouvez créer des étapes pour un suivi approfondi de l&apos;affaire
              </QuickActionCard>
              <QuickActionCard title="Complétez l'affaire" progress={progressPercentage}>
                Remplissez l&apos;affaire pour profiter pleinement de toutes les fonctionnalités
              </QuickActionCard>
            </Grid>
          </QuickAccessWidget>
        )}
        <PhasesWidget
          phases={affairPhases}
          onNewPhaseClick={() => setIsCreatePhaseFormVisible(true)}
          displayCreateCard={isUserAffairManager}
        />
        <section>
          <Grid type="narrow">
            <ClientTeamWidget
              users={affairClients}
              clientCompany={{ name: 'Client' }}
              onAddClientClick={() => handleManageUsersFormType('client')}
              displayConfigureButton={isUserAffairManager}
            />
            <CollaboratorTeamWidget
              type="affair"
              users={affairManagers}
              companyEntity={'company'}
              onAddCollaboratorClick={() => handleManageUsersFormType('collaborator')}
              displayConfigureButton={isUserAffairManager}
            />
          </Grid>
        </section>
        <section>
          <Grid type="narrow">
            <ActivitiesWidget activities={affairActivities} />
            <BillingWidget
              invoices={affairInvoices}
              onConfigureBillingClick={() => setIsConfigureFacturationFormVisible(true)}
              displayConfigureButton={isUserAffairManager}
            />
          </Grid>
        </section>
        <section>
          <Grid type="narrow">
            <FilesWidget
              files={files}
              onNewFileClick={() => setIsUploadFilesFormVisible(true)}
              displayConfigureButton={isUserAffairManager || isUserClassicCollaborator || isUserClient}
            />
            <SatisfactionWidget satisfactions={affairSatisfactions} />
          </Grid>
        </section>
      </div>
    </div>
  );
};

export default Affair;
