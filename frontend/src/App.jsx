import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AgAlertBar, AgNavbar, AgFooter } from './components/AgComponents';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// User pages
import Home from './pages/user/Home';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import Payment from './pages/user/Payment';
import OrderSuccess from './pages/user/OrderSuccess';

// Admin pages
import AdminProducts from './pages/admin/Products';

import './index.css';

function App() {
  return (
    <Router>
      <div className="bold-petals-site">
        <AgAlertBar text="🎁 Free shipping on all orders above Rs. 999!" />
        <AgNavbar />

        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected user routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <PrivateRoute>
                <Payment />
              </PrivateRoute>
            }
          />

          <Route
            path="/order-success"
            element={
              <PrivateRoute>
                <OrderSuccess />
              </PrivateRoute>
            }
          />

          {/* Protected admin routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />
          
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />
        </Routes>

        <AgFooter />
      </div>
    </Router>
  );
}

export default App;