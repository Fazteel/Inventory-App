import React from 'react';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const EditProduct = ({ visible, onClose, product, suppliers, onUpdate, addedBy }) => {
    const [form] = Form.useForm();

    const handleUpdate = async () => {
        try {
            // Validasi user ID
            if (!addedBy) {
                message.error('User  not logged in');
                return;
            }

            const values = await form.validateFields();
            const productData = {
                ...values,
                updated_by: addedBy // Menyertakan ID pengguna yang melakukan pembaruan
            };

            // Log untuk debugging
            console.log('Sending update data:', productData);

            const response = await axios.put(`http://localhost:5000/api/products/${product.id}`, productData);

            if (response.data) {
                message.success('Product updated successfully!');
                onUpdate(); // Memperbarui daftar produk
                onClose(); // Menutup modal setelah update
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
        <Modal
            title="Edit Product"
            open={visible}
            onOk={handleUpdate}
            onCancel={onClose}
        >
            <Form form={form} layout="vertical" initialValues={product}>
                <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="supplier_id"
                    label="Supplier"
                    rules={[{ required: true, message: 'Please select a supplier!' }]}
                >
                    <Select>
                        {suppliers.map(supplier => (
                            <Option key={supplier.id} value={supplier.id}>
                                {supplier.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditProduct;