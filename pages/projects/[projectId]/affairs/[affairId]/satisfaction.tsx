import { useRouter } from 'next/router';
import styles from '../../../../../styles/Project.module.scss';
import { GdpAffairModel } from '../../../../../models/GestionDeProjets/GdpAffairModel';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAffairs } from '../../../../../store/reducers/affairsReducer';
import { getGdpAffair } from '../../../../../services/gestionDeProjets/GdpAffairs';
import PageHeaderBanner from '../../../../../src/components/PageHeaderBanner/PageHeaderBanner';
import { GdpProjectsModel } from '../../../../../models/GestionDeProjets/GdpProjectsModel';
import { selectProjects } from '../../../../../store/reducers/projectsReducer';
import { getGdpProjectById } from '../../../../../services/gestionDeProjets/GdpProjects';
import { Breadcrumb, Grid, Section } from 'projex-ui';
import SatisfactionCard from '../../../../../src/components/SatisfactionCard/SatisfactionCard';
import { GdpSatisfactionModel } from '../../../../../models/GestionDeProjets/GdpSatisfactionModel';
import { getGdpSatisfactions } from '../../../../../services/gestionDeProjets/GdpAffairsSatisfaction';
import PreviewSatisfactionsList from '../../../../../src/components/PreviewSatisfactionsList/PreviewSatisfactionsList';
import { GdpPhaseModel } from '../../../../../models/GestionDeProjets/GdpPhaseModel';
import { getGdpAffairsPhases } from '../../../../../services/gestionDeProjets/GdpPhases';
import PhaseSatisfaction from '../../../../../src/components/PhaseSatisfaction/PhaseSatisfaction';

const Satisfaction = () => {
  const { query } = useRouter();
  const affairs = useSelector(selectAffairs);
  const projects = useSelector(selectProjects);

  const [affair, setAffair] = useState<Partial<GdpAffairModel>>({});
  const [affairProject, setAffairProject] = useState<Partial<GdpProjectsModel>>({});
  const [affairSatisfactions, setAffairSatisfactions] = useState<Partial<GdpSatisfactionModel>[]>([]);
  const [affairPhases, setAffairPhases] = useState<Partial<GdpPhaseModel>[]>([]);

  useEffect(() => {
    if (query.affairId) {
      const affairId = parseInt(query.affairId as string);
      const affair = affairs.find((affair) => affair.id === affairId);
      if (affair) setAffair(affair);
      else {
        getGdpAffair(affairId).then((res) => {
          if (res.status === 200 && res.data) setAffair(res.data);
          else setAffair({});
        });
      }
    } else {
      setAffair({});
    }
  }, [affairs, query.affairId]);

  useEffect(() => {
    if (affair.projects_id) {
      if (typeof affair.projects_id === 'number') {
        const project = projects.find((project) => project.id === affair.projects_id);
        if (project) setAffairProject(project);
        else {
          getGdpProjectById(affair.projects_id).then((res) => {
            if (res.status === 200 && res.data) setAffairProject(res.data);
            else setAffairProject({});
          });
        }
      } else {
        setAffairProject(affair.projects_id);
      }
    } else {
      setAffairProject({});
    }
  }, [affair.projects_id, projects]);

  useEffect(() => {
    if (affair.id) {
      getGdpSatisfactions({
        filter: {
          affairs_id: { _in: affair.id },
        },
      }).then((res) => {
        if (res.status === 200 && res.data) setAffairSatisfactions(res.data);
        else setAffairSatisfactions([]);
      });
    } else setAffairSatisfactions([]);
  }, [affair.id]);

  useEffect(() => {
    if (affair.affairs_phases_ids && affair.affairs_phases_ids.length > 0) {
      const affairPhases: Partial<GdpPhaseModel>[] = [];
      const affairPhasesToRetrieve: number[] = [];
      affair.affairs_phases_ids.forEach((phase) => {
        if (typeof phase === 'number') {
          affairPhasesToRetrieve.push(phase);
        } else {
          affairPhases.push(phase);
        }
      });
      if (affairPhasesToRetrieve.length > 0) {
        getGdpAffairsPhases({
          filter: { id: { _in: affairPhasesToRetrieve } },
        }).then((res) => {
          if (res.status === 200 && res.data) {
            setAffairPhases([...affairPhases, ...res.data]);
          } else {
            setAffairPhases(affairPhases);
          }
        });
      } else {
        setAffairPhases(affairPhases);
      }
    } else {
      setAffairPhases([]);
    }
  }, [affair.affairs_phases_ids]);

  return (
    <div className="page">
      <PageHeaderBanner data={affairProject} />
      <div className={styles.projectPage}>
        <Breadcrumb dynamicRoutesLabel={[affairProject.name!, affair.name!]} />
        <h1 className={styles.title}>Satisfaction de l&apos;affaire</h1>
        <section>
          <Grid type={'narrow'}>
            <Section title={'Affaire globale'}>
              <SatisfactionCard satisfactions={affairSatisfactions} />
            </Section>
            <Section title={'Questionnaires de satisfaction récents'}>
              <PreviewSatisfactionsList satisfactions={affairSatisfactions} />
            </Section>
          </Grid>
        </section>
        <Section title={'Par étape'}>
          <div className={styles.phasesWidget}>
            {affairPhases.map((phase) => (
              <PhaseSatisfaction
                phase={phase}
                satisfactions={affairSatisfactions.filter(
                  (satisfaction) => satisfaction.affairs_phases_id === phase.id
                )}
              />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
};

export default Satisfaction;
