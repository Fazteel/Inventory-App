import React, { useEffect, useState } from 'react';
import { Card, List, Typography, Spin } from 'antd';

const { Text } = Typography;

const HighValues = () => {
    const [ products, setProducts ] = useState([]);

    useEffect(() => {
        const fetchHighValueProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products/high-values', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                setProducts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching high-value products:", error);
            }
        };

        fetchHighValueProducts();
    }, []);

    const formatRupiah = (value) => {
        return new Intl.NumberFormat({ style: 'currency', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    };

    return (
        <Card bordered={false} className='w-full h-80'>
            <div className="flex items-center justify-center mb-2 pt-2">
                <h5 className="text-xl font-semibold leading-none text-gray-900 dark:text-white">Highest Values</h5>
            </div>
            <List
                itemLayout="horizontal"
                dataSource={products} // Always pass an array
                renderItem={(item) => (
                    <List.Item className='p-3'>
                        <List.Item.Meta
                            title={<Text className='font-semibold text-gray-800'>{item.product_name}</Text>}
                        />
                        <div className="flex justify-between items-center font-bold w-20">
                            <span className="text-gray-900">Rp.</span>
                            <span className="text-gray-900">
                                {formatRupiah(item.total_sales)}
                            </span>
                        </div>
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default HighValues;
