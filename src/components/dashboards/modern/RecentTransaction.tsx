import { useEffect, useState } from "react";
import axios from "axios";
import CardBox from "src/components/shared/CardBox";

interface Transaction {
  id: string;
  orderId?: string | null;
  customerName: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const RecentTransaction = () => {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const API_URL =
    import.meta.env.VITE_API_URL;

  // =========================================================
  // FETCH RECENT TRANSACTIONS
  // =========================================================

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem(
            "adminToken"
          );

        const response =
          await axios.get(
            `${API_URL}/api/admin/recent-transactions`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setTransactions(
          response.data?.transactions || []
        );
      } catch (error: any) {
        console.error(
          "Recent transactions fetch error:",
          error
        );

        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTransactions();
  }, []);

  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = (
    date: string
  ) => {
    return new Date(
      date
    ).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // =========================================================
  // PAYMENT MESSAGE
  // =========================================================

  const getTransactionText = (
    transaction: Transaction
  ) => {
    const method =
      transaction.paymentMethod?.toLowerCase();

    const status =
      transaction.status?.toLowerCase();

    if (
      status === "success"
    ) {
      if (method === "razorpay") {
        return `Payment received from ${transaction.customerName}`;
      }

      if (method === "cod") {
        return `COD order placed by ${transaction.customerName}`;
      }

      return `Payment received from ${transaction.customerName}`;
    }

    if (
      status === "failed"
    ) {
      return `Payment failed for ${transaction.customerName}`;
    }

    if (
      status === "refunded"
    ) {
      return `Payment refunded to ${transaction.customerName}`;
    }

    return `Payment pending from ${transaction.customerName}`;
  };

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (
    status: string
  ) => {
    switch (status?.toLowerCase()) {
      case "success":
        return {
          border: "border-success",
          dot: "text-success",
        };

      case "failed":
        return {
          border: "border-error",
          dot: "text-error",
        };

      case "refunded":
        return {
          border: "border-warning",
          dot: "text-warning",
        };

      default:
        return {
          border: "border-primary",
          dot: "text-primary",
        };
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <CardBox className="h-full w-full">

        <div>
          <h5 className="card-title">
            Recent Transactions
          </h5>

          <p className="text-sm text-muted-foreground font-normal">
            Latest payment activity
          </p>
        </div>

        <div className="flex min-h-[250px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Loading transactions...
          </p>
        </div>

      </CardBox>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <CardBox className="h-full w-full">

      {/* HEADER */}
      <div>
        <h5 className="card-title">
          Recent Transactions
        </h5>

        <p className="text-sm text-muted-foreground font-normal">
          Latest payment activity
        </p>
      </div>


      {/* TRANSACTIONS */}
      <div className="mt-6">

        {transactions.length === 0 ? (
          <div className="flex min-h-[250px] items-center justify-center">

            <p className="text-sm text-muted-foreground">
              No transactions available
            </p>

          </div>
        ) : (
          transactions.map(
            (transaction, index) => {

              const statusStyle =
                getStatusStyle(
                  transaction.status
                );

              const isLastItem =
                index ===
                transactions.length - 1;

              return (
                <div
                  key={transaction.id}
                  className="flex gap-x-3"
                >

                  {/* TIME */}
                  <div className="w-1/4 text-end">
                    <span className="font-medium text-foreground dark:text-muted-foreground">
                      {formatTime(
                        transaction.createdAt
                      )}
                    </span>
                  </div>


                  {/* TIMELINE */}
                  <div
                    className={`relative ${
                      isLastItem
                        ? "after:hidden"
                        : ""
                    } after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-border`}
                  >

                    <div className="relative z-10 flex h-7 w-7 items-center justify-center">

                      <div
                        className={`h-3 w-3 rounded-full bg-transparent border-2 ${statusStyle.border}`}
                      />

                    </div>

                  </div>


                  {/* DETAILS */}
                  <div className="w-1/4 grow pb-6 pt-0.5">

                    <p className="font-medium text-foreground dark:text-muted-foreground">
                      {getTransactionText(
                        transaction
                      )}
                    </p>


                    {/* ORDER */}
                    {transaction.orderId && (
                      <div className="mt-1">
                        <span className="text-primary text-xs">
                          #
                          {transaction.orderId
                            .toString()
                            .slice(-6)
                            .toUpperCase()}
                        </span>
                      </div>
                    )}


                    {/* AMOUNT */}
                    <p className="mt-1 text-xs text-muted-foreground">
                      ₹
                      {Number(
                        transaction.amount
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </div>

                </div>
              );
            }
          )
        )}

      </div>

    </CardBox>
  );
};

export { RecentTransaction };