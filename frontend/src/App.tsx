import { lazy } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import Home from './pages/Home';

// Route-level code splitting: everything but the home page loads on demand.
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const SearchPage = lazy(() => import('./pages/Search'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const Login = lazy(() => import('./pages/Login'));
const Account = lazy(() => import('./pages/Account'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Policy = lazy(() => import('./pages/Policy'));
const NotFound = lazy(() => import('./pages/NotFound'));

function Root() {
  return (
    <ToastProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Outlet />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <Home /> },
          { path: 'collections', element: <Shop /> },
          { path: 'collections/:handle', element: <Shop /> },
          { path: 'collections/:handle/:sub', element: <Shop /> },
          { path: 'products/:slug', element: <ProductDetail /> },
          { path: 'search', element: <SearchPage /> },
          { path: 'wishlist', element: <Wishlist /> },
          { path: 'cart', element: <Cart /> },
          { path: 'checkout', element: <Checkout /> },
          { path: 'order-confirmation/:id', element: <OrderConfirmation /> },
          { path: 'login', element: <Login /> },
          { path: 'account', element: <Account /> },
          { path: 'about', element: <About /> },
          { path: 'contact', element: <Contact /> },
          { path: 'track-order', element: <TrackOrder /> },
          { path: 'faq', element: <FAQ /> },
          { path: 'privacy-policy', element: <Policy kind="privacy" /> },
          { path: 'return-policy', element: <Policy kind="returns" /> },
          { path: 'shipping-policy', element: <Policy kind="shipping" /> },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
