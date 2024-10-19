import React from 'react';
import { Card, Space } from 'antd';

const Settings = () => {
  return (
    <div className='p-3 bg-gray-200'>
      <Space direction="vertical" size="middle" className='flex' >
        <Card title="Card" size="large" className='bg-gray-100'>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
        <Card title="Card" size="large" className='bg-gray-100'>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
        <Card title="Card" size="large" className='bg-gray-100'>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
      </Space>
    </div>
  )
}

export default Settings