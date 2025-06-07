import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import UserMenu from "@/components/navigation/UserMenu";

// Pages
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetailPage from "./pages/ProductDetailPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Menu from "./pages/Menu";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import Events from "./pages/Events";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const queryClient = new QueryClient();

function PrivateRoute({ isLoggedIn, children }: { isLoggedIn: boolean; children: JSX.Element }) {
  const location = useLocation();
  if (!isLoggedIn) {
    // Redirect to login with the current location so user can be redirected back after login
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const handleLogin = async (email?: string, password?: string) => {
    // Simulate authentication here — replace with your real login logic
    if (!email || !password) throw new Error("Missing credentials");
    
    // Example: succeed always for demo purposes
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  useEffect(() => {
    const onStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  const translations = {
    login: "Login",
    profile: "My Profile",
    logout: "Logout",
    account: "My Account",
    orders: "My Orders",
    settings: "Settings",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <CurrencyProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <UserMenu
                  isLoggedIn={isLoggedIn}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                  translations={translations}
                />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/recipes" element={<Recipes />} />
                  <Route path="/recipes/:id" element={<RecipeDetail />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<Checkout />} />

                  {/* Public login page */}
                  <Route
                    path="/login"
                    element={<Login onLogin={handleLogin} />}
                  />

                  {/* Protected routes */}
                  <Route
                    path="/account"
                    element={
                      <PrivateRoute isLoggedIn={isLoggedIn}>
                        <Account />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute isLoggedIn={isLoggedIn}>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <PrivateRoute isLoggedIn={isLoggedIn}>
                        <Orders />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <PrivateRoute isLoggedIn={isLoggedIn}>
                        <Settings />
                      </PrivateRoute>
                    }
                  />

                  <Route path="/events" element={<Events />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
