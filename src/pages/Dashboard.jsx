import React from 'react';
import { Row, Col } from 'antd';
import DataCard from '../components/Dashboard/DataCard'; 
import HighValues from '../components/Dashboard/HighValues';
import BestProducts from '../components/Dashboard/BestProducts';
import ProductStatistics from '../components/Dashboard/ProductStatistics';
import TransactionStatistics from '../components/Dashboard/TransactionStatistics';
import ProductNotifications from '../components/Reports/ProductNotifications';
import TransactionNotifications from '../components/Reports/TransactionNotifications';
import { useAuth } from '../server/contexts/authContext';

const Dashboard = () => {
    const { user } = useAuth();

    // Permission check function
    const hasPermission = (permission) => {
        return user?.permissions?.includes(permission) || false;
    };

    return (
        <div className='p-3 bg-gray-200'>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={24} xl={12}>
                    {hasPermission('read:products') && <DataCard />}
                </Col>
                <Col xs={24} md={15} xl={7}>
                    {hasPermission('read:transactions') && <HighValues />}
                </Col>
                <Col xs={24} md={9} xl={5}>
                    {hasPermission('read:products') && <BestProducts />}
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col xs={24} md={12}>
                    {hasPermission('read:products') && <ProductStatistics />}
                </Col>
                <Col xs={24} md={12}>
                    {hasPermission('read:transactions') && <TransactionStatistics />}
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col xs={24} md={12}>
                    {hasPermission('reports:products') && <ProductNotifications />}
                </Col>
                <Col xs={24} md={12}>
                    {hasPermission('reports:transactions') && <TransactionNotifications />}
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
