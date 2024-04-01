import {PlusOutlined} from '@ant-design/icons';
import {Breadcrumb, Button} from 'projex-ui';
import React, {createContext, useEffect, useState} from 'react';
import ActivitiesWidget from '../../../../../src/components/ActivitiesWidget/ActivitiesWidget';
import PageHeaderBanner from '../../../../../src/components/PageHeaderBanner/PageHeaderBanner';
import Phase from '../../../../../src/components/Phase/Phase';
import styles from '../../../../../styles/Advancement.module.scss';
import {useSelector} from 'react-redux';
import {useRouter} from 'next/router';
import {
  GdpActivitiesModel,
  GdpAffairModel,
  GdpFilesModel,
  GdpPhaseModel,
  GdpProjectsModel,
  GdpSatisfactionModel,
} from '../../../../../models/GdPModels';
import {getGdpAffair} from '../../../../../services/gestionDeProjets/GdpAffairs';
import {isRequestSuccessful} from '../../../../../utils/isRequestSuccessful';
import CreatePhaseForm from '../../../../../src/components/CreatePhaseForm/CreatePhaseForm';
import {selectUserProfile} from '../../../../../store/reducers/authReducer';
import {getGdpSatisfactions} from '../../../../../services/gestionDeProjets/GdpAffairsSatisfaction';
import getConfig from 'next/config';
import {capitalize} from "../../../../../utils/capitalize";
interface IsatisfactionContext {
  setHasSubmitSatisfaction: React.Dispatch<React.SetStateAction<boolean>>;
  hasSubmitSatisfaction: boolean;
}

export const satisfactionContext = createContext<IsatisfactionContext>({
  setHasSubmitSatisfaction: () => {
  },
  hasSubmitSatisfaction: false,
});

const Advancement = () => {
  const user = useSelector(selectUserProfile);

  const router = useRouter();
  const projectId = parseInt(router.query.projectId as string);
  const affairId = parseInt(router.query.affairId as string);

  const [project, setProject] = useState<Partial<GdpProjectsModel>>({});
  const [affair, setAffair] = useState<Partial<GdpAffairModel>>({});
  const [satisfactions, setSatisfactions] = useState<Partial<GdpSatisfactionModel>[]>([]);
  const [activities, setActivities] = useState<Partial<GdpAffairModel['activities_id']>>([]);
  const [phaseUpdated, setPhaseUpdated] = useState<boolean>(false);
  const [files, setFiles] = useState<Partial<GdpFilesModel>[]>([]);

  const [phases, setPhases] = useState<GdpPhaseModel[]>([]);

  const [hasSubmitSatisfaction, setHasSubmitSatisfaction] = useState<boolean>(false);

  const [dataFetched, setDataFetched] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (affairId && !dataFetched) {
      getGdpAffair(
        affairId,
        [
          '*',
          'company_entity.*',
          'pythagore_ids.*',
          'affairs_directus_users_ids.*',
          'projects_id.name',
          'projects_id.id',
          'affairs_phases_ids.*',
          'activities_id.*',
          'files.*',
        ].join(',')
      ).then((res) => {
        if (isRequestSuccessful(res.status) && res.data) {
          console.log('resdata;;;;', res.data);
          setAffair(res.data);
          if (res.data.affairs_phases_ids) setPhases(res.data.affairs_phases_ids as GdpPhaseModel[]);
          if (res.data.activities_id) setActivities(res.data.activities_id);
          if (res.data.projects_id) setProject(res.data.projects_id as Partial<GdpProjectsModel>);
          if (res.data.files) setFiles(res.data.files as Partial<GdpFilesModel>[]);

          setDataFetched(true);
        }
      });
    }
    if (affairId && phaseUpdated) {
      getGdpAffair(affairId, ['affairs_phases_ids.*', 'files.*'].join(',')).then((res) => {
        if (isRequestSuccessful(res.status) && res.data) {
          if (res.data.affairs_phases_ids) setPhases(res.data.affairs_phases_ids as GdpPhaseModel[]);
          if (res.data.files) setFiles(res.data.files as Partial<GdpFilesModel>[]);

          setPhaseUpdated(false);
        }
      });
    } else {
    }
  }, [phases, affair, affairId, dataFetched, phaseUpdated]);

  useEffect(() => {
    if (user) {
      getGdpSatisfactions({
        filter: {
          user_created: {_eq: user.id},
        },
        fields: '*',
      }).then((res) => {
        if (isRequestSuccessful(res.status) && res.data) {
          setSatisfactions(res.data);
          setHasSubmitSatisfaction(false);
        }
      });
    }
  }, [user, affair, phases, hasSubmitSatisfaction]);

  return (
    <>
      <satisfactionContext.Provider
        value={{
          setHasSubmitSatisfaction,
          hasSubmitSatisfaction,
        }}
      >
        <CreatePhaseForm
          project={project}
          affair={affair}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onUpdate={() => setDataFetched(false)}
        />
        <div className="page">
          <PageHeaderBanner data={project}/>
          <div className={styles.advancementPage}>
            <Breadcrumb dynamicRoutesLabel={[project.name!, affair.name!]}/>
            <div className={styles.head}>
              <h1>{capitalize(affair?.name ? affair.name : "Nom du projet")} - Avancement</h1>
              <Button
                small
                icon={<PlusOutlined  />}
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                Ajouter une étape
              </Button>
            </div>
            <div className={styles.body}>
              <div className={styles.phases}>
                {phases.map((phase) => {
                  const filteredFiles = files.filter((file) => file.phase_id === phase.id);

                  return (
                    <section className={styles.phaseContainer} key={phase.id}>
                      <Phase
                        phase={phase}
                        affair={affair}
                        project={project}
                        files={filteredFiles}
                        satisfactions={satisfactions.filter(
                          (satisfaction) => satisfaction.affairs_phases_id === phase.id
                        )}
                        setIsPhaseUpdated={setPhaseUpdated}
                        satisfactionDone={satisfactions.some((satisfaction) => {
                          return (
                            affair.id === satisfaction.affairs_id &&
                            phase.id === satisfaction.affairs_phases_id &&
                            user?.id === satisfaction.user_created
                          );
                        })}
                      />
                    </section>
                  );
                })}
              </div>

              <div className={styles.activitiesWidgetContainer}>
                <ActivitiesWidget activities={activities as GdpActivitiesModel[]}/>
              </div>
            </div>
          </div>
        </div>
      </satisfactionContext.Provider>
    </>
  );
};

export default Advancement;
