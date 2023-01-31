import React from 'react';
import styles from './ClientTeamCard.module.scss';
import { ProjectModel } from '../../../models/ProjectModel';
import { UserModel } from '../../../models/UserModels';
import TeamCard, { TeamCardProps } from '../TeamCard/TeamCard';

type Props = Omit<TeamCardProps, 'renderUserDetails' | 'aside'> & {
  clientCompany: ProjectModel;
};

const ClientTeamCard = (props: Props) => {
  const { clientCompany } = props;

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

  const renderUserDetails = (user: UserModel) => (
    <section className={styles.userDetailsContainer}>
      <span className={`text-small ${styles.title}`}>
        {user.first_name} {user.last_name}
      </span>
      <ul className={`small ${styles.coordinates}`}>
        {user.number ? (
          <li>
            <a href={`tel:${user.number}`}>{user.number}</a>
          </li>
        ) : null}
        {user.email ? (
          <li>
            <a href={`mailto:${user.email}`}>{user.email}</a>
          </li>
        ) : null}
      </ul>
    </section>
  );

  return <TeamCard {...props} aside={aside} renderUserDetails={renderUserDetails} />;
};

export default ClientTeamCard;
