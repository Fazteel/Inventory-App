import React, { useState } from 'react';
import { Modal, Button, Form, Input, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const AddUser = ({ onUserAdded }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async (values) => {
        try {
            // Kirim data ke backend
            await axios.post('http://localhost:5000/api/users/add', values);
            message.success('User added successfully!');

            // Reset form dan tutup modal
            form.resetFields();
            setIsModalVisible(false);
            // Panggil callback untuk memperbarui daftar pengguna
            if (onUserAdded) {
                onUserAdded();
            }
        } catch (error) {
            console.error('Error adding user:', error);
            message.error('Failed to add user.');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            <Button type="primary" onClick={showModal}>
                Add User
            </Button>

            <Modal title="Create New User" open={isModalVisible} onCancel={handleCancel} footer={null}>
                <Form layout="vertical" form={form} onFinish={handleOk}>
                    <Form.Item label="Name" name="username" rules={[{ required: true, message: 'Please input the name!' }]} style={{ marginTop: '20px', marginBottom: '8px' }} >
                        <Input placeholder="Name" />
                    </Form.Item>

                    <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input the email!' }]} style={{ marginBottom: '8px' }} >
                        <Input type="email" placeholder="Email" />
                    </Form.Item>

                    <Form.Item label="Role" name="role_id" rules={[{ required: true, message: 'Please select the role!' }]} style={{ marginBottom: '8px' }} >
                        <Select placeholder="Select role">
                            <Option value={1}>Admin</Option>
                            <Option value={2}>Manager</Option>
                            <Option value={3}>Staff</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full mt-4">
                            Add new user
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AddUser;
