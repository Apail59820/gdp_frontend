import { Form, Input } from "antd";
import React from "react";

const TechnicalForm = () => {
  return (
    <Form style={{ width: "75%" }}>
      <Form.Item
        label={"CVC"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Electricité"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Structure"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Enveloppe"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Finitions interieures"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Autres"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};

export default TechnicalForm;
