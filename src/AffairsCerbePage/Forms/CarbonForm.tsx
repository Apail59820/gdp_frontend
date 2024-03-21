import { Form, Input } from "antd";
import React from "react";

const CarbonForm = () => {
  return (
    <Form style={{ width: "75%" }}>
      <Form.Item
        label={"Empreinte carbone reference kgeqCO²/m²"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Empreinte carbone projet kgeqCO²/m²"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Quantité matériaux biosourcés [en Kg]"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};

export default CarbonForm;
