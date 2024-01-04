import React from 'react';
import { ManageItemCard } from 'projex-ui-dev';
import styles from './ConfigureWidget.module.scss';
import {ManageItemButtonProps} from "projex-ui/dist/types/components/atoms/ManageItemButton/ManageItemButton";

type props = {
  descriptionText: string;
  button?: ManageItemButtonProps;
};

const ConfigureWidget = ({ descriptionText, button }: props) => {
  return (
    <div className={styles.container}>
      <span>{descriptionText}</span>
      {button ? (
        <div className={styles.btnContainer}>
          <ManageItemCard label={button.label} onClick={button.onClick} type={button.type} />
        </div>
      ) : null}
    </div>
  );
};

export default ConfigureWidget;
