import { Form, Input } from "antd";
import React from "react";
import { GdpCerbEnergyModel } from "../../../models/GestionDeProjets/CERBE/GdpCerbEnergyModel";

type Props = {
  energy: Partial<GdpCerbEnergyModel>;
};
const EnergyForm = ({ energy }: Props) => {
  return (
    <Form style={{ width: "75%" }}>
      <Form.Item
        label={"RT applicable"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={energy?.applicable_thermal_regulation}
        name={"applicable_thermal_regulation"}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Cep ref kWhep/m².an"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={energy?.conventional_energy_consumption_ref}
        name={"conventional_energy_consumption_ref"}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Cep projet kWhep/m².an"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={energy?.project_conventional_energy_consumption}
        name={"project_conventional_energy_consumption"}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Economie d'énergie"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={energy?.energy_savings}
        name={"project_conventional_energy_consumption"}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Qualité énergie renouvelable cep-cepnr en kWh/m².an"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={energy?.renewable_cec_energy_amount}
        name={"renewable_cec_energy_amount"}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Qualité énergie renouvelable en kWh/m².an"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={energy?.renewable_energy_amount}
        name={"renewable_energy_amount"}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};

export default EnergyForm;
