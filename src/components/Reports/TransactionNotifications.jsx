import React, { useEffect, useState } from 'react';
import { List, Skeleton, Tag, Button, Space, Modal } from 'antd';
import { ShoppingOutlined, DollarOutlined, UserOutlined } from '@ant-design/icons';

const TransactionNotifications = () => {
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [page, setPage] = useState(1);
    const [allLoaded, setAllLoaded] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const pageSize = 4;

    const formatRupiah = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const fetchNotifications = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/transactions/notifications', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setNotifications(sortedData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const displayedNotifications = notifications.slice(0, page * pageSize);
    const hasMore = displayedNotifications.length < notifications.length;

    const loadMore = () => {
        if (allLoaded) {
            setPage(1);
            setAllLoaded(false);
        } else {
            setPage(prev => prev + 1);
            if (notifications.length <= (page + 1) * pageSize) {
                setAllLoaded(true);
            }
        }
    };

    const showTransactionDetails = (transaction) => {
        setSelectedTransaction(transaction);
    };

    if (notifications.length === 0 && !loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                    <ShoppingOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                    <h2 className="text-lg font-semibold m-0">Notifikasi Transaksi</h2>
                </div>
                <div className="text-center py-8 text-gray-500">
                    Tidak ada notifikasi transaksi
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
                <ShoppingOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                <h2 className="text-lg font-semibold m-0">Notifikasi Transaksi</h2>
            </div>

            <List
                className="demo-loadmore-list"
                loading={loading}
                itemLayout="horizontal"
                loadMore={
                    hasMore && (
                        <div className="text-center mt-4">
                            <Button onClick={loadMore} type="primary">
                                {allLoaded ? 'Muat Lebih Sedikit' : 'Muat Lebih Banyak'}
                            </Button>
                        </div>
                    )
                }
                dataSource={displayedNotifications}
                renderItem={(item) => (
                    <List.Item
                        key={item.transactionId}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => showTransactionDetails(item)}
                    >
                        <Skeleton avatar title={false} loading={loading} active>
                            <List.Item.Meta
                                avatar={
                                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                                        <DollarOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                                    </div>
                                }
                                title={
                                    <Space>
                                        <span className="font-medium">
                                            Transaksi #{item.transactionId}
                                        </span>
                                        <Tag color="processing">
                                            {formatRupiah(item.totalAmount)}
                                        </Tag>
                                    </Space>
                                }
                                description={
                                    <div className="text-sm text-gray-500">
                                        <p className="m-0 flex items-center gap-1">
                                            <UserOutlined /> {item.createdBy}
                                        </p>
                                        <p className="m-0 text-xs text-gray-400">
                                            {new Date(item.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                }
                            />
                        </Skeleton>
                    </List.Item>
                )}
            />

            <Modal
                title={`Detail Transaksi #${selectedTransaction?.transactionId}`}
                open={!!selectedTransaction}
                onCancel={() => setSelectedTransaction(null)}
                footer={null}
            >
                {selectedTransaction && (
                    <div>
                        <p><strong>Total:</strong> {formatRupiah(selectedTransaction.totalAmount)}</p>
                        <p><strong>Dibuat oleh:</strong> {selectedTransaction.createdBy}</p>
                        <p><strong>Waktu:</strong> {new Date(selectedTransaction.createdAt).toLocaleString()}</p>

                        <div className="mt-4">
                            <h4>Items:</h4>
                            <List
                                size="small"
                                dataSource={selectedTransaction.items}
                                renderItem={item => (
                                    <List.Item>
                                        <div>{item.product_name}</div>
                                        <div>{item.quantity} x {formatRupiah(item.price)}</div>
                                    </List.Item>
                                )}
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default TransactionNotifications;
