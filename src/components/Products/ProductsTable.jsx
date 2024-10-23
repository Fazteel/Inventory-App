import React, { useState, useEffect } from 'react';
import { Table, Space, Typography, message, Modal } from 'antd'; // Import Modal
import { ExclamationCircleFilled } from '@ant-design/icons'; // Import ikon
import axios from 'axios';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';

const ProductsTable = () => {
  const [ products, setProducts ] = useState([]);
  const [ suppliers, setSuppliers ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ editingProduct, setEditingProduct ] = useState(null);
  const [ addedBy, setAddedBy ] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.id) {
      setAddedBy(userInfo.id);
    }
    fetchProducts();
    fetchSuppliers();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/products');
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
      const response = await axios.get('http://localhost:5000/api/suppliers');
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
        handleDelete(id); // Panggil handleDelete setelah konfirmasi
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

  // Format angka menjadi Rupiah
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
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.name - b.name,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.price - b.price,
      render: (text) => formatRupiah(text),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      defaultSortOrder: 'ascend',
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
          <Typography.Link onClick={() => handleEdit(record)}>Edit</Typography.Link>
          <Typography.Link onClick={() => showDeleteConfirm(record.id)}>Delete</Typography.Link> {/* Ubah di sini */}
        </Space>
      ),
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <div className='p-3'>
      <div className='pb-3'>
        <AddProduct onProductAdded={handleProductAdded} addedBy={addedBy} />
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={products}
        onChange={onChange}
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
    </div>
  );
};

export default ProductsTable;