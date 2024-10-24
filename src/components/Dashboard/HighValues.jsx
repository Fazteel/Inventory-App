import React, { useEffect, useState } from 'react';
import { Card, List, Typography, Spin } from 'antd';

const { Text } = Typography;

const HighValues = () => {
    const [ products, setProducts ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const fetchHighValueProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products/high-values'); // Ganti dengan endpoint API yang sesuai
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching high-value products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHighValueProducts();
    }, []);

    // Format angka menjadi Rupiah
    const formatRupiah = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    };

    if (loading) {
        return <Spin tip="Loading..." />; 
    }

    return (
        <Card bordered={false} className='w-full h-80'>
            <div className="flex items-center justify-center mb-4 pt-2">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Highest Values</h5>
            </div>
            <List itemLayout="horizontal" dataSource={products} renderItem={(item) => (
                <List.Item className='p-3'>
                    <List.Item.Meta
                        title={<Text strong>{item.name}</Text>}
                    />
                    <div><Text>{formatRupiah(item.value)}</Text></div>
                </List.Item>
            )}
            />
        </Card>
    );
};

export default HighValues;
