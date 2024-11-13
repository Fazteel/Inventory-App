import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const UpdateUser = ({ user, visible, onClose, onUpdate }) => {
    const [form] = Form.useForm();
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/roles', {
                    params: { 
                        excludeAdmin: true
                    },
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                });
                setRoles(response.data);
            } catch (error) {
                console.error('Error fetching roles:', error);
                message.error('Failed to fetch roles');
            }
        };

        if (visible) {
            fetchRoles();
            // Set initial form values
            form.setFieldsValue({
                username: user.username,
                email: user.email,
                role_id: user.role_id
            });
        }
    }, [visible, user, form]);

    const handleSubmit = async (values) => {
        try {
            // Check if email changed and if it exists
            if (values.email !== user.email) {
                const emailCheckResponse = await axios.get('http://localhost:5000/api/users/check-email', {
                    params: { email: values.email },
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                });

                if (emailCheckResponse.data.exists) {
                    message.error('This email is already in use. Please use a different email.');
                    return;
                }
            }

            // Update user data including role
            await axios.put(`http://localhost:5000/api/users/update/${user.id}`, {
                username: values.username,
                email: values.email,
                role_id: values.role_id
            }, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });

            message.success('User updated successfully!');
            onClose();
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error updating user:', error);
            message.error('Failed to update user');
        }
    };

    return (
        <Modal
            title="Update User"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form 
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Name"
                    name="username"
                    rules={[{ required: true, message: 'Please input the name!' }]}
                    style={{ marginTop: '20px', marginBottom: '8px' }}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input the email!' }]}
                    style={{ marginBottom: '8px' }}
                >
                    <Input type="email" />
                </Form.Item>

                <Form.Item
                    label="Role"
                    name="role_id"
                    rules={[{ required: true, message: 'Please select the role!' }]}
                    style={{ marginBottom: '8px' }}
                >
                    <Select>
                        {roles.map(role => (
                            <Option key={role.id} value={role.id}>
                                {role.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full mt-4">
                        Update User
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateUser;
