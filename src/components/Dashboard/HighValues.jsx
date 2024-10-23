import React from 'react';
import { Card, List, Typography } from 'antd';

const { Text } = Typography;

const HighValues = () => {
    const products = [
        { name: 'Neil Sims', price: '$320' },
        { name: 'Bonnie Green', price: '$3467' },
        { name: 'Michael Gough', price: '$67' },
        { name: 'Lana Byrd', price: '$367' },
    ];

    return (
        <Card bordered={false} style={{ width: '100%', height: 'auto' }} >
            <div class="flex items-center justify-center mb-4 pt-2">
                <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Highest Assets</h5>
            </div>
            <List itemLayout="horizontal" dataSource={products} renderItem={(item) => (
                <List.Item className='p-3'>
                    <List.Item.Meta
                        title={<Text strong>{item.name}</Text>}
                    />
                    <div><Text>{item.price}</Text></div>
                </List.Item>
            )}
            />
        </Card>
    );
};

export default HighValues;
