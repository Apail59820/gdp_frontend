import React, {useEffect, useMemo, useState} from 'react';
import styles from '../../../styles/Project.module.scss';
import {EditOutlined, PlusOutlined} from '@ant-design/icons';
import {Breadcrumb, Button, QuickActionCard} from 'projex-ui';
import Grid from '../../../src/components/Grid/Grid';
import PageHeaderBanner from '../../../src/components/PageHeaderBanner/PageHeaderBanner';
import QuickAccessWidget from '../../../src/components/QuickAccessWidget/QuickAccessWidget';
import {GdpActivitiesModel} from '../../../models/GestionDeProjets/GdpActivitiesModel';
import ClientTeamWidget from '../../../src/components/ClientTeamWidget/ClientTeamWidget';
import CollaboratorTeamWidget from '../../../src/components/CollaboratorTeamWidget/CollaboratorTeamWidget';
import ActivitiesWidget from '../../../src/components/ActivitiesWidget/ActivitiesWidget';
import BillingWidget from '../../../src/components/BillingWidget/BillingWidget';
import FilesWidget from '../../../src/components/FilesWidget/FilesWidget';
import {useDispatch, useSelector} from 'react-redux';
import {selectProjects, setProjects} from '../../../store/reducers/projectsReducer';
import {useRouter} from 'next/router';
import {getGdpProjectById} from '../../../services/gestionDeProjets/GdpProjects';
import {GdpAffairModel} from '../../../models/GestionDeProjets/GdpAffairModel';
import {selectAffairs, setAffairs} from '../../../store/reducers/affairsReducer';
import {getGdpAffairs} from '../../../services/gestionDeProjets/GdpAffairs';
import CreateAffairForm from '../../../src/components/CreateAffairForm/CreateAffairForm';
import {GdpProjectsClientsModel} from '../../../models/GestionDeProjets/GdpProjectsClientsModel';
import {getGdpProjectsUsersClients} from '../../../services/gestionDeProjets/GdpProjectsUsersClients';
import {getUsUsers} from '../../../services/userService/UsUsers';
import {UsUserModel} from '../../../models/UserService/UsUserModel';
import {GdpProjectsCollaboratorsModel} from '../../../models/GestionDeProjets/GdpProjectsCollaboratorsModel';
import {getGdpProjectsUsersCollaborators} from '../../../services/gestionDeProjets/GdpProjectsUsersCollaborators';
import {getGdpFiles} from '../../../services/gestionDeProjets/GdpFiles';
import {GdpFilesModel} from '../../../models/GestionDeProjets/GdpFilesModel';
import {getGdpActivities} from '../../../services/gestionDeProjets/GdpActivities';
import {GdpProjectsModel} from '../../../models/GestionDeProjets/GdpProjectsModel';
import {getUsCompanyEntity} from '../../../services/userService/UsCompanyEntities';
import {GdpPythagoreFactureModel} from '../../../models/GestionDeProjets/GdpPythagoreFactureModel';
import AffairsWidget from '../../../src/components/AffairsWidget/AffairsWidget';
import {getGdpPythagoreFactures} from '../../../services/gestionDeProjets/GdpPythagoreFactures';
import {getGdpAffairsPythagoreAffairs} from '../../../services/gestionDeProjets/GdpAffairsPythagoreAffairs';
import CreateProjectForm from '../../../src/components/CreateProjectForm/CreateProjectForm';
import SatisfactionWidget from '../../../src/components/SatisfactionWidget/SatisfactionWidget';
import {GdpSatisfactionModel} from '../../../models/GestionDeProjets/GdpSatisfactionModel';
import {getGdpSatisfactions} from '../../../services/gestionDeProjets/GdpAffairsSatisfaction';
import {
  selectClientsCompanyEntities,
  setClientsCompanyEntities,
} from '../../../store/reducers/clientsCompanyEntitiesReducer';
import {UsClientsCompanyEntitiesModel} from '../../../models/UserService/UsClientsCompanyEntitiesModel';
import {getUsClientCompanyEntity} from '../../../services/userService/UsClientsCompanyEntities';
import ConfigureFacturationForm from '../../../src/components/ConfigureFacturationForm/ConfigureFacturationForm';
import UploadFilesFormUploadFilesForm from '../../../src/components/filesForms/UploadFilesForm/UploadFilesForm';
import {selectUserProfile} from '../../../store/reducers/authReducer';
import ManageProjectManagers from '../../../src/components/ManageProjectManagers/ManageProjectManagers';

const Project = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const projectId = parseInt(router.query.projectId as string);

  const me = useSelector(selectUserProfile);
  const projects = useSelector(selectProjects);
  const affairs = useSelector(selectAffairs);
  const clientCompanies = useSelector(selectClientsCompanyEntities);

  const [isUserProjectManager, setIsUserProjectManager] = useState<boolean>(false);
  const [isUserClassicCollaborator, setIsUserClassicCollaborator] = useState<boolean>(false);
  const [isUserClient, setIsUserClient] = useState<boolean>(false);

  const [isCreateAffairFormOpen, setIsCreateAffairFormOpen] = React.useState<boolean>(false);
  const [isCreateProjectFormOpen, setIsCreateProjectFormOpen] = React.useState<boolean>(false);
  const [isConfigureFacturationFormOpen, setIsConfigureFacturationFormOpen] = React.useState<boolean>(false);
  const [isUploadFileFormOpen, setIsUploadFileFormOpen] = React.useState<boolean>(false);
  const [isManageProjectManagersFormOpen, setIsManageProjectManagersFormOpen] = React.useState<boolean>(false);

  const [project, setProject] = useState<Partial<GdpProjectsModel>>({});
  const progressPercentage = useMemo(() => {
    const requiredProps = ['name', 'client_company_name', 'client_info', 'address', 'zip_code', 'city', 'country'];
    const propsDefined = requiredProps.reduce(
      (count, prop) => count + (project && project[prop as keyof Partial<GdpProjectsModel>] ? 1 : 0),
      0
    );
    return Math.round((propsDefined / requiredProps.length) * 100);
  }, [project]);

  const [projectCompanyEntityName, setProjectCompanyEntityName] = useState<string>('Inconnue');

  const [projectAffairs, setProjectAffairs] = useState<Partial<GdpAffairModel>[]>([]);

  const [projectClients, setProjectClients] = useState<Partial<UsUserModel>[]>([]);

  const [projectManagers, setProjectManagers] = useState<Partial<UsUserModel>[]>([]);

  const [files, setFiles] = useState<Partial<GdpFilesModel>[]>([]);

  const [projectActivities, setProjectActivities] = useState<Partial<GdpActivitiesModel>[]>([]);

  const [projectInvoices, setProjectInvoices] = useState<Partial<GdpPythagoreFactureModel>[]>([]);

  const [projectSatisfactions, setProjectSatisfactions] = useState<Partial<GdpSatisfactionModel>[]>([]);

  const [projectClientCompany, setProjectClientCompany] = useState<Partial<UsClientsCompanyEntitiesModel>>({});

  useEffect(() => {
    if (projectId) {
      if (projects.filter((project) => project.id === projectId).length > 0) {
        return setProject(projects.filter((project) => project.id === projectId)[0]);
      } else {
        getGdpProjectById(projectId).then((res) => {
          if (res.status === 200 && res.data) {
            setProject(res.data);
            dispatch(setProjects([...projects, res.data]));
          }
        });
      }
      if (project.company_entity) {
        if (typeof project.company_entity === 'number') {
          getUsCompanyEntity(project.company_entity).then((res) => {
            if (res.status === 200 && res.data && res.data.name) setProjectCompanyEntityName(res.data.name);
            else setProjectCompanyEntityName('Inconnue');
          });
        } else {
          project.company_entity.name
            ? setProjectCompanyEntityName(project.company_entity.name)
            : setProjectCompanyEntityName('Inconnue');
        }
      } else setProjectCompanyEntityName('Inconnue');
    } else setProject({});
  }, [dispatch, project.company_entity, projectId, projects]);

  useEffect(() => {
    const affairsIds = project?.affairs_ids;
    const affairsToFetch: number[] = [];
    const tmpAffairs: Partial<GdpAffairModel>[] = [];

    if (affairsIds) {
      affairsIds.forEach((affairId) => {
        if (typeof affairId === 'number') {
          if (affairs.filter((affair) => affair.id === affairId).length > 0) {
            tmpAffairs.push(affairs.filter((affair) => affair.id === affairId)[0]);
          } else affairsToFetch.push(affairId);
        } else tmpAffairs.push(affairId);
      });
    }

    if (affairsToFetch.length > 0) {
      getGdpAffairs({
        filter: {
          id: {_in: affairsToFetch},
        },
        limit: 3,
      }).then((res) => {
        if (res.status === 200 && res.data) {
          tmpAffairs.push(...res.data);
          dispatch(setAffairs([...affairs, ...res.data]));
        }
      });
    }

    setProjectAffairs(tmpAffairs);
  }, [affairs, dispatch, project]);

  useEffect(() => {
    const relationIds = project?.projects_directus_users_clients_ids;
    const relationToFetch: number[] = [];
    const tmpRelations: Partial<GdpProjectsClientsModel>[] = [];

    if (relationIds) {
      relationIds.forEach((relationId) => {
        if (typeof relationId === 'number') relationToFetch.push(relationId);
        else tmpRelations.push(relationId);
      });
    }

    if (relationToFetch.length > 0) {
      getGdpProjectsUsersClients({
        filter: {
          id: {_in: relationToFetch},
        },
        fields: ['id', 'directus_users_id'].join(''),
      }).then((res) => {
        if (res.status === 200 && res.data) {
          tmpRelations.push(...res.data);
        }
      });
    }

    const clientIds: string[] = [];

    tmpRelations.forEach((relation) => {
      if (typeof relation.directus_users_id === 'string') clientIds.push(relation.directus_users_id);
      if (me && relation.directus_users_id === me.id) setIsUserClient(true);
    });

    if (clientIds.length > 0) {
      getUsUsers({
        filter: {
          id: {_in: clientIds},
        },
      }).then((res) => {
        if (res.status === 200 && res.data) {
          setProjectClients(res.data);
        } else setProjectClients([]);
      });
    } else setProjectClients([]);
  }, [me, project]);

  // Get project managers
  useEffect(() => {
    const relationIds = project?.projects_directus_users_collaborators_ids;
    const relationToFetch: number[] = [];
    const tmpRelations: Partial<GdpProjectsCollaboratorsModel>[] = [];

    if (relationIds) {
      relationIds.forEach((relationId) => {
        if (typeof relationId === 'number') relationToFetch.push(relationId);
        else tmpRelations.push(relationId);
      });
    }

    if (relationToFetch.length > 0) {
      getGdpProjectsUsersCollaborators({
        filter: {
          id: {_in: relationToFetch},
        },
        fields: 'id,directus_users_id',
      }).then((res) => {
        if (res.status === 200 && res.data) {
          tmpRelations.push(...res.data);
        }
      });
    }

    const tmpRelationPM: Partial<GdpProjectsCollaboratorsModel>[] = [];
    const tmpRelationClassic: Partial<GdpProjectsCollaboratorsModel>[] = [];

    tmpRelations.forEach((relation) => {
      if (relation.project_manager) tmpRelationPM.push(relation);
      else tmpRelationClassic.push(relation);
    });

    if (me && tmpRelationPM.filter((relation) => relation.directus_users_id === me.id).length > 0) {
      setIsUserProjectManager(true);
    } else {
      setIsUserProjectManager(false);
      if (me && tmpRelationClassic.filter((relation) => relation.directus_users_id === me.id).length > 0)
        setIsUserClassicCollaborator(true);
      else setIsUserClassicCollaborator(false);
    }

    const collaboratorIds: string[] = [];

    tmpRelationPM.forEach((relation) => {
      if (typeof relation.directus_users_id === 'string') collaboratorIds.push(relation.directus_users_id);
    });

    if (collaboratorIds.length > 0) {
      getUsUsers({
        filter: {
          id: {_in: collaboratorIds},
        },
      }).then((res) => {
        if (res.status === 200 && res.data) {
          setProjectManagers(res.data);
        } else setProjectManagers([]);
      });
    } else setProjectManagers([]);
  }, [me, project]);

  useEffect(() => {
    getGdpFiles({
      filter: {
        projects_id: {_eq: projectId},
      },
    }).then((res) => {
      if (res.status === 200 && res.data) {
        setFiles(res.data);
      } else setFiles([]);
    });
  }, [projectId]);

  useEffect(() => {
    getGdpActivities({
      filter: {
        _and: [
          {projects_id: {_eq: projectId}},
          {
            collection: {
              _in: ['projects', 'projects_directus_users_clients', 'projects_directus_users_collaborators'],
            },
          },
        ],
      },
      sort: '-date_created',
    }).then((res) => {
      if (res.status === 200 && res.data) {
        setProjectActivities(res.data);
      } else {
        setProjectActivities([]);
      }
    });
  }, [projectId]);

  useEffect(() => {
    const affairPythagoreAffairIds: number[] = [];
    const pythagoreAffairIds: string[] = [];
    projectAffairs.forEach((affair) => {
      if (affair.pythagore_ids && affair.pythagore_ids.length > 0) {
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
      }
    });
    if (affairPythagoreAffairIds.length > 0 && pythagoreAffairIds.length < 3) {
      getGdpAffairsPythagoreAffairs({
        filter: {
          id: {_in: affairPythagoreAffairIds},
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
      });
    }
    if (pythagoreAffairIds.length > 0) {
      getGdpPythagoreFactures({
        filter: {
          num_affaire: {_in: pythagoreAffairIds},
        },
        limit: 3,
      }).then((res) => {
        if (res.status === 200 && res.data) {
          setProjectInvoices(res.data);
        } else setProjectInvoices([]);
      });
    } else setProjectInvoices([]);
  }, [projectAffairs]);

  useEffect(() => {
    if (project && project.affairs_ids && project.affairs_ids.length > 0) {
      getGdpSatisfactions({
        filter: {
          affairs_id: {_in: project.affairs_ids},
        },
      }).then((res) => {
        if (res.status === 200 && res.data) setProjectSatisfactions(res.data);
        else setProjectSatisfactions([]);
      });
    } else {
      setProjectSatisfactions([]);
    }
  }, [project]);

  useEffect(() => {
    if (project.clients_company_entity) {
      if (typeof project.clients_company_entity === 'number') {
        const clientCompany = clientCompanies.find(
          (clientCompany) => clientCompany.id === project.clients_company_entity
        );
        if (clientCompany) setProjectClientCompany(clientCompany);
        else {
          getUsClientCompanyEntity(project.clients_company_entity).then((res) => {
            if (res.status === 200 && res.data) {
              setProjectClientCompany(res.data);
              dispatch(setClientsCompanyEntities([...clientCompanies, res.data]));
            } else setProjectClientCompany({});
          });
        }
      } else {
        setProjectClientCompany(project.clients_company_entity);
      }
    }
  }, [clientCompanies, dispatch, project.clients_company_entity]);

  return (
    project && (
      <div className="page">
        <PageHeaderBanner data={project}/>
        <div className={styles.projectPage}>
          <Breadcrumb dynamicRoutesLabel={[project.name!]}/>
          <div className={styles.titleContainer}>
            {/* start ---------------- EVERY FORM GOES HERE ---------------- start */}
            <CreateAffairForm project={project} isOpen={isCreateAffairFormOpen} setIsOpen={setIsCreateAffairFormOpen}/>
            <CreateProjectForm
              isOpen={isCreateProjectFormOpen}
              setIsOpen={setIsCreateProjectFormOpen}
              project={project}
            />
            <ManageProjectManagers
              open={isManageProjectManagersFormOpen}
              onClose={() => setIsManageProjectManagersFormOpen(false)}
              project={project}
            />
            <ConfigureFacturationForm
              isOpen={isConfigureFacturationFormOpen}
              setIsOpen={setIsConfigureFacturationFormOpen}
              initProject={project}
            />
            <UploadFilesFormUploadFilesForm
              isOpen={isUploadFileFormOpen}
              mode={'files'}
              setIsOpen={setIsUploadFileFormOpen}
              project={project}
            />
            {/* end ---------------- EVERY FORM GOES HERE ---------------- end */}
            <h1 className={styles.title}>Le projet</h1>
            {isUserProjectManager && (
              <Button icon={<EditOutlined rev={undefined}/>} onClick={() => setIsCreateProjectFormOpen(true)}>
                Modifier le projet
              </Button>
            )}
          </div>
          {isUserProjectManager && (
            <QuickAccessWidget>
              <Grid>
                <QuickActionCard
                  title="Créez une nouvelle affaire"
                  button={{
                    label: 'Ajouter une affaire',
                    icon: <PlusOutlined rev={undefined}/>,
                    onClick: () => setIsCreateAffairFormOpen(true),
                  }}
                >
                  Vous pouvez désormais ajouter une affaire au projet afin d&apos;en suivre l&apos;évolution et la
                  facturation
                </QuickActionCard>
                <QuickActionCard
                  title="Facturation"
                  button={{
                    label: 'Configurer la facturation',
                    icon: <EditOutlined rev={undefined}/>,
                    onClick: () => setIsConfigureFacturationFormOpen(true),
                  }}
                >
                  Vous pouvez associer les numéros Pythagore aux affaires correspondantes
                </QuickActionCard>
                <QuickActionCard title="Complétez le projet" progress={progressPercentage}>
                  Remplissez les informations du projet pour le compléter
                </QuickActionCard>
              </Grid>
            </QuickAccessWidget>
          )}
          <AffairsWidget
            affairs={projectAffairs}
            onNewAffairClick={() => setIsCreateAffairFormOpen(true)}
            displayCreateCard={isUserProjectManager}
          />
          <section>
            <Grid type="narrow">
              <ClientTeamWidget
                users={projectClients}
                clientCompany={projectClientCompany}
                onAddClientClick={() => console.log('clicked')}
                displayConfigureButton={false}
              />
              <CollaboratorTeamWidget
                users={projectManagers}
                companyEntity={projectCompanyEntityName}
                onAddCollaboratorClick={() => setIsManageProjectManagersFormOpen(true)}
                displayConfigureButton={isUserProjectManager}
              />
            </Grid>
          </section>
          <section>
            <Grid type="narrow">
              <ActivitiesWidget activities={projectActivities}/>
              <BillingWidget
                invoices={projectInvoices}
                onConfigureBillingClick={() => setIsConfigureFacturationFormOpen(true)}
                displayConfigureButton={isUserProjectManager}
              />
            </Grid>
          </section>
          <section>
            <Grid type="narrow">
              <FilesWidget
                files={files}
                onNewFileClick={() => setIsUploadFileFormOpen(true)}
                displayConfigureButton={isUserProjectManager || isUserClassicCollaborator || isUserClient}
              />
              <SatisfactionWidget satisfactions={projectSatisfactions}/>
            </Grid>
          </section>
        </div>
      </div>
    )
  );
};

export default Project;
