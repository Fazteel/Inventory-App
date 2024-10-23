import React from 'react'
import { Breadcrumb } from 'antd';
import ProductsTable from '../components/Products/ProductsTable'

const ProductManagement = () => {
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
      <ProductsTable />
    </div>
  )
}

export default ProductManagement