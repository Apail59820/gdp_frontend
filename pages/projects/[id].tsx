import React, { useState } from 'react';
import styles from '../../styles/Project.module.scss';
import Link from 'next/link';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ProjectModel } from '../../models/ProjectModel';
import { AffairModel } from '../../models/AffairModel';
import { CompanyEnum } from '../../models/CompanyEnum';
import { Breadcrumb, ManageItemCard, QuickActionCard } from '@projex/ui';
import PageHeaderBanner from '../../src/components/PageHeaderBanner/PageHeaderBanner';
import Section from '../../src/components/Section/Section';
import Grid from '../../src/components/Grid/Grid';
import AffairCard from '../../src/components/AffairCard/AffairCard';
import ClientCard from '../../src/components/ClientCard/ClientCard';

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
                Vous pouvez désormais ajouter une affaire au projet afin d'en suivre l'évolution et la facturation
              </QuickActionCard>
              <QuickActionCard
                title="Facturation"
                // progress={PROFILE_PROGRESS_PERCENTAGE}
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
                <AffairCard affair={affair} onKebabMenuClick={() => console.log('handle click ?')} />
              </Link>
            ))}
            {/* TODO Handle onClick */}
            <ManageItemCard label="Nouvelle affaire" onClick={() => console.log('open modal ?')} />
          </Grid>
        </Section>
        <section>
          <Grid type="narrow">
            <Section title="Équipe client" link={{ label: 'Voir la fiche client', href: '/' }}>
              <ClientCard
                client={{
                  id: undefined,
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
                }}
                users={[
                  { first_name: 'Patrice', last_name: 'Biervoye', number: '0607080910', email: 'email@email.fr' },
                ]}
                maxIcon={5}
                clientPageHref={''}
              />
            </Section>
          </Grid>
        </section>
      </div>
    </>
  );
};

export default Project;
