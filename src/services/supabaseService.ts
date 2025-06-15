
import { supabase } from "@/integrations/supabase/client";
import { productService } from "./products/productService";
import { categoryService } from "./categories/categoryService";
import { customerService } from "./customers/customerService";
import { orderService } from "./orders/orderService";
import { inventoryService } from "./inventory/inventoryService";

// Re-export types for backward compatibility
export type { 
  SupabaseProduct, 
  SupabaseCategory, 
  SupabaseCustomer, 
  SupabaseOrder 
} from "./types/supabaseTypes";

class SupabaseService {
  // Expose the supabase client for direct access when needed
  public supabase = supabase;

  // Products
  async getProducts(categoryId?: string) {
    return productService.getProducts(categoryId);
  }

  async getProduct(id: string) {
    return productService.getProduct(id);
  }

  async createProduct(product: Parameters<typeof productService.createProduct>[0]) {
    return productService.createProduct(product);
  }

  async updateProductStock(productId: string, quantity: number) {
    return productService.updateProductStock(productId, quantity);
  }

  async searchProducts(searchTerm: string) {
    return productService.searchProducts(searchTerm);
  }

  // Categories
  async getCategories() {
    return categoryService.getCategories();
  }

  async createCategory(category: Parameters<typeof categoryService.createCategory>[0]) {
    return categoryService.createCategory(category);
  }

  // Customers
  async createCustomer(customer: Parameters<typeof customerService.createCustomer>[0]) {
    return customerService.createCustomer(customer);
  }

  async getCustomer(id: number) {
    return customerService.getCustomer(id);
  }

  async getCurrentUserCustomer() {
    return customerService.getCurrentUserCustomer();
  }

  async getCustomerByUserId(userId: string) {
    return customerService.getCustomerByUserId(userId);
  }

  async updateCustomer(id: number, updates: Parameters<typeof customerService.updateCustomer>[1]) {
    return customerService.updateCustomer(id, updates);
  }

  // Orders
  async createOrder(order: Parameters<typeof orderService.createOrder>[0]) {
    return orderService.createOrder(order);
  }

  async getOrders(customerId: number) {
    return orderService.getOrders(customerId);
  }

  async getAllOrders() {
    return orderService.getAllOrders();
  }

  async getOrder(id: string) {
    return orderService.getOrder(id);
  }

  async createOrderItem(orderItem: Parameters<typeof orderService.createOrderItem>[0]) {
    return orderService.createOrderItem(orderItem);
  }

  async updateOrderStatus(orderId: string, status: string) {
    return orderService.updateOrderStatus(orderId, status);
  }

  async updatePaymentStatus(orderId: string, paymentStatus: string) {
    return orderService.updatePaymentStatus(orderId, paymentStatus);
  }

  async getCustomerOrdersByUserId(userId: string) {
    return orderService.getCustomerOrdersByUserId(userId);
  }

  async deleteOrder(orderId: string) {
    return orderService.deleteOrder(orderId);
  }

  async restoreStockForCancelledOrder(orderId: string) {
    return orderService.restoreStockForCancelledOrder(orderId);
  }

  // Inventory
  async createInventoryMovement(movement: Parameters<typeof inventoryService.createInventoryMovement>[0]) {
    return inventoryService.createInventoryMovement(movement);
  }

  async getInventoryMovements(productId: string) {
    return inventoryService.getInventoryMovements(productId);
  }
}

export const supabaseService = new SupabaseService();
