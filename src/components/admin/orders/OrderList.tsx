
import React from 'react';
import OrderStatusCard from './OrderStatusCard';
import OrdersEmptyState from './OrdersEmptyState';
import { ExtendedOrder } from '@/hooks/useOrderManager';

interface OrderListProps {
  filteredOrders: ExtendedOrder[];
  onStatusUpdate: (orderId: string, status: string) => void;
  onPaymentStatusUpdate: (orderId: string, paymentStatus: string) => void;
  onTrackingUpdate: (orderId: string, trackingNumber: string) => void;
  onViewDetails: (orderId: string) => void;
  onDeleteOrder: (orderId: string) => void;
}

const OrderList = ({
  filteredOrders,
  onStatusUpdate,
  onPaymentStatusUpdate,
  onTrackingUpdate,
  onViewDetails,
  onDeleteOrder
}: OrderListProps) => {
  if (filteredOrders.length === 0) {
    return <OrdersEmptyState />;
  }

  return (
    <div className="grid gap-4">
      {filteredOrders.map((order) => (
        <OrderStatusCard
          key={order.id}
          order={order}
          onStatusUpdate={onStatusUpdate}
          onPaymentStatusUpdate={onPaymentStatusUpdate}
          onTrackingUpdate={onTrackingUpdate}
          onViewDetails={onViewDetails}
          onDeleteOrder={onDeleteOrder}
        />
      ))}
    </div>
  );
};

export default OrderList;
