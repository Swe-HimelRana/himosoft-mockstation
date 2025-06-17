import { apiDb } from './db';
import crypto from 'crypto';
import type { ApiItem, ApiInstance, ApiEndpoint } from './db';

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

interface EndpointResponse {
  status: number;
  body?: any;
}

interface Endpoint {
  method: string;
  path: string;
  response: EndpointResponse;
}

interface Item {
  id: string;
  name: string;
  description: string;
  endpoints: Endpoint[];
  createdAt: string;
  updatedAt: string;
}

class ApiStore {
  private readonly INSTANCE_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days
  private isCreating = false;
  private readonly MAX_ITEMS = 100;
  private readonly MAX_INSTANCES_PER_API = 10;

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

  async createInstance(apiId: string, instance: Omit<ApiInstance, 'id' | 'apiId' | 'apiKey' | 'lastAccessedAt' | 'createdAt' | 'updatedAt'>): Promise<ApiInstance> {
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
      const newInstance: ApiInstance = {
        id,
        apiId,
        name: instance.name,
        description: instance.description,
        apiKey,
        createdAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('ApiStore: Creating new instance:', { id, apiKey });
      
      // Get current instances
      const data = await apiDb.read();
      const instances = data.instances || {};
      console.log('ApiStore: Current instances:', instances);
      
      // Add new instance
      instances[id] = newInstance;
      
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

  private fixEndpointPaths(item: ApiItem, instanceId: string): ApiItem {
    return {
      ...item,
      endpoints: item.endpoints.map(endpoint => ({
        ...endpoint,
        path: `/items/${instanceId}/${item.id}`
      }))
    };
  }

  async getItems(instanceId?: string): Promise<ApiItem[]> {
    try {
      const data = await apiDb.read();
      const items = Object.values(data.items || {});
      if (instanceId) {
        const filteredItems = items.filter(item => item.endpoints.some(endpoint => 
          endpoint.path.includes(instanceId)
        ));
        // Fix paths for all items
        return filteredItems.map(item => this.fixEndpointPaths(item, instanceId));
      }
      return items;
    } catch (error) {
      console.error('Error getting items:', error);
      return [];
    }
  }

  async getItem(id: string): Promise<ApiItem | null> {
    try {
      const data = await apiDb.read();
      return data.items[id] || null;
    } catch (error) {
      console.error('Error getting item:', error);
      return null;
    }
  }

  async createItem(item: Omit<ApiItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiItem> {
    try {
      const data = await apiDb.read();
      const id = crypto.randomUUID();
      const newItem: ApiItem = {
        ...item,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Fix endpoint paths before saving
      const instanceId = newItem.endpoints[0]?.path.split('/')[2];
      if (instanceId) {
        const fixedItem = this.fixEndpointPaths(newItem, instanceId);
        data.items[id] = fixedItem;
      } else {
        data.items[id] = newItem;
      }

      await apiDb.write(data);
      return data.items[id];
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  }

  async updateItem(id: string, item: Partial<ApiItem>): Promise<ApiItem | null> {
    try {
      const data = await apiDb.read();
      const existingItem = data.items[id];
      
      if (!existingItem) {
        return null;
      }

      // Preserve all existing fields and only update the ones provided
      const updatedItem: ApiItem = {
        ...existingItem,
        ...item,
        id: existingItem.id, // Ensure ID is preserved
        createdAt: existingItem.createdAt, // Preserve creation date
        updatedAt: new Date().toISOString()
      };

      // Fix endpoint paths before saving
      const instanceId = updatedItem.endpoints[0]?.path.split('/')[2];
      if (instanceId) {
        const fixedItem = this.fixEndpointPaths(updatedItem, instanceId);
        data.items[id] = fixedItem;
      } else {
        data.items[id] = updatedItem;
      }

      console.log('Updating item:', {
        id,
        existing: existingItem,
        updates: item,
        result: data.items[id]
      });

      await apiDb.write(data);
      return data.items[id];
    } catch (error) {
      console.error('Error updating item:', error);
      return null;
    }
  }

  async deleteItem(id: string): Promise<boolean> {
    try {
      const data = await apiDb.read();
      if (!data.items[id]) {
        return false;
      }

      delete data.items[id];
      await apiDb.write(data);
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
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

  async validateApiKey(instanceId: string, apiKey: string): Promise<boolean> {
    try {
      const data = await apiDb.read();
      const instances = data.instances || {};
      const instance = instances[instanceId];
      
      if (!instance) {
        console.log('Instance not found:', instanceId);
        return false;
      }

      const isValid = instance.apiKey === apiKey;
      
      if (isValid) {
        // Update last accessed time
        instance.lastAccessedAt = new Date().toISOString();
        await apiDb.write({ ...data, instances });
      }
      
      console.log('API key validation:', {
        instanceId,
        isValid,
        instance: instance ? {
          id: instance.id,
          name: instance.name,
          lastAccessedAt: instance.lastAccessedAt
        } : null
      });
      
      return isValid;
    } catch (error) {
      console.error('Error validating API key:', error);
      return false;
    }
  }

  async getApiKey(id: string): Promise<string | null> {
    try {
      const data = await apiDb.read();
      const instance = data.instances[id];
      return instance?.apiKey || null;
    } catch (error) {
      console.error('Error getting API key:', error);
      return null;
    }
  }

  async updateInstance(id: string, instance: Partial<ApiInstance>): Promise<ApiInstance | null> {
    try {
      const data = await apiDb.read();
      const existingInstance = data.instances[id];
      
      if (!existingInstance) {
        return null;
      }

      const updatedInstance: ApiInstance = {
        ...existingInstance,
        ...instance,
        updatedAt: new Date().toISOString()
      };

      data.instances[id] = updatedInstance;
      await apiDb.write(data);
      return updatedInstance;
    } catch (error) {
      console.error('Error updating instance:', error);
      return null;
    }
  }

  async deleteInstance(id: string): Promise<boolean> {
    try {
      const data = await apiDb.read();
      if (!data.instances[id]) {
        return false;
      }

      delete data.instances[id];
      await apiDb.write(data);
      return true;
    } catch (error) {
      console.error('Error deleting instance:', error);
      return false;
    }
  }
}

export const apiStore = new ApiStore(); 