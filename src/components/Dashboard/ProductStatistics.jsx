import React, { useEffect, useRef, useState } from 'react';
import ApexCharts from 'apexcharts';
import axios from 'axios';

const ProductStatistics = () => {
    const [chartData, setChartData] = useState({
        categories: [],
        series: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/products/products-stats', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            });

            const data = response.data;

            if (!Array.isArray(data)) {
                console.error('Invalid data format:', data);
                setError('Invalid data format received from server');
                return;
            }

            // Sort data by date
            const sortedData = [...data].sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateA - dateB;
            });

            const categories = sortedData.map(item => {
                const date = new Date(item.date);
                return date.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short'
                });
            });

            const series = [
                {
                    name: 'Total Products',
                    data: sortedData.map(item => parseInt(item.total_products))
                },
                {
                    name: 'Stock In',
                    data: sortedData.map(item => parseInt(item.total_quantity_in))
                },
                {
                    name: 'Stock Out',
                    data: sortedData.map(item => parseInt(item.total_quantity_out))
                }
            ];

            setChartData({ categories, series });
            setError(null);
        } catch (error) {
            console.error('Error details:', error.response || error);
            setError(`Failed to load data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (chartRef.current && chartData.categories.length > 0) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const options = {
                chart: {
                    type: 'line',
                    height: 330,
                    background: 'transparent',
                    toolbar: {
                        show: false
                    }
                },
                series: chartData.series,
                xaxis: {
                    categories: chartData.categories,
                    labels: {
                        style: {
                            fontFamily: 'Inter, sans-serif',
                            colors: '#6B7280'
                        },
                        rotate: 0
                    },
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    }
                },
                yaxis: {
                    labels: {
                        formatter: (value) => Math.round(value),
                        style: {
                            colors: '#6B7280'
                        }
                    }
                },
                grid: {
                    borderColor: '#E5E7EB',
                    strokeDashArray: 4
                },
                stroke: {
                    curve: 'smooth',
                    width: 3
                },
                colors: ['#3B82F6', '#10B981', '#EF4444'], 
                tooltip: {
                    theme: 'dark',
                    x: {
                        show: true
                    }
                },
                legend: {
                    show: true,
                    position: 'top',
                    horizontalAlign: 'right'
                }
            };

            chartInstance.current = new ApexCharts(chartRef.current, options);
            chartInstance.current.render();
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [chartData]);

    if (loading) {
        return (
            <div className="w-full h-[400px] bg-white rounded-xl dark:bg-gray-800 flex items-center justify-center">
                <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-[400px] bg-white rounded-xl dark:bg-gray-800 flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    const latestProducts = chartData.series[0]?.data[chartData.series[0]?.data.length - 1] || 0;
    const latestQuantityIn = chartData.series[1]?.data[chartData.series[1]?.data.length - 1] || 0;
    const latestQuantityOut = chartData.series[2]?.data[chartData.series[2]?.data.length - 1] || 0;

    return (
        <div className="w-full h-auto bg-white shadow-md rounded-xl dark:bg-gray-800">
            <div className="flex justify-between p-4 md:p-6 pb-0 md:pb-0">
                <div className="flex justify-between w-full px-2">
                    <div>
                        <h5 className="leading-none text-2xl font-bold text-gray-900 dark:text-white pb-2">
                            {latestProducts.toLocaleString()}
                        </h5>
                        <p className="text-md font-normal text-gray-500 dark:text-gray-400">
                            Total Products
                        </p>
                    </div>
                    <div className='flex gap-4'>
                        <div>
                            <h5 className="leading-none text-2xl font-bold text-emerald-500 pb-2">
                                {latestQuantityIn.toLocaleString()}
                            </h5>
                            <p className="text-md font-normal text-gray-500 dark:text-gray-400">
                                Stock In
                            </p>
                        </div>
                        <div>
                            <h5 className="leading-none text-2xl font-bold text-red-500 pb-2">
                                {latestQuantityOut.toLocaleString()}
                            </h5>
                            <p className="text-md font-normal text-gray-500 dark:text-gray-400">
                                Stock Out
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div ref={chartRef} className="px-3 py-2 bg-white rounded-xl dark:bg-gray-800" />
        </div>
    );
};

export default ProductStatistics;