import { useEffect, useState } from "react";
import axios from "axios";
import CardBox from "../../shared/CardBox";
import { Icon } from "@iconify/react/dist/iconify.js";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface DailyRevenue {
  date: string;
  label: string;
  revenue: number;
}

const MonthlyEarning = () => {
  // =========================================================
  // STATE
  // =========================================================

  const [monthName, setMonthName] =
    useState("Current Month");

  const [totalRevenue, setTotalRevenue] =
    useState(0);

  const [last7Days, setLast7Days] =
    useState<DailyRevenue[]>([]);

  const [loading, setLoading] =
    useState(true);


  // =========================================================
  // API
  // =========================================================

  const API_URL =
    import.meta.env.VITE_API_URL;


  // =========================================================
  // FETCH MONTHLY REVENUE
  // =========================================================

  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem("adminToken");

        const response = await axios.get(
          `${API_URL}/api/admin/monthly-earning`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data = response.data;

        setMonthName(
          data.monthName ||
            "Current Month"
        );

        setTotalRevenue(
          Math.round(
            Number(
              data.totalRevenue || 0
            )
          )
        );

        setLast7Days(
          (data.last7Days || []).map(
            (item: DailyRevenue) => ({
              date: item.date,
              label: item.label,
              revenue: Math.round(
                Number(
                  item.revenue || 0
                )
              ),
            })
          )
        );

      } catch (error: any) {
        console.error(
          "Monthly revenue fetch error:",
          error
        );

        setTotalRevenue(0);
        setLast7Days([]);

      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyRevenue();
  }, []);


  // =========================================================
  // SPARKLINE DATA
  // =========================================================

  const sparklineData =
    last7Days.map(
      (item) => item.revenue
    );


  // =========================================================
  // CHART OPTIONS
  // =========================================================

  const chartData: ApexOptions = {
    series: [
      {
        name: "Revenue",
        data: sparklineData,
        color:
          "var(--color-secondary)",
      },
    ],

    chart: {
      id: "monthly-revenue",
      type: "area",
      height: 60,

      sparkline: {
        enabled: true,
      },

      group: "monthly-revenue",

      fontFamily: "inherit",

      foreColor: "#adb0bb",
    },

    stroke: {
      curve: "smooth",
      width: 2,
    },

    fill: {
      type: "gradient",

      gradient: {
        shadeIntensity: 0,
        inverseColors: false,
        opacityFrom: 0.1,
        opacityTo: 0,
        stops: [20, 180],
      },
    },

    markers: {
      size: 0,
    },

    tooltip: {
      theme: "dark",

      fixed: {
        enabled: true,
        position: "right",
      },

      x: {
        show: false,
      },

      y: {
        formatter: (value: number) => {
          return `₹${Math.round(
            value
          ).toLocaleString("en-IN")}`;
        },
      },
    },
  };


  // =========================================================
  // FORMATTED REVENUE
  // =========================================================

  const formattedRevenue =
    totalRevenue.toLocaleString(
      "en-IN"
    );


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <CardBox className="mt-6 p-0">

        <div className="flex min-h-[180px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Loading monthly revenue...
          </p>
        </div>

      </CardBox>
    );
  }


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <CardBox className="mt-6 p-0">

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="p-6 pb-0">

        <div className="grid grid-cols-12 gap-6">

          {/* =================================================
              LEFT
          ================================================== */}

          <div className="col-span-8 md:col-span-8 lg:col-span-8">

            <h5 className="card-title mb-4">
              Monthly Revenue
            </h5>

            <h4 className="mb-3 text-xl">
              ₹{formattedRevenue}
            </h4>

            <div className="mb-3 flex items-center gap-2">

              <span className="flex items-center justify-center rounded-full bg-lightprimary p-1 dark:bg-darkprimary">

                <Icon
                  icon="tabler:calendar-month"
                  className="text-primary"
                />

              </span>

              <p className="mb-0 text-muted-foreground">
                {monthName} Revenue
              </p>

            </div>

          </div>


          {/* =================================================
              RIGHT ICON
          ================================================== */}

          <div className="col-span-4 md:col-span-4 lg:col-span-4">

            <div className="flex justify-end">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-white">

                <Icon
                  icon="tabler:currency-rupee"
                  className="text-xl"
                />

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          SPARKLINE
      ====================================================== */}

      {sparklineData.length > 0 ? (
        <Chart
          options={chartData}
          series={chartData.series}
          type="area"
          height={60}
          width="100%"
        />
      ) : (
        <div className="flex h-[60px] items-center justify-center">
          <p className="text-xs text-muted-foreground">
            No revenue data for the last 7 days
          </p>
        </div>
      )}

    </CardBox>
  );
};

export { MonthlyEarning };