import React, { useEffect, useRef, useState } from 'react';
import ApexCharts from 'apexcharts';
import axios from 'axios';

const TransactionStatistics = () => {
    const [ chartData, setChartData ] = useState({
        categories: [],
        series: []
    });
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);
    const [ filter, setFilter ] = useState('7days'); // Default filter: 7 days
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        fetchData();
    }, [ filter ]); // Fetch data every time filter changes

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/transactions/transactions-stats?filter=${filter}`, {
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
            const sortedData = [ ...data ].sort((a, b) => new Date(a.date) - new Date(b.date));

            const categories = sortedData.map(item => {
                const date = new Date(item.date);
                return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
            });

            const series = [ {
                name: 'Sales',
                data: sortedData.map(item => parseFloat(item.total_sales))
            } ];

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
                        formatter: (value) => 'Rp ' + value.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
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
                colors: [ '#3B82F6' ],
                tooltip: {
                    theme: 'dark',
                    x: {
                        show: true
                    },
                    y: {
                        formatter: (value) => 'Rp ' + value.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                    }
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
    }, [ chartData ]);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

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

    const latestTotal = chartData.series[ 0 ]?.data.reduce((acc, currentValue) => acc + currentValue, 0) || 0;

    return (
        <div className="w-full h-auto bg-white shadow-md rounded-xl dark:bg-gray-800">
            <div className="flex justify-between p-3 px-4 md:p-6 pb-0 md:pb-0">
                <div>
                    <h5 className="leading-none text-2xl font-bold text-gray-900 dark:text-white mb-2.5">
                        Rp {latestTotal.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </h5>
                    <p className="text-md font-normal text-gray-500 dark:text-gray-400">
                        Sales this week
                    </p>
                </div>
                <div>
                    <select value={filter} onChange={handleFilterChange} className="bg-white text-gray-800 border border-gray-300 rounded-md p-1" >
                        <option value="today">Today</option>
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="all">All Data</option>
                    </select>
                </div>
            </div>
            <div ref={chartRef} className="px-3 py-2 bg-white rounded-xl dark:bg-gray-800" />
            {/* Last updated info */}
            <div className="text-xs text-gray-500 text-right px-4 pb-2">
                Last updated: {new Date().toLocaleTimeString('id-ID', {
                    timeZone: 'Asia/Jakarta',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </div>
        </div>
    );
};

export default TransactionStatistics;
