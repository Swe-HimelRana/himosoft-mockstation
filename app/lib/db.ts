import fs from 'fs/promises'
import path from 'path'

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data')
const dbPath = path.join(dataDir, 'api.json')

// Types
export interface DbSchema {
  items: Record<string, any>
  instances: Record<string, any>
  logs: Record<string, any[]>
}

// Initialize database
async function initializeDb() {
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
initializeDb().catch(console.error)

// Database operations
export const apiDb = {
  read: async () => {
    try {
      const data = await fs.readFile(dbPath, 'utf-8')
      return JSON.parse(data) as DbSchema
    } catch (error) {
      console.error('Error reading database:', error)
      throw error
    }
  },

  write: async (data: DbSchema) => {
    try {
      await fs.writeFile(dbPath, JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('Error writing to database:', error)
      throw error
    }
  },

  get: async (key: string) => {
    const data = await apiDb.read()
    return data[key as keyof DbSchema]
  },

  set: async (key: string, value: any) => {
    const data = await apiDb.read()
    data[key as keyof DbSchema] = value
    await apiDb.write(data)
  }
} 