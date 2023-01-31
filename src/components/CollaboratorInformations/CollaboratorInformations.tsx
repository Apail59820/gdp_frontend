import React from 'react';
import { CompanyEnum } from '../../../models/CompanyEnum';
import { UserModel } from '../../../models/UserModels';
import { capitalize } from '../../../utils/capitalize';
import styles from './CollaboratorInformations.module.scss';

type Props = {
  user: UserModel;
};

const CollaboratorInformations = ({ user }: Props) => {
  const { first_name, last_name, role, company, number, email } = user;

  const getColorByCompany = () => {
    switch (company?.toLowerCase()) {
      case CompanyEnum.AMEXIA:
        return styles.amexia;
      case CompanyEnum.DIAGOBAT:
        return styles.diagobat;
      case CompanyEnum.IMPERIUM:
        return styles.imperium;
      case CompanyEnum.PROBIM:
        return styles.probim;
      case CompanyEnum.PROJEX:
        return styles.projex;
      default:
        return styles.groupeProjex;
    }
  };

  return (
    <div className={styles.collaboratorInformations}>
      <h4 className={styles.name}>
        {first_name ? capitalize(first_name) : ''} {last_name ? capitalize(last_name) : ''}
      </h4>
      <span className={`${styles.job} ${getColorByCompany()}`}>
        {role ? capitalize(role) : ''}
        {role && company ? ' — ' : ''}
        {company ? capitalize(company) : ''}
      </span>
      <div className={styles.informations}>
        <a href={`tel:${number}`}>{number}</a>
        {email ? <a href={`mailto:${email}`}>{email}</a> : null}
      </div>
    </div>
  );
};

export default CollaboratorInformations;
