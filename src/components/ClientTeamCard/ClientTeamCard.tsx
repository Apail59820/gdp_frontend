import React from 'react';
import styles from './ClientTeamCard.module.scss';
import TeamCard, { TeamCardProps } from '../TeamCard/TeamCard';
import { UsClientsCompanyEntitiesModel } from '../../../models/UserService/UsClientsCompanyEntitiesModel';

export type ClientTeamCardProps = Omit<TeamCardProps, 'renderUserDetails' | 'aside'> & {
  clientCompany: Partial<UsClientsCompanyEntitiesModel>;
};

const ClientTeamCard = (props: ClientTeamCardProps) => {
  const { clientCompany } = props;
  /* TODO: fetch client company entity to retrieve informations */
  const aside = (
    <section className={styles.clientCompanyDetails}>
      <h4 className={styles.title}>{clientCompany.name}</h4>
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
