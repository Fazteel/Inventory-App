import React, { useState, useEffect } from 'react';
import { Table, Space, Typography, message, Modal, Button, Tooltip, Input } from 'antd';
import { ExclamationCircleFilled, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import AddProduct from './AddProduct';
import AddStock from './AddStock';
import EditProduct from './EditProduct';
import ProductDetails from './ProductDetails';

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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
    const fetchPermissions = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo && userInfo.id) {
        setAddedBy(userInfo.id);
        try {
          const response = await axios.post('http://localhost:5000/api/roles/permissions', {
            userId: userInfo.id,
          });
          const canCreateProducts = response.data.permissions.includes('create:products');
          const canUpdateProducts = response.data.permissions.includes('update:products');
          const canDeleteProducts = response.data.permissions.includes('delete:products');
          setPermissions({
            canCreate: canCreateProducts,
            canUpdate: canUpdateProducts,
            canDelete: canDeleteProducts
          });
        } catch (error) {
          console.error('Error fetching permissions:', error);
        }
      }
      fetchProducts();
      fetchSuppliers();
    }
    fetchPermissions();
  }, []);

  // Add new useEffect for handling search filtering
  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, products]);

  const handleSearch = (value) => {
    const query = value.toLowerCase();
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.supplier_name.toLowerCase().includes(query) ||
      product.price.toString().includes(query) ||
      product.quantity.toString().includes(query)
    );
    setFilteredProducts(filtered);
  };

  // Update the onSearch handler for the Search component
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setProducts(response.data);
      setFilteredProducts(response.data); // Initialize filtered products with all products
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

  const handleStockAdded = () => {
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
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
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
      sorter: (a, b) => a.name.localeCompare(b.name),
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
      <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between' }} className='items-end'>
        <div>
          <Typography.Title level={4}>Products</Typography.Title>
          <Input.Search
            placeholder="Search products..."
            allowClear
            onChange={handleSearchChange}
            style={{ width: 300 }}
            value={searchQuery}
          />
        </div>
        <div className='flex gap-2'>
          {permissions.canCreate && (
            <AddStock onProductAdded={handleStockAdded} addedBy={addedBy} />
          )}
          {permissions.canCreate && (
            <AddProduct onProductAdded={handleProductAdded} addedBy={addedBy} />
          )}
        </div>
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={filteredProducts}
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