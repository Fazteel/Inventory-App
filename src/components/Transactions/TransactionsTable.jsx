import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import axios from 'axios';
import AddTransaction from './AddTransaction';

const TransactionsTable = () => {
  const [ transactions, setTransactions ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/transactions');
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  const handleTransactionAdded = () => {
    fetchTransactions();
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transaction_id',
      key: 'transaction_id',
    },
    {
      title: 'Product ID',
      dataIndex: 'product_id',
      key: 'product_id',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
    },
    {
      title: 'Transaction Date',
      dataIndex: 'transaction_date',
      key: 'transaction_date',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a className='bg-yellow-600 px-2 py-1 rounded-lg text-white'>Edit</a>
          <a className='bg-red-600 px-2 py-1 rounded-lg text-white'>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <div className='p-3'>
      <div className="pb-3">
        <AddTransaction onTransactionAdded={handleTransactionAdded} />
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={transactions}
        rowKey="id"
        pagination={{ pageSize: 5 }} />
    </div>
  )
}

export default TransactionsTable