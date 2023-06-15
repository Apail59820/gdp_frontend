import React, { useEffect, useState } from 'react';
import { ShadowCard } from '@projex/ui';
import { GdpSatisfactionModel } from '../../../models/GestionDeProjets/GdpSatisfactionModel';
import { getGdpAffair } from '../../../services/gestionDeProjets/GdpAffairs';
import { DateTime } from 'luxon';
import { UsUserModel } from '../../../models/UserService/UsUserModel';
import { useSelector } from 'react-redux';
import { selectUsers } from '../../../store/reducers/usersReducer';
import { selectAffairs } from '../../../store/reducers/affairsReducer';
import { getUsUser } from '../../../services/userService/UsUsers';
import { GdpAffairModel } from '../../../models/GestionDeProjets/GdpAffairModel';
import styles from './PreviewSatisfactionsList.module.scss';

interface PreviewSatisfactionsListProps {
  satisfactions: GdpSatisfactionModel[];
}

const PreviewSatisfaction = (satisfaction: GdpSatisfactionModel) => {
  const users = useSelector(selectUsers);
  const affairs = useSelector(selectAffairs);

  const [author, setAuthor] = useState<Partial<UsUserModel>>({ first_name: 'Utilisateur', last_name: 'Inconnu' });
  const [affair, setAffair] = useState<Partial<GdpAffairModel>>({ name: 'Affaire inconnue' });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fullName = `${author.first_name} ${author.last_name}`;

  useEffect(() => {
    if (typeof satisfaction.user_created === 'string') {
      const user = users.find((user) => user.id === satisfaction.user_created);
      if (user) {
        setAuthor(user);
      } else {
        getUsUser(satisfaction.user_created).then((res) => {
          if (res.status === 200 && res.data) {
            setAuthor(res.data);
          } else setAuthor({ first_name: 'Utilisateur', last_name: 'Inconnu' });
        });
      }
    } else setAuthor(satisfaction.user_created);
  }, [satisfaction.user_created, users]);

  useEffect(() => {
    if (typeof satisfaction.affairs_id === 'number') {
      const affair = affairs.find((affair) => affair.id === satisfaction.affairs_id);
      if (affair) {
        setAffair(affair);
      } else {
        getGdpAffair(satisfaction.affairs_id).then((res) => {
          if (res.status === 200 && res.data) {
            setAffair(res.data);
          } else setAffair({ name: 'Affaire inconnue' });
        });
      }
    } else setAffair(satisfaction.affairs_id);
  }, [affairs, satisfaction.affairs_id]);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  // TODO: Add modal when merged

  return (
    <div className={styles.item} onClick={handleClick}>
      <span>{DateTime.fromISO(satisfaction.date_created.toString()).setLocale('fr').toLocaleString()}</span>
      <b>{affair.name}</b>
      <span>par {fullName}</span>
    </div>
  );
};

const PreviewSatisfactionsList = ({ satisfactions }: PreviewSatisfactionsListProps) => {
  return (
    <ShadowCard>
      <div className={styles.container}>
        {satisfactions.map((satisfaction) => (
          <React.Fragment key={satisfaction.id}>
            <PreviewSatisfaction {...satisfaction} />
            <hr className={styles.separator} />
          </React.Fragment>
        ))}
      </div>
    </ShadowCard>
  );
};

export default PreviewSatisfactionsList;
