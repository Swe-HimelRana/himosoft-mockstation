import fs from 'fs/promises'
import path from 'path'

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data')
const dbPath = path.join(dataDir, 'api.json')

// Types
export interface DbSchema {
  items: Record<string, ApiItem>;
  instances: Record<string, ApiInstance>;
  logs: Record<string, WebhookLog[]>;
}

export interface ApiItem {
  id: string;
  name: string;
  description: string;
  endpoints: ApiEndpoint[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiEndpoint {
  path: string;
  method: string;
  response: {
    status: number;
    body: any;
  };
}

export interface ApiInstance {
  id: string;
  apiId: string;
  name: string;
  description: string;
  apiKey: string;
  lastAccessedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookLog {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  headers: Record<string, string>;
  body: any;
  response: {
    status: number;
    body: any;
  };
}

// Initialize database
async function initDb() {
  try {
    await fs.mkdir(dataDir, { recursive: true })
    try {
      await fs.access(dbPath)
    } catch {
      // File doesn't exist, create it with empty data
      await fs.writeFile(dbPath, JSON.stringify({ items: {}, instances: {}, logs: {} }, null, 2))
    }
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}

// Initialize database on module load
initDb().catch(console.error)

// Database operations
export const apiDb = {
  read: async () => {
    try {
      const data = await fs.readFile(dbPath, 'utf-8')
      return JSON.parse(data) as DbSchema
    } catch (error) {
      console.error('Error reading database:', error)
      return { items: {}, instances: {}, logs: {} } as DbSchema
    }
  },

  write: async (data: DbSchema) => {
    try {
      await fs.writeFile(dbPath, JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('Error writing to database:', error)
      throw error
    }
  }
} 