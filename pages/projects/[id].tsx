import React, { useState } from 'react';
import styles from '../../styles/Project.module.scss';
import Link from 'next/link';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ProjectModel } from '../../models/ProjectModel';
import { AffairModel } from '../../models/AffairModel';
import { CompanyEnum } from '../../models/CompanyEnum';
import { UserModel } from '../../models/UserModels';
import { PythagoreFactureModel } from '../../models/PythagoreFactureModel';
import { Breadcrumb, ManageItemCard, QuickActionCard, RecentActivitiesCard } from '@projex/ui';
import PageHeaderBanner from '../../src/components/PageHeaderBanner/PageHeaderBanner';
import Section from '../../src/components/Section/Section';
import Grid from '../../src/components/Grid/Grid';
import AffairCard from '../../src/components/AffairCard/AffairCard';
import ClientCard from '../../src/components/ClientCard/ClientCard';
import ManagerCard from '../../src/components/ManagerCard/ManagerCard';
import InvoiceCard from '../../src/components/InvoiceCard/InvoiceCard';

// TODO Récupérer le projet selon l'id de l'url
const PROJECT_BY_ID: ProjectModel = {
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

// TODO
const CURRENT_USER_AFFAIRS: AffairModel[] = [
  {
    id: '1',
    user_created: undefined,
    date_created: undefined,
    user_updated: undefined,
    date_updated: undefined,
    name: "Nom de l'affaire",
    client_company_name: undefined,
    client_info: undefined,
    internal_company: CompanyEnum.DIAGOBAT,
    address: undefined,
    zip_code: undefined,
    city: undefined,
    country: undefined,
    image: undefined,
    pythagore_ids: undefined,
    status: undefined,
    user_access: undefined,
    affairs_satisfaction: undefined,
  },
  {
    id: '2',
    user_created: undefined,
    date_created: undefined,
    user_updated: undefined,
    date_updated: undefined,
    name: "Nom de l'affaire",
    client_company_name: undefined,
    client_info: undefined,
    internal_company: CompanyEnum.DIAGOBAT,
    address: undefined,
    zip_code: undefined,
    city: undefined,
    country: undefined,
    image: undefined,
    pythagore_ids: undefined,
    status: undefined,
    user_access: undefined,
    affairs_satisfaction: undefined,
  },
];

// TODO
const PROJECT_PROGRESS_PERCENTAGE = 65;

const CLIENT: ProjectModel = {
  id: '1',
  name: undefined,
  client_company_name: 'Nom du client',
  client_info: undefined,
  address: 'rue Pierre Mauroy',
  zip_code: '59800',
  city: 'Lille',
  country: 'France',
  image: undefined,
  status: undefined,
  project_type: undefined,
  company_entity: undefined,
  affairs: undefined,
};
const CLIENT_USERS: UserModel[] = [
  { first_name: 'Patrice', last_name: 'Biervoye', number: '0607080910', email: 'email@email.fr' },
];

const MANAGER: UserModel = {
  first_name: 'Michel',
  last_name: 'Martin',
  email: 'email@email.fr',
  role: 'Ingénieur',
  company: CompanyEnum.DIAGOBAT,
  number: '0607080910',
};

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

const INVOICES: PythagoreFactureModel[] = [
  {
    num_facture: '2021-11-011',
    etatreglt_facture: 'Reglee',
    statut_facture: 'Echue',
    date_echeance_facture: '2023-01-29',
  },
  {
    num_facture: '2021-11-011',
    etatreglt_facture: 'NonReglee',
    statut_facture: 'NonEchue',
    date_echeance_facture: '2023-02-02',
  },
  {
    num_facture: '2021-11-011',
    etatreglt_facture: 'NonReglee',
    statut_facture: 'Echue',
    date_echeance_facture: '2023-01-29',
  },
];

const Project = () => {
  const [displayQuickAccessSection, setDisplayQuickAccessSection] = useState<boolean>(true);

  return (
    <>
      <PageHeaderBanner project={PROJECT_BY_ID} />
      <div className={styles.projectPage}>
        <Breadcrumb dynamicRoutesLabel={[PROJECT_BY_ID.name!]} />
        <h1 className={styles.title}>Le projet</h1>
        <Section
          title="Accès rapide"
          button={{
            label: `${displayQuickAccessSection ? 'Masquer' : 'Afficher'} l'accès rapide`,
            onClick: () => setDisplayQuickAccessSection((prev) => !prev),
          }}
        >
          {displayQuickAccessSection ? (
            <Grid>
              <QuickActionCard
                title="Créez une nouvelle affaire"
                button={{ label: 'Ajouter une affaire', href: '/', icon: <PlusOutlined /> }} // TODO Handle link href
              >
                Vous pouvez désormais ajouter une affaire au projet afin d&apos;en suivre l&apos;évolution et la
                facturation
              </QuickActionCard>
              <QuickActionCard
                title="Facturation"
                button={{ label: 'Configurer la facturation', href: '/', icon: <EditOutlined /> }} // TODO Handle link href
              >
                Vous pouvez associer les numéros Pythagore aux affaires correspondantes
              </QuickActionCard>
              <QuickActionCard title="Complétez le projet" progress={PROJECT_PROGRESS_PERCENTAGE}>
                Remplissez votre profil pour profiter pleinement de toutes les fonctionnalités
              </QuickActionCard>
            </Grid>
          ) : null}
        </Section>
        <Section
          title="Les affaires"
          link={{ label: 'Voir toutes les affaires', href: `/projects/${PROJECT_BY_ID.id}/affairs` }}
        >
          <Grid>
            {CURRENT_USER_AFFAIRS.map((affair: AffairModel) => (
              <Link key={affair.id} href={`/projects/${PROJECT_BY_ID.id}/affairs/${affair.id}`}>
                {/* TODO Handle onClick */}
                <AffairCard affair={affair} onKebabMenuClick={() => console.log('handle click ?')} />
              </Link>
            ))}
            {/* TODO Handle onClick */}
            <ManageItemCard label="Nouvelle affaire" onClick={() => console.log('open modal ?')} />
          </Grid>
        </Section>
        <section>
          <Grid type="narrow">
            {/* Handle href */}
            <Section title="Équipe client" link={{ label: 'Voir la fiche client', href: '/' }}>
              <ClientCard client={CLIENT} users={CLIENT_USERS} maxIcon={5} clientPageHref={''} />
            </Section>
            <Section
              title="Chef de projet"
              link={{ label: "Voir toute l'équipe projet", href: `/projects/${PROJECT_BY_ID.id}/team` }}
            >
              <ManagerCard user={MANAGER} onKebabMenuClick={() => console.log('handle click ?')} />
            </Section>
          </Grid>
        </section>
        <section>
          <Grid type="narrow">
            {/* Handle href */}
            <Section title="Activités récentes">
              {ACTIVITIES.length ? <RecentActivitiesCard activities={ACTIVITIES} /> : <span>Aucune activité</span>}
            </Section>
            <Section
              title="Facturation"
              link={{ label: `Voir les ${INVOICES.length} factures`, href: `/projects/${PROJECT_BY_ID.id}/billings` }}
            >
              <Grid type="narrow">
                {INVOICES.slice(0, 3).map((invoice) => (
                  <InvoiceCard invoice={invoice} />
                ))}
                <ManageItemCard
                  type="edit"
                  label="Configurer la facturation"
                  onClick={() => console.log('handle click ?')}
                />
              </Grid>
            </Section>
          </Grid>
        </section>
      </div>
    </>
  );
};

export default Project;
