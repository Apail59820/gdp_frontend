import { PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Button } from '@projex/ui';
import React from 'react';
import { CompanyEnum } from '../../../../../models/UsModels';
import ActivitiesWidget from '../../../../../src/components/ActivitiesWidget/ActivitiesWidget';
import PageHeaderBanner from '../../../../../src/components/PageHeaderBanner/PageHeaderBanner';
import Phase from '../../../../../src/components/Phase/Phase';
import styles from '../../../../../styles/Advancement.module.scss';

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
    id: 3,
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
  return (
    <div className="page">
      <PageHeaderBanner data={PROJECT_BY_ID} />
      <div className={styles.advancementPage}>
        <Breadcrumb dynamicRoutesLabel={['Nom du projet', "Nom de l'affaire"]} />
        <div className={styles.head}>
          <h1>Nom de l&apos;affaire - Avancement</h1>
          <Button small icon={<PlusOutlined />}>
            Ajouter une étape
          </Button>
        </div>
        <div className={styles.body}>
          <div className={styles.phases}>
            {PHASES.map((phase) => (
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
