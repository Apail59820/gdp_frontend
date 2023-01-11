import React from 'react';
import styles from './UserCard.module.scss';
import { ShadowCard } from '@projex/ui';
import { UserModel } from '../../../models/UserModels';
import kebabMenu from '../../../public/ellipsis-vertical.svg';

type Props = {
  user: UserModel;
};

const UserCard = ({ user }: Props) => {
  const { first_name, last_name, role, company, email } = user;

  const getColorByCompany = () => {
    switch (company?.toLowerCase()) {
      case 'diagobat':
        return styles.green;
      default:
        return '';
    }
  };

  return (
    <ShadowCard>
      <div className={styles.userCard}>
        <div className={styles.imageContainer}>
          {/* TODO Render user profile picture */}
          <img src="" alt={`Photo de ${first_name} ${last_name}`} />
        </div>
        <div className={styles.content}>
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
        <button className={styles.kebabButton}>
          <img src={kebabMenu.src} alt={`Kebab menu for `} />
        </button>
      </div>
    </ShadowCard>
  );
};

export default UserCard;
