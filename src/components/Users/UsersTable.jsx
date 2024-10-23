import React, { useState, useEffect } from 'react';
import { Table, Space, Typography } from 'antd';
import axios from 'axios';
import AddUser from './AddUser';

const UsersTable = () => {
  const [ users, setUsers ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleUserAdded = () => {
    fetchUsers(); 
  };

  const columns = [
    {
      title: 'No',
      key: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role_name',
      key: 'role_name',
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
        <AddUser onUserAdded={handleUserAdded} />
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default UsersTable;