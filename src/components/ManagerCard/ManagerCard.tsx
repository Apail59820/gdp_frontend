import React from 'react';
import styles from './ManagerCard.module.scss';
import { getImagesByCompany } from '../../../utils/getImagesByCompany';
import { UserModel } from '../../../models/UserModels';
import { ShadowCard } from '@projex/ui';
import CollaboratorInformations from '../CollaboratorInformations/CollaboratorInformations';

type Props = {
  user: UserModel;
};

const ManagerCard = ({ user }: Props) => {
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
      </div>
    </ShadowCard>
  );
};

export default ManagerCard;
