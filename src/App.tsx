
import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import NavigationBanner from "@/components/NavigationBanner";

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
import CreateCustomerPage from "./pages/CreateCustomerPage";
import AdminPage from "./pages/AdminPage";

const queryClient = new QueryClient();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  const handleLogin = async (email?: string, password?: string) => {
    if (email && password) {
      setIsLoggedIn(true);
      setUserEmail(email);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
  };

  // Check for existing session on app load
  useEffect(() => {
    const savedLoginState = localStorage.getItem("isLoggedIn");
    const savedEmail = localStorage.getItem("userEmail");
    if (savedLoginState === "true" && savedEmail) {
      setIsLoggedIn(true);
      setUserEmail(savedEmail);
    }
  }, []);

  // Listen to localStorage changes
  useEffect(() => {
    const onStorageChange = () => {
      const loginState = localStorage.getItem("isLoggedIn") === "true";
      const email = localStorage.getItem("userEmail") || '';
      setIsLoggedIn(loginState);
      setUserEmail(email);
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <CurrencyProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <NavigationBanner
                  isLoggedIn={isLoggedIn}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
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
                  <Route 
                    path="/account" 
                    element={
                      <Account 
                        isLoggedIn={isLoggedIn}
                        onLogin={handleLogin}
                        onLogout={handleLogout}
                      />
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <Profile 
                        isLoggedIn={isLoggedIn}
                        userEmail={userEmail}
                      />
                    } 
                  />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/create-customer" element={<CreateCustomerPage />} />
                  <Route path="/admin" element={<AdminPage />} />
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
