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
import { GdpAffairModel, GdpPhaseModel, GdpProjectsModel } from '../../../../../models/GdPModels';
import { getGdpProjectById } from '../../../../../services/gestionDeProjets/GdpProjects';
import { getUsCompanyEntity } from '../../../../../services/userService/UsCompanyEntities';
import { getGdpAffair } from '../../../../../services/gestionDeProjets/GdpAffairs';
import { selectAffairs } from '../../../../../store/reducers/affairsReducer';
import { getGdpAffairsPhases } from '../../../../../services/gestionDeProjets/GdpPhases';

const PROJECT_BY_ID = {
  id: '1',
  name: 'Nom du projet',
  client_company_name: 'Nom du client',
  client_info: undefined,
  address: undefined,
  zip_code: undefined,
  city: undefined,
  country: undefined,
  image: 'ok',
  status: undefined,
  project_type: undefined,
  company_entity: CompanyEnum.DIAGOBAT,
  affairs: undefined,
};

const PHASES = [
  {
    id: 1,
    name: 'Name 1',
    order: 1,
    status: 'completed',
    trigger_survey: true,
    description: 'description',
  },
  {
    id: 2,
    name: 'Name 2',
    order: 2,
    status: 'pending',
    trigger_survey: true,
    description: 'description',
  },
  {
    id: 3,
    name: 'Name 3',
    order: 3,
    status: 'ongoing',
    trigger_survey: true,
    description: 'description',
  },
];

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
  const globalFilters = useSelector(selectGlobalFilters);
  const projects = useSelector(selectProjects);
  const affairs = useSelector(selectAffairs);
  const globalProjectsCount = useSelector(selectProjectsCount);

  const router = useRouter();
  const dispatch = useDispatch();
  const projectId = parseInt(router.query.projectId as string);
  const affairId = parseInt(router.query.affairId as string);

  const [project, setProject] = useState<Partial<GdpProjectsModel>>({});
  const [affair, setAffair] = useState<Partial<GdpAffairModel>>({});
  const [phases, setPhases] = useState<Partial<GdpPhaseModel>[]>([]);

  const [projectCompanyEntityName, setProjectCompanyEntityName] = useState<string>('Inconnue');

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
    } else setProject({ id: -1, name: '' });
  }, [dispatch, project.company_entity, projectId, projects]);

  useEffect(() => {
    console.log(affairId);
    if (affairId) {
      getGdpAffair(affairId).then((res) => {
        if (res.status === 200 && res.data) {
          setAffair(res.data);
        }
      });
    }
  }, [project, affairs, affairId]);

  useEffect(() => {
    if (affairId) {
      getGdpAffairsPhases({
        filter: {
          affairs_id: { _in: affairId },
        },
        fields: '*',
      }).then((res) => {
        console.log('res phases:::', res);
        if (res.status === 200 && res.data) {
          setPhases(res.data);
        }
      });
    }
  }, [affairId]);

  return (
    <div className="page">
      <PageHeaderBanner data={project} />
      <div className={styles.advancementPage}>
        <Breadcrumb dynamicRoutesLabel={[project.name!, affair.name!]} />
        <div className={styles.head}>
          <h1>Nom de l&apos;affaire - Avancement</h1>
          <Button small icon={<PlusOutlined />}>
            Ajouter une étape
          </Button>
        </div>
        <div className={styles.body}>
          <div className={styles.phases}>
            {phases.map((phase) => (
              <section className={styles.phaseContainer} key={phase.id}>
                <Phase phase={phase} />
              </section>
            ))}
          </div>
          <div className={styles.activitiesWidgetContainer}>
            <ActivitiesWidget activities={ACTIVITIES || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advancement;
