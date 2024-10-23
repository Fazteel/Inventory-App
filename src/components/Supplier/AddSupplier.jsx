import React, { useState } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
import axios from 'axios';

const AddSupplier = ({ onSupplierAdded = () => {} }) => { // Updated prop name
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async (values) => {
        try {
            // Send supplier data to backend
            await axios.post('http://localhost:5000/api/suppliers/add', values);
            message.success('Supplier added successfully!');
            setIsModalVisible(false);
            onSupplierAdded(); // Call the function to update the suppliers list
        } catch (error) {
            console.error('Error adding supplier:', error);
            message.error('Failed to add supplier.');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            <Button type="primary" onClick={showModal}>
                Add Supplier
            </Button>

            <Modal title="Add new Supplier" open={isModalVisible} onCancel={handleCancel} footer={null} style={{ top: 20 }}>
                <Form layout="vertical" onFinish={handleOk}>
                    <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the supplier name!' }]} style={{ marginBottom: '8px' }}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Contact Person" name="contact_person" rules={[{ required: true, message: 'Please input the contact person!' }]} style={{ marginBottom: '8px' }}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please input the phone number!' }]} style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginBottom: '8px', marginRight: '12px' }}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input the email!' }]} style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginBottom: '8px' }}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please input the address!' }]} style={{ marginBottom: '8px' }}>
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full mt-4">
                            Add new supplier
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AddSupplier;
