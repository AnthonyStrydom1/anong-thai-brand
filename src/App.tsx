
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/hooks/auth/AuthProvider";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Shop from "./pages/Shop";
import ProductDetailPage from "./pages/ProductDetailPage";
import Menu from "./pages/Menu";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Events from "./pages/Events";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Account from "./pages/Account";
import Orders from "./pages/Orders";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import Settings from "./pages/Settings";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import AdminSetupPage from "./pages/AdminSetupPage";
import CreateCustomerPage from "./pages/CreateCustomerPage";
import TestEmailPage from "./pages/TestEmailPage";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import NotFound from "./pages/NotFound";
import ProtectedAuthRoute from "./components/ProtectedAuthRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <LanguageProvider>
          <CurrencyProvider>
            <CartProvider>
              <AuthProvider>
                <div className="min-h-screen flex flex-col">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/shop/:id" element={<ProductDetailPage />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/recipes" element={<Recipes />} />
                    <Route path="/recipes/:id" element={<RecipeDetail />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/shipping" element={<Shipping />} />
                    <Route path="/returns" element={<Returns />} />
                    
                    {/* Protected routes */}
                    <Route path="/profile" element={
                      <ProtectedAuthRoute>
                        <Profile />
                      </ProtectedAuthRoute>
                    } />
                    <Route path="/account" element={
                      <ProtectedAuthRoute>
                        <Account />
                      </ProtectedAuthRoute>
                    } />
                    <Route path="/orders" element={
                      <ProtectedAuthRoute>
                        <Orders />
                      </ProtectedAuthRoute>
                    } />
                    <Route path="/orders/:id" element={
                      <ProtectedAuthRoute>
                        <OrderDetailsPage />
                      </ProtectedAuthRoute>
                    } />
                    <Route path="/settings" element={
                      <ProtectedAuthRoute>
                        <Settings />
                      </ProtectedAuthRoute>
                    } />
                    
                    {/* Admin routes */}
                    <Route path="/admin" element={
                      <ProtectedAdminRoute>
                        <AdminPage />
                      </ProtectedAdminRoute>
                    } />
                    <Route path="/admin-setup" element={<AdminSetupPage />} />
                    <Route path="/create-customer" element={
                      <ProtectedAdminRoute>
                        <CreateCustomerPage />
                      </ProtectedAdminRoute>
                    } />
                    <Route path="/test-email" element={
                      <ProtectedAdminRoute>
                        <TestEmailPage />
                      </ProtectedAdminRoute>
                    } />
                    
                    {/* 404 route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <Toaster />
                <Sonner />
              </AuthProvider>
            </CartProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
