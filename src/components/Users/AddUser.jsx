import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const AddUser = ({ onUserAdded }) => {
    const [ isModalVisible, setIsModalVisible ] = useState(false);
    const [ form ] = Form.useForm();
    const [ username, setUsername ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ roles, setRoles ] = useState([]);
    const [customMessage, setCustomMessage] = useState("");

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/roles', {
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

        if (isModalVisible) {
            fetchRoles();
        }
    }, [ isModalVisible ]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleSubmit = async (values) => {
        try {
            // Check if the email already exists
            const emailCheckResponse = await axios.get('http://localhost:5000/api/users/check-email', {
                params: { email: values.email },
            });

            if (emailCheckResponse.data.exists) {
                // Show error if email exists
                message.error('This email is already in use. Please use a different email.');
                return;
            }

            // If the email does not exist, proceed to add the user
            await axios.post('http://localhost:5000/api/users/add', {
                username: values.username,
                email: values.email,
                role_id: values.role_id,
            });

            message.success('User added successfully!');
            form.resetFields();
            setIsModalVisible(false);
            onUserAdded && onUserAdded();
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
                <Form layout="vertical" form={form} onFinish={handleSubmit}>
                    <Form.Item label="Name" name="username" rules={[ { required: true, message: 'Please input the name!' } ]} style={{ marginTop: '20px', marginBottom: '8px' }} >
                        <Input placeholder="Name" />
                    </Form.Item>

                    <Form.Item label="Email" name="email" rules={[ { required: true, message: 'Please input the email!' } ]} style={{ marginBottom: '8px' }} >
                        <Input type="email" placeholder="Email" />
                    </Form.Item>

                    <Form.Item label="Role" name="role_id" rules={[ { required: true, message: 'Please select the role!' } ]} style={{ marginBottom: '8px' }} >
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
                            Add new user
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AddUser;
