import React, { useEffect, useMemo, useState } from 'react';
import { GdpSatisfactionModel } from '../../../models/GestionDeProjets/GdpSatisfactionModel';
import { Modal } from 'antd';
import styles from './DisplaySatisfaction.module.scss';
import { DateTime } from 'luxon';
import { UsUserModel } from '../../../models/UserService/UsUserModel';
import { selectUsers } from '../../../store/reducers/usersReducer';
import { useSelector } from 'react-redux';
import { getUsUser } from '../../../services/userService/UsUsers';
import { Button } from '@projex/ui';

interface DisplaySatisfactionProps {
  isOpen: boolean;
  handleClose: () => void;
  satisfaction: Partial<GdpSatisfactionModel>;
}

const DisplaySatisfactionSkill = ({
  type,
  indexSatisfaction,
}: {
  type: string;
  indexSatisfaction: number | undefined;
}) => {
  const displayEmoji = (indexSatisfaction: number | undefined) => {
    switch (indexSatisfaction) {
      case 0:
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16 0C7.125 0 0 7.1875 0 16C0 24.875 7.125 32 16 32C24.8125 32 32 24.875 32 16C32 7.1875 24.8125 0 16 0ZM16 31C7.6875 31 1 24.3125 1 16C1 7.75 7.6875 1 16 1C24.25 1 31 7.75 31 16C31 24.3125 24.25 31 16 31ZM16 18C9.625 18 8.5 23.375 8.5 23.4375C8.4375 23.6875 8.625 23.9375 8.875 24C9.125 24.0625 9.375 23.875 9.4375 23.625C9.5 23.4375 10.5 19 16 19C21.5 19 22.4375 23.4375 22.5 23.625C22.5 23.875 22.75 24 23 24H23.0625C23.3125 23.9375 23.5 23.6875 23.4375 23.4375C23.4375 23.375 22.3125 18 16 18ZM21 14C21.5 14 22 13.5625 22 13C22 12.5 21.5 12 21 12C20.4375 12 20 12.5 20 13C20 13.5625 20.4375 14 21 14ZM10.9375 14C11.5 14 12 13.5625 12 13C12 12.5 11.5 12 10.9375 12C10.4375 12 10 12.5 10 13C10 13.5625 10.4375 14 10.9375 14Z"
              fill={styles.red}
            />
          </svg>
        );
      case 1:
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11 14C11.5 14 12 13.5625 12 13C12 12.5 11.5 12 11 12C10.4375 12 10 12.5 10 13C10 13.5625 10.4375 14 11 14ZM21 14C21.5 14 22 13.5625 22 13C22 12.5 21.5 12 21 12C20.4375 12 20 12.5 20 13C20 13.5625 20.4375 14 21 14ZM16 20C12.9375 20 10.125 21.6875 8.625 24.25C8.5 24.5 8.5625 24.8125 8.8125 24.9375C9 25.125 9.3125 25 9.5 24.75C10.8125 22.4375 13.3125 21 16 21C18.625 21 21.125 22.4375 22.4375 24.75C22.5625 24.9375 22.75 25 22.875 25C23 25 23.0625 25 23.125 24.9375C23.375 24.8125 23.5 24.5 23.3125 24.25C21.8125 21.625 19 20 16 20ZM16 0C7.125 0 0 7.1875 0 16C0 24.875 7.125 32 16 32C24.8125 32 32 24.875 32 16C32 7.1875 24.8125 0 16 0ZM16 31C7.6875 31 1 24.3125 1 16C1 7.75 7.6875 1 16 1C24.25 1 31 7.75 31 16C31 24.3125 24.25 31 16 31Z"
              fill={styles.orange}
            />
          </svg>
        );
      case 2:
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21 14C21.5 14 22 13.5625 22 13C22 12.5 21.5 12 21 12C20.4375 12 20 12.5 20 13C20 13.5625 20.4375 14 21 14ZM11 14C11.5 14 12 13.5625 12 13C12 12.5 11.5 12 11 12C10.4375 12 10 12.5 10 13C10 13.5625 10.4375 14 11 14ZM22 21.5H10C9.6875 21.5 9.5 21.75 9.5 22C9.5 22.3125 9.6875 22.5 10 22.5H22C22.25 22.5 22.5 22.3125 22.5 22C22.5 21.75 22.25 21.5 22 21.5ZM16 0C7.125 0 0 7.1875 0 16C0 24.875 7.125 32 16 32C24.8125 32 32 24.875 32 16C32 7.1875 24.8125 0 16 0ZM16 31C7.6875 31 1 24.3125 1 16C1 7.75 7.6875 1 16 1C24.25 1 31 7.75 31 16C31 24.3125 24.25 31 16 31Z"
              fill={styles.neutral}
            />
          </svg>
        );
      case 3:
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11 14C11.5 14 12 13.5625 12 13C12 12.5 11.5 12 11 12C10.4375 12 10 12.5 10 13C10 13.5625 10.4375 14 11 14ZM21 14C21.5 14 22 13.5625 22 13C22 12.5 21.5 12 21 12C20.4375 12 20 12.5 20 13C20 13.5625 20.4375 14 21 14ZM22.4375 20.25C21.125 22.5625 18.625 24 16 24C13.3125 24 10.8125 22.5625 9.5 20.25C9.3125 20.0625 9 19.9375 8.8125 20.125C8.5625 20.25 8.5 20.5625 8.625 20.75C10.125 23.375 12.9375 25 16 25C19 25 21.8125 23.375 23.3125 20.75C23.4375 20.5 23.375 20.1875 23.125 20.0625C22.9375 19.9375 22.625 20.0625 22.4375 20.25ZM16 0C7.125 0 0 7.1875 0 16C0 24.875 7.125 32 16 32C24.8125 32 32 24.875 32 16C32 7.1875 24.8125 0 16 0ZM16 31C7.6875 31 1 24.3125 1 16C1 7.75 7.6875 1 16 1C24.25 1 31 7.75 31 16C31 24.3125 24.25 31 16 31Z"
              fill={'#C4C4C4'}
            />
          </svg>
        );
      case 4:
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.4375 20.25C21.125 22.5625 18.625 24 16 24C13.3125 24 10.8125 22.5625 9.5 20.25C9.3125 20.0625 9 19.9375 8.8125 20.125C8.5625 20.25 8.5 20.5625 8.625 20.75C10.125 23.375 12.9375 25 16 25C19 25 21.8125 23.375 23.3125 20.75C23.4375 20.5 23.375 20.1875 23.125 20.0625C22.9375 19.9375 22.625 20.0625 22.4375 20.25ZM21 9.5C18.625 9.5 17.625 13.4375 17.5 13.9375C17.4375 14.1875 17.5625 14.4375 17.875 14.5C18.125 14.5625 18.375 14.4375 18.4375 14.125C18.6875 13.1875 19.6875 10.5 21 10.5C22.3125 10.5 23.25 13.1875 23.5 14.125C23.5625 14.375 23.75 14.5 24 14.5H24.0625C24.375 14.4375 24.5 14.1875 24.4375 13.9375C24.3125 13.4375 23.3125 9.5 21 9.5ZM11 10.5C12.25 10.5 13.25 13.1875 13.5 14.125C13.5625 14.375 13.75 14.5 14 14.5H14.0625C14.375 14.4375 14.5 14.1875 14.4375 13.9375C14.3125 13.4375 13.3125 9.5 10.9375 9.5C8.5625 9.5 7.625 13.4375 7.5 13.9375C7.4375 14.1875 7.5625 14.4375 7.875 14.5C8.125 14.5625 8.375 14.4375 8.4375 14.125C8.6875 13.1875 9.6875 10.5 11 10.5ZM16 0C7.125 0 0 7.1875 0 16C0 24.875 7.125 32 16 32C24.8125 32 32 24.875 32 16C32 7.1875 24.8125 0 16 0ZM16 31C7.6875 31 1 24.3125 1 16C1 7.75 7.6875 1 16 1C24.25 1 31 7.75 31 16C31 24.3125 24.25 31 16 31Z"
              fill={styles.green}
            />
          </svg>
        );
      default:
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21 14C21.5 14 22 13.5625 22 13C22 12.5 21.5 12 21 12C20.4375 12 20 12.5 20 13C20 13.5625 20.4375 14 21 14ZM11 14C11.5 14 12 13.5625 12 13C12 12.5 11.5 12 11 12C10.4375 12 10 12.5 10 13C10 13.5625 10.4375 14 11 14ZM22 21.5H10C9.6875 21.5 9.5 21.75 9.5 22C9.5 22.3125 9.6875 22.5 10 22.5H22C22.25 22.5 22.5 22.3125 22.5 22C22.5 21.75 22.25 21.5 22 21.5ZM16 0C7.125 0 0 7.1875 0 16C0 24.875 7.125 32 16 32C24.8125 32 32 24.875 32 16C32 7.1875 24.8125 0 16 0ZM16 31C7.6875 31 1 24.3125 1 16C1 7.75 7.6875 1 16 1C24.25 1 31 7.75 31 16C31 24.3125 24.25 31 16 31Z"
              fill={styles.neutral}
            />
          </svg>
        );
    }
  };

  const displayLabel = (satisfactionCategory: string) => {
    switch (satisfactionCategory) {
      case 'score_hard_skills':
        return 'savoir-faire';
      case 'score_soft_skills':
        return 'savoir-être';
      default:
        return '';
    }
  };

  return (
    <div className={styles.headerEmojis}>
      <span>{displayLabel(type)}</span>
      {displayEmoji(indexSatisfaction)}
    </div>
  );
};

const DisplaySatisfaction = ({ isOpen, handleClose, satisfaction }: DisplaySatisfactionProps) => {
  const users = useSelector(selectUsers);
  const [author, setAuthor] = useState<Partial<UsUserModel>>({});

  const fullName = useMemo(() => {
    return `${author.first_name} ${author.last_name}`;
  }, [author]);

  useEffect(() => {
    if (satisfaction.user_created) {
      if (typeof satisfaction.user_created === 'string') {
        if (users.filter((user) => user.id === satisfaction.user_created).length > 0) {
          return setAuthor(users.filter((user) => user.id === satisfaction.user_created)[0]);
        } else {
          getUsUser(satisfaction.user_created).then((res) => {
            if (res.status === 200 && res.data) setAuthor(res.data);
          });
        }
      } else setAuthor(satisfaction.user_created);
    } else setAuthor({});
  }, [satisfaction.user_created, users]);

  return (
    <Modal
      open={isOpen}
      closable
      onCancel={handleClose}
      title={'Satisfaction'}
      footer={
        <Button small onClick={handleClose}>
          Fermer
        </Button>
      }
    >
      <header className={styles.header}>
        <DisplaySatisfactionSkill type={'score_hard_skills'} indexSatisfaction={satisfaction.score_hard_skills} />
        <DisplaySatisfactionSkill type={'score_soft_skills'} indexSatisfaction={satisfaction.score_soft_skills} />
        <div className={styles.headerInfos}>
          <span>
            {DateTime.fromISO(satisfaction.date_created as string)
              .setLocale('fr')
              .toLocaleString()}
          </span>
          <b>{fullName}</b>
        </div>
      </header>
      <p>{satisfaction.comment ? satisfaction.comment : 'Aucun commentaire'}</p>
      <hr className={styles.separator} />
      <p>Merci pour votre participation !</p>
    </Modal>
  );
};

export default DisplaySatisfaction;
