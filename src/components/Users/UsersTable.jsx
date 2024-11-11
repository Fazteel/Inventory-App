import React, { useState, useEffect } from 'react';
import { Table, Space, Typography, Button, Tooltip, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import AddUser from './AddUser';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedBy, setAddedBy] = useState(null);

  // Create axios instance with default config
  const api = axios.create({
    baseURL: 'http://localhost:5000/api/users',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add request interceptor to add token
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo?.id) {
      setAddedBy(userInfo.id);
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.response?.status === 401) {
        message.error('Please login again');
        // Handle logout or redirect to login
      } else {
        message.error('Failed to fetch users');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!addedBy) {
        message.error('User not logged in');
        return;
      }

      const response = await api.delete(`/${id}`, {
        data: { deleted_by: addedBy }
      });

      if (response.data) {
        message.success('User deleted successfully!');
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user');
    }
  };

  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      icon: <ExclamationCircleFilled />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(id);
      }
    });
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
      sorter: (a, b) => a.username - b.username,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email - b.email,
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
          <Tooltip title="Edit">
            <Button color='default' variant='solid' icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button color='danger' variant='solid' icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record.id)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className='p-3'>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Typography.Title level={4}>Users</Typography.Title>
        <div className='flex gap-2'>
          <AddUser onUserAdded={handleUserAdded} />
        </div>
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
