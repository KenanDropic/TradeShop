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
} from "./screens/index";
import SharedLayout from "./components/SharedLayout";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<SharedLayout />}>
            <Route index element={<HomeS />} />
            <Route exact path="/products/:id" element={<ProductS />} />
            <Route exact path="/cart" element={<CartS />} />
            <Route exact path="/cart/:id" element={<CartS />} />
            <Route exact path="/login" element={<LoginS />} />
            <Route exact path="/register" element={<RegisterS />} />
            <Route exact path="/profile" element={<PrivateRoute />}>
              <Route exact path="/profile" element={<ProfileS />} />
            </Route>
            <Route exact path="/shipping" element={<PrivateRoute />}>
              <Route exact path="/shipping" element={<ShippingS />} />
            </Route>
            <Route exact path="/payment" element={<PrivateRoute />}>
              <Route exact path="/payment" element={<PaymentS />} />
            </Route>
            <Route exact path="/placeorder" element={<PrivateRoute />}>
              <Route exact path="/placeorder" element={<PlaceOrderS />} />
            </Route>
            <Route exact path="/orders/:id" element={<PrivateRoute />}>
              <Route exact path="/orders/:id" element={<OrderS />} />
            </Route>
          </Route>
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
