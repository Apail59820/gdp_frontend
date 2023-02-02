import React from 'react';
import styles from './ManagerCard.module.scss';
import { getImagesByCompany } from '../../../utils/getImagesByCompany';
import { UsUserModel } from '../../../models/UserService/UsUserModel';
import { ShadowCard } from '@projex/ui';
import CollaboratorInformations from '../CollaboratorInformations/CollaboratorInformations';
import KebabMenuForCards from '../KebabMenuForCards/KebabMenuForCards';

type Props = {
  user: UsUserModel;
  onKebabMenuClick: React.MouseEventHandler<HTMLButtonElement>;
};

const ManagerCard = ({ user, onKebabMenuClick }: Props) => {
  return (
    <ShadowCard>
      <div className={styles.managerCard}>
        <img
          className={styles.image}
          // TODO Si user a une photo de profil, la mettre en src, sinon utiliser getInformationsByCompany()
          src={getImagesByCompany(user.company).logo}
          alt={`Photo de ${user.first_name} ${user.last_name}`}
        />
        <div className={styles.content}>
          <h4 className={styles.title}>Chef de projet</h4>
          <CollaboratorInformations user={user} />
        </div>
        <KebabMenuForCards onClick={onKebabMenuClick} />
      </div>
    </ShadowCard>
  );
};

export default ManagerCard;
