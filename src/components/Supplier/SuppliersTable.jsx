import React, { useState, useEffect } from 'react';
import { Table, Space, Typography, message, Modal, Button, Tooltip, Input } from 'antd';
import { ExclamationCircleFilled, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import AddSupplier from './AddSupplier';
import EditSupplier from './EditSupplier';
import SupplierDetails from './SupplierDetails';

const SuppliersTable = () => {
  const [ suppliers, setSuppliers ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ filteredSuppliers, setFilteredSuppliers ] = useState([]);
  const [ searchQuery, setSearchQuery ] = useState('');
  const [ editingSupplier, setEditingSupplier ] = useState(null);
  const [ detailsVisible, setDetailsVisible ] = useState(false);
  const [ selectedSupplier, setSelectedSupplier ] = useState(null);
  const [ addedBy, setAddedBy ] = useState(null);
  const [ permissions, setPermissions ] = useState({
    canCreate: false,
    canUpdate: false,
    canDelete: false
  })

  useEffect(() => {
    const fetchPermissions = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo && userInfo.id) {
        setAddedBy(userInfo.id);
        try {
          const response = await axios.post('http://localhost:5000/api/roles/permissions', {
            userId: userInfo.id,
          });
          const canCreateSuppliers = response.data.permissions.includes('create:suppliers');
          const canUpdateSuppliers = response.data.permissions.includes('update:suppliers');
          const canDeleteSuppliers = response.data.permissions.includes('delete:suppliers');
          setPermissions({
            canCreate: canCreateSuppliers,
            canUpdate: canUpdateSuppliers,
            canDelete: canDeleteSuppliers
          });
        } catch (error) {
          console.error('Error fetching permissions:', error);
        }
      }
      fetchSuppliers();
    }
    fetchPermissions();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [ searchQuery, suppliers ]);

  const handleSearch = (value) => {
    const query = value.toLowerCase();
    const filtered = suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(query) ||
      supplier.phone.toLowerCase().includes(query) ||
      supplier.email.toString().includes(query) ||
      supplier.address.toString().includes(query)
    );
    setFilteredSuppliers(filtered);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/suppliers');
      setSuppliers(response.data);
      setFilteredSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      message.error('Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleSupplierAdded = () => {
    fetchSuppliers();
  };

  const handleEdit = (record) => {
    setEditingSupplier(record);
  };

  const handleUpdate = () => {
    fetchSuppliers();
    setEditingSupplier(null);
  };

  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this supplier?',
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
      if (!addedBy) {
        message.error('User not logged in');
        return;
      }

      const response = await axios.delete(`http://localhost:5000/api/suppliers/${id}`, { data: { deleted_by: addedBy } });

      if (response.data) {
        message.success('Supplier deleted successfully!');
        fetchSuppliers();
      }
    } catch (error) {
      console.error('Error deleting supplier:', error);
      message.error('Failed to delete supplier');
    }
  };

  const showSupplierDetails = (record) => {
    setSelectedSupplier(record);
    setDetailsVisible(true);
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
      sorter: (a, b) => a.name - b.name,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      sorter: (a, b) => a.phone - b.phone,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email - b.email,
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
          <Tooltip title="View Details">
            <Button icon={<EyeOutlined />} onClick={() => showSupplierDetails(record)} />
          </Tooltip>
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
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <div className='p-3'>
      <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between' }} className='items-end'>
        <div>
          <Typography.Title level={4}>Suppliers</Typography.Title>
          <Input.Search
            placeholder="Search suppliers..."
            allowClear
            onChange={handleSearchChange}
            style={{ width: 300 }}
            value={searchQuery}
          />
        </div>
        {permissions.canCreate && (
          <AddSupplier onSupplierAdded={handleSupplierAdded} />
        )}
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={filteredSuppliers}
        onChange={onChange}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
      {editingSupplier && (
        <EditSupplier
          visible={!!editingSupplier}
          onClose={() => setEditingSupplier(null)}
          supplier={editingSupplier}
          onUpdate={handleUpdate}
          addedBy={addedBy}
        />
      )}
      <SupplierDetails
        visible={detailsVisible}
        onClose={() => setDetailsVisible(false)}
        supplier={selectedSupplier}
      />
    </div>
  );
};

export default SuppliersTable;
