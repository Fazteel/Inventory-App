import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin } from 'antd';
import { AiFillProduct, AiFillDollarCircle } from "react-icons/ai";
import { GrTransaction } from "react-icons/gr";
import axios from 'axios';

const DataCard = () => {
    const [ totalProducts, setTotalProducts ] = useState(0);
    const [ totalIn, setTotalIn ] = useState(0);
    const [ totalOut, setTotalOut ] = useState(0);
    const [ totalAssets, setTotalAssets ] = useState(0);

    useEffect(() => {
        const fetchProductData = async () => {
            const token = localStorage.getItem('token'); 

            try {
                // Kirimkan token di header Authorization
                const productCount = await axios.get('http://localhost:5000/api/products/count', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTotalProducts(productCount.data.count);

                const productInResponse = await axios.get('http://localhost:5000/api/products/total-in', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTotalIn(productInResponse.data.total_in || 0);

                const productOutResponse = await axios.get('http://localhost:5000/api/transactions/total-out', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTotalOut(productOutResponse.data.total_out || 0);

                const assetsResponse = await axios.get('http://localhost:5000/api/products/total-assets', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTotalAssets(assetsResponse.data.total_assets || 0);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchProductData();
    }, []);

    // Format angka menjadi Rupiah
    const formatRupiah = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    };

    const getTextSize = (value) => {
        const formattedValue = formatRupiah(value);
        const length = formattedValue.length;

        if (length > 15) return 'text-lg';
        if (length > 12) return 'text-xl';
        return 'text-2xl';
    };

    return (
        <Row gutter={[ 16, 16 ]}>
            <Col xs={24} md={24} xl={12}>
                <Card bordered={false} style={{ height: '152px' }} styles={{ body: { padding: '18px', height: '100%' } }} className='drop-shadow-md'>
                    <div className="flex items-center h-full">
                        <div className="flex items-center justify-center bg-orange-400 w-1/4 h-full rounded-lg mr-2.5">
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
                <Card bordered={false} style={{ height: '152px' }} styles={{ body: { padding: '18px', height: '100%' } }} className='drop-shadow-md'>
                    <div className="flex items-center h-full">
                        <div className="flex items-center justify-center bg-red-400 w-1/4 h-full rounded-lg mr-2.5">
                            <GrTransaction size={30} color='#940602' />
                        </div>
                        <div className='w-1/2'>
                            <p className='font-semibold text-sm'>Stock Out</p>
                            <h5 className="text-3xl font-bold tracking-tight text-gray-900">{totalOut}</h5>
                        </div>
                    </div>
                </Card>
            </Col>
            <Col xs={24} md={24} xl={12}>
                <Card bordered={false} style={{ height: '152px' }} styles={{ body: { padding: '18px', height: '100%' } }} className='drop-shadow-md'>
                    <div className="flex items-center h-full">
                        <div className="flex items-center justify-center bg-blue-400 w-1/4 h-full rounded-lg mr-2.5">
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
                <Card bordered={false} style={{ height: '152px' }} styles={{ body: { padding: '18px', height: '100%' } }} className='drop-shadow-md'>
                    <div className="flex items-center h-full">
                        <div className="flex items-center justify-center bg-green-400 w-1/4 h-full rounded-lg mr-2.5">
                            <AiFillDollarCircle size={30} color='#03660a' />
                        </div>
                        <div className='w-1/2'>
                            <p className='font-semibold text-sm'>Total Assets</p>
                            <h5 className={`${getTextSize(totalAssets)} font-bold tracking-tight text-gray-900`}>{formatRupiah(totalAssets)}</h5>
                        </div>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default DataCard;
