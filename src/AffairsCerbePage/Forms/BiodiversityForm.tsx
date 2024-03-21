import { Form, Input } from "antd";
import React from "react";
import { GdpCerbBiodiversityModel } from "../../../models/GestionDeProjets/CERBE/GdpCerbBiodiversityModel";

type Props = {
  biodiversity: Partial<GdpCerbBiodiversityModel>;
};
const BiodiversityForm = ({ biodiversity }: Props) => {
  return (
    <Form style={{ width: "75%" }}>
      <Form.Item
        label={"Surface parcelle totale"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={biodiversity?.total_plot_area}
        name={"total_plot_area"}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"CBS Initial"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={biodiversity?.initial_biotope_surface_coefficient}
        name={"initial_biotope_surface_coefficient"}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"CBS Projet"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={biodiversity?.project_biotope_surface_coefficient}
        name={"project_biotope_surface_coefficient"}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"CRTS Initial"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={
          biodiversity?.initial_surface_thermal_refreshment_coefficient
        }
        name={"initial_surface_thermal_refreshment_coefficient"}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"CRTS Projet"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
        initialValue={
          biodiversity?.project_surface_thermal_refreshment_coefficient
        }
        name={"project_surface_thermal_refreshment_coefficient"}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};

export default BiodiversityForm;
