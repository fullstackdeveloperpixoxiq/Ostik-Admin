import { useEffect, useState } from "react";
import axios from "axios";
import CardBox from "../../shared/CardBox";
import Chart from "react-apexcharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { ApexOptions } from "apexcharts";

interface RevenueItem {
  month: number;
  onlineRevenue: number;
  codRevenue: number;
}

const RevenueUpdate = () => {
  // =========================================================
  // STATE
  // =========================================================

  const [selectedYear, setSelectedYear] = useState("2026");

  const [months, setMonths] = useState<string[]>([
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]);

  const [onlineRevenue, setOnlineRevenue] = useState<number[]>(
    Array(12).fill(0)
  );

  const [codRevenue, setCodRevenue] = useState<number[]>(
    Array(12).fill(0)
  );

  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;


  // =========================================================
  // FETCH REVENUE DATA
  // =========================================================

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem("adminToken");

        const response = await axios.get(
          `${API_URL}/api/admin/revenue-updates?year=${selectedYear}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;

        // Months
        setMonths(
          data.months || [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ]
        );

        const revenue: RevenueItem[] =
          data.revenue || [];

        // Online Revenue
        setOnlineRevenue(
          revenue.map((item) =>
            Math.round(
              Number(item.onlineRevenue || 0)
            )
          )
        );

        // COD Revenue
        setCodRevenue(
          revenue.map((item) =>
            Math.round(
              Number(item.codRevenue || 0)
            )
          )
        );
      } catch (error: any) {
        console.error(
          "Revenue fetch error:",
          error
        );

        // Reset graph if API fails
        setOnlineRevenue(
          Array(12).fill(0)
        );

        setCodRevenue(
          Array(12).fill(0)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [selectedYear]);


  // =========================================================
  // CHART OPTIONS
  // =========================================================

  const chartOptions: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },

      type: "bar",

      fontFamily: "inherit",

      foreColor: "#7C8FAC",

      height: 310,

      stacked: false,

      width: "100%",

      offsetX: -20,
    },

    colors: [
      "var(--color-primary)",
      "var(--color-secondary)",
    ],

    plotOptions: {
      bar: {
        horizontal: false,

        columnWidth: "35%",

        borderRadius: 6,

        borderRadiusApplication: "end",
      },
    },

    dataLabels: {
      enabled: false,
    },

    legend: {
      show: true,

      position: "top",

      horizontalAlign: "right",

      fontSize: "12px",
    },

    grid: {
      borderColor: "rgba(0,0,0,0.1)",

      strokeDashArray: 3,
    },

    xaxis: {
      categories: months,

      axisBorder: {
        show: false,
      },

      axisTicks: {
        show: false,
      },
    },

    yaxis: {
      min: 0,

      labels: {
        formatter: (val: number) => {
          const value = Math.round(val);

          if (value >= 1000000) {
            return `₹${(value / 1000000).toFixed(1)}M`;
          }

          if (value >= 1000) {
            return `₹${Math.round(
              value / 1000
            )}k`;
          }

          return `₹${value}`;
        },
      },
    },

    tooltip: {
      theme: "dark",

      y: {
        formatter: (val: number) => {
          return `₹${Math.round(
            val
          ).toLocaleString("en-IN")}`;
        },
      },
    },
  };


  // =========================================================
  // CHART SERIES
  // =========================================================

  const chartSeries = [
    {
      name: "Online Revenue",
      data: onlineRevenue,
    },

    {
      name: "COD Revenue",
      data: codRevenue,
    },
  ];


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <CardBox className="pb-0 h-full w-full">

      {/* HEADER */}
      <div className="sm:flex items-center justify-between mb-6">

        <div>
          <h5 className="card-title">
            Revenue updates
          </h5>

          <p className="text-sm text-muted-foreground font-normal">
            Revenue by Payment Method
          </p>
        </div>


        {/* YEAR SELECT */}
        <div className="sm:mt-0 mt-4">

          <Select
            value={selectedYear}
            onValueChange={setSelectedYear}
          >

            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>

            <SelectContent>

              <SelectItem value="2026">
                Year 2026
              </SelectItem>

              <SelectItem value="2025">
                Year 2025
              </SelectItem>

              <SelectItem value="2024">
                Year 2024
              </SelectItem>

              <SelectItem value="2023">
                Year 2023
              </SelectItem>

            </SelectContent>

          </Select>

        </div>

      </div>


      {/* LOADING */}
      {loading ? (
        <div className="h-[316px] flex items-center justify-center">

          <p className="text-sm text-muted-foreground">
            Loading revenue...
          </p>

        </div>
      ) : (
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height="316px"
          width="100%"
        />
      )}

    </CardBox>
  );
};

export { RevenueUpdate };