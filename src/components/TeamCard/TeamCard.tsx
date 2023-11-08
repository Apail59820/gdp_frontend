import React, { useEffect, useState } from 'react';
import styles from './TeamCard.module.scss';
import { ShadowCard } from 'projex-ui';
import Link from 'next/link';
import { UsUserModel } from '../../../models/UsModels';
import {Dropdown, MenuProps, Tooltip} from 'antd';
import KebabMenuForCards from '../KebabMenuForCards/KebabMenuForCards';
import UserInformations from '../UserInformations/UserInformations';
import Image from 'next/image';
import { getAsset } from '../../../services/userService/UsAssets';
import { isRequestSuccessful } from '../../../utils/isRequestSuccessful';
import userPlaceholderPicto from '../../../public/user-solid.svg';

export type TeamCardProps = {
  users: Partial<UsUserModel>[];
  maxIcon?: number;
  allUsersPageHref: string;
  aside: React.ReactNode;
  onKebabMenuClick: React.MouseEventHandler<HTMLButtonElement>;
  dropDownItems?: MenuProps
};


const TeamCard = ({ users, maxIcon = 5, allUsersPageHref, aside, onKebabMenuClick, dropDownItems}: TeamCardProps) => {
  const [currentUser, setCurrentUser] = useState<Partial<UsUserModel>>(users[0]);
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!currentUser.avatar) return;
    getAsset(currentUser.avatar as string).then((res) => {
      if (isRequestSuccessful(res.status) && res.data) {
        setCurrentUserAvatar(res.data);
      }
    });
  }, [currentUser.avatar]);
  return (
    <ShadowCard>
      <div className={styles.teamCard}>
        <aside className={styles.aside}>{aside}</aside>
        <div className={styles.body}>
          <div className={styles.userDetails}>
            <UserInformations user={currentUser} avatar={currentUserAvatar} />
          </div>
          <ul className={styles.usersIconsContainer}>
            {users.slice(0, maxIcon).map((user: Partial<UsUserModel>) => (
              <li key={user.id} className={styles.user} onClick={() => setCurrentUser(user)}>
                <Tooltip title={`${user.first_name} ${user.last_name}`}>
                  <div className={styles.userIcon}>
                    <Image
                      fill={true}
                      src={currentUserAvatar || userPlaceholderPicto.src}
                      alt={`Photo de ${user.first_name} ${user.last_name}`}
                    />
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

          <KebabMenuForCards onClick={() => onKebabMenuClick} dropDownItems={dropDownItems}></KebabMenuForCards>

      </div>
    </ShadowCard>
  );
};
export default TeamCard;