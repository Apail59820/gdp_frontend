import React from 'react';
import { ManageItemCard } from '@projex/ui';
import styles from './ConfigureWidget.module.scss';
import { ManageItemButtonProps } from '@projex/ui/dist/components/atoms/ManageItemButton/ManageItemButton';

type props = Partial<ManageItemButtonProps> & {
  descriptionText: string;
};

const ConfigureWidget = ({ descriptionText, label, type, onClick }: props) => {
  return (
    <div className={styles.container}>
      <span>{descriptionText}</span>
      {label && onClick ? (
        <div className={styles.btnContainer}>
          <ManageItemCard label={label} onClick={onClick} type={type} />
        </div>
      ) : null}
    </div>
  );
};

export default ConfigureWidget;
