import { Form, Input } from "antd";
import React from "react";

const EnergyForm = () => {
  return (
    <Form style={{ width: "75%" }}>
      <Form.Item
        label={"RT applicable"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Cep ref kWhep/m².an"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Cep projet kWhep/m².an"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Economie d'énergie"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Qualité énergie renouvelable cep-cepnr en kWh/m².an"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};

export default EnergyForm;
