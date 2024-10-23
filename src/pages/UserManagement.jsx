// UserManagement.js
import React from 'react';
import { Breadcrumb } from 'antd';
import AddUser from '../components/Users/AddUser';
import UsersTable from '../components/Users/UsersTable';

const UserManagement = () => {
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
      <UsersTable />
    </div>
  );
};

export default UserManagement;