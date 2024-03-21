import { Form, Input } from "antd";
import React from "react";
import { GdpCerbRessourcesModel } from "../../../models/GestionDeProjets/CERBE/GdpCerbRessourcesModel";

type Props = {
  resources: Partial<GdpCerbRessourcesModel>;
};
const ResourcesForm = ({ resources }: Props) => {
  return (
    <Form style={{ width: "75%" }}>
      <Form.Item
        label={"Capacité de la cuve de récupération d'eau de pluie [en m³]"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={resources?.rainwater_harvesting_tank_capacity}
        name={"rainwater_harvesting_tank_capacity"}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Coefficient perméabilité parcelle initial"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={resources?.initial_parcel_permeability_coefficient}
        name={"initial_parcel_permeability_coefficient"}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Coefficient perméabilité parcelle projet"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={resources.project_parcel_permeability_coefficient}
        name={"project_parcel_permeability_coefficient"}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};

export default ResourcesForm;
