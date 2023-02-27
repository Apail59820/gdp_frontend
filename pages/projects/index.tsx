import React, { useState } from 'react';
import styles from '../../styles/Projects.module.scss';
import { DropdownFilter, FilterBar, Filters } from '@projex/ui';
import type { DataCategory, SelectedValues } from '@projex/ui/dist/components/organisms/Filters/Filters';
import DisplayOptionsController from '../../src/components/DisplayOptionsController/DisplayOptionsController';
import Grid from '../../src/components/Grid/Grid';
import ProjectCard from '../../src/components/ProjectCard/ProjectCard';
import ProjectsList from '../../src/ProjectsList/ProjectsList';
import { GdpProjectsModel } from '../../models/GestionDeProjets/GdpProjectsModel';
import { useSelector } from 'react-redux';
import { selectProjects } from '../../store/reducers/projectsReducer';
import Link from 'next/link';

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

  const projects: Partial<GdpProjectsModel>[] = useSelector(selectProjects);

  const displayAsGrid = (): React.ReactNode => (
    <Grid>
      {projects.map((project) => (
        <Link key={project.id} href={`/projects/${project.id}`}>
          <ProjectCard project={project} projectManagerName={'Manager'} />
        </Link>
      ))}
    </Grid>
  );

  const displayAsList = (): React.ReactNode => <ProjectsList projects={projects} />;

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
