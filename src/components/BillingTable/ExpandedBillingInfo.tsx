import React, { useEffect, useState } from 'react';
import { GdpPythagoreFactureModel } from '../../../models/GestionDeProjets/GdpPythagoreFactureModel';
import styles from './ExpandedBillingInfo.module.scss';
import { Button } from 'projex-ui';
import { DateTime, Interval } from 'luxon';
import { message, Modal } from 'antd';
import getConfig from 'next/config';
import { InvoiceStateEnum } from './BillingTable';
import { useSelector } from 'react-redux';
import { selectUserProfile } from '../../../store/reducers/authReducer';
import { createGdpEmailLogs } from '../../../services/gestionDeProjets/GdpEmailsLogs';
import { messages } from '../../../constants/messages';
import { GdpAffairsUsersModel } from '../../../models/GestionDeProjets/GdpAffairsUsersModel';
import { getGdpPythagoreAffaire } from '../../../services/gestionDeProjets/GdpPythagoreAffairs';
import { getGdpAffairPythagoreAffair } from '../../../services/gestionDeProjets/GdpAffairsPythagoreAffairs';
import { getUsUsers } from '../../../services/userService/UsUsers';
import { getGdpAffairsUsers } from '../../../services/gestionDeProjets/GdpAffairsUsers';
import { getGdpProjectById } from '../../../services/gestionDeProjets/GdpProjects';
import { GdpProjectsClientsModel } from '../../../models/GestionDeProjets/GdpProjectsClientsModel';
import { getGdpProjectsUsersClients } from '../../../services/gestionDeProjets/GdpProjectsUsersClients';
import Link from 'next/link';

const { publicRuntimeConfig } = getConfig();

type props = {
  billing: Partial<GdpPythagoreFactureModel>;
  colorClassName: string;
  invoiceState: InvoiceStateEnum;
};

const ExpandedBillingInfo = ({ billing, colorClassName, invoiceState }: props) => {
  const {
    num_facture,
    montant_totalht_facture,
    montant_totalttc_facture,
    reglement_cumuleht_facture,
    reglement_cumulettc_facture,
    soldettc_facture,
    soldeht_facture,
    emails_logs,
    num_affaire,
    etatreglt_facture,
    date_echeance_facture,
    nom_fichierpdf_facture,
  } = billing;

  const [clientsEmails, setClientsEmails] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [typeRelance, setTypeRelance] = useState<'manual' | 'auto'>('manual');
  const [timeSinceLastMail, setTimeSinceLastMail] = useState<number | null>(0);
  const [userCanSendMail, setUserCanSendMail] = useState<boolean>(false);

  const myUser = useSelector(selectUserProfile);

  const isCollaborator = myUser?.role == publicRuntimeConfig.ROLE_COLLABORATOR_ID;
  const TIME_BETWEEN_FACTURES_EMAILS_ALERTS =
    publicRuntimeConfig.DIGITAL_SOLUTIONS_TIME_BETWEEN_FACTURES_EMAILS_ALERTS || 72;

  async function retrieveFacturesEmailsAlerts() {
    if (emails_logs && emails_logs.length > 0 && typeof emails_logs[0] !== 'number') {
      setTimeSinceLastMail(
        Interval.fromDateTimes(DateTime.fromJSDate(emails_logs[0].date_created), DateTime.now()).length('hours'),
      );
    } else setTimeSinceLastMail(null);
  }

  async function declareManualFactureEmailAlert() {
    if (!num_facture) return;
    const subject = `Relance paiement facture ${num_facture}`;
    const body = `Bonjour%2C%0D%0A%0D%0ANous%20vous%20informons%20que%20votre%20facture%2C%20numéro%20"${num_facture}"%20arrivée%20à%20échéance%20le%20${date_echeance_facture}%2C%20d'un%20montant%20de%20${soldeht_facture}%20€HT%20soit%20${soldettc_facture}%20€TTC%20%20n'a%20pas%20été%20réglée.`;
    window.open(`mailto:${clientsEmails?.join(',')}?subject=${subject}&body=${body}`, '_blank');
    const factureEmailAlertResponse = await createGdpEmailLogs({
      subject: subject,
      content: body,
      facture_id: num_facture,
      recipients: clientsEmails,
      status: 'draft',
      type: 'invoice_manual_alert',
    });
    if (factureEmailAlertResponse.status == 200) {
      message.success(messages.reminder.success);
      setTimeSinceLastMail(0);
    } else message.error(messages.reminder.error);
  }

  async function sendAutomaticFactureEmailAlert() {
    if (!num_facture) return;
    const factureEmailAlertResponse = await createGdpEmailLogs({
      subject: `Votre relance Digital Solutions pour la facture ${num_facture}`,
      content: `Ce message est une relance automatique car une facture est en attente de régularisation. Nous vous informons
        que votre facture ${num_facture}, arrivée à échéance le ${date_echeance_facture}, d'un montant de ${soldeht_facture} €HT soit ${soldettc_facture} €TTC est en
        attente de paiement. Nous vous remercions par avance pour la régularisation de cette facture et restons à
        votre entière disposition. Si le versement a été effectué dans l'intervalle de ce mail, merci de ne pas tenir compte
        de cette relance. A très vite sur votre espace ${publicRuntimeConfig.APP_NAME}. Cordialement,Groupe Projex`,
      facture_id: num_facture,
      recipients: clientsEmails,
      status: 'draft',
      type: 'invoice_manual_alert',
    });
    if (factureEmailAlertResponse.status == 200) {
      message.success(messages.reminder.success);
      setTimeSinceLastMail(0);
    } else message.error(messages.reminder.error);
  }

  const getButtonColor = () =>
    invoiceState === 'late' ? 'alert' : invoiceState === 'soonToExpire' ? 'warning' : 'primary';

  useEffect(() => {
    if (num_facture && isCollaborator) {
      retrieveFacturesEmailsAlerts();
    }
  }, [num_facture, isCollaborator]);

  useEffect(() => {
    async function fetchData() {
      if (num_affaire && isCollaborator) {
        try {
          let res;
          if (typeof num_affaire === 'string') {
            res = await getGdpPythagoreAffaire(num_affaire);
          } else {
            res = { status: 200, data: num_affaire };
          }
          if (res.status === 200 && res.data) {
            if (res.data.affairs_id && res.data.affairs_id[0] && typeof res.data.affairs_id[0] === 'number') {
              const affairRes = await getGdpAffairPythagoreAffair(res.data.affairs_id[0]);
              if (
                affairRes.status === 200 &&
                affairRes.data &&
                affairRes.data.affairs_id &&
                typeof affairRes.data.affairs_id !== 'number'
              ) {
                const affair = affairRes.data.affairs_id;
                if (affair) {
                  const users: Partial<GdpAffairsUsersModel>[] = [];
                  const usersId: number[] = [];

                  affair.affairs_directus_users_ids.forEach((adu) => {
                    if (typeof adu !== 'number') {
                      users.push(adu);
                    } else {
                      usersId.push(adu);
                    }
                  });
                  if (usersId.length > 0) {
                    const usersResponse = await getGdpAffairsUsers({ filter: { id: { _in: usersId } } });
                    if (usersResponse.status === 200 && usersResponse.data) {
                      usersResponse.data.forEach((user) => {
                        users.push(user);
                      });
                    }
                  }
                  setUserCanSendMail(
                    users.filter((adu: Partial<GdpAffairsUsersModel>) => adu.directus_users_id === myUser?.id).length >
                      0,
                  );
                  if (affair.projects_id) {
                    const projectsDirectusUsersClients: Array<number | GdpProjectsClientsModel> = [];
                    if (typeof affair.projects_id !== 'number') {
                      affair.projects_id.projects_directus_users_clients_ids.forEach((user) =>
                        projectsDirectusUsersClients.push(user),
                      );
                    } else {
                      const projectRes = await getGdpProjectById(affair.projects_id);
                      if (
                        projectRes.status === 200 &&
                        projectRes.data &&
                        projectRes.data.projects_directus_users_clients_ids
                      ) {
                        projectRes.data.projects_directus_users_clients_ids.forEach((user) => {
                          projectsDirectusUsersClients.push(user);
                        });
                      }
                    }
                    const clientsResponse: string[] = [];
                    const pducIds: number[] = [];
                    const clientsId: string[] = [];

                    projectsDirectusUsersClients.forEach((pduc) => {
                      if (typeof pduc !== 'number') {
                        if (typeof pduc.directus_users_id !== 'string') {
                          pduc.directus_users_id.email && clientsResponse.push(pduc.directus_users_id.email);
                        } else {
                          clientsId.push(pduc.directus_users_id);
                        }
                      } else {
                        pducIds.push(pduc);
                      }
                    });
                    if (pducIds.length > 0) {
                      const pducResponse = await getGdpProjectsUsersClients({ filter: { id: { _in: pducIds } } });
                      if (pducResponse.status === 200 && pducResponse.data) {
                        pducResponse.data.forEach((pduc) => {
                          if (pduc.directus_users_id) {
                            if (typeof pduc.directus_users_id !== 'string') {
                              pduc.directus_users_id.email && clientsResponse.push(pduc.directus_users_id.email);
                            } else {
                              clientsId.push(pduc.directus_users_id);
                            }
                          }
                        });
                      }
                    }
                    if (clientsId.length > 0) {
                      const response = await getUsUsers({ filter: { id: { _in: clientsId } } });
                      if (response.status === 200 && response.data) {
                        response.data.forEach((client) => {
                          if (client.email) clientsResponse.push(client.email);
                        });
                      }
                    }
                    setClientsEmails(clientsResponse);
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    }

    fetchData();
  }, [num_affaire, isCollaborator, myUser]);

  return (
    <div className={styles.globalContainer}>
      <div className={styles.container}>
        <div className={styles.amountContainer}>
          {(montant_totalht_facture || montant_totalttc_facture) && (
            <div>
              {montant_totalht_facture && (
                <span>
                  Montant total HT <span className={colorClassName}>{montant_totalht_facture} €</span>
                </span>
              )}
              {montant_totalttc_facture && (
                <span>
                  Montant total TTC <span className={colorClassName}>{montant_totalttc_facture} €</span>
                </span>
              )}
            </div>
          )}
          {(reglement_cumuleht_facture || reglement_cumulettc_facture) && (
            <div>
              {reglement_cumuleht_facture && (
                <span>
                  Règlement cumulé HT <span className={colorClassName}>{reglement_cumuleht_facture} €</span>
                </span>
              )}
              {reglement_cumulettc_facture && (
                <span>
                  Règlement cumulé TTC <span className={colorClassName}>{reglement_cumulettc_facture} €</span>
                </span>
              )}
            </div>
          )}
          {(soldeht_facture || soldettc_facture) && (
            <div>
              {soldeht_facture && (
                <span>
                  Solde HT <span className={colorClassName}>{soldeht_facture} €</span>
                </span>
              )}
              {soldettc_facture && (
                <span>
                  Solde TTC <span className={colorClassName}>{soldettc_facture} €</span>
                </span>
              )}
            </div>
          )}
        </div>
        <div>
          <b>Derniere relance:</b>{' '}
          {`${
            emails_logs &&
            emails_logs.length > 0 &&
            typeof emails_logs[0] !== 'number' &&
            DateTime.fromJSDate(emails_logs[0].date_created).toLocaleString()
              ? DateTime.fromJSDate(emails_logs[0].date_created).toLocaleString()
              : 'Aucune relance déclarée'
          }`}
        </div>
        <div className={styles.buttonContainer}>
          {etatreglt_facture !== 'Reglee' && isCollaborator && true && (
            <>
              <Modal open={isModalOpen} footer={null} closable={true} onCancel={() => setIsModalOpen(false)}>
                <div className={styles.modalBody}>
                  <b>
                    Voulez-vous vraiment relancer {typeRelance === 'manual' ? 'manuellement' : 'automatiquement'} le
                    client ?
                  </b>
                  <p>
                    {typeRelance == 'manual'
                      ? "Votre service de messagerie va s'ouvrir, un template sera écrit pour vous mais vous pourrez le modifier si besoin."
                      : 'Nous enverrons un message déjà écrit pour vous.'}
                  </p>
                  <div className={styles.modalButtons}>
                    <Button
                      small
                      onClick={() => {
                        {
                          typeRelance == 'manual' ? declareManualFactureEmailAlert() : sendAutomaticFactureEmailAlert();
                        }
                      }}
                    >
                      Envoyer une
                      {typeRelance == 'manual' ? ' relance manuelle' : ' relance automatique'}
                    </Button>
                    <Button small style={'alert'} onClick={() => setIsModalOpen(false)}>
                      Annuler
                    </Button>
                  </div>
                </div>
              </Modal>
              <Button
                small
                style={getButtonColor()}
                onClick={() => {
                  setIsModalOpen(true);
                  setTypeRelance('manual');
                }}
              >
                Relancer le client manuellement
              </Button>
              <Button
                small
                disabled={
                  emails_logs && timeSinceLastMail !== null && timeSinceLastMail < TIME_BETWEEN_FACTURES_EMAILS_ALERTS
                }
                onClick={() => {
                  setIsModalOpen(true);
                  setTypeRelance('auto');
                }}
              >
                Relancer le client automatiquement
                <br />
                {timeSinceLastMail == null || timeSinceLastMail > TIME_BETWEEN_FACTURES_EMAILS_ALERTS
                  ? publicRuntimeConfig.APP_NAME
                  : `désactivée (derniere relance il y a moins de ${TIME_BETWEEN_FACTURES_EMAILS_ALERTS} heures)`}
              </Button>
            </>
          )}
          {nom_fichierpdf_facture && (
            <Button small>
              <Link href={nom_fichierpdf_facture} download={nom_fichierpdf_facture}>
                Télécharger la facture {nom_fichierpdf_facture}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpandedBillingInfo;
