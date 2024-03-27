import { Empty, Form, FormInstance, Input, Modal, Select } from "antd";
import React, { useState } from "react";
import { GdpProjectsModel } from "../../../models/GestionDeProjets/GdpProjectsModel";
import { Button } from "projex-ui";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (values: {
    /*TODO set values type parameters*/
  }) => void;
  userProjects: Partial<GdpProjectsModel>[];
  form: FormInstance<any>;
  loading: boolean;
};
const CreateAffairModal = ({
  isOpen,
  setIsOpen,
  onSubmit,
  form,
  loading,
  userProjects,
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
      title={`Création d'une nouvelle affaire.`}
      width={"40%"}
      footer={null}
    >
      <Form
        onFinish={onSubmit}
        layout={"vertical"}
        style={{ marginTop: 20 }}
        form={form}
      >
        <Form.Item
          label={"Selectionnez un nom pour la nouvelle affaire."}
          name={"affair"}
        >
          <Input placeholder={`Nouvelle affaire`}></Input>
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

export default CreateAffairModal;
