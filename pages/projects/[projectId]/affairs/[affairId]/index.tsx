import React, { useEffect, useState } from 'react';
import styles from '../../../../../styles/Affair.module.scss';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  GdpActivitiesModel,
  GdpAffairsUsersModel,
  GdpFilesModel,
  GdpProjectsModel,
} from '../../../../../models/GdPModels';
import { GdpAffairModel } from '../../../../../models/GdPModels';
import { Breadcrumb, QuickActionCard } from '@projex/ui';
import Grid from '../../../../../src/components/Grid/Grid';
import PageHeaderBanner from '../../../../../src/components/PageHeaderBanner/PageHeaderBanner';
import QuickAccessWidget from '../../../../../src/components/QuickAccessWidget/QuickAccessWidget';
import ClientTeamWidget from '../../../../../src/components/ClientTeamWidget/ClientTeamWidget';
import CollaboratorTeamWidget from '../../../../../src/components/CollaboratorTeamWidget/CollaboratorTeamWidget';
import BillingWidget from '../../../../../src/components/BillingWidget/BillingWidget';
import FilesWidget from '../../../../../src/components/FilesWidget/FilesWidget';
import StatisticsWidget from '../../../../../src/components/StatisticsWidget/StatisticsWidget';
import type { Statistic } from '../../../../../src/components/StatisticsCard/StatisticsCard';
import { capitalize } from '../../../../../utils/capitalize';
import PhasesWidget from '../../../../../src/components/PhasesWidget/PhasesWidget';
import { getGdpAffair } from '../../../../../services/gestionDeProjets/GdpAffairs';
import { useRouter } from 'next/router';
import { isRequestSuccessful } from '../../../../../utils/isRequestSuccessful';
import { getGdpAffairsUsers } from '../../../../../services/gestionDeProjets/GdpAffairsUsers';
import ActivitiesWidget from '../../../../../src/components/ActivitiesWidget/ActivitiesWidget';

// TODO
const PROJECT_BY_ID: GdpProjectsModel = {
  id: 1,
  name: 'Nom du projet',
  client_company_name: 'Nom du client',
  client_info: null,
  address: null,
  zip_code: null,
  city: null,
  country: null,
};

const AFFAIR_PROGRESS_PERCENTAGE: number = 65;

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

const STATISTICS: Statistic[] = [
  { label: 'Label 1 ', percentage: 65 },
  { label: 'Label 2', percentage: 65 },
];

const Affair = () => {
  const { query } = useRouter();

  const [affair, setAffair] = useState<Partial<GdpAffairModel>>({});
  const [users, setUsers] = useState<Partial<GdpAffairsUsersModel>[]>([]);

  useEffect(() => {
    if (!query.affairId || typeof query.affairId !== 'string') return;

    getGdpAffair(
      +query.affairId,
      [
        '*',
        'phases.*',
        'company_entity.*',
        'pythagore_ids.*',
        'affairs_directus_users_ids.*',
        'projects_id.name',
        'projects_id.id',
        'affairs_phases.*',
        'activities_id.*',
      ].join(',')
    )
      .then((response) => {
        if (isRequestSuccessful(response.status) && response.data) {
          setAffair(response.data);
        }
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.error(error));
  }, [query.affairId]);

  useEffect(
    function retrieveUsers() {
      getGdpAffairsUsers({ filter: { affairs_id: affair.id } })
        .then((response) => {
          if (isRequestSuccessful(response.status) && response.data) {
            setUsers(response.data);
          }
        })
        // eslint-disable-next-line no-console
        .catch((error) => console.error(error));
    },
    [affair]
  );

  console.log(affair);
  console.log(users);

  return (
    <div className="page">
      <PageHeaderBanner
        data={{ name: affair.projects_id ? (affair.projects_id as GdpProjectsModel).name : 'Projet' }}
      />
      <div className={styles.affairPage}>
        <Breadcrumb
          dynamicRoutesLabel={[
            affair.projects_id ? (affair.projects_id as GdpProjectsModel).name : 'Projet',
            affair.name || 'Affaire',
          ]}
        />
        <h1 className={styles.title}>{affair.name ? capitalize(affair.name) : `Affaire ${affair.id}`}</h1>
        <QuickAccessWidget>
          <Grid>
            <QuickActionCard
              title="Facturation"
              button={{
                label: 'Configurer la facturation',
                icon: <EditOutlined />,
                onClick: () => console.log('open modal ?'),
              }}
            >
              Vous pouvez associer les numéros Pythagore aux affaires correspondantes
            </QuickActionCard>
            <QuickActionCard
              title="Étapes du projet"
              button={{
                label: 'Ajouter une étape',
                icon: <PlusOutlined />,
                onClick: () => console.log('open modal ?'),
              }}
            >
              Vous pouvez créer des étapes pour un suivi approfondi de l&apos;affaire
            </QuickActionCard>
            <QuickActionCard title="Complétez l'affaire" progress={AFFAIR_PROGRESS_PERCENTAGE}>
              Remplissez l&apos;affaire pour profiter pleinement de toutes les fonctionnalités
            </QuickActionCard>
          </Grid>
        </QuickAccessWidget>
        <PhasesWidget phases={[]} onNewPhaseClick={() => console.log('open modal ?')} />
        <section>
          <Grid type="narrow">
            <ClientTeamWidget
              users={[]}
              clientCompany={PROJECT_BY_ID}
              onAddClientClick={() => console.log('open modal ?')}
            />
            <CollaboratorTeamWidget
              type="affair"
              users={[]}
              companyEntity={'company'}
              onAddCollaboratorClick={() => console.log('open modal ?')}
            />
          </Grid>
        </section>
        <section>
          <Grid type="narrow">
            <ActivitiesWidget activities={affair.activities_id as GdpActivitiesModel[]} />
            <BillingWidget invoices={[]} onConfigureBillingClick={() => console.log('open modal ?')} />
          </Grid>
        </section>
        <section>
          <Grid type="narrow">
            <FilesWidget
              files={(affair.files as GdpFilesModel[]) || []}
              onNewFileClick={() => console.log('open modal ?')}
            />
            <StatisticsWidget statistics={STATISTICS || []} onNewStatisticClick={() => console.log('open modal ?')} />
          </Grid>
        </section>
      </div>
    </div>
  );
};

export default Affair;
