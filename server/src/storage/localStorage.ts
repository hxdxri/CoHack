import fs from 'fs';
import path from 'path';

/**
 * Simple localStorage-like implementation using JSON files
 * In a real app, you'd use a proper database like PostgreSQL or MongoDB
 */
class LocalStorage {
  private dataDir: string;

  constructor() {
    this.dataDir = path.join(__dirname, '../../data');
    this.ensureDataDir();
  }

  private ensureDataDir(): void {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private getFilePath(key: string): string {
    return path.join(this.dataDir, `${key}.json`);
  }

  getItem<T>(key: string): T | null {
    try {
      const filePath = this.getFilePath(key);
      if (!fs.existsSync(filePath)) {
        return null;
      }
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      const filePath = this.getFilePath(key);
      fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
    } catch (error) {
      console.error(`Error writing ${key}:`, error);
    }
  }

  removeItem(key: string): void {
    try {
      const filePath = this.getFilePath(key);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  }

  clear(): void {
    try {
      const files = fs.readdirSync(this.dataDir);
      files.forEach(file => {
        fs.unlinkSync(path.join(this.dataDir, file));
      });
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

export const localStorage = new LocalStorage();
