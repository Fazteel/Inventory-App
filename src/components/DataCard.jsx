import React from 'react'
import { Card, Row, Col } from 'antd';
import { AiFillProduct, AiFillDollarCircle } from "react-icons/ai";
import { GrTransaction } from "react-icons/gr";

const DataCard = () => {
    return (
        <Row gutter={[ 16, 16 ]}>
            <Col xs={24} md={12} xl={8}>
                <Card bordered={false} style={{ height: '160px' }} bodyStyle={{ padding: '24px', height: '100%' }} className='drop-shadow-md' >
                    <div className="flex items-center h-full">
                        <div className="flex items-center justify-center bg-blue-400 w-1/4 h-full p-2 rounded-lg mr-4">
                            <AiFillProduct size={30} color='#003070' />
                        </div>
                        <div>
                            <p className='font-semibold text-sm'>Total Products</p>
                            <h5 className="text-3xl font-bold tracking-tight text-gray-900">230</h5>
                        </div>
                    </div>
                </Card>
            </Col>
            <Col xs={24} md={12} xl={8}>
                <Card bordered={false} style={{ height: '160px' }} bodyStyle={{ padding: '24px', height: '100%' }} className='drop-shadow-md' >
                    <div className="flex items-center h-full">
                        <div className="flex items-center justify-center bg-red-400 w-1/4 h-full rounded-lg mr-4">
                            <GrTransaction size={30} color='#940602' />
                        </div>
                        <div>
                            <p className='font-semibold text-sm'>Total Sales</p>
                            <h5 className="text-3xl font-bold tracking-tight text-gray-900">420</h5>
                        </div>
                    </div>
                </Card>
            </Col>
            <Col xs={24} md={12} xl={8}>
                <Card bordered={false} style={{ height: '160px' }} bodyStyle={{ padding: '24px', height: '100%' }} className='drop-shadow-md' >
                    <div className="flex items-center h-full">
                        <div className="flex items-center justify-center bg-green-400 w-1/4 h-full rounded-lg mr-4">
                            <AiFillDollarCircle size={30} color='#03660a' />
                        </div>
                        <div>
                            <p className='font-semibold text-sm'>Total Income</p>
                            <h5 className="text-3xl font-bold tracking-tight text-gray-900">$12,423</h5>
                        </div>
                    </div>
                </Card>
            </Col>
        </Row>
    )
}

export default DataCard