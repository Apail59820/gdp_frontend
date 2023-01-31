import React from 'react';
import { ManageItemCard } from '@projex/ui';
import styles from './ConfigureWidget.module.scss';

type props = {
  descriptionText: string;
  buttonText: string;
  icon?: 'add' | 'edit';
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const ConfigureWidget = ({ descriptionText, buttonText, icon = 'add', onClick }: props) => {
  return (
    <div className={styles.container}>
      <span>{descriptionText}</span>
      <div className={styles.btnContainer}>
        <ManageItemCard label={buttonText} onClick={onClick} type={icon} />
      </div>
    </div>
  );
};

export default ConfigureWidget;
