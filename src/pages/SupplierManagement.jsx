import React from 'react'
import { Breadcrumb } from 'antd';
import SuppliersTable from '../components/Supplier/SuppliersTable'

const SuppliersManagement = () => {
  return (
    <div className='p-3 bg-gray-200 h-[89vh]'>
      <div className="flex flex-col px-3">
        <Breadcrumb
          items={[
            { title: 'Home' },
            { title: <a href="">Application List</a> },
            { title: 'User Management' },
          ]}
        />
      </div>
      <SuppliersTable />
    </div>
  )
}

export default SuppliersManagement