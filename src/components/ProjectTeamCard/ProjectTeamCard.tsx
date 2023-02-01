import React from 'react';
import styles from './ProjectTeamCard.module.scss';
import TeamCard, { TeamCardProps } from '../TeamCard/TeamCard';
import type { UserModel } from '../../../models/UserModels';
import CollaboratorInformations from '../CollaboratorInformations/CollaboratorInformations';
import { getImagesByCompany } from '../../../utils/getImagesByCompany';
import { CompanyEnum } from '../../../models/CompanyEnum';

export type ProjectTeamCardProps = Omit<TeamCardProps, 'renderUserDetails' | 'aside'> & {
  companyEntity: CompanyEnum;
};

const ProjectTeamCard = (props: ProjectTeamCardProps) => {
  const { companyEntity } = props;
  const aside = (
    <figure className={styles.logoContainer}>
      <img src={getImagesByCompany(companyEntity).logo} alt={`Logo de ${companyEntity}`} />
    </figure>
  );

  const renderUserDetails = (user: UserModel) => <CollaboratorInformations user={user} />;

  return <TeamCard {...props} aside={aside} renderUserDetails={renderUserDetails} />;
};

export default ProjectTeamCard;
