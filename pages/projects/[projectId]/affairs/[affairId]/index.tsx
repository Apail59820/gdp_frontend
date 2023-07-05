import React, { useEffect, useMemo, useState } from 'react';
import styles from '../../../../../styles/Affair.module.scss';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  GdpActivitiesModel,
  GdpFilesModel,
  GdpProjectsModel,
  GdpPythagoreFactureModel,
  GdpSatisfactionModel,
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
import { capitalize } from '../../../../../utils/capitalize';
import PhasesWidget from '../../../../../src/components/PhasesWidget/PhasesWidget';
import { getGdpAffair } from '../../../../../services/gestionDeProjets/GdpAffairs';
import { useRouter } from 'next/router';
import { isRequestSuccessful } from '../../../../../utils/isRequestSuccessful';
import ActivitiesWidget from '../../../../../src/components/ActivitiesWidget/ActivitiesWidget';
import { getGdpAffairsPhases } from '../../../../../services/gestionDeProjets/GdpPhases';
import { UsUserModel } from '../../../../../models/UserService/UsUserModel';
import { getGdpAffairsUsers } from '../../../../../services/gestionDeProjets/GdpAffairsUsers';
import { getUsUsers } from '../../../../../services/userService/UsUsers';
import { getGdpActivities } from '../../../../../services/gestionDeProjets/GdpActivities';
import { getGdpAffairsPythagoreAffairs } from '../../../../../services/gestionDeProjets/GdpAffairsPythagoreAffairs';
import { getGdpPythagoreFactures } from '../../../../../services/gestionDeProjets/GdpPythagoreFactures';
import { getGdpFiles } from '../../../../../services/gestionDeProjets/GdpFiles';
import SatisfactionWidget from '../../../../../src/components/SatisfactionWidget/SatisfactionWidget';
import { getGdpSatisfactions } from '../../../../../services/gestionDeProjets/GdpAffairsSatisfaction';

const Affair = () => {
  const { query } = useRouter();

  const [affair, setAffair] = useState<Partial<GdpAffairModel>>({});
  const [affairPhases, setAffairPhases] = useState<Partial<GdpAffairModel>[]>([]);
  const [affairManagers, setAffairManagers] = useState<Partial<UsUserModel>[]>([]);
  const [affairClients, setAffairClients] = useState<Partial<UsUserModel>[]>([]);
  const [affairActivities, setAffairActivities] = useState<Partial<GdpActivitiesModel>[]>([]);
  const [affairInvoices, setAffairInvoices] = useState<Partial<GdpPythagoreFactureModel>[]>([]);
  const [files, setFiles] = useState<Partial<GdpFilesModel>[]>([]);
  const [affairSatisfactions, setAffairSatisfactions] = useState<Partial<GdpSatisfactionModel>[]>([]);

  const progressPercentage = useMemo(() => {
    const requiredProps = ['name', 'company_entity', 'projects_id'];
    let propsDefined = requiredProps.reduce(
      (count, prop) => count + (affair && affair[prop as keyof Partial<GdpAffairModel>] ? 1 : 0),
      0
    );

    if (affair.affairs_phases && affair.affairs_phases.length > 0) propsDefined++;
    // On divise par requiredProps.length + 1 car on ajoute 1 pour les phases
    return Math.round((propsDefined / (requiredProps.length + 1)) * 100);
  }, [affair]);

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
        } else setAffair({});
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.error(error));
  }, [query.affairId]);

  // Retrieve phases
  useEffect(() => {
    if (affair.affairs_phases && affair.affairs_phases.length > 0) {
      const phasesToRetrieve: number[] = [];
      const phases: Partial<GdpAffairModel>[] = [];
      affair.affairs_phases.forEach((phase) => {
        if (typeof phase === 'number') phasesToRetrieve.push(phase);
        else phases.push(phase);
      });

      if (phasesToRetrieve.length > 0) {
        getGdpAffairsPhases({ filter: { id: { in: phasesToRetrieve } } }).then((response) => {
          if (response.status === 200 && response.data) {
            phases.push(...response.data);
          }
        });
      }
      setAffairPhases(phases);
    }
  }, [affair]);

  // Retrieve managers
  useEffect(() => {
    if (affair && affair.affairs_directus_users_ids) {
      const relationsToRetrieve: number[] = [];
      const managersToRetrieve: string[] = [];
      const managers: Partial<UsUserModel>[] = [];
      affair.affairs_directus_users_ids.forEach((relation) => {
        if (typeof relation === 'number') relationsToRetrieve.push(relation);
        else if (relation.project_manager) {
          if (typeof relation.directus_users_id === 'string') managersToRetrieve.push(relation.directus_users_id);
          else managers.push(relation.directus_users_id);
        }
      });
      if (relationsToRetrieve.length > 0) {
        getGdpAffairsUsers({ filter: { id: { _in: relationsToRetrieve } } }).then((response) => {
          if (response.status === 200 && response.data) {
            response.data.forEach((relation) => {
              if (relation.directus_users_id) {
                if (typeof relation.directus_users_id === 'string') managersToRetrieve.push(relation.directus_users_id);
                else managers.push(relation.directus_users_id);
              }
            });
          }
          if (managersToRetrieve.length > 0) {
            getUsUsers({ filter: { id: { _in: managersToRetrieve } } }).then((response) => {
              if (response.status === 200 && response.data) {
                setAffairManagers([...managers, ...response.data]);
              }
            });
          } else {
            setAffairManagers(managers);
          }
        });
      } else {
        if (managersToRetrieve.length > 0) {
          getUsUsers({ filter: { id: { _in: managersToRetrieve } } }).then((response) => {
            if (response.status === 200 && response.data) {
              setAffairManagers([...managers, ...response.data]);
            }
          });
        } else {
          setAffairManagers(managers);
        }
      }
    }
  }, [affair]);

  // Retrieve clients
  useEffect(() => {
    if (affair && affair.affairs_directus_users_ids) {
      const relationsToRetrieve: number[] = [];
      const clientsToRetrieve: string[] = [];
      const clients: Partial<UsUserModel>[] = [];
      affair.affairs_directus_users_ids.forEach((relation) => {
        if (typeof relation === 'number') relationsToRetrieve.push(relation);
        else if (!relation.project_manager) {
          if (typeof relation.directus_users_id === 'string') clientsToRetrieve.push(relation.directus_users_id);
          else clients.push(relation.directus_users_id);
        }
      });
      if (relationsToRetrieve.length > 0) {
        getGdpAffairsUsers({ filter: { id: { _in: relationsToRetrieve } } }).then((response) => {
          if (response.status === 200 && response.data) {
            response.data.forEach((relation) => {
              if (relation.directus_users_id) {
                if (typeof relation.directus_users_id === 'string') clientsToRetrieve.push(relation.directus_users_id);
                else clients.push(relation.directus_users_id);
              }
            });
          }
          if (clientsToRetrieve.length > 0) {
            getUsUsers({ filter: { id: { _in: clientsToRetrieve } } }).then((response) => {
              if (response.status === 200 && response.data) {
                setAffairClients([...clients, ...response.data]);
              }
            });
          } else {
            setAffairManagers(clients);
          }
        });
      } else {
        if (clientsToRetrieve.length > 0) {
          getUsUsers({ filter: { id: { _in: clientsToRetrieve } } }).then((response) => {
            if (response.status === 200 && response.data) {
              setAffairClients([...clients, ...response.data]);
            }
          });
        } else {
          setAffairClients(clients);
        }
      }
    }
  }, [affair]);

  // Retrieve activities
  useEffect(() => {
    getGdpActivities({
      filter: {
        _and: [
          { projects_id: { _eq: affair.id } },
          {
            collection: {
              _in: ['projects', 'projects_directus_users_clients', 'projects_directus_users_collaborators'],
            },
          },
        ],
      },
    }).then((res) => {
      if (res.status === 200 && res.data) {
        setAffairActivities(res.data);
      } else {
        setAffairActivities([]);
      }
    });
  }, [affair.id]);

  useEffect(() => {
    if (affair.pythagore_ids && affair.pythagore_ids.length > 0) {
      const affairPythagoreAffairIds: number[] = [];
      const pythagoreAffairIds: string[] = [];
      affair.pythagore_ids.forEach((affairPythagoreAffairRelation) => {
        if (typeof affairPythagoreAffairRelation === 'number')
          affairPythagoreAffairIds.push(affairPythagoreAffairRelation);
        else if (affairPythagoreAffairRelation.pythagore_affaires_id)
          if (typeof affairPythagoreAffairRelation.pythagore_affaires_id === 'string')
            pythagoreAffairIds.push(affairPythagoreAffairRelation.pythagore_affaires_id);
          else if (affairPythagoreAffairRelation.pythagore_affaires_id.numero_affaire) {
            pythagoreAffairIds.push(affairPythagoreAffairRelation.pythagore_affaires_id.numero_affaire);
          }
      });
      if (affairPythagoreAffairIds.length > 0 && pythagoreAffairIds.length < 3) {
        getGdpAffairsPythagoreAffairs({
          filter: {
            id: { _in: affairPythagoreAffairIds },
          },
          limit: 3,
        }).then((res) => {
          if (res.status === 200 && res.data) {
            res.data.forEach((affairPythagoreAffairRelation) => {
              if (affairPythagoreAffairRelation.pythagore_affaires_id)
                if (typeof affairPythagoreAffairRelation.pythagore_affaires_id === 'string')
                  pythagoreAffairIds.push(affairPythagoreAffairRelation.pythagore_affaires_id);
                else if (affairPythagoreAffairRelation.pythagore_affaires_id.numero_affaire) {
                  pythagoreAffairIds.push(affairPythagoreAffairRelation.pythagore_affaires_id.numero_affaire);
                }
            });
          }
          if (pythagoreAffairIds.length > 0) {
            getGdpPythagoreFactures({
              filter: {
                num_affaire: { _in: pythagoreAffairIds },
              },
              limit: 3,
            }).then((res) => {
              if (res.status === 200 && res.data) {
                setAffairInvoices(res.data);
              } else setAffairInvoices([]);
            });
          } else setAffairInvoices([]);
        });
      }
    } else {
      setAffairInvoices([]);
    }
  }, [affair.pythagore_ids]);

  useEffect(() => {
    getGdpFiles({
      filter: {
        projects_id: { _eq: affair.id },
      },
    }).then((res) => {
      if (res.status === 200 && res.data) {
        setFiles(res.data);
      } else setFiles([]);
    });
  }, [affair.id]);

  useEffect(() => {
    if (affair) {
      getGdpSatisfactions({
        filter: {
          affairs_id: { _eq: affair.id },
        },
      }).then((res) => {
        if (res.status === 200 && res.data) setAffairSatisfactions(res.data);
        else setAffairSatisfactions([]);
      });
    } else {
      setAffairSatisfactions([]);
    }
  }, [affair]);

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
            <QuickActionCard title="Complétez l'affaire" progress={progressPercentage}>
              Remplissez l&apos;affaire pour profiter pleinement de toutes les fonctionnalités
            </QuickActionCard>
          </Grid>
        </QuickAccessWidget>
        <PhasesWidget phases={affairPhases} onNewPhaseClick={() => console.log('open modal ?')} />
        <section>
          <Grid type="narrow">
            <ClientTeamWidget
              users={affairClients}
              clientCompany={{ name: 'Client' }}
              onAddClientClick={() => console.log('open modal ?')}
            />
            <CollaboratorTeamWidget
              type="affair"
              users={affairManagers}
              companyEntity={'company'}
              onAddCollaboratorClick={() => console.log('open modal ?')}
            />
          </Grid>
        </section>
        <section>
          <Grid type="narrow">
            <ActivitiesWidget activities={affairActivities} />
            <BillingWidget invoices={affairInvoices} onConfigureBillingClick={() => console.log('open modal ?')} />
          </Grid>
        </section>
        <section>
          <Grid type="narrow">
            <FilesWidget files={files} onNewFileClick={() => console.log('open modal ?')} />
            <SatisfactionWidget satisfactions={affairSatisfactions} />
          </Grid>
        </section>
      </div>
    </div>
  );
};

export default Affair;
