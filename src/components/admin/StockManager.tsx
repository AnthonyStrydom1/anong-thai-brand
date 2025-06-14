import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, AlertTriangle, Plus, Minus, Edit } from "lucide-react";
import { supabaseService, SupabaseProduct } from "@/services/supabaseService";
import { toast } from "@/components/ui/use-toast";
import { useAdminSecurity } from "@/hooks/useAdminSecurity";
import { useCurrency } from "@/contexts/CurrencyContext";

const StockManager = () => {
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const { logAdminAction } = useAdminSecurity();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      await logAdminAction('view', 'products_list', undefined, { action: 'load_products_for_stock_management' });
      const data = await supabaseService.getProducts();
      setProducts(data);
    } catch (error) {
      await logAdminAction('view', 'products_list', undefined, { error: error.message }, false);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStock = async (productId: string, quantity: number) => {
    const oldQuantity = products.find(p => p.id === productId)?.stock_quantity || 0;
    const product = products.find(p => p.id === productId);
    
    try {
      await supabaseService.updateProductStock(productId, quantity);
      
      // Create inventory movement record
      await supabaseService.createInventoryMovement({
        product_id: productId,
        movement_type: 'adjustment',
        quantity: quantity - oldQuantity,
        reference_type: 'adjustment',
        notes: 'Manual stock adjustment via admin portal'
      });

      // Log the security event
      await logAdminAction('update', 'product_stock', productId, {
        product_name: product?.name,
        product_sku: product?.sku,
        old_quantity: oldQuantity,
        new_quantity: quantity,
        quantity_change: quantity - oldQuantity,
        method: 'manual_adjustment'
      });

      await loadProducts();
      setEditingStock(null);
      
      toast({
        title: "Success",
        description: "Stock updated successfully"
      });
    } catch (error) {
      await logAdminAction('update', 'product_stock', productId, {
        product_name: product?.name,
        error: error.message,
        attempted_quantity: quantity
      }, false);
      
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive"
      });
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (quantity <= 5) return { label: 'Low Stock', variant: 'secondary' as const };
    return { label: 'In Stock', variant: 'default' as const };
  };

  const handleStockEdit = (productId: string, currentQuantity: number) => {
    setEditingStock(productId);
    setNewQuantity(currentQuantity);
  };

  if (isLoading) {
    return <div className="p-6">Loading stock information...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Stock Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.stock_quantity <= 5 && p.stock_quantity > 0).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.stock_quantity === 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Stock Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const stockStatus = getStockStatus(product.stock_quantity);
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {product.short_description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell>
                      {editingStock === product.id ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={newQuantity}
                            onChange={(e) => setNewQuantity(Number(e.target.value))}
                            className="w-20"
                            min="0"
                          />
                          <Button
                            size="sm"
                            onClick={() => updateStock(product.id, newQuantity)}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingStock(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <span className="text-lg font-semibold">{product.stock_quantity}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={stockStatus.variant}>
                        {stockStatus.label}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStockEdit(product.id, product.stock_quantity)}
                          disabled={editingStock === product.id}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockManager;
