import { PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Button } from '@projex/ui';
import React, { useEffect, useState } from 'react';
import { CompanyEnum } from '../../../../../models/UsModels';
import ActivitiesWidget from '../../../../../src/components/ActivitiesWidget/ActivitiesWidget';
import PageHeaderBanner from '../../../../../src/components/PageHeaderBanner/PageHeaderBanner';
import Phase from '../../../../../src/components/Phase/Phase';
import styles from '../../../../../styles/Advancement.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { selectGlobalFilters } from '../../../../../store/reducers/globalFilterReducer';
import { selectProjects, selectProjectsCount, setProjects } from '../../../../../store/reducers/projectsReducer';
import { globalAgent } from 'http';
import { useRouter } from 'next/router';
import { GdpActivitiesModel, GdpAffairModel, GdpPhaseModel, GdpProjectsModel } from '../../../../../models/GdPModels';
import { getGdpProjectById } from '../../../../../services/gestionDeProjets/GdpProjects';
import { getUsCompanyEntity } from '../../../../../services/userService/UsCompanyEntities';
import { getGdpAffair } from '../../../../../services/gestionDeProjets/GdpAffairs';
import { selectAffairs } from '../../../../../store/reducers/affairsReducer';
import { getGdpAffairsPhases } from '../../../../../services/gestionDeProjets/GdpPhases';
import { getGdpFiles } from '../../../../../services/gestionDeProjets/GdpFiles';
import { isRequestSuccessful } from '../../../../../utils/isRequestSuccessful';
import { getGdpActivities } from '../../../../../services/gestionDeProjets/GdpActivities';
import CreatePhaseForm from '../../../../../src/components/CreatePhaseForm/CreatePhaseForm';

const ACTIVITIES = [
  {
    creationDate: '10/12/2022',
    label: 'Ajout du fichier preview-facade.png',
    author: 'Olivier Le Baron',
  },
  {
    creationDate: '10/12/2022',
    label: 'Ajout du fichier preview-facade.png',
    author: 'Olivier Le Baron',
  },
  {
    creationDate: '10/12/2022',
    label: 'Ajout du fichier preview-facade.png',
    author: 'Olivier Le Baron',
  },
];

const Advancement = () => {
  const projects = useSelector(selectProjects);
  const affairs = useSelector(selectAffairs);

  const router = useRouter();
  const dispatch = useDispatch();
  const projectId = parseInt(router.query.projectId as string);
  const affairId = parseInt(router.query.affairId as string);

  const [project, setProject] = useState<Partial<GdpProjectsModel>>({});
  const [affair, setAffair] = useState<Partial<GdpAffairModel>>({});
  const [finalAffair, setFinalAffair] = useState<Partial<GdpAffairModel>>({});
  const [phases, setPhases] = useState<Partial<GdpPhaseModel>[]>([]);
  const [phaseToModify, setPhaseToModify] = useState<Partial<GdpPhaseModel>>();
  const [activities, setActivities] = useState<Partial<GdpActivitiesModel>[]>([]);
  const [dataFetched, setDataFetched] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [projectCompanyEntityName, setProjectCompanyEntityName] = useState<string>('Inconnue');

  useEffect(() => {
    if (projectId) {
      const existingProject = projects.find((project) => project.id === projectId);
      if (existingProject) {
        setProject(existingProject);
      } else {
        getGdpProjectById(projectId).then((res) => {
          if (isRequestSuccessful(res.status) && res.data) {
            const newProject = res.data;
            setProject(newProject);
            dispatch(setProjects([...projects, newProject]));
          }
        });
      }

      if (project.company_entity) {
        if (typeof project.company_entity === 'number') {
          getUsCompanyEntity(project.company_entity).then((res) => {
            if (isRequestSuccessful(res.status) && res.data && res.data.name) {
              setProjectCompanyEntityName(res.data.name);
            } else {
              setProjectCompanyEntityName('Inconnue');
            }
          });
        } else {
          const companyEntityName = project.company_entity.name || 'Inconnue';
          setProjectCompanyEntityName(companyEntityName);
        }
      } else {
        setProjectCompanyEntityName('Inconnue');
      }
    } else {
      setProject({ id: -1, name: '' });
    }
  }, [dispatch, project.company_entity, projectId, projects]);

  // useEffect(() => {
  //   if (affairId) {
  //     getGdpAffair(affairId).then((res) => {
  //       if (isRequestSuccessful(res.status) && res.data) {
  //         const updatedAffair = { ...res.data };
  //         setAffair(updatedAffair);
  //       }
  //     });
  //   }
  // }, [affairId]);

  useEffect(() => {
    if (phases.length > 0 && affairId && !dataFetched) {
      console.log('affair before final::', affair);
      getGdpAffair(affairId).then((res) => {
        if (isRequestSuccessful(res.status) && res.data) {
          const updatedAffair = { ...res.data, affairs_phases: phases };
          console.log('updated affair:::', updatedAffair);
          setFinalAffair(updatedAffair);
          setDataFetched(true);
        }
      });
    }
  }, [phases, affair, affairId, dataFetched]);

  useEffect(() => {
    if (affairId) {
      getGdpAffairsPhases({
        filter: {
          affairs_id: { _in: affairId },
        },
        fields: 'id, name, order, status, trigger_survey, activities_id, affairs_id, affairs_satisfaction, description',
      }).then((res) => {
        if (isRequestSuccessful(res.status) && res.data) {
          setPhases(res.data);
        }
      });
    }
  }, [affairId]);

  useEffect(() => {
    if (projectId && affairId && phases.length > 0) {
      getGdpActivities({
        filter: {
          affairs_id: { _eq: affairId },
        },
        fields:
          'id,action,affairs_directus_users_id,affairs_id,affairs_phases_id,affairs_pythagore_affaires_id,affairs_satisfaction_id,collection,content,date_created,directus_files_id,projects_id,users_notifications_id',
      }).then((res) => {
        if (isRequestSuccessful(res.status) && res.data) {
          setActivities(res.data);
        }
      });
    }
  }, [projectId, affairId, phases]);

  if (finalAffair.affairs_phases) {
    console.log('affair final:::::', finalAffair);
  } else {
    console.log('defini affair_phases', finalAffair.affairs_phases);
  }

  return (
    <>
      <CreatePhaseForm project={project} affair={finalAffair} isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="page">
        <PageHeaderBanner data={project} />
        <div className={styles.advancementPage}>
          <Breadcrumb dynamicRoutesLabel={[project.name!, affair.name!]} />
          <div className={styles.head}>
            <h1>Nom de l&apos;affaire - Avancement</h1>
            <Button
              small
              icon={<PlusOutlined />}
              onClick={() => {
                setIsOpen(true);
              }}
            >
              Ajouter une étape
            </Button>
          </div>
          <div className={styles.body}>
            <div className={styles.phases}>
              {phases.map((phase) => (
                <section className={styles.phaseContainer} key={phase.id}>
                  <Phase phase={phase} affair={finalAffair} project={project} />
                </section>
              ))}
            </div>
            <div className={styles.activitiesWidgetContainer}>
              <ActivitiesWidget activities={activities} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Advancement;
