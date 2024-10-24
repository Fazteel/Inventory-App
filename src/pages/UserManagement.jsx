// UserManagement.js
import React from 'react';
import { Breadcrumb } from 'antd';
import AddUser from '../components/Users/AddUser';
import UsersTable from '../components/Users/UsersTable';

const UserManagement = () => {
  return (
    <div className='p-3 bg-gray-200 h-[89vh]'>
      <UsersTable />
    </div>
  );
};

export default UserManagement;
