export interface User {
  id: string;
  email: string;
  name: string;
  role: 'farmer' | 'customer';
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
  name?: string;
  email?: string;
  reviews?: ReviewWithCustomer[];
  products?: Product[];
  productCount?: number;
  // Enhanced profile fields
  farmPhotos?: FarmPhoto[];
  farmerPhoto?: string;
  workPhotos?: WorkPhoto[];
  timeline?: FarmTimelineEvent[];
  ourStory?: string;
  aboutOurFarm?: string;
  // New hero section fields
  coverPhoto?: string;
  farmerBio?: string;
  farmerInterests?: string[];
  // Rich content fields
  aboutOurFarmRich?: string; // Rich text content
  ourStoryRich?: string; // Rich text content
  // Sustainability and values
  farmingPractices?: FarmingPractice[];
  // Media integration
  introVideoUrl?: string;
  // Additional farmer details
  yearsFarming?: number;
  farmSize?: string;
  specialties?: string[];
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
  type: 'founding' | 'expansion' | 'achievement' | 'milestone' | 'award' | 'certification' | 'partnership' | 'innovation';
  icon?: string; // Emoji or icon identifier
}

export interface FarmingPractice {
  id: string;
  name: string;
  description?: string;
  category: 'sustainability' | 'organic' | 'animal_welfare' | 'environmental' | 'social';
  isActive: boolean;
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
  farmer?: {
    farmName: string;
    location: string;
    averageRating: number;
    totalReviews: number;
    description?: string;
  };
  farmerName?: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  senderName?: string;
  fromMe?: boolean;
}

export interface Review {
  id: string;
  customerId: string;
  farmerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewWithCustomer extends Review {
  customerName: string;
}

export interface ReviewWithFarmer extends Review {
  farmerName: string;
  farmName: string;
}

export interface Conversation {
  partnerId: string;
  partnerName: string;
  partnerRole: 'farmer' | 'customer';
  farmerProfile?: {
    farmName: string;
    location: string;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
    fromMe: boolean;
  };
  unreadCount: number;
  messageCount: number;
}

export interface AuthResponse {
  user: User;
  token: string;
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

export interface ApiError {
  error: string;
  message?: string;
}

export interface ProductFormData {
  name: string;
  category: Product['category'];
  price: number;
  quantity: number;
  unit: string;
  description: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface FarmerProfileFormData {
  farmName: string;
  description: string;
  location: string;
  farmHistory: string;
  ourStory?: string;
  aboutOurFarm?: string;
  farmerPhoto?: string;
  farmPhotos?: FarmPhoto[];
  workPhotos?: WorkPhoto[];
  timeline?: FarmTimelineEvent[];
  // New enhanced fields
  coverPhoto?: string;
  farmerBio?: string;
  farmerInterests?: string[];
  aboutOurFarmRich?: string;
  ourStoryRich?: string;
  farmingPractices?: FarmingPractice[];
  introVideoUrl?: string;
  yearsFarming?: number;
  farmSize?: string;
  specialties?: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  farmerId: string;
  farmerName: string;
}

export interface VendorCart {
  farmerId: string;
  farmerName: string;
  farmerLocation?: string;
  farmerImage?: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface ReviewFormData {
  rating: number;
  comment: string;
}

export interface MessageFormData {
  content: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  farmerId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  deliveryAddress?: string;
  pickupInstructions?: string;
  notes?: string;
  deliveryPin?: string;
  rating?: number;
  review?: string;
}

export interface OrderFormData {
  status: Order['status'];
  deliveryPin?: string;
  notes?: string;
}