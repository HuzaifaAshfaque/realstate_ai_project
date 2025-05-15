import React from 'react';
import Chart from './Chart';
import DataTable from './DataTable';

const QueryResult = ({ result }) => {
  console.log('QueryResult', result);
  if (!result) return null;

  return (
    <div className="w-full space-y-4">
      {/* Summary Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Analysis Summary</h3>
        <div className="text-gray-700 whitespace-pre-line">
          {result.summary || 'No summary available'}
        </div>
      </div>

      {/* Chart Section */}
      {result.chart_data && (
        <Chart data={result} type={result.type} />
      )}

      {/* Table Section */}
      {result.table_data && result.table_data.length > 0 && (
        <DataTable data={result.table_data} />
      )}
    </div>
  );
};

export default QueryResult;