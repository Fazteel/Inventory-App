import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../server/contexts/authContext';
// Logo
import Logo from '../assets/icons/logo.svg';
// Icons
import { LuBox } from 'react-icons/lu';
import { FaCartShopping, FaGear } from 'react-icons/fa6';
import { AiFillProduct } from "react-icons/ai";
import { TbUsers, TbReport } from 'react-icons/tb';

const { Sider } = Layout;
const { SubMenu } = Menu;

const SiderComponent = ({ collapsed }) => {
  const location = useLocation();
  const { user } = useAuth(); // Mengambil data user dari context
  const [openKeys, setOpenKeys] = useState([]);

  // Function untuk memeriksa apakah user memiliki permission
  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  // Function untuk memeriksa apakah suatu menu harus ditampilkan
  const shouldShowMenuItem = (permissions) => {
    if (!permissions) return true; // Jika tidak ada permission yang diperlukan, tampilkan menu
    if (Array.isArray(permissions)) {
      return permissions.some(permission => hasPermission(permission));
    }
    return hasPermission(permissions);
  };

  const items = [
    {
      key: '/',
      icon: <LuBox />,
      label: 'Dashboard',
    },
    {
      key: '/users',
      icon: <TbUsers />,
      label: 'Users',
      permissions: ['read:users', 'read:roles'], 
      items: [
        {
          key: '/users/users',
          label: 'Data Users',
          permission: 'read:users'
        },
        {
          key: '/users/roles',
          label: 'Data Roles',
          permission: 'read:roles'
        },
      ]
    },
    {
      key: '/products',
      icon: <AiFillProduct />,
      label: 'Products',
      permissions: ['read:products', 'read:suppliers'], 
      items: [
        {
          key: '/products/products',
          label: 'Data Products',
          permission: 'read:products'
        },
        {
          key: '/products/suppliers',
          label: 'Data Suppliers',
          permission: 'read:suppliers'
        },
      ]
    },
    {
      key: '/transactions',
      icon: <FaCartShopping />,
      label: 'Transactions',
      permission: 'read:transactions'
    },
    {
      key: 'reports',
      icon: <TbReport />,
      label: 'Reports',
      permissions: ['reports:products', 'reports:transactions'],
      items: [
        {
          key: '/reports/products',
          label: 'Report Products',
          permission: 'reports:products'
        },
        {
          key: '/reports/transactions',
          label: 'Report Transactions',
          permission: 'reports:transactions'
        },
      ],
    },
    {
      key: '/settings',
      icon: <FaGear />,
      label: 'Settings',
      permission: 'read:settings'
    },
  ];

  // Filter menu items berdasarkan permission
  const filterMenuItems = (menuItems) => {
    return menuItems.filter(item => {
      // Cek apakah item memiliki permission yang diperlukan
      const hasRequiredPermission = shouldShowMenuItem(item.permission || item.permissions);
      
      if (!hasRequiredPermission) return false;

      // Jika item memiliki sub-items, filter juga sub-itemsnya
      if (item.items) {
        const filteredItems = item.items.filter(subItem => 
          shouldShowMenuItem(subItem.permission || subItem.permissions)
        );
        
        // Jika tidak ada sub-items yang tersisa setelah filtering, jangan tampilkan parent menu
        if (filteredItems.length === 0) return false;
        
        item.items = filteredItems;
      }

      return true;
    });
  };

  const filteredItems = filterMenuItems(items);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (latestOpenKey) {
      setOpenKeys([latestOpenKey]);
    } else {
      setOpenKeys([]);
    }
  };

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} className='fixed h-full left-0 z-10'>
      <div className="flex items-center justify-center mt-4 mb-2">
        <img src={Logo} alt="logo" className='w-10 hidden md:flex' />
        {!collapsed && (
          <span className='font-bold text-white ml-2 text-lg'>StockHawk</span>
        )}
      </div>
      <Menu 
        theme='dark' 
        mode='inline' 
        className='flex flex-col h-full space-y-4 my-3' 
        selectedKeys={[location.pathname]} 
        openKeys={openKeys} 
        onOpenChange={onOpenChange}
      >
        {filteredItems.map((item) =>
          item.items ? (
            <SubMenu key={item.key} icon={item.icon} title={item.label}>
              {item.items.map((child) => (
                <Menu.Item key={child.key}>
                  <Link to={child.key}>{child.label}</Link>
                </Menu.Item>
              ))}
            </SubMenu>
          ) : (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key}>{item.label}</Link>
            </Menu.Item>
          )
        )}
      </Menu>
    </Sider>
  );
};

export default SiderComponent;