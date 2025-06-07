import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

// Import your new CreateCustomerPage
import CreateCustomerPage from "./pages/CreateCustomerPage";

const queryClient = new QueryClient();

function App() {
  // Initialize login state from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const handleLogin = async (email?: string, password?: string) => {
    // Here you can add your login API logic if you have
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  // Optional: listen to localStorage changes (e.g. if multi-tabs)
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
                  <Route path="/account" element={<Account />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/events" element={<Events />} />

                  {/* NEW ROUTE for CreateCustomerPage */}
                  <Route path="/create-customer" element={<CreateCustomerPage />} />

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
