import React, { useState, useEffect } from 'react';
import { Table, Space, Typography, Button, Tooltip, Modal, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import AddRole from './AddRole';
import EditRole from './EditRole';
import { useAuth } from '../../server/contexts/authContext'; 

const RolesTable = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([fetchUserRole(), fetchRoles()]);
    };

    initializeData();
  }, []);

  // Add new useEffect for handling search filtering
  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, roles]);

  const handleSearch = (value) => {
    const query = value.toLowerCase();
    const filtered = roles.filter(role => 
      role.name.toLowerCase().includes(query)
    );
    setFilteredRoles(filtered);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/users/me/role', {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      setUserRole(response.data);
    } catch (error) {
      console.error('Error fetching user role:', error);
      if (error.response?.status === 404) {
        message.warning('User role not found');
      } else {
        message.error('Failed to fetch user role');
      }
    }
  };

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/roles', {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      // Mengurutkan data dengan admin selalu di atas
      const sortedRoles = response.data.sort((a, b) => {
        if (a.id === 1) return -1;
        if (b.id === 1) return 1;
        return a.name.localeCompare(b.name);
      });

      setRoles(sortedRoles);
      setFilteredRoles(sortedRoles); // Initialize filtered roles with all roles
    } catch (error) {
      console.error('Error fetching roles:', error);
      message.error('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (role) => {
    if (userRole && role.id === userRole.id) {
      message.error("You cannot edit your own role");
      return;
    }
    setSelectedRole(role);
    setIsEditModalVisible(true);
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setSelectedRole(null);
    fetchRoles();
  };

  const showDeleteConfirm = (role) => {
    if (userRole && role.id === userRole.id) {
      message.error("You cannot delete your own role");
      return;
    }

    Modal.confirm({
      title: 'Are you sure you want to delete this role?',
      icon: <ExclamationCircleFilled />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(role.id);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/roles/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      if (response.data) {
        message.success('Role deleted successfully!');
        fetchRoles();
      }
    } catch (error) {
      if (error.response?.status === 403) {
        message.error(error.response.data.message);
      } else {
        console.error('Error deleting role:', error);
        message.error('Failed to delete role');
      }
    }
  };

  const nameColumnSorter = (a, b) => {
    if (a.id === 1) return -1;
    if (b.id === 1) return 1;
    return a.name.localeCompare(b.name);
  };

  const isActionDisabled = (record) => {
    return record.id === 1 || (userRole && record.id === userRole.id);
  };

  const getTooltipMessage = (record) => {
    if (record.id === 1) {
      return "Admin role cannot be modified";
    }
    if (userRole && record.id === userRole.id) {
      return "You cannot modify your own role";
    }
    return "";
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
      sorter: nameColumnSorter,
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const tooltipMessage = getTooltipMessage(record);

        if (isActionDisabled(record)) {
          return (
            <Tooltip title={tooltipMessage}>
              <Space size="small">
                <Button
                  disabled
                  color='default'
                  variant='solid'
                  icon={<EditOutlined />}
                />
                <Button
                  disabled
                  color='danger'
                  variant='solid'
                  icon={<DeleteOutlined />}
                />
              </Space>
            </Tooltip>
          );
        }

        return (
          <Space size="small">
            <Tooltip title="Edit">
              <Button
                color='default'
                variant='solid'
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                color='danger'
                variant='solid'
                icon={<DeleteOutlined />}
                onClick={() => showDeleteConfirm(record)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div className='p-3'>
      <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between' }} className='items-end'>
        <div>
          <Typography.Title level={4}>Roles</Typography.Title>
          <Input.Search
            placeholder="Search roles..."
            allowClear
            onChange={handleSearchChange}
            style={{ width: 300 }}
            value={searchQuery}
          />
        </div>
        <div className='flex gap-2'>
          <AddRole onRoleAdded={fetchRoles} />
        </div>
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={filteredRoles}
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