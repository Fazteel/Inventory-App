import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'
import { Layout, theme } from 'antd';
import { FloatButton } from 'antd';
import SiderComponent from '../components/SiderComponent';
import HeaderComponent from '../components/HeaderComponent';

const { Content } = Layout;

const Layouts = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout className='min-h-screen overflow-hidden'>
            <SiderComponent collapsed={collapsed} />
            <Layout style={{ marginLeft: collapsed ? 80 : 200 }} className='w-full'>
                <HeaderComponent
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    colorBgContainer={colorBgContainer}
                />
                <Content style={{ background: colorBgContainer }} className='h-full'>
                    <Outlet />
                </Content>
            </Layout>
            <FloatButton.BackTop />
        </Layout>
    )
}

export default Layouts