import React, { useEffect, useMemo, useState } from 'react';
import styles from './UserInformations.module.scss';
import { UsUserModel } from '../../../models/UsModels';
import { capitalize } from '../../../utils/capitalize';
import { CompanyEnum } from '../../../models/UsModels';
import Link from 'next/link';
import { getAsset } from '../../../services/userService/UsAssets';
import { isRequestSuccessful } from '../../../utils/isRequestSuccessful';
import userPlaceholderPicto from '../../../public/user-solid.svg';


export type UserInformationsProps = {
  user: Partial<UsUserModel>;
  avatar?: string | undefined;
};

const UserInformations = ({ user }: UserInformationsProps) => {
  const { avatar, first_name, last_name, title, company, number, email } = user;
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
      <img className={styles.image} src={currentUserAvatar || userPlaceholderPicto.src} alt={`Photo de ${user.first_name} ${user.last_name}`} />
      <div className={styles.informationsContainer}>
        <Link href={`/users/${user.id}`}>
          <h4 className={styles.name}>
            {user?.first_name ? capitalize(user.first_name) : ''} {user?.last_name ? capitalize(user.last_name) : ''}
          </h4>
        </Link>
        <span className={`${styles.job} ${getColorByCompany()}`}>
          {title ? capitalize(title) : ''}
          {title && company ? ' — ' : ''}
          {company ? capitalize(company) : ''}
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
