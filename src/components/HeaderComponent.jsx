import React from 'react'
import { Layout, Button, Avatar, Dropdown } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, AntDesignOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { GoBell } from "react-icons/go";
import ProfileImage from '../assets/images/Foto.jpg';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const HeaderComponent = ({ collapsed, setCollapsed, colorBgContainer }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Hapus token dari localStorage
    localStorage.removeItem('token');

    // Optional: Hapus data user lain jika ada
    localStorage.removeItem('user');

    // Redirect ke halaman login
    navigate('/login');
  };

  const items = [
    {
      key: '1',
      label: 'My Account',
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: 'Profile',
      icon: <UserOutlined />,
      extra: '⌘P',
      onClick: () => navigate('/profile'),
    },
    {
      key: '3',
      label: 'Logout',
      icon: <LogoutOutlined />,
      extra: '⌘S',
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <Header style={{ padding: 0, background: colorBgContainer }} >
      <div className='flex justify-between items-center bg-white drop-shadow'>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
        <div className='flex items-center mr-6'>
          <Dropdown menu={{ items }} placement="bottomRight" trigger={[ 'click' ]} >
            <Avatar src={ProfileImage} size={30} icon={<AntDesignOutlined />} className='cursor-pointer'/>
          </Dropdown>
        </div>
      </div>
    </Header>
  )
}

export default HeaderComponent