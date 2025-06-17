import { apiStore } from './api-store'

export async function validateApiKey(id: string, apiKey: string): Promise<boolean> {
  const isValid = await apiStore.validateApiKey(id, apiKey)
  console.log('API key validation result:', { id, apiKey, isValid })
  return isValid
} 