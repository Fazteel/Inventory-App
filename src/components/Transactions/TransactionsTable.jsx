import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Typography, Modal, Button, Tooltip } from 'antd';
import { EyeOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import AddTransaction from './AddTransaction';
import TransactionDetails from './TransactionDetails';

const TransactionsTable = () => {
  const [ transactions, setTransactions ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ detailsVisible, setDetailsVisible ] = useState(false);
  const [ selectedTransaction, setSelectedTransaction ] = useState(null);
  const [ addedBy, setAddedBy ] = useState(null);
  const [ permissions, setPermissions ] = useState({
    canCreate: false
  })

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.id) {
      setAddedBy(userInfo.id);
      setPermissions({
        canCreate: userInfo.permissions.includes('create:transactions')
      })
    }
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/transactions?userId=${addedBy}`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const showTransactionDetails = (record) => {
    setSelectedTransaction(record);
    setDetailsVisible(true);
  };

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Transaction ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
      sorter: (a, b) => a.total_amount - b.total_amount,
      render: (amount) => formatRupiah(amount),
    },
    {
      title: 'Items Count',
      key: 'items_count',
      sorter: (a, b) => a.items_count - b.items_count,
      render: (record) => record.items?.length || 0,
    },
    {
      title: 'Transaction Date',
      dataIndex: 'transaction_date',
      key: 'transaction_date',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Status',
      key: 'status',
      render: () => (
        <Tag color="green">Completed</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button color='default' variant='solid' icon={<EyeOutlined />} onClick={() => showTransactionDetails(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className='p-3'>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Typography.Title level={4}>Transactions</Typography.Title>
        {permissions.canCreate && (
          <AddTransaction addedBy={addedBy} onTransactionAdded={fetchTransactions} />
        )}
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={transactions}
        rowKey="transaction_id"
        pagination={{ pageSize: 5 }}
      />

      <TransactionDetails
        visible={detailsVisible}
        onClose={() => setDetailsVisible(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default TransactionsTable;
