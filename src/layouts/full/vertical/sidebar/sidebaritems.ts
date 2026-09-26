export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: string;
  children?: ChildItem[];
  item?: unknown;
  url?: string;
  color?: string;
  disabled?: boolean;
  subtitle?: string;
  badge?: boolean;
  badgeType?: string;
  isPro?: boolean;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: string;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: string;
  disabled?: boolean;
  subtitle?: string;
  badgeType?: string;
  badge?: boolean;
  isPro?: boolean;
}

import { uniqueId } from "lodash";

const SidebarContent: MenuItem[] = [
  // =========================================================
  // HOME
  // =========================================================
  {
    heading: "Home",
    children: [
      {
        name: "Dashboard",
        icon: "solar:widget-2-linear",
        id: uniqueId(),
        url: "/",
        isPro: false,
      },
    ],
  },

  // =========================================================
  // PAGES
  // =========================================================
  {
    heading: "Pages",
    children: [
      {
        name: "Orders",
        icon: "solar:bag-5-linear",
        id: uniqueId(),
        url: "/ostik-admin/orders",
        isPro: false,
      },
      {
        name: "Returns",
        icon: "solar:undo-left-round-linear",
        id: uniqueId(),
        url: "/ostik-admin/returns",
        isPro: false,
      },
      {
        name: "Exchanges",
        icon: "solar:transfer-horizontal-linear",
        id: uniqueId(),
        url: "/ostik-admin/exchanges",
        isPro: false,
      },
      {
        name: "Cancellations",
        icon: "solar:close-circle-linear",
        id: uniqueId(),
        url: "/ostik-admin/cancel",
        isPro: false,
      },
      {
        name: "Products",
        icon: "solar:box-linear",
        id: uniqueId(),
        url: "/ostik-admin/products",
        isPro: false,
      },
      {
        name: "Variants",
        icon: "solar:layers-linear",
        id: uniqueId(),
        url: "/ostik-admin/variants",
        isPro: false,
      },
      {
        name: "Categories",
        icon: "solar:layers-minimalistic-linear",
        id: uniqueId(),
        url: "/ostik-admin/categories",
        isPro: false,
      },
      {
        name: "Inventory",
        icon: "solar:archive-linear",
        id: uniqueId(),
        url: "/inventory",
        isPro: false,
      },
      {
        name: "Customers",
        icon: "solar:users-group-rounded-linear",
        id: uniqueId(),
        url: "/ostik-admin/customers",
        isPro: false,
      },
      {
        name: "Reviews",
        icon: "solar:star-linear",
        id: uniqueId(),
        url: "/ostik-admin/reviews",
        isPro: false,
      },
      {
        name: "Payments",
        icon: "solar:card-linear",
        id: uniqueId(),
        url: "/ostik-admin/payments",
        isPro: false,
      },
      {
        name: "Shipping",
        icon: "solar:delivery-linear",
        id: uniqueId(),
        url: "/shipping",
        isPro: false,
      },
      {
        name: "Coupons",
        icon: "solar:ticket-sale-linear",
        id: uniqueId(),
        url: "/coupons",
        isPro: false,
      },
    ],
  },

  // =========================================================
  // CONTENT
  // =========================================================
  {
    heading: "Content",
    children: [
      {
        name: "Banners",
        icon: "solar:gallery-wide-linear",
        id: uniqueId(),
        url: "/ostik-admin/banners",
        isPro: false,
      },
      {
        name: "Blog",
        icon: "solar:document-text-linear",
        id: uniqueId(),
        url: "/blog",
        isPro: false,
      },
      {
        name: "Newsletter",
        icon: "solar:letter-linear",
        id: uniqueId(),
        url: "/ostik-admin/newsletter",
        isPro: false,
      },
      {
        name: "Contact",
        icon: "solar:chat-round-line-linear",
        id: uniqueId(),
        url: "/ostik-admin/contacts",
        isPro: false,
      },
      {
        name: "YouTube",
        icon: "solar:videocamera-record-linear",
        id: uniqueId(),
        url: "/ostik-admin/video-section",
        isPro: false,
      },
    ],
  },

  // =========================================================
  // SYSTEM
  // =========================================================
  {
    heading: "System",
    children: [
      {
        name: "Admin Users",
        icon: "solar:user-plus-rounded-linear",
        id: uniqueId(),
        url: "/admin-users",
        isPro: false,
      },
      {
        name: "Settings",
        icon: "solar:settings-minimalistic-linear",
        id: uniqueId(),
        url: "settings",
        isPro: false,
      },
    ],
  },
];

export default SidebarContent;