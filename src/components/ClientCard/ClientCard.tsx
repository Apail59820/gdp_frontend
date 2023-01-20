import React, { useState } from 'react';
import styles from './ClientCard.module.scss';
import { ShadowCard } from '@projex/ui';
import Img from '../../../public/patrice.png';
import { Tooltip } from 'antd';
import type { UserModel } from '../../../Models/UserModels';
import type { ProjectModel } from '../../../Models/ProjectModel';
import KebabMenuForCards from '../KebabMenuForCards/KebabMenuForCards';
import Link from 'next/link';

type Props = {
  client: ProjectModel;
  users: UserModel[];
  maxIcon: number;
  onKebabMenuClick?: React.MouseEventHandler<HTMLButtonElement>;
  clientPageHref: string;
};

const ClientCard = ({ client, users, maxIcon, onKebabMenuClick, clientPageHref }: Props) => {
  const [currentUser, setCurrentUser] = useState<UserModel>(users[0]);

  return (
    <ShadowCard>
      <div className={styles.clientCard}>
        <section className={styles.clientDetails}>
          <h4 className={styles.title}>{client.client_company_name}</h4>
          <address className={styles.contentClientDetails}>
            {client.address} <br />
            {client.zip_code} <br />
            {client.city} <br />
            {client.country} <br />
          </address>
        </section>
        <div className={styles.userDetails}>
          <div className={styles.sliderContainer}>
            <div className={styles.slider}>
              <div className={styles.imageContainer}>
                <img
                  src={currentUser?.avatar ? currentUser.avatar : Img.src}
                  alt={currentUser?.avatar ? '' : 'image contact'}
                  className={styles.contactAvatarImg}
                />
              </div>
              <div className={styles.userInformations}>
                <h5 className={styles.userName}>
                  {/* TODO Rediriger vers le profil de l'user */}
                  <Link href={'/'}>
                    {currentUser?.first_name?.toUpperCase()} {currentUser?.last_name?.toUpperCase()}
                  </Link>
                </h5>
                <ul className={styles.userCoordinates}>
                  <li>{currentUser?.number}</li>
                  {/* second phone number to added in the table */}
                  {/* <div >{contacts[current]?.number}</div> */}
                  <li>{currentUser?.email}</li>
                </ul>
              </div>
            </div>
          </div>
          <ul className={styles.usersIconsContainer}>
            {users.slice(0, maxIcon).map((user) => (
              <li key={user.id} className={styles.user} onClick={() => setCurrentUser(user)}>
                <Tooltip title={`${user.first_name} ${user.last_name}`}>
                  <div className={styles.userIcon}>
                    <img src={Img.src} alt={`Photo de ${user.first_name} ${user.last_name}`} />
                  </div>
                </Tooltip>
              </li>
            ))}
            {maxIcon < users.length ? (
              <li className={styles.user}>
                <Tooltip title="Voir toute l'équipe">
                  <Link href={clientPageHref}>
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

export default ClientCard;
