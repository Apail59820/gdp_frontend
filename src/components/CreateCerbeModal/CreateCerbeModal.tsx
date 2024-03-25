import { Form, Input, message, Modal, Select } from "antd";
import { Button } from "projex-ui";
import React, { useState } from "react";
import { GdpAffairModel } from "../../../models/GestionDeProjets/GdpAffairModel";
import { useRouter } from "next/router";
import { getGdpAffairsPythagoreAffairs } from "../../../services/gestionDeProjets/GdpAffairsPythagoreAffairs";
import { isRequestSuccessful } from "../../../utils/isRequestSuccessful";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  affairs: Partial<GdpAffairModel>[];
};
const CreateCerbeModal = ({ isOpen, setIsOpen, affairs }: Props) => {
  const [affairSearchDisabled, setAffairSearchDisabled] =
    useState<boolean>(false);

  const router = useRouter();
  const onSubmit = (value) => {
    if (!affairSearchDisabled) {
      if (typeof value?.affair === "undefined")
        return message.error(
          "Veuillez selectionner une affaire ou entrer un numéro pythagore.",
        );
      return router.push(`/cerbe/${value?.affair}`);
    } else {
      getGdpAffairsPythagoreAffairs({
        filter: {
          pythagore_affaires_id: { _eq: value?.num_affaire },
        },
      }).then((res) => {
        if (isRequestSuccessful(res.status) && res?.data) {
          if (res.data[0]?.affairs_id) {
            return router.push(
              `/cerbe/${(res.data[0]?.affairs_id as Partial<GdpAffairModel>).id}`,
            );
          }
        }
        return message.error("Une erreur est survenue.");
      });
    }
  };

  return (
    <Modal
      closable
      destroyOnClose
      footer={null}
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      title={`Ajouter des données CERBE`}
    >
      <Form onFinish={onSubmit} layout={"vertical"} style={{ marginTop: 20 }}>
        <Form.Item label="Sélectionnez une affaire" name={"affair"}>
          <Select
            showSearch
            filterOption={false}
            placeholder={"Affaire"}
            style={{ width: "100%" }}
            options={affairs.map((affair) => ({
              label: affair?.name,
              value: affair?.id,
            }))}
            disabled={affairSearchDisabled}
          />
        </Form.Item>
        <Form.Item label={"Ou entrez un n° pythagore"} name={"num_affaire"}>
          <Input
            onChange={(e) => {
              setAffairSearchDisabled(e.target.value?.length > 0);
            }}
          />
        </Form.Item>

        <div style={{ display: "flex", marginTop: 10 }}>
          <Button small htmlType={"submit"}>
            Confirmer
          </Button>
          <Button small style={"text"} onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateCerbeModal;
