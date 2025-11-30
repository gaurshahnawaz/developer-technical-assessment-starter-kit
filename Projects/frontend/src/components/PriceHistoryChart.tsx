import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface PriceDataPoint {
  month: string;
  price: number;
  averageMarket: number;
}

interface PriceHistoryChartProps {
  propertyId: string;
}

const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ propertyId }) => {
  // Generate simulated price history data based on property ID
  const generatePriceHistory = (): PriceDataPoint[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const basePrice = 250000 + (parseInt(propertyId) % 100) * 5000;
    const data: PriceDataPoint[] = [];

    for (let i = 0; i < 12; i++) {
      const variance = (Math.sin(i) * 20000) + (Math.random() * 10000);
      const marketVariance = (Math.sin(i * 0.8) * 15000) + (Math.random() * 5000);
      
      data.push({
        month: months[i],
        price: Math.floor(basePrice + (i * 5000) + variance),
        averageMarket: Math.floor(basePrice + (i * 3500) + marketVariance),
      });
    }

    return data;
  };

  const data = generatePriceHistory();

  const formatPrice = (value: number) => {
    return `₹${(value / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">Price History (12 Months)</h3>
      <p className="chart-description">
        Property price trend compared to market average in this location
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="month" 
            stroke="#666"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#666"
            tickFormatter={formatPrice}
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            formatter={(value: number) => formatPrice(value)}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '8px'
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ fill: '#2563eb', r: 4 }}
            activeDot={{ r: 6 }}
            name="Property Price"
            isAnimationActive={true}
          />
          <Line
            type="monotone"
            dataKey="averageMarket"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#94a3b8', r: 3 }}
            name="Market Average"
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceHistoryChart;
