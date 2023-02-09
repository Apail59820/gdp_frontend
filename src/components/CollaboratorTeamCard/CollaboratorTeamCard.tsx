import React from 'react';
import styles from './CollaboratorTeamCard.module.scss';
import TeamCard, { TeamCardProps } from '../TeamCard/TeamCard';
import { getImagesByCompany } from '../../../utils/getImagesByCompany';
import { CompanyEnum } from '../../../models/UserService/UsCompanyEntityModel';

export type CollaboratorTeamCardProps = Omit<TeamCardProps, 'renderUserDetails' | 'aside'> & {
  companyEntity: CompanyEnum;
};

const CollaboratorTeamCard = (props: CollaboratorTeamCardProps) => {
  const { companyEntity } = props;
  const aside = (
    <figure className={styles.logoContainer}>
      <img src={getImagesByCompany(companyEntity).logo} alt={`Logo de ${companyEntity}`} />
    </figure>
  );

  return <TeamCard {...props} aside={aside} />;
};

export default CollaboratorTeamCard;
