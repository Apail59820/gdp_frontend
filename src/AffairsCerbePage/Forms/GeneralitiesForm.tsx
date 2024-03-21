import { Form, Input } from "antd";
import React from "react";

const GeneralitiesForm = () => {
  return (
    <Form style={{ width: "75%" }}>
      <Form.Item
        label={"Interlocuteur"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Nom du projet"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"MOA"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Surface parcelle (m²)"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Surface plancher (m²)"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Neuf / Rhéa / Mixte ?"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Typologie"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Certifications et label"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};

export default GeneralitiesForm;
