import { Form, Input } from "antd";
import React from "react";
import { GdpCerbCarbonModel } from "../../../models/GestionDeProjets/CERBE/GdpCerbCarbonModel";

type Props = {
  carbon: Partial<GdpCerbCarbonModel>;
};
const CarbonForm = ({ carbon }: Props) => {
  return (
    <Form style={{ width: "75%" }}>
      <Form.Item
        label={"Empreinte carbone reference kgeqCO²/m²"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={carbon?.baseline_carbon_footprint}
        name={"baseline_carbon_footprint"}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Empreinte carbone projet kgeqCO²/m²"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={carbon?.project_carbon_footprint}
        name={"project_carbon_footprint"}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Quantité matériaux biosourcés [en Kg]"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={carbon?.biobased_materials_amount}
        name={"biobased_materials_amount"}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};

export default CarbonForm;
