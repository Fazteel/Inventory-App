import React from 'react'
import { Breadcrumb } from 'antd';
import SuppliersTable from '../components/Supplier/SuppliersTable'

const SuppliersManagement = () => {
  return (
    <div className='p-3 pt-0 bg-gray-200 h-[89vh]'>
      <SuppliersTable />
    </div>
  )
}

export default SuppliersManagement