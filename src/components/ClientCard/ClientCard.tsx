import React, { useEffect } from 'react';
import styles from './ClientCard.module.scss';
import { useState } from 'react';
import { ShadowCard } from '@projex/ui';
import Img from '../../../public/patrice.png';
import { Tooltip } from 'antd';
import type { UserModel } from '../../../models/UserModels';
import type { ProjectModel } from '../../../models/ProjectModel';
import KebabMenuForCards from '../KebabMenuForCards/KebabMenuForCards';

type Props = {
  client: ProjectModel;
  users: UserModel[];
  maxIcon: number;
  onKebabMenuClick?: React.MouseEventHandler<HTMLButtonElement>;
  // redirect to profiles
  hrefUser?: string;
};

const ClientCard = ({ client, users, maxIcon, onKebabMenuClick, hrefUser }: Props) => {
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
                  {currentUser?.first_name?.toUpperCase()} {currentUser?.last_name?.toUpperCase()}
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
            {users.map((user) => (
              <Tooltip key={user.id} title={`${user.first_name} ${user.last_name}`}>
                <li className={styles.user} onClick={() => setCurrentUser(user)}>
                  <div className={styles.userIcon}>
                    <img src={Img.src} alt={`Photo de ${user.first_name} ${user.last_name}`} />
                  </div>
                </li>
              </Tooltip>
            ))}
          </ul>
        </div>
        <KebabMenuForCards onClick={() => onKebabMenuClick}></KebabMenuForCards>
      </div>
    </ShadowCard>
  );
};

export default ClientCard;
