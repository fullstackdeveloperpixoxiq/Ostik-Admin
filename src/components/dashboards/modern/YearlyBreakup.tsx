import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import CardBox from "src/components/shared/CardBox";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface YearlyRevenueItem {
  year: number;
  totalRevenue: number;
}

interface ComparisonData {
  available: boolean;
  previousYear: number;
  previousYearRevenue: number;
  growthPercent: number | null;
  label: string;
}

const YearlyBreakup = () => {
  // =========================================================
  // STATE
  // =========================================================

  const [currentYearRevenue, setCurrentYearRevenue] =
    useState(0);

  const [yearlyRevenue, setYearlyRevenue] =
    useState<YearlyRevenueItem[]>([]);

  const [comparison, setComparison] =
    useState<ComparisonData | null>(null);

  const [loading, setLoading] = useState(true);


  // =========================================================
  // API
  // =========================================================

  const API_URL = import.meta.env.VITE_API_URL;


  // =========================================================
  // FETCH YEARLY REVENUE
  // =========================================================

  useEffect(() => {
    const fetchYearlyRevenue = async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem("adminToken");

        const response = await axios.get(
          `${API_URL}/api/admin/yearly-breakup`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data = response.data;

        setCurrentYearRevenue(
          Math.round(
            Number(
              data.currentYearRevenue || 0
            )
          )
        );

        setYearlyRevenue(
          (data.yearlyRevenue || []).map(
            (item: YearlyRevenueItem) => ({
              year: item.year,
              totalRevenue: Math.round(
                Number(
                  item.totalRevenue || 0
                )
              ),
            })
          )
        );

        setComparison(
          data.comparison || null
        );

      } catch (error: any) {
        console.error(
          "Yearly revenue fetch error:",
          error
        );

        setYearlyRevenue([]);
        setCurrentYearRevenue(0);
        setComparison(null);

      } finally {
        setLoading(false);
      }
    };

    fetchYearlyRevenue();
  }, []);


  // =========================================================
  // DONUT DATA
  // =========================================================

  const donutSeries =
    yearlyRevenue.map(
      (item) => item.totalRevenue
    );

  const donutLabels =
    yearlyRevenue.map(
      (item) => String(item.year)
    );


  // =========================================================
  // CHART COLORS
  // =========================================================

  const chartColors = [
    "var(--color-primary)",
    "var(--color-lightprimary)",
    "var(--color-secondary)",
    "var(--color-success)",
    "var(--color-warning)",
  ];


  // =========================================================
  // CHART OPTIONS
  // =========================================================

  const chartData: ApexOptions = {
    labels: donutLabels,

    chart: {
      type: "donut",
      fontFamily: "inherit",
      foreColor: "#adb0bb",
      height: 150,
      offsetX: 18,

      toolbar: {
        show: false,
      },
    },

    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,

        donut: {
          size: "75%",
        },
      },
    },

    stroke: {
      show: false,
    },

    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },

    colors: chartColors,

    tooltip: {
      theme: "dark",
      fillSeriesColor: false,

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
  // FORMAT REVENUE
  // =========================================================

  const formattedCurrentRevenue =
    currentYearRevenue.toLocaleString(
      "en-IN"
    );


  // =========================================================
  // GROWTH
  // =========================================================

  const comparisonAvailable =
    comparison?.available === true;

  const growthPercent =
    comparison?.growthPercent ?? 0;

  const isPositiveGrowth =
    growthPercent > 0;

  const isNegativeGrowth =
    growthPercent < 0;


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <CardBox>
        <div className="flex min-h-[190px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Loading yearly revenue...
          </p>
        </div>
      </CardBox>
    );
  }


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <CardBox>

      <div className="grid grid-cols-12">

        {/* ===================================================
            LEFT
        ==================================================== */}

        <div className="col-span-7 flex flex-col md:col-span-6 lg:col-span-6">

          <div>

            <h5 className="card-title mb-4 lg:whitespace-nowrap">
              Yearly Revenue
            </h5>


            <h4 className="mb-2 text-xl">
              ₹{formattedCurrentRevenue}
            </h4>


            {/* =================================================
                COMPARISON
            ================================================== */}

            {comparisonAvailable ? (
              <div className="mb-3 flex items-center gap-2">

                <span
                  className={`flex items-center justify-center rounded-full p-1 ${
                    isPositiveGrowth
                      ? "bg-lightsuccess dark:bg-darksuccess"
                      : isNegativeGrowth
                      ? "bg-lighterror dark:bg-darkerror"
                      : "bg-lightprimary dark:bg-darkprimary"
                  }`}
                >

                  <Icon
                    icon={
                      isPositiveGrowth
                        ? "tabler:arrow-up-left"
                        : isNegativeGrowth
                        ? "tabler:arrow-down-right"
                        : "tabler:minus"
                    }
                    className={
                      isPositiveGrowth
                        ? "text-success"
                        : isNegativeGrowth
                        ? "text-error"
                        : "text-primary"
                    }
                  />

                </span>


                <p
                  className={`mb-0 ${
                    isPositiveGrowth
                      ? "text-success"
                      : isNegativeGrowth
                      ? "text-error"
                      : "text-muted-foreground"
                  }`}
                >
                  {growthPercent > 0
                    ? `+${growthPercent}%`
                    : `${growthPercent}%`}
                </p>


                <p className="mb-0 text-muted-foreground">
                  vs same period last year
                </p>

              </div>
            ) : (
              <p className="mb-3 text-xs text-muted-foreground">
                No previous-year comparison yet
              </p>
            )}

          </div>


          {/* =================================================
              YEAR LEGEND
          ================================================== */}

          {yearlyRevenue.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-4">

              {yearlyRevenue.map(
                (item, index) => (
                  <div
                    key={item.year}
                    className="flex items-center"
                  >

                    <Icon
                      icon="tabler:point-filled"
                      className="me-1 text-xl"
                      style={{
                        color:
                          chartColors[
                            index %
                              chartColors.length
                          ],
                      }}
                    />

                    <span className="text-xs text-muted-foreground">
                      {item.year}
                    </span>

                  </div>
                )
              )}

            </div>
          )}

        </div>


        {/* ===================================================
            RIGHT - DONUT
        ==================================================== */}

        <div className="col-span-4 md:col-span-6 lg:col-span-6">

          <div className="flex justify-center">

            {yearlyRevenue.length > 0 ? (
              <Chart
                options={chartData}
                series={donutSeries}
                type="donut"
                height={150}
                width={180}
              />
            ) : (
              <div className="flex h-[150px] w-[180px] items-center justify-center text-center">

                <p className="text-xs text-muted-foreground">
                  No revenue data available
                </p>

              </div>
            )}

          </div>

        </div>

      </div>

    </CardBox>
  );
};

export { YearlyBreakup };