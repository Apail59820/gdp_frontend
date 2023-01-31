import React, { useState } from 'react';
import styles from './TeamCard.module.scss';
import { ShadowCard } from '@projex/ui';
import Link from 'next/link';
import defaultImage from '../../../public/patrice.png';
import { UserModel } from '../../../models/UserModels';
import { Tooltip } from 'antd';
import KebabMenuForCards from '../KebabMenuForCards/KebabMenuForCards';

export type TeamCardProps = {
  users: UserModel[];
  maxIcon?: number;
  allUsersPageHref: string;
  aside: React.ReactNode;
  renderUserDetails: (user: UserModel) => React.ReactNode;
  onKebabMenuClick: React.MouseEventHandler<HTMLButtonElement>;
};

const TeamCard = ({
  users,
  maxIcon = 5,
  allUsersPageHref,
  aside,
  renderUserDetails,
  onKebabMenuClick,
}: TeamCardProps) => {
  const [currentUser, setCurrentUser] = useState<UserModel>(users[0]);

  return (
    <ShadowCard>
      <div className={styles.teamCard}>
        <aside className={styles.aside}>{aside}</aside>
        <div className={styles.body}>
          <div className={styles.userDetails}>
            <div className={styles.imageContainer}>
              <img
                src={currentUser?.avatar ? currentUser.avatar : defaultImage.src}
                alt={`Photo de profil de ${currentUser.first_name} ${currentUser.last_name}`}
                className={styles.contactAvatarImg}
              />
            </div>
            <div className={styles.details}>{renderUserDetails(currentUser)}</div>
          </div>
          <ul className={styles.usersIconsContainer}>
            {users.slice(0, maxIcon).map((user: UserModel) => (
              <li key={user.id} className={styles.user} onClick={() => setCurrentUser(user)}>
                <Tooltip title={`${user.first_name} ${user.last_name}`}>
                  <div className={styles.userIcon}>
                    <img src={user.avatar || defaultImage.src} alt={`Photo de ${user.first_name} ${user.last_name}`} />
                  </div>
                </Tooltip>
              </li>
            ))}
            {maxIcon < users.length ? (
              <li className={styles.user}>
                <Tooltip title="Voir toute l'équipe">
                  <Link href={allUsersPageHref}>
                    <div className={`text-tiny ${styles.linkIcon}`}>+{users.length - maxIcon}</div>
                  </Link>
                </Tooltip>
              </li>
            ) : null}
          </ul>
        </div>
        <KebabMenuForCards onClick={() => onKebabMenuClick}></KebabMenuForCards>
      </div>
    </ShadowCard>
  );
};

export default TeamCard;
