// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router';
import Loadable from '../layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

// authentication

const Register2 = Loadable(lazy(() => import('../views/authentication/auth2/Register')));

const Maintainance = Loadable(lazy(() => import('../views/authentication/Maintainance')));



//adminLogin
const AdminLogin= Loadable(lazy(()=> import('../views/adminLogin/adminLogin')))

// Dashboards
const Modern = Loadable(lazy(() => import('../views/dashboards/Modern')));

//pages
const UserProfile = Loadable(lazy(() => import('../views/pages/user-profile/UserProfile')));

//admin pages
const Orders= Loadable(lazy(()=> import('../views/Orders/Orders')))
const OrderDetails= Loadable(lazy(()=> import('../views/Orders/OrderDetails')))
const Products= Loadable(lazy(()=> import('../views/Products/Products')))
const AddProduct = Loadable(lazy(() => import("../views/Products/Addproduct")));
const ProductDetails = Loadable(lazy(() => import("../views/Products/ProductDetail")));
const EditProduct = Loadable(lazy(() => import("../views/Products/EditProduct")));
const Categories = Loadable(lazy(() => import('../views/Categories/Categories')));
const AddCategories = Loadable(lazy(() => import('../views/Categories/AddCategories')));
const CategoryDetails = Loadable(lazy(() => import('../views/Categories/CategoryDetails')));
const EditCategory = Loadable(lazy(() => import('../views/Categories/EditCategories')));
const Customers = Loadable(lazy(() => import('../views/Customers/Customers')));
const AddCustomer = Loadable(lazy(() => import('../views/Customers/Addcustomers')));
const CustomerDetails = Loadable(lazy(() => import('../views/Customers/CustomerDetails')));
const EditCustomer = Loadable(lazy(() => import('../views/Customers/EditCustomers')));
const Reviews = Loadable(lazy(() => import('../views/Reviews/Reviews')));
const ReviewDetails = Loadable(lazy(() => import('../views/Reviews/ReviewDetails')));
const Payments = Loadable(lazy(() => import('../views/Payments/Payments')));
const PaymentDetails = Loadable(lazy(() => import('../views/Payments/PaymentDetails')));
const Banners = Loadable(lazy(() => import('../views/Banners/Banners')));
const AddBanners = Loadable(lazy(() => import('../views/Banners/AddBanner')));
const BannerDetails = Loadable(lazy(() => import('../views/Banners/BannerDetails')));
const EditBanner = Loadable(lazy(() => import('../views/Banners/EditBanner')));
const Newsletter = Loadable(lazy(() => import('../views/NewsLetter/NewsLetter')));
const NewsletterDetails = Loadable(lazy(() => import('../views/NewsLetter/NewsletterDetails')));
const Contact = Loadable(lazy(() => import('../views/Contact/Contact')));
const ContactDetails = Loadable(lazy(() => import('../views/Contact/ContactDetails')));
const VideoSection = Loadable(lazy(() => import('../views/VideoSection/VideoSection')));
const AddVideoSection = Loadable(lazy(() => import('../views/VideoSection/AddvideoSection')));
const EditVideoSection = Loadable(lazy(() => import('../views/VideoSection/EditVideoSection')));
const Variant = Loadable(lazy(() => import('../views/Variants/Variants')));
const AddVariant = Loadable(lazy(() => import('../views/Variants/AddVariants')));
const VariantDetails = Loadable(lazy(() => import('../views/Variants/VariantDetails')));
const EditVariant = Loadable(lazy(() => import('../views/Variants/EditVariants')));
const Cancel = Loadable(lazy(() => import('../views/Cancel/Cancel')));
const Return = Loadable(lazy(() => import('../views/Return/Return')));
const ReturnDetails = Loadable(lazy(() => import('../views/Return/ReturnDetails')));
const Exchange = Loadable(lazy(() => import('../views/Exchange/Exchange')));
const ExchangeDetails = Loadable(lazy(() => import('../views/Exchange/ExchangeDetails')));


/* ****Apps***** */
const Notes = Loadable(lazy(() => import('../views/apps/notes/Notes')));
const Form = Loadable(lazy(() => import('../views/utilities/form/Form')));
const Table = Loadable(lazy(() => import('../views/utilities/table/Table')));
const Tickets = Loadable(lazy(() => import('../views/apps/tickets/Tickets')));
const CreateTickets = Loadable(lazy(() => import('../views/apps/tickets/CreateTickets')));
const Blog = Loadable(lazy(() => import('../views/apps/blog/Blog')));
const BlogDetail = Loadable(lazy(() => import('../views/apps/blog/BlogDetail')));

const Error = Loadable(lazy(() => import('../views/authentication/Error')));

// // icons
const SolarIcon = Loadable(lazy(() => import('../views/icons/SolarIcon')));

// const SamplePage = lazy(() => import('../views/sample-page/SamplePage'));

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: (<Navigate to="/ostik-admin/login" replace/>) }, 
      { path: "/ostik-admin/dashboard", element: <Modern /> },
      { path: '/ostik-admin/orders', exact: true, element: <Orders /> }, 
      { path: '/ostik-admin/orders/:id', exact: true, element: <OrderDetails /> }, 
      { path: '/ostik-admin/products', exact: true, element: <Products /> }, 
      { path: '/ostik-admin/products/add', exact: true, element: <AddProduct /> }, 
      { path: '/ostik-admin/products/:id', exact: true, element: <ProductDetails /> }, 
      { path: '/ostik-admin/products/edit/:id', exact: true, element: <EditProduct /> }, 
      { path: '/ostik-admin/categories', exact: true, element: <Categories/> }, 
      { path: '/ostik-admin/categories/add', exact: true, element: <AddCategories/> }, 
      { path: '/ostik-admin/categories/:id', exact: true, element: <CategoryDetails/> }, 
      { path: '/ostik-admin/categories/edit/:id', exact: true, element: <EditCategory/> }, 
      { path: '/ostik-admin/customers', exact: true, element: <Customers/> }, 
      { path: '/ostik-admin/customers/add', exact: true, element: <AddCustomer/> }, 
      { path: '/ostik-admin/customers/:id', exact: true, element: <CustomerDetails/> }, 
      { path: '/ostik-admin/customers/edit/:id', exact: true, element: <EditCustomer/> },   
      { path: '/ostik-admin/reviews', exact: true, element: <Reviews/> },   
      { path: '/ostik-admin/reviews/:id', exact: true, element: <ReviewDetails/> },   
      { path: '/ostik-admin/payments', exact: true, element: <Payments/> },   
      { path: '/ostik-admin/payments/:id', exact: true, element: <PaymentDetails/> },   
      { path: '/ostik-admin/banners', exact: true, element: <Banners/> },   
      { path: '/ostik-admin/banners/add', exact: true, element: <AddBanners/> },   
      { path: '/ostik-admin/banners/:id', exact: true, element: <BannerDetails/> },   
      { path: '/ostik-admin/banners/edit/:id', exact: true, element: <EditBanner/> },   
      { path: '/ostik-admin/newsletter', exact: true, element: <Newsletter/> },   
      { path: '/ostik-admin/newsletter/:id', exact: true, element: <NewsletterDetails/> },  
      { path: '/ostik-admin/contacts', exact: true, element: <Contact/> },  
      { path: '/ostik-admin/contacts/:id', exact: true, element: <ContactDetails/> },  
      { path: '/ostik-admin/video-section', exact: true, element: <VideoSection/> },  
      { path: '/ostik-admin/video-section/add', exact: true, element: <AddVideoSection/> },  
      { path: '/ostik-admin/video-section/edit/:id', exact: true, element: <EditVideoSection/> },
      { path: '/ostik-admin/variants', exact: true, element: <Variant/> },
      { path: '/ostik-admin/variants/add', exact: true, element: <AddVariant/> },
      { path: '/ostik-admin/variants/:id', exact: true, element: <VariantDetails/> },
      { path: '/ostik-admin/variants/edit/:id', exact: true, element: <EditVariant/> },
      { path: '/ostik-admin/cancel', exact: true, element: <Cancel/> },
      { path: '/ostik-admin/returns', exact: true, element: <Return/> },
      { path: '/ostik-admin/returns/:id', exact: true, element: <ReturnDetails/> },
      { path: '/ostik-admin/exchanges', exact: true, element: <Exchange/> },
      { path: '/ostik-admin/exchanges/:id', exact: true, element: <ExchangeDetails/> },
      { path: '*', element: <Navigate to="/auth/404" /> },

      { path: '/apps/notes', element: <Notes /> },
      { path: '/utilities/form', element: <Form /> },
      { path: '/utilities/table', element: <Table /> },
      { path: '/apps/tickets', element: <Tickets /> },
      { path: '/apps/tickets/create', element: <CreateTickets /> },
      { path: '/apps/blog/post', element: <Blog /> },
      { path: '/apps/blog/detail/:id', element: <BlogDetail /> },
      { path: '/user-profile', element: <UserProfile /> },
      { path: '/icons/iconify', element: <SolarIcon /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [

      { path: '/auth/auth2/register', element: <Register2 /> },

      { path: '/auth/maintenance', element: <Maintainance /> },
      { path: '/ostik-admin/login', element: <AdminLogin /> },
      { path: '404', element: <Error /> },
      { path: '/auth/404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

const router = createBrowserRouter(Router,
  {
    basename: "/ostik-admin"
  }
);

export default router;
