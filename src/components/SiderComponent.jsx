import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
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

  // State to manage the open keys for collapsible sub-menus
  const [ openKeys, setOpenKeys ] = useState([]);

  // Handle opening and closing of sub-menus
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);

    // Close all other sub-menus if a new one is opened
    if (latestOpenKey) {
      setOpenKeys([ latestOpenKey ]);
    } else {
      setOpenKeys([]);
    }
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
      items: [
        {
          key: '/users/users',
          label: 'Data Users',
        },
        {
          key: '/users/roles',
          label: 'Data Roles',
        },
      ]
    },
    {
      key: '/products',
      icon: <AiFillProduct />,
      label: 'Products',
      items: [
        {
          key: '/products/products',
          label: 'Data Products',
        },
        {
          key: '/products/suppliers',
          label: 'Data Suppliers',
        },
      ]
    },
    {
      key: '/transactions',
      icon: <FaCartShopping />,
      label: 'Transactions',
    },
    {
      key: 'reports',
      icon: <TbReport />,
      label: 'Reports',
      items: [
        {
          key: '/reports/products',
          label: 'Report Products',
        },
        {
          key: '/reports/transactions',
          label: 'Report Transactions',
        },
      ],
    },
    {
      key: '/settings',
      icon: <FaGear />,
      label: 'Settings',
    },
  ];

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} className='fixed h-full left-0 z-10'>
      <div className="flex items-center justify-center mt-4 mb-2">
        <img src={Logo} alt="logo" className='w-10 hidden md:flex' />
        {!collapsed && (
          <span className='font-bold text-white ml-2 text-lg'>StockHawk</span>
        )}
      </div>
      <Menu theme='dark' mode='inline' className='flex flex-col h-full space-y-4 my-3' selectedKeys={[ location.pathname ]} openKeys={openKeys} onOpenChange={onOpenChange} >
        {items.map((item) =>
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
