import React, { useEffect, useState } from 'react';
import { Card, List, Typography, Spin } from 'antd';

const { Text } = Typography;

const BestProducts = () => {
    const [ transactions, setTransactions ] = useState([]);

    useEffect(() => {
        const fetchBestProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/transactions/best-products', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                setTransactions(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching best products:", error);
            }
        };

        fetchBestProducts();
    }, []);

    return (
        <Card bordered={false} className='w-full h-80'>
            <div className="flex items-center justify-center mb-2 pt-2">
                <h5 className="text-xl font-semibold leading-none text-gray-900 dark:text-white">Best Products</h5>
            </div>
            <List
                itemLayout="horizontal"
                dataSource={transactions} // Always pass an array
                renderItem={(item) => (
                    <List.Item className='p-3'>
                        <List.Item.Meta
                            title={<Text className='font-semibold text-gray-800'>{item.product_name}</Text>}
                        />
                        <div><Text className='font-bold text-gray-900'>{item.total_quantity}</Text></div>
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default BestProducts;
