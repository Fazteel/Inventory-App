// TransactionDetailsModal.jsx
import React from 'react';
import { Modal, Table } from 'antd';

const TransactionDetails = ({ visible, onClose, transaction }) => {
  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  };

  const columns = [
    {
      title: 'Product ID',
      dataIndex: 'product_id',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (price) => `${formatRupiah(price)}`,
    },
    {
      title: 'Subtotal',
      render: (record) => `${formatRupiah(record.quantity * record.price)}`,
    },
  ]

  return (
    <Modal title={'Transaction Details'} open={visible} onCancel={onClose} footer={null} width={600} >
      {transaction && (
        <div>
          <p><strong>Date:</strong> {new Date(transaction.transaction_date).toLocaleString()}</p>
          <p><strong>Total Amount:</strong> {formatRupiah(transaction.total_amount)}</p>

          <Table dataSource={transaction.items} pagination={false} columns={columns} />
        </div>
      )}
    </Modal>
  );
};

export default TransactionDetails;
