import React from 'react';
import styles from './ClientCard.module.scss';
import { useState } from 'react';
import { ShadowCard } from '@projex/ui';
import Img from './portraitA.png';
import { Tooltip } from 'antd';
import type { UserModel } from '../../../models/UserModels';
import type { ProjectModel } from '../../../models/ProjectModel';
import KebabMenuForCards from '../KebabMenuForCards/KebabMenuForCards';

type Props = {
  client: ProjectModel;
  users: UserModel[];
  maxIcon: number;
  // to define
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  // redirect to profiles
  hrefUser?: string;
};

const ClientCard = ({ client, users, maxIcon, onClick, hrefUser }: Props) => {
  const [current, setCurrent] = useState(0);
  const [nextCurrent, setNextCurrent] = useState<number | undefined>(undefined);

  const nextPerson = (key: number) => {
    key === 0 ? [setCurrent(key), setNextCurrent(undefined)] : setNextCurrent(key);
    setTimeout(() => {
      setNextCurrent(undefined);
      setCurrent(key);
    }, 300);
  };

  return (
    <>
      {/* <div className={styles.containerClientCard}> */}
      <ShadowCard width="40rem" height="12rem">
        <div className={styles.clientCard}>
          <section className={styles.clientDetails}>
            <h1 className={styles.title}>{client.client_company_name}</h1>
            <span className={styles.adress}>{client.address}</span>
            <span className={styles.adress}>{client.zip_code}</span>
            <span className={styles.adress}>{client.city}</span>
            <span className={styles.adress}>{client.country}</span>
          </section>
          <div>
            <div className={styles.slider}>
              <section className={`${styles.sliderContent} ${nextCurrent !== undefined ? styles.slideAnime : ''}`}>
                <div className={styles.container}>
                  <div className={styles.contactAvatar}>
                    <img
                      src={users[current]?.avatar ? users[current].avatar : Img.src}
                      alt={users[current]?.avatar ? '' : 'image contact'}
                      className={styles.contactAvatarImg}
                    />
                  </div>
                  <div>
                    <div className={styles.clientName}>
                      {users[current]?.first_name?.toUpperCase()} {users[current]?.last_name?.toUpperCase()}
                    </div>
                    <div>{users[current]?.number}</div>
                    {/* second phone number to added in the table */}
                    {/* <div >{contacts[current]?.number}</div> */}
                    <span>{users[current]?.email}</span>
                  </div>
                </div>
                {nextCurrent && (
                  <div className={styles.container}>
                    <div className={styles.contactAvatar}>
                      <img
                        src={users[nextCurrent]?.avatar ? users[nextCurrent].avatar : Img.src}
                        alt={users[nextCurrent]?.avatar ? '' : 'image contact'}
                        className={styles.contactAvatarImg}
                      />
                    </div>
                    <div>
                      <div className={styles.clientName}>
                        {users[nextCurrent]?.first_name?.toUpperCase()} {users[current]?.last_name?.toUpperCase()}
                      </div>
                      <div>{users[nextCurrent]?.number}</div>
                      {/* second phone number to added in the table */}
                      {/* <div >{contacts[nextCurrent]?.number}</div> */}
                      <span>{users[nextCurrent]?.email}</span>
                    </div>
                  </div>
                )}
              </section>
            </div>

            <div className={styles.containerClientIcons}>
              {users.map((e: UserModel, key: number) => {
                if (key < maxIcon) {
                  return (
                    <Tooltip placement="bottomLeft" title={e.first_name + ' ' + e.last_name}>
                      <img
                        onClick={() => nextPerson(key)}
                        key={key}
                        src={users[current]?.avatar ? users[current].avatar : Img.src}
                        alt={users[current]?.avatar ? '' : 'image contact'}
                        className={styles.contactIconBtn}
                      ></img>
                    </Tooltip>
                  );
                }
              })}
              {users.length > maxIcon && (
                <button className={styles.contactIconBtn} onClick={() => hrefUser}>
                  <span className={styles.contactIconBtnTxt}>{'+' + `${users.length - maxIcon}`}</span>
                </button>
              )}
            </div>
          </div>
          <KebabMenuForCards onClick={() => onClick}></KebabMenuForCards>
        </div>
      </ShadowCard>
      {/* </div> */}
    </>
  );
};

export default ClientCard;
