import React from 'react';
import { UserModel } from '../../../models/UserModels';
import styles from './CollaboratorInformations.module.scss';

type Props = {
  user: UserModel;
};

const CollaboratorInformations = ({ user }: Props) => {
  const { first_name, last_name, role, company, email } = user;

  const getColorByCompany = () => {
    // TODO Set colors by company
    switch (company?.toLowerCase()) {
      case 'diagobat':
        return styles.green;
      default:
        return '';
    }
  };

  return (
    <div className={styles.collaboratorInformations}>
      <h4 className={styles.name}>
        {first_name} {last_name}
      </h4>
      <span className={`${styles.job} ${getColorByCompany()}`}>
        {role}
        {role && company ? ' — ' : ''}
        {company}
      </span>
      <div className={styles.informations}>
        {/* TODO Add tel */}
        <a href="tel:">tel</a>
        {email ? <a href={`mailto:${email}`}>{email}</a> : null}
      </div>
    </div>
  );
};

export default CollaboratorInformations;
