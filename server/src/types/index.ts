import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'farmer' | 'customer';
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  farmName: string;
  description: string;
  location: string;
  farmHistory: string;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  // New fields for enhanced profile
  farmPhotos?: FarmPhoto[];
  farmerPhoto?: string;
  workPhotos?: WorkPhoto[];
  timeline?: FarmTimelineEvent[];
  ourStory?: string;
  aboutOurFarm?: string;
}

export interface FarmPhoto {
  id: string;
  url: string;
  caption?: string;
  type: 'farm' | 'landscape' | 'animals' | 'crops' | 'equipment';
  createdAt: string;
}

export interface WorkPhoto {
  id: string;
  url: string;
  caption?: string;
  type: 'harvesting' | 'planting' | 'processing' | 'packaging' | 'delivery';
  createdAt: string;
}

export interface FarmTimelineEvent {
  id: string;
  year: number;
  title: string;
  description: string;
  imageUrl?: string;
  type: 'founding' | 'expansion' | 'achievement' | 'milestone' | 'award';
}

export interface Product {
  id: string;
  farmerId: string;
  name: string;
  category: 'vegetables' | 'fruits' | 'dairy' | 'grains' | 'meat' | 'other';
  price: number;
  quantity: number;
  unit: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  customerId: string;
  farmerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: 'farmer' | 'customer';
  farmName?: string;
  farmDescription?: string;
  location?: string;
}
