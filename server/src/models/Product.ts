import { v4 as uuidv4 } from 'uuid';
import { localStorage } from '../storage/localStorage';
import { Product } from '../types';

export class ProductModel {
  private static PRODUCTS_KEY = 'products';

  static create(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const products = this.getAll();

    const product: Product = {
      id: uuidv4(),
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    products.push(product);
    localStorage.setItem(this.PRODUCTS_KEY, products);

    return product;
  }

  static getAll(): Product[] {
    return localStorage.getItem<Product[]>(this.PRODUCTS_KEY) || [];
  }

  static getActive(): Product[] {
    return this.getAll().filter(p => p.isActive);
  }

  static findById(id: string): Product | null {
    const products = this.getAll();
    return products.find(p => p.id === id) || null;
  }

  static findByFarmerId(farmerId: string): Product[] {
    const products = this.getAll();
    return products.filter(p => p.farmerId === farmerId);
  }

  static findByCategory(category: Product['category']): Product[] {
    return this.getActive().filter(p => p.category === category);
  }

  static search(query: string): Product[] {
    const products = this.getActive();
    const lowercaseQuery = query.toLowerCase();
    
    return products.filter(p => 
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.description.toLowerCase().includes(lowercaseQuery) ||
      p.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  static update(id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Product | null {
    const products = this.getAll();
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return null;
    }

    products[productIndex] = {
      ...products[productIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(this.PRODUCTS_KEY, products);
    return products[productIndex];
  }

  static delete(id: string): boolean {
    const products = this.getAll();
    const filteredProducts = products.filter(p => p.id !== id);
    
    if (filteredProducts.length === products.length) {
      return false;
    }

    localStorage.setItem(this.PRODUCTS_KEY, filteredProducts);
    return true;
  }

  static deactivate(id: string): Product | null {
    return this.update(id, { isActive: false });
  }

  static activate(id: string): Product | null {
    return this.update(id, { isActive: true });
  }
}
