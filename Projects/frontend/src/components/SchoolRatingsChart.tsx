import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface SchoolData {
  name: string;
  rating: number;
  distance: number;
}

interface SchoolRatingsChartProps {
  propertyId: string;
}

const SchoolRatingsChart: React.FC<SchoolRatingsChartProps> = ({ propertyId }) => {
  // Generate simulated school data based on property location
  const generateSchoolData = (): SchoolData[] => {
    const schoolNames = [
      'Al Noor School',
      'Muscat International',
      'Modern Academy',
      'Bright Future School',
      'Excel Academy',
      'Prime School'
    ];

    const idHash = parseInt(propertyId) % 100;
    const schools: SchoolData[] = [];

    for (let i = 0; i < 6; i++) {
      schools.push({
        name: schoolNames[i],
        rating: Math.floor((Math.sin(idHash + i) * 2 + 3.5) * 10) / 10,
        distance: Math.floor((Math.random() * 3 + 0.5) * 10) / 10
      });
    }

    return schools.sort((a, b) => b.rating - a.rating);
  };

  const schools = generateSchoolData();

  // Color coding based on rating
  const getBarColor = (rating: number): string => {
    if (rating >= 4.5) return '#10b981'; // Green
    if (rating >= 4.0) return '#3b82f6'; // Blue
    if (rating >= 3.5) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">Nearby Schools & Ratings</h3>
      <p className="chart-description">
        Quality schools in the vicinity (within 5 km radius)
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={schools} margin={{ top: 5, right: 30, left: 0, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={100}
            stroke="#666"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#666"
            domain={[0, 5]}
            label={{ value: 'Rating (out of 5)', angle: -90, position: 'insideLeft' }}
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            formatter={(value: number) => `${value.toFixed(1)}/5 ⭐`}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '8px'
            }}
            cursor={{ fill: 'rgba(37, 99, 235, 0.1)' }}
          />
          <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} />
          <Bar dataKey="rating" name="School Rating" isAnimationActive={true}>
            {schools.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.rating)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* School details table */}
      <div className="schools-list">
        <h4>School Details</h4>
        <div className="schools-table">
          {schools.map((school, index) => (
            <div key={index} className="school-item">
              <div className="school-name">{school.name}</div>
              <div className="school-rating">
                <span className="stars">
                  {'⭐'.repeat(Math.floor(school.rating))}
                  {school.rating % 1 >= 0.5 && '✨'}
                </span>
                <span className="rating-value">{school.rating.toFixed(1)}/5</span>
              </div>
              <div className="school-distance">{school.distance} km away</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchoolRatingsChart;
