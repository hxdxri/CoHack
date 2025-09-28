import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Plus, 
  Package, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { productsAPI } from '@/lib/api';
import { Product, ProductFormData } from '@/types';
import toast from 'react-hot-toast';

/**
 * Farmer Products Page
 * 
 * Complete product management interface for farmers to create, edit,
 * view, and delete their product listings.
 */
export const FarmerProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>();

  const categoryOptions = [
    { value: '', label: 'Select category' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'grains', label: 'Grains' },
    { value: 'meat', label: 'Meat' },
    { value: 'other', label: 'Other' },
  ];

  const filterOptions = [
    { value: 'all', label: 'All Products' },
    { value: 'active', label: 'Active Only' },
    { value: 'inactive', label: 'Inactive Only' },
    ...categoryOptions.slice(1),
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productsAPI.getMyProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    reset();
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      unit: product.unit,
      description: product.description,
      imageUrl: product.imageUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await productsAPI.update(product.id, { 
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
        unit: product.unit,
        description: product.description,
        imageUrl: product.imageUrl,
        isActive: !product.isActive 
      });
      await fetchProducts();
      toast.success(`Product ${product.isActive ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      console.error('Error toggling product status:', error);
      toast.error('Failed to update product status');
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteProduct) return;

    try {
      await productsAPI.delete(deleteProduct.id);
      await fetchProducts();
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setDeleteProduct(null);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, data);
        toast.success('Product updated successfully');
      } else {
        await productsAPI.create(data);
        toast.success('Product created successfully');
      }
      
      await fetchProducts();
      setIsModalOpen(false);
      reset();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.error || 'Failed to save product');
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterCategory === 'all' ||
                         (filterCategory === 'active' && product.isActive) ||
                         (filterCategory === 'inactive' && !product.isActive) ||
                         product.category === filterCategory;
    
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2">My Products</h1>
          <p className="text-graphite">
            Manage your product listings and inventory
          </p>
        </div>
        <Button onClick={handleCreateProduct} variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-graphite w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-lg bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-graphite w-4 h-4" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-graphite mb-2">
              {products.length === 0 ? 'No products yet' : 'No products match your search'}
            </h3>
            <p className="text-graphite mb-6">
              {products.length === 0 
                ? 'Start by adding your first product to attract customers.'
                : 'Try adjusting your search terms or filters.'
              }
            </p>
            {products.length === 0 && (
              <Button onClick={handleCreateProduct} variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} hover>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-ink mb-1">{product.name}</h3>
                    <Badge 
                      variant={product.category === 'vegetables' ? 'success' : 
                              product.category === 'fruits' ? 'warning' : 
                              product.category === 'dairy' ? 'primary' : 'gray'}
                      size="sm"
                    >
                      {product.category}
                    </Badge>
                  </div>
                  <Badge variant={product.isActive ? 'success' : 'gray'}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <p className="text-graphite text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-graphite">Price:</span>
                    <span className="font-medium text-ink">
                      ${product.price.toFixed(2)} per {product.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-graphite">Quantity:</span>
                    <span className={`font-medium ${product.quantity < 10 ? 'text-warning' : 'text-ink'}`}>
                      {product.quantity} {product.unit}s
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button
                  onClick={() => handleToggleActive(product)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  {product.isActive ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-1" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-1" />
                      Activate
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleEditProduct(product)}
                  variant="outline"
                  size="sm"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setDeleteProduct(product)}
                  variant="outline"
                  size="sm"
                  className="text-danger hover:text-danger"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Product Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...register('name', {
                required: 'Product name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
              label="Product Name"
              placeholder="e.g., Organic Tomatoes"
              error={errors.name?.message}
              required
            />

            <Select
              {...register('category', {
                required: 'Category is required',
              })}
              label="Category"
              options={categoryOptions}
              error={errors.category?.message}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              {...register('price', {
                required: 'Price is required',
                min: {
                  value: 0.01,
                  message: 'Price must be greater than 0',
                },
              })}
              type="number"
              step="0.01"
              label="Price"
              placeholder="0.00"
              error={errors.price?.message}
              required
            />

            <Input
              {...register('quantity', {
                required: 'Quantity is required',
                min: {
                  value: 1,
                  message: 'Quantity must be at least 1',
                },
              })}
              type="number"
              label="Quantity"
              placeholder="0"
              error={errors.quantity?.message}
              required
            />

            <Input
              {...register('unit', {
                required: 'Unit is required',
              })}
              label="Unit"
              placeholder="e.g., lb, kg, piece"
              error={errors.unit?.message}
              required
            />
          </div>

          <Textarea
            {...register('description', {
              required: 'Description is required',
              minLength: {
                value: 10,
                message: 'Description must be at least 10 characters',
              },
            })}
            label="Description"
            placeholder="Describe your product, growing methods, taste, etc..."
            rows={4}
            error={errors.description?.message}
            helperText="Be descriptive to attract customers"
            required
          />

          <Input
            {...register('imageUrl')}
            label="Image URL (Optional)"
            placeholder="https://example.com/image.jpg"
            error={errors.imageUrl?.message}
            helperText="Add a link to a product image"
          />

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onConfirm={handleDeleteProduct}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteProduct?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};
