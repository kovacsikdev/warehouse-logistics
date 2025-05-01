import { FC } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import { chartColors } from "../helpers/colors";
import "./Charts.css";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);
ChartJS.defaults.color = "#fff";

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

interface ChartsProps {
  data: ShippingData[];
}

const Charts: FC<ChartsProps> = ({ data }) => {
  // Calculate metrics for visualizations
  const calculateMetrics = () => {
    if (!data.length) return null;

    // Cost per shipment type (Ship, Flight, Road)
    const costPerShipment = data.reduce((acc, item) => {
      acc[item.Mode_of_Shipment] =
        (acc[item.Mode_of_Shipment] || 0) + item.Cost_of_the_Product;
      return acc;
    }, {} as Record<string, number>);

    // Count shipments by mode (Ship, Flight, Road)
    const shipmentCounts = data.reduce((acc, item) => {
      acc[item.Mode_of_Shipment] = (acc[item.Mode_of_Shipment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Count on-time vs delayed deliveries
    const onTimeDelivery = {
      Yes: data.filter((item) => item.Reached_on_time === 1).length,
      No: data.filter((item) => item.Reached_on_time === 0).length,
    };

    return {
      costPerShipment,
      shipmentCounts,
      onTimeDelivery,
    };
  };

  const metrics = calculateMetrics();

  if (!metrics) {
    return (
      <div className="charts-placeholder">
        Loading...
      </div>
    );
  }

  // Prepare data for "Cost per shipment" bar chart
  const costPerShipmentData = {
    labels: ["Ship", "Flight", "Road"],
    datasets: [
      {
        label: "Total Cost",
        data: [
          metrics.costPerShipment.Ship,
          metrics.costPerShipment.Flight,
          metrics.costPerShipment.Road,
        ],
        backgroundColor: [
          chartColors.c_orange,
          chartColors.c_blue,
          chartColors.c_blue2,
        ],
      },
    ],
  };

  // Prepare data for "Total shipments" donut chart
  const shipmentCountsData = {
    labels: ["Ship", "Flight", "Road"],
    datasets: [
      {
        label: "Shipment Counts",
        data: [
          metrics.shipmentCounts.Ship,
          metrics.shipmentCounts.Flight,
          metrics.shipmentCounts.Road,
        ],
        backgroundColor: [
          chartColors.c_orange,
          chartColors.c_blue,
          chartColors.c_blue2,
        ],
      },
    ],
  };

  // Prepare data for "Product reached on time" pie chart
  const onTimeDeliveryData = {
    labels: ["Yes", "No"],
    datasets: [
      {
        label: "On-time Delivery",
        data: [metrics.onTimeDelivery.Yes, metrics.onTimeDelivery.No],
        backgroundColor: [chartColors.c_green, chartColors.c_red],
      },
    ],
  };

  // Chart options
  const barOptions = {
    responsive: true,
    resizeDelay: 200,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Cost per shipment",
        color: "white",
        font: {
          size: 16,
        },
      },
    }
  };

  const doughnutOptions = {
    responsive: true,
    resizeDelay: 200,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "rectRounded",
        },
      },
      title: {
        display: true,
        text: "Total shipments",
        color: "white",
        font: {
          size: 16,
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    resizeDelay: 200,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "rectRounded",
        },
        onClick: () => {},
        onHover: () => {},
        onLeave: () => {},
      },
      title: {
        display: true,
        text: "Product reached on time",
        color: "white",
        font: {
          size: 16,
        },
      },
    },
  };

  return (
    <div className="charts-component">
      <div className="chart-grid">
        <div className="chart-card" style={{ height: "100%" }}>
          <div style={{ width: "100%", height: "100%" }}>
            <Bar data={costPerShipmentData} options={barOptions} />
          </div>
        </div>
        <div className="chart-card-section">
          <div className="chart-card chart-card-small">
            <div style={{ width: "100%", height: "100%" }}>
              <Doughnut data={shipmentCountsData} options={doughnutOptions} />
            </div>
          </div>

          <div className="chart-card chart-card-small">
            <div style={{ width: "100%", height: "100%" }}>
              <Pie data={onTimeDeliveryData} options={pieOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
