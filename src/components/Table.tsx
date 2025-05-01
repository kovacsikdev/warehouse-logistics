import { FC, useMemo } from 'react';
import { convertNumToCommas } from '../helpers/conversions';
import './Table.css';

// ShippingData interface
interface ShippingData {
  ID: number;
  Warehouse_block: string;
  Mode_of_Shipment: string;
  Customer_care_calls: number;
  Customer_rating: number;
  Cost_of_the_Product: number;
  Prior_purchases: number;
  Product_importance: string;
  Reached_on_time: number;
}

interface TableProps {
  data: ShippingData[];
  loading: boolean;
}

const Table: FC<TableProps> = ({ data, loading }) => {
  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    if (!data.length) return null;
    
    return {
      totalRows: data.length,
      totalCustomerCareCalls: data.reduce((sum, item) => sum + item.Customer_care_calls, 0),
      totalCost: data.reduce((sum, item) => sum + item.Cost_of_the_Product, 0),
      totalPriorPurchases: data.reduce((sum, item) => sum + item.Prior_purchases, 0),
    };
  }, [data]);

  // Function to download table data as CSV
  const downloadCSV = () => {
    if (!data.length) return;

    // Create headers
    const headers = [
      'ID',
      'Warehouse Block',
      'Shipment Mode',
      'Customer Care Calls',
      'Customer Rating',
      'Product Cost',
      'Prior Purchases',
      'Product Importance',
      'On-Time Delivery'
    ];

    // Format data rows
    const csvRows = data.map(item => [
      item.ID,
      item.Warehouse_block,
      item.Mode_of_Shipment,
      item.Customer_care_calls,
      item.Customer_rating,
      item.Cost_of_the_Product,
      item.Prior_purchases,
      item.Product_importance,
      item.Reached_on_time === 1 ? 'Yes' : 'No'
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `warehouse-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="table-component">
      {data.length > 0 ? (
        <>
          <div className="table-header">
            <div className="metrics-row">
              <div className="metric-box">
                <span className="metric-title">Total Customer Care Calls</span>
                <span className="metric-value">{summaryMetrics?.totalCustomerCareCalls}</span>
              </div>
              <div className="metric-box">
                <span className="metric-title">Total Cost</span>
                <span className="metric-value">${convertNumToCommas(summaryMetrics?.totalCost || 0)}</span>
              </div>
              <div className="metric-box">
                <span className="metric-title">Total Prior Purchases</span>
                <span className="metric-value">{summaryMetrics?.totalPriorPurchases}</span>
              </div>
            </div>
            <div className="table-summary">
              <div className="summary-metric">
                <span className="metric-label">Total Rows:</span>
                <span>{summaryMetrics?.totalRows}</span>
              </div>
              <button className="download-btn" onClick={downloadCSV}>
                Download CSV
              </button>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Warehouse Block</th>
                  <th>Shipment Mode</th>
                  <th>Customer Care Calls</th>
                  <th>Customer Rating</th>
                  <th>Product Cost</th>
                  <th>Prior Purchases</th>
                  <th>Product Importance</th>
                  <th>On-Time Delivery</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.ID}>
                    <td>{item.ID}</td>
                    <td>{item.Warehouse_block}</td>
                    <td>{item.Mode_of_Shipment}</td>
                    <td>{item.Customer_care_calls}</td>
                    <td>{item.Customer_rating}</td>
                    <td>${item.Cost_of_the_Product}</td>
                    <td>{item.Prior_purchases}</td>
                    <td>{item.Product_importance}</td>
                    <td>{item.Reached_on_time === 1 ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        loading && <p>loading...</p>
      )}
    </div>
  );
};

export default Table;