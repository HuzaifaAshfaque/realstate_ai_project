import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const ChartComponent = ({ data, type }) => {
  if (!data) return null;

  // Format chart data based on the response type
  let chartData = [];
  let lines = [];

  if (type === 'area_analysis' || type === 'price_growth') {
    chartData = data.chart_data.price_trends;
    lines = [
      { name: 'Flat Price', dataKey: 'flat_price', stroke: '#0078ff' },
      { name: 'Office Price', dataKey: 'office_price', stroke: '#00bfa6' },
      { name: 'Shop Price', dataKey: 'shop_price', stroke: '#f44336' },
    ];
  } else if (type === 'comparison') {
    // Restructure data for comparison
    const areas = data.chart_data.areas;
    const comparison = data.chart_data.comparison;
    
    // Get unique years from all areas
    const years = new Set();
    comparison.forEach(area => {
      area.data.forEach(item => years.add(item.year));
    });
    
    // Create data points for each year
    Array.from(years).sort().forEach(year => {
      const yearData = { year };
      
      comparison.forEach(area => {
        const yearItem = area.data.find(item => item.year === year);
        if (yearItem) {
          yearData[`${area.area}_price`] = yearItem.price;
          yearData[`${area.area}_demand`] = yearItem.demand;
        }
      });
      
      chartData.push(yearData);
    });
    
    // Create lines for each area (price only for simplicity)
    comparison.forEach(area => {
      lines.push({
        name: `${area.area} Price`,
        dataKey: `${area.area}_price`,
        stroke: `#${Math.floor(Math.random()*16777215).toString(16)}`, // Random color
      });
    });
  }

  return (
    <div className="w-full h-64 bg-white p-4 rounded-lg shadow mb-4">
      <h3 className="text-lg font-semibold mb-2">
        {type === 'comparison' ? 'Area Comparison' : 'Price Trends'}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          {lines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.stroke}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;