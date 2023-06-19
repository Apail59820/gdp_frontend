import React from 'react';
import styles from './ClientTeamCard.module.scss';
import { GdpProjectsModel } from '../../../models/GestionDeProjets/GdpProjectsModel';
import TeamCard, { TeamCardProps } from '../TeamCard/TeamCard';

export type ClientTeamCardProps = Omit<TeamCardProps, 'renderUserDetails' | 'aside'> & {
  clientCompany: Partial<GdpProjectsModel>;
};

const ClientTeamCard = (props: ClientTeamCardProps) => {
  const { clientCompany } = props;
  /* TODO: fetch client company entity to retrieve informations */
  const aside = (
    <section className={styles.clientCompanyDetails}>
      <h4 className={styles.title}>{clientCompany.client_company_name}</h4>
      <address className={styles.coordinates}>
        {clientCompany.address} <br />
        {clientCompany.zip_code} <br />
        {clientCompany.city} <br />
        {clientCompany.country} <br />
      </address>
    </section>
  );

  return <TeamCard {...props} aside={aside} />;
};

export default ClientTeamCard;
