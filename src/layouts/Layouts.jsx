import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'
import { Layout, theme } from 'antd';
import SiderComponent from './SiderComponent';
import HeaderComponent from './HeaderComponent';

const { Content } = Layout;

const Layouts = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout className='min-h-screen'>
            <SiderComponent collapsed={collapsed} />
            <Layout>
                <HeaderComponent
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    colorBgContainer={colorBgContainer}
                />
                <Content style={{ background: colorBgContainer }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}

export default Layouts