import { useEffect, useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";
import Table from "./components/Table";
import Charts from "./components/Charts";
import Filters from "./components/Filters";
import "./App.css";

// Set up Apollo Client
const env = import.meta.env.PROD;
const endpoint = env ? import.meta.env.VITE_PROD_ENDPOINT : "http://localhost:4000";
const client = new ApolloClient({
  uri: `${endpoint}/graphql`,
  cache: new InMemoryCache(),
});

// GraphQL Queries
const GET_ALL_SHIPPING_DATA = gql`
  query GetAllShippingData {
    getAllShippingData {
      ID
      Warehouse_block
      Mode_of_Shipment
      Customer_care_calls
      Customer_rating
      Cost_of_the_Product
      Prior_purchases
      Product_importance
      Reached_on_time
    }
  }
`;

const GET_FILTERED_SHIPPING_DATA = gql`
  query GetFilteredShippingData($filter: ShippingDataFilterInput) {
    getFilteredShippingData(filter: $filter) {
      ID
      Warehouse_block
      Mode_of_Shipment
      Customer_care_calls
      Customer_rating
      Cost_of_the_Product
      Prior_purchases
      Product_importance
      Reached_on_time
    }
  }
`;

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

// Filter options interface
interface FilterOptions {
  Warehouse_block?: string;
  Mode_of_Shipment?: string;
  Product_importance?: string;
}

// Main component for data handling and distribution
const ShippingDataContainer = () => {
  const [data, setData] = useState<ShippingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch all shipping data
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await client.query({
        query: GET_ALL_SHIPPING_DATA,
      });
      setData(result.data.getAllShippingData);
    } catch (err) {
      setError("Error fetching data. Make sure the GraphQL server is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch filtered shipping data
  const fetchFilteredData = async (filters: FilterOptions) => {
    setLoading(true);
    setError(null);

    try {
      const result = await client.query({
        query: GET_FILTERED_SHIPPING_DATA,
        variables: { filter: filters },
      });

      setData(result.data.getFilteredShippingData);
    } catch (err) {
      setError("Error fetching data. Make sure the GraphQL server is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div className="shipping-data-container">
      {error && <div className="error-message">{error}</div>}

      <div className="filter-and-charts-section">
        <Filters
          onFilter={fetchFilteredData}
          loading={loading}
          onFetchAll={fetchAllData}
        />
        <Charts data={data}/>
      </div>
      <Table data={data} loading={loading} />
    </div>
  );
};

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="app-container">
        <header>
          <h1>Warehouse Logistics Dashboard</h1>
        </header>
        <main>
          <ShippingDataContainer />
        </main>
      </div>
    </ApolloProvider>
  );
}

export default App;
