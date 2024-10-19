import React from 'react'
import DataCard from '../components/Dashboard/DataCard'
import ProductStatistics from '../components/Dashboard/ProductStatistics'
import BestProducts from '../components/Dashboard/BestProducts'
import DataTable from '../components/Dashboard/DataTable'

const Dashboard = () => {
  return (
    <div className='p-3 bg-gray-200'>
      <DataCard />
      <div className="flex flex-col md:flex-row gap-4 my-4">
        <div className="w-full md:w-3/4">
          <ProductStatistics />
        </div>
        <div className="w-full md:w-1/4 mt-28 md:mt-0">
          <BestProducts />
        </div>
      </div>
      <DataTable />
    </div>
  )
}

export default Dashboard