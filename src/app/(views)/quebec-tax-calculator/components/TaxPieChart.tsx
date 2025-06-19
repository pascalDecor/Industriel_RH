import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { formatCurrency } from './utils/formatters';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TaxPieChartProps {
  netIncome: number;
  totalTax: number;
}

export const TaxPieChart: React.FC<TaxPieChartProps> = ({ netIncome, totalTax }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = netIncome + totalTax;
  
  const data = {
    labels: ['Take Home Pay', 'Total Deductions'],
    datasets: [
      {
        data: [netIncome, totalTax],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(96, 165, 250, 0.8)',
        ],
        borderColor: [
          'rgba(255, 255, 255, 0.8)',
          'rgba(255, 255, 255, 0.8)',
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(96, 165, 250, 1)',
        ],
        hoverBorderColor: [
          'rgba(22, 163, 74, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        hoverBorderWidth: 4,
        hoverOffset: 12,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        bottom: 40,
        left: 40,
        right: 40
      }
    },
    cutout: '60%',
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 500,
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 14,
            weight: 'bold' as const,
          },
          usePointStyle: true,
          pointStyle: 'circle',
          generateLabels: (chart: any) => {
            const datasets = chart.data.datasets;
            return datasets[0].data.map((data: number, i: number) => ({
              text: `${chart.data.labels[i]} (${formatCurrency(data)})`,
              fillStyle: hoveredIndex === i ? 
                datasets[0].hoverBackgroundColor[i] : 
                datasets[0].backgroundColor[i],
              hidden: false,
              index: i,
              strokeStyle: hoveredIndex === i ?
                datasets[0].hoverBorderColor[i] :
                datasets[0].borderColor[i],
              pointStyle: 'circle',
            }));
          },
        },
        onHover: (event: any, elements: any) => {
          if (elements?.length) {
            setHoveredIndex(elements[0].index);
          } else {
            setHoveredIndex(null);
          }
        },
      },
      tooltip: {
        enabled: true,
        position: 'nearest' as const,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        titleColor: '#1e293b',
        bodyColor: '#1e293b',
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13,
        },
        padding: 12,
        boxPadding: 6,
        cornerRadius: 8,
        displayColors: false,
        yAlign: 'bottom' as const,
        xAlign: 'center' as const,
        caretSize: 8,
        caretPadding: 8,
        callbacks: {
          title: function(tooltipItems: any) {
            return tooltipItems[0].label;
          },
          label: function(context: any) {
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return [
              `Amount: ${formatCurrency(value)}`,
              `Percentage: ${percentage}%`,
              context.dataIndex === 0 ? 
                'This is your take-home pay after all deductions' :
                'Total of all taxes and deductions including CPP and EI'
            ];
          },
        },
      },
    },
    onHover: (_: any, elements: any) => {
      if (elements?.length) {
        setHoveredIndex(elements[0].index);
      } else {
        setHoveredIndex(null);
      }
    },
  };

  return (
    <div className="w-full max-w-xl mx-auto pt-4">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8 shadow-lg">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Annual Take-Home Pay
        </h3>
        <div className="text-4xl font-bold text-center text-green-600 mb-2">
          {formatCurrency(netIncome)}
        </div>
        <div className="text-center text-gray-600">
          <div className="text-lg mb-1">
            Monthly: {formatCurrency(netIncome / 12)}
          </div>
          <div className="text-lg">
            Bi-weekly: {formatCurrency(netIncome / 26)}
          </div>
        </div>
      </div>
      
      <h4 className="text-center text-gray-700 font-medium mb-6">Income Distribution</h4>
      <div className="relative" style={{ height: '400px' }}>
        <Pie data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-sm">
            {hoveredIndex !== null ? (
              <div className="text-center transition-all duration-300 transform scale-105">
                <div className="text-sm text-gray-600 mb-1">
                  {data.labels[hoveredIndex]}
                </div>
                <div className="text-xl font-semibold text-gray-800 mb-1">
                  {formatCurrency(data.datasets[0].data[hoveredIndex])}
                </div>
                <div className="text-sm font-medium" style={{
                  color: hoveredIndex === 0 ? 'rgb(22, 163, 74)' : 'rgb(59, 130, 246)'
                }}>
                  {((data.datasets[0].data[hoveredIndex] / total) * 100).toFixed(1)}%
                </div>
              </div>
            ) : (
              <div className="text-center transition-all duration-300">
                <div className="text-sm text-gray-600 mb-1">Total Income</div>
                <div className="text-xl font-semibold text-gray-800">
                  {formatCurrency(total)}
                </div>
                <div className="text-sm text-gray-500">Annual</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};