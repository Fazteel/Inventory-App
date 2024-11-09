import React, { useState, useEffect } from 'react';
import { Table, Space, Typography, Button, Tooltip, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import AddRole from './AddRole';

const RolesTable = () => {
  const [ roles, setRoles ] = useState([]); // Mengubah state dari users menjadi roles
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    fetchRoles(); // Mengambil data roles saat komponen di-mount
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/roles/roles', {
        headers: {
          Authorization: localStorage.getItem("token"),
        },      
      });
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
      message.error('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };  

  const handleDelete = async (id) => {
    try {
      // Menghapus role dengan ID yang diberikan
      await axios.delete(`http://localhost:5000/api/roles/${id}`);
      message.success('Role deleted successfully!');
      fetchRoles(); // Refresh the roles list after deletion
    } catch (error) {
      message.error('Failed to delete role');
      console.error('Error deleting role:', error);
    }
  };

  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this role?',
      icon: <ExclamationCircleFilled />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(id);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const columns = [
    {
      title: 'No',
      key: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
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
        <Typography.Title level={4}>Roles</Typography.Title>
        <div className='flex gap-2'>
          <AddRole onRoleAdded={fetchRoles} />
        </div>
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={roles}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default RolesTable;