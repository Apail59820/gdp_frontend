import React, { useEffect, useState } from 'react';
import styles from './TeamCard.module.scss';
import { ShadowCard } from 'projex-ui';
import Link from 'next/link';
import { UsUserModel } from '../../../models/UsModels';
import {MenuProps, Tooltip} from 'antd';
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
  dropDownItems?: MenuProps;
  displayKebabMenu?: boolean;
};


const TeamCard = ({ users, maxIcon = 5, allUsersPageHref, aside, onKebabMenuClick, dropDownItems, displayKebabMenu}: TeamCardProps) => {
  const [currentUser, setCurrentUser] = useState<Partial<UsUserModel>>(users[0]);
  const [usersWithAvatar, setUsersWithAvatar] = useState<Partial<UsUserModel>[]>([]);
  useEffect(() => {
    const fetchUserAvatars = async () => {
      try {
        const avatarPromises = users.map(async (user) => {
          const avatarResponse = await getAsset(user.avatar as string);
          if (isRequestSuccessful(avatarResponse.status) && avatarResponse.data) {
            return {
              ...user,
              avatar: avatarResponse.data,
            };
          } else {
            return {...user, avatar: userPlaceholderPicto.src}
          }
        });
        const usersWithAvatars = await Promise.all(avatarPromises);
        setUsersWithAvatar(usersWithAvatars);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserAvatars();
  }, [users]);

  return (
      <ShadowCard>
        <div className={styles.teamCard}>
          <aside className={styles.aside}>{aside}</aside>
          <div className={styles.body}>
            <div className={styles.userDetails}>
              <UserInformations user={currentUser} />
            </div>
            <ul className={styles.usersIconsContainer}>
              {usersWithAvatar.slice(0, maxIcon).map((user: Partial<UsUserModel>) => (
                  <li key={user.id} className={styles.user} onClick={() => setCurrentUser(user)}>
                    <Tooltip title={`${user.first_name} ${user.last_name}`}>
                      <div className={styles.userIcon}>
                        <Image
                            fill={true}
                            src={user.avatar}
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

          {displayKebabMenu && (
              <KebabMenuForCards onClick={() => onKebabMenuClick} dropDownItems={dropDownItems}></KebabMenuForCards>
          )}
        </div>
      </ShadowCard>
  );
};
export default TeamCard;