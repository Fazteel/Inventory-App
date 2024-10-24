import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

const TransactionStatistics = () => {
    const options = {
        chart: {
            type: 'line',
            height: 330,
            background: 'transparent'
        },
        series: [{
            name: 'Sales',
            data: [12000, 14000, 11000, 13000, 15000, 12000, 12500]
        }],
        xaxis: {
            categories: ['01 Feb', '02 Feb', '03 Feb', '04 Feb', '05 Feb', '06 Feb', '07 Feb'],
            labels: {
                style: {
                    fontFamily: 'Inter, sans-serif',
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                }
            }
        },
        yaxis: {
            labels: {
                formatter: (value) => '$' + value
            }
        },
    };

    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current && typeof ApexCharts !== 'undefined') {
            const chart = new ApexCharts(chartRef.current, options);
            chart.render();

            return () => chart.destroy();
        }
    }, [options]);

    return (
        <div>
            <div className="w-full h-auto bg-white drop-shadow-md rounded-xl dark:bg-gray-800">
                <div className="flex justify-between p-4 md:p-6 pb-0 md:pb-0">
                    <div>
                        <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">$12,423</h5>
                        <p className="text-base font-normal text-gray-500 dark:text-gray-400">Sales this week</p>
                    </div>
                    <div className="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
                        23%
                        <svg className="w-3 h-3 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13V1m0 0L1 5m4-4 4 4" />
                        </svg>
                    </div>
                </div>
                <div ref={chartRef} id="labels-chart" className="px-3 bg-white rounded-xl"></div>
            </div>
        </div>
    );
};

export default TransactionStatistics;
