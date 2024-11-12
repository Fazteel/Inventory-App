import React from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const EditUser  = ({ visible, onClose, user, roles, onUpdate, addedBy }) => {
    const [form] = Form.useForm();

    const handleUpdate = async () => {
        try {
            if (!addedBy) {
                message.error('User  not logged in');
                return;
            }

            const values = await form.validateFields();
            const userData = {
                ...values,
                updated_by: addedBy
            };

            console.log('Sending update data:', userData);

            const response = await axios.put(`http://localhost:5000/api/users/update/${user.id}`, userData);

            if (response.data) {
                message.success('User  updated successfully!');
                onUpdate();
                onClose();
            }
        } catch (error) {
            console.error('Error updating user:', error);

            if (error.response) {
                const errorMessage = error.response.data.message || 'Failed to update user';
                console.error('Server error details:', error.response.data);
                message.error(errorMessage);
            } else if (error.request) {
                message.error('Cannot connect to server. Please check your connection');
            } else {
                message.error('An error occurred while updating user');
            }
        }
    };

    return (
        <Modal title="Edit User" open={visible} onOk={handleUpdate} onCancel={onClose}>
            <Form form={form} layout="vertical" initialValues={user}>
                <Form.Item label="Name" name="username" rules={[{ required: true, message: 'Please input the user name!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input the user email!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Role" name="role_id" rules={[{ required: true, message: 'Please select a role!' }]}>
                    <Select>
                        {(roles && Array.isArray(roles) ? roles : []).map(role => (
                            <Option key={role.id} value={role.id}>
                                {role.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditUser ;