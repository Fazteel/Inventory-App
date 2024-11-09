import React, { useState, useEffect } from 'react';
import { Table, Space, Typography, message, Modal, Button, Tooltip } from 'antd';
import { ExclamationCircleFilled, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';
import ProductDetails from './ProductDetails';

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addedBy, setAddedBy] = useState(null);
  const [permissions, setPermissions] = useState({
    canCreate: false,
    canUpdate: false,
    canDelete: false
  });

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.id) {
      setAddedBy(userInfo.id);
      setPermissions({
        canCreate: userInfo.permissions.includes('create:products'),
        canUpdate: userInfo.permissions.includes('update:products'),
        canDelete: userInfo.permissions.includes('delete:products')
      });
    }
    fetchProducts();
    fetchSuppliers();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/suppliers', {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      message.error('Failed to fetch suppliers');
    }
  };

  const handleProductAdded = () => {
    fetchProducts();
  };

  const handleEdit = (record) => {
    setEditingProduct(record);
  };

  const handleUpdate = () => {
    fetchProducts();
    setEditingProduct(null);
  };

  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this product?',
      icon: <ExclamationCircleFilled />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(id);
      },
    });
  };

  const handleDelete = async (id) => {
    try {
      if (!addedBy) {
        message.error('User not logged in');
        return;
      }

      const response = await axios.delete(`http://localhost:5000/api/products/${id}`, { data: { deleted_by: addedBy } });

      if (response.data) {
        message.success('Product deleted successfully!');
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('Failed to delete product');
    }
  };

  const showProductDetails = (record) => {
    setSelectedProduct(record);
    setDetailsVisible(true);
  };

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  };

  const columns = [
    {
      title: 'No',
      key: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name - b.name,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (text) => formatRupiah(text),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button icon={<EyeOutlined />} onClick={() => showProductDetails(record)} />
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

  return (
    <div className='p-3'>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Typography.Title level={4}>Products</Typography.Title>
        {permissions.canCreate && (
          <AddProduct onProductAdded={handleProductAdded} addedBy={addedBy} />
        )}
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={products}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
      {editingProduct && (
        <EditProduct
          visible={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          product={editingProduct}
          suppliers={suppliers}
          onUpdate={handleUpdate}
          addedBy={addedBy}
        />
      )}
      <ProductDetails
        visible={detailsVisible}
        onClose={() => setDetailsVisible(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductsTable;
