import React, { useState } from 'react';
import { Modal, Button, Form, Input, Select } from 'antd';

const { Option } = Select;

const UserAction = () => {
    const [ isModalVisible, setIsModalVisible ] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        // Handle form submission logic here
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            <Button type="primary" onClick={showModal}>
                Add User
            </Button>

            <Modal title="Create New Product" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null} style={{
                top: 20,
            }} >
                <Form layout="vertical" onFinish={handleOk}>
                    <Form.Item label="Name" name="name" rules={[ { required: true, message: 'Please input the product name!' } ]} style={{
                        marginBottom: '8px',
                    }} >
                        <Input placeholder="Type product name" />
                    </Form.Item>

                    <Form.Item label="Price" name="price" rules={[ { required: true, message: 'Please input the product price!' } ]} style={{
                        marginBottom: '8px',
                    }} >
                        <Input type="number" placeholder="$2999" />
                    </Form.Item>

                    <Form.Item label="Category" name="category" rules={[ { required: true, message: 'Please select a category!' } ]} style={{
                        display: 'inline-block',
                        width: 'calc(50% - 8px)',
                        marginRight: '10px',
                        marginBottom: '8px',
                    }}>
                        <Select placeholder="Select category">
                            <Option value="TV">TV/Monitors</Option>
                            <Option value="PC">PC</Option>
                            <Option value="GA">Gaming/Console</Option>
                            <Option value="PH">Phones</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Suplier" name="suplier" rules={[ { required: true, message: 'Please select a suplier!' } ]} style={{
                        display: 'inline-block',
                        width: 'calc(50% - 8px)',
                        marginBottom: '8px',
                    }}>
                        <Select placeholder="Select suplier">
                            <Option value="TV">TV/Monitors</Option>
                            <Option value="PC">PC</Option>
                            <Option value="GA">Gaming/Console</Option>
                            <Option value="PH">Phones</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Product Description" name="description" >
                        <Input.TextArea rows={4} placeholder="Write product description here" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add new product
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserAction;