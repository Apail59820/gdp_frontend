import React, { useEffect, useState, useRef } from 'react';
import styles from './Projects.module.scss';
import { Button, Input, Select } from 'projex-ui';
import { GdpProjectsModel, GdpProjectStatusEnum } from '../../models/GestionDeProjets/GdpProjectsModel';
import DisplayOptionsController from '../components/DisplayOptionsController/DisplayOptionsController';
import ProjectCard from '../components/ProjectCard/ProjectCard';
import ProjectsList from '../ProjectsList/ProjectsList';
import Grid from '../components/Grid/Grid';
import Link from 'next/link';
import { QueryParameters } from '../../models/DirectusModel';
import { DeleteOutlined } from '@ant-design/icons';
import { CompanyEnum } from '../../models/UserService/UsCompanyEntityModel';
import { useSelector } from 'react-redux';
import { selectCompanyEntities } from '../../store/reducers/companyEntitiesReducer';
import GlobalFilters from '../components/GlobalFiltersComponents/GlobalFilters';
import { selectGlobalFilters } from '../../store/reducers/globalFilterReducer';
import { LazyLoadingStateType } from '../../models/LazyLoadingStateType';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

type ProjectsFiltersType = {
  name: string;
  status: GdpProjectStatusEnum | '';
  company_entity: CompanyEnum | '';
};

type Props = {
  projects: Partial<GdpProjectsModel>[];
  setSpecificFilters: (newFilters: QueryParameters) => void;
  projectsCount: number | null;
  lazyLoadingState: LazyLoadingStateType;
  setLazyLoadingState: (newState: LazyLoadingStateType) => void;
};

const projectsFiltersInitialState: ProjectsFiltersType = {
  name: '',
  status: GdpProjectStatusEnum.ACTIVE,
  company_entity: '',
};

//prevent search input to trigger multiple requests by cancelling requests while user is typing
let timerSearch: NodeJS.Timeout;

let isNewDataLoading = false;

const ProjectsPage = ({
  projects,
  setSpecificFilters,
  projectsCount,
  lazyLoadingState,
  setLazyLoadingState,
}: Props) => {
  const pageRef = useRef<HTMLDivElement>(null);

  const globalFilters = useSelector(selectGlobalFilters);
  const companyEntities = useSelector(selectCompanyEntities);

  const [displayOption, setDisplayOption] = useState<string>('grid');
  const [projectsFilters, setProjectsFilters] = useState<ProjectsFiltersType>(projectsFiltersInitialState);

  function updateSpecificFilters() {
    const filterRules: any[] = [];
    if (projectsFilters.name.length > 0) filterRules.push({ name: { _contains: projectsFilters.name } });
    if (projectsFilters.status !== '') filterRules.push({ status: projectsFilters.status });
    if (projectsFilters.company_entity !== '') filterRules.push({ company_entity: projectsFilters.company_entity });
    setSpecificFilters(filterRules.length > 0 ? { filter: { _and: filterRules } } : {});
    setLazyLoadingState({ limit: publicRuntimeConfig.PROJECTS_CHUNK_SIZE, offset: 0, action: 'REPLACE' });
  }

  useEffect(() => {
    setProjectsFilters(projectsFiltersInitialState);
    updateSpecificFilters();
  }, [globalFilters]);

  //Timeout to avoid too many requests
  useEffect(() => {
    clearTimeout(timerSearch);
    timerSearch = setTimeout(() => {
      updateSpecificFilters();
    }, 500);
  }, [projectsFilters]);

  const displayAsList = (): React.ReactNode => <ProjectsList projects={projects} />;

  const displayAsGrid = (): React.ReactNode => (
    <Grid>
      {projects.map((project) => (
        <Link key={project.id} href={`/projects/${project.id}`}>
          <ProjectCard project={project} projectManagerName={'Manager'} />
        </Link>
      ))}
    </Grid>
  );

  function onScrollEvent(event: Event) {
    if (pageRef && pageRef.current) {
      const page = pageRef.current;
      if (page.scrollTop + page.clientHeight >= page.scrollHeight - 400) {
        if (projectsCount && projects.length < projectsCount && !isNewDataLoading) {
          //lazy Loading Specific
          isNewDataLoading = true;
          setLazyLoadingState({
            limit: lazyLoadingState.limit,
            offset: projects.length,
            action: 'APPEND',
          });
          setTimeout(() => {
            isNewDataLoading = false;
          }, 1000);
        }
      }
    }
  }

  //lazy loading
  useEffect(() => {
    if (pageRef && pageRef.current) pageRef.current.addEventListener('scroll', onScrollEvent);
    return () => {
      if (pageRef && pageRef.current) pageRef.current.removeEventListener('scroll', onScrollEvent);
    };
  }, [projectsCount, projects, lazyLoadingState]);

  return (
    <div className="page" ref={pageRef}>
      <GlobalFilters />
      <div className={styles.projectsPage}>
        <h1 className={styles.title}>Tous les projets</h1>
        <div className={styles.headAndFilters}>
          <div className={styles.InputContainer}>
            <Input
              label={'Filtrer par nom'}
              value={projectsFilters.name}
              setValue={(value) => setProjectsFilters({ ...projectsFilters, name: `${value}` })}
              large={false}
            />
          </div>
          <div className={styles.InputContainer}>
            <Select
              label={'Filtrer par statut'}
              nullOptionText={'Tous les statuts'}
              options={[
                { value: GdpProjectStatusEnum.ACTIVE, text: GdpProjectStatusEnum.ACTIVE },
                { value: GdpProjectStatusEnum.ARCHIVED, text: GdpProjectStatusEnum.ARCHIVED },
                { value: GdpProjectStatusEnum.DELETED, text: GdpProjectStatusEnum.DELETED },
              ]}
              value={projectsFilters.status}
              setValue={(value) => setProjectsFilters({ ...projectsFilters, status: value as GdpProjectStatusEnum })}
            />
          </div>
          <div className={styles.InputContainer}>
            <Select
              label={'Filtrer par Entité'}
              nullOptionText={'Toutes les entités'}
              options={companyEntities.map((entity) => ({ value: `${entity.id}`, text: entity.name || '' }))}
              value={projectsFilters.company_entity}
              setValue={(value) => setProjectsFilters({ ...projectsFilters, company_entity: value as CompanyEnum })}
            />
          </div>
          <div className={styles.headItemContainer}>
            <Button
              style={'text_gray'}
              icon={<DeleteOutlined rev={undefined} />}
              onClick={() => setProjectsFilters(projectsFiltersInitialState)}
            >
              Réinitialiser les filtres
            </Button>
          </div>
          <div className={styles.headItemContainer}>
            <DisplayOptionsController currentOption={displayOption} setCurrentOption={setDisplayOption} />
          </div>
        </div>
        <div className={styles.content}>
          {displayOption === 'grid' ? displayAsGrid() : displayOption === 'list' ? displayAsList() : ''}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
