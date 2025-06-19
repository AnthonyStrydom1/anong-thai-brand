
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  console.log('🚀 App component initializing...');

  // Initialize logger with user context when available
  React.useEffect(() => {
    try {
      logger.info('Application started', {
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      });
      console.log('✅ Logger initialized successfully');
    } catch (error) {
      console.error('❌ Logger initialization failed:', error);
    }
  }, []);

  try {
    return (
      <ErrorBoundary
        showDetails={true}
        onError={(error, errorInfo) => {
          console.error('🚨 Application-level error caught:', error);
          console.error('Error info:', errorInfo);
          try {
            logger.critical('Application-level error caught', error, {
              errorInfo,
              source: 'app_error_boundary'
            });
          } catch (logError) {
            console.error('Failed to log error:', logError);
          }
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
  } catch (error) {
    console.error('🚨 Critical error in App component:', error);
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Critical Error</h1>
          <p className="text-gray-600 mb-4">Something went wrong while loading the application.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}

export default App;
