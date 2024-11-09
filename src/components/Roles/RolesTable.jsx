import React, { useState, useEffect } from 'react';
import { Table, Space, Typography, Button, Tooltip, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import AddRole from './AddRole';
import EditRole from './EditRole';

const RolesTable = () => {
  const [ roles, setRoles ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ selectedRole, setSelectedRole ] = useState(null);
  const [ isEditModalVisible, setIsEditModalVisible ] = useState(false);

  useEffect(() => {
    fetchRoles(); // Fetch roles when the component mounts
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/roles', {
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

  const handleEdit = (role) => {
    setSelectedRole(role);
    setIsEditModalVisible(true);
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setSelectedRole(null);
    fetchRoles();
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

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/roles/${id}`);
      if (response.data) {
        message.success('Role deleted successfully!');
        fetchRoles();
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      message.error('Failed to delete role');
    }
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
      sorter: (a, b) => a.name.localeCompare(b.name),
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
      {selectedRole && (
        <EditRole
          visible={isEditModalVisible}
          role={selectedRole}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
};

export default RolesTable;