import React from 'react';
import styles from './UserInformations.module.scss';
import { UsUserModel } from '../../../models/UsModels';
import { getImagesByCompany } from '../../../utils/getImagesByCompany';
import { capitalize } from '../../../utils/capitalize';
import Link from 'next/link';

export type UserInformationsProps = {
  user: Partial<UsUserModel>;
};

const UserInformations = ({ user }: UserInformationsProps) => {
  const { first_name, last_name, title, company, number, email } = user;

  const getColorByCompany = () => {
    // switch (company?.toLowerCase()) {
    //   case CompanyEnum.AMEXIA:
    //     return styles.amexia;
    //   case CompanyEnum.DIAGOBAT:
    //     return styles.diagobat;
    //   case CompanyEnum.IMPERIUM:
    //     return styles.imperium;
    //   case CompanyEnum.PROBIM:
    //     return styles.probim;
    //   case CompanyEnum.PROJEX:
    //     return styles.projex;
    //   default:
    //     return styles.groupeProjex;
    // }
    return styles.groupeProjex;
  };

  return (
    <div className={styles.userInformations}>
      {/* TODO Render user profile picture */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.image}
        src={user.avatar ?? getImagesByCompany(user.company!).picto}
        alt={`Photo de ${user.first_name} ${user.last_name}`}
      />
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
