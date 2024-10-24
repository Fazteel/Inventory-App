import React from 'react'
import { Breadcrumb } from 'antd';
import ProductsTable from '../components/Products/ProductsTable'

const ProductManagement = () => {
  return (
    <div className='p-3 bg-gray-200 h-[89vh]'>
      <ProductsTable />
    </div>
  )
}

export default ProductManagement