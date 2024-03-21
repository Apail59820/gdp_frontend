import { Form, Input } from "antd";
import React from "react";

const ResourcesForm = () => {
  return (
    <Form style={{ width: "75%" }}>
      <Form.Item
        label={"Capacité de la cuve de récupération d'eau de pluie [en m³]"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Coefficient perméabilité parcelle initial"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Coefficient perméabilité parcelle projet"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};

export default ResourcesForm;
