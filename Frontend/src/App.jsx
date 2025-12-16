import React, { useState, useEffect } from "react";
import { Route, Routes } from 'react-router-dom';
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import Navbar from "./components/Navbar/Navbar.jsx";
import LoginPopup from "./components/LoginPopup/LoginPopup.jsx";
import Footer from './components/Footer/Footer.jsx';
import ServiceDetail from "./pages/ServiceDetail/ServiceDetail";
import { CartProvider } from "./context/CartContext";
import Payment  from "./pages/Payment/Payment.jsx";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      {/* Show LoadingScreen if still loading */}
      {loading ? (
        <LoadingScreen />
      ) : (
        <CartProvider>
          {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
          <Navbar setShowLogin={setShowLogin} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/services/:serviceId" element={<ServiceDetail />} />
             <Route path="/payment" element={<Payment />} />

          </Routes>
          <Footer />
        </CartProvider>
      )}
    </>
  );
}

export default App;
