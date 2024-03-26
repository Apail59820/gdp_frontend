import { Form, Input, message, Modal, Select } from "antd";
import { Button } from "projex-ui";
import React, { useState } from "react";
import { GdpAffairModel } from "../../../models/GestionDeProjets/GdpAffairModel";
import { useRouter } from "next/router";
import { getGdpAffairsPythagoreAffairs } from "../../../services/gestionDeProjets/GdpAffairsPythagoreAffairs";
import { isRequestSuccessful } from "../../../utils/isRequestSuccessful";
import { getGdpPythagoreAffaire } from "../../../services/gestionDeProjets/GdpPythagoreAffairs";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  affairs: Partial<GdpAffairModel>[];
};
const CreateCerbeModal = ({ isOpen, setIsOpen, affairs }: Props) => {
  const [affairSearchDisabled, setAffairSearchDisabled] =
    useState<boolean>(false);

  const router = useRouter();
  const onSubmit = async (value) => {
    async function affairsExistsInJunctionTable() {
      const res = await getGdpAffairsPythagoreAffairs({
        filter: {
          pythagore_affaires_id: { _eq: value?.num_affaire },
        },
      });

      if (isRequestSuccessful(res.status) && res?.data?.length) {
        return res.data[0];
      }

      return null;
    }

    if (!affairSearchDisabled) {
      if (typeof value?.affair === "undefined")
        return message.error(
          "Veuillez selectionner une affaire ou entrer un numéro pythagore.",
        );
      return router.push(`/cerbe/${value?.affair}`);
    } else {
      const affairPythagoreAffair = await affairsExistsInJunctionTable();
      if (affairPythagoreAffair)
        return router.push(`/cerbe/${affairPythagoreAffair.affairs_id}`);

      const pythagoreAffair = await getGdpPythagoreAffaire(value?.num_affaire);

      if (isRequestSuccessful(pythagoreAffair.status) && pythagoreAffair.data) {
        // if yes create a project for it
      } else {
        return message.error(
          `Aucune affaire pythagore n'a été trouvée avec le numéro '${value?.num_affaire}'`,
        );
      }
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
