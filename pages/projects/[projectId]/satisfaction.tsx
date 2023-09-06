import React, { useEffect, useState } from 'react';
import PageHeaderBanner from '../../../src/components/PageHeaderBanner/PageHeaderBanner';
import { GdpProjectsModel } from '../../../models/GestionDeProjets/GdpProjectsModel';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { selectProjects } from '../../../store/reducers/projectsReducer';
import { getGdpProjectById } from '../../../services/gestionDeProjets/GdpProjects';
import { Breadcrumb, Grid, Section } from 'projex-ui';
import styles from '../../../styles/Project.module.scss';
import { GdpSatisfactionModel } from '../../../models/GestionDeProjets/GdpSatisfactionModel';
import { getGdpSatisfactions } from '../../../services/gestionDeProjets/GdpAffairsSatisfaction';
import SatisfactionCard from '../../../src/components/SatisfactionCard/SatisfactionCard';
import PreviewSatisfactionsList from '../../../src/components/PreviewSatisfactionsList/PreviewSatisfactionsList';
import PreviewAffairSatisfactionCard from '../../../src/components/PreviewAffairSatisfactionCard/PreviewAffairSatisfactionCard';
import { selectAffairs, setAffairs } from '../../../store/reducers/affairsReducer';
import { getGdpAffairs } from '../../../services/gestionDeProjets/GdpAffairs';
import Link from 'next/link';
import { GdpAffairModel } from '../../../models/GestionDeProjets/GdpAffairModel';

const ProjectSatisfaction = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const projectId = parseInt(router.query.projectId as string);

  const projects = useSelector(selectProjects);
  const affairs = useSelector(selectAffairs);

  const [project, setProject] = useState<Partial<GdpProjectsModel>>({});
  const [projectAffairs, setProjectAffairs] = useState<Partial<GdpAffairModel>[]>([]);
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

  useEffect(() => {
    const affairsIdsToFetch: number[] = [];
    const existingAffairs: Partial<GdpAffairModel>[] = [];
    project.affairs_ids?.forEach((affair) => {
      if (typeof affair === 'number') {
        if (affairs.filter((affairFromContext) => affairFromContext.id === affair).length === 0) {
          affairsIdsToFetch.push(affair);
        }
      } else {
        if (affairs.filter((affairFromContext) => affairFromContext.id === affair.id).length === 0) {
          affairsIdsToFetch.push(affair.id);
        } else existingAffairs.push(affair);
      }
    });
    if (affairsIdsToFetch.length > 0) {
      getGdpAffairs({
        filter: {
          id: { _in: affairsIdsToFetch },
        },
      }).then((res) => {
        if (res.status === 200 && res.data) {
          dispatch(setAffairs([...affairs, ...res.data]));
          setProjectAffairs([...existingAffairs, ...res.data]);
        }
      });
    }
  }, [affairs, dispatch, project.affairs_ids]);

  return (
    <div className={'page'}>
      <PageHeaderBanner data={project} />
      <div className={styles.projectPage}>
        <Breadcrumb dynamicRoutesLabel={[project.name!]} />
        <h1 className={styles.title}>Satisfaction du projet</h1>
        <section>
          <Grid type={'narrow'}>
            <Section title={'Projet global'}>
              <SatisfactionCard satisfactions={projectSatisfactions} reverse />
            </Section>
            <Section title={'Questionnaires de satisfaction récents'}>
              <PreviewSatisfactionsList satisfactions={projectSatisfactions} />
            </Section>
          </Grid>
        </section>
        <Section title={'Par affaire'}>
          <Grid>
            {projectAffairs.map((affair, index) => (
              <Link href={'/affairs/' + affair.id + '/satisfaction'} key={index}>
                <PreviewAffairSatisfactionCard
                  affair={affair}
                  satisfactions={projectSatisfactions.filter((satisfaction) => satisfaction.affairs_id === affair.id)}
                />
              </Link>
            ))}
          </Grid>
        </Section>
      </div>
    </div>
  );
};

export default ProjectSatisfaction;
