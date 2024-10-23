import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const AddProduct = ({ onProductAdded, addedBy }) => {
    const [ isModalVisible, setIsModalVisible ] = useState(false);
    const [ suppliers, setSuppliers ] = useState([]);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/suppliers');
                setSuppliers(response.data);
            } catch (error) {
                console.error('Error fetching suppliers:', error);
                message.error('Failed to fetch suppliers');
            }
        };

        if (isModalVisible) {
            fetchSuppliers();
        }
    }, [ isModalVisible ]);

    const showModal = () => {
        if (!addedBy) {
            message.error('Please login first to add products');
            return;
        }
        setIsModalVisible(true);
    };

    const handleAdd = async (values) => {
        try {
            if (!addedBy) {
                message.error('User  not logged in');
                return;
            }

            const productData = {
                ...values,
                added_by: addedBy
            };

            const response = await axios.post('http://localhost:5000/api/products/add', productData);

            if (response.data) {
                message.success('Product added successfully!');
                setIsModalVisible(false);
                onProductAdded();
            }
        } catch (error) {
            console.error('Error adding product:', error);

            if (error.response) {
                const errorMessage = error.response.data.message || 'Failed to add product';
                console.error('Server error details:', error.response.data);
                message.error(errorMessage);
            } else if (error.request) {
                message.error('Cannot connect to server. Please check your connection');
            } else {
                message.error('An error occurred while adding product');
            }
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            <Button
                type="primary"
                onClick={showModal}
                disabled={!addedBy} // Disable button jika user belum login
                title={!addedBy ? 'Please login first' : 'Add new product'}
            >
                Add Product
            </Button>

            <Modal
                title="Create New Product"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                style={{ top: 20 }}
            >
                <Form
                    layout="vertical"
                    onFinish={handleAdd}
                    initialValues={{ added_by: addedBy }}
                >
                    {/* Form items yang sudah ada */}
                    <Form.Item label="Name" name="name" rules={[ { required: true, message: 'Please input the product name!' } ]} style={{ marginBottom: '8px' }}>
                        <Input/>
                    </Form.Item>

                    <Form.Item label="Price" name="price" rules={[ { required: true, message: 'Please input the product price!' } ]} style={{ marginBottom: '8px' }}>
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        label="Quantity"
                        name="quantity"
                        rules={[ { required: true, message: 'Please input the product quantity!' } ]}
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginBottom: '8px', marginRight: '12px' }}
                    >
                        <Input type="number" min={1} />
                    </Form.Item>

                    <Form.Item
                        label="Supplier"
                        name="supplier_id"
                        rules={[ { required: true, message: 'Please select a supplier!' } ]}
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginBottom: '8px' }}
                    >
                        <Select>
                            {suppliers.map(supplier => (
                                <Option key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Product Description" name="description">
                        <Input.TextArea rows={4}/>
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

export default AddProduct;