import { apiDb } from './db';
import crypto from 'crypto';

export interface ApiItem {
  id: string;
  name: string;
  description: string;
  method: string;
  path: string;
  response: any;
  status: number;
  headers: Record<string, string>;
  delay: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiInstance {
  id: string;
  name: string;
  description: string;
  apiKey: string;
  createdAt: string;
  lastAccessedAt: string;
  items: ApiItem[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Instances {
  [key: string]: ApiInstance;
}

class ApiStore {
  private readonly INSTANCE_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days
  private isCreating = false;

  constructor() {
    // Initialize the database if it doesn't exist
    this.initialize();
  }

  private async initialize() {
    const data = await apiDb.read();
    if (!data.instances) {
      console.log('Initializing API database...');
      await apiDb.write({ ...data, instances: {} });
    }
  }

  private async cleanup() {
    console.log('ApiStore: Starting cleanup...');
    try {
      const data = await apiDb.read();
      const instances = data.instances || {};
      const now = new Date().getTime();
      const oneDayAgo = now - 24 * 60 * 60 * 1000;

      // Remove instances older than 24 hours
      Object.entries(instances).forEach(([id, instance]) => {
        const createdAt = new Date(instance.createdAt).getTime();
        if (createdAt < oneDayAgo) {
          console.log('ApiStore: Removing old instance:', id);
          delete instances[id];
        }
      });

      // Save changes
      await apiDb.write({ ...data, instances });
      console.log('ApiStore: Cleanup completed');
    } catch (error) {
      console.error('ApiStore: Error during cleanup:', error);
    }
  }

  private async updateLastAccessed(id: string) {
    try {
      const data = await apiDb.read();
      const instance = data.instances[id];
      
      if (instance) {
        instance.lastAccessedAt = new Date().toISOString();
        data.instances[id] = instance;
        await apiDb.write(data);
      }
    } catch (error) {
      console.error('Error updating last accessed:', error);
    }
  }

  async createInstance(name: string, description: string): Promise<ApiInstance> {
    console.log('ApiStore: createInstance called');
    
    // Prevent multiple simultaneous creations
    if (this.isCreating) {
      console.log('ApiStore: Instance creation already in progress');
      throw new Error('Instance creation already in progress');
    }

    try {
      this.isCreating = true;
      console.log('ApiStore: Starting instance creation...');

      // Clean up old instances before creating new one
      await this.cleanup();

      const id = crypto.randomUUID();
      const apiKey = 'temp_' + crypto.randomUUID();
      const instance: ApiInstance = {
        id,
        name,
        description,
        apiKey,
        createdAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
        items: []
      };

      console.log('ApiStore: Creating new instance:', { id, apiKey });
      
      // Get current instances
      const data = await apiDb.read();
      const instances = data.instances || {};
      console.log('ApiStore: Current instances:', instances);
      
      // Add new instance
      instances[id] = instance;
      
      // Save back to database
      console.log('ApiStore: Saving instance to database...');
      await apiDb.write({ ...data, instances });
      
      // Verify the save
      const savedData = await apiDb.read();
      const savedInstance = savedData.instances[id];
      console.log('ApiStore: Saved instance:', savedInstance);
      console.log('ApiStore: Current database state:', savedData);
      
      if (!savedInstance) {
        throw new Error('Failed to save instance');
      }

      return savedInstance;
    } catch (error) {
      console.error('ApiStore: Error in createInstance:', error);
      throw error;
    } finally {
      this.isCreating = false;
      console.log('ApiStore: Instance creation completed');
    }
  }

  async getInstance(id: string): Promise<ApiInstance | null> {
    console.log('ApiStore: getInstance called for:', id);
    try {
      const data = await apiDb.read();
      const instance = data.instances[id];
      if (instance) {
        // Update last accessed time
        instance.lastAccessedAt = new Date().toISOString();
        data.instances[id] = instance;
        await apiDb.write(data);
      }
      return instance || null;
    } catch (error) {
      console.error('ApiStore: Error getting instance:', error);
      return null;
    }
  }

  async getInstanceByApiKey(apiKey: string): Promise<ApiInstance | null> {
    console.log('ApiStore: getInstanceByApiKey called for:', apiKey);
    try {
      const data = await apiDb.read();
      const instance = Object.values(data.instances).find(i => i.apiKey === apiKey);
      if (instance) {
        // Update last accessed time
        instance.lastAccessedAt = new Date().toISOString();
        data.instances[instance.id] = instance;
        await apiDb.write(data);
      }
      return instance || null;
    } catch (error) {
      console.error('ApiStore: Error getting instance by API key:', error);
      return null;
    }
  }

  async addItem(apiKey: string, item: any): Promise<ApiInstance | null> {
    console.log('ApiStore: addItem called for:', apiKey);
    try {
      const data = await apiDb.read();
      const instance = Object.values(data.instances).find(i => i.apiKey === apiKey);
      if (instance) {
        instance.items.push(item);
        instance.lastAccessedAt = new Date().toISOString();
        data.instances[instance.id] = instance;
        await apiDb.write(data);
      }
      return instance || null;
    } catch (error) {
      console.error('ApiStore: Error adding item:', error);
      return null;
    }
  }

  async getItems(id: string, page: number = 1, limit: number = 10): Promise<{ items: ApiItem[], pagination: PaginationInfo }> {
    console.log('ApiStore: getItems called for:', id)
    try {
      const instance = await this.getInstance(id)
      if (!instance) return { items: [], pagination: this.getEmptyPagination() }

      const start = (page - 1) * limit
      const end = start + limit
      const items = instance.items.slice(start, end)
      const totalItems = instance.items.length
      const totalPages = Math.ceil(totalItems / limit)

      return {
        items,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      }
    } catch (error) {
      console.error('Error getting items:', error)
      return { items: [], pagination: this.getEmptyPagination() }
    }
  }

  getAllInstances(): ApiInstance[] {
    // Clean up old instances when getting all instances
    this.cleanup();

    const instances = apiDb.read().instances;
    return Object.values(instances);
  }

  async validateApiKey(instanceId: string, apiKey: string): Promise<boolean> {
    const instance = await this.getInstance(instanceId)
    if (!instance) {
      console.log('Instance not found:', instanceId)
      return false
    }
    
    const isValid = instance.apiKey === apiKey
    if (!isValid) {
      console.log('Invalid API key:', {
        provided: apiKey,
        expected: instance.apiKey,
        instanceId
      })
    }
    return isValid
  }

  async getApiKey(id: string): Promise<string | null> {
    const instance = await this.getInstance(id)
    return instance?.apiKey || null
  }

  async createItem(id: string, data: Omit<ApiItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiItem | undefined> {
    console.log('ApiStore: createItem called for:', id);
    try {
      const instance = await this.getInstance(id);
      if (!instance) {
        console.log('ApiStore: Instance not found:', id);
        return undefined;
      }

      const item: ApiItem = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      instance.items.push(item);
      instance.lastAccessedAt = new Date().toISOString();

      const dbData = await apiDb.read();
      dbData.instances[id] = instance;
      await apiDb.write(dbData);

      console.log('ApiStore: Created item:', item);
      return item;
    } catch (error) {
      console.error('ApiStore: Error creating item:', error);
      return undefined;
    }
  }

  async getItem(id: string, itemId: string): Promise<ApiItem | undefined> {
    console.log('ApiStore: getItem called for:', id, itemId);
    try {
      const instance = await this.getInstance(id);
      if (!instance) {
        console.log('ApiStore: Instance not found:', id);
        return undefined;
      }

      const item = instance.items.find(i => i.id === itemId);
      console.log('ApiStore: Found item:', item);
      return item;
    } catch (error) {
      console.error('ApiStore: Error getting item:', error);
      return undefined;
    }
  }

  async getAllItems(id: string): Promise<ApiItem[]> {
    console.log('ApiStore: getAllItems called for:', id);
    try {
      const instance = await this.getInstance(id);
      if (!instance) {
        console.log('ApiStore: Instance not found:', id);
        return [];
      }

      console.log('ApiStore: Found items:', instance.items);
      return instance.items;
    } catch (error) {
      console.error('ApiStore: Error getting all items:', error);
      return [];
    }
  }

  async updateItem(id: string, itemId: string, data: Partial<Omit<ApiItem, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiItem | undefined> {
    console.log('ApiStore: updateItem called for:', id, itemId);
    try {
      const instance = await this.getInstance(id);
      if (!instance) {
        console.log('ApiStore: Instance not found:', id);
        return undefined;
      }

      const itemIndex = instance.items.findIndex(i => i.id === itemId);
      if (itemIndex === -1) {
        console.log('ApiStore: Item not found:', itemId);
        return undefined;
      }

      const updatedItem = {
        ...instance.items[itemIndex],
        ...data,
        updatedAt: new Date().toISOString()
      };

      instance.items[itemIndex] = updatedItem;
      instance.lastAccessedAt = new Date().toISOString();

      const dbData = await apiDb.read();
      dbData.instances[id] = instance;
      await apiDb.write(dbData);

      console.log('ApiStore: Updated item:', updatedItem);
      return updatedItem;
    } catch (error) {
      console.error('ApiStore: Error updating item:', error);
      return undefined;
    }
  }

  async deleteItem(id: string, itemId: string): Promise<boolean> {
    console.log('ApiStore: deleteItem called for:', id, itemId);
    try {
      const instance = await this.getInstance(id);
      if (!instance) {
        console.log('ApiStore: Instance not found:', id);
        return false;
      }

      const itemIndex = instance.items.findIndex(i => i.id === itemId);
      if (itemIndex === -1) {
        console.log('ApiStore: Item not found:', itemId);
        return false;
      }

      instance.items.splice(itemIndex, 1);
      instance.lastAccessedAt = new Date().toISOString();

      const dbData = await apiDb.read();
      dbData.instances[id] = instance;
      await apiDb.write(dbData);

      console.log('ApiStore: Deleted item:', itemId);
      return true;
    } catch (error) {
      console.error('ApiStore: Error deleting item:', error);
      return false;
    }
  }

  private getEmptyPagination(): PaginationInfo {
    return {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
      hasNextPage: false,
      hasPreviousPage: false
    };
  }
}

export const apiStore = new ApiStore(); 