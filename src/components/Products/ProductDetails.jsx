// ProductDetails.jsx
import React from 'react';
import { Modal, Descriptions } from 'antd';

const ProductDetails = ({ visible, onClose, product }) => {
  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  };

  return (
    <Modal title={'Product Details'} open={visible} onCancel={onClose} footer={null} width={600}>
      {product && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Product Name">{product.name}</Descriptions.Item>
          <Descriptions.Item label="Price">{formatRupiah(product.price)}</Descriptions.Item>
          <Descriptions.Item label="Quantity">{product.quantity}</Descriptions.Item>
          <Descriptions.Item label="Supplier">{product.supplier_name}</Descriptions.Item>
          <Descriptions.Item label="Description">{product.description || 'N/A'}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default ProductDetails;
