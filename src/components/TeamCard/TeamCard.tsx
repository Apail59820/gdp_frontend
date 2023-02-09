import React, { useState } from 'react';
import styles from './TeamCard.module.scss';
import { ShadowCard } from '@projex/ui';
import Link from 'next/link';
import defaultImage from '../../../public/patrice.png';
import { Tooltip } from 'antd';
import KebabMenuForCards from '../KebabMenuForCards/KebabMenuForCards';
import UserInformations from '../UserInformations/UserInformations';
import { getImagesByCompany } from '../../../utils/getImagesByCompany';
import { UsUserModel } from '../../../models/UserService/UsUserModel';

export type TeamCardProps = {
  users: UsUserModel[];
  maxIcon?: number;
  allUsersPageHref: string;
  aside: React.ReactNode;
  onKebabMenuClick: React.MouseEventHandler<HTMLButtonElement>;
};

const TeamCard = ({ users, maxIcon = 5, allUsersPageHref, aside, onKebabMenuClick }: TeamCardProps) => {
  const [currentUser, setCurrentUser] = useState<UsUserModel>(users[0]);

  return (
    <ShadowCard>
      <div className={styles.teamCard}>
        <aside className={styles.aside}>{aside}</aside>
        <div className={styles.body}>
          <div className={styles.userDetails}>
            <UserInformations user={currentUser} />
          </div>
          <ul className={styles.usersIconsContainer}>
            {users.slice(0, maxIcon).map((user) => (
              <li key={user.id} className={styles.user} onClick={() => setCurrentUser(user)}>
                <Tooltip title={`${user.first_name} ${user.last_name}`}>
                  <div className={styles.userIcon}>
                    {/*<img*/}
                    {/*  src={user.avatar || getImagesByCompany(user.company).picto}*/}
                    {/*  alt={`Photo de ${user.first_name} ${user.last_name}`}*/}
                    {/*/>*/}
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
