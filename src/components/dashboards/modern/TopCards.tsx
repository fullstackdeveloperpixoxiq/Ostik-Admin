import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import CardBox from "../../shared/CardBox";

import iconConnect from "src/assets/images/svgs/icon-connect.svg";
import iconSpeechBubble from "src/assets/images/svgs/icon-speech-bubble.svg";
import iconFavorites from "src/assets/images/svgs/icon-favorites.svg";
import iconMailbox from "src/assets/images/svgs/icon-mailbox.svg";
import iconBriefcase from "src/assets/images/svgs/icon-briefcase.svg";
import iconUser from "src/assets/images/svgs/icon-user-male.svg";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import { Link } from "react-router";

const TopCards = () => {
  const [stats, setStats] = useState({
    orders: 0,
    sales: 0,
    customers: 0,
    products: 0,
    pendingOrders: 0,
    lowStock: 0,
  });

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Dashboard response:", response.data);

        setStats((previousStates) => ({
          ...previousStates,
          ...(response.data?.stats || {}),
        }));
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to fetch dashboard statistics";

        toast.error(message || "Failed to fetch dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const TopCardInfo = [
    {
      key: "orders",
      title: "Orders",
      desc: stats.orders,
      img: iconConnect,
      bgcolor: "bg-info/10 dark:bg-info/10",
      textclr: "text-info dark:text-info",
      url: "/ostik-admin/orders",
    },
    {
      key: "sales",
      title: "Sales",
      desc: `₹${Number(stats.sales || 0).toLocaleString("en-IN")}`,
      img: iconSpeechBubble,
      bgcolor: "bg-success/10 dark:bg-success/10",
      textclr: "text-success dark:text-success",
      url: "/ostik-admin/payments",
    },
    {
      key: "customers",
      title: "Customers",
      desc: stats.customers,
      img: iconUser,
      bgcolor: "bg-primary/10 dark:bg-lightprimary",
      textclr: "text-primary dark:text-primary",
      url: "/ostik-admin/customers",
    },
    {
      key: "products",
      title: "Products",
      desc: stats.products,
      img: iconBriefcase,
      bgcolor: "bg-warning/10 dark:bg-warning/10",
      textclr: "text-warning dark:text-warning",
      url: "/ostik-admin/products",
    },
    {
      key: "pendingOrders",
      title: "Pending Orders",
      desc: stats.pendingOrders,
      img: iconMailbox,
      bgcolor: "bg-secondary/10 dark:bg-secondary/10",
      textclr: "text-primary dark:text-primary",
      url: "/ostik-admin/orders",
    },
    {
      key: "lowStock",
      title: "Low Stock",
      desc: stats.lowStock,
      img: iconFavorites,
      bgcolor: "bg-lighterror dark:bg-lighterror",
      textclr: "text-error dark:text-error",
      url: "/ostik-admin/variants",
    },
  ];

  return (
    <div>
      <Swiper
        slidesPerView={6}
        spaceBetween={24}
        loop={true}
        freeMode={true}
        grabCursor={true}
        speed={5000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 14,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 18,
          },
          1030: {
            slidesPerView: 4,
            spaceBetween: 18,
          },
          1200: {
            slidesPerView: 6,
            spaceBetween: 24,
          },
        }}
        className="mySwiper"
      >
        {TopCardInfo.map((item) => (
          <SwiperSlide key={item.key}>
            <Link to={item.url}>
              <CardBox
                className={`shadow-none ${item.bgcolor} w-full border-none`}
              >
                <div className="text-center hover:scale-105 transition-all ease-in-out">
                  <div className="flex justify-center">
                    <img
                      src={item.img}
                      width="50"
                      height="50"
                      className="mb-3"
                      alt={item.title}
                    />
                  </div>

                  <p className={`font-semibold ${item.textclr} mb-1`}>
                    {item.title}
                  </p>

                  {loading ? (
                    <div className="flex justify-center">
                      <div className="h-6 w-12 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    </div>
                  ) : (
                    <h5
                      className={`text-lg font-semibold ${item.textclr} mb-0`}
                    >
                      {item.desc}
                    </h5>
                  )}
                </div>
              </CardBox>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export { TopCards };