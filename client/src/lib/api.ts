import axios, { AxiosResponse } from 'axios';
import { 
  User, 
  Product, 
  FarmerProfile, 
  Message, 
  Conversation,
  AuthResponse, 
  LoginRequest, 
  RegisterRequest,
  ProductFormData,
  FarmerProfileFormData,
  ReviewFormData,
  ReviewWithCustomer,
  ReviewWithFarmer,
  Order,
  OrderFormData
} from '@/types';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('harvestlink_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle authentication errors, not connection errors
    if (error.response?.status === 401) {
      localStorage.removeItem('harvestlink_token');
      localStorage.removeItem('harvestlink_user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data: LoginRequest): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/login', data),
  
  register: (data: RegisterRequest): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/register', data),
  
  getCurrentUser: (): Promise<AxiosResponse<{ user: User }>> =>
    api.get('/auth/me'),
  
  updateUser: (data: Partial<User>): Promise<AxiosResponse<{ user: User }>> =>
    api.put('/auth/me', data),
  
  logout: (): Promise<AxiosResponse<{ message: string }>> =>
    api.post('/auth/logout'),
};

// Products API
export const productsAPI = {
  getAll: (params?: { category?: string; search?: string }): Promise<AxiosResponse<Product[]>> =>
    api.get('/products', { params }),
  
  getById: (id: string): Promise<AxiosResponse<Product>> =>
    api.get(`/products/${id}`),
  
  getByFarmerId: (farmerId: string): Promise<AxiosResponse<Product[]>> =>
    api.get(`/products/farmer/${farmerId}`),
  
  getMyProducts: (): Promise<AxiosResponse<Product[]>> =>
    api.get('/products/my/products'),
  
  create: (data: ProductFormData): Promise<AxiosResponse<Product>> =>
    api.post('/products', data),
  
  update: (id: string, data: Partial<ProductFormData>): Promise<AxiosResponse<Product>> =>
    api.put(`/products/${id}`, data),
  
  delete: (id: string): Promise<AxiosResponse<{ message: string }>> =>
    api.delete(`/products/${id}`),
};

// Farmers API
export const farmersAPI = {
  getAll: (): Promise<AxiosResponse<FarmerProfile[]>> =>
    api.get('/farmers'),
  
  getById: (id: string): Promise<AxiosResponse<FarmerProfile>> =>
    api.get(`/farmers/${id}`),
  
  getMyProfile: (): Promise<AxiosResponse<FarmerProfile>> =>
    api.get('/farmers/my/profile'),
  
  updateMyProfile: (data: Partial<FarmerProfileFormData>): Promise<AxiosResponse<FarmerProfile>> =>
    api.put('/farmers/my/profile', data),
  
  getReviews: (farmerId: string): Promise<AxiosResponse<ReviewWithCustomer[]>> =>
    api.get(`/farmers/${farmerId}/reviews`),
};

// Messages API
export const messagesAPI = {
  getConversations: (): Promise<AxiosResponse<Conversation[]>> =>
    api.get('/messages/conversations'),
  
  getConversation: (userId: string): Promise<AxiosResponse<Message[]>> =>
    api.get(`/messages/conversation/${userId}`),
  
  send: (data: { toUserId: string; content: string }): Promise<AxiosResponse<Message>> =>
    api.post('/messages/send', data),
  
  getUnreadCount: (): Promise<AxiosResponse<{ count: number }>> =>
    api.get('/messages/unread/count'),
  
  markAsRead: (messageId: string): Promise<AxiosResponse<Message>> =>
    api.put(`/messages/${messageId}/read`),
};

// Reviews API
export const reviewsAPI = {
  create: (data: { farmerId: string } & ReviewFormData): Promise<AxiosResponse<ReviewWithCustomer>> =>
    api.post('/reviews', data),
  
  getByFarmerId: (farmerId: string): Promise<AxiosResponse<ReviewWithCustomer[]>> =>
    api.get(`/reviews/farmer/${farmerId}`),
  
  getMyReviews: (): Promise<AxiosResponse<ReviewWithFarmer[]>> =>
    api.get('/reviews/my/reviews'),
  
  update: (reviewId: string, data: Partial<ReviewFormData>): Promise<AxiosResponse<ReviewWithCustomer>> =>
    api.put(`/reviews/${reviewId}`, data),
  
  delete: (reviewId: string): Promise<AxiosResponse<{ message: string }>> =>
    api.delete(`/reviews/${reviewId}`),
  
  getFarmerStats: (farmerId: string): Promise<AxiosResponse<{ averageRating: number; totalReviews: number }>> =>
    api.get(`/reviews/farmer/${farmerId}/stats`),
};

// Orders API
export const ordersAPI = {
  getMyOrders: (): Promise<AxiosResponse<Order[]>> =>
    api.get('/orders/my/orders'),
  
  getOrderById: (orderId: string): Promise<AxiosResponse<Order>> =>
    api.get(`/orders/${orderId}`),
  
  updateOrderStatus: (orderId: string, data: OrderFormData): Promise<AxiosResponse<Order>> =>
    api.put(`/orders/${orderId}/status`, data),
  
  verifyDeliveryPin: (orderId: string, pin: string): Promise<AxiosResponse<{ isValid: boolean }>> =>
    api.post(`/orders/${orderId}/verify-pin`, { pin }),
};

export default api;
