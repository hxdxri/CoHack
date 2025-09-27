import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { localStorage } from '../storage/localStorage';
import { User, FarmerProfile } from '../types';

export class UserModel {
  private static USERS_KEY = 'users';
  private static FARMER_PROFILES_KEY = 'farmer_profiles';

  static async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const users = this.getAll();
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user: User = {
      id: uuidv4(),
      ...userData,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(user);
    localStorage.setItem(this.USERS_KEY, users);

    return user;
  }

  static getAll(): User[] {
    return localStorage.getItem<User[]>(this.USERS_KEY) || [];
  }

  static findById(id: string): User | null {
    const users = this.getAll();
    return users.find(u => u.id === id) || null;
  }

  static findByEmail(email: string): User | null {
    const users = this.getAll();
    return users.find(u => u.email === email) || null;
  }

  static async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  static update(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): User | null {
    const users = this.getAll();
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return null;
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(this.USERS_KEY, users);
    return users[userIndex];
  }

  static delete(id: string): boolean {
    const users = this.getAll();
    const filteredUsers = users.filter(u => u.id !== id);
    
    if (filteredUsers.length === users.length) {
      return false;
    }

    localStorage.setItem(this.USERS_KEY, filteredUsers);
    return true;
  }

  // Farmer profile methods
  static createFarmerProfile(profileData: Omit<FarmerProfile, 'id' | 'createdAt' | 'updatedAt' | 'averageRating' | 'totalReviews'>): FarmerProfile {
    const profiles = this.getAllFarmerProfiles();

    const profile: FarmerProfile = {
      id: uuidv4(),
      ...profileData,
      averageRating: 0,
      totalReviews: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    profiles.push(profile);
    localStorage.setItem(this.FARMER_PROFILES_KEY, profiles);

    return profile;
  }

  static getAllFarmerProfiles(): FarmerProfile[] {
    return localStorage.getItem<FarmerProfile[]>(this.FARMER_PROFILES_KEY) || [];
  }

  static getFarmerProfileByUserId(userId: string): FarmerProfile | null {
    const profiles = this.getAllFarmerProfiles();
    return profiles.find(p => p.userId === userId) || null;
  }

  static updateFarmerProfile(userId: string, updates: Partial<Omit<FarmerProfile, 'id' | 'userId' | 'createdAt'>>): FarmerProfile | null {
    const profiles = this.getAllFarmerProfiles();
    const profileIndex = profiles.findIndex(p => p.userId === userId);
    
    if (profileIndex === -1) {
      return null;
    }

    profiles[profileIndex] = {
      ...profiles[profileIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(this.FARMER_PROFILES_KEY, profiles);
    return profiles[profileIndex];
  }
}
