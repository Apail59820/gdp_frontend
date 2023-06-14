import React, { useEffect, useState } from 'react';
import PageHeaderBanner from '../../../src/components/PageHeaderBanner/PageHeaderBanner';
import { GdpProjectsModel } from '../../../models/GestionDeProjets/GdpProjectsModel';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectProjects, setProjects } from '../../../store/reducers/projectsReducer';
import { getGdpProjectById } from '../../../services/gestionDeProjets/GdpProjects';
import { Breadcrumb, Grid, Section } from '@projex/ui';
import styles from '../../../styles/Project.module.scss';
import { GdpSatisfactionModel } from '../../../models/GestionDeProjets/GdpSatisfactionModel';
import { getGdpSatisfactions } from '../../../services/gestionDeProjets/GdpAffairsSatisfaction';
import SatisfactionCard from '../../../src/components/SatisfactionCard/SatisfactionCard';

const ProjectSatisfaction = () => {
  const router = useRouter();
  const projectId = parseInt(router.query.projectId as string);

  const projects = useSelector(selectProjects);

  const [project, setProject] = useState<Partial<GdpProjectsModel>>({});
  const [projectSatisfactions, setProjectSatisfactions] = useState<Partial<GdpSatisfactionModel>[]>([]);

  useEffect(() => {
    if (projectId) {
      if (projects.filter((project) => project.id === projectId).length > 0) {
        return setProject(projects.filter((project) => project.id === projectId)[0]);
      } else {
        getGdpProjectById(projectId).then((res) => {
          if (res.status === 200 && res.data) setProject(res.data);
        });
      }
    } else setProject({});
  }, [projectId, projects]);

  useEffect(() => {
    if (project) {
      getGdpSatisfactions({
        filter: {
          affairs_id: { _in: project.affairs_ids },
        },
      }).then((res) => {
        if (res.status === 200 && res.data) setProjectSatisfactions(res.data);
        else setProjectSatisfactions([]);
      });
    } else {
      setProjectSatisfactions([]);
    }
  }, [project]);

  return (
    <div className={'page'}>
      <PageHeaderBanner data={project} />
      <div>
        <Breadcrumb dynamicRoutesLabel={[project.name!]} />
        <h1 className={styles.title}>Satisfaction du projet</h1>
        <section>
          <Grid type={'narrow'}>
            <Section title={'Projet global'}>
              <SatisfactionCard satisfactions={projectSatisfactions} />
            </Section>
            <Section title={'Questionnaires de satisfaction récents'}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </Section>
          </Grid>
        </section>
        <Section title={'Par affaire'}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </Section>
      </div>
    </div>
  );
};

export default ProjectSatisfaction;
