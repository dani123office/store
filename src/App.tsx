import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  Cart, Checkout, HomeLayout, Landing, Login, OrderConfirmation,
  OrderHistory, Register, Search, Shop, SingleOrderHistory,
  SingleProduct, UserProfile, Admin, AdminDashboard, AdminProducts,
  AdminOrders, AdminCustomers, AdminSettings, AdminCategories,
  AdminSubCategories, AdminCollections, AdminStaff, AdminPages,
  AdminMenus, AdminNotifications, AdminTax, AdminAddProduct, AdminInventory,
  AdminAnalytics, AdminMarketing, AdminDiscounts,
  AdminApps, AdminThemeEditor, Wishlist,
  AdminMedia, AdminNav, AdminFacebookAds, AdminPreferences
} from "./pages";
import { checkoutAction, searchAction } from "./actions/index";
import { shopCategoryLoader } from "./pages/Shop";
import { loader as orderHistoryLoader } from "./pages/OrderHistory";
import { loader as singleOrderLoader } from "./pages/SingleOrderHistory";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "shop", element: <Shop /> },
      { path: "shop/:category", element: <Shop />, loader: shopCategoryLoader },
      { path: "product/:id", element: <SingleProduct /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout />, action: checkoutAction },
      { path: "search", action: searchAction, element: <Search /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "order-confirmation", element: <OrderConfirmation /> },
      { path: "user-profile", element: <UserProfile /> },
      { path: "order-history", element: <OrderHistory />, loader: orderHistoryLoader },
      { path: "order-history/:id", element: <SingleOrderHistory />, loader: singleOrderLoader },
      { path: "wishlist", element: <Wishlist /> },
    ],
  },
  {
    path: "/admin",
    element: <Admin />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "products", element: <AdminProducts /> },
      { path: "products/add", element: <AdminAddProduct /> },
      { path: "products/edit/:id", element: <AdminAddProduct /> },
      { path: "inventory", element: <AdminInventory /> },
      { path: "categories", element: <AdminCategories /> },
      { path: "subcategories", element: <AdminSubCategories /> },
      { path: "collections", element: <AdminCollections /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "customers", element: <AdminCustomers /> },
      { path: "staff", element: <AdminStaff /> },
      { path: "pages", element: <AdminPages /> },
      { path: "menus", element: <AdminMenus /> },
      { path: "notifications", element: <AdminNotifications /> },
      { path: "tax", element: <AdminTax /> },
      { path: "settings", element: <AdminSettings /> },
      { path: "analytics", element: <AdminAnalytics /> },
      { path: "marketing", element: <AdminMarketing /> },
      { path: "discounts", element: <AdminDiscounts /> },
      { path: "apps", element: <AdminApps /> },
      { path: "theme-editor", element: <AdminThemeEditor /> },
      { path: "media", element: <AdminMedia /> },
      { path: "seo", element: <AdminPreferences /> },
      { path: "preferences", element: <AdminPreferences /> },
      { path: "nav", element: <AdminNav /> },
      { path: "facebook-ads", element: <AdminFacebookAds /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
