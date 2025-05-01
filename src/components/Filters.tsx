import { FC, useState } from 'react';
import './Filters.css';

interface FilterOptions {
  Warehouse_block?: string;
  Mode_of_Shipment?: string;
  Product_importance?: string;
  Reached_on_time?: number;
}

interface FiltersProps {
  onFilter: (filters: FilterOptions) => void;
  onFetchAll: () => void;
  loading: boolean;
}

const Filters: FC<FiltersProps> = ({ onFilter, onFetchAll, loading }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    Warehouse_block: '',
    Mode_of_Shipment: '',
    Product_importance: '',
    Reached_on_time: undefined
  });

  const resetFilters = () => {
    onFetchAll();
    setFilters({
      Warehouse_block: '',
      Mode_of_Shipment: '',
      Product_importance: '',
      Reached_on_time: undefined
    });
  }

  const handleToggleFilter = (key: keyof FilterOptions, value: string | number) => {
    setFilters(prev => {
      // If the value is already selected, deselect it (return to empty)
      if (prev[key] === value) {
        const newFilters = { ...prev };
        newFilters[key] = key === 'Reached_on_time' ? undefined : '' as any;
        return newFilters;
      }
      // Otherwise, select the new value
      return { ...prev, [key]: value };
    });
  };

  const handleApplyFilters = () => {
    // Remove empty filters
    const activeFilters: FilterOptions = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== undefined) {
        activeFilters[key as keyof FilterOptions] = value;
      }
    });
    
    onFilter(activeFilters);
  };

  // Helper to check if a filter value is selected
  const isSelected = (key: keyof FilterOptions, value: string | number) => {
    return filters[key] === value;
  };

  return (
    <div className="filters-component">
      <h3>Filter Data</h3>
      
      <div className="filter-section">
        <h4>Warehouse</h4>
        <div className="toggle-group">
          {['A', 'B', 'C', 'D', 'E'].map(warehouse => (
            <button
              key={warehouse}
              className={`toggle-button ${isSelected('Warehouse_block', warehouse) ? 'active' : ''}`}
              onClick={() => handleToggleFilter('Warehouse_block', warehouse)}
              disabled={loading}
            >
              {warehouse}
            </button>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <h4>Importance</h4>
        <div className="toggle-group">
          {[
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Medium' },
            { value: 'low', label: 'Low' }
          ].map(item => (
            <button
              key={item.value}
              className={`toggle-button ${isSelected('Product_importance', item.value) ? 'active' : ''}`}
              onClick={() => handleToggleFilter('Product_importance', item.value)}
              disabled={loading}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <h4>Shipment Type</h4>
        <div className="toggle-group">
          {['Flight', 'Ship', 'Road'].map(mode => (
            <button
              key={mode}
              className={`toggle-button ${isSelected('Mode_of_Shipment', mode) ? 'active' : ''}`}
              onClick={() => handleToggleFilter('Mode_of_Shipment', mode)}
              disabled={loading}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <h4>On Time</h4>
        <div className="toggle-group">
          {[
            { value: 1, label: 'Yes' },
            { value: 0, label: 'No' }
          ].map(item => (
            <button
              key={item.label}
              className={`toggle-button ${isSelected('Reached_on_time', item.value) ? 'active' : ''}`}
              onClick={() => handleToggleFilter('Reached_on_time', item.value)}
              disabled={loading}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filters-actions">
        <button 
          className="action-button reset"
          onClick={resetFilters} 
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Reset Filters'}
        </button>
        <button 
          className="action-button apply"
          onClick={handleApplyFilters} 
          disabled={loading || (
            !filters.Warehouse_block && 
            !filters.Mode_of_Shipment && 
            !filters.Product_importance &&
            filters.Reached_on_time === undefined
          )}
        >
          {loading ? 'Loading...' : 'Apply Filters'}
        </button>
      </div>
    </div>
  );
};

export default Filters;