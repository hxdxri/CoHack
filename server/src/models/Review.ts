import { v4 as uuidv4 } from 'uuid';
import { localStorage } from '../storage/localStorage';
import { Review } from '../types';
import { UserModel } from './User';

export class ReviewModel {
  private static REVIEWS_KEY = 'reviews';

  static create(reviewData: Omit<Review, 'id' | 'createdAt'>): Review {
    const reviews = this.getAll();

    // Check if customer already reviewed this farmer
    const existingReview = reviews.find(r => 
      r.customerId === reviewData.customerId && r.farmerId === reviewData.farmerId
    );

    if (existingReview) {
      throw new Error('You have already reviewed this farmer');
    }

    const review: Review = {
      id: uuidv4(),
      ...reviewData,
      createdAt: new Date().toISOString(),
    };

    reviews.push(review);
    localStorage.setItem(this.REVIEWS_KEY, reviews);

    // Update farmer's average rating
    this.updateFarmerRating(reviewData.farmerId);

    return review;
  }

  static getAll(): Review[] {
    return localStorage.getItem<Review[]>(this.REVIEWS_KEY) || [];
  }

  static findById(id: string): Review | null {
    const reviews = this.getAll();
    return reviews.find(r => r.id === id) || null;
  }

  static findByFarmerId(farmerId: string): Review[] {
    const reviews = this.getAll();
    return reviews
      .filter(r => r.farmerId === farmerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static findByCustomerId(customerId: string): Review[] {
    const reviews = this.getAll();
    return reviews
      .filter(r => r.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static update(id: string, updates: Partial<Omit<Review, 'id' | 'customerId' | 'farmerId' | 'createdAt'>>): Review | null {
    const reviews = this.getAll();
    const reviewIndex = reviews.findIndex(r => r.id === id);
    
    if (reviewIndex === -1) {
      return null;
    }

    const oldFarmerId = reviews[reviewIndex].farmerId;
    reviews[reviewIndex] = {
      ...reviews[reviewIndex],
      ...updates,
    };

    localStorage.setItem(this.REVIEWS_KEY, reviews);

    // Update farmer's average rating
    this.updateFarmerRating(oldFarmerId);

    return reviews[reviewIndex];
  }

  static delete(id: string): boolean {
    const reviews = this.getAll();
    const reviewToDelete = reviews.find(r => r.id === id);
    
    if (!reviewToDelete) {
      return false;
    }

    const filteredReviews = reviews.filter(r => r.id !== id);
    localStorage.setItem(this.REVIEWS_KEY, filteredReviews);

    // Update farmer's average rating
    this.updateFarmerRating(reviewToDelete.farmerId);

    return true;
  }

  static getFarmerStats(farmerId: string): { averageRating: number; totalReviews: number } {
    const reviews = this.findByFarmerId(farmerId);
    
    if (reviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = Math.round((totalRating / reviews.length) * 10) / 10; // Round to 1 decimal

    return {
      averageRating,
      totalReviews: reviews.length,
    };
  }

  private static updateFarmerRating(farmerId: string): void {
    const stats = this.getFarmerStats(farmerId);
    UserModel.updateFarmerProfile(farmerId, {
      averageRating: stats.averageRating,
      totalReviews: stats.totalReviews,
    });
  }
}
