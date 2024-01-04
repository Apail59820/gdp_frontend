import React from 'react';
import { GdpSatisfactionModel } from '../../../models/GestionDeProjets/GdpSatisfactionModel';
import { Modal } from 'antd';
import { Button } from 'projex-ui-dev';
import DisplaySatisfaction from '../DisplaySatisfaction/DisplaySatisfaction';
import styles from '../DisplaySatisfaction/DisplaySatisfaction.module.scss';

interface DisplaySatisfactionProps {
  isOpen: boolean;
  handleClose: () => void;
  satisfaction: Partial<GdpSatisfactionModel>;
}

const ModalDisplaySatisfaction = ({ isOpen, handleClose, satisfaction }: DisplaySatisfactionProps) => {
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
      <DisplaySatisfaction satisfaction={satisfaction} />
      <hr className={styles.separator} />
      <p>Merci pour votre participation !</p>
    </Modal>
  );
};

export default ModalDisplaySatisfaction;
