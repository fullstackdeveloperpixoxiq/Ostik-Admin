import { useEffect, useState } from "react";
import axios from "axios";
import CardBox from "src/components/shared/CardBox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "src/components/ui/table";

interface ProductPerformanceData {
  productId: string;
  productName: string;
  productSlug: string;
  image: string;
  orders: number;
  unitsSold: number;
  revenue: number;
  stock: number;
}

export const ProductPerformance = () => {
  const [products, setProducts] = useState<ProductPerformanceData[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  // =========================================================
  // FETCH PRODUCT PERFORMANCE
  // =========================================================

  useEffect(() => {
    const fetchProductPerformance = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("adminToken");

        const response = await axios.get(
          `${API_URL}/api/admin/product-performance`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data?.products || [];

        setProducts(
          data.map((item: ProductPerformanceData) => ({
            productId: item.productId,
            productName: item.productName,
            productSlug: item.productSlug,
            image: item.image,
            orders: Math.round(Number(item.orders || 0)),
            unitsSold: Math.round(Number(item.unitsSold || 0)),
            revenue: Math.round(Number(item.revenue || 0)),
            stock: Math.round(Number(item.stock || 0)),
          }))
        );
      } catch (error: any) {
        console.error(
          "Product performance fetch error:",
          error
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductPerformance();
  }, []);

  // =========================================================
  // FORMAT CURRENCY
  // =========================================================

  const formatCurrency = (value: number) => {
    return `₹${Math.round(value).toLocaleString("en-IN")}`;
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <CardBox>
        <div className="mb-6">
          <h5 className="card-title">
            Product Performance
          </h5>

          <p className="text-sm text-muted-foreground font-normal">
            Overview of product performance
          </p>
        </div>

        <div className="flex min-h-[250px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Loading product performance...
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
      <div id="product" className="mb-6">
        <div>
          <h5 className="card-title">
            Product Performance
          </h5>

          <p className="text-sm text-muted-foreground font-normal">
            Overview of top performing products
          </p>
        </div>
      </div>

      {/* =====================================================
          DESKTOP TABLE
      ====================================================== */}

      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="overflow-x-auto">

              <Table>

                <TableHeader>
                  <TableRow>

                    <TableHead className="text-sm font-semibold">
                      #
                    </TableHead>

                    <TableHead className="text-sm font-semibold">
                      Product
                    </TableHead>

                    <TableHead className="text-sm font-semibold">
                      Orders
                    </TableHead>

                    <TableHead className="text-sm font-semibold">
                      Units Sold
                    </TableHead>

                    <TableHead className="text-sm font-semibold">
                      Revenue
                    </TableHead>

                    <TableHead className="text-sm font-semibold">
                      Stock
                    </TableHead>

                  </TableRow>
                </TableHeader>


                <TableBody>

                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-32 text-center text-sm text-muted-foreground"
                      >
                        No product performance data available.
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((item, index) => (
                      <TableRow
                        key={item.productId}
                        className="border-b border-border"
                      >

                        {/* NUMBER */}
                        <TableCell>
                          <p className="text-muted-foreground font-medium text-sm">
                            {index + 1}
                          </p>
                        </TableCell>


                        {/* PRODUCT */}
                        <TableCell className="ps-0 min-w-[240px]">

                          <div className="flex items-center gap-3">

                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.productName}
                                className="h-10 w-10 rounded-lg border border-gray-200 object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gray-100" />
                            )}

                            <div>
                              <h6 className="text-sm font-semibold mb-1">
                                {item.productName}
                              </h6>

                              <p className="text-xs font-medium text-muted-foreground">
                                {item.productSlug}
                              </p>
                            </div>

                          </div>

                        </TableCell>


                        {/* ORDERS */}
                        <TableCell>
                          <p className="text-sm font-medium text-muted-foreground">
                            {item.orders}
                          </p>
                        </TableCell>


                        {/* UNITS SOLD */}
                        <TableCell>
                          <p className="text-sm font-medium text-muted-foreground">
                            {item.unitsSold}
                          </p>
                        </TableCell>


                        {/* REVENUE */}
                        <TableCell>
                          <p className="text-sm font-semibold text-foreground">
                            {formatCurrency(
                              item.revenue
                            )}
                          </p>
                        </TableCell>


                        {/* STOCK */}
                        <TableCell>

                          <p
                            className={`text-sm font-medium ${
                              item.stock === 0
                                ? "text-error"
                                : item.stock <= 5
                                ? "text-warning"
                                : "text-muted-foreground"
                            }`}
                          >
                            {item.stock}
                          </p>

                        </TableCell>

                      </TableRow>
                    ))
                  )}

                </TableBody>

              </Table>

            </div>
          </div>
        </div>
      </div>


      {/* =====================================================
          MOBILE
      ====================================================== */}

      <div className="mt-4 space-y-3 md:hidden">

        {products.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No product performance data available.
            </p>
          </div>
        ) : (
          products.map((item, index) => (
            <div
              key={item.productId}
              className="rounded-xl border border-border p-4"
            >

              {/* PRODUCT */}
              <div className="flex items-center gap-3">

                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="h-14 w-14 flex-shrink-0 rounded-lg border object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 flex-shrink-0 rounded-lg bg-gray-100" />
                )}

                <div className="min-w-0">

                  <div className="flex items-center gap-2">

                    <span className="text-xs font-medium text-muted-foreground">
                      #{index + 1}
                    </span>

                    <h6 className="truncate text-sm font-semibold">
                      {item.productName}
                    </h6>

                  </div>

                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {item.productSlug}
                  </p>

                </div>

              </div>


              {/* STATS */}
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3">

                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Orders
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {item.orders}
                  </p>
                </div>


                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Units Sold
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {item.unitsSold}
                  </p>
                </div>


                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Revenue
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {formatCurrency(
                      item.revenue
                    )}
                  </p>
                </div>


                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Stock
                  </p>

                  <p
                    className={`mt-1 text-sm font-medium ${
                      item.stock === 0
                        ? "text-error"
                        : item.stock <= 5
                        ? "text-warning"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.stock}
                  </p>
                </div>

              </div>

            </div>
          ))
        )}

      </div>

    </CardBox>
  );
};