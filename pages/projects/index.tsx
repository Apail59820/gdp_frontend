import React, { useState } from 'react';
import styles from '../../styles/Projects.module.scss';
import { DropdownFilter, FilterBar, Filters } from '@projex/ui';
import DisplayOptionsController from '../../src/components/DisplayOptionsController/DisplayOptionsController';
import Grid from '../../src/components/Grid/Grid';
import { ProjectModel } from '../../models/ProjectModel';
import { CompanyEnum } from '../../models/CompanyEnum';
import ProjectCard from '../../src/components/ProjectCard/ProjectCard';
import type { DataCategory, SelectedValues } from '@projex/ui/dist/components/organisms/Filters/Filters';
import ProjectsList from '../../src/ProjectsList/ProjectsList';

const PROJECTS: ProjectModel[] = [
  {
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
  },
  {
    id: '2',
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
    company_entity: CompanyEnum.AMEXIA,
    affairs: undefined,
  },
  {
    id: '3',
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
    company_entity: CompanyEnum.GROUPE_PROJEX,
    affairs: undefined,
  },
  {
    id: '4',
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
    company_entity: CompanyEnum.IMPERIUM,
    affairs: undefined,
  },
  {
    id: '5',
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
    company_entity: CompanyEnum.PROBIM,
    affairs: undefined,
  },
  {
    id: '6',
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
    company_entity: CompanyEnum.PROJEX,
    affairs: undefined,
  },
  {
    id: '7',
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
  },
  {
    id: '8',
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
    company_entity: CompanyEnum.AMEXIA,
    affairs: undefined,
  },
  {
    id: '9',
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
    company_entity: CompanyEnum.GROUPE_PROJEX,
    affairs: undefined,
  },
];

const DATA: DataCategory[] = [
  {
    categoryName: 'Projets',
    options: [
      { key: 'key1', name: 'projet de truc' },
      { key: 'key2', name: 'projet de machin' },
    ],
  },
  {
    categoryName: 'Entités',
    options: [
      { key: 'key3', name: 'Probim' },
      { key: 'key4', name: 'ezarze' },
      { key: 'key12', name: 'gtrgrt' },
    ],
  },
  {
    categoryName: 'Affaires',
    options: [
      { key: 'key5', name: 'Affaire truc' },
      { key: 'key6', name: 'affaire bidule' },
      { key: 'key7', name: 'Client protruc' },
      { key: 'rzeezrez', name: 'client fru' },
      { key: 'zerze', name: 'Client protruc' },
      { key: 'fdsfsd', name: 'client fru' },
      { key: 'zaeaz', name: 'Client protruc' },
      { key: 'jytukyu', name: 'client fru' },
      { key: 'azezz', name: 'Client protruc' },
      { key: 'grfegrez', name: 'client fru' },
      { key: 'liolmio', name: 'Client protruc' },
      { key: 'rezrze', name: 'client fru' },
      { key: 'grzeterz', name: 'Affaire truc' },
      { key: 'gfdjuykk', name: 'affaire bidule' },
      { key: 'aezrzar', name: 'Client protruc' },
      { key: 'htyrhtyre', name: 'client fru' },
      { key: 'hjgkhj', name: 'Client protruc' },
      { key: 'jytrjtyrj', name: 'client fru' },
      { key: 'fqsrttyuy', name: 'Client protruc' },
      { key: 'aezzarterth', name: 'client fru' },
      { key: 'htrhjkyuilyio', name: 'Client protruc' },
      { key: 'earaetyhtyrujrty', name: 'client fru' },
      { key: 'jkuyilio', name: 'Client protruc' },
      { key: 'vsfgsr', name: 'client fru' },
    ],
  },
  {
    categoryName: 'Clients',
    options: [
      { key: 'key7', name: 'Client protruc' },
      { key: 'key8', name: 'client fru' },
      { key: 'aaa', name: 'Client protruc' },
      { key: 'aaaee', name: 'client fru' },
      { key: 'rzerez', name: 'Client protruc' },
      { key: 'dfdd', name: 'client fru' },
      { key: 'jytjy', name: 'Client protruc' },
      { key: 'vdfvfd', name: 'client fru' },
      { key: 'arterg', name: 'Client protruc' },
      { key: 'ezrze', name: 'client fru' },
    ],
  },
];

const Projects = () => {
  const [filtersSelection, setFiltersSelection] = useState<SelectedValues>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const [displayOption, setDisplayOption] = useState<string>('grid');

  const displayAsGrid = (): React.ReactNode => (
    <Grid>
      {PROJECTS.map((project: ProjectModel) => (
        <ProjectCard key={project.id} project={project} projectManagerName={'Manager'} />
      ))}
    </Grid>
  );

  const displayAsList = (): React.ReactNode => <ProjectsList projects={PROJECTS} />;

  return (
    <div className="page">
      <FilterBar>
        <div>
          <DropdownFilter
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filtersSelection={filtersSelection}
          />
        </div>
        <div>Autres select ?</div>
      </FilterBar>
      {showFilters ? <Filters data={DATA} filtersSelection={filtersSelection} onSubmit={setFiltersSelection} /> : null}
      <div className={styles.projectsPage}>
        <div className={styles.head}>
          <h1 className={styles.title}>Tous les projets</h1>
          <DisplayOptionsController currentOption={displayOption} setCurrentOption={setDisplayOption} />
        </div>
        <div className={styles.content}>
          {displayOption === 'grid' ? displayAsGrid() : displayOption === 'list' ? displayAsList() : ''}
        </div>
      </div>
    </div>
  );
};

export default Projects;
