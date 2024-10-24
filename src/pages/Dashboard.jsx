import React from 'react';
import { Row, Col } from 'antd';
import DataCard from '../components/Dashboard/DataCard'; 
import HighValues from '../components/Dashboard/HighValues';
import BestProducts from '../components/Dashboard/BestProducts';
import ProductStatistics from '../components/Dashboard/ProductStatistics';
import TransactionStatistics from '../components/Dashboard/TransactionStatistics';

const Dashboard = () => {
    return (
        <div className='p-3 bg-gray-200'>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={24} xl={12}>
                    <DataCard />
                </Col>
                <Col xs={24} md={24} xl={6}>
                    <BestProducts />
                </Col>
                <Col xs={24} md={24} xl={6}>
                    <HighValues />
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col xs={24} md={12}>
                    <ProductStatistics />
                </Col>
                <Col xs={24} md={12}>
                    <TransactionStatistics />
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
