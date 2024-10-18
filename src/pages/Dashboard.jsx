import React from 'react'
import DataCard from '../components/DataCard'
import ProductStatistics from '../components/ProductStatistics'
import BestProducts from '../components/BestProducts'

const Dashboard = () => {
  return (
    <div className='p-3'>
      <DataCard />
      <div className="flex flex-col md:flex-row gap-4 my-4">
        <div className="w-full md:w-3/4">
          <ProductStatistics />
        </div>
        <div className="w-full md:w-1/4 mt-28 md:mt-0">
          <BestProducts />
        </div>
      </div>
    </div>
  )
}

export default Dashboard