import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const AddStock = ({ onProductAdded, addedBy }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
                message.error('Failed to fetch products');
            }
        };

        if (isModalVisible) {
            fetchProducts();
        }
    }, [isModalVisible]);

    const handleAdd = async (values) => {
        try {
            if (!addedBy) {
                message.error('User not logged in');
                return;
            }

            const productData = {
                product_id: values.product_id, // Changed from supplier_id to product_id
                quantity: values.quantity,
                added_by: addedBy
            };

            // Changed to use the add-stock endpoint directly
            const response = await axios.post('http://localhost:5000/api/products/add-stock', productData);

            if (response.data) {
                message.success('Stock added successfully!');
                setIsModalVisible(false);
                onProductAdded();
            }
        } catch (error) {
            console.error('Error adding stock:', error);

            if (error.response) {
                const errorMessage = error.response.data.message || 'Failed to add stock';
                console.error('Server error details:', error.response.data);
                message.error(errorMessage);
            } else if (error.request) {
                message.error('Cannot connect to server. Please check your connection');
            } else {
                message.error('An error occurred while adding stock');
            }
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const showModal = () => {
        if (!addedBy) {
            message.error('Please login first to add stock');
            return;
        }
        setIsModalVisible(true);
    };

    return (
        <div>
            <Button 
                color="default" 
                variant="solid" 
                onClick={showModal} 
                disabled={!addedBy} 
                title={!addedBy ? 'Please login first' : 'Add stock'}
            >
                Add Stock
            </Button>

            <Modal 
                title="Add Stock Product" 
                open={isModalVisible} 
                onCancel={handleCancel} 
                footer={null}
            >
                <Form 
                    layout="vertical" 
                    onFinish={handleAdd} 
                    initialValues={{ added_by: addedBy }}
                >
                    <Form.Item 
                        label="Product" 
                        name="product_id"  // Changed from supplier_id to product_id
                        rules={[{ required: true, message: 'Please select a product!' }]}
                        style={{ display: 'inline-block', width: '100%', marginBottom: '8px' }} 
                        className='mt-4'
                    >
                        <Select>
                            {products.map(product => (
                                <Option key={product.id} value={product.id}>
                                    {product.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item 
                        label="Quantity" 
                        name="quantity" 
                        rules={[{ required: true, message: 'Please input the quantity!' }]}
                        style={{ display: 'inline-block', width: '100%', marginRight: '12px' }}
                    >
                        <Input type="number" min={1} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className='mt-3 w-full'>
                            Add Stock
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AddStock;