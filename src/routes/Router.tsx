// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router';
import Loadable from '../layouts/full/shared/loadable/Loadable';


/* =========================================================
   LAYOUTS
========================================================= */

const FullLayout = Loadable(
  lazy(() => import('../layouts/full/FullLayout'))
);

const BlankLayout = Loadable(
  lazy(() => import('../layouts/blank/BlankLayout'))
);

const ProtectedRoute = Loadable(
  lazy(() => import('../routes/ProtectedRoute'))
);


/* =========================================================
   AUTHENTICATION
========================================================= */

const Register2 = Loadable(
  lazy(() => import('../views/authentication/auth2/Register'))
);

const Maintainance = Loadable(
  lazy(() => import('../views/authentication/Maintainance'))
);

const AdminLogin = Loadable(
  lazy(() => import('../views/adminLogin/adminLogin'))
);


/* =========================================================
   DASHBOARD
========================================================= */

const Modern = Loadable(
  lazy(() => import('../views/dashboards/Modern'))
);


/* =========================================================
   USER PROFILE
========================================================= */

const UserProfile = Loadable(
  lazy(() => import('../views/pages/user-profile/UserProfile'))
);


/* =========================================================
   ORDERS
========================================================= */

const Orders = Loadable(
  lazy(() => import('../views/Orders/Orders'))
);

const OrderDetails = Loadable(
  lazy(() => import('../views/Orders/OrderDetails'))
);


/* =========================================================
   PRODUCTS
========================================================= */

const Products = Loadable(
  lazy(() => import('../views/Products/Products'))
);

const AddProduct = Loadable(
  lazy(() => import('../views/Products/Addproduct'))
);

const ProductDetails = Loadable(
  lazy(() => import('../views/Products/ProductDetail'))
);

const EditProduct = Loadable(
  lazy(() => import('../views/Products/EditProduct'))
);


/* =========================================================
   CATEGORIES
========================================================= */

const Categories = Loadable(
  lazy(() => import('../views/Categories/Categories'))
);

const AddCategories = Loadable(
  lazy(() => import('../views/Categories/AddCategories'))
);

const CategoryDetails = Loadable(
  lazy(() => import('../views/Categories/CategoryDetails'))
);

const EditCategory = Loadable(
  lazy(() => import('../views/Categories/EditCategories'))
);


/* =========================================================
   CUSTOMERS
========================================================= */

const Customers = Loadable(
  lazy(() => import('../views/Customers/Customers'))
);

const AddCustomer = Loadable(
  lazy(() => import('../views/Customers/Addcustomers'))
);

const CustomerDetails = Loadable(
  lazy(() => import('../views/Customers/CustomerDetails'))
);

const EditCustomer = Loadable(
  lazy(() => import('../views/Customers/EditCustomers'))
);


/* =========================================================
   REVIEWS
========================================================= */

const Reviews = Loadable(
  lazy(() => import('../views/Reviews/Reviews'))
);

const ReviewDetails = Loadable(
  lazy(() => import('../views/Reviews/ReviewDetails'))
);


/* =========================================================
   PAYMENTS
========================================================= */

const Payments = Loadable(
  lazy(() => import('../views/Payments/Payments'))
);

const PaymentDetails = Loadable(
  lazy(() => import('../views/Payments/PaymentDetails'))
);


/* =========================================================
   BANNERS
========================================================= */

const Banners = Loadable(
  lazy(() => import('../views/Banners/Banners'))
);

const AddBanners = Loadable(
  lazy(() => import('../views/Banners/AddBanner'))
);

const BannerDetails = Loadable(
  lazy(() => import('../views/Banners/BannerDetails'))
);

const EditBanner = Loadable(
  lazy(() => import('../views/Banners/EditBanner'))
);


/* =========================================================
   NEWSLETTER
========================================================= */

const Newsletter = Loadable(
  lazy(() => import('../views/NewsLetter/NewsLetter'))
);

const NewsletterDetails = Loadable(
  lazy(() => import('../views/NewsLetter/NewsletterDetails'))
);


/* =========================================================
   CONTACT
========================================================= */

const Contact = Loadable(
  lazy(() => import('../views/Contact/Contact'))
);

const ContactDetails = Loadable(
  lazy(() => import('../views/Contact/ContactDetails'))
);


/* =========================================================
   VIDEO SECTION
========================================================= */

const VideoSection = Loadable(
  lazy(() => import('../views/VideoSection/VideoSection'))
);

const AddVideoSection = Loadable(
  lazy(() => import('../views/VideoSection/AddvideoSection'))
);

const EditVideoSection = Loadable(
  lazy(() => import('../views/VideoSection/EditVideoSection'))
);


/* =========================================================
   VARIANTS
========================================================= */

const Variant = Loadable(
  lazy(() => import('../views/Variants/Variants'))
);

const AddVariant = Loadable(
  lazy(() => import('../views/Variants/AddVariants'))
);

const VariantDetails = Loadable(
  lazy(() => import('../views/Variants/VariantDetails'))
);

const EditVariant = Loadable(
  lazy(() => import('../views/Variants/EditVariants'))
);


/* =========================================================
   CANCEL
========================================================= */

const Cancel = Loadable(
  lazy(() => import('../views/Cancel/Cancel'))
);


/* =========================================================
   RETURNS
========================================================= */

const Return = Loadable(
  lazy(() => import('../views/Return/Return'))
);

const ReturnDetails = Loadable(
  lazy(() => import('../views/Return/ReturnDetails'))
);


/* =========================================================
   EXCHANGES
========================================================= */

const Exchange = Loadable(
  lazy(() => import('../views/Exchange/Exchange'))
);

const ExchangeDetails = Loadable(
  lazy(() => import('../views/Exchange/ExchangeDetails'))
);


/* =========================================================
   APPS
========================================================= */

const Notes = Loadable(
  lazy(() => import('../views/apps/notes/Notes'))
);

const Form = Loadable(
  lazy(() => import('../views/utilities/form/Form'))
);

const Table = Loadable(
  lazy(() => import('../views/utilities/table/Table'))
);

const Tickets = Loadable(
  lazy(() => import('../views/apps/tickets/Tickets'))
);

const CreateTickets = Loadable(
  lazy(() => import('../views/apps/tickets/CreateTickets'))
);

const Blog = Loadable(
  lazy(() => import('../views/apps/blog/Blog'))
);

const BlogDetail = Loadable(
  lazy(() => import('../views/apps/blog/BlogDetail'))
);


/* =========================================================
   ICONS
========================================================= */

const SolarIcon = Loadable(
  lazy(() => import('../views/icons/SolarIcon'))
);


/* =========================================================
   ERROR
========================================================= */

const Error = Loadable(
  lazy(() => import('../views/authentication/Error'))
);


/* =========================================================
   ROUTER
========================================================= */

const Router = [

  /* =======================================================
     PROTECTED ADMIN ROUTES
  ======================================================= */

  {
    path: '/',
    element: <ProtectedRoute />,

    children: [

      {
        element: <FullLayout />,

        children: [

          /* -------------------------------------------------
             ADMIN ROOT
          ------------------------------------------------- */

          {
            path: '/',
            element: (
              <Navigate
                to="/dashboard"
                replace
              />
            ),
          },


          /* -------------------------------------------------
             DASHBOARD
          ------------------------------------------------- */

          {
            path: '/dashboard',
            element: <Modern />,
          },


          /* -------------------------------------------------
             ORDERS
          ------------------------------------------------- */

          {
            path: '/orders',
            element: <Orders />,
          },

          {
            path: '/orders/:id',
            element: <OrderDetails />,
          },


          /* -------------------------------------------------
             PRODUCTS
          ------------------------------------------------- */

          {
            path: '/products',
            element: <Products />,
          },

          {
            path: '/products/add',
            element: <AddProduct />,
          },

          {
            path: '/products/:id',
            element: <ProductDetails />,
          },

          {
            path: '/products/edit/:id',
            element: <EditProduct />,
          },


          /* -------------------------------------------------
             CATEGORIES
          ------------------------------------------------- */

          {
            path: '/categories',
            element: <Categories />,
          },

          {
            path: '/categories/add',
            element: <AddCategories />,
          },

          {
            path: '/categories/:id',
            element: <CategoryDetails />,
          },

          {
            path: '/categories/edit/:id',
            element: <EditCategory />,
          },


          /* -------------------------------------------------
             CUSTOMERS
          ------------------------------------------------- */

          {
            path: '/customers',
            element: <Customers />,
          },

          {
            path: '/customers/add',
            element: <AddCustomer />,
          },

          {
            path: '/customers/:id',
            element: <CustomerDetails />,
          },

          {
            path: '/customers/edit/:id',
            element: <EditCustomer />,
          },


          /* -------------------------------------------------
             REVIEWS
          ------------------------------------------------- */

          {
            path: '/reviews',
            element: <Reviews />,
          },

          {
            path: '/reviews/:id',
            element: <ReviewDetails />,
          },


          /* -------------------------------------------------
             PAYMENTS
          ------------------------------------------------- */

          {
            path: '/payments',
            element: <Payments />,
          },

          {
            path: '/payments/:id',
            element: <PaymentDetails />,
          },


          /* -------------------------------------------------
             BANNERS
          ------------------------------------------------- */

          {
            path: '/banners',
            element: <Banners />,
          },

          {
            path: '/banners/add',
            element: <AddBanners />,
          },

          {
            path: '/banners/:id',
            element: <BannerDetails />,
          },

          {
            path: '/banners/edit/:id',
            element: <EditBanner />,
          },


          /* -------------------------------------------------
             NEWSLETTER
          ------------------------------------------------- */

          {
            path: '/newsletter',
            element: <Newsletter />,
          },

          {
            path: '/newsletter/:id',
            element: <NewsletterDetails />,
          },


          /* -------------------------------------------------
             CONTACTS
          ------------------------------------------------- */

          {
            path: '/contacts',
            element: <Contact />,
          },

          {
            path: '/contacts/:id',
            element: <ContactDetails />,
          },


          /* -------------------------------------------------
             VIDEO SECTION
          ------------------------------------------------- */

          {
            path: '/video-section',
            element: <VideoSection />,
          },

          {
            path: '/video-section/add',
            element: <AddVideoSection />,
          },

          {
            path: '/video-section/edit/:id',
            element: <EditVideoSection />,
          },


          /* -------------------------------------------------
             VARIANTS
          ------------------------------------------------- */

          {
            path: '/variants',
            element: <Variant />,
          },

          {
            path: '/variants/add',
            element: <AddVariant />,
          },

          {
            path: '/variants/:id',
            element: <VariantDetails />,
          },

          {
            path: '/variants/edit/:id',
            element: <EditVariant />,
          },


          /* -------------------------------------------------
             CANCEL
          ------------------------------------------------- */

          {
            path: '/cancel',
            element: <Cancel />,
          },


          /* -------------------------------------------------
             RETURNS
          ------------------------------------------------- */

          {
            path: '/returns',
            element: <Return />,
          },

          {
            path: '/returns/:id',
            element: <ReturnDetails />,
          },


          /* -------------------------------------------------
             EXCHANGES
          ------------------------------------------------- */

          {
            path: '/exchanges',
            element: <Exchange />,
          },

          {
            path: '/exchanges/:id',
            element: <ExchangeDetails />,
          },


          /* -------------------------------------------------
             APPS
          ------------------------------------------------- */

          {
            path: '/apps/notes',
            element: <Notes />,
          },

          {
            path: '/utilities/form',
            element: <Form />,
          },

          {
            path: '/utilities/table',
            element: <Table />,
          },

          {
            path: '/apps/tickets',
            element: <Tickets />,
          },

          {
            path: '/apps/tickets/create',
            element: <CreateTickets />,
          },

          {
            path: '/apps/blog/post',
            element: <Blog />,
          },

          {
            path: '/apps/blog/detail/:id',
            element: <BlogDetail />,
          },


          /* -------------------------------------------------
             USER PROFILE
          ------------------------------------------------- */

          {
            path: '/user-profile',
            element: <UserProfile />,
          },


          /* -------------------------------------------------
             ICONS
          ------------------------------------------------- */

          {
            path: '/icons/iconify',
            element: <SolarIcon />,
          },


          /* -------------------------------------------------
             ADMIN 404
          ------------------------------------------------- */

          {
            path: '*',
            element: (
              <Navigate
                to="/auth/404"
                replace
              />
            ),
          },

        ],
      },

    ],
  },


  /* =======================================================
     PUBLIC AUTH ROUTES
  ======================================================= */

  {
    path: '/',
    element: <BlankLayout />,

    children: [

      /* -------------------------------------------------
         ADMIN LOGIN
      ------------------------------------------------- */

      {
        path: '/login',
        element: <AdminLogin />,
      },


      /* -------------------------------------------------
         REGISTER
      ------------------------------------------------- */

      {
        path: '/auth/auth2/register',
        element: <Register2 />,
      },


      /* -------------------------------------------------
         MAINTENANCE
      ------------------------------------------------- */

      {
        path: '/auth/maintenance',
        element: <Maintainance />,
      },


      /* -------------------------------------------------
         404
      ------------------------------------------------- */

      {
        path: '/auth/404',
        element: <Error />,
      },

      {
        path: '*',
        element: (
          <Navigate
            to="/auth/404"
            replace
          />
        ),
      },

    ],
  },

];


/* =========================================================
   CREATE ROUTER
========================================================= */

const router = createBrowserRouter(
  Router,
  {
    basename: "/ostik-admin",
  }
);

export default router;