import React, { useEffect, useState } from 'react';
import { List, Skeleton, Tag, Button, Space } from 'antd';
import {
    InboxOutlined,
    PlusCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    StockOutlined
} from '@ant-design/icons';
import { AiFillProduct } from "react-icons/ai";

const ProductNotifications = () => {
    const [ loading, setLoading ] = useState(true);
    const [ notifications, setNotifications ] = useState([]);
    const [ page, setPage ] = useState(1);
    const [ allLoaded, setAllLoaded ] = useState(false); // State untuk melacak apakah semua notifikasi sudah dimuat
    const pageSize = 4;

    const fetchNotifications = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products/notifications', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Mengurutkan notifikasi berdasarkan waktu (dari yang terbaru)
            const sortedData = data.sort((a, b) => {
                const dateA = new Date(a.details.createdAt || a.details.updatedAt || a.details.deletedAt);
                const dateB = new Date(b.details.createdAt || b.details.updatedAt || b.details.deletedAt);
                return dateB - dateA; // Urutkan dari yang terbaru ke yang terlama
            });

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

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'low_stock':
                return <AiFillProduct style={{ fontSize: '20px', color: '#ff4d4f' }} />;
            case 'new_product':
                return <PlusCircleOutlined style={{ fontSize: '20px', color: '#52c41a' }} />;
            case 'product_updated':
                return <EditOutlined style={{ fontSize: '20px', color: '#1890ff' }} />;
            case 'product_deleted':
                return <DeleteOutlined style={{ fontSize: '20px', color: '#f5222d' }} />;
            case 'stock_added':
                return <StockOutlined style={{ fontSize: '20px', color: '#13c2c2' }} />;
            default:
                return <InboxOutlined style={{ fontSize: '20px', color: '#666' }} />;
        }
    };

    const getTagColor = (type, severity) => {
        switch (type) {
            case 'low_stock':
                return severity === 'high' ? 'error' : 'warning';
            case 'new_product':
                return 'success';
            case 'product_updated':
                return 'processing';
            case 'product_deleted':
                return 'error';
            case 'stock_added':
                return 'success';
            default:
                return 'default';
        }
    };

    const getTagText = (item) => {
        switch (item.type) {
            case 'low_stock':
                return `Sisa: ${item.details.currentQuantity}`;
            case 'new_product':
                return 'Baru';
            case 'product_updated':
                return 'Diperbarui';
            case 'product_deleted':
                return 'Dihapus';
            case 'stock_added':
                return `+${item.details.quantity}`;
            default:
                return '';
        }
    };

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

    const loadMoreButtonText = allLoaded ? 'Muat Lebih Sedikit' : 'Muat Lebih Banyak';

    if (notifications.length === 0 && !loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                    <AiFillProduct style={{ fontSize: '24px', color: '#ff4d4f' }} />
                    <h2 className="text-lg font-semibold m-0">Notifikasi Produk</h2>
                </div>
                <div className="text-center py-8 text-gray-500">
                    Tidak ada notifikasi
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
                <AiFillProduct style={{ fontSize: '24px', color: '#ff4d4f' }} />
                <h2 className="text-lg font-semibold m-0">Notifikasi Produk</h2>
            </div>

            <List
                className="demo-loadmore-list"
                loading={loading}
                itemLayout="horizontal"
                loadMore={
                    <div className="text-center mt-4">
                        <Button onClick={loadMore} type="primary">
                            {loadMoreButtonText}
                        </Button>
                    </div>
                }
                dataSource={displayedNotifications}
                renderItem={(item) => {
                    return (
                        <List.Item
                            key={item.id}
                            className="hover:bg-gray-50 transition-colors"
                        >
                            <Skeleton avatar title={false} loading={loading} active>
                                <List.Item.Meta
                                    avatar={
                                        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                                            {getNotificationIcon(item.type)}
                                        </div>
                                    }
                                    title={
                                        <Space>
                                            <span className="font-medium">{item.details.productName}</span>
                                            <Tag color={getTagColor(item.type, item.severity)}>
                                                {getTagText(item)}
                                            </Tag>
                                        </Space>
                                    }
                                    description={
                                        <div className="text-sm text-gray-500">
                                            {item.type === 'low_stock' && (
                                                <p className="m-0">Supplier: {item.details.supplier}</p>
                                            )}
                                            <p className="m-0 mt-1">{item.message}</p>
                                            {item.details.createdAt && (
                                                <p className="m-0 text-xs text-gray-400">
                                                    Dibuat pada: {new Date(item.details.createdAt).toLocaleString()}
                                                </p>
                                            )}
                                            {item.details.updatedAt && (
                                                <p className="m-0 text-xs text-gray-400">
                                                    Diperbarui pada: {new Date(item.details.updatedAt).toLocaleString()}
                                                </p>
                                            )}
                                            {item.details.deletedAt && (
                                                <p className="m-0 text-xs text-gray-400">
                                                    Dihapus pada: {new Date(item.details.deletedAt).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    }
                                />
                            </Skeleton>
                        </List.Item>
                    );
                }}
            />
        </div>
    );
};

export default ProductNotifications;