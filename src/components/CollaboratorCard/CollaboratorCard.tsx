import React from 'react';
import styles from './CollaboratorCard.module.scss';
import { ShadowCard } from '@projex/ui';
import { UserModel } from '../../../models/UserModels';
import kebabMenu from '../../../public/ellipsis-vertical.svg';
import CollaboratorInformations from '../CollaboratorInformations/CollaboratorInformations';
import { getImagesByCompany } from '../../../utils/getImagesByCompany';

type Props = {
  user: UserModel;
};

const CollaboratorCard = ({ user }: Props) => {
  // TODO Handle profile picture
  const PROFILE_PICTURE = undefined;

  return (
    <ShadowCard>
      <div className={styles.collaboratorCard}>
        {/* TODO Render user profile picture */}
        <img
          className={styles.image}
          src={getImagesByCompany(user.company?.toLowerCase()).picto}
          alt={`Photo de ${user.first_name} ${user.last_name}`}
        />
        <CollaboratorInformations user={user} />
        {/* TODO Handle button */}
        <button className={styles.kebabButton}>
          <img src={kebabMenu.src} alt={`Kebab menu for `} />
        </button>
      </div>
    </ShadowCard>
  );
};

export default CollaboratorCard;
