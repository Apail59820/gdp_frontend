import React from 'react';
import styles from './UserCard.module.scss';
import { ShadowCard } from '@projex/ui';
import UserInformations, { UserInformationsProps } from '../UserInformations/UserInformations';
import KebabMenuForCards from '../KebabMenuForCards/KebabMenuForCards';

type Props = UserInformationsProps & {
  onKebabMenuClick: React.MouseEventHandler<HTMLButtonElement>;
};

const UserCard = ({ user, onKebabMenuClick }: Props) => {
  return (
    <ShadowCard>
      <div className={styles.userInformationsContainer}>
        <UserInformations user={user} />
        <KebabMenuForCards onClick={onKebabMenuClick} />
      </div>
    </ShadowCard>
  );
};

export default UserCard;
