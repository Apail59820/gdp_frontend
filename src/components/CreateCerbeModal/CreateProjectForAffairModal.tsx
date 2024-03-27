import { Divider, Empty, Form, FormInstance, Input, Modal, Select } from "antd";
import { Button } from "projex-ui";
import React, { useState } from "react";
import { GdpPythagoreAffaireModel } from "../../../models/GestionDeProjets/GdpPythagoreAffaireModel";
import { GdpProjectsModel } from "../../../models/GestionDeProjets/GdpProjectsModel";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  affairToCreate: Partial<GdpPythagoreAffaireModel>;
  onSubmit: (values: { project_name?: string; project?: number }) => void;
  userProjects: Partial<GdpProjectsModel>[];
  form: FormInstance<any>;
  loading: boolean;
};
const CreateProjectForAffairModal = ({
  isOpen,
  setIsOpen,
  affairToCreate,
  onSubmit,
  form,
  userProjects,
  loading,
}: Props) => {
  const [userProjectsSearchList, setUserProjectsSearchList] = useState<
    Partial<GdpProjectsModel>[]
  >(userProjects || []);

  return (
    <Modal
      closable
      destroyOnClose
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      title={`Souhaitez vous créer un projet ?`}
      width={"40%"}
      footer={null}
    >
      <p>
        L'affaire <strong>{affairToCreate?.libelle_affaire}</strong> n'est
        associée à aucun projet, souhaitez-vous créer un projet immédiatement ?{" "}
        <br /> L'affaire sera liée automatiquement au projet créé.
      </p>
      <Divider />
      <Form
        onFinish={onSubmit}
        layout={"vertical"}
        style={{ marginTop: 20 }}
        form={form}
      >
        <Form.Item
          label={"Selectionnez un nom pour le projet."}
          name={"project_name"}
        >
          <Input
            placeholder={`Projet - ${affairToCreate.libelle_affaire}`}
            onChange={(e) => {
              if (e.target.value.length > 0) {
                form.setFieldValue("project", null);
              }
            }}
          ></Input>
        </Form.Item>
        <Form.Item label={"Ou choisissez un projet existant."} name={"project"}>
          <Select
            showSearch
            filterOption={false}
            placeholder={"Selectionnez un project existant"}
            options={userProjectsSearchList?.map((project) => ({
              label: `${project?.name}`,
              value: project?.id,
            }))}
            onSearch={(value) => {
              setUserProjectsSearchList(
                userProjects
                  .filter((userProject) =>
                    userProject.name
                      .toLowerCase()
                      .includes(value.toLowerCase()),
                  )
                  .slice(0, 10),
              );
            }}
            onChange={() => {
              form.setFieldValue("project_name", null);
            }}
            notFoundContent={
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={"Aucun projet trouvé"}
              />
            }
          />
        </Form.Item>
        <div style={{ display: "flex", marginTop: 10 }}>
          <Button small htmlType={"submit"} loading={loading}>
            Confirmer
          </Button>
          <Button
            small
            style={"text"}
            onClick={() => setIsOpen(false)}
            loading={loading}
          >
            Annuler
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateProjectForAffairModal;
