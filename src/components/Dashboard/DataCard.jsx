import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin } from 'antd';
import { AiFillProduct, AiFillDollarCircle } from "react-icons/ai";
import { GrTransaction } from "react-icons/gr";
import axios from 'axios';

const DataCard = () => {
    const [ totalProducts, setTotalProducts ] = useState(0);
    const [ totalIn, setTotalIn ] = useState(0);
    const [ totalAssets, setTotalAssets ] = useState(0);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const productCount = await axios.get('http://localhost:5000/api/products/count');
                setTotalProducts(productCount.data.count);

                const productInResponse = await axios.get('http://localhost:5000/api/products/total-in');
                setTotalIn(productInResponse.data.total_in || 0);

                const assetsResponse = await axios.get('http://localhost:5000/api/products/total-assets');
                setTotalAssets(assetsResponse.data.total_assets || 0);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, []);

    // Format angka menjadi Rupiah
    const formatRupiah = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    };

    if (loading) {
        return <Spin size="large" />;
    }

    return (
        <Row gutter={[ 16, 16 ]}>
            <Col xs={24} md={24} xl={12}>
                <Card bordered={false} style={{ height: '160px' }} styles={{ body: { padding: '18px', height: '100%' } }} className='drop-shadow-md'>
                    <div className="flex items-center h-full">
                        <div className="flex items-center justify-center bg-orange-400 w-1/4 h-full rounded-lg mr-4">
                            <GrTransaction size={30} color='#940602' />
                        </div>
                        <div className='w-1/2'>
                            <p className='font-semibold text-sm'>Stock In</p>
                            <h5 className="text-3xl font-bold tracking-tight text-gray-900">{totalIn}</h5>
                        </div>
                    </div>
                </Card>
            </Col>
            <Col xs={24} md={24} xl={12}>
                <Card bordered={false} style={{ height: '160px' }} styles={{ body: { padding: '18px', height: '100%' } }} className='drop-shadow-md'>
                    <div className="flex items-center h-full">
                        <div className="flex items-center justify-center bg-red-400 w-1/4 h-full rounded-lg mr-4">
                            <GrTransaction size={30} color='#940602' />
                        </div>
                        <div className='w-1/2'>
                            <p className='font-semibold text-sm'>Stock Out</p>
                            <h5 className="text-3xl font-bold tracking-tight text-gray-900">0</h5>
                        </div>
                    </div>
                </Card>
            </Col>
            <Col xs={24} md={24} xl={12}>
                <Card bordered={false} style={{ height: '160px' }} styles={{ body: { padding: '18px', height: '100%' } }} className='drop-shadow-md'>
                    <div className="flex items-center h-full">
                        <div className="flex items-center justify-center bg-blue-400 w-1/4 h-full rounded-lg mr-4">
                            <AiFillProduct size={30} color='#003070' />
                        </div>
                        <div className='w-1/2'>
                            <p className='font-semibold text-sm'>Total Products</p>
                            <h5 className="text-3xl font-bold tracking-tight text-gray-900">{totalProducts}</h5>
                        </div>
                    </div>
                </Card>
            </Col>
            <Col xs={24} md={24} xl={12}>
                <Card bordered={false} style={{ height: '160px' }} styles={{ body: { padding: '18px', height: '100%' } }} className='drop-shadow-md'>
                    <div className="flex items-center h-full">
                        <div className="flex items-center justify-center bg-green-400 w-1/4 h-full rounded-lg mr-4">
                            <AiFillDollarCircle size={30} color='#03660a' />
                        </div>
                        <div className='w-1/2'>
                            <p className='font-semibold text-sm'>Total Assets</p>
                            <h5 className="text-2xl font-bold tracking-tight text-gray-900">{formatRupiah(totalAssets)}</h5>
                        </div>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default DataCard;