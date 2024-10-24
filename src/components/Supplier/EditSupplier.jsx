import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const EditSupplier = ({ visible, onClose, supplier, onUpdate, addedBy }) => {
  const [form] = Form.useForm();

  const handleUpdate = async () => {
    try {
      if (!addedBy) {
        message.error('User not logged in');
        return;
      }

      const values = await form.validateFields();
      const supplierData = {
        ...values,
        updated_by: addedBy, // Menyertakan ID user yang melakukan pembaruan
      };

      const response = await axios.put(`http://localhost:5000/api/suppliers/${supplier.id}`, supplierData);

      if (response.data) {
        message.success('Supplier updated successfully!');
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error('Error updating supplier:', error);

      if (error.response) {
        const errorMessage = error.response.data.message || 'Failed to update supplier';
        message.error(errorMessage);
      } else {
        message.error('An error occurred while updating supplier');
      }
    }
  };

  return (
    <Modal title="Edit Supplier" open={visible} onOk={handleUpdate} onCancel={onClose} style={{ top: 20 }} >
      <Form form={form} layout="vertical" initialValues={supplier}>
        <Form.Item name="name" label="Supplier Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Address" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditSupplier;
