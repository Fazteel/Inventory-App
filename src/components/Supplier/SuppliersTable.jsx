import React, { useState, useEffect } from 'react';
import { Table, Space, Typography, message, Modal, Button, Tooltip } from 'antd';
import { ExclamationCircleFilled, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import AddSupplier from './AddSupplier';
import EditSupplier from './EditSupplier';
import SupplierDetails from './SupplierDetails';

const SuppliersTable = () => {
  const [ suppliers, setSuppliers ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ editingSupplier, setEditingSupplier ] = useState(null);
  const [ detailsVisible, setDetailsVisible ] = useState(false);
  const [ selectedSupplier, setSelectedSupplier ] = useState(null);
  const [ addedBy, setAddedBy ] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.id) {
      setAddedBy(userInfo.id);
    }
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/suppliers');
      setSuppliers(response.data);
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

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <div className='p-3'>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Typography.Title level={4}>Suppliers</Typography.Title>
        <AddSupplier onSupplierAdded={handleSupplierAdded} />
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={suppliers}
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
