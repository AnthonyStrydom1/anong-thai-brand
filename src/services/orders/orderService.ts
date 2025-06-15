
import { orderCoreService } from "./orderCoreService";
import { orderStatusService } from "./orderStatusService";
import { orderStockService } from "./orderStockService";
import { orderDeletionService } from "./orderDeletionService";
import type { Database } from "@/integrations/supabase/types";

class OrderService {
  // Core operations
  async createOrder(order: Database['public']['Tables']['orders']['Insert']) {
    return orderCoreService.createOrder(order);
  }

  async getOrders(customerId: number) {
    return orderCoreService.getOrders(customerId);
  }

  async getAllOrders() {
    return orderCoreService.getAllOrders();
  }

  async getOrder(id: string) {
    return orderCoreService.getOrder(id);
  }

  async createOrderItem(orderItem: Parameters<typeof orderCoreService.createOrderItem>[0]) {
    return orderCoreService.createOrderItem(orderItem);
  }

  async getCustomerOrdersByUserId(userId: string) {
    return orderCoreService.getCustomerOrdersByUserId(userId);
  }

  // Status operations
  async updateOrderStatus(orderId: string, status: string) {
    return orderStatusService.updateOrderStatus(orderId, status);
  }

  async updatePaymentStatus(orderId: string, paymentStatus: string) {
    return orderStatusService.updatePaymentStatus(orderId, paymentStatus);
  }

  async updateTrackingNumber(orderId: string, trackingNumber: string) {
    return orderStatusService.updateTrackingNumber(orderId, trackingNumber);
  }

  // Stock operations
  async restoreStockForCancelledOrder(orderId: string) {
    return orderStockService.restoreStockForCancelledOrder(orderId);
  }

  // Deletion operations
  async deleteOrder(orderId: string) {
    return orderDeletionService.deleteOrder(orderId);
  }
}

export const orderService = new OrderService();
