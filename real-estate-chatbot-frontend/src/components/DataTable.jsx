import React, { useState } from 'react';

const DataTable = ({ data }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  if (!data || !data.length) return null;

  // Get column headers from the first data entry
  const columns = Object.keys(data[0]);

  // Paginate data
  const paginatedData = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  // Handle downloading the data as CSV
  const downloadCSV = () => {
    // Create CSV header row
    const header = columns.join(',');
    
    // Create CSV rows
    const csvRows = data.map(row => {
      return columns.map(column => {
        // Handle values that contain commas
        const value = row[column] !== null ? row[column] : '';
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',');
    });
    
    // Combine header and rows
    const csvContent = [header, ...csvRows].join('\n');
    
    // Create a Blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'real_estate_data.csv');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow overflow-hidden mb-4">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-semibold">Data Table</h3>
        <button
          onClick={downloadCSV}
          className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-primary-dark"
        >
          Download CSV
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {page + 1} of {Math.ceil(data.length / rowsPerPage)}
          </span>
          <button
            onClick={() => setPage(Math.min(Math.ceil(data.length / rowsPerPage) - 1, page + 1))}
            disabled={page >= Math.ceil(data.length / rowsPerPage) - 1}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;