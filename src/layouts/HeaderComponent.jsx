import React from 'react'
import { Layout, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { GoBell } from "react-icons/go";
import ProfileImage from '../assets/images/Foto.jpg';

const { Header } = Layout;
const HeaderComponent = ({ collapsed, setCollapsed, colorBgContainer }) => {
  return (
    <Header style={{ padding: 0, background: colorBgContainer }}>
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
        <div className='flex items-center space-x-5'>
          <div className='flex items-center space-x-5'>
            <button className='relative text-2xl text-gray-600'>
              <GoBell size={26} />
              <span className='absolute top-0 right-0 -mt-1 -mr-1 flex justify-center items-center bg-blue-600 text-white font-semibold text-[10px] w-5 h-4 rounded-full border-2 border-white'>9</span>
            </button>
          </div>
        </div>
      </div>
    </Header>
  )
}

export default HeaderComponent