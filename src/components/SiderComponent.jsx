import React from 'react';
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

const SiderComponent = ({ collapsed }) => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <LuBox />,
      label: 'Dashboard',
    },
    {
      key: '/users',
      icon: <TbUsers />,
      label: 'Users',
    },
    {
      key: '/products',
      icon: <AiFillProduct />,
      label: 'Products',
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
      children: [
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
      <div className="flex items-center justify-center my-3">
        <img src={Logo} alt="logo" className='w-10 hidden md:flex' />
        {!collapsed && (
          <span className='font-bold text-white ml-2 text-lg'>StockHawk</span>
        )}
      </div>
      <Menu theme='dark' mode='inline' className='flex flex-col h-full gap-1.5 space-y-4' selectedKeys={[location.pathname]} >
        {menuItems.map((item) => 
          item.children ? (
            <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
              {item.children.map((child) => (
                <Menu.Item key={child.key}>
                  <Link to={child.key}>{child.label}</Link>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
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