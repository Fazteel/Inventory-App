import React from 'react'
import { Breadcrumb } from 'antd';
import TransactionsTable from '../components/Transactions/TransactionsTable'

const TransactionManagement = () => {
  return (
    <div className='p-3 bg-gray-200 h-[89vh]'>
      <TransactionsTable />
    </div>
  )
}

export default TransactionManagement