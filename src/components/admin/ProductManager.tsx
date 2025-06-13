import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { supabaseService, SupabaseProduct, SupabaseCategory } from "@/services/supabaseService";
import { toast } from "@/hooks/use-toast";

const PRODUCTS_PER_PAGE = 12;

const ProductManager = () => {
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<SupabaseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SupabaseProduct | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    sku: '',
    price: 0,
    category_id: '',
    stock_quantity: 0,
    is_featured: false
  });

  useEffect(() => {
    loadData();
  }, [currentPage]);

  const loadData = async () => {
    try {
      console.log('Loading products and categories...');
      setIsLoading(true);
      
      const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;
      
      // Load products with pagination
      const { data: productsData, error: productsError, count } = await supabaseService.supabase
        .from('products')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + PRODUCTS_PER_PAGE - 1);

      if (productsError) {
        console.error('Products error:', productsError);
        throw productsError;
      }

      const categoriesData = await supabaseService.getCategories();
      
      console.log('Loaded products:', productsData);
      console.log('Loaded categories:', categoriesData);
      
      setProducts(productsData || []);
      setTotalProducts(count || 0);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const { data, error } = await supabaseService.supabase
          .from('products')
          .update({
            name: formData.name,
            description: formData.description,
            short_description: formData.short_description,
            sku: formData.sku,
            price: formData.price,
            category_id: formData.category_id || null,
            stock_quantity: formData.stock_quantity,
            is_featured: formData.is_featured,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingProduct.id)
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product updated successfully"
        });
      } else {
        const { data, error } = await supabaseService.supabase
          .from('products')
          .insert({
            name: formData.name,
            description: formData.description,
            short_description: formData.short_description,
            sku: formData.sku,
            price: formData.price,
            category_id: formData.category_id || null,
            stock_quantity: formData.stock_quantity,
            is_featured: formData.is_featured,
            is_active: true,
            images: []
          })
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product created successfully"
        });
      }
      
      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      short_description: '',
      sku: '',
      price: 0,
      category_id: '',
      stock_quantity: 0,
      is_featured: false
    });
  };

  const handleEdit = (product: SupabaseProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      short_description: product.short_description || '',
      sku: product.sku,
      price: product.price,
      category_id: product.category_id || '',
      stock_quantity: product.stock_quantity,
      is_featured: product.is_featured || false
    });
    setShowForm(true);
  };

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  if (isLoading) {
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product Manager</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  placeholder="SKU"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  required
                />
              </div>
              
              <Textarea
                placeholder="Short Description"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              />
              
              <Textarea
                placeholder="Full Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              
              <div className="grid grid-cols-3 gap-4">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  required
                />
                <Input
                  type="number"
                  placeholder="Stock Quantity"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                  required
                />
                <select
                  className="px-3 py-2 border rounded-md"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                />
                <label htmlFor="featured">Featured Product</label>
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit">
                  {editingProduct ? 'Update' : 'Create'} Product
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Products Yet</h3>
            <p className="text-gray-500 text-center">
              Start by adding your first product to the catalog.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Products ({totalProducts} total)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="flex justify-between items-center p-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <Package className="w-8 h-8 text-gray-400" />
                          <div>
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                            <p className="text-sm text-gray-600">
                              Stock: {product.stock_quantity} units
                            </p>
                            <div className="flex gap-2 mt-1">
                              {!product.is_active && (
                                <Badge variant="destructive">Inactive</Badge>
                              )}
                              {product.is_featured && (
                                <Badge variant="secondary">Featured</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold">${product.price.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                            onClick={() => {
                              toast({
                                title: "Info",
                                description: "Delete functionality not implemented yet"
                              });
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(currentPage - 1);
                        }}
                      />
                    </PaginationItem>
                  )}
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === pageNum}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNum);
                          }}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(currentPage + 1);
                        }}
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductManager;
