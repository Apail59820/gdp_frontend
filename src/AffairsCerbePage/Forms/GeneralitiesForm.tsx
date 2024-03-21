import { Form, Input } from "antd";
import React, { useEffect } from "react";
import { GdpCerbGeneralitiesModel } from "../../../models/GestionDeProjets/CERBE/GdpCerbGeneralitiesModel";

type Props = {
  generalities: Partial<GdpCerbGeneralitiesModel>;
};
const GeneralitiesForm = ({ generalities }: Props) => {
  useEffect(() => {
    console.log("GEN : ", generalities);
  }, []);
  return (
    <Form style={{ width: "75%" }}>
      <Form.Item
        label={"Interlocuteur"}
        name={"interlocutor"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={generalities?.interlocutor}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Nom du projet"}
        name={"affair_name"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={generalities?.project_name}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"MOA"}
        name={"affair_contracting_authority"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={generalities?.contracting_authority}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Surface parcelle (m²)"}
        name={"plot_area"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={generalities?.plot_area}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Surface plancher (m²)"}
        name={"floor_area"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={generalities?.floor_area}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Neuf / Rhéa / Mixte ?"}
        name={"status"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={generalities?.status}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Typologie"}
        name={"typology"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={generalities?.typology}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Certifications et label"}
        name={"certifications_label"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={generalities?.certifications_labels}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};

export default GeneralitiesForm;
