import React, { useState } from 'react';
import { Form, Input, message, Modal, Radio, RadioChangeEvent } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import styles from './SatisfactionForm.module.scss';
import { CreateGdpSatisfactionModel } from '../../../models/GestionDeProjets/GdpSatisfactionModel';
import { Button } from '@projex/ui';
import { createGdpSatisfaction } from '../../../services/gestionDeProjets/GdpAffairsSatisfaction';

type SatisfactionFormProps = {
  affair_id: number;
  affair_phases_id: number;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type FormProps = {
  score_hard_skills: number;
  score_soft_skills: number;
  comment: string;
};

const SatisfactionForm = ({ affair_id, affair_phases_id, isOpen, setIsOpen }: SatisfactionFormProps) => {
  const [form] = useForm();

  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  enum satisfactionCategories {
    score_hard_skills = 'score_hard_skills',
    score_soft_skills = 'score_soft_skills',
  }

  const satisfactionInitialValues: CreateGdpSatisfactionModel = {
    affairs_id: affair_id,
    affairs_phases_id: affair_phases_id,
    score_hard_skills: 2,
    score_soft_skills: 2,
    comment: '',
  };

  const [satisfactionValues, setSatisfactionValues] = useState<CreateGdpSatisfactionModel>(satisfactionInitialValues);

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

  const handleChange = (e: RadioChangeEvent, satisfactionCategory: string) => {
    setSatisfactionValues({ ...satisfactionValues, [satisfactionCategory]: e.target.value });
  };

  const onFinish = (values: FormProps) => {
    if (affair_id && affair_phases_id && values.score_soft_skills && values.score_hard_skills) {
      createGdpSatisfaction({ ...satisfactionValues, comment: values.comment }).then((response) => {
        if (response.status === 200) {
          setIsOpen(false);
          form.resetFields();
          setOpenConfirmModal(true);
        } else {
          message.error('Une erreur est survenue');
        }
      });
    }
  };

  return (
    <>
      <Modal
        open={isOpen}
        closable
        onCancel={() => setIsOpen(false)}
        title={'Votre avis compte pour nous'}
        footer={null}
        destroyOnClose
      >
        <p>Comment évaluez vous les prestations offertes par Groupe Projex sur la dernière phase de notre mission ?</p>
        <Form
          form={form}
          name={'satisfactionForm'}
          autoComplete={'off'}
          layout={'vertical'}
          initialValues={satisfactionInitialValues}
          onFinish={onFinish}
        >
          {Object.values(satisfactionCategories).map((satisfactionCategory, index) => (
            <div key={index}>
              <hr className={styles.separator} />
              <Form.Item
                name={satisfactionCategory}
                label={<b>Sur le plan du {displayLabel(satisfactionCategory)}</b>}
                rules={[
                  {
                    required: true,
                    message: 'Veuillez sélectionner une note',
                  },
                ]}
              >
                <Radio.Group onChange={(e) => handleChange(e, satisfactionCategory)} className={styles.radioGroup}>
                  <Radio value={0} className={styles.customRadio}>
                    <svg
                      className={styles.svgTest}
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 0C7.125 0 0 7.1875 0 16C0 24.875 7.125 32 16 32C24.8125 32 32 24.875 32 16C32 7.1875 24.8125 0 16 0ZM16 31C7.6875 31 1 24.3125 1 16C1 7.75 7.6875 1 16 1C24.25 1 31 7.75 31 16C31 24.3125 24.25 31 16 31ZM16 18C9.625 18 8.5 23.375 8.5 23.4375C8.4375 23.6875 8.625 23.9375 8.875 24C9.125 24.0625 9.375 23.875 9.4375 23.625C9.5 23.4375 10.5 19 16 19C21.5 19 22.4375 23.4375 22.5 23.625C22.5 23.875 22.75 24 23 24H23.0625C23.3125 23.9375 23.5 23.6875 23.4375 23.4375C23.4375 23.375 22.3125 18 16 18ZM21 14C21.5 14 22 13.5625 22 13C22 12.5 21.5 12 21 12C20.4375 12 20 12.5 20 13C20 13.5625 20.4375 14 21 14ZM10.9375 14C11.5 14 12 13.5625 12 13C12 12.5 11.5 12 10.9375 12C10.4375 12 10 12.5 10 13C10 13.5625 10.4375 14 10.9375 14Z"
                        fill={satisfactionValues[satisfactionCategory] === 0 ? `${styles.red}` : '#C4C4C4'}
                      />
                    </svg>
                  </Radio>
                  <Radio value={1} className={styles.customRadio}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M11 14C11.5 14 12 13.5625 12 13C12 12.5 11.5 12 11 12C10.4375 12 10 12.5 10 13C10 13.5625 10.4375 14 11 14ZM21 14C21.5 14 22 13.5625 22 13C22 12.5 21.5 12 21 12C20.4375 12 20 12.5 20 13C20 13.5625 20.4375 14 21 14ZM16 20C12.9375 20 10.125 21.6875 8.625 24.25C8.5 24.5 8.5625 24.8125 8.8125 24.9375C9 25.125 9.3125 25 9.5 24.75C10.8125 22.4375 13.3125 21 16 21C18.625 21 21.125 22.4375 22.4375 24.75C22.5625 24.9375 22.75 25 22.875 25C23 25 23.0625 25 23.125 24.9375C23.375 24.8125 23.5 24.5 23.3125 24.25C21.8125 21.625 19 20 16 20ZM16 0C7.125 0 0 7.1875 0 16C0 24.875 7.125 32 16 32C24.8125 32 32 24.875 32 16C32 7.1875 24.8125 0 16 0ZM16 31C7.6875 31 1 24.3125 1 16C1 7.75 7.6875 1 16 1C24.25 1 31 7.75 31 16C31 24.3125 24.25 31 16 31Z"
                        fill={satisfactionValues[satisfactionCategory] === 1 ? `${styles.orange}` : '#C4C4C4'}
                      />
                    </svg>
                  </Radio>
                  <Radio value={2} className={styles.customRadio}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M21 14C21.5 14 22 13.5625 22 13C22 12.5 21.5 12 21 12C20.4375 12 20 12.5 20 13C20 13.5625 20.4375 14 21 14ZM11 14C11.5 14 12 13.5625 12 13C12 12.5 11.5 12 11 12C10.4375 12 10 12.5 10 13C10 13.5625 10.4375 14 11 14ZM22 21.5H10C9.6875 21.5 9.5 21.75 9.5 22C9.5 22.3125 9.6875 22.5 10 22.5H22C22.25 22.5 22.5 22.3125 22.5 22C22.5 21.75 22.25 21.5 22 21.5ZM16 0C7.125 0 0 7.1875 0 16C0 24.875 7.125 32 16 32C24.8125 32 32 24.875 32 16C32 7.1875 24.8125 0 16 0ZM16 31C7.6875 31 1 24.3125 1 16C1 7.75 7.6875 1 16 1C24.25 1 31 7.75 31 16C31 24.3125 24.25 31 16 31Z"
                        fill={satisfactionValues[satisfactionCategory] === 2 ? `${styles.neutral}` : '#C4C4C4'}
                      />
                    </svg>
                  </Radio>
                  <Radio value={3} className={styles.customRadio}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M11 14C11.5 14 12 13.5625 12 13C12 12.5 11.5 12 11 12C10.4375 12 10 12.5 10 13C10 13.5625 10.4375 14 11 14ZM21 14C21.5 14 22 13.5625 22 13C22 12.5 21.5 12 21 12C20.4375 12 20 12.5 20 13C20 13.5625 20.4375 14 21 14ZM22.4375 20.25C21.125 22.5625 18.625 24 16 24C13.3125 24 10.8125 22.5625 9.5 20.25C9.3125 20.0625 9 19.9375 8.8125 20.125C8.5625 20.25 8.5 20.5625 8.625 20.75C10.125 23.375 12.9375 25 16 25C19 25 21.8125 23.375 23.3125 20.75C23.4375 20.5 23.375 20.1875 23.125 20.0625C22.9375 19.9375 22.625 20.0625 22.4375 20.25ZM16 0C7.125 0 0 7.1875 0 16C0 24.875 7.125 32 16 32C24.8125 32 32 24.875 32 16C32 7.1875 24.8125 0 16 0ZM16 31C7.6875 31 1 24.3125 1 16C1 7.75 7.6875 1 16 1C24.25 1 31 7.75 31 16C31 24.3125 24.25 31 16 31Z"
                        fill={satisfactionValues[satisfactionCategory] === 3 ? `${styles.green}` : '#C4C4C4'}
                      />
                    </svg>
                  </Radio>
                  <Radio value={4} className={styles.customRadio}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M22.4375 20.25C21.125 22.5625 18.625 24 16 24C13.3125 24 10.8125 22.5625 9.5 20.25C9.3125 20.0625 9 19.9375 8.8125 20.125C8.5625 20.25 8.5 20.5625 8.625 20.75C10.125 23.375 12.9375 25 16 25C19 25 21.8125 23.375 23.3125 20.75C23.4375 20.5 23.375 20.1875 23.125 20.0625C22.9375 19.9375 22.625 20.0625 22.4375 20.25ZM21 9.5C18.625 9.5 17.625 13.4375 17.5 13.9375C17.4375 14.1875 17.5625 14.4375 17.875 14.5C18.125 14.5625 18.375 14.4375 18.4375 14.125C18.6875 13.1875 19.6875 10.5 21 10.5C22.3125 10.5 23.25 13.1875 23.5 14.125C23.5625 14.375 23.75 14.5 24 14.5H24.0625C24.375 14.4375 24.5 14.1875 24.4375 13.9375C24.3125 13.4375 23.3125 9.5 21 9.5ZM11 10.5C12.25 10.5 13.25 13.1875 13.5 14.125C13.5625 14.375 13.75 14.5 14 14.5H14.0625C14.375 14.4375 14.5 14.1875 14.4375 13.9375C14.3125 13.4375 13.3125 9.5 10.9375 9.5C8.5625 9.5 7.625 13.4375 7.5 13.9375C7.4375 14.1875 7.5625 14.4375 7.875 14.5C8.125 14.5625 8.375 14.4375 8.4375 14.125C8.6875 13.1875 9.6875 10.5 11 10.5ZM16 0C7.125 0 0 7.1875 0 16C0 24.875 7.125 32 16 32C24.8125 32 32 24.875 32 16C32 7.1875 24.8125 0 16 0ZM16 31C7.6875 31 1 24.3125 1 16C1 7.75 7.6875 1 16 1C24.25 1 31 7.75 31 16C31 24.3125 24.25 31 16 31Z"
                        fill={satisfactionValues[satisfactionCategory] === 4 ? `${styles.primary}` : '#C4C4C4'}
                      />
                    </svg>
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </div>
          ))}
          <Form.Item name="comment" label={<b>Ajouter un commentaire (optionnel)</b>}>
            <Input.TextArea placeholder="Votre commentaire" />
          </Form.Item>
          <footer className={styles.footer}>
            <Button small htmlType={'submit'}>
              Envoyer
            </Button>
            <span className={styles.fakeBtn} onClick={() => setIsOpen(false)}>
              Je ne souhaite pas répondre
            </span>
          </footer>
        </Form>
      </Modal>
      <Modal
        open={openConfirmModal}
        closable
        onCancel={() => setOpenConfirmModal(false)}
        title={'Votre avis compte pour nous'}
        footer={
          <Button small onClick={() => setOpenConfirmModal(false)}>
            Fermer
          </Button>
        }
      >
        <p>Merci pour votre participation !</p>
      </Modal>
    </>
  );
};

export default SatisfactionForm;
