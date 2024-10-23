import React, { useState, useEffect } from 'react';
import { Table, Space, Typography } from 'antd';
import axios from 'axios';
import AddSupplier from './AddSupplier'; // Changed from AddProduct to AddSupplier

const SuppliersTable = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/suppliers');
      setSuppliers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setLoading(false);
    }
  };

  const handleSupplierAdded = () => {
    fetchSuppliers(); // Fetch suppliers again after adding a new one
  };

  const columns = [
    {
      title: 'No',
      key: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Supplier Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Typography.Link>Edit</Typography.Link>
          <Typography.Link>Delete</Typography.Link>
        </Space>
      ),
    },
  ];

  return (
    <div className='p-3'>
      <div className='pb-3'>
        <AddSupplier onSupplierAdded={handleSupplierAdded} /> {/* Updated the prop name */}
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={suppliers}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default SuppliersTable;
