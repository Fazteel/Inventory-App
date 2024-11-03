// ProductDetails.jsx
import React from 'react';
import { Modal, Descriptions } from 'antd';

const SupplierDetails = ({ visible, onClose, supplier }) => {

  return (
    <Modal title={'Supplier Details'} open={visible} onCancel={onClose} footer={null} width={600}>
      {supplier && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Supplier Name">{supplier.name}</Descriptions.Item>
          <Descriptions.Item label="Contact">{supplier.contact_person}</Descriptions.Item>
          <Descriptions.Item label="Phone">{supplier.phone}</Descriptions.Item>
          <Descriptions.Item label="Email">{supplier.email}</Descriptions.Item>
          <Descriptions.Item label="Address">{supplier.address || 'N/A'}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default SupplierDetails;
