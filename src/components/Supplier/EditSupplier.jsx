import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const EditSupplier = ({ visible, onClose, supplier, onUpdate, addedBy }) => {
  const [ form ] = Form.useForm();

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
        <Form.Item label="Name" name="name" rules={[ { required: true, message: 'Please input the supplier name!' } ]} style={{ marginBottom: '8px' }}>
          <Input />
        </Form.Item>

        <Form.Item label="Contact Person" name="contact_person" rules={[ { required: true, message: 'Please input the contact person!' } ]} style={{ marginBottom: '8px' }}>
          <Input />
        </Form.Item>

        <Form.Item label="Phone" name="phone" rules={[ { required: true, message: 'Please input the phone number!' } ]} style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginBottom: '8px', marginRight: '12px' }}>
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[ { required: true, message: 'Please input the email!' } ]} style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginBottom: '8px' }}>
          <Input />
        </Form.Item>

        <Form.Item label="Address" name="address" rules={[ { required: true, message: 'Please input the address!' } ]} style={{ marginBottom: '8px' }}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditSupplier;
