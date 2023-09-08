import React, { useEffect, useState } from 'react';
import styles from './UserInformations.module.scss';
import { UsUserModel } from '../../../models/UsModels';
import { capitalize } from '../../../utils/capitalize';
import { CompanyEnum } from '../../../models/UsModels';
import Link from 'next/link';
import { getAsset } from '../../../services/userService/UsAssets';
import { isRequestSuccessful } from '../../../utils/isRequestSuccessful';
import getConfig from 'next/config';

export type UserInformationsProps = {
  user: Partial<UsUserModel>;
  avatar?: string | undefined;
};

const UserInformations = ({ user }: UserInformationsProps) => {
  const { publicRuntimeConfig } = getConfig();

  const { avatar, title, company} = user;
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!avatar) return;
    getAsset(avatar as string).then((res) => {
      if (isRequestSuccessful(res.status) && res.data) {
        setCurrentUserAvatar(res.data);
      }
    });
  }, [avatar, user]);

  const getColorByCompany = () => {
    switch (company?.toLocaleLowerCase()) {
      case CompanyEnum.AMEXIA:
        return styles.amexia;
      case CompanyEnum.DIAGOBAT:
        return styles.diagobat;
      case CompanyEnum.IMPERIUM:
        return styles.imperium;
      case CompanyEnum.PROBIM:
        return styles.probim;
      case CompanyEnum.PROJEX:
        return styles.projex;
      default:
        return styles.groupeProjex;
    }
  };
  return (
    <div className={styles.userInformations}>
      <img className={styles.image} src={currentUserAvatar} alt={`Photo de ${user.first_name} ${user.last_name}`} />
      <div className={styles.informationsContainer}>
        <Link href={`${publicRuntimeConfig.USER_SERVICE_URL}/user/${user.id}`}>
          <h4 className={styles.name}>
            {user?.first_name ? capitalize(user.first_name) : ''} {user?.last_name ? user.last_name.toUpperCase() : ''}
          </h4>
        </Link>
        <span className={`${styles.job} ${getColorByCompany()}`}>
          {title ? capitalize(title) : ''}
          {title && company ? ' — ' : ''}
          {company ? company.toUpperCase() : ''}
        </span>
        <ul className={`small ${styles.informations}`}>
          {user?.number ? (
            <a href={`tel:${user.number}`}>
              <li>{user.number}</li>
            </a>
          ) : null}
          {user?.email ? (
            <a href={`mailto:${user.email}`}>
              <li>{user.email}</li>
            </a>
          ) : null}
        </ul>
      </div>
    </div>
  );
};

export default UserInformations;
