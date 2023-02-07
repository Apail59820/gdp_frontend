import React from 'react';
import styles from './UsersWidget.module.scss';
import { UserModel } from '../../../models/UserModels';
import { ManageItemCard } from '@projex/ui';
import { Section } from '@projex/ui';
import Grid from '../Grid/Grid';
import UserCard from '../UserCard/UserCard';

type Props = {
  users: UserModel[];
  label?: string;
  addUserLabel?: string;
  onNewUserClick: React.MouseEventHandler<HTMLButtonElement>;
};

const UsersWidget = ({ users, label, addUserLabel, onNewUserClick }: Props) => {
  return (
    <Section title={label || 'Les utilisateurs'}>
      <Grid>
        {users.map((user: UserModel) => (
          <UserCard user={user} onKebabMenuClick={() => console.log('handle click ?')} />
        ))}
        <div className={styles.manageItemCardContainer}>
          <ManageItemCard label={addUserLabel || 'Nouvel utilisateur'} onClick={onNewUserClick} />
        </div>
      </Grid>
    </Section>
  );
};

export default UsersWidget;
