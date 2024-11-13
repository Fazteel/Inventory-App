import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Typography, Input, Button, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import AddTransaction from './AddTransaction';
import TransactionDetails from './TransactionDetails';

const TransactionsTable = () => {
  const [ transactions, setTransactions ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ detailsVisible, setDetailsVisible ] = useState(false);
  const [ selectedTransaction, setSelectedTransaction ] = useState(null);
  const [ addedBy, setAddedBy ] = useState(null);
  const [ filteredTransactions, setFilteredTransactions ] = useState([]);
  const [ searchQuery, setSearchQuery ] = useState('');
  const [ permissions, setPermissions ] = useState({
    canCreate: false
  })

  useEffect(() => {
    const fetchPermissions = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo && userInfo.id) {
        setAddedBy(userInfo.id);
        try {
          // Ambil permissions dari API
          const response = await axios.post('http://localhost:5000/api/roles/permissions', {
            userId: userInfo.id,
          });
          // Cek apakah user memiliki permission 'create:transactions'
          const canCreateTransaction = response.data.permissions.includes('create:transactions');
          setPermissions({ canCreate: canCreateTransaction });
        } catch (error) {
          console.error('Error fetching permissions:', error);
        }
      }
      fetchTransactions();
    };

    fetchPermissions();
  }, []);

  // Add new useEffect for handling search filtering
  useEffect(() => {
    handleSearch(searchQuery);
  }, [ searchQuery, transactions ]);

  const handleSearch = (value) => {
    const query = value.toLowerCase();
    const filtered = transactions.filter(transaction =>
      (transaction.id && transaction.id.toString().toLowerCase().includes(query)) ||
      (transaction.total_amount && transaction.total_amount.toString().toLowerCase().includes(query)) ||
      (transaction.items_count && transaction.items_count.toString().includes(query))
    );
    setFilteredTransactions(filtered);
  };  

  // Update the onSearch handler for the Search component
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/transactions?userId=${addedBy}`);
      setTransactions(response.data);
      setFilteredTransactions(response.data); 
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
      <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between' }} className='items-end'>
      <div>
          <Typography.Title level={4}>Transactions</Typography.Title>
          <Input.Search
            placeholder="Search transactions..."
            allowClear
            onChange={handleSearchChange}
            style={{ width: 300 }}
            value={searchQuery}
          />
        </div>
        {permissions.canCreate && (
          <AddTransaction addedBy={addedBy} onTransactionAdded={fetchTransactions} />
        )}
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={filteredTransactions}
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
