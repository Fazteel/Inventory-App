import React from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const EditProduct = ({ visible, onClose, product, suppliers, onUpdate, addedBy }) => {
    const [ form ] = Form.useForm();

    const handleUpdate = async () => {
        try {
            if (!addedBy) {
                message.error('User  not logged in');
                return;
            }

            const values = await form.validateFields();
            const productData = {
                ...values,
                updated_by: addedBy
            };

            console.log('Sending update data:', productData);

            const response = await axios.put(`http://localhost:5000/api/products/${product.id}`, productData);

            if (response.data) {
                message.success('Product updated successfully!');
                onUpdate();
                onClose();
            }
        } catch (error) {
            console.error('Error updating product:', error);

            if (error.response) {
                const errorMessage = error.response.data.message || 'Failed to update product';
                console.error('Server error details:', error.response.data);
                message.error(errorMessage);
            } else if (error.request) {
                message.error('Cannot connect to server. Please check your connection');
            } else {
                message.error('An error occurred while updating product');
            }
        }
    };

    return (
        <Modal title="Edit Product" open={visible} onOk={handleUpdate} onCancel={onClose} >
            <Form form={form} layout="vertical" initialValues={product}>
                <Form.Item label="Name" name="name" rules={[ { required: true, message: 'Please input the product name!' } ]} className='mb-2.5'>
                    <Input />
                </Form.Item>

                <Form.Item label="Price" name="price" rules={[ { required: true, message: 'Please input the product price!' } ]} className='mb-2.5'
                    style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginBottom: '8px', marginRight: '12px' }} >
                    <Input prefix='Rp' />
                </Form.Item>

                <Form.Item label="Supplier" name="supplier_id" rules={[ { required: true, message: 'Please select a supplier!' } ]}
                    style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginBottom: '8px' }} >
                    <Select>
                        {suppliers.map(supplier => (
                            <Option key={supplier.id} value={supplier.id}>
                                {supplier.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Product Description" name="description">
                    <Input.TextArea rows={4} />
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default EditProduct;