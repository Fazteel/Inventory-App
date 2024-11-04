import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Select, InputNumber, Space, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const AddTransaction = ({ onTransactionAdded, addedBy }) => {
    const [ isModalVisible, setIsModalVisible ] = useState(false);
    const [ products, setProducts ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ form ] = Form.useForm();
    const [ items, setItems ] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
        } catch (error) {
            message.error('Failed to fetch products');
            console.error('Error fetching products:', error);
        }
    };

    const showModal = () => {
        if (!addedBy) {
            message.error('Please login first to add transactions');
            return;
        }
        setIsModalVisible(true);
        setItems([]);
        form.resetFields();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        try {
            const transaction = {
                added_by: addedBy,
                items: items.map(item => ({
                    product_id: item.product_id, 
                    product_name: item.name, 
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            await axios.post('http://localhost:5000/api/transactions', transaction);
            message.success('Transaction created successfully');
            onTransactionAdded();
            setIsModalVisible(false);
            form.resetFields();
            setItems([]);
        } catch (error) {
            console.error('Error creating transaction:', error);
            message.error(error.response?.data?.error || 'Failed to create transaction');
        } finally {
            setLoading(false);
        }
    };

    const addItem = () => {
        const values = form.getFieldsValue();
        if (values.product_id && values.quantity) {
            const product = products.find(p => p.id === values.product_id);
            setItems([ ...items, {
                product_id: values.product_id,
                name: product.name,
                quantity: values.quantity,
                price: product.price
            } ]);
            form.setFieldsValue({ product_id: undefined, quantity: undefined });
        }
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    // Format angka menjadi Rupiah
    const formatRupiah = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    };

    return (
        <div>
            <Button type="primary" onClick={showModal}>
                Add Transaction
            </Button>

            <Modal title="Create New Transaction" open={isModalVisible} onCancel={handleCancel} footer={null} style={{ top: 20 }} >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Space style={{ width: '100%', marginBottom: 16 }}>
                        <Form.Item name="product_id" style={{ width: 200 }} >
                            <Select placeholder="Select product">
                                {products.map(product => (
                                    <Option key={product.id} value={product.id}>
                                        {product.name} - {formatRupiah(product.price)}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item name="quantity" style={{ width: 120 }} >
                            <InputNumber min={1} placeholder="Quantity" />
                        </ Form.Item>

                        <Button type="dashed" onClick={addItem}>
                            Add Item
                        </Button>
                    </Space>

                    {/* Items List */}
                    {items.map((item, index) => (
                        <div key={index} style={{ padding: '8px', marginBottom: '8px', border: '1px solid #f0f0f0', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div>{item.name}</div>
                                <div>Quantity: {item.quantity} × {formatRupiah(item.price)}</div>
                                <div>Subtotal: {formatRupiah(item.quantity * item.price)}</div>
                            </div>
                            <Button type="link" danger onClick={() => removeItem(index)}>
                                Remove
                            </Button>
                        </div>
                    ))}

                    <div style={{ borderTop: '1px solid #f0f0f0', marginTop: '16px', paddingTop: '16px' }}>
                        <strong>Total Amount: {formatRupiah(items.reduce((sum, item) =>
                            sum + (item.price * item.quantity), 0).toFixed(2))}</strong>
                    </div>

                    <Form.Item style={{ marginTop: '16px' }}>
                        <Button type="primary" htmlType="submit" disabled={items.length === 0}>
                            Create Transaction
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AddTransaction;