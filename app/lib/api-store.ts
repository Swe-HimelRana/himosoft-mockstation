interface ApiItem {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

class ApiStore {
  private instances: Map<string, {
    items: Map<string, ApiItem>;
    apiKey: string;
  }>;

  constructor() {
    this.instances = new Map();
  }

  createInstance(): { id: string; apiKey: string } {
    const id = Math.random().toString(36).substring(2, 15);
    const apiKey = 'temp_' + Math.random().toString(36).substring(2, 15);
    
    this.instances.set(id, {
      items: new Map(),
      apiKey
    });

    console.log('Created new instance:', { id, apiKey });
    console.log('Current instances:', Array.from(this.instances.entries()).map(([id, instance]) => ({ id, apiKey: instance.apiKey })));

    return { id, apiKey };
  }

  getInstance(id: string) {
    return this.instances.get(id);
  }

  validateApiKey(id: string, key: string): boolean {
    const instance = this.instances.get(id);
    console.log('Validating API key:', { id, key, instanceExists: !!instance, instanceApiKey: instance?.apiKey });
    return instance?.apiKey === key;
  }

  getApiKey(id: string): string | undefined {
    const apiKey = this.instances.get(id)?.apiKey;
    console.log('Getting API key:', { id, apiKey });
    return apiKey;
  }

  createItem(id: string, data: Omit<ApiItem, 'id' | 'createdAt' | 'updatedAt'>): ApiItem | undefined {
    const instance = this.instances.get(id);
    if (!instance) return undefined;

    const itemId = Math.random().toString(36).substring(2, 15);
    const now = new Date().toISOString();
    const item: ApiItem = {
      id: itemId,
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    instance.items.set(itemId, item);
    return item;
  }

  getItem(id: string, itemId: string): ApiItem | undefined {
    return this.instances.get(id)?.items.get(itemId);
  }

  getAllItems(id: string): ApiItem[] {
    const instance = this.instances.get(id);
    if (!instance) return [];
    return Array.from(instance.items.values());
  }

  updateItem(id: string, itemId: string, data: Partial<Omit<ApiItem, 'id' | 'createdAt' | 'updatedAt'>>): ApiItem | undefined {
    const instance = this.instances.get(id);
    if (!instance) return undefined;

    const item = instance.items.get(itemId);
    if (!item) return undefined;

    const updatedItem: ApiItem = {
      ...item,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    instance.items.set(itemId, updatedItem);
    return updatedItem;
  }

  deleteItem(id: string, itemId: string): boolean {
    const instance = this.instances.get(id);
    if (!instance) return false;
    return instance.items.delete(itemId);
  }
}

export const apiStore = new ApiStore(); 