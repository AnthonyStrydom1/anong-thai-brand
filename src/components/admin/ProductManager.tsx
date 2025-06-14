import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Plus, Edit, Trash2, Eye } from "lucide-react";
import { supabaseService, SupabaseProduct } from "@/services/supabaseService";
import { toast } from "@/hooks/use-toast";
import { useAdminSecurity } from "@/hooks/useAdminSecurity";
import { useCurrency } from "@/contexts/CurrencyContext";

const ProductManager = () => {
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<SupabaseProduct | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { logAdminAction } = useAdminSecurity();
  const { formatPrice, selectedCurrency } = useCurrency();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    sku: '',
    price: '',
    compare_price: '',
    cost_price: '',
    stock_quantity: '',
    low_stock_threshold: '5',
    manage_stock: true,
    allow_backorders: false,
    is_active: true,
    is_featured: false,
    weight: '',
    category_id: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      console.log('Loading products...');
      await logAdminAction('view', 'products_list', undefined, { action: 'load_products_for_management' });
      
      const fetchedProducts = await supabaseService.getProducts();
      console.log('Loaded products:', fetchedProducts);
      setProducts(fetchedProducts);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load products:', error);
      await logAdminAction('view', 'products_list', undefined, { error: error.message }, false);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      short_description: '',
      sku: '',
      price: '',
      compare_price: '',
      cost_price: '',
      stock_quantity: '',
      low_stock_threshold: '5',
      manage_stock: true,
      allow_backorders: false,
      is_active: true,
      is_featured: false,
      weight: '',
      category_id: ''
    });
    setSelectedProduct(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description || null,
        short_description: formData.short_description || null,
        sku: formData.sku,
        price: parseFloat(formData.price),
        compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
        stock_quantity: parseInt(formData.stock_quantity),
        low_stock_threshold: parseInt(formData.low_stock_threshold),
        manage_stock: formData.manage_stock,
        allow_backorders: formData.allow_backorders,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        category_id: formData.category_id || null,
        images: []
      };

      let savedProduct;
      if (isEditing && selectedProduct) {
        console.log('Updating product:', selectedProduct.id, productData);
        await logAdminAction('update', 'product', selectedProduct.id, {
          product_name: productData.name,
          old_price: selectedProduct.price,
          new_price: productData.price,
          sku: productData.sku
        });
        
        // Use supabase client directly for update since updateProduct doesn't exist
        const { data, error } = await supabaseService.supabase
          .from('products')
          .update(productData)
          .eq('id', selectedProduct.id)
          .select()
          .single();

        if (error) throw error;
        savedProduct = data;
        
        setProducts(products.map(p => p.id === selectedProduct.id ? savedProduct : p));
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        console.log('Creating product:', productData);
        await logAdminAction('create', 'product', undefined, {
          product_name: productData.name,
          price: productData.price,
          sku: productData.sku
        });
        
        savedProduct = await supabaseService.createProduct(productData);
        
        setProducts([...products, savedProduct]);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }

      resetForm();
      setIsProductDialogOpen(false);
    } catch (error) {
      console.error('Failed to save product:', error);
      await logAdminAction('create', 'product', undefined, {
        error: error.message,
        product_name: formData.name
      }, false);
      
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive"
      });
    }
  };

  const editProduct = (product: SupabaseProduct) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      short_description: product.short_description || '',
      sku: product.sku,
      price: product.price.toString(),
      compare_price: product.compare_price?.toString() || '',
      cost_price: product.cost_price?.toString() || '',
      stock_quantity: product.stock_quantity.toString(),
      low_stock_threshold: product.low_stock_threshold?.toString() || '5',
      manage_stock: product.manage_stock,
      allow_backorders: product.allow_backorders,
      is_active: product.is_active,
      is_featured: product.is_featured,
      weight: product.weight?.toString() || '',
      category_id: product.category_id || ''
    });
    setIsEditing(true);
    setIsProductDialogOpen(true);
  };

  const deleteProduct = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      console.log('Deleting product:', productId);
      await logAdminAction('delete', 'product', productId, {
        product_name: product?.name,
        sku: product?.sku
      });
      
      // Use supabase client directly for delete since deleteProduct doesn't exist
      const { error } = await supabaseService.supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      
      setProducts(products.filter(p => p.id !== productId));
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      console.error('Failed to delete product:', error);
      await logAdminAction('delete', 'product', productId, {
        error: error.message,
        product_name: product?.name
      }, false);
      
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    }
  };

  const getStockStatus = (product: SupabaseProduct) => {
    if (product.stock_quantity === 0) return { status: 'Out of Stock', variant: 'destructive' as const };
    if (product.stock_quantity <= (product.low_stock_threshold || 5)) return { status: 'Low Stock', variant: 'secondary' as const };
    return { status: 'In Stock', variant: 'default' as const };
  };

  if (isLoading) {
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Product Manager</h1>
          <p className="text-gray-600 text-sm mt-1">
            All prices displayed in {selectedCurrency.name} ({selectedCurrency.symbol})
          </p>
        </div>
        <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea
                  id="short_description"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price ({selectedCurrency.symbol})</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="compare_price">Compare Price ({selectedCurrency.symbol})</Label>
                  <Input
                    id="compare_price"
                    name="compare_price"
                    type="number"
                    step="0.01"
                    value={formData.compare_price}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="cost_price">Cost Price ({selectedCurrency.symbol})</Label>
                  <Input
                    id="cost_price"
                    name="cost_price"
                    type="number"
                    step="0.01"
                    value={formData.cost_price}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock_quantity">Stock Quantity</Label>
                  <Input
                    id="stock_quantity"
                    name="stock_quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
                  <Input
                    id="low_stock_threshold"
                    name="low_stock_threshold"
                    type="number"
                    value={formData.low_stock_threshold}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="manage_stock"
                    name="manage_stock"
                    checked={formData.manage_stock}
                    onChange={handleInputChange}
                  />
                  <Label htmlFor="manage_stock">Manage Stock</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allow_backorders"
                    name="allow_backorders"
                    checked={formData.allow_backorders}
                    onChange={handleInputChange}
                  />
                  <Label htmlFor="allow_backorders">Allow Backorders</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleInputChange}
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button type="submit" className="flex-1">
                  {isEditing ? 'Update Product' : 'Create Product'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setIsProductDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Products Yet</h3>
            <p className="text-gray-500 text-center mb-4">
              Get started by adding your first product to the catalog.
            </p>
            <Button onClick={() => setIsProductDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => {
            const stockStatus = getStockStatus(product);
            return (
              <Card key={product.id}>
                <CardContent className="flex justify-between items-center p-6">
                  <div className="flex items-center space-x-4">
                    <Package className="w-8 h-8 text-gray-400" />
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={stockStatus.variant}>
                          {stockStatus.status}
                        </Badge>
                        {!product.is_active && (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                        {product.is_featured && (
                          <Badge variant="default">Featured</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(product.price)}</p>
                      <p className="text-sm text-gray-600">Stock: {product.stock_quantity}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductManager;
