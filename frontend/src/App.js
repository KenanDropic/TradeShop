import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  HomeS,
  ProductS,
  CartS,
  LoginS,
  RegisterS,
  ProfileS,
  ShippingS,
  PaymentS,
  PlaceOrderS,
  OrderS,
  ErrorS,
  AllUsersS,
  AllOrdersS,
  AllProductsS,
  EditUserS,
  UnauthorizedS,
  CreateProductS,
  EditProductS,
  ConfirmEmailS,
} from "./screens/index";
import SharedLayout from "./components/SharedLayout";
import PrivateRoute from "./components/PrivateRoute";
import IsEmailConfirmed from "./components/IsEmailConfirmed";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<SharedLayout />}>
            <Route index element={<HomeS />} />
            <Route exact path="/page/:pageNum" element={<HomeS />} />
            <Route
              exact
              path="/search/:keyword/page/:pageNum"
              element={<HomeS />}
            />
            <Route exact path="/products/:id" element={<ProductS />} />
            <Route exact path="/cart" element={<CartS />} />
            <Route exact path="/cart/:id" element={<CartS />} />
            <Route exact path="/login" element={<LoginS />} />
            <Route exact path="/register" element={<RegisterS />} />

            {/* Rute koje zahtijevaju autentifikaciju */}
            <Route element={<PrivateRoute allowedRoles={["user", "admin"]} />}>
              <Route element={<IsEmailConfirmed />}>
                <Route exact path="/profile" element={<ProfileS />} />
                <Route exact path="/shipping" element={<ShippingS />} />
                <Route exact path="/payment" element={<PaymentS />} />
                <Route exact path="/placeorder" element={<PlaceOrderS />} />
                <Route exact path="/orders/:id" element={<OrderS />} />
              </Route>
            </Route>
            {/* Rute koje zahtijevaju autentifikaciju i autorizaciju(ADMIN) */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route exact path="/admin/users" element={<AllUsersS />} />
              <Route exact path="/admin/products" element={<AllProductsS />} />
              <Route exact path="/admin/orders" element={<AllOrdersS />} />
              <Route
                exact
                path="/admin/users/:id/edit"
                element={<EditUserS />}
              />
              <Route
                exact
                path="/admin/products/create"
                element={<CreateProductS />}
              />
              <Route
                exact
                path="/admin/products/:id/edit"
                element={<EditProductS />}
              />
            </Route>
          </Route>
          <Route exact path="/unauthorized" element={<UnauthorizedS />} />
          <Route exact path="/confirmEmail" element={<ConfirmEmailS />} />
          <Route exact path="*" element={<ErrorS />} />
        </Routes>
      </Router>
      <ToastContainer
        autoClose={4000}
        draggable={false}
        pauseOnHover={false}
        pauseOnFocusLoss={false}
      />
    </>
  );
};

export default App;
