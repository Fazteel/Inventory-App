// UserManagement.js
import React from 'react';
import { Breadcrumb } from 'antd';
import AddUser from '../components/Users/AddUser';
import RolesTable from '../components/Users/RolesTable';

const RolesManagement = () => {
  return (
    <div className='p-3 bg-gray-200 h-[89vh]'>
      <RolesTable />
    </div>
  );
};

export default RolesManagement;
