import React from 'react'
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import UsersTable from '../components/Users/UsersTable'
import AddUser from '../components/Users/AddUser'

const UserManagement = () => {
  return (
    <div className='p-3 bg-gray-200'>
      <div className="flex flex-col px-3">
        <Breadcrumb
          items={[
            {
              title: 'Home',
            },
            {
              title: <a href="">Application List</a>,
            },
            {
              title: 'An Application',
            },
          ]}
        />
        <div className="mt-3">
          <AddUser />
        </div>
      </div>
      <UsersTable />
    </div>
  )
}

export default UserManagement