
import { toast } from "@/hooks/use-toast";

export const useOrderBulkOperations = (
  selectedOrders: string[],
  setSelectedOrders: (orders: string[]) => void,
  filteredOrders: any[],
  updateOrderStatus: (orderId: string, status: string) => Promise<void>
) => {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    try {
      for (const orderId of selectedOrders) {
        await updateOrderStatus(orderId, newStatus);
      }
      setSelectedOrders([]);
      toast({
        title: "Success",
        description: `Updated ${selectedOrders.length} orders to ${newStatus}`,
      });
    } catch (error) {
      console.error('Bulk update failed:', error);
      toast({
        title: "Error",
        description: "Failed to update some orders",
        variant: "destructive"
      });
    }
  };

  const handleExportOrders = () => {
    const csvContent = [
      ['Order Number', 'Status', 'Payment Status', 'Total Amount', 'Created Date'].join(','),
      ...filteredOrders.map(order => [
        order.order_number,
        order.status,
        order.payment_status,
        order.total_amount,
        new Date(order.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return {
    handleSelectAll,
    handleBulkStatusUpdate,
    handleExportOrders,
  };
};
