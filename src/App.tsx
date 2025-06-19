import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from './contexts/LanguageContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './hooks/useAuth';
import { ErrorBoundary, RouteErrorBoundary } from './components/ErrorBoundary';
import { logger } from './services/logger';
import ChatBot from './components/chatbot/ChatBot';
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Shop from "./pages/Shop";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import Events from "./pages/Events";
import Account from "./pages/Account";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import Settings from "./pages/Settings";
import AdminPage from "./pages/AdminPage";
import AdminSetupPage from "./pages/AdminSetupPage";
import AuthPage from "./pages/AuthPage";
import CreateCustomerPage from "./pages/CreateCustomerPage";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import DebugPage from "./pages/DebugPage";

const queryClient = new QueryClient();

function App() {
  // Initialize logger with user context when available
  React.useEffect(() => {
    logger.info('Application started', {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  }, []);

  return (
    <ErrorBoundary
      showDetails={process.env.NODE_ENV === 'development'}
      onError={(error, errorInfo) => {
        logger.critical('Application-level error caught', error, {
          errorInfo,
          source: 'app_error_boundary'
        });
      }}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <CartProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <RouteErrorBoundary>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/menu" element={<Menu />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/recipes" element={<Recipes />} />
                        <Route path="/recipes/:id" element={<RecipeDetail />} />
                        <Route path="/recipe/:id" element={<RecipeDetail />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/orders/:id" element={<OrderDetailsPage />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/admin-setup" element={<AdminSetupPage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/create-customer" element={<CreateCustomerPage />} />
                        <Route path="/shipping" element={<Shipping />} />
                        <Route path="/returns" element={<Returns />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/debug" element={<DebugPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </RouteErrorBoundary>
                    <ChatBot />
                  </BrowserRouter>
                </TooltipProvider>
              </CartProvider>
            </CurrencyProvider>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
