import React, { useState, useEffect } from 'react';
import { Table, Space, Typography, Button, Tooltip, Modal, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import AddUser from './AddUser';
import EditUser from './EditUser';

const UsersTable = () => {
  const [ users, setUsers ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ filteredUsers, setFilteredUsers ] = useState([]);
  const [ searchQuery, setSearchQuery ] = useState('');
  const [ editingUser, setEditingUser ] = useState(null);
  const [ roles, setRoles ] = useState([]);
  const [ addedBy, setAddedBy ] = useState(null);
  const [ permissions, setPermissions ] = useState({
    canCreate: false,
    canUpdate: false,
    canDelete: false
  });

  const api = axios.create({
    baseURL: 'http://localhost:5000/api/users',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    const fetchPermissions = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo && userInfo.id) {
        setAddedBy(userInfo.id);
        try {
          const response = await axios.post('http://localhost:5000/api/roles/permissions', {
            userId: userInfo.id,
          });
          const canCreateUsers = response.data.permissions.includes('create:users');
          const canUpdateUsers = response.data.permissions.includes('update:users');
          const canDeleteUsers = response.data.permissions.includes('delete:users');
          setPermissions({
            canCreate: canCreateUsers,
            canUpdate: canUpdateUsers,
            canDelete: canDeleteUsers
          });
        } catch (error) {
          console.error('Error fetching permissions:', error);
        }
      }
      fetchUsers();
      fetchRoles();
    }
    fetchPermissions();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [ searchQuery, users ]);

  const handleSearch = (value) => {
    const query = value.toLowerCase();
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.response?.status === 401) {
        message.error('Please login again');
      } else {
        message.error('Failed to fetch users');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
      message.error('Failed to fetch roles');
    }
  };

  const handleEdit = (record) => {
    setEditingUser(record);
  };

  const handleUpdate = () => {
    fetchUsers();
    setEditingUser(null);
  };

  const handleDelete = async (id) => {
    try {
      if (!addedBy) {
        message.error("User  not logged in");
        return;
      }
      const response = await api.delete(`/${id}`, {
        data: { deletedBy: addedBy },
      });
      if (response.data) {
        message.success("User  deleted successfully!");
        fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user");
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
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
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
          {permissions.canUpdate && (
            <Tooltip title="Edit">
              <Button color='default' variant='solid' icon={<EditOutlined />} onClick={() => handleEdit(record)} />
            </Tooltip>
          )}
          {permissions.canDelete && (
            <Tooltip title="Delete">
              <Button color='danger' variant='solid' icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record.id)} />
            </Tooltip>
          )}
        </Space>
      ),
    }
  ];

  return (
    <div className='p-3'>
      <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between' }} className='items-end'>
        <div>
          <Typography.Title level={4}>Users</Typography.Title>
          <Input.Search
            placeholder="Search users..."
            allowClear
            onChange={handleSearchChange}
            style={{ width: 300 }}
            value={searchQuery}
          />
        </div>
        {permissions.canCreate && (
          <AddUser onUserAdded={handleUserAdded} />
        )}
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
      {editingUser && (
        <EditUser
          visible={!!editingUser}
          onClose={() => setEditingUser(null)}
          user={editingUser}
          roles={roles}
          onUpdate={handleUpdate}
          addedBy={addedBy}
        />
      )}
    </div>
  );
};

export default UsersTable;